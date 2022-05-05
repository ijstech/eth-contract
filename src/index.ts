import {BigNumber} from "bignumber.js";
export {BigNumber};
export interface IWalletUtils{    
    fromWei(value: any, unit?: string): string;
    hexToUtf8(value: string): string;
    toUtf8(value: any): string;		
    toWei(value: string, unit?: string): string;
    sha3(string): string;
};
export interface IWallet {		
    address: string;
    balance: Promise<BigNumber>;
    decode(abi:any, event:Log|EventLog, raw?:{data: string,topics: string[]}): Event;
    decodeLog(inputs: any, hexString: string, topics: any): any;
    send(to: string, amount: number): Promise<TransactionReceipt>;
    scanEvents(fromBlock: number, toBlock: number | string, topics?: any, events?: any, address?: string|string[]): Promise<Event[]>;
    utils: IWalletUtils;

    getChainId(): Promise<number>;
    registerEvent(eventMap:{[topics:string]:any}, address: string, handler: any);
    blockGasLimit(): Promise<number>;
    getGasPrice(): Promise<BigNumber>;
    transactionCount(): Promise<number>;
    sendTransaction(transaction: Transaction): Promise<TransactionReceipt>;
    sendSignedTransaction(signedTransaction: string): Promise<TransactionReceipt>;
    getTransactionReceipt(transactionHash: string): Promise<TransactionReceipt>;
    newContract(abi:any, address?:string): IContract;
    decodeErrorMessage(msg: string): any;
};
export interface IContractMethod {
    call: any;
    estimateGas(...params:any[]): Promise<number>;
    encodeABI(): string;
}
export interface IContract {
    deploy(params: {data: string, arguments?: any[]}): IContractMethod;
    methods: {[methodName: string]: (...params:any[]) => IContractMethod};
}
export interface Event{
    name: string;
    address: string;
    blockNumber: number;
    logIndex: number;
    topics: string[];
    transactionHash: string;
    transactionIndex: number;        
    data: any;
    rawData: any;
}
export interface Log {
    address: string;
    data: string;
    topics: Array <string>;
    logIndex: number;
    transactionHash?: string;
    transactionIndex: number;
    blockHash?: string;
    type?: string;
    blockNumber: number;
}
export interface EventLog {
    event: string
    address: string
    returnValues: any
    logIndex: number
    transactionIndex: number
    transactionHash: string
    blockHash: string
    blockNumber: number
    raw ? : {
        data: string,
        topics: string[]
    }
}
export interface TransactionReceipt {
    transactionHash: string;
    transactionIndex: number;
    blockHash: string;
    blockNumber: number;
    from: string;
    to: string;
    contractAddress?: string;
    cumulativeGasUsed: number;
    gasUsed: number;
    logs ? : Array <Log>;
    events ? : {
        [eventName: string]: EventLog | EventLog[]
    };
    status: boolean;
}
export interface Transaction{
    to: string;
    gas: number,
    data: string;
}
export interface EventType{
    name: string
}
type stringArray = string | _stringArray;
interface _stringArray extends Array<stringArray>{}
export class Utils {
    private wallet: IWallet;
    static nullAddress = "0x0000000000000000000000000000000000000000";
    constructor(wallet: IWallet){
        this.wallet = wallet;
    };
    asciiToHex(str: string): string{
        if(!str)
            return "0x00";
        var hex = "";
        for(var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i);
            var n = code.toString(16);
            hex += n.length < 2 ? '0' + n : n;
        };
        return "0x" + hex;
    };
    sleep(millisecond: number){
        return new Promise(function(resolve){
            setTimeout(function(){
                resolve(null);
            },millisecond);
        });
    };
    numberToBytes32(value: number|BigNumber, prefix?:boolean) {
        let v = new BigNumber(value).toString(16)
        v = v.replace("0x", "");
        v = this.padLeft(v, 64);
        if (prefix)
            v = '0x' + v
        return v;
    };
    padLeft(string: string, chars: number, sign?: string): string{
        return new Array(chars - string.length + 1).join(sign ? sign : "0") + string;
    };
    padRight(string: string, chars: number, sign?: string): string{
        return string + new Array(chars - string.length + 1).join(sign ? sign : "0");
    };
    stringToBytes32(value: string|stringArray): string|string[]{
        if (Array.isArray(value)){
            let result = [];
            for (let i = 0; i < value.length; i ++){
                result.push(this.stringToBytes32(value[i]));
            }
            return result;
        }
        else{
            if (value.length == 66 && value.startsWith('0x'))
                return value;
            return this.padRight(this.asciiToHex(value),64)
        }
    }
    stringToBytes(value: string|stringArray, nByte?: number): string|string[]{
        if (Array.isArray(value)){
            let result = [];
            for (let i = 0; i < value.length; i ++){
                result.push(this.stringToBytes(value[i]));
            }
            return result;
        }
        else{
            if (nByte){
                if (new RegExp(`^0x[0-9a-fA-F]{${2*nByte}}$`).test(value))
                    return value;
                else if (/^0x([0-9a-fA-F][0-9a-fA-F])*$/.test(value)) {
                    if (value.length >= ((nByte*2) + 2))
                        return value;
                    else
                        return "0x" + value.substring(2) + "00".repeat(nByte-((value.length-2)/2));
                } else if (/^([0-9a-fA-F][0-9a-fA-F])+$/.test(value)) {
                    if (value.length >= (nByte*2))
                        return value;
                    else 
                        return "0x" + value + "00".repeat(nByte-(value.length/2));
                } else
                    return this.padRight(this.asciiToHex(value), nByte*2)
            } else {
                if (/^0x([0-9a-fA-F][0-9a-fA-F])*$/.test(value))
                    return value;
                else if (/^([0-9a-fA-F][0-9a-fA-F])+$/.test(value))
                    return "0x" + value;
                else
                    return this.asciiToHex(value)
            }
        }
    }
    addressToBytes32(value: string, prefix?: boolean): string{
        let v = value
        v = v.replace("0x", "");
        v = this.padLeft(v, 64);
        if (prefix)
            v = '0x' + v;
        return v;
    };
    bytes32ToAddress(value: string): string{
        return '0x' + value.replace('0x000000000000000000000000','');
    };
    bytes32ToString(value: string): string{
        return this.wallet.utils.hexToUtf8(value);
    };
    addressToBytes32Right(value: string, prefix?: boolean): string{
        let v = value
        v = v.replace("0x", "");
        v = this.padRight(v, 64);
        if (prefix)
            v = '0x' + v;
        return v;
    };
    toNumber(value: string|number|BigNumber): number{
        if (typeof(value) == 'number')
            return value
        else if (typeof(value) == 'string')
            return new BigNumber(value).toNumber()
        else
            return value.toNumber()
    };
    toDecimals(value: BigNumber|number|string, decimals?: number): BigNumber{    
        decimals = decimals || 18;
        return new BigNumber(value).shiftedBy(decimals);
    };
    fromDecimals(value: BigNumber|number|string, decimals?: number): BigNumber{
        decimals = decimals || 18;
        return new BigNumber(value).shiftedBy(-decimals);
    };
    toString(value:any){
        if (Array.isArray(value)){
            let result = [];
            for (let i = 0; i < value.length; i ++){
                result.push(this.toString(value[i]));
            }
            return result;
        }
        else if (typeof value === "number")
            return value.toString(10);
        else if (BigNumber.isBigNumber(value))
            return value.toFixed();
        else
            return value;
    };
}
export {Contract} from "./contract";
