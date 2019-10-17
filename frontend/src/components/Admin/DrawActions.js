import React from 'react';
import { Box, Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import CloseDraw from './CloseDraw';

const DrawActions = props => {
  const accountName = useSelector(state => state.currentAccount.account.name);
  if (accountName !== 'numberselect') return null;
  const { draw, wallet } = props;
  const { drawnumber, open, winningnumbers } = draw;

  return (
    <Box display="flex" justifyContent="space-between">
      {open ? <CloseDraw wallet={wallet} drawnumber={drawnumber} /> : null}
      {!open && winningnumbers.length === 0 ? (
        <Button variant="contained" color="primary" size="small">
          Set numbers
        </Button>
      ) : null}
    </Box>
  );
};

export default DrawActions;
