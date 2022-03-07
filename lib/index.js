define("index", ["require", "exports", "bignumber.js"], function (require, exports, bignumber_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TAuthContract = exports.Contract = exports.BigNumber = void 0;
    Object.defineProperty(exports, "BigNumber", { enumerable: true, get: function () { return bignumber_js_1.BigNumber; } });
    ;
    ;
    class Contract {
        constructor(wallet, address, abi, bytecode) {
            this.wallet = wallet;
            if (typeof (abi) == 'string')
                this._abi = JSON.parse(abi);
            else
                this._abi = abi;
            this._bytecode = bytecode;
            let self = this;
            if (address)
                this._address = address;
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
        methodsToUtf8(...args) {
            let self = this;
            return new Promise(async function (resolve, reject) {
                let result = await self.methods.apply(self, args);
                resolve(self.wallet.utils.toUtf8(result));
            });
        }
        methodsToUtf8Array(...args) {
            let self = this;
            return new Promise(async function (resolve, reject) {
                let result = await self.methods.apply(self, args);
                let arr = [];
                for (let i = 0; i < result.length; i++) {
                    arr.push(self.wallet.utils.toUtf8(result[i]));
                }
                resolve(arr);
            });
        }
        methodsFromWeiArray(...args) {
            let self = this;
            return new Promise(async function (resolve, reject) {
                let result = await self.methods.apply(self, args);
                let arr = [];
                for (let i = 0; i < result.length; i++) {
                    arr.push(new bignumber_js_1.BigNumber(self.wallet.utils.fromWei(result[i])));
                }
                resolve(arr);
            });
        }
        methodsFromWei(...args) {
            let self = this;
            return new Promise(async function (resolve, reject) {
                let result = await self.methods.apply(self, args);
                return resolve(new bignumber_js_1.BigNumber(self.wallet.utils.fromWei(result)));
            });
        }
        methods(...args) {
            args.unshift(this._address);
            args.unshift(this._abi);
            return this.wallet.methods.apply(this.wallet, args);
        }
        getAbiTopics(eventNames) {
            return this.wallet.getAbiTopics(this._abi, eventNames);
        }
        getAbiEvents() {
            if (!this._events)
                this._events = this.wallet.getAbiEvents(this._abi);
            return this._events;
        }
        scanEvents(fromBlock, toBlock, eventNames) {
            let topics = this.getAbiTopics(eventNames);
            let events = this.getAbiEvents();
            return this.wallet.scanEvents(fromBlock, toBlock, topics, events, this._address);
        }
        ;
        async _deploy(...args) {
            if (typeof (args[args.length - 1]) == 'undefined')
                args.pop();
            args.unshift(this._bytecode);
            args.unshift('deploy');
            args.unshift(null);
            args.unshift(this._abi);
            this._address = await this.wallet.methods.apply(this.wallet, args);
            return this._address;
        }
        ;
    }
    exports.Contract = Contract;
    ;
    class TAuthContract extends Contract {
        rely(address) {
            return this.methods('rely', address);
        }
        deny(address) {
            return this.methods('deny', address);
        }
    }
    exports.TAuthContract = TAuthContract;
    ;
});
