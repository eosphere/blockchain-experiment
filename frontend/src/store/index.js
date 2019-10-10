import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

const reducer = () => {};

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();
// mount it on the Store
const store = createStore(reducer, applyMiddleware(sagaMiddleware));

// then run the saga
// sagaMiddleware.run();

export default store;
