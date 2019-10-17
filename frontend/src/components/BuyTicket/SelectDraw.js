import React from 'react';
import { makeStyles, InputLabel, MenuItem, FormControl, Select } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 280
  }
}));

const SelectDraw = props => {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    draw: ''
  });
  const { draws } = props;
  const handleChange = event => {
    setValues(() => ({
      [event.target.name]: event.target.value
    }));
    props.onClick(event.target.value);
  };
  return (
    <form className={classes.root} autoComplete="off">
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="draw">Choose a Draw</InputLabel>
        <Select
          value={values.draw}
          onChange={handleChange}
          inputProps={{
            name: 'draw',
            id: 'draw'
          }}>
          {draws.map(({ drawnumber }) => (
            <MenuItem key={drawnumber} value={drawnumber}>
              Draw Number {drawnumber}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </form>
  );
};
export default SelectDraw;
