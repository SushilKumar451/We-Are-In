// import Raven from "raven-js";
import { toast } from 'react-toastify';

function init() {
  //   Raven.config("https://98934275538f425f8d3f775c9902f204@sentry.io/1395244", {
  //     release: "1.0.1",
  //     environment: "development-test"
  //   }).install();
}

function log(error) {
  toast.error(error);
  console.log(error);
  //Raven.captureException(error);
}

export default {
  init,
  log,
};
