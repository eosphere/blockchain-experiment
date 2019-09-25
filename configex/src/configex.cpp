#include <configex.hpp>

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

void configex::setsetting ( const name& setting_name, const uint8_t& setting_value ) {
   require_auth (get_self());

   config_table      config_s (get_self(), get_self().value);
   config c = config_s.get_or_create (get_self(), config());
   c.settings[setting_name] = setting_value;
   config_s.set(c, get_self());
}

void configex::pause () {
   // illustrates setting of a setting
   setsetting ("active"_n, 0);
}

void configex::activate () {
   setsetting ("active"_n, 1);
}

void configex::createticket (const name& buyer) {

   // require_auth (buyer);
   // check (has_auth (buyer) || has_auth(terminal), "Permission denied");

   config_table      config_s (get_self(), get_self().value);
   config c = config_s.get_or_create (get_self(), config());

   // illustrates how settings are used
   // do not allow ticket creation when contract is paused
   // NOTE:: default value for a settings that does not exist in 0 (ZERO)
   uint8_t paused = c.settings[name("active")];
   check (c.settings["active"_n] == 1, "Contract is not active. Exiting.");

   // ...  create the ticket record and deduct from user's balance ...
}

void configex::setwinnums () {
   
   config_table      config_s (get_self(), get_self().value);
   config c = config_s.get_or_create (get_self(), config());

   // ONLY the number_selector can set the winning numbers
   require_auth (c.number_selector);

   // .... set the numbers in the draw table record ...
}