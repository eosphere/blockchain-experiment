
## configex Project
### Learning Objectives
- Illustrate how to setup and manage a contract configuration singleton with a settings map.
- Illustrate build process using ```cmake```
- Illustrate how to test with ```eoslime```

#### Learning Activities
- Clone the repo and investigate files to see how it works
- Build the project using ```cmake```
- Test the contract using ```nodeos```, ```eoslime```, and ```mocha```
- Try out creating a new configuration item in the singleton, such as ```float  test_config_float```
- Try out creating a new setting in the settings map using ```setsetting```
- Write tests for your new features

#### Creation / Init
This project was created using:
```
eosio-init -project=configex -path=.
```

It uses ```cmake``` to build the project.

The boilerplate project from ```eosio-init``` does not include a ```.gitignore``` file so I have added a useful one to the project.

#### How to Build

1. Run ```cmake .```
2. Run ```make```

The ABI and WASM files are created in the ```configex``` directory.


### Major Components

#### Configuration Singleton

A singleton is a table with one row.  The configuration singleton contains contract-wide configuration parameters.

I always include a settings ```map``` so that we can later add configuration settings (integers) without having to change the data structure.
```
struct [[ eosio::table, eosio::contract("configex") ]] config
{
    // a general purpose settings map
    std::map<name, uint8_t>     settings                    ;

    // tickets can be purchased with the AUD symbol from the audcontract1
    name                    deposit_token_contract     = "audcontract1"_n;
    symbol                  deposit_symbol             = symbol ("AUD", 2);

    // account with permission to decide the winning numbers
    name                    number_selector            ;

    // ....  other configurations can go here
};

typedef singleton<"configs"_n, config> config_table;
```

The configurations are set using a ```setconfig``` action.
```
void configex::setconfig  ( const name& deposit_token_contract, const symbol& deposit_symbol, const name& number_selector ) {
   // only this contract can set the configurations (this could be changed)
   require_auth (get_self());

   check ( is_account (deposit_token_contract), "Provided deposit token contract is not a valid account: " + deposit_token_contract.to_string());
   check ( is_account (number_selector), "Provided number selector is not a valid account: " + number_selector.to_string());

   config_table      config_s (get_self(), get_self().value);
   config c = config_s.get_or_create (get_self(), config());
   c.deposit_token_contract = deposit_token_contract;
   c.deposit_symbol = deposit_symbol;
   c.number_selector = number_selector;
   config_s.set(c, get_self());
}
```

#### Accessing Configuration
From within an action, the configuration singleton can be accessed via:
```
config_table      config_s (get_self(), get_self().value);
config c = config_s.get_or_create (get_self(), config());
print ("Here is the number selector: ", c.number_selector.to_string(), "\n");
print ("Here is the active setting: ", c.settings[name("active")], "\n");
```

Configuration settings can be set in the settings map:
```
void configex::setsetting ( const name& setting_name, const uint8_t& setting_value ) {
   require_auth (get_self());

   config_table      config_s (get_self(), get_self().value);
   config c = config_s.get_or_create (get_self(), config());
   c.settings[setting_name] = setting_value;
   config_s.set(c, get_self());
}
```

#### Requiring Auth of Number Selector to Set Winning Numbers
Only the ```number_selector``` from the configuration is allowed to set winning numbers.
```
void configex::setwinnums () {
   
   config_table      config_s (get_self(), get_self().value);
   config c = config_s.get_or_create (get_self(), config());

   // ONLY the number_selector can set the winning numbers
   require_auth (c.number_selector);

   // .... set the numbers in the draw table record ...
}
```

### Testing
I use ```eoslime``` and ```mocha``` for testing.

EOSLime repo: https://github.com/limechain/eoslime
Mocha Tutorial: https://semaphoreci.com/community/tutorials/getting-started-with-node-js-and-mocha

```
mkdir tests
cd tests
yarn init   (accept defaults is fine)
yarn add eoslime
touch test.configex.js
```

The tests use Javascript/Nodejs to test the smart contracts. 

It requires running ```nodeos``` locally, which can be a default, single-node chain. It starts with a fresh blockchain each time it is run.  ```eoslime``` can use random account names so ```nodeos``` does not need to be restarted between test runs.

Start ```nodeos```:
```
nodeos -e -p eosio --plugin eosio::chain_api_plugin  --delete-all-blocks --contracts-console
```

See ```test.configex.js``` for the test cases.
To run tests:
```
mocha test.configex.js
```

Running the tests will generate the following output (although random account names will be different):
```
➜ mocha test.configex.js


  Configex Testing
 ConfigEx Account     :  l25e4ec35f43
 numberSelector       :  l35c31324311
 ticketBuyer1         :  l55521241b3f
 ticketBuyer2         :  l31e14513121
 ticketBuyer3         :  l1f14552a354
 ticketBuyer4         :  l1f14552a354
 ticketBuyer5         :  l1f14552a354

 Here is the contract configuration.
{"settings":[],"deposit_token_contract":"l113c52a2c22","deposit_symbol":"2,AUD","number_selector":"l35c31324311"}

    ✓ Tests configuration is properly set

 Here is the contract configuration.
{"settings":[{"key":"active","value":1}],"deposit_token_contract":"l113c52a2c22","deposit_symbol":"2,AUD","number_selector":"l35c31324311"}

    ✓ Tickets should not be purchasable if contract is paused (366ms)
    ✓ Winning numbers should only be settable by the number selector account (366ms)


  3 passing (6s)
```
