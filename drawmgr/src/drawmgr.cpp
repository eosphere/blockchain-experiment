#include <drawmgr.hpp>
#include <vector>

void drawmgr::create (const name& drawer,const int &draw_number, const std::string &signature, const std::string &winning_num) {
   require_auth( get_self() );

   //validate winning numbers
   validate_winning_number(signature, winning_num);
   //check existing of draw number

   //insert new draw number

}

 void drawmgr::validate_winning_number(const std::string signature, const std::string winning_num) {
      //TODO:
      print("validating winning numbers...");
 }