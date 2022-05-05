import { IWallet, TransactionReceipt, Event, BigNumber, Contract } from "@ijstech/eth-contract";
export declare class ERC20 extends Contract {
    constructor(wallet: IWallet, address?: string);
    deploy(params: {
        name: string;
        symbol: string;
        minter: string;
        cap: number | BigNumber;
    }): Promise<string>;
    parseApprovalEvent(receipt: TransactionReceipt): ERC20.ApprovalEvent[];
    decodeApprovalEvent(event: Event): ERC20.ApprovalEvent;
    parseTransferEvent(receipt: TransactionReceipt): ERC20.TransferEvent[];
    decodeTransferEvent(event: Event): ERC20.TransferEvent;
    allowance(params: {
        param1: string;
        param2: string;
    }): Promise<BigNumber>;
    approve_send(params: {
        spender: string;
        amount: number | BigNumber;
    }): Promise<TransactionReceipt>;
    approve_call(params: {
        spender: string;
        amount: number | BigNumber;
    }): Promise<void>;
    approve: {
        (params: {
            spender: string;
            amount: number | BigNumber;
        }): Promise<TransactionReceipt>;
        call: (params: {
            spender: string;
            amount: number | BigNumber;
        }) => Promise<void>;
    };
    balanceOf(param1: string): Promise<BigNumber>;
    cap(): Promise<BigNumber>;
    decimals(): Promise<BigNumber>;
    mint_send(params: {
        address: string;
        amount: number | BigNumber;
    }): Promise<TransactionReceipt>;
    mint_call(params: {
        address: string;
        amount: number | BigNumber;
    }): Promise<void>;
    mint: {
        (params: {
            address: string;
            amount: number | BigNumber;
        }): Promise<TransactionReceipt>;
        call: (params: {
            address: string;
            amount: number | BigNumber;
        }) => Promise<void>;
    };
    minter(): Promise<string>;
    name(): Promise<string>;
    symbol(): Promise<string>;
    totalSupply(): Promise<BigNumber>;
    transfer_send(params: {
        address: string;
        amount: number | BigNumber;
    }): Promise<TransactionReceipt>;
    transfer_call(params: {
        address: string;
        amount: number | BigNumber;
    }): Promise<void>;
    transfer: {
        (params: {
            address: string;
            amount: number | BigNumber;
        }): Promise<TransactionReceipt>;
        call: (params: {
            address: string;
            amount: number | BigNumber;
        }) => Promise<void>;
    };
    transferFrom_send(params: {
        from: string;
        to: string;
        amount: number | BigNumber;
    }): Promise<TransactionReceipt>;
    transferFrom_call(params: {
        from: string;
        to: string;
        amount: number | BigNumber;
    }): Promise<void>;
    transferFrom: {
        (params: {
            from: string;
            to: string;
            amount: number | BigNumber;
        }): Promise<TransactionReceipt>;
        call: (params: {
            from: string;
            to: string;
            amount: number | BigNumber;
        }) => Promise<void>;
    };
    private assign;
}
export declare module ERC20 {
    interface ApprovalEvent {
        owner: string;
        spender: string;
        value: BigNumber;
        _event: Event;
    }
    interface TransferEvent {
        from: string;
        to: string;
        value: BigNumber;
        _event: Event;
    }
}
