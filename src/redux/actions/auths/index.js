import authService from '../../../services/auth-service';
import store from '../../store';
import {
  authInit,
  authSuccess,
  authFailure,
  voucherAuthInit,
  voucherAuthSuccess,
  voucherAuthFailure,
} from './actions';

const login = (data) => {
  return async (dispatch) => {
    dispatch(authInit());
    try {
      const authResponse = await authService.login(data.email, data.password);
      authService.storeJwt(authResponse.data);

      dispatch(
        authSuccess({
          currentUser: authService.getCurrentUser(),
          signedInForAdminRole: false,
        })
      );
    } catch (error) {
      dispatch(authFailure());
      console.log(error);
    }
  };
};

// IMPLEMENT A LOGIC FOR SIGNING 2ND TIME FOR CREATING A VOUCHER,
// IF VOUCHER LOGIN DIFFERENT FROM THE CURRENT USER, LOGOUT THE USER (IMPERSONATION)
const voucherSignIn = (data) => {
  return async (dispatch) => {
    dispatch(voucherAuthInit());
    try {
      const authResponse = await authService.login(data.email, data.password);

      const result = authService.getJwt();
      const { id, imageUrl, name, username } = authResponse.data;

      if (
        result.id !== id ||
        result.imageUrl !== imageUrl ||
        result.name !== name ||
        result.username !== username
      )
        return store.dispatch(logOut());

      authService.storeAdminRole(true);
      dispatch(
        voucherAuthSuccess({
          signedInForAdminRole: true,
        })
      );
    } catch (error) {
      dispatch(voucherAuthFailure());
      console.log(error);
      store.dispatch(logOut());
    }
  };
};

const loginWithJwt = () => {
  return (dispatch) => {
    const jwt = authService.getJwt();
    const signedInForAdminRole = authService.getAdminRole();

    if (!jwt) return null;
    dispatch(
      authSuccess({
        currentUser: authService.getCurrentUser(),
        signedInForAdminRole,
      })
    );
  };
};

const logOut = () => {
  return (dispatch) => {
    authService.logOut();
    dispatch(
      authSuccess({
        currentUser: authService.getCurrentUser(),
      })
    );
  };
};

export default {
  login,
  logOut,
  loginWithJwt,
  voucherSignIn,
};
