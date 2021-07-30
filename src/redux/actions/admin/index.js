import adminService from '../../../services/admin-service.js';

const exec = async (callFn, callbacks) => {
  const { setBusy, successCallback, errorCallback } = callbacks;

  typeof setBusy == 'function' && setBusy(true);

  try {
    const resp = await callFn();
    console.log('exec response: ', resp);
    typeof setBusy == 'function' && setBusy(false);
    typeof successCallback == 'function' && successCallback(resp);
  } catch (error) {
    console.log('exec error: ', error);
    typeof setBusy == 'function' && setBusy(false);
    typeof errorCallback == 'function' && errorCallback(error);
  }
};

export const createNewUser = (data, callbacks) => {
  return async () => {
    exec(() => {
      return adminService.createNewUser(data);
    }, callbacks);
  };
};
export const fetchUsersList = (callbacks) => {
  return async () => {
    exec(() => {
      return adminService.getUsers();
    }, callbacks);
  };
};

export const createSystemSettings = (data, callbacks) => {
  return async () => {
    exec(() => {
      return adminService.postSystemSetting(data);
    }, callbacks);
  };
};
export const createNewPermissionGroup = (data, callbacks) => {
  return async () => {
    exec(() => {
      return adminService.createPermissionGroup(data);
    }, callbacks);
  };
};
export const createNewEngineerPermissionGroup = (data, callbacks) => {
  return async () => {
    exec(() => {
      return adminService.createEngineerPermissionGroup(data);
    }, callbacks);
  };
};
export const fetchPermissionGroupsList = (callbacks) => {
  return async () => {
    exec(() => {
      return adminService.fetchPermissionGroups();
    }, callbacks);
  };
};
export const fetchSystemSettings = (callbacks) => {
  return async () => {
    exec(() => {
      return adminService.getSystemSettings();
    }, callbacks);
  };
};

export const fetchEngrPermissionGroupsList = (callbacks) => {
  return async () => {
    exec(() => {
      return adminService.fetchEngrPermissionGroups();
    }, callbacks);
  };
};

export default {
  createNewUser,
  fetchUsersList,

  createSystemSettings,
  fetchSystemSettings,
  createNewPermissionGroup,
  createNewEngineerPermissionGroup,
  fetchPermissionGroupsList,
  fetchEngrPermissionGroupsList,
};
