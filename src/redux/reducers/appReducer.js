import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { adminReducer } from './adminReducer';

const appReducer = combineReducers({
  auth: authReducer,
  admin: adminReducer,
});

export default appReducer;
