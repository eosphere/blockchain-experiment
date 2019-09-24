#include <eosio/eosio.hpp>

#include <eosio/symbol.hpp>
#include <eosio/singleton.hpp>
#include <eosio/multi_index.hpp>
#include <eosio/asset.hpp>

using std::string;
using namespace eosio;

CONTRACT depositmgr : public contract {
   public:
      using contract::contract;

      struct [[ eosio::table, eosio::contract("depositmgr") ]] config
      {
         // a general purpose settings map
         std::map<name, uint8_t>     settings               ;

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

      // table to maintain user balances
      struct [[ eosio::table, eosio::contract("depositmgr") ]] balance 
      {
         asset                   funds                      ;
         name                    token_contract             ;
         uint64_t primary_key() const { return funds.symbol.code().raw(); }
      };
      typedef multi_index<"balances"_n, balance> balance_table;

      // action signatures (these inform the contract ABI which actions can be invoked)
      ACTION setconfig ( const name& deposit_token_contract, const symbol& deposit_symbol, const name& number_selector );
      ACTION setsetting ( const name& setting_name, const uint8_t& setting_value );
      ACTION pause ();
      ACTION activate ();
      
      // placeholders
      ACTION createticket ();
      ACTION setwinnums ();

      // deposit handler -- this triggers whenever the contract receives tokens
      [[eosio::on_notify("*::transfer")]]
      void deposit ( const name& from, const name& to, const asset& quantity, const string& memo );

      ACTION withdraw (const name& account, const asset& quantity);
};