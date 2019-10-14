const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');     
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');                

const defaultPrivateKey = "5JNQzM2iBr9ZhV9DSAoYPjMSn7KxVYSGLRFNFjXwP9FKU34UDZ6"; // bob
const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);

//const rpc = new JsonRpc("http://vsemppoceosbp1.area240.com:8888", { fetch });
const rpc = new JsonRpc("http://localhost:8888", { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

const drawno  = 1;
const account = "experiment11";
const min_winning_tier = 1;
const max_winning_tier = 3;
const winning_tier_index = 5;

async function processTickets() {

    const tickets = await rpc.get_table_rows({
        "json": true,
        "code": account, 
        "scope": account, 
        "table": "tickets", 
        "key_type": "i64",
        "index_position": winning_tier_index,
        "lower_bound": min_winning_tier,
        "upper_bound": max_winning_tier,
        "limit": 10000,
    })
    tickets.rows.forEach(async function (item, index) {
        if (item.drawnumber != drawno || item.ticket_status != 0 || item.storeid > 0) {
            console.log("tickets ignored:" + JSON.stringify(item));
            console.log("\n");
        } else {
            console.log("Pay dividends for :" + JSON.stringify(item));
            //payDividend(item);
            claim (item.serialno, item.purchaser);
        }
    });
}

async function claim (serialno, buyer) {

    api.transact(
        {
        actions: [
            {
            account: account,
            name: "claim",
            authorization: [
                {
                actor: account,
                permission: "active"
                }
            ],
            data: {
                serial_no: serialno
                }
            }
        ]
        },
        {
        blocksBehind: 3,
        expireSeconds: 30
        }
    )
    .then(function(result) {
        console.log (result);
        console.log ("Success");
    })
    .catch(function(e) {
        throw e;
    });
    
}

processTickets();
