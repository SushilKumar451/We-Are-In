import Types from './types';

export const authInit = () => ({
  type: Types.AUTH_INIT,
});

export const authSuccess = (payload) => ({
  type: Types.AUTH_SUCCESS,
  payload,
});

export const authFailure = () => ({
  type: Types.AUTH_FAILURE,
});


export const voucherAuthInit = () => ({
  type: Types.VOUCHER_AUTH_INIT,
});

export const voucherAuthSuccess = (payload) => ({
  type: Types.VOUCHER_AUTH_SUCCESS,
  payload,
});

export const voucherAuthFailure = () => ({
  type: Types.VOUCHER_AUTH_FAILURE,
});