export const SET_ACCOUNT = 'SET_ACCOUNT';

export function setAccount(account) {
  return {
    type: SET_ACCOUNT,
    payload: account
  };
}
