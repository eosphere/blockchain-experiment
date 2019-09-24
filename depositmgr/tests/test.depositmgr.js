/* eslint-disable prettier/prettier */
const assert = require('assert');
const eoslime = require('eoslime').init('local');

const DEPOSITMGR_WASM_PATH = '../depositmgr/depositmgr/depositmgr.wasm';
const DEPOSITMGR_ABI_PATH = '../depositmgr/depositmgr/depositmgr.abi';
const TOKEN_WASM_PATH = '../depositmgr/token/token.wasm';
const TOKEN_ABI_PATH = '../depositmgr/token/token.abi'

async function printConfig (contract) {
    console.log();
    console.log ("Here is the contract configuration.")
    let configTable = await contract.provider.eos.getTableRows({
        code: contract.name,
        scope: contract.name,
        table: 'configs',
        json: true
    });
    console.log (JSON.stringify(configTable.rows[0]));
    console.log ();
    return configTable.rows[0];
}

async function printContractBalance (contract, account) {
    console.log();
    console.log ("Here is the contract balance for ", account.name );
    let balanceTable = await contract.provider.eos.getTableRows({
        code: contract.name,
        scope: account.name,
        table: 'balances',
        json: true
    });
    console.log (JSON.stringify(balanceTable.rows[0]));
    console.log ();
    return balanceTable.rows[0];
}

async function printTokenBalance (contract, account) {
    console.log();
    console.log ("Here is the token balance for ", account.name );
    let balanceTable = await contract.provider.eos.getTableRows({
        code: contract.name,
        scope: account.name,
        table: 'accounts',
        json: true
    });
    console.log (JSON.stringify(balanceTable.rows[0]));
    console.log ();
    return balanceTable.rows[0];
}


describe('depositmgr Testing', function () {

    // Increase mocha(testing framework) time, otherwise tests fails
    this.timeout(150000);

    let depositmgrContract, tokenContract;
    let depositmgrAccount, tokenAccount;
    let ticketBuyer1, ticketBuyer2, ticketBuyer3, ticketBuyer4, ticketBuyer5;
    let numberSelector;
    let accounts;
    let config;

    before(async () => {

        accounts = await eoslime.Account.createRandoms(20);
        depositmgrAccount          = accounts[0];
        tokenAccount               = accounts[1];
        numberSelector             = accounts[2];
        
        ticketBuyer1               = accounts[4];
        ticketBuyer2               = accounts[5];
        ticketBuyer3               = accounts[6];
        ticketBuyer4               = accounts[7];
        ticketBuyer5               = accounts[8];
       
        console.log (" depositmgr Account   : ", depositmgrAccount.name);
        console.log (" tokenAccount         : ", tokenAccount.name);
        console.log (" numberSelector       : ", numberSelector.name);
        console.log (" ticketBuyer1         : ", ticketBuyer1.name);
        console.log (" ticketBuyer2         : ", ticketBuyer2.name);
        console.log (" ticketBuyer3         : ", ticketBuyer3.name);
        console.log (" ticketBuyer4         : ", ticketBuyer3.name);
        console.log (" ticketBuyer5         : ", ticketBuyer3.name);

        await depositmgrAccount.addPermission('eosio.code');

        depositmgrContract = await eoslime.AccountDeployer.deploy (DEPOSITMGR_WASM_PATH, DEPOSITMGR_ABI_PATH, depositmgrAccount);
        tokenContract = await eoslime.AccountDeployer.deploy (TOKEN_WASM_PATH, TOKEN_ABI_PATH, tokenAccount);

        await tokenContract.create (tokenAccount.name, '1000000.00 AUD');

        console.log ("\n\n");
        console.log ("Accounts receive the initial balance at the beginning of all tests.")
        const initialBalance = '100.00 AUD'
        await tokenContract.issue(tokenAccount.name, "100000.00 AUD", 'memo', { from: tokenContract});
        await tokenContract.transfer(tokenAccount.name, ticketBuyer1.name, initialBalance, 'memo', { from: tokenContract});
        await tokenContract.transfer(tokenAccount.name, ticketBuyer2.name, initialBalance, 'memo', { from: tokenContract});
        await tokenContract.transfer(tokenAccount.name, ticketBuyer3.name, initialBalance, 'memo', { from: tokenContract});
        await tokenContract.transfer(tokenAccount.name, ticketBuyer4.name, initialBalance, 'memo', { from: tokenContract});
        await tokenContract.transfer(tokenAccount.name, ticketBuyer5.name, initialBalance, 'memo', { from: tokenContract});
            
        await depositmgrContract.setconfig(tokenAccount.name, "2,AUD",  numberSelector.name, { from: depositmgrAccount });
    });

    it('Tests configuration is properly set', async () => {

        const config = await printConfig (depositmgrContract);

        assert.equal (config.deposit_token_contract, tokenAccount.name);       
        assert.equal (config.deposit_symbol, "2,AUD");
        assert.equal (config.number_selector, numberSelector.name);
    });

    it('Tickets should not be purchasable if contract is paused', async () => {
      
        // first, since default value of setting is to have contract paused, this should generate an assert
        await eoslime.utils.test.expectAssert(
            depositmgrContract.createticket()
        );

        // then let's activate it (sets active setting to 1) and test creating a ticket
        await depositmgrContract.activate();
        await depositmgrContract.createticket();

        // let's reprint the config table so that we can see the active setting is set
        await printConfig(depositmgrContract);
    });

    it('Winning numbers should only be settable by the number selector account', async () => {
        let maliciousAccount = await eoslime.Account.createRandom();
        
        // number selector is required authorization to set numbers, so we expect a messing authority exception
        await eoslime.utils.test.expectMissingAuthority(
            depositmgrContract.setwinnums({ from: maliciousAccount })
        );

        // should be callable by the number selector
        depositmgrContract.setwinnums({ from: numberSelector });
    });

    it('Deposit funds into the contract', async () => {
        await tokenContract.transfer(ticketBuyer1.name, depositmgrAccount.name, "1.00 AUD", 'memo', { from: ticketBuyer1});

        const balance = await printContractBalance (depositmgrAccount, ticketBuyer1);
        assert.equal (balance.funds, "1.00 AUD");
    });

    it('Withdraw funds from contract', async () => {
        await depositmgrContract.withdraw (ticketBuyer1.name, "0.50 AUD", { from: ticketBuyer1 });

        const balance = await printContractBalance (depositmgrAccount, ticketBuyer1);
        assert.equal (balance.funds, "0.50 AUD");

        const tokenBalance = await printTokenBalance (tokenAccount, ticketBuyer1);
        assert.equal (tokenBalance.balance, "99.50 AUD");
    });
});

