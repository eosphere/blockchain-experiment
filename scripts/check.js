
const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');     
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');                

const defaultPrivateKey = "5JNQzM2iBr9ZhV9DSAoYPjMSn7KxVYSGLRFNFjXwP9FKU34UDZ6"; // bob
const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);

const rpc = new JsonRpc("https://test.telos.kitchen", { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

async function checktickets () {

    const tickets = await rpc.get_table_rows({
        "json": true,
        "code": "experiment11", 
        "scope": "experiment11", 
        "table": "tickets",   
        "limit": 10000,
    })

    tickets.rows.forEach(async function (item, index) {

        console.log ("Ticket serial no: ", item.serialno);
        console.log ("Ticket purchaser: ", item.purchaser);
        console.log ("Entered numbers: ", item.entrynumbers);
        console.log ();

        // TODO:
        // if ticket wins
        // call 'processticket' on chain

        
    });
}

checktickets();