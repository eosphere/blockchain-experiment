const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');     
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');                

const defaultPrivateKey = "5Ke3bVZBoyixVhhFtXUNPHn1fiDAYsPdi7L9CcBmL5aQrUCrGhN"; // bob
const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);

const rpc = new JsonRpc("http://vsemppoceosbp1.area240.com:8888", { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

const drawno  = 2;
const account = "experiment13";
const min_winning_tier = 1;
const max_winning_tier = 4;
const winning_tier_index = 5;
var dividends_map;

async function getTickets() {

    const tickets = await rpc.get_table_rows({
        "json": true,
        "code": account, 
        "scope": account, 
        "table": "tickets", 
        "key_type": "i64",
        "index_position":winning_tier_index,
        "lower_bound":min_winning_tier,
        "upper_bound":max_winning_tier,
        "limit": 10000,
    })
    tickets.rows.forEach(async function (item, index) {
        if (item.drawnumber != drawno || ticket_status != 0 || storeid != null) {
            continue;
        }
        //pay dividends
        console.log("Pay dividends for :" + JSON.stringify(item));
        // var res = winnumbers.filter(f => item.entrynumbers.includes(f));
        // if(res.length >= 4)
        // console.log ("Won!!! : "+item.entrynumbers + " div : "+((6-res.length+1)));
        // else
        // console.log ("No win for ticket : "+item.serialno +" entry no : "+item.entrynumbers);
        
    });
}

async function getDividends()  {
    const dividends = await rpc.get_table_rows({
        "json": true,
        "code": account, 
        "scope": account, 
        "table": "dividends", 
        "key_type": "i64",
        "index_position":1,
        "lower_bound":drawno,
        "upper_bound":drawno,
        "limit": 100,
    });
    console.log("Total " + dividends.rows.length + " for draw " + drawno);

    dividends_map = dividends.rows[0];
}