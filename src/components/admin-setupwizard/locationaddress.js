import React from "react";
import TextInput from "../form-group/textinput";
import ComboInput from "../form-group/comboinput"


const LocationAddressForm = (props) => 
{
    return (
        <section>
            <div className="row">
                <div className="col-6">
                    <ComboInput 
                        label = "Country"
                        name = "country"
                        value = { props.country }
                        onChange = { props.onChangeCountry }
                        classes = "border"
                        formGrpClasses = "my-2"
                        comboBoxOptions = {
                            [
                                { text: "United Arab Emirates", value: 1 }
                            ]
                        }
                    />
                </div>
                <div className="col-6">
                    <ComboInput 
                        label = "Culture"
                        name = "culture"
                        value = { props.culture }
                        onChange = { props.onChangeCulture }
                        classes = "border"
                        formGrpClasses = "my-2"
                        comboBoxOptions = {
                            [
                                { text: "Arabic (United Arab Emirates)", value: 1 }
                            ]
                        }
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-12 mt-3">
                    <p className="h4 font-weight-light">Please enter the address field names that best respresent your country.</p>
                </div>
                <div className="col-sm-4">
                    <TextInput 
                        label = "City Tag"
                        name = "cityTag"
                        value = { props.cityTag }
                        onChange = { props.onChangeCityTag }
                        placeholder = "Emirate"
                        classes = "border"
                        formGrpClasses = "my-2"
                    />
                </div>
                <div className="col-sm-4">
                    <TextInput 
                        label = "Country Tag"
                        name = "countryTag"
                        value = { props.countryTag }
                        onChange = { props.onChangeCountryTag }
                        placeholder = "Emirate"
                        classes = "border"
                        formGrpClasses = "my-2"
                    />
                </div>
                <div className="col-sm-4">
                    <TextInput 
                        label = "Postcode Tag"
                        name = "postcodeTag"
                        value = { props.postCodeTag }
                        onChange = { props.onChangePostCodeTag }
                        placeholder = "PO Box"
                        classes = "border"
                        formGrpClasses = "my-2"
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-12 mt-3">
                    <p className="h4 font-weight-light">Please enter your google maps api license key to enable mapping features.</p>
                </div>
                <div className="col-12">
                    <TextInput 
                        label = "Google Maps API Key"
                        name = "googleMapsApiKey"
                        value = { props.googleMapsApiKey }
                        onChange = { props.onChangeGoogleMapsApiKey }
                        placeholder = "Ay7sthehehqIhgbn887ueyehwnnxxshggdywyxsAy7sthehehqIhgbn"
                        classes = "border"
                        formGrpClasses = "my-2"
                    />
                </div>
            </div>
        </section>
    );
}

export default LocationAddressForm;