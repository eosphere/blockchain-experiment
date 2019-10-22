import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import { accountReducer } from './account';
import { isProduction } from 'utils';

const rootReducer = combineReducers({
  currentAccount: accountReducer
});

const loggerMiddleware = createLogger();

export default function configureStore() {
  const middlewares = isProduction ? [] : [loggerMiddleware];
  const middleWareEnhancer = applyMiddleware(...middlewares);
  return createStore(rootReducer, composeWithDevTools(middleWareEnhancer));
}
