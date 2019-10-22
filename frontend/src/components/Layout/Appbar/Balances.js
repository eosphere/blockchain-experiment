import React from 'react';
import { useSelector } from 'react-redux';
import { MdAccountBalance, MdAccountBalanceWallet } from 'react-icons/md';
import BalanceChip from './BalanceChip';
import { LottCoin } from 'components/Dashboard';

const Balances = () => {
  const { bank, reward, wallet } = useSelector(state => state.currentAccount.balances);
  return (
    <>
      <BalanceChip type="bank" value={bank} icon={<MdAccountBalance size="20px" />} />
      <BalanceChip type="reward" value={reward} icon={<LottCoin width="30px" noMargin={true} />} />
      <BalanceChip type="wallet" value={wallet} icon={<MdAccountBalanceWallet size="20px" />} />
    </>
  );
};

export default Balances;
