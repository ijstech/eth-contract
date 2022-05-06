"use strict";
const _1 = require("./");
var Contract;
(function (Contract_1) {
    class Contract {
        constructor(wallet, address, abi, bytecode) {
            this.wallet = wallet;
            this.utils = new _1.Utils(wallet);
            if (typeof (abi) == 'string')
                this._abi = JSON.parse(abi);
            else
                this._abi = abi;
            this._bytecode = bytecode;
            let self = this;
            if (address)
                this._address = address;
        }
        async getContract() {
            let contract;
            if (this.address) {
                contract = Contract.contracts[(await this.wallet.getChainId()) + ":" + this.address];
                if (!contract) {
                    contract = this.wallet.newContract(this._abi, this.address);
                    Contract.contracts[(await this.wallet.getChainId()) + ":" + this.address] = contract;
                }
            }
            else {
                contract = this.wallet.newContract(this._abi);
            }
            return contract;
        }
        at(address) {
            this._address = address;
            return this;
        }
        set address(value) {
            this._address = value;
        }
        get address() {
            return this._address || '';
        }
        decodeEvents(receipt) {
            let events = this.getAbiEvents();
            let result = [];
            for (let name in receipt.events) {
                let events = (Array.isArray(receipt.events[name]) ? receipt.events[name] : [receipt.events[name]]);
                events.forEach(e => {
                    let data = e.raw;
                    let event = events[data.topics[0]];
                    result.push(Object.assign({ _name: name, _address: this.address }, this.wallet.decodeLog(event.inputs, data.data, data.topics.slice(1))));
                });
            }
            return result;
        }
        parseEvents(receipt, eventName) {
            let eventAbis = this.getAbiEvents();
            let topic0 = this.getAbiTopics([eventName])[0];
            let result = [];
            if (receipt.events) {
                for (let name in receipt.events) {
                    let events = (Array.isArray(receipt.events[name]) ? receipt.events[name] : [receipt.events[name]]);
                    events.forEach(event => {
                        if (topic0 == event.raw.topics[0] && (this.address && this.address == event.address)) {
                            result.push(this.wallet.decode(eventAbis[topic0], event, event.raw));
                        }
                    });
                }
            }
            else if (receipt.logs) {
                for (let i = 0; i < receipt.logs.length; i++) {
                    let log = receipt.logs[i];
                    if (topic0 == log.topics[0] && (this.address && this.address == log.address)) {
                        result.push(this.wallet.decode(eventAbis[topic0], log));
                    }
                }
            }
            return result;
        }
        get events() {
            let result = [];
            for (let i = 0; i < this._abi.length; i++) {
                if (this._abi[i].type == 'event')
                    result.push(this._abi[i]);
            }
            return result;
        }
        getAbiEvents() {
            if (!this._events) {
                this._events = {};
                let events = this._abi.filter(e => e.type == "event");
                for (let i = 0; i < events.length; i++) {
                    let topic = this.wallet.utils.sha3(events[i].name + "(" + events[i].inputs.map(e => e.type == "tuple" ? "(" + (e.components.map(f => f.type)) + ")" : e.type).join(",") + ")");
                    this._events[topic] = events[i];
                }
            }
            return this._events;
        }
        getAbiTopics(eventNames) {
            if (!eventNames || eventNames.length == 0)
                eventNames = null;
            let result = [];
            let events = this.getAbiEvents();
            for (let topic in events) {
                if (!eventNames || eventNames.includes(events[topic].name)) {
                    result.push(topic);
                }
            }
            if (result.length == 0 && eventNames && eventNames.length > 0)
                return ['NULL'];
            return [result];
        }
        registerEvents(handler) {
            if (this._address)
                this.wallet.registerEvent(this.getAbiEvents(), this._address, handler);
        }
        scanEvents(fromBlock, toBlock, eventNames) {
            let topics = this.getAbiTopics(eventNames);
            let events = this.getAbiEvents();
            return this.wallet.scanEvents(fromBlock, toBlock, topics, events, this._address);
        }
        ;
        async call(methodName, params, options) {
            let contract = await this.getContract();
            params = params || [];
            let method = contract.methods[methodName].apply(this, params);
            return method.call(Object.assign({ from: this.address }, options));
        }
        async txObj(methodName, params, options) {
            let contract = await this.getContract();
            params = params || [];
            let methodAbi = this._abi.find(e => methodName ? e.name == methodName : e.type == "constructor");
            if (methodAbi)
                for (let i = 0; i < methodAbi.inputs.length; i++) {
                    if (methodAbi.inputs[i].type.indexOf('bytes') == 0) {
                        params[i] = params[i] || '';
                        if (methodAbi.inputs[i].type.indexOf('[]') > 0) {
                            let a = [];
                            for (let k = 0; k < params[i].length; k++) {
                                let s = params[i][k] || '';
                                if (!params[i][k])
                                    a.push("0x");
                                else
                                    a.push(s);
                            }
                            params[i] = a;
                        }
                        else if (!params[i])
                            params[i] = "0x";
                    }
                    else if (methodAbi.inputs[i].type == 'address') {
                        if (!params[i])
                            params[i] = _1.Utils.nullAddress;
                    }
                }
            let method;
            if (!methodName)
                method = contract.deploy({ data: this._bytecode, arguments: params });
            else
                method = contract.methods[methodName].apply(this, params);
            let tx = {};
            tx.from = this.wallet.address;
            tx.to = this._address;
            tx.data = method.encodeABI();
            if (options && options.value) {
                tx.value = options.value;
            }
            else {
                tx.value = 0;
            }
            if (options && (options.gas || options.gasLimit)) {
                tx.gas = options.gas || options.gasLimit;
            }
            else {
                try {
                    tx.gas = await method.estimateGas({ from: this.wallet.address, to: this.address ? this.address : undefined, value: (options && options.value) || 0 });
                    tx.gas = Math.min(await this.wallet.blockGasLimit(), Math.round(tx.gas * 1.5));
                }
                catch (e) {
                    if (e.message == "Returned error: out of gas") {
                        console.log(e.message);
                        tx.gas = Math.round(await this.wallet.blockGasLimit() * 0.5);
                    }
                    else {
                        try {
                            await method.call(Object.assign({ from: this.address }, options));
                        }
                        catch (e) {
                            if (e.message.includes("VM execution error.")) {
                                var msg = (e.data || e.message).match(/0x[0-9a-fA-F]+/);
                                if (msg && msg.length) {
                                    msg = msg[0];
                                    if (msg.startsWith("0x08c379a")) {
                                        msg = this.wallet.decodeErrorMessage(msg);
                                        throw new Error(msg);
                                    }
                                }
                            }
                        }
                        throw e;
                    }
                }
            }
            if (!tx.gasPrice) {
                tx.gasPrice = await this.wallet.getGasPrice();
            }
            if (options && options.nonce) {
                tx.nonce = options.nonce;
            }
            else {
                tx.nonce = await this.wallet.transactionCount();
            }
            return tx;
        }
        async _send(methodName, params, options) {
            let tx = await this.txObj(methodName, params, options);
            let receipt = await this.wallet.sendTransaction(tx);
            return receipt;
        }
        async _deploy(params, options) {
            let receipt = await this._send('', params, options);
            this.address = receipt.contractAddress;
            return this.address;
        }
        send(methodName, params, options) {
            let receipt = this._send(methodName, params, options);
            return receipt;
        }
    }
    Contract.contracts = {};
    Contract_1.Contract = Contract;
})(Contract || (Contract = {}));
module.exports = Contract;
