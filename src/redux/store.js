import { createStore, applyMiddleware } from 'redux';
import appReducer from './reducers/appReducer';
import thunkMiddleware from 'redux-thunk';

const store = createStore(appReducer, applyMiddleware(...[thunkMiddleware]));
export default store;
