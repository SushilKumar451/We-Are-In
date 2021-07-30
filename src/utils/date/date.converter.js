import Moment from 'moment';

const convert = (param) => {
  if (!param) return;
  return new Date(Moment(param, 'DD-MM-YYYY'));
};

const convertToSimpleDate = (date) => {
  if (!date) return;
  return !isNaN(new Date(date).getDate())
    ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    : '';
};

const getTodayDate = (today = new Date()) =>
  `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

const friendlyDate = (param, date = convert(param)) => {
  if (!(date instanceof Date && !isNaN(date))) return;
  return Moment(date).format('MMMM Do YYYY');
};

export default {
  convert,
  getTodayDate,
  friendlyDate,
  convertToSimpleDate,
};
