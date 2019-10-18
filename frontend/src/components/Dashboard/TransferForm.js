import React from 'react';
import { Box, TextField, MenuItem, makeStyles } from '@material-ui/core';
import { CURRENCY_LIST } from 'utils';

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
      <TextField
        id="from"
        label="From"
        value={values.from}
        // onChange={onChange('from')}
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
        // onChange={onChange('to')}
        className={classes.textField}
        margin="normal"
        InputLabelProps={{
          readOnly: true,
          shrink: true
        }}
      />
      <TextField
        id="quantity"
        label="Quantity"
        value={values.quantity}
        onChange={onChange('quantity')}
        type="number"
        className={classes.textField}
        margin="normal"
        InputLabelProps={{
          shrink: true
        }}
      />
      <TextField
        id="standard-select-currency"
        select
        label="Currency"
        className={classes.textField}
        value={values.currency}
        onChange={onChange('currency')}
        helperText="Please select your currency">
        {CURRENCY_LIST.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
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
    </Box>
  );
};

export default TransferForm;
