require('./config.js');
const winning_tier_index = 5;


async function processwinning() {
    let total_paid = 0;

    const promises = range (min_winning_tier, max_winning_tier, 1).map(tier => processByTier(tier));
    await Promise.all(promises);
    console.log ("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log ("Draw " + drawno + " processed");
    console.log ("Total " + total_paid + " ticket paid offchian.");
    console.log ("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    
}

async function processByTier(winning_tier) {
    
    const tickets = await rpc.get_table_rows({
        "json": true,
        "code": account, 
        "scope": account, 
        "table": "tickets", 
        "key_type": "i64",
        "index_position": winning_tier_index,
        "lower_bound": winning_tier,
        "upper_bound": winning_tier,
        "limit": 10000,
    })
    console.log ("Processing winnning tier " + winning_tier);
    tickets.rows.forEach(async function (item, index) {
        if (item.drawnumber != drawno || item.ticket_status != 0 || item.storeid > 0) {
            console.log("tickets ignored:" + JSON.stringify(item));
            console.log("\n");
        } else {
            console.log("Pay dividends for :" + JSON.stringify(item));
            claim (item.serialno, item.purchaser);
            total_paid ++;
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
        console.log ("Paid " + buyer);
    })
    .catch(function(e) {
        throw e;
    });
    
}

processwinning();
