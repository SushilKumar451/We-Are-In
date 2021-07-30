import Types from '../actions/admin/types';

export const initState = {
  usersList: [],
  activeUser: undefined,

  systemSettings: {},
  permissionGroupsList: [],
  engrPermissionGroupsList: [],
};

export const adminReducer = (state = initState, action) => {
  switch (action.type) {
    case Types.SET_USERS_LIST:
      return {
        ...state,
        usersList: action.payload,
      };
    case Types.SET_ACTIVE_USER:
      return {
        ...state,
        activeUser: state.activeUser.find(
          (val) => val.id === action.payload.userId
        ),
      };

    case Types.SET_SYSTEM_SETTINGS:
      return {
        ...state,
        systemSettings: action.payload,
      };
    case Types.SET_PERMISSION_GROUPS_LIST:
      return {
        ...state,
        permissionGroupsList: action.payload,
      };
    case Types.SET_ENGR_PERMISSION_GROUPS_LIST:
      return {
        ...state,
        engrPermissionGroupsList: action.payload,
      };

    default:
      return state;
  }
};
