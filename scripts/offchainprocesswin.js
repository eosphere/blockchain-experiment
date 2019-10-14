require('./config.js');
var winnumbers = Array(6);
var totalTickets = 0;
var totalWinners = 0;

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
        //Check ticket not cancelled or claimed
        if(item.ticket_status == 0) {
        totalTickets++;
        var res = winnumbers.filter(f => item.entrynumbers.includes(f));
        if(res.length >= 4)  {
            totalWinners++;
            updateticket (item.serialno,(6-res.length+1));
        }
        }
        //console.log ("No win for ticket : "+item.serialno +" entry no : "+item.entrynumbers);
    });

    console.log ("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log ("runing node : " + url);
    console.log ("Total Draw tickets : "+tickets.rows.length+" for Draw no : "+drawno);
    console.log ("Total Open tickets : "+totalTickets);
    console.log ("Total Winning tickets : "+totalWinners);
    console.log ("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
}

async function updateticket (serialno,wintier) {
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
                serial_no: serialno,
                win_tier: wintier,
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
        console.log ("Updated Winning tier - Successfully. Ticket NO : "+serialno + " Winning Div : "+wintier);
    })
    .catch(function(e) {
        console.log(e);
    });
}
// Get winning numbers
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
//TODO: check draw closed
getWinNumbers ();
setTimeout(getTickets,1000);
