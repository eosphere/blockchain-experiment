/* eslint-disable prettier/prettier */
const assert = require('assert');
const eoslime = require('eoslime').init('local');

const DRAWMGR_WASM_PATH = '../drawmgr/drawmgr/drawmgr.wasm';
const DRAWMGR_ABI_PATH = '../drawmgr/drawmgr/drawmgr.abi';

async function printTickets ( ) {
    console.log("Printing all tickets.");
    let ticketTable = await contract.provider.eos.getTableRows({
        table: 'tickets',
        json: true
    });
    console.log (JSON.stringify(ticketTable.rows[0]));
    console.log ();
    return ticketTable.rows[0];
}

describe('Drawmgr Testing', function () {

    // Increase mocha(testing framework) time, otherwise tests fails
    this.timeout(150000);

    let drawmgrContract, tokenContract;
    let drawmgrAccount, tokenAccount;
    let ticketBuyer1, ticketBuyer2, ticketBuyer3, ticketBuyer4, ticketBuyer5;
    let numberSelector;
    let accounts;
    let config;

    before(async () => {

        accounts = await eoslime.Account.createRandoms(20);
        drawmgrAccount          = accounts[0];
        
       
        console.log (" drawmgr Account   : ", drawmgrAccount.name);
        
        await drawmgrAccount.addPermission('eosio.code');

        drawmgrContract = await eoslime.AccountDeployer.deploy (DRAWMGR_WASM_PATH, DRAWMGR_ABI_PATH, drawmgrAccount);
    

        console.log ("\n\n");
            
        await printTickets();
    });

   
});

