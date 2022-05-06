"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Erc20 = void 0;
const eth_contract_1 = require("@ijstech/eth-contract");
const contracts_1 = require("../contracts");
class Erc20 {
    constructor(wallet, address, decimals) {
        this._wallet = wallet;
        this._decimals = decimals;
        this._erc20 = new contracts_1.ERC20(wallet, address);
        this._utils = new eth_contract_1.Utils(wallet);
    }
    async deploy(params) {
        return this._erc20.deploy({
            name: params.name,
            symbol: params.symbol,
            minter: params.minter || this._wallet.address,
            cap: this._utils.toDecimals(params.cap ? params.cap.toString() : '1000000000')
        });
    }
    async allowance(params) {
        return this._utils.fromDecimals(await this._erc20.allowance({ param1: params.owner, param2: params.spender }), await this.decimals);
    }
    async approve(params) {
        let receipt = await this._erc20.approve({ spender: params.spender, amount: this._utils.toDecimals(params.amount, await this.decimals) });
        let approveEvent = this._erc20.parseApprovalEvent(receipt)[0];
        return approveEvent;
    }
    get balance() {
        return (async () => (await this.balanceOf(this._wallet.address)))();
    }
    async balanceOf(address) {
        return this._utils.fromDecimals(await this._erc20.balanceOf(address), await this.decimals);
    }
    get cap() {
        return (async () => (this._utils.fromDecimals(await this._erc20.cap(), await this.decimals)))();
    }
    get decimals() {
        return (async () => (await this._erc20.decimals()).toNumber())();
    }
    async mint(params) {
        let receipt = await this._erc20.mint({ address: params.address, amount: this._utils.toDecimals(params.amount, await this.decimals) });
        let mintEvent = this._erc20.parseTransferEvent(receipt)[0];
        return mintEvent;
    }
    ;
    minter() {
        return this._erc20.minter();
    }
    get name() {
        return this._erc20.name();
    }
    get symbol() {
        return this._erc20.symbol();
    }
    get totalSupply() {
        return (async () => (this._utils.fromDecimals(await this._erc20.totalSupply(), await this.decimals)))();
    }
    async transfer(params) {
        let receipt = await this._erc20.transfer({ address: params.address, amount: this._utils.toDecimals(params.amount, await this.decimals) });
        let transferEvent = this._erc20.parseTransferEvent(receipt)[0];
        return transferEvent;
    }
}
exports.Erc20 = Erc20;
