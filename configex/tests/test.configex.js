/* eslint-disable prettier/prettier */
const assert = require('assert');
const eoslime = require('eoslime').init('local');

const CONFIGEX_WASM_PATH = '../configex/configex.wasm';
const CONFIGEX_ABI_PATH = '../configex/configex.abi';

async function printConfig (contract) {
    console.log();
    console.log (" Here is the contract configuration.")
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

describe('Configex Testing', function () {

    // Increase mocha(testing framework) time, otherwise tests fails
    this.timeout(150000);

    let configexContract;
    let configexAccount, tokenAccount;
    let ticketBuyer1, ticketBuyer2, ticketBuyer3, ticketBuyer4, ticketBuyer5;
    let numberSelector;
    let accounts;
    let config;

    before(async () => {

        accounts = await eoslime.Account.createRandoms(20);
        configexAccount            = accounts[0];
        tokenAccount               = accounts[1];
        numberSelector             = accounts[2];
        
        ticketBuyer1               = accounts[4];
        ticketBuyer2               = accounts[5];
        ticketBuyer3               = accounts[6];
        ticketBuyer4               = accounts[7];
        ticketBuyer5               = accounts[8];
       
        console.log (" ConfigEx Account     : ", configexAccount.name);
        console.log (" numberSelector       : ", numberSelector.name);
        console.log (" ticketBuyer1         : ", ticketBuyer1.name);
        console.log (" ticketBuyer2         : ", ticketBuyer2.name);
        console.log (" ticketBuyer3         : ", ticketBuyer3.name);
        console.log (" ticketBuyer4         : ", ticketBuyer3.name);
        console.log (" ticketBuyer5         : ", ticketBuyer3.name);

        await configexAccount.addPermission('eosio.code');

        configexContract = await eoslime.AccountDeployer.deploy (CONFIGEX_WASM_PATH, CONFIGEX_ABI_PATH, configexAccount);
            
        await configexContract.setconfig(tokenAccount.name, "2,AUD",  numberSelector.name, { from: configexAccount });
    });

    it('Tests configuration is properly set', async () => {

        const config = await printConfig (configexContract);

        assert.equal (config.deposit_token_contract, tokenAccount.name);       
        assert.equal (config.deposit_symbol, "2,AUD");
        assert.equal (config.number_selector, numberSelector.name);
    });

    it('Tickets should not be purchasable if contract is paused', async () => {
      
        // first, since default value of setting is to have contract paused, this should generate an assert
        await eoslime.utils.test.expectAssert(
            configexContract.createticket()
        );

        // then let's activate it (sets active setting to 1) and test creating a ticket
        await configexContract.activate();
        await configexContract.createticket();

        // let's reprint the config table so that we can see the active setting is set
        await printConfig(configexContract);
    });

    it('Winning numbers should only be settable by the number selector account', async () => {
        let maliciousAccount = await eoslime.Account.createRandom();
        
        // number selector is required authorization to set numbers, so we expect a messing authority exception
        await eoslime.utils.test.expectMissingAuthority(
            configexContract.setwinnums({ from: maliciousAccount })
        );

        // should be callable by the number selector
        configexContract.setwinnums({ from: numberSelector });
    });
});

