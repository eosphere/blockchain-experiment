#include <eosio/eosio.hpp>

#include <eosio/symbol.hpp>
#include <eosio/multi_index.hpp>
#include <eosio/asset.hpp>

using std::string;
using namespace eosio;

CONTRACT drawmgr : public contract {
   public:
      using contract::contract;

      // table to maintain user balances
      struct [[ eosio::table, eosio::contract("drawmgr") ]] tickets 
      {
         uint64_t                serialno                   ;
         string                  username                   ;
         uint64_t primary_key() const { return serialno; }
      };
      typedef multi_index<"tickets"_n, tickets> tickets_table;

};