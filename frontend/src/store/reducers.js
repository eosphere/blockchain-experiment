import produce from 'immer';
import { SET_ACCOUNT, REFRESH } from './actions';

const initialState = { account: { name: '' }, refresh: '' };

const accountReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_ACCOUNT: {
        draft.account = action.payload;
        break;
      }
      case REFRESH: {
        draft.refresh = action.payload;
        break;
      }
      default:
        return draft;
    }
  });

export { accountReducer };
