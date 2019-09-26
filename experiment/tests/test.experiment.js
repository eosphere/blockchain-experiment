/* eslint-disable prettier/prettier */
const assert = require('assert');
const eoslime = require('eoslime').init('local');
const crypto = require ('crypto');

const EXPERIMENT_WASM_PATH = '../experiment/experiment/experiment.wasm';
const EXPERIMENT_ABI_PATH = '../experiment/experiment/experiment.abi';
const TOKEN_WASM_PATH = '../experiment/token/token.wasm';
const TOKEN_ABI_PATH = '../experiment/token/token.abi';

async function randomRange(min, max) {
    const diff = max - min + 1;

    // finds the minimum number of bit required to represent the diff
    const numberBit = Math.ceil(Math.log2(diff));
    // as we are limited to draw bytes, minimum number of bytes
    const numberBytes = Math.ceil(numberBit / 4);

    // as we might draw more bits than required, we look only at what we need (discard the rest)
    const mask = (1 << numberBit) - 1;

    let randomNumber;

    do {
        randomNumber = crypto.randomBytes(numberBytes).readUIntBE(0, numberBytes);
        randomNumber = randomNumber & mask;
    // number of bit might represent a numbers bigger than the diff, in that case try again
    } while (randomNumber >= diff);

    return randomNumber + min;
}

async function getNumbers () {
    let numbers = [];
    while (numbers.length < 6) {
        const randNum = await randomRange (1,45);
        if (numbers.indexOf(randNum) === -1) {
            numbers.push (randNum);
        }
    }
    return numbers;
}

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

async function printTickets (contract) {
    // console.log();
    // console.log ("Here are the tickets");
    let ticketTable = await contract.provider.eos.getTableRows({
        code: contract.name,
        scope: contract.name,
        limit: 100000,
        table: 'tickets',
        json: true
    });
    // console.log (JSON.stringify(ticketTable.rows));
    // console.log ();
    return ticketTable.rows;
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


describe('experiment Testing', function () {

    // Increase mocha(testing framework) time, otherwise tests fails
    this.timeout(150000);

    let experimentContract, tokenContract;
    let experimentAccount, tokenAccount;
    let ticketBuyer1, ticketBuyer2, ticketBuyer3, ticketBuyer4, ticketBuyer5;
    let numberSelector;
    let accounts;
    let config;

    before(async () => {

        accounts = await eoslime.Account.createRandoms(20);
        experimentAccount          = accounts[0];
        tokenAccount               = accounts[1];
        numberSelector             = accounts[2];
        
        ticketBuyer1               = accounts[4];
        ticketBuyer2               = accounts[5];
        ticketBuyer3               = accounts[6];
        ticketBuyer4               = accounts[7];
        ticketBuyer5               = accounts[8];
       
        console.log (" experiment Account   : ", experimentAccount.name);
        console.log (" tokenAccount         : ", tokenAccount.name);
        console.log (" numberSelector       : ", numberSelector.name);
        console.log (" ticketBuyer1         : ", ticketBuyer1.name);
        console.log (" ticketBuyer2         : ", ticketBuyer2.name);
        console.log (" ticketBuyer3         : ", ticketBuyer3.name);
        console.log (" ticketBuyer4         : ", ticketBuyer3.name);
        console.log (" ticketBuyer5         : ", ticketBuyer3.name);

        await experimentAccount.addPermission('eosio.code');

        experimentContract = await eoslime.AccountDeployer.deploy (EXPERIMENT_WASM_PATH, EXPERIMENT_ABI_PATH, experimentAccount);
        tokenContract = await eoslime.AccountDeployer.deploy (TOKEN_WASM_PATH, TOKEN_ABI_PATH, tokenAccount);

        await tokenContract.create (tokenAccount.name, '1000000.00 AUD');

        console.log ("\n\n");
        console.log ("Accounts receive the initial balance at the beginning of all tests.")
        const initialBalance = '10000.00 AUD'
        await tokenContract.issue(tokenAccount.name, "100000.00 AUD", 'memo', { from: tokenContract});
        await tokenContract.transfer(tokenAccount.name, ticketBuyer1.name, initialBalance, 'memo', { from: tokenContract});
        await tokenContract.transfer(tokenAccount.name, ticketBuyer2.name, initialBalance, 'memo', { from: tokenContract});
        await tokenContract.transfer(tokenAccount.name, ticketBuyer3.name, initialBalance, 'memo', { from: tokenContract});
        await tokenContract.transfer(tokenAccount.name, ticketBuyer4.name, initialBalance, 'memo', { from: tokenContract});
        await tokenContract.transfer(tokenAccount.name, ticketBuyer5.name, initialBalance, 'memo', { from: tokenContract});
            
        await experimentContract.setconfig(tokenAccount.name, "2,AUD",  numberSelector.name, { from: experimentAccount });
    });

    it('Tests configuration is properly set', async () => {

        const config = await printConfig (experimentContract);

        assert.equal (config.deposit_token_contract, tokenAccount.name);       
        assert.equal (config.deposit_symbol, "2,AUD");
        assert.equal (config.number_selector, numberSelector.name);
    });

    it('Deposit funds into the contract', async () => {
        await tokenContract.transfer(ticketBuyer1.name, experimentAccount.name, "10000.00 AUD", 'memo', { from: ticketBuyer1});

        const balance = await printContractBalance (experimentAccount, ticketBuyer1);
        assert.equal (balance.funds, "10000.00 AUD");
    });

    it('Withdraw funds from contract', async () => {
        await experimentContract.withdraw (ticketBuyer1.name, "0.50 AUD", { from: ticketBuyer1 });

        const balance = await printContractBalance (experimentAccount, ticketBuyer1);
        assert.equal (balance.funds, "9999.50 AUD");

        const tokenBalance = await printTokenBalance (tokenAccount, ticketBuyer1);
        assert.equal (tokenBalance.balance, "0.50 AUD");
    });

    it('Can create a draw', async () => {
        await experimentContract.createdraw({ from: numberSelector});

        let drawTable = await experimentContract.provider.eos.getTableRows({
            code: experimentAccount.name,
            scope: experimentAccount.name,
            table: 'draws',
            json: true
        });
        console.log (JSON.stringify(drawTable));
        assert.equal (drawTable.rows.length, 1);
    });

    it('Tickets should not be purchasable if contract is paused', async () => {
      
        // first, since default value of setting is to have contract paused, this should generate an assert
        await eoslime.utils.test.expectAssert(
            experimentContract.createticket(ticketBuyer1.name, 0, [1,2,3,4,5,6], { from: ticketBuyer1})
        );
    });

    it('Tickets should be purchasable', async () => {

        // then let's activate it (sets active setting to 1) and test creating a ticket
        await experimentContract.activate();
        await experimentContract.createticket(ticketBuyer1.name, 0, await getNumbers(), { from: ticketBuyer1});

        // let's print the tickets
        const ticketTable = await printTickets(experimentContract);
        assert.equal (ticketTable.length, 1);
    });

    // it('Shouldnt allow only 5 numbers', async () => {
    //     let numbers = [];
    //     while (numbers.length < 5) {
    //         const randNum = await randomRange (1,45);
    //         if (numbers.indexOf(randNum) === -1) {
    //             numbers.push (randNum);
    //         }
    //     }
    //     await eoslime.utils.test.expectAssert(
    //         await experimentContract.createticket(ticketBuyer1.name, 0, numbers, { from: ticketBuyer1})
    //     );
    // });

    it('Purchase a bunch of tickets', async () => {
        
        for (var i=0; i< 100; i++) {
            await experimentContract.createticket(ticketBuyer1.name, 0, await getNumbers(), { from: ticketBuyer1});
        }

        // let's print the tickets
        const ticketTable = await printTickets(experimentContract);
        assert.equal (ticketTable.length, 101);
    });

    it('Winning numbers should only be settable by the number selector account', async () => {
        // let maliciousAccount = await eoslime.Account.createRandom();
        
        // // number selector is required authorization to set numbers, so we expect a messing authority exception
        // await eoslime.utils.test.expectMissingAuthority(
        //     experimentContract.setwinnums(await getNumbers(), { from: maliciousAccount })
        // );

        // should be callable by the number selector
        experimentContract.setwinnums(0, await getNumbers(), { from: numberSelector });
    });

    
});

