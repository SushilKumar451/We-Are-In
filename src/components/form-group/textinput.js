import React from "react";


const TextInput = (props) => 
{
    const {
        label, name, placeholder, onChange, hideLabel, value, classes, formGrpClasses, password, ...theRestProps
    } = props;

    return (
        <div className = { `form-group ${formGrpClasses ? formGrpClasses : ""}` }>
            {
                hideLabel ? null :
                <label htmlFor = { `for-${label}` }>{ label }</label>
            }
            <div>
                <input 
                    className = { `form-control form-control-lg ${classes ? classes : ""}` }
                    type = { password ? "password" : "text" }
                    name = { name }
                    placeholder = { placeholder }
                    onChange = { onChange }
                    value = { value }
                    { ...theRestProps }
                />
            </div>
        </div>
    );
}

export default TextInput;