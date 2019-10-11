import { initDefaultAccessContext } from 'eos-transit';
import scatter from 'eos-transit-scatter-provider';

const appName = process.env.REACT_APP_APP_NAME;
const host = process.env.REACT_APP_NETWORK_HOST;
const port = process.env.REACT_APP_NETWORK_PORT;
const protocol = process.env.REACT_APP_NETWORK_PROTOCOL;
const chainId = process.env.REACT_APP_NETWORK_CHAIN_ID;

// eslint-disable-next-line no-unused-vars
const walContext = initDefaultAccessContext({
  appName,
  network: {
    host,
    port,
    protocol,
    chainId
  },
  walletProviders: [scatter()]
});
