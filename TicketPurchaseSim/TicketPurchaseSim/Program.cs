using EosSharp;
using EosSharp.Core;
using EosSharp.Core.Api.v1;
using EosSharp.Core.Providers;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace TicketPurchaseSim
{
    class Program
    {
        static async Task Main(string[] args)
        {

           
            string httpEndpoint;

            

            if (args.Length > 0)
                httpEndpoint = args[0] ;
            else
                httpEndpoint = "https://hub.area240.com";

            Eos eos = new Eos(new EosConfigurator()
            {
                HttpEndpoint = httpEndpoint,
                //ChainId = "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
                ExpireSeconds = 60,
                SignProvider = new DefaultSignProvider(Constants.EOS.privateKey),
                blocksBehind = 3
            });

            int command=0;


            while(command != Constants.Commands.Exit)
            {
                command = PrintAcceptCommands();

                switch(command)
                {
                    case Constants.Commands.CreateDraw:
                        OpenDraw(eos);
                        break;
                    case Constants.Commands.RunPurchaseTicketSim:
                        RunPurchaseTicketSim(eos);
                        break;
                }
            }

          

           
        }

        private static int PrintAcceptCommands()
        {
            Console.WriteLine("Commands:");
            Console.WriteLine($"Create Draw  ({Constants.Commands.CreateDraw})");
            Console.WriteLine($"Run Purchase Simulator ({Constants.Commands.RunPurchaseTicketSim})");
            Console.WriteLine($"Exit ({Constants.Commands.Exit})");
            Console.Write($"Enter Command : ");
            var input = Console.ReadLine();
            int inputInt=0;
            Int32.TryParse(input, out inputInt);
            return inputInt;
        }

        private async static Task RunPurchaseTicketSim(Eos eos)
        {
            DateTime startTime = DateTime.Now;
            List<Task> tasks = new List<Task>();
            TicketHelper ticket = new TicketHelper();
            Console.Write("Input draw number :");
            string input = Console.ReadLine();
            int drawNumber;
            Int32.TryParse(input, out drawNumber);


            for (int i = 1; i <= Constants.EOS.maxPurchases; i++)
            {
                var task = ticket.PurchaseTicket(eos, drawNumber, ticket.GenerateRandomTicket(),
                    Constants.EOS.experimentContract, Constants.EOS.buyerAccount, Constants.EOS.buyerAccount);
                tasks.Add(task);
            }

            Console.WriteLine($"Published {Constants.EOS.maxPurchases} tickets. Total Time {(DateTime.Now - startTime).TotalMilliseconds} ms.");
            Task.WaitAll(tasks.ToArray());
            Console.WriteLine($"Tasks Completed in Total Time {(DateTime.Now - startTime).TotalMilliseconds} ms.");
            Console.ReadKey();
        }

        private async static Task OpenDraw(Eos eos)
        {
            try
            {
                var result = await eos.CreateTransaction(new Transaction()
                {
                    actions = new List<EosSharp.Core.Api.v1.Action>()
                        {
                            new EosSharp.Core.Api.v1.Action()
                            {
                                account = Constants.EOS.experimentContract,
                                authorization = new List<PermissionLevel>()
                                {
                                    new PermissionLevel() {actor =  Constants.EOS.numSelectAccount, permission = "active" }
                                },
                                name = "createdraw",
                                data = null
                            }
                        }
                });

                Console.WriteLine($"Created a draw. TransactionId {result}");

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception Occured {ex.Message}");
            }

        }

    }
}
