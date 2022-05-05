import {IWallet, Transaction, TransactionReceipt, Event, BigNumber, Contract, Utils} from '@ijstech/eth-contract';

import {ERC20} from "../contracts";

export class Erc20 {
    private _wallet: IWallet; 
    private _decimals: number;
    _erc20:ERC20;
    private _utils: Utils;

    constructor(wallet: IWallet, address?: string, decimals?: number){            
        this._wallet = wallet;
        this._decimals = decimals;
        this._erc20 = new ERC20(wallet, address);
        this._utils = new Utils(wallet);
    }
    async deploy(params:{name: string, symbol: string, minter?: string, cap?: number|BigNumber}): Promise<string>{ 
        return this._erc20.deploy({
            name: params.name,
            symbol: params.symbol,
            minter: params.minter || this._wallet.address,
            cap: this._utils.toDecimals(params.cap?params.cap.toString():'1000000000')
        });
    }

    async allowance(params:{owner: string, spender: string}): Promise<BigNumber>{
        return this._utils.fromDecimals(await this._erc20.allowance({param1:params.owner, param2:params.spender}), await this.decimals);   	
    }
    async approve(params:{spender: string, amount: number|BigNumber}): Promise<ERC20.ApprovalEvent>{
        let receipt = await this._erc20.approve({spender:params.spender, amount:this._utils.toDecimals(params.amount, await this.decimals)});
        let approveEvent = this._erc20.parseApprovalEvent(receipt)[0];
        return approveEvent;
    }
    get balance(): Promise<BigNumber>{
        return (async ()=>(await this.balanceOf(this._wallet.address)))();
    }
    async balanceOf(address: string): Promise<BigNumber>{
        return this._utils.fromDecimals(await this._erc20.balanceOf(address), await this.decimals);
    }
    get cap(): Promise<BigNumber>{
        return (async ()=>(this._utils.fromDecimals(await this._erc20.cap(), await this.decimals)))();
    }
    get decimals(): Promise<number>{
        return (async ()=>(await this._erc20.decimals()).toNumber())();
    }        
    async mint(params:{address: string, amount: number|BigNumber}): Promise<ERC20.TransferEvent>{
        let receipt = await this._erc20.mint({address:params.address, amount:this._utils.toDecimals(params.amount, await this.decimals)});
        let mintEvent = this._erc20.parseTransferEvent(receipt)[0];
        return mintEvent;
    };
    minter(): Promise<string>{
        return this._erc20.minter();
    }
    get name(): Promise<string>{
        return this._erc20.name();
    }
    get symbol(): Promise<string>{            
        return this._erc20.symbol();
    }
    get totalSupply(): Promise<BigNumber>{
        return (async ()=>(this._utils.fromDecimals(await this._erc20.totalSupply(), await this.decimals)))();
    }
    async transfer(params:{address: string, amount: number | BigNumber}): Promise<ERC20.TransferEvent>{
        let receipt = await this._erc20.transfer({address:params.address, amount:this._utils.toDecimals(params.amount, await this.decimals)});
        let transferEvent = this._erc20.parseTransferEvent(receipt)[0];
        return transferEvent;
    }
}