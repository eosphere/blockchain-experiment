import produce from 'immer';
import { SET_ACCOUNT } from './actions';

const initialState = { account: { name: '' } };

const accountReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_ACCOUNT: {
        draft.account = action.payload;
        break;
      }
      default:
        return draft;
    }
  });

export { accountReducer };
