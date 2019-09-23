#include <eosio/eosio.hpp>

#include <eosio/symbol.hpp>
#include <eosio/singleton.hpp>
#include <eosio/multi_index.hpp>

using namespace eosio;

CONTRACT configex : public contract {
   public:
      using contract::contract;

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
      // this config placeholder makes it easier to query parameters (bug in EOSIO?)
      typedef multi_index<"configs"_n, config> config_placeholder;

      // action signatures (these inform the contract ABI which actions can be invoked)
      ACTION setconfig ( const name& deposit_token_contract, const symbol& deposit_symbol, const name& number_selector );
      ACTION setsetting ( const name& setting_name, const uint8_t& setting_value );
      ACTION pause ();
      ACTION activate ();

      // placeholders
      ACTION createticket ();
      ACTION setwinnums ();
};