using System;
using System.Collections.Generic;
using System.Text;

namespace TicketPurchaseSim
{
    public class Constants
    {
        public static class Commands
        {
            public const int Exit = 99;
            public const int CreateDraw = 1;
            public const int RunPurchaseTicketSim = 2;
        }

        public static class EOS
        {
            public const string privateKey = "5Ke3bVZBoyixVhhFtXUNPHn1fiDAYsPdi7L9CcBmL5aQrUCrGhN";
            public const string experimentContract = "experiment13";
            public const string tokenContract = "experimtoken";
            public const string buyerAccount = "ticketbuyer4";
            public const string numSelectAccount = "numberselect";

            public const int maxPurchases = 100;
        }
    }
}
