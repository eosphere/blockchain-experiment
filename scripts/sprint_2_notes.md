# Notes on Sprint 2 Tasks

### Keys used on Project
```
Private key: 5JNQzM2iBr9ZhV9DSAoYPjMSn7KxVYSGLRFNFjXwP9FKU34UDZ6
Public key: EOS5DtFo67PP3qsvn31WnXujQASB6PEo1uoBk6TtsPL4Dunx5XQcY
```

#### NOTE: Using Telos Test Net as Placeholder until our Test Net is up
Use Eosphere endpoint for Australia, Telos Kitchen endpoint for USA
https://telos-testnet-b.eosphere.io
https://test.telos.kitchen

To test: 
```
cleos -u https://telos-testnet-b.eosphere.io get info
cleos -u https://test.telos.kitchen get info
```
## One time commands 
These commands were used to setup the environment on the Telos testnet. Feel free to create additional accounts to deploy the experiment contract to as needed.

#### Ensure key is imported 
Unlock wallet and import private key above
```
cleos wallet unlock --password xxxxxx
cleos wallet import --private-key 5JNQzM2iBr9ZhV9DSAoYPjMSn7KxVYSGLRFNFjXwP9FKU34UDZ6
```

#### Deploying contracts
Commands for buying ram and deploying contract (we shouldn't need to buy anymore ram):
```
cleos -u https://test.telos.kitchen system buyram experiment11 experiment11 "250.0000 TLOS"
cd scripts
cleos -u https://test.telos.kitchen set contract experiment11 ../experiment/experiment/experiment
cleos -u https://test.telos.kitchen set contract experimtoken ../experiment/experiment/token
```

#### Creating accounts
Create accounts for ```numberselect``` and ```ticketbuyer1``` and ```experimtoken```:
```
cleos -u https://test.telos.kitchen system newaccount --stake-net "1.0000 TLOS" --stake-cpu "1.0000 TLOS" --buy-ram "1.0000 TLOS" experiment11 ticketbuyer1 EOS5DtFo67PP3qsvn31WnXujQASB6PEo1uoBk6TtsPL4Dunx5XQcY
cleos -u https://test.telos.kitchen system newaccount --stake-net "1.0000 TLOS" --stake-cpu "1.0000 TLOS" --buy-ram "1.0000 TLOS" experiment11 numberselect EOS5DtFo67PP3qsvn31WnXujQASB6PEo1uoBk6TtsPL4Dunx5XQcY
cleos -u https://test.telos.kitchen system newaccount --stake-net "1.0000 TLOS" --stake-cpu "1.0000 TLOS" --buy-ram "1.0000 TLOS" experiment11 experimtoken  EOS5DtFo67PP3qsvn31WnXujQASB6PEo1uoBk6TtsPL4Dunx5XQcY
```

You can create more ticket buyer accounts as needed.

#### Setup token and config experiment contract

Create and issue token
```
cleos -u https://test.telos.kitchen push action experimtoken create '["experimtoken", "1000000000.00 AUD"]' -p experimtoken
cleos -u https://test.telos.kitchen push action experimtoken issue '["experimtoken", "100000000.00 AUD", "memo"]' -p experimtoken
```
Set config and activate
```
cleos -u https://test.telos.kitchen push action experiment11 setconfig '["experimtoken", "2,AUD", "numberselect"]' -p experiment11
cleos -u https://test.telos.kitchen push action experiment11 activate '[]' -p experiment11
```

### Create Accounts
Accounts have been created and contracts deployed for:
```experiment11``` -- experiment contract
```experimtoken``` -- token contract 

AUD token has been created. 

After you have created the account, you can transfer AUD tokens to the account using: 
```
cleos -u https://test.telos.kitchen push action experimtoken transfer '["experimtoken", "ticketbuyer1", "100.00 AUD", "memo"]' -p experimtoken
```
Check transfer:
```
cleos -u https://test.telos.kitchen get table experimtoken ticketbuyer1 accounts
```

THEN, the account transfers AUD tokens to the experiment contract in order to buy tickets:
```
cleos -u https://test.telos.kitchen push action experimtoken transfer '["ticketbuyer1", "experiment11", "100.00 AUD", "memo"]' -p ticketbuyer1
```
Check transfer to experiment:
```
cleos -u https://test.telos.kitchen get table experiment11 ticketbuyer1 balances
```

### Create a Draw and Create a Ticket

Create a draw:
```
cleos -u https://test.telos.kitchen push action experiment11 createdraw '[]' -p numberselect
```

Purchase a ticket using the following command:
```
cleos -u https://test.telos.kitchen push action experiment11 createticket '["ticketbuyer1", 0, [1,2,3,4,5,6]]' -p ticketbuyer1
```

View created tickets:
```
cleos -u https://test.telos.kitchen get table experiment11 experiment11 tickets
```

Congratulations! :) At this point, a ticket has been created on a global test net. 

## Sprint 2, Primary Task: Create Ticket Simulator

A major task of sprint 2 is to create the ticket simulator. It needs to process 10,000 tickets per minute. Doing this serially in a single-threaded process hitting one node will not work. We will need to run many threads on a single process hitting several nodes. 

The simulator can either be a nodejs process OR it could be some other process calling ```cleos``` in the shell.

It needs to create 6 random numbers between 1 and 45 and call ```createticket```

The ```create.js``` node script provides a stub for creating a single ticket using nodejs. The task at hand is to expand this script to create 10,000 per minute.

You can run this script via: 
```
cd scripts
yarn
node create.js
```
Verify that it created a ticket:
```
cleos -u https://test.telos.kitchen get table experiment11 experiment11 tickets
```

## Sprint 2, Primary Task: Process Winning Ticket on Chain

In order for ticket results to be on-chain provable/auditable, we must validate winning numbers on chain.  We should have an action (```processticket```) that accepts a draw number (that has winning numbers assigned already) and a ticket number, and it validates if that ticket is a winner.

The contract node must compare the winning numbers to the ticket numbers and calculate a winning amount.


##  Sprint 2, Primary Task: Off-chain Process Winning Tickets

This task must read the ```draws``` table to get the winning numbers and the ```tickets``` table. It must iterate the list of tickets, determine if the ticket one, and if so, call the ```processticket``` action.  This job could call ```processticket``` for each ticket in the table, but it will be much faster to check the ticket off-chain and only call ```processticket``` for winning tickets.

The simulator can either be a nodejs process OR it could be some other process calling ```cleos``` in the shell.

The ```check.js``` node script provides a stub for reading and iterating through the tickets using nodejs. The task for this sprint is to check each ticket number.

You can run the script via:
```
cd scripts
yarn
node check.js
```



