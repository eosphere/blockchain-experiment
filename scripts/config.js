const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');     
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');  

global.crypto = require ('crypto');          
global.defaultPrivateKey = "5JNQzM2iBr9ZhV9DSAoYPjMSn7KxVYSGLRFNFjXwP9FKU34UDZ6"; // experiment13
//"5Ke3bVZBoyixVhhFtXUNPHn1fiDAYsPdi7L9CcBmL5aQrUCrGhN"; // experiment13
//5JNQzM2iBr9ZhV9DSAoYPjMSn7KxVYSGLRFNFjXwP9FKU34UDZ6 //local
global.signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
global.url = "http://localhost:8888";
//http://vsemppoceosbp1.area240.com:8888
//http://localhost:8888
global.rpc = new JsonRpc(url, { fetch });
global.api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

global.range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));

global.drawno  = 2;
global.account = "experiment11";
global.min_winning_tier = 1;
global.max_winning_tier = 4;
global.default_symbol = "2,AUD";