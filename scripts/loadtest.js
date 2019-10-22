require('./config.js');
const fetch = require("node-fetch");
var uri = loadTestURI.replace("{0}", drawno)
			.replace("{1}",ticketsPerCall)
			.replace("{2}",totalCalls)
			.replace("{3}",account)
			.replace("{4}",buyer);

function InvokeLoadTestLambda()
{
	console.log("Invoking " + uri);
	
	fetch(uri)
		.then(response => console.log(response))
		.catch(err => console.error(err));
}

setInterval(InvokeLoadTestLambda, interval);

	
