#include <eosio/eosio.hpp>

#include <eosio/symbol.hpp>
#include <eosio/multi_index.hpp>
#include <eosio/asset.hpp>

using std::string;
using namespace eosio;

CONTRACT drawmgr : public contract {
   public:
      using contract::contract;

      // table to maintain purchased tickets
      struct [[ eosio::table, eosio::contract("drawmgr") ]] tickets 
      {
         uint64_t                serialno                   ;
         string                  username                   ;
         uint8_t                 entrynumber[6]             ;
         uint64_t                drawnumber                 ;
         uint8_t                 winningtier                ;
         bool                    claimed                    ;
         asset                   price                      ;
         uint64_t                storeid                    ;
         block_timestamp_type    timestamp                  ;
         uint64_t primary_key() const { return serialno; }
      };
      typedef multi_index<"tickets"_n, tickets> tickets_table;

      // table to maintain draw data
      struct [[ eosio::table, eosio::contract("drawmgr") ]] draw 
      {
         uint64_t                drawnumber                 ;
         bool                    open                       ;
         uint64_t primary_key() const { return drawnumber; }
      };
      typedef multi_index<"draw"_n, draw> draw_table;

      // table to maintain users data
      struct [[ eosio::table, eosio::contract("drawmgr") ]] users 
      {
         string                username                    ;
         asset                 balance                     ;
         uint64_t              tickets[]                   ;
         string primary_key() const { return username; }
      };
      typedef multi_index<"users"_n, users> users_table;

};