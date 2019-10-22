import React from 'react';
import { Box, TextField, InputAdornment, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    minWidth: 300,
    width: '100%'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

const TransferForm = props => {
  const classes = useStyles();
  const { handleChange, from, to, quantity, currency, memo } = props;
  const currencySymbol = currency === 'AUD' ? '$' : 'Ł';
  const [values, setValues] = React.useState({
    from,
    to,
    quantity,
    currency,
    memo
  });
  const onChange = name => event => {
    const newValues = { ...values, [name]: event.target.value };
    setValues({ ...values, [name]: event.target.value });
    handleChange(newValues);
  };

  return (
    <Box className={classes.container} display="flex" flexDirection="column">
      {false && (
        <>
          <TextField
            id="from"
            label="From"
            value={values.from}
            className={classes.textField}
            margin="normal"
            InputLabelProps={{
              readOnly: true,
              shrink: true
            }}
          />
          <TextField
            id="to"
            label="To"
            value={values.to}
            className={classes.textField}
            margin="normal"
            InputLabelProps={{
              readOnly: true,
              shrink: true
            }}
          />
        </>
      )}
      <TextField
        id="amount"
        label="Amount"
        value={values.quantity}
        onChange={onChange('quantity')}
        type="number"
        className={classes.textField}
        margin="normal"
        InputLabelProps={{
          shrink: true
        }}
        InputProps={{
          startAdornment: <InputAdornment position="start">{currencySymbol}</InputAdornment>,
          endAdornment: <InputAdornment position="end">{currency}</InputAdornment>
        }}
      />
      {false && (
        <>
          <TextField
            id="memo"
            label="Memo"
            value={values.memo}
            onChange={onChange('memo')}
            className={classes.textField}
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
          />
        </>
      )}
    </Box>
  );
};

export default TransferForm;
