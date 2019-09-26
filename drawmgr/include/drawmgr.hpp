#include <eosio/eosio.hpp>

#include <eosio/symbol.hpp>
#include <eosio/singleton.hpp>
#include <eosio/multi_index.hpp>
#include <vector>

using namespace eosio;

CONTRACT drawmgr : public contract {
   public:
      using contract::contract;

      [[eosio::action]] void create(const name &drawer, const int &draw_number, const std::string &signature, const std::string &winning_num);

   private:

      struct [[eosio::table]] winnumber
      {
         int draw_num;
         std::vector<int> winning_num;
         std::string signature;
         time_t create_timestamp;

         uint64_t primary_key() const { return draw_num; }
      };
      
      typedef multi_index<"winnumbers"_n, winnumber> winning_numbers;

      void validate_winning_number(const std::string signature, const std::string winning_num);
};