using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using EosSharp;
using EosSharp.Core;
using EosSharp.Core.Providers;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]
namespace BlockChainLambda
{
    public class Simulators
    {

        /// <summary>
        /// Calls BuyTicket cleos function
        /// </summary>
        /// <param name="req"></param>
        /// <param name="context"></param>
        /// <returns></returns>
        public APIGatewayProxyResponse BuyTicket(APIGatewayProxyRequest req, ILambdaContext context)
        {
            string httpEndpoint;
            int drawNo, totalTickets;
            string  contract, buyer, message;

            if (req.StageVariables != null && req.StageVariables.ContainsKey("httpEndpoint"))
                httpEndpoint = req.StageVariables["httpEndpoint"];
            else
                httpEndpoint = Constants.EOS.endPoint;
            
            if (req.QueryStringParameters == null || !req.QueryStringParameters.ContainsKey("drawno")
                    || !req.QueryStringParameters.ContainsKey("totaltickets") || !req.QueryStringParameters.ContainsKey("contract")
                    || !req.QueryStringParameters.ContainsKey("buyer"))
            {
                message = "Missing input query params. Mandatory params : drawno, totaltickets, contract, buyer";
            }
            else
            {
                Int32.TryParse(req.QueryStringParameters["drawno"], out drawNo);
                Int32.TryParse(req.QueryStringParameters["totaltickets"], out totalTickets);
                contract = req.QueryStringParameters["contract"];
                buyer = req.QueryStringParameters["buyer"];

                Eos eos = new Eos(new EosConfigurator()
                {
                    HttpEndpoint = httpEndpoint,
                    ExpireSeconds = 60,
                    SignProvider = new DefaultSignProvider(Constants.EOS.privateKey),
                    blocksBehind = 3
                });

                RunPurchaseTicketSim(eos, drawNo, totalTickets, contract, buyer);

                message = $"Initiated {totalTickets} tickets purchase for draw: {drawNo}, contract: {contract}, buyer: {buyer} @endpoint {httpEndpoint}, RequestId: {context.AwsRequestId}";
            }  
            

            return new APIGatewayProxyResponse() { StatusCode = 200, Body = message};
        }

        public APIGatewayProxyResponse BuyTicketLoadTest(APIGatewayProxyRequest req, ILambdaContext context)
        {
            int drawNo, ticketsPerCall, totalCalls;
            string contract, buyer, message, buyTicketAPI="";

            if (req.StageVariables != null && req.StageVariables.ContainsKey("BuyTicketAPI"))
                buyTicketAPI = req.StageVariables["BuyTicketAPI"];

            if (req.QueryStringParameters == null || !req.QueryStringParameters.ContainsKey("drawno")
                    || !req.QueryStringParameters.ContainsKey("ticketspercall") || !req.QueryStringParameters.ContainsKey("totalcalls")
                    || !req.QueryStringParameters.ContainsKey("contract") || !req.QueryStringParameters.ContainsKey("buyer") 
                    || buyTicketAPI == "")
            {
                if(buyTicketAPI == "")
                    message = "Missing staging variable 'BuyTicketAPI'";
                else
                    message = "Missing input query params. Mandatory params : drawno, ticketspercall,totalcalls, contract, buyer";
            }
            else
            {
                Int32.TryParse(req.QueryStringParameters["drawno"], out drawNo);
                Int32.TryParse(req.QueryStringParameters["ticketspercall"], out ticketsPerCall);
                Int32.TryParse(req.QueryStringParameters["totalcalls"], out totalCalls);
                contract = req.QueryStringParameters["contract"];
                buyer = req.QueryStringParameters["buyer"];

                buyTicketAPI = buyTicketAPI.AddQueryToURL("drawno", drawNo.ToString())
                                .AddQueryToURL("totaltickets", ticketsPerCall.ToString())
                                .AddQueryToURL("contract", contract)
                                .AddQueryToURL("buyer", buyer);

                RunLoadTest(totalCalls, buyTicketAPI);

                message = $"Initiated Load Test for Total Calls : {totalCalls}, ticketspercall: {ticketsPerCall}, draw: {drawNo}, contract: {contract}, buyer: {buyer}";
            }


            return new APIGatewayProxyResponse() { StatusCode = 200, Body = message };
        }

       

        private void RunPurchaseTicketSim(Eos eos, int drawNumber, int totalTickets, string contract, string buyer)
        {
            DateTime startTime = DateTime.Now;
            List<Task> tasks = new List<Task>();
            TicketHelper ticket = new TicketHelper();
           
            for (int i = 1; i <= totalTickets; i++)
            {
                var task = ticket.PurchaseTicket(eos, drawNumber, ticket.GenerateRandomTicket(),
                    contract, buyer, buyer);
                tasks.Add(task);
            }

            Console.WriteLine($"Published {totalTickets} tickets. Total Time {(DateTime.Now - startTime).TotalMilliseconds} ms.");
            Task.WaitAll(tasks.ToArray());
            Console.WriteLine($"Tasks Completed in Total Time {(DateTime.Now - startTime).TotalMilliseconds} ms.");
        }

        private void RunLoadTest(int totalCalls, string apiURL)
        {
            DateTime startTime = DateTime.Now;
            HttpClient httpClient = new HttpClient();
            httpClient.BaseAddress = new Uri(apiURL);
            List<Task> tasks = new List<Task>();
            
            for (int i = 1; i <= totalCalls; i++)
            {
                var task = httpClient.GetAsync("");
                tasks.Add(task);
            }

            Console.WriteLine($"Started Load Test. Total calls {totalCalls}, Api {apiURL}. Total Time {(DateTime.Now - startTime).TotalMilliseconds} ms.");
            Task.WaitAll(tasks.ToArray());
            Console.WriteLine($"Completed Load Test.  Total Time {(DateTime.Now - startTime).TotalMilliseconds} ms.");
        }
    }
}
