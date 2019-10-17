### Dependencies
1.  Install .Net Core 2.1
```
[.Net Core 2.1](https://dotnet.microsoft.com/download/dotnet-core/2.1 ".Net Core 2.1")
```
1.  AWS Lambda Tools (Run command from shell)
```
dotnet tool install -g Amazon.Lambda.Tools
```

### Build
In shell, go the project folder (having BlockChainLambda.csproj file), execute below command:
```
dotnet lambda package
```
This will compile and create a zip file in bin\Release\netcoreapp2.1 folder.

### Deploy in AWS
```
Create Lambda "BuyTicket".
Set Function Code
	Code Entry Type: zip
	Function package: Upload above created zip file.
	RunTime: .NET Core 2.1
	Handler: BlockChainLambda::BlockChainLambda.Simulators::BuyTicket
Set the appropriate roles.
Set the Lambda to be invoked from API Gateway. Name the API as "BuyTicket-API"
Goto to the staging variables of "BuyTicket-API", add a variable "httpEndpoint", set its value to the chain's api endpoint.
```
```
Create Lambda "BuyTicketLoadTest".
Set Function Code
	Code Entry Type: zip
	Function package: Upload above created zip file.
	RunTime: .NET Core 2.1
	Handler: BlockChainLambda::BlockChainLambda.Simulators::BuyTicketLoadTest
Set the appropriate roles.
Set the Lambda to be invoked from API Gateway. Name the API as "BuyTicketLoadTest-API"
Goto to the staging variables of "BuyTicketLoadTest-API", add a variable "BuyTicketAPI", set its value to the "BuyTicket-API" url.
```
### Run Load Test
```
Invoke "BuyTicket-API" url with query parameters: 
	drawno
	ticketspercall
	totalcalls
	contract
	buyer
```
### Single API Test
```
Invoke "BuyTicket" url with query parameters: 
	drawno
	totaltickets
	contract
	buyer
```