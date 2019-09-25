#include <depositmgr.hpp>

void depositmgr::setconfig  ( const name& deposit_token_contract, const symbol& deposit_symbol, const name& number_selector ) {
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

void depositmgr::setsetting ( const name& setting_name, const uint8_t& setting_value ) {
   require_auth (get_self());

   config_table      config_s (get_self(), get_self().value);
   config c = config_s.get_or_create (get_self(), config());
   c.settings[setting_name] = setting_value;
   config_s.set(c, get_self());
}

void depositmgr::pause () {
   // illustrates setting of a setting
   setsetting ("active"_n, 0);
}

void depositmgr::activate () {
   setsetting ("active"_n, 1);
}

void depositmgr::createticket () {

   config_table      config_s (get_self(), get_self().value);
   config c = config_s.get_or_create (get_self(), config());
   
   // illustrates how settings are used
   // do not allow ticket creation when contract is paused
   // NOTE:: default value for a settings that does not exist in 0 (ZERO)
   uint8_t paused = c.settings[name("active")];
   check (c.settings["active"_n] == 1, "Contract is not active. Exiting.");

   // ...  create the ticket record and deduct from user's balance ...
}

void depositmgr::setwinnums () {
   
   config_table      config_s (get_self(), get_self().value);
   config c = config_s.get_or_create (get_self(), config());

   // ONLY the number_selector can set the winning numbers
   require_auth (c.number_selector);

   // .... set the numbers in the draw table record ...
}

void depositmgr::deposit ( const name& from, const name& to, const asset& quantity, const string& memo ) {

   // this is the contract housing the token contract
   name token_contract = get_first_receiver();

   // ensure that the symbol and token contract match acceptable configuration
   config_table      config_s (get_self(), get_self().value);
   config c = config_s.get_or_create (get_self(), config());
   check (quantity.symbol == c.deposit_symbol, "Only deposits of configured symbol are allowed. You sent: " + quantity.to_string());
   check (token_contract == c.deposit_token_contract, "Only deposits from configured token contract are allowed. You sent from: " 
      + token_contract.to_string() + "; Configured contract: " + c.deposit_token_contract.to_string());

   balance_table balances(get_self(), from.value);
   asset new_balance;
   auto it = balances.find(quantity.symbol.code().raw());
   if(it != balances.end()) {
      check (it->token_contract == token_contract, "Transfer does not match existing token contract.");
      balances.modify(it, get_self(), [&](auto& bal){
         bal.funds += quantity;
         new_balance = bal.funds;
      });
   } else {
      balances.emplace(get_self(), [&](auto& bal){
         bal.funds = quantity;
         bal.token_contract  = token_contract;
         new_balance = quantity;
      });
   }

   print ("\n");
   print(name{from}, " deposited:       ", quantity, "\n");
   print(name{from}, " funds available: ", new_balance);
   print ("\n");
}

void depositmgr::withdraw (const name& account, const asset& quantity) {
   
   require_auth (account);
   
   balance_table balances(get_self(), account.value);
   auto b_itr = balances.find(quantity.symbol.code().raw());

   // check that the account has a balance record
   check (b_itr != balances.end(), "Account " + account.to_string() + " does not have a balance of symbol matching " + quantity.to_string());

   // ensure account has enough funds to withdraw
   check (b_itr->funds >= quantity, "Overdrawn balance. Available balance is: " + b_itr->funds.to_string() + ". You requested: " + quantity.to_string());

   // update table
   bool remove_record = false;
   balances.modify (b_itr, get_self(), [&](auto &b) {
      if (b.funds == quantity) {
         remove_record = true;
      }
      b.funds -= quantity;
   });
  
   if (remove_record) {
      balances.erase (b_itr);
   }

   // send tokens
   string memo { "Withdrawal from account: " + get_self().to_string() };
   action(
      permission_level{get_self(), "active"_n},
      b_itr->token_contract, "transfer"_n,
      std::make_tuple(get_self(), account, quantity, memo))
   .send();
}
