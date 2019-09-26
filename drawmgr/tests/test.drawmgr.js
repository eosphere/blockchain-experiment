/* eslint-disable prettier/prettier */
const assert = require('assert');
const eoslime = require('eoslime').init('local');

const DEPOSITMGR_WASM_PATH = '../../depositmgr/depositmgr/depositmgr/depositmgr.wasm';
const DEPOSITMGR_ABI_PATH = '../../depositmgr/depositmgr/depositmgr/depositmgr.abi';
const DRAWMGR_WASM_PATH = '../drawmgr/drawmgr.wasm';
const DRAWMGR_ABI_PATH = '../drawmgr/drawmgr.abi'

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

async function printWinningNumber (contract, drawnumber) {
    console.log();
    console.log ("Here is the winning number for ", drawnumber );
    let winningTable = await contract.provider.eos.getTableRows({
        code: contract.name,
        scope: drawnumber,
        table: 'winning_numbers',
        json: true
    });
    console.log (JSON.stringify(winning_numbers.rows[0]));
    console.log ();
    return winningTable.rows[0];
}

describe('drawmgr Testing', function () {

    // Increase mocha(testing framework) time, otherwise tests fails
    this.timeout(150000);

    //let depositmgrContract;
    let depositmgrAccount, tokenAccount;
    let ticketBuyer1, ticketBuyer2, ticketBuyer3, ticketBuyer4, ticketBuyer5;
    let drawmgrAccount;
    let accounts;
    let config;

    before(async () => {

        accounts = await eoslime.Account.createRandoms(20);
        depositmgrAccount          = accounts[0];
        tokenAccount               = accounts[1];
        drawmgrAccount             = accounts[2];
        
        ticketBuyer1               = accounts[4];
        ticketBuyer2               = accounts[5];
        ticketBuyer3               = accounts[6];
        ticketBuyer4               = accounts[7];
        ticketBuyer5               = accounts[8];
       
        console.log (" depositmgr Account   : ", depositmgrAccount.name);
        console.log (" tokenAccount         : ", tokenAccount.name);
        console.log (" drawmgrAccount       : ", drawmgrAccount.name);
        console.log (" ticketBuyer1         : ", ticketBuyer1.name);
        console.log (" ticketBuyer2         : ", ticketBuyer2.name);
        console.log (" ticketBuyer3         : ", ticketBuyer3.name);
        console.log (" ticketBuyer4         : ", ticketBuyer3.name);
        console.log (" ticketBuyer5         : ", ticketBuyer3.name);

        await depositmgrAccount.addPermission('eosio.code');

        depositmgrContract = await eoslime.AccountDeployer.deploy (DEPOSITMGR_WASM_PATH, DEPOSITMGR_ABI_PATH, depositmgrAccount);
        drawmgrContract = await eoslime.AccountDeployer.deploy (DRAWMGR_WASM_PATH, DRAWMGR_ABI_PATH, drawmgrAccount);

        //await tokenContract.create (tokenAccount.name, '1000000.00 AUD');

        console.log ("\n\n");
        console.log ("Accounts receive the initial balance at the beginning of all tests.")
            
        //await depositmgrContract.setconfig(tokenAccount.name, "2,AUD",  numberSelector.name, { from: depositmgrAccount });
    });


    it('Winnning numbers should be set to draw number tables', async () => {
        //print("empty testing");
        //const config = await printConfig (depositmgrContract);
        // await eoslime.utils.test.expectAssert(
        //     drawmgrContract.create({from: drawmgrAccount, draw_number: 1, signature: 'ABCDKLJSHAS', winning_num:'1,2,3,4,5,6'})
        // );
        // assert.equal (config.deposit_token_contract, tokenAccount.name);       
        // assert.equal (config.deposit_symbol, "2,AUD");
        // assert.equal (config.number_selector, numberSelector.name);
    });
});

