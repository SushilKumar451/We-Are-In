import Types from '../actions/auths/types';

export const initialState = {
  currentUser: null,
  signedInForAdminRole: false,
  hasError: false,
  loading: false,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.AUTH_INIT:
    case Types.VOUCHER_AUTH_INIT: {
      return { ...state, loading: true };
    }
    case Types.AUTH_SUCCESS: {
      return {
        ...state,
        loading: false,
        hasError: false,
        currentUser: action.payload.currentUser,
        signedInForAdminRole: action.payload.signedInForAdminRole,
      };
    }
    case Types.VOUCHER_AUTH_SUCCESS: {
      return {
        ...state,
        loading: false,
        hasError: false,
        signedInForAdminRole: action.payload.signedInForAdminRole,
      };
    }
    case Types.AUTH_FAILURE:
    case Types.VOUCHER_AUTH_FAILURE: {
      return {
        ...state,
        hasError: true,
        loading: false,
        signedInForAdminRole: false,
      };
    }
    default:
      return state;
  }
};
