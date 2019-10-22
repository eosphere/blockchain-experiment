import { initDefaultAccessContext } from 'eos-transit';
import scatter from 'eos-transit-scatter-provider';
import { APP_NAME, NETWORK_HOST, NETWORK_PORT, NETWORK_PROTOCOL, NETWORK_CHAIN_ID } from 'utils';

// eslint-disable-next-line no-unused-vars
const walContext = initDefaultAccessContext({
  appName: APP_NAME,
  network: {
    host: NETWORK_HOST,
    port: NETWORK_PORT,
    protocol: NETWORK_PROTOCOL,
    chainId: NETWORK_CHAIN_ID
  },
  walletProviders: [scatter()]
});
