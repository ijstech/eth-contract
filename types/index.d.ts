import { BigNumber } from "bignumber.js";
export { BigNumber };
export interface IWalletUtils {
    fromWei(value: any, unit?: string): string;
    hexToUtf8(value: string): string;
    toUtf8(value: any): string;
    toWei(value: string, unit?: string): string;
    sha3(string: any): string;
}
export interface IWallet {
    address: string;
    balance: Promise<BigNumber>;
    decode(abi: any, event: Log | EventLog, raw?: {
        data: string;
        topics: string[];
    }): Event;
    decodeLog(inputs: any, hexString: string, topics: any): any;
    send(to: string, amount: number): Promise<TransactionReceipt>;
    scanEvents(fromBlock: number, toBlock: number | string, topics?: any, events?: any, address?: string | string[]): Promise<Event[]>;
    utils: IWalletUtils;
    getChainId(): Promise<number>;
    registerEvent(eventMap: {
        [topics: string]: any;
    }, address: string, handler: any): any;
    blockGasLimit(): Promise<number>;
    getGasPrice(): Promise<BigNumber>;
    transactionCount(): Promise<number>;
    sendTransaction(transaction: Transaction): Promise<TransactionReceipt>;
    sendSignedTransaction(signedTransaction: string): Promise<TransactionReceipt>;
    getTransactionReceipt(transactionHash: string): Promise<TransactionReceipt>;
    newContract(abi: any, address?: string): IContract;
    decodeErrorMessage(msg: string): any;
}
export interface IContractMethod {
    call: any;
    estimateGas(...params: any[]): Promise<number>;
    encodeABI(): string;
}
export interface IContract {
    deploy(params: {
        data: string;
        arguments?: any[];
    }): IContractMethod;
    methods: {
        [methodName: string]: (...params: any[]) => IContractMethod;
    };
}
export interface Event {
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
    topics: Array<string>;
    logIndex: number;
    transactionHash?: string;
    transactionIndex: number;
    blockHash?: string;
    type?: string;
    blockNumber: number;
}
export interface EventLog {
    event: string;
    address: string;
    returnValues: any;
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    raw?: {
        data: string;
        topics: string[];
    };
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
    logs?: Array<Log>;
    events?: {
        [eventName: string]: EventLog | EventLog[];
    };
    status: boolean;
}
export interface Transaction {
    to: string;
    gas: number;
    data: string;
}
export interface EventType {
    name: string;
}
declare type stringArray = string | _stringArray;
interface _stringArray extends Array<stringArray> {
}
export declare class Utils {
    private wallet;
    static nullAddress: string;
    constructor(wallet: IWallet);
    asciiToHex(str: string): string;
    sleep(millisecond: number): Promise<unknown>;
    numberToBytes32(value: number | BigNumber, prefix?: boolean): string;
    padLeft(string: string, chars: number, sign?: string): string;
    padRight(string: string, chars: number, sign?: string): string;
    stringToBytes32(value: string | stringArray): string | string[];
    stringToBytes(value: string | stringArray, nByte?: number): string | string[];
    addressToBytes32(value: string, prefix?: boolean): string;
    bytes32ToAddress(value: string): string;
    bytes32ToString(value: string): string;
    addressToBytes32Right(value: string, prefix?: boolean): string;
    toNumber(value: string | number | BigNumber): number;
    toDecimals(value: BigNumber | number | string, decimals?: number): BigNumber;
    fromDecimals(value: BigNumber | number | string, decimals?: number): BigNumber;
    toString(value: any): any;
}
export { Contract } from "./contract";
