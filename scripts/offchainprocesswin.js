
const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');     
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');                

const defaultPrivateKey = "5Ke3bVZBoyixVhhFtXUNPHn1fiDAYsPdi7L9CcBmL5aQrUCrGhN"; // bob
const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);

const rpc = new JsonRpc("https://hub.area240.com", { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

const drawno  = 2;
const account = "experiment13";
var winnumbers = Array(6);


async function getTickets () {

    const tickets = await rpc.get_table_rows({
        "json": true,
        "code": account, 
        "scope": account, 
        "table": "tickets", 
        "key_type": "i64",
        "index_position":3,
        "lower_bound" :drawno,
        "upper_bound" :drawno,
        "limit": 15000,
    });
    console.log ("No of tickets: "+ tickets.rows.length);
 
    tickets.rows.forEach(async function (item, index) {
        //console.log ("No win for ticket : "+ JSON.stringify(item));
        if(item.ticket_status == 0) {
        var res = winnumbers.filter(f => item.entrynumbers.includes(f));
        if(res.length >= 4)
        updateTicket(item.serialno,(6-res.length+1));
        }
        
    });
}

async function updateTicket (ticketno,division) {

    api.transact(
        {
        actions: [
            {
            account: account,
            name: "updatewint",
            authorization: [
                {
                actor: account,
                permission: "active"
                }
            ],
            data: {
                serial_no: ticketno,
                win_tier: division,
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
      console.log ("Ticket no : "+serialno+" Won!!! -  Div : "+division);
    })
    .catch(function(e) {
        console.log(e);
    });
}

async function getWinNumbers () {

    const draws = await rpc.get_table_rows({
        "json": true,
        "code": account, 
        "scope": account, 
        "table": "draws", 
        "key_type": "i64",
        "index_position":1,
        "lower_bound":drawno,
        "upper_bound":drawno,
        "limit": 1,
    })

    draws.rows.forEach(async function (item, index) {
      winnumbers = item.winningnumbers;
      console.log ("Draw no : "+item.drawnumber+" win numbers : "+winnumbers);
        
    });
}
getWinNumbers ();
setTimeout(getTickets,1000);
