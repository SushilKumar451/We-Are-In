import React from "react";

const Alert = (props) => 
{
    return <div className = { `alert ${props.alertType}` }>
        { props.message }
    </div>;
}

export const SuccessAlert = (props) =>
{
    return <Alert  
        alertType = "alert-success"
        { ...props }
    />;
}

export const ErrorAlert = (props) => 
{
    return <Alert 
        alertType = "alert-danger"
        { ...props }
    />
}

export default {
    SuccessAlert,
    ErrorAlert
};