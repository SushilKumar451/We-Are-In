import React from "react";
import TextInput from "../form-group/textinput";


const CurrencyFormatsForm = (props) => 
{
    return (
        <section>
            <div className="row">
                <div className="col-12 mt-3">
                    <p className="h4 font-weight-light">Please enter the currency formats that you wish the system to use.</p>
                </div>
                <div className="col-12">
                    <TextInput 
                        label = "Code"
                        name = "code"
                        value = { props.currCode }
                        onChange = { props.onChangeCurrCode }
                        placeholder = "AED"
                        classes = "border"
                        formGrpClasses = "my-2"
                    />
                </div>
                <div className="col-12">
                    <TextInput 
                        label = "Symbol"
                        name = "symbol"
                        value = { props.currSymbol }
                        onChange = { props.onChangeCurrSymbol }
                        placeholder = ".|.,"
                        classes = "border"
                        formGrpClasses = "my-2"
                    />
                </div>
                <div className="col-sm-6">
                    <TextInput 
                        label = "Currency Format"
                        name = "currencyFormat"
                        value = { props.currFormat }
                        onChange = { props.onChangeCurrFormat }
                        placeholder = "{1:N2} {0}"
                        classes = "border"
                        formGrpClasses = "my-2"
                    />
                </div>
                <div className="col-sm-6">
                    <TextInput 
                        label = "Number Format"
                        name = "numberFormat"
                        value = { props.currNumberFormat }
                        onChange = { props.onChangeCurrNumberFormat }
                        placeholder = "{0:N2}"
                        classes = "border"
                        formGrpClasses = "my-2"
                    />
                </div>
            </div>
        </section>
    );
}

export default CurrencyFormatsForm;