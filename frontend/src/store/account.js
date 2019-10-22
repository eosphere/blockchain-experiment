import produce from 'immer';

export const SET_ACCOUNT = 'SET_ACCOUNT';
export const REFRESH_DASHBOARD = 'REFRESH_DASHBOARD';
export const SET_BALANCE = 'SET_BANK_BALANCE';
export const LOGOUT = 'LOGOUT';

export const setAccount = name => ({
  type: SET_ACCOUNT,
  payload: name
});

export const refreshDashoard = from => ({
  type: REFRESH_DASHBOARD,
  payload: from
});

export const setBalance = (value, id) => ({
  type: SET_BALANCE,
  payload: value,
  id
});

export const logout = () => ({
  type: LOGOUT
});

const initialState = {
  account: { name: '' },
  balances: { bank: '0 AUD', reward: '0 LOTT', wallet: '0 AUD' }
};

const accountReducer = (state = initialState, action) =>
  produce(state, draft => {
    const { payload = '' } = action;
    switch (action.type) {
      case SET_ACCOUNT: {
        draft.account.name = payload;
        break;
      }
      case REFRESH_DASHBOARD: {
        draft.refresh = payload;
        break;
      }
      case SET_BALANCE: {
        draft.balances[action.id] = payload;
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
