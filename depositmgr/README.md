
## Learning Objectives
- Builds on the configex contract
- Illustrate how to create a token
- Illustrate how to deposit token into a contract and maintain balances within a contract
- Illustrate how to withdraw tokens from a contract


### Creation / Init
This project was created using:
```
eosio-init -project=depositmgr -path=.
```

It uses ```cmake``` to build the project.

The boilerplate project from ```eosio-init``` does not include a ```.gitignore``` file so I have added a useful one to the project.

### How to Build

1. Run ```cmake .```
2. Run ```make```

The ABI and WASM files are created in the ```depositmgr``` directory.


## Major Components

### Token Contract
The EOSIO standard token contract was added to this project as a second contract.

### Balances Table
A balances table was added to the contract to maintain balances for each user that has deposited funds. It is scoped by the account and the primary key is the token symbol.

```
   // table to maintain user balances
   struct [[ eosio::table, eosio::contract("depositmgr") ]] balance 
   {
      asset                   funds                      ;
      name                    token_contract             ;
      uint64_t primary_key() const { return funds.symbol.code().raw(); }
   };
   typedef multi_index<"balances"_n, balance> balance_table;
```

### Listening for Deposits
The eosio ```on_notify``` keyword is used to indicate that the ```deposit``` method should be invoked when the contract receives a ```transfer``` action.

```
   // deposit handler -- this triggers whenever the contract receives tokens
   [[eosio::on_notify("*::transfer")]]
   void deposit ( const name& from, const name& to, const asset& quantity, const string& memo );
```

### Handling Deposits
See the full ```deposit``` method in the source (depositmgr.cpp), but here's the part that updates the table with the user's balance.

```
   balance_table balances(get_self(), from.value);
   asset new_balance;
   auto it = balances.find(quantity.symbol.code().raw());
   if(it != balances.end()) {
      check (it->token_contract == token_contract, "Transfer does not match existing token contract.");
      balances.modify(it, get_self(), [&](auto& bal){
         bal.funds += quantity;
         new_balance = bal.funds;
      });
   }
   else {
      balances.emplace(get_self(), [&](auto& bal){
         bal.funds = quantity;
         bal.token_contract  = token_contract;
         new_balance = quantity;
      });
   }
```
### Withdraw
The user may withdraw funds as well, and they are transferred back to the user's account. See ```depositmgr::withdraw``` for more details, but here you can see the part where it transfers token from ```get_self()```, the contract, back to the user requesting the withdrawal.

```
   // send tokens
   string memo { "Withdrawal from account: " + get_self().to_string() };
   action(
      permission_level{get_self(), "active"_n},
      b_itr->token_contract, "transfer"_n,
      std::make_tuple(get_self(), account, quantity, memo))
   .send();
```

## Testing

Additional tests have been written to test the deposit and withdrawal features. Investigate ```test.depositmgr.js``` for more details.

To run, ensure nodeos is running locally, and run:
```
mocha test.depositmgr.js
```