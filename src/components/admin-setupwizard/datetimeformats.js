import React from "react";
import TextInput from "../form-group/textinput";
import ComboInput from "../form-group/comboinput";


const DateTimeFormatsForm = (props) => 
{
    return (
        <section>
            <div>
                <ComboInput 
                    label = "Time Zone"
                    name = "timeZone"
                    value = { props.timeZone }
                    onChange = { props.onChangeTimeZone }
                    classes = "border"
                    formGrpClasses = "my-2"
                    comboBoxOptions = {
                        [
                            { text: "(UTC+04:00) Abu Dhabi, Muscat", value: 1 }
                        ]
                    }
                />
            </div>

            <div className="row">
                <div className="col-12 mt-3">
                    <p className="h4 font-weight-light">Please enter the date time formats that you wish the system to use.</p>
                </div>
                <div className="col-sm-3">
                    <TextInput 
                        label = "Date"
                        name = "dateFormat"
                        value = { props.date }
                        onChange = { props.onChangeDate }
                        placeholder = "dd/mm/yyyy"
                        classes = "border"
                        formGrpClasses = "my-2"
                    />
                </div>
                <div className="col-sm-3">
                    <TextInput 
                        label = "Time Short"
                        name = "timeShort"
                        value = { props.timeShort }
                        onChange = { props.onChangeTimeShort }
                        placeholder = "hh:mm tt"
                        classes = "border"
                        formGrpClasses = "my-2"
                    />
                </div>
                <div className="col-sm-3">
                    <TextInput 
                        label = "Time Full"
                        name = "timeFull"
                        value = { props.timeFull }
                        onChange = { props.onChangeTimeFull }
                        placeholder = "hh:mm:ss tt"
                        classes = "border"
                        formGrpClasses = "my-2"
                    />
                </div>
                <div className="col-sm-3">
                    <TextInput 
                        label = "Date Time Short"
                        name = "dateTimeShort"
                        value = { props.dateTimeShort }
                        onChange = { props.onChangeDateTimeShort }
                        placeholder = "dd/mm/yyyy hh:mm tt"
                        classes = "border"
                        formGrpClasses = "my-2"
                    />
                </div>
                <div className="col-12">
                    <TextInput 
                        label = "Date Time Full"
                        name = "dateTimeFull"
                        value = { props.dateTimeFull }
                        onChange = { props.onChangeDateTimeFull }
                        placeholder = "dd/mm/yyyy hh:mm:ss tt"
                        classes = "border"
                        formGrpClasses = "my-2"
                    />
                </div>
            </div>
        </section>
    );
}

export default DateTimeFormatsForm;