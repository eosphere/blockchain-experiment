/* eslint-disable prettier/prettier */
const assert = require('assert');
const eoslime = require('eoslime').init('local');

const DRAWMGR_WASM_PATH = '../drawmgr/drawmgr.wasm';
const DRAWMGR_ABI_PATH = '../drawmgr/drawmgr.abi';

async function printTickets (contract) {
    console.log("Printing all tickets.");
    let ticketTable = await contract.provider.eos.getTableRows({
        code: contract.name,
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

    let drawmgrContract;
    let drawmgrAccount;
    let accounts;

    before(async () => {

        accounts = await eoslime.Account.createRandoms(20);
        drawmgrAccount          = accounts[0];
        
       
        console.log (" drawmgr Account   : ", drawmgrAccount.name);
        
        await drawmgrAccount.addPermission('eosio.code');

        drawmgrContract = await eoslime.AccountDeployer.deploy (DRAWMGR_WASM_PATH, DRAWMGR_ABI_PATH, drawmgrAccount);
    

        console.log ("\n\n");
            
        
    });

    it('print', async () => {

        await printTickets(drawmgrContract);
    });

   
});

