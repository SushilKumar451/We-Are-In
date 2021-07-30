import React from "react";


const Button = (props) => 
{
    const {
        classes, onClick, busy, ...theRestProps
    } = props;
    
    return (
        <button
            type = "button"
            className = { `btn ${classes ? classes : "btn-default"}` }
            onClick = { (onClick && (typeof onClick == "function")) ? onClick : null }
            { ...theRestProps }
        >
            { busy ? <i className = "fa fa-spinner fa-pulse">&nbsp;</i> : null }
            { props.children }
        </button>
    );
}

export default Button;