using EosSharp;
using EosSharp.Core.Api.v1;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;

namespace BlockChainLambda
{
    public class TicketHelper
    {
        public bool SendLogToConsole { get; set; } = true;
        public static int MaxAttempts { get; set; } = 1;

        public async Task<string> PurchaseTicket(Eos eos,int drawNumber, int[] ticket, string actionAccount, string actor, string ticketPurchaser)
        {

            string result="";
            int attempt = 1;

            while (string.IsNullOrEmpty(result))
            {
                try
                {
                    result = await eos.CreateTransaction(new Transaction()
                    {
                        actions = new List<EosSharp.Core.Api.v1.Action>()
                        {
                            new EosSharp.Core.Api.v1.Action()
                            {
                                account = actionAccount,
                                authorization = new List<PermissionLevel>()
                                {
                                    new PermissionLevel() {actor = actor, permission = "active" }
                                },
                                name = "createticket",
                                data = new
                                {
                                    purchaser = ticketPurchaser,
                                    drawnumber = drawNumber,
                                    entrynumbers = ticket,
                                }
                            }
                        }
                    });

                    if (SendLogToConsole)
                        Console.WriteLine($"Attempt {attempt}, CreateTicket -> Thread Id : {Thread.CurrentThread.ManagedThreadId}, Transaction Id : {result}");
                }
                catch (Exception ex)
                {
                    if (SendLogToConsole)
                        Console.WriteLine($"{ex.Message}. Ticket {TicketAsString(ticket)}");
                }
                if (++attempt > MaxAttempts)
                    break;
            }

            return result;
        }

        /// <summary>
        /// Generates a ticket. Default 6 number ticket. Each number between 1 and 45
        /// </summary>
        /// <param name="min"></param>
        /// <param name="max"></param>
        /// <returns></returns>
        /// 
        public int[] GenerateRandomTicket(int length = 6, int min=1, int max=45)
        {
            var rnd = new Random();
            int[] ticket = new int[length];
            int rndomNum = rnd.Next(min, max + 1);

            for (int i =0; i< length; i++)
            {
                while(ticket.Contains(rndomNum))
                    rndomNum = rnd.Next(min, max + 1);

                ticket[i] = rndomNum;                
            }

            return ticket;
        }

        private string TicketAsString(int[] ticket)
        {
            string stringTicket = "";

            foreach(int i in ticket)
            {
                stringTicket = stringTicket +"," + i;
            }

            return stringTicket;
        }
    }
}
