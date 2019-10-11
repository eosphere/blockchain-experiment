import React from 'react';
import { TOKEN_SMARTCONTRACT } from '../utils';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    margin: '0 10px'
  }
}));

const Text = ({ funds }) => {
  const classes = useStyles();

  return (
    <Typography variant="body1" className={classes.root}>
      {funds.includes('AUD') && '$'}
      {funds}
    </Typography>
  );
};

class Balance extends React.PureComponent {
  state = {
    loading: true,
    data: {}
  };

  async componentDidMount() {
    const { wallet } = this.props;
    console.log(wallet);
    const name = wallet.accountInfo.account_name;
    const response = await wallet.eosApi.rpc.get_table_rows({
      json: true,
      code: TOKEN_SMARTCONTRACT,
      scope: name,
      table: 'balances'
    });
    const { rows } = response;
    const data = rows[0] || rows;
    this.setState({ data, loading: false });
  }

  render() {
    const { data, loading } = this.state;
    const { funds } = data;
    if (loading) return null;
    return <Text funds={funds} />;
  }
}

export default Balance;
