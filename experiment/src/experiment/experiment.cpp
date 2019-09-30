#include <experiment.hpp>

void experiment::setconfig  ( const name& deposit_token_contract, const symbol& deposit_symbol, const name& number_selector ) {
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

void experiment::setsetting ( const name& setting_name, const uint8_t& setting_value ) {
   require_auth (get_self());

   config_table      config_s (get_self(), get_self().value);
   config c = config_s.get_or_create (get_self(), config());
   c.settings[setting_name] = setting_value;
   config_s.set(c, get_self());
}

void experiment::pause () {
   // illustrates setting of a setting
   setsetting ("active"_n, 0);
}

void experiment::activate () {
   setsetting ("active"_n, 1);
}

void experiment::createdraw () {

   config_table      config_s (get_self(), get_self().value);
   config c = config_s.get_or_create (get_self(), config());
   
   require_auth (c.number_selector);

   draw_table d_t (get_self(), get_self().value);
   d_t.emplace (get_self(), [&](auto &d) {
      d.drawnumber = d_t.available_primary_key();
   });
}

void experiment::closedraw (const uint64_t& drawnumber) {
   config_table      config_s (get_self(), get_self().value);
   config c = config_s.get_or_create (get_self(), config());
   
   require_auth (c.number_selector);

   draw_table d_t (get_self(), get_self().value);
   auto d_itr = d_t.find(drawnumber);
   check (d_itr != d_t.end(), "Draw " + std::to_string(drawnumber) + " not found.");
   check (d_itr->open, "Draw already closed.");

   d_t.modify(d_itr, get_self(), [&](auto& d){
      d.open = false;
      d.last_modified_date = current_block_time().to_time_point();
   });
}

void experiment::createticket (const name& purchaser, const uint64_t& drawnumber, const set<uint8_t> entrynumbers) {

   config_table      config_s (get_self(), get_self().value);
   config c = config_s.get_or_create (get_self(), config());

   // print (" Purchaser   : ", purchaser.to_string(), "\n");
   // print (" Draw Number : ", std::to_string(drawnumber), "\n");
   check (entrynumbers.size() == 6, "You must choose 6 entry numbers. You choose only " + std::to_string(entrynumbers.size()));
   for(auto i : entrynumbers) {
      // print (" Number : ", std::to_string(i), "\n");
      check (i > 0 && i <= 45, "Selected numbers must be between 1 and 45 inclusive. Your number: " + std::to_string(i));
   }
   
   // ensure not paused
   uint8_t paused = c.settings[name("active")];
   check (c.settings["active"_n] == 1, "Contract is not active. Exiting.");

   // ensure draw exists
   draw_table d_t (get_self(), get_self().value);
   auto d_itr = d_t.find (drawnumber);
   check (d_itr != d_t.end(), "Draw number not found: " + std::to_string(drawnumber));

   asset ticket_cost = asset { 100, c.deposit_symbol };  // ticket cost of 1 AUD

   // check purchaser's balance
   balance_table balances(get_self(), purchaser.value);
   auto b_itr = balances.find(c.deposit_symbol.code().raw());
   check (b_itr != balances.end(), "Purchaser (" + purchaser.to_string() + ") does not have a balance of required symbol");
   check (b_itr->funds >= ticket_cost, "Purchaser (" + purchaser.to_string() + ") has an insufficient balance. Required balance: " + 
      ticket_cost.to_string() + "; Available balance: " + b_itr->funds.to_string());
      
   // deduct from balance
   balances.modify(b_itr, get_self(), [&](auto& bal){
      bal.funds -= ticket_cost;
   });
   
   // add ticket
   ticket_table t_t (get_self(), get_self().value);
   t_t.emplace (get_self(), [&](auto &t) {
      t.serialno        = t_t.available_primary_key();
      t.purchaser       = purchaser;
      t.entrynumbers    = entrynumbers;
      t.drawnumber      = drawnumber;
      t.price           = ticket_cost;
   });
}

void experiment::setwinnums (const uint64_t& drawnumber, const set<uint8_t> winningnumbers) {
   
   config_table      config_s (get_self(), get_self().value);
   config c = config_s.get_or_create (get_self(), config());

   // ONLY the number_selector can set the winning numbers
   require_auth (c.number_selector);

   // set the numbers in the draw table record
   draw_table d_t (get_self(), get_self().value);
   auto d_itr = d_t.find (drawnumber);
   check (d_itr != d_t.end(), "Draw number not found: " + std::to_string(drawnumber));

   // require that set size is 6 and they are between 1 and 45 inclusive
   print ("Winning number size: ", std::to_string(winningnumbers.size()), "\n");
   check (winningnumbers.size() == 6, "You must choose 6 winning numbers. You choose only " + std::to_string(winningnumbers.size()));
   for(auto i : winningnumbers) {
      print (" Number : ", std::to_string(i), "\n");
      check (i > 0 && i <= 45, "Selected numbers must be between 1 and 45 inclusive. Your number: " + std::to_string(i));
   }

   d_t.modify (d_itr, get_self(), [&](auto &d){
      d.winningnumbers  = winningnumbers;
   });
}

void experiment::deposit ( const name& from, const name& to, const asset& quantity, const string& memo ) {

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

void experiment::withdraw (const name& account, const asset& quantity) {
   
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

void experiment::cancelticket(const name& purchaser, const uint64_t& serial_no){
   config_table      config_s (get_self(), get_self().value);
   config c = config_s.get_or_create (get_self(), config());
   
   // ensure not paused
   uint8_t paused = c.settings[name("active")];
   check (c.settings["active"_n] == 1, "Contract is not active. Exiting.");

   //check ticket
   ticket_table t_t (get_self(), get_self().value);
   auto t_itr = t_t.find (serial_no);
   check (t_itr != t_t.end(), "Ticket " + std::to_string(serial_no) + " not found");
   check (t_itr->ticket_status == PURCHASED, "Ticket cannot be cancelled.");

   //check purchaser if storeid is empty
   check (t_itr->purchaser.value == purchaser.value, "Ticket can only be cancelled by purchaser.");

   // ensure draw exists
   uint64_t draw_number = t_itr->drawnumber;
   draw_table d_t (get_self(), get_self().value);
   auto d_itr = d_t.find(draw_number);
   check (d_itr != d_t.end(), "Draw number " + std::to_string(draw_number) + " not found.");
   check (d_itr->open, "Draw already closed, cannot cancel the ticket.");

   //update ticket
   print ("\n");
   print ("cancelling ticket-->" + std::to_string(serial_no));
   print ("ticket status-->" + std::to_string(t_itr->ticket_status));
   t_t.modify(t_itr, get_self(), [&](auto& row){
      row.ticket_status = CANCELLED;
      row.last_modified_date = current_block_time().to_time_point();
   });

   print ("cancelled ticket-->" + std::to_string(serial_no));
   print ("ticket status-->" + std::to_string(t_itr->ticket_status));
   print ("\n");

   // refund
   asset ticket_cost = t_itr->price;
   balance_table balances(get_self(), purchaser.value);
   auto b_itr = balances.find(ticket_cost.symbol.code().raw());
   check (b_itr != balances.end(), "Currenty " + ticket_cost.symbol.code().to_string() + " not found in balance");
   balances.modify(b_itr, get_self(), [&](auto& bal){
      bal.funds += ticket_cost;
   });

   // if (b_itr != balances.end()) {
     
   // });
   // } else {
   //    balances.emplace(b_itr, get_self(), [&](auto& bal){
   //       bal.funds = ticket_cost;
   //       // need set the token_contract?
   //       //bal.token_contract = 
   //    });
   // }

}

// void experiment::updatewintkt(const set<serinal_tier> serinalno_tier){
//    //update ticket table, only can be perfomed by numberSelector account
// }

void experiment::claim(const uint64_t& serial_no){
   //validate the winning number
   //retrieve dividents from winning_dividens table
   //transfer winning amount
   //update ticket status to claimed
}

void experiment::updatediv( const uint64_t& drawnumber, const std::map<uint8_t, double> dividends){
   // account is number selector
   // draw is closed
}