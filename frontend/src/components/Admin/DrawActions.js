import React from 'react';
import { useSelector } from 'react-redux';
import CloseDraw from './CloseDraw';
import SetNumbers from './SetNumbers';

const DrawActions = props => {
  const accountName = useSelector(state => state.currentAccount.account.name);
  if (accountName !== 'numberselect') return null;
  const { draw, wallet } = props;
  const { drawnumber, open, winningnumbers } = draw;

  return (
    <>
      {open ? <CloseDraw wallet={wallet} drawnumber={drawnumber} /> : null}
      {!open && winningnumbers.length === 0 ? (
        <SetNumbers wallet={wallet} drawnumber={drawnumber} />
      ) : null}
    </>
  );
};

export default DrawActions;
