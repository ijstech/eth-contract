"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERC20 = void 0;
const eth_contract_1 = require("@ijstech/eth-contract");
const ERC20_json_1 = __importDefault(require("./ERC20.json"));
class ERC20 extends eth_contract_1.Contract {
    constructor(wallet, address) {
        super(wallet, address, ERC20_json_1.default.abi, ERC20_json_1.default.bytecode);
        this.assign();
    }
    deploy(params) {
        return this.__deploy([params.name, params.symbol, params.minter, this.utils.toString(params.cap)]);
    }
    parseApprovalEvent(receipt) {
        return this.parseEvents(receipt, "Approval").map(e => this.decodeApprovalEvent(e));
    }
    decodeApprovalEvent(event) {
        let result = event.data;
        return {
            owner: result.owner,
            spender: result.spender,
            value: new eth_contract_1.BigNumber(result.value),
            _event: event
        };
    }
    parseTransferEvent(receipt) {
        return this.parseEvents(receipt, "Transfer").map(e => this.decodeTransferEvent(e));
    }
    decodeTransferEvent(event) {
        let result = event.data;
        return {
            from: result.from,
            to: result.to,
            value: new eth_contract_1.BigNumber(result.value),
            _event: event
        };
    }
    async allowance(params) {
        let result = await this.call('allowance', [params.param1, params.param2]);
        return new eth_contract_1.BigNumber(result);
    }
    async approve_send(params) {
        let result = await this.send('approve', [params.spender, this.utils.toString(params.amount)]);
        return result;
    }
    async approve_call(params) {
        let result = await this.call('approve', [params.spender, this.utils.toString(params.amount)]);
        return;
    }
    async balanceOf(param1) {
        let result = await this.call('balanceOf', [param1]);
        return new eth_contract_1.BigNumber(result);
    }
    async cap() {
        let result = await this.call('cap');
        return new eth_contract_1.BigNumber(result);
    }
    async decimals() {
        let result = await this.call('decimals');
        return new eth_contract_1.BigNumber(result);
    }
    async mint_send(params) {
        let result = await this.send('mint', [params.address, this.utils.toString(params.amount)]);
        return result;
    }
    async mint_call(params) {
        let result = await this.call('mint', [params.address, this.utils.toString(params.amount)]);
        return;
    }
    async minter() {
        let result = await this.call('minter');
        return result;
    }
    async name() {
        let result = await this.call('name');
        return result;
    }
    async symbol() {
        let result = await this.call('symbol');
        return result;
    }
    async totalSupply() {
        let result = await this.call('totalSupply');
        return new eth_contract_1.BigNumber(result);
    }
    async transfer_send(params) {
        let result = await this.send('transfer', [params.address, this.utils.toString(params.amount)]);
        return result;
    }
    async transfer_call(params) {
        let result = await this.call('transfer', [params.address, this.utils.toString(params.amount)]);
        return;
    }
    async transferFrom_send(params) {
        let result = await this.send('transferFrom', [params.from, params.to, this.utils.toString(params.amount)]);
        return result;
    }
    async transferFrom_call(params) {
        let result = await this.call('transferFrom', [params.from, params.to, this.utils.toString(params.amount)]);
        return;
    }
    assign() {
        this.approve = Object.assign(this.approve_send, { call: this.approve_call });
        this.mint = Object.assign(this.mint_send, { call: this.mint_call });
        this.transfer = Object.assign(this.transfer_send, { call: this.transfer_call });
        this.transferFrom = Object.assign(this.transferFrom_send, { call: this.transferFrom_call });
    }
}
exports.ERC20 = ERC20;
