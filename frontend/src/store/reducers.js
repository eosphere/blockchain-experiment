import produce from 'immer';
import {
  SET_ACCOUNT,
  REFRESH,
  SET_BANK_BALANCE,
  SET_REWARD_BALANCE,
  SET_WALLET_BALANCE,
  LOGOUT
} from './actions';

const initialState = {
  account: { name: '' },
  balances: { bank: '0 AUD', reward: '0 LOTT', wallet: '0 AUD' }
};

const accountReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_ACCOUNT: {
        draft.account.name = action.payload;
        break;
      }
      case REFRESH: {
        draft.refresh = action.payload;
        break;
      }
      case SET_BANK_BALANCE: {
        draft.balances.bank = action.payload;
        break;
      }
      case SET_REWARD_BALANCE: {
        draft.balances.reward = action.payload;
        break;
      }
      case SET_WALLET_BALANCE: {
        draft.balances.wallet = action.payload;
        break;
      }
      case LOGOUT: {
        return initialState;
      }
      default:
        return draft;
    }
  });

export { accountReducer };
