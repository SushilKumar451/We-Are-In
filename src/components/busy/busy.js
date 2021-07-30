import React from "react";


const Busy = (props) => 
{
    return <div className = { `text-center ${props.inline ? "d-inline-block" : ""}` }>
        <i className = "fa fa-spinner fa-pulse"></i>
    </div>;
}

export default Busy;