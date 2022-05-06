import {IWallet, Transaction, TransactionReceipt, Event, BigNumber, Contract, Utils} from "@ijstech/eth-contract";
import Bin from "./ERC20.json";

export class ERC20 extends Contract{
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(params:{name:string,symbol:string,minter:string,cap:number|BigNumber}): Promise<string>{
        return this._deploy([params.name,params.symbol,params.minter,this.utils.toString(params.cap)]);
    }
    parseApprovalEvent(receipt: TransactionReceipt): ERC20.ApprovalEvent[]{
        return this.parseEvents(receipt, "Approval").map(e=>this.decodeApprovalEvent(e));
    }
    decodeApprovalEvent(event: Event): ERC20.ApprovalEvent{
        let result = event.data;
        return {
            owner: result.owner,
            spender: result.spender,
            value: new BigNumber(result.value),
            _event: event
        };
    }
    parseTransferEvent(receipt: TransactionReceipt): ERC20.TransferEvent[]{
        return this.parseEvents(receipt, "Transfer").map(e=>this.decodeTransferEvent(e));
    }
    decodeTransferEvent(event: Event): ERC20.TransferEvent{
        let result = event.data;
        return {
            from: result.from,
            to: result.to,
            value: new BigNumber(result.value),
            _event: event
        };
    }
    async allowance(params:{param1:string,param2:string}): Promise<BigNumber>{
        let result = await this.call('allowance',[params.param1,params.param2]);
        return new BigNumber(result);
    }
    async approve_send(params:{spender:string,amount:number|BigNumber}): Promise<TransactionReceipt>{
        let result = await this.send('approve',[params.spender,this.utils.toString(params.amount)]);
        return result;
    }
    async approve_call(params:{spender:string,amount:number|BigNumber}): Promise<void>{
        let result = await this.call('approve',[params.spender,this.utils.toString(params.amount)]);
        return;
    }
    approve: {
        (params:{spender:string,amount:number|BigNumber}): Promise<TransactionReceipt>;
        call: (params:{spender:string,amount:number|BigNumber}) => Promise<void>;
    }
    async balanceOf(param1:string): Promise<BigNumber>{
        let result = await this.call('balanceOf',[param1]);
        return new BigNumber(result);
    }
    async cap(): Promise<BigNumber>{
        let result = await this.call('cap');
        return new BigNumber(result);
    }
    async decimals(): Promise<BigNumber>{
        let result = await this.call('decimals');
        return new BigNumber(result);
    }
    async mint_send(params:{address:string,amount:number|BigNumber}): Promise<TransactionReceipt>{
        let result = await this.send('mint',[params.address,this.utils.toString(params.amount)]);
        return result;
    }
    async mint_call(params:{address:string,amount:number|BigNumber}): Promise<void>{
        let result = await this.call('mint',[params.address,this.utils.toString(params.amount)]);
        return;
    }
    mint: {
        (params:{address:string,amount:number|BigNumber}): Promise<TransactionReceipt>;
        call: (params:{address:string,amount:number|BigNumber}) => Promise<void>;
    }
    async minter(): Promise<string>{
        let result = await this.call('minter');
        return result;
    }
    async name(): Promise<string>{
        let result = await this.call('name');
        return result;
    }
    async symbol(): Promise<string>{
        let result = await this.call('symbol');
        return result;
    }
    async totalSupply(): Promise<BigNumber>{
        let result = await this.call('totalSupply');
        return new BigNumber(result);
    }
    async transfer_send(params:{address:string,amount:number|BigNumber}): Promise<TransactionReceipt>{
        let result = await this.send('transfer',[params.address,this.utils.toString(params.amount)]);
        return result;
    }
    async transfer_call(params:{address:string,amount:number|BigNumber}): Promise<void>{
        let result = await this.call('transfer',[params.address,this.utils.toString(params.amount)]);
        return;
    }
    transfer: {
        (params:{address:string,amount:number|BigNumber}): Promise<TransactionReceipt>;
        call: (params:{address:string,amount:number|BigNumber}) => Promise<void>;
    }
    async transferFrom_send(params:{from:string,to:string,amount:number|BigNumber}): Promise<TransactionReceipt>{
        let result = await this.send('transferFrom',[params.from,params.to,this.utils.toString(params.amount)]);
        return result;
    }
    async transferFrom_call(params:{from:string,to:string,amount:number|BigNumber}): Promise<void>{
        let result = await this.call('transferFrom',[params.from,params.to,this.utils.toString(params.amount)]);
        return;
    }
    transferFrom: {
        (params:{from:string,to:string,amount:number|BigNumber}): Promise<TransactionReceipt>;
        call: (params:{from:string,to:string,amount:number|BigNumber}) => Promise<void>;
    }
    private assign(){
        this.approve = Object.assign(this.approve_send, {call:this.approve_call});
        this.mint = Object.assign(this.mint_send, {call:this.mint_call});
        this.transfer = Object.assign(this.transfer_send, {call:this.transfer_call});
        this.transferFrom = Object.assign(this.transferFrom_send, {call:this.transferFrom_call});
    }
}
export module ERC20{
    export interface ApprovalEvent {owner:string,spender:string,value:BigNumber,_event:Event}
    export interface TransferEvent {from:string,to:string,value:BigNumber,_event:Event}
}