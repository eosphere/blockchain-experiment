require('./config.js');
const createModule = require('./create.js');

//For Testing

async function createticket (buyer) {
    api.transact(
        {
        actions: [
            {
            account: account,
            name: "createticket",
            authorization: [
                {
                actor: buyer,
                permission: "active"
                }
            ],
            data: {
                purchaser: buyer,
                drawnumber: drawno,
                entrynumbers: await createModule.getNumbers(),
                genreward: true
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
        console.log ("Success");
    })
    .catch(function(e) {
        console.log(e);
    });
}
let buyers = ['ticketbuyer1','ticketbuyer2','ticketbuyer3'];
let tickets = 5;
buyers.forEach(async function(buyer){
    console.log("Purchasing ticket for " + buyer);
    for (var i=0; i < tickets; i++) {
        createticket (buyer);
    }
}) ;


