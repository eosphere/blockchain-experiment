const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');     
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');                

const defaultPrivateKey = "5JNQzM2iBr9ZhV9DSAoYPjMSn7KxVYSGLRFNFjXwP9FKU34UDZ6"; // bob
const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);

const rpc = new JsonRpc("https://test.telos.kitchen", { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

async function setWinningNumbers () {

    const resultWithConfig = await api.transact(
        {
          actions: [
            {
              account: "experiment11",
              name: "setwinnums",
              authorization: [
                {
                  actor: "numberselect",
                  permission: 'active'
                }
              ],
              data: {
                drawnumber : 1, //please change according
                winningnumbers:[1,11,21,31,41,42]
              }
            }
          ]
        },
        {
          blocksBehind: 3,
          expireSeconds: 30
        }
      );

   
}

setWinningNumbers();