require('./config.js');

async function randomRange(min, max) {
    const diff = max - min + 1;

    // finds the minimum number of bit required to represent the diff
    const numberBit = Math.ceil(Math.log2(diff));
    // as we are limited to draw bytes, minimum number of bytes
    const numberBytes = Math.ceil(numberBit / 4);

    // as we might draw more bits than required, we look only at what we need (discard the rest)
    const mask = (1 << numberBit) - 1;

    let randomNumber;

    do {
        randomNumber = crypto.randomBytes(numberBytes).readUIntBE(0, numberBytes);
        randomNumber = randomNumber & mask;
    // number of bit might represent a numbers bigger than the diff, in that case try again
    } while (randomNumber >= diff);

    return randomNumber + min;
}

module.exports.getNumbers = 
    async function getNumbers () {
        let numbers = [];
        while (numbers.length < 6) {
            const randNum = await randomRange (1,45);
            if (numbers.indexOf(randNum) === -1) {
                numbers.push (randNum);
            }
        }
        return numbers;
    }


async function createticket () {
    api.transact(
        {
        actions: [
            {
            account: account,
            name: "createticket",
            authorization: [
                {
                actor: "ticketbuyer1",
                permission: "active"
                }
            ],
            data: {
                purchaser: "ticketbuyer1",
                drawnumber: drawno,
                entrynumbers: await exports.getNumbers()
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

createticket ();

