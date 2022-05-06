import { IWallet, BigNumber } from '@ijstech/eth-contract';
import { ERC20 } from "../contracts";
export declare class Erc20 {
    private _wallet;
    private _decimals;
    _erc20: ERC20;
    private _utils;
    constructor(wallet: IWallet, address?: string, decimals?: number);
    deploy(params: {
        name: string;
        symbol: string;
        minter?: string;
        cap?: number | BigNumber;
    }): Promise<string>;
    allowance(params: {
        owner: string;
        spender: string;
    }): Promise<BigNumber>;
    approve(params: {
        spender: string;
        amount: number | BigNumber;
    }): Promise<ERC20.ApprovalEvent>;
    get balance(): Promise<BigNumber>;
    balanceOf(address: string): Promise<BigNumber>;
    get cap(): Promise<BigNumber>;
    get decimals(): Promise<number>;
    mint(params: {
        address: string;
        amount: number | BigNumber;
    }): Promise<ERC20.TransferEvent>;
    minter(): Promise<string>;
    get name(): Promise<string>;
    get symbol(): Promise<string>;
    get totalSupply(): Promise<BigNumber>;
    transfer(params: {
        address: string;
        amount: number | BigNumber;
    }): Promise<ERC20.TransferEvent>;
}
