# Blockchain Lottery App

This is a react project which simulates a lottery game. Users can purchase tickets on the blockchain while Admin users can manage draws and payout winners.

https://eostabcorp.now.sh

<img width="500" alt="Screenshot" src="https://user-images.githubusercontent.com/3621147/67344329-21e5c680-f57b-11e9-9a9e-3694b09d6b39.png">

Languages / Framework / Dependenies used:

- Create-React-App for build configuration
- React for Frontend UI Layer
- Material UI for Component Framework
- EOS-Transit and EOS-Transit-Scatter for Blockchain wallet authentication and API interactions

### Prerequisites

To build and run this project it requires Node, npm/yarn and Scatter Desktop.

See links below to install:

- Node - https://nodejs.org/en/ - v11.14.0 recommended
- NPM / Yarn - https://yarnpkg.com/en/docs/install

#### Scatter setup

1. [Download scatter](https://get-scatter.com/) and open up the application and follow the prompts to create a vault.
2. Add the hub.area240.com network to scatter:

- Name: hub.area240.com
- Host: hub.area240.com
- Protocol: https
- Port: 443
- ChainID: XXX - See blockchain team for key.

3. Add the System Token

- Contract: experimtoken
- Symbol: SYS
- Decimals: 4

4. Import Key -> Text -> Enter key - See blockchain team for private key.

5. This will import your accounts into scatter and your ready to use the Frontend.

## Installation

```
git clone https://github.com/eosphere/blockchain-experiment.git
```

```
cd blockchain-experiment/frontend
```

```
yarn install
```

Duplicate the `example.env` and name to `.env` and set the `REACT_APP_NETWORK_CHAIN_ID` to chain ID (same as your scatter setup).

To start in development mode:

```
yarn start
```

To create production bundle which gets compiled in `/dist`:

```
yarn build
```

You can also deploy to [now.sh](https://zeit.co/guides/deploying-react-with-now-cra/). Make sure to update CHAIN_ID in the now.json file before deploying.

## References

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## License

This project is is open source software [licensed as MIT](https://github.com/facebook/create-react-app/blob/master/LICENSE).
