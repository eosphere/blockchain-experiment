
const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');     
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');                

const defaultPrivateKey = "5Ke3bVZBoyixVhhFtXUNPHn1fiDAYsPdi7L9CcBmL5aQrUCrGhN"; // bob
const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);

const rpc = new JsonRpc("https://hub.area240.com", { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

const drawno  = 0;
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
        "lower_bound":drawno,
        "upper_bound":drawno,
        "limit": 10000,
    })
    tickets.rows.forEach(async function (item, index) {
        
        var res = winnumbers.filter(f => item.entrynumbers.includes(f));
        if(res.length >= 4)
        console.log ("Won!!! : "+item.entrynumbers + " div : "+((6-res.length+1)));
        else
        console.log ("No win for ticket : "+item.serialno +" entry no : "+item.entrynumbers);
        
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
