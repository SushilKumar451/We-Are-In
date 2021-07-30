import Types from "./types";


export const postNewUser = (payload) => 
{
    return {
        type: Types.POST_NEW_USER,
        payload
    };
}
export const postNewUserSuccess = () => 
{
    return { type: Types.POST_NEW_USER_SUCCESS };
}
export const postNewUserFailure = (payload) => 
{
    return {
        type: Types.POST_NEW_USER_FAILURE,
        payload
    };
}
export const postingNewUser = (payload) => 
{
    return {
        type: Types.POSTING_NEW_USER,
        payload
    };
}

export const fetchUsers = () => 
{
    return { type: Types.FETCH_USERS };
}
export const fetchUserFailure = (payload) => 
{
    return {
        type: Types.FETCH_USERS_FAILURE,
        payload
    };
}
export const fetchUsersSuccess = (payload) => 
{
    return {
        type: Types.FETCH_USERS_SUCCESS,
        payload
    };
}
export const setUsersList = (payload) => 
{
    return {
        type: Types.SET_USERS_LIST,
        payload
    };
}
export const setActiveUser = ({ userId }) => 
{
    return {
        type: Types.SET_ACTIVE_USER,
        payload: { userId }
    };
}

export const postSystemSettings = (payload) => 
{
    return {
        type: Types.POST_SYSTEM_SETTINGS,
        payload
    };
}
export const fetchSystemSettings = () => 
{
    return {
        type: Types.FETCH_SYSTEM_SETTINGS
    };
}
export const setSystemSettings = (payload) => 
{
    return {
        type: Types.SET_SYSTEM_SETTINGS,
        payload
    };
}
export const setPermissionGroupsList = (payload) => 
{
    return {
        type: Types.SET_PERMISSION_GROUPS_LIST,
        payload
    };
}
export const setEngrPermissionGroupsList = (payload) => 
{
    return {
        type: Types.SET_ENGR_PERMISSION_GROUPS_LIST,
        payload
    };
}