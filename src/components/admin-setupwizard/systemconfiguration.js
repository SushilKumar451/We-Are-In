import React from "react";
import TextInput from "../form-group/textinput";


const SystemConfigurationForm = (props) => 
{
    return (
        <section>
            <div className="row">
                <div className="col-12 mt-3">
                    <p className="h4 font-weight-light">Please set all system configurations. See tooltips for descriptions of each configuration and it's default value.</p>
                </div>
                <div className="col-sm-6">
                    <TextInput 
                        label = "Kiosk Offline Timeout (seconds)"
                        name = "kioskOfflineTimeout"
                        value = { props.kioskOfflineTimeoutInSecs }
                        onChange = { props.onChangeKioskOfflineTimeoutInSecs }
                        placeholder = "300"
                        classes = "border"
                        formGrpClasses = "my-2"
                    />
                </div>
                <div className="col-sm-6">
                    <TextInput 
                        label = "Portal Service Offline Monitor Timeout (seconds)"
                        name = "portalServiceOfflineMonitorTimeout"
                        value = { props.portalServiceOfflineMonitorTimeoutInSecs }
                        onChange = { props.onChangePortalServiceOfflineMonitorTimeoutInSecs }
                        placeholder = "10"
                        classes = "border"
                        formGrpClasses = "my-2"
                    />
                </div>
                <div className="col-12"><hr className = "my-4" /></div>
                <div className="col-sm-4">
                    <TextInput 
                        label = "Auto-Schedule Cash Collection Order Timeout (hours)"
                        name = "autoScheduleCashCollectionOrderTimeout"
                        value = { props.autoScheduleCashCollectionOrderTimeoutInHrs }
                        onChange = { props.onChangeAutoScheduleCashCollectionOrderTimeoutInHrs }
                        placeholder = "8"
                        classes = "border"
                        formGrpClasses = "my-2"
                    />
                </div>
                <div className="col-sm-4">
                    <TextInput 
                        label = "Auto-Schedule Card Replenishment Order Timeout (hours)"
                        name = "autoScheduleCardReplenishmentOrderTimeout"
                        value = { props.autoScheduleCardReplenishmentOrderTimeoutInHrs }
                        onChange = { props.onChangeAutoScheduleCardReplenishmentOrderTimeoutInHrs }
                        placeholder = "8"
                        classes = "border"
                        formGrpClasses = "my-2"
                    />
                </div>
                <div className="col-sm-4">
                    <TextInput 
                        label = "Auto-Schedule Consumable Replenishment Order Timeout (hours)"
                        name = "autoScheduleConsumableReplenishmentOrderTimeout"
                        value = { props.autoScheduleConsumableReplishmentOrderTimeoutInHrs }
                        onChange = { props.onChangeAutoScheduleConsumableReplishmentOrderTimeoutInHrs }
                        placeholder = "8"
                        classes = "border"
                        formGrpClasses = "my-2 text-truncate"
                    />
                </div>
            </div>
        </section>
    );
}

export default SystemConfigurationForm;