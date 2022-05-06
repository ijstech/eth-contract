import 'mocha';
import Ganache from "ganache-cli";

import {Wallet} from "@ijstech/eth-wallet";

import {Erc20} from "../src/wrapper/erc20";

describe('##Contracts', function() {
    it('erc20', async function() {
        let provider = Ganache.provider();
        let wallet = new Wallet(provider);
        let accounts = await wallet.accounts;
        console.log(accounts);

        wallet.defaultAccount = accounts[0];

        let erc20 = new Erc20(wallet);
        let address = await erc20.deploy({name:"ERC20", symbol:"ERC20"});
        console.log(address);
        await erc20.mint({address:accounts[1], amount:1000});
        console.log((await erc20.balanceOf(accounts[1])).toNumber());

        wallet.defaultAccount = accounts[1];
        await erc20.transfer({address:accounts[2], amount:400});

        wallet.defaultAccount = accounts[2];
        console.log((await erc20.balance).toNumber());
    });
});