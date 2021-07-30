import axios from 'axios';
import store from '../redux/store';
import logger from './logger-service';
import auth from '../redux/actions/auths/index';

//import { toast } from "react-toastify";

axios.defaults.baseURL = process.env.REACT_APP_VMS_APP_API_URL;
axios.defaults.headers.common["Content-Type"] = "application/json";

axios.interceptors.response.use(null, (error) => {
  const expectedErrors =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedErrors) {
    logger.log(error);
    //toast.error("An unexpected error occured");
  }
  if (error.response.status === 401) {
    //this will logOut users
    store.dispatch(auth.logOut());
  }

  return Promise.reject(error);
});

const setJwt = (jwt) => (axios.defaults.headers.common['x-access-token'] = jwt)

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete,
  setJwt,
};
