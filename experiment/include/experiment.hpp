#include <eosio/eosio.hpp>

#include <eosio/symbol.hpp>
#include <eosio/singleton.hpp>
#include <eosio/multi_index.hpp>
#include <eosio/asset.hpp>

using std::string;
using std::set;
using namespace eosio;

CONTRACT experiment : public contract {

   private:
      enum ticket_status: int8_t {
         PURCHASED = 0,
         CANCELLED = 1,
         CLAIMED = 2
      };

   public:
      using contract::contract;

      struct [[ eosio::table, eosio::contract("experiment") ]] config
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
      struct [[ eosio::table, eosio::contract("experiment") ]] balance 
      {
         asset                   funds                      ;
         name                    token_contract             ;
         uint64_t primary_key() const { return funds.symbol.code().raw(); }
      };
      typedef multi_index<"balances"_n, balance> balance_table;

      // table to maintain purchased tickets
      struct [[ eosio::table, eosio::contract("experiment") ]] ticket 
      {
         uint64_t                serialno                   ;
         name                    purchaser                  ;
         set<uint8_t>            entrynumbers               ;
         uint64_t                drawnumber                 ;
         uint8_t                 winningtier                ;
         //bool                    claimed                    = false;
         int8_t                  ticket_status              = PURCHASED;
         asset                   price                      ;
         uint64_t                storeid                    ;
         time_point              created_date               = current_block_time().to_time_point();
         uint64_t primary_key() const { return serialno; }
         uint64_t by_purchaser() const { return purchaser.value; }
      };

      typedef multi_index<"tickets"_n, ticket,
         indexed_by<"byuser"_n, 
            const_mem_fun<ticket, uint64_t, &ticket::by_purchaser>>
      > ticket_table;

      // table to maintain draw data
      struct [[ eosio::table, eosio::contract("experiment") ]] draw 
      {
         uint64_t                drawnumber                 ;
         set<uint8_t>            winningnumbers             ;
         bool                    open                       = true;
         time_point              created_date               = current_block_time().to_time_point();
         uint64_t primary_key() const { return drawnumber; }
      };
      typedef multi_index<"draws"_n, draw> draw_table;

      // table to maintain dividend
      struct [[ eosio::table, eosio::contract("experiment") ]] dividend
      {
         uint64_t                      drawnumber           ;
         // winningtier and dividend map
         std::map<uint8_t, double>     settings             ;
      };
      typedef multi_index<"dividends"_n, dividend> dividend_table;

      // action signatures (these inform the contract ABI which actions can be invoked)
      ACTION setconfig ( const name& deposit_token_contract, const symbol& deposit_symbol, const name& number_selector );
      ACTION setsetting ( const name& setting_name, const uint8_t& setting_value );
      ACTION pause ();
      ACTION activate ();
      
      ACTION createdraw ();
      ACTION createticket (const name& purchaser, const uint64_t& drawnumber, const set<uint8_t> entrynumbers);
      ACTION setwinnums (const uint64_t& drawnumber, const set<uint8_t> winningnumbers);

      // deposit handler -- this triggers whenever the contract receives tokens
      [[eosio::on_notify("*::transfer")]]
      void deposit ( const name& from, const name& to, const asset& quantity, const string& memo );

      ACTION withdraw ( const name& account, const asset& quantity );

      //update ticket status from ticket table, refund
      ACTION cancelticket( const uint64_t& serial_no );

      //update ticket by winning number
      ACTION updatewins( const set<uint64_t> serial_no );
      
      //update ticket status and pay
      ACTION claim( const uint64_t& serial_no );


};