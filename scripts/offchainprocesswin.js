require('./config.js');
var winnumbers = Array(6);
var totalDrawTickets = 0;
var totalTickets = 0;
var totalWinners = 0;
var tickets;
var limit = 500;
var next=0;
var batch = 1;

async function getTickets () {

	do
	{
		console.log ("Processing Batch - " + batch + ". Lower Bound: " + next + ", Upper Bound: " + (next + limit - 1));
		
		tickets = await rpc.get_table_rows({
			"json": true,
			"code": account, 
			"scope": drawno, 
			"table": "tickets", 
			"lower_bound":next,
			"upper_bound":next + limit - 1,
			"limit": limit,
		})
		totalDrawTickets = totalDrawTickets + tickets.rows.length;
		tickets.rows.forEach(async function (item, index) {
			//Check ticket not cancelled or claimed
			if(item.ticket_status == 0) {
			totalTickets++;
			var res = winnumbers.filter(f => item.entrynumbers.includes(f));
			if(res.length >= 4)  {
					totalWinners++;
					updateticket (item.serialno,(6-res.length+1));
					//console.log ("Winning Ticket : Serial No: " + item.serialno + " EntryNo: " + item.entrynumbers + " Tier :" + (6-res.length+1));
				}
			}
		});
		if(tickets.rows.length > 0)
		{
			next =  tickets.rows[tickets.rows.length-1].serialno + 1;
			batch++;
		}
	}while(tickets.rows.length > 0)
	
    console.log ("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log ("Total Draw tickets : "+totalDrawTickets);
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
				drawnumber: drawno
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
        console.log ("Successfully updated winning tier for ticket no: " + serialno + ", Winning Div: " + wintier);
    })
    .catch(function(e) {
        console.log(e);
    });
}
// Get winning numbers
async function getWinNumbers () {

	var isClosed;
	
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

      if(draws.rows.length == 1)
	  {
		winnumbers = draws.rows[0].winningnumbers;
		isOpen = draws.rows[0].open;
	  }
	  console.log ("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
	  console.log ("Runing node : " + url);
	  console.log ("Draw no: " + drawno);
	  console.log ("Win Numbers: " + winnumbers); 
	  console.log ("Draw Status: " + (isOpen == 1 ? "Open" : "Closed"));
	  console.log ("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
	  return isOpen;
      
}

async function startProcess () {
	var isDrawOpen = await getWinNumbers ();
	
	if(isDrawOpen)
		console.log ("Draw is not yet closed. Process aborted!!");
	else	
		await getTickets ();
}


startProcess();
