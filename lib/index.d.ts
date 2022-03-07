declare module "index" {
    import { BigNumber } from "bignumber.js";
    export interface IWalletUtils {
        fromWei(value: any, unit?: string): string;
        toUtf8(value: any): string;
        toWei(value: string, unit?: string): string;
    }
    export interface IWallet {
        address: string;
        balance: Promise<BigNumber>;
        decode(abi: any, event: Log | EventLog, raw?: {
            data: string;
            topics: string[];
        }): Event;
        decodeLog(inputs: any, hexString: string, topics: any): any;
        getAbiEvents(abi: any[]): any;
        getAbiTopics(abi: any[], eventNames: string[]): any[];
        methods(...args: any): Promise<any>;
        send(to: string, amount: number): Promise<TransactionReceipt>;
        scanEvents(fromBlock: number, toBlock: number | string, topics?: any, events?: any, address?: string | string[]): Promise<Event[]>;
        utils: IWalletUtils;
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
        contractAddress: string;
        cumulativeGasUsed: number;
        gasUsed: number;
        logs?: Array<Log>;
        events?: {
            [eventName: string]: EventLog | EventLog[];
        };
        status: string;
    }
    export interface Transaction {
        to: string;
        gas: number;
        data: string;
    }
    export interface EventType {
        name: string;
    }
    export class Contract {
        wallet: IWallet;
        _abi: any;
        _bytecode: any;
        _address: string;
        private _events;
        privateKey: string;
        constructor(wallet: IWallet, address?: string, abi?: any, bytecode?: any);
        at(address: string): Contract;
        set address(value: string);
        get address(): string;
        protected decodeEvents(receipt: TransactionReceipt): any[];
        protected parseEvents(receipt: TransactionReceipt, eventName: string): Event[];
        get events(): EventType[];
        protected methodsToUtf8(...args: any[]): Promise<string>;
        protected methodsToUtf8Array(...args: any[]): Promise<string[]>;
        protected methodsFromWeiArray(...args: any[]): Promise<BigNumber[]>;
        protected methodsFromWei(...args: any[]): Promise<BigNumber>;
        protected methods(...args: any[]): Promise<any>;
        protected getAbiTopics(eventNames?: string[]): any[];
        protected getAbiEvents(): any;
        scanEvents(fromBlock: number, toBlock: number | string, eventNames?: string[]): Promise<Event[]>;
        _deploy(...args: any[]): Promise<string>;
    }
    export class TAuthContract extends Contract {
        rely(address: string): Promise<any>;
        deny(address: string): Promise<any>;
    }
}
