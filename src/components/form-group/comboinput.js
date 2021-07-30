import React from "react";


const ComboInput = (props) => 
{
    const {  
        comboBoxLabel, comboBoxOptions, name, value, classes, onChange, 
        formGrpClasses, label, hideLabel, ...theRestProps
    } = props;

    let optionsRender = [ <option key={0} value = "">{ comboBoxLabel }</option> ];
    
    if ((typeof comboBoxOptions !== undefined) && Array.isArray(comboBoxOptions))
    {
        for (let i = 0; i < comboBoxOptions.length; i++)
        {
            optionsRender.push(
                <option 
                    key = { (i + 1) } 
                    value = { comboBoxOptions[i].value }
                >
                    { comboBoxOptions[i].text }
                </option>
            );
        }
    }
    
    return (
        <div className = { `form-group ${formGrpClasses ? formGrpClasses : ""}` }>
            {
                hideLabel ? null :
                <label for = { `for-${label}` }>{ label }</label>
            }
            <div>
                <select
                    name = { name } 
                    value = { value }
                    onChange = { onChange }
                    className = { `form-control form-control-lg ${classes ? classes : ""}` }
                    { ...theRestProps }
                >
                    { optionsRender }
                </select>
            </div>
        </div>
    );
}

export default ComboInput;