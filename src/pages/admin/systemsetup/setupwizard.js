import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Panel, PanelBody } from '../../../components/panel/panel';
import Button from '../../../components/form-group/button';
import Busy from '../../../components/busy/busy';
import PageWrapper from '../../../components/admin-page-wrapper/pagewrapper';
import SteppedPagesWrapper from '../../../components/stepped-pages/steppedpageswrapper';
import LocationAddressForm from '../../../components/admin-setupwizard/locationaddress';
import DateTimeFormatsForm from '../../../components/admin-setupwizard/datetimeformats';
import CurrencyFormatsForm from '../../../components/admin-setupwizard/currencyformats';
import SystemConfigurationForm from '../../../components/admin-setupwizard/systemconfiguration';
import { ErrorAlert, SuccessAlert } from '../../../components/alert/alert';
import { createSystemSettings } from '../../../redux/actions/admin/index';

const SetupWizard = (props) => {
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [country, setCountry] = useState('');
  const [culture, setCulture] = useState('');
  const [cityTag, setCityTag] = useState('');
  const [countryTag, setCountryTag] = useState('');
  const [postCodeTag, setPostCodeTag] = useState('');
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState('');

  const [timeZone, setTimeZone] = useState('');
  const [date, setDate] = useState('');
  const [timeShort, setTimeShort] = useState('');
  const [timeFull, setTimeFull] = useState('');
  const [dateTimeShort, setDateTimeShort] = useState('');
  const [dateTimeFull, setDateTimeFull] = useState('');

  const [currCode, setCurrCode] = useState('');
  const [currSymbol, setCurrSymbol] = useState('');
  const [currFormat, setCurrFormat] = useState('');
  const [currNumberFormat, setCurrNumberFormat] = useState('');

  const [kioskOfflineTimeoutInSecs, setKioskOfflineTimeoutInSecs] = useState(
    ''
  );
  const [
    portalServiceOfflineMonitorTimeoutInSecs,
    setPortalServiceOfflineMonitorTimeoutInSecs,
  ] = useState('');
  const [
    autoScheduleCashCollectionOrderTimeoutInHrs,
    setAutoScheduleCashCollectionOrderTimeoutInHrs,
  ] = useState('');
  const [
    autoScheduleCardReplenishmentOrderTimeoutInHrs,
    setAutoScheduleCardReplenishmentOrderTimeoutInHrs,
  ] = useState('');
  const [
    autoScheduleConsumableReplenishmentOrderTimeoutInHrs,
    setAutoScheduleConsumableReplenishmentOrderTimeoutInHrs,
  ] = useState('');

  const stepHeadings = {
    1: (
      <React.Fragment>
        <h1 className='page-header m-0'>Step 1 - Location &amp; Address</h1>
      </React.Fragment>
    ),
    2: (
      <React.Fragment>
        <h1 className='page-header m-0'>Step 2 - Date Time Formats</h1>
      </React.Fragment>
    ),
    3: (
      <React.Fragment>
        <h1 className='page-header m-0'>Step 3 - Currency Formats</h1>
      </React.Fragment>
    ),
    4: (
      <React.Fragment>
        <h1 className='page-header m-0'>Step 4 - System Configuration</h1>
      </React.Fragment>
    ),
  };
  const stepLabels = [
    'Location & Address Formats',
    'Date Time Formats',
    'Currency Formats',
    'System Configuration',
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const isStepCompleted = (step) => {
    switch (step) {
      case 1:
        return (
          country !== '' &&
          culture !== '' &&
          cityTag !== '' &&
          countryTag !== '' &&
          postCodeTag !== '' &&
          googleMapsApiKey !== ''
        );
      case 2:
        return (
          timeZone !== '' &&
          date !== '' &&
          timeShort !== '' &&
          timeFull !== '' &&
          dateTimeShort !== '' &&
          dateTimeFull !== ''
        );
      case 3:
        return (
          currCode !== '' &&
          currSymbol !== '' &&
          currFormat !== '' &&
          currNumberFormat !== ''
        );
      case 4:
        return (
          kioskOfflineTimeoutInSecs !== '' &&
          portalServiceOfflineMonitorTimeoutInSecs !== '' &&
          autoScheduleCashCollectionOrderTimeoutInHrs !== '' &&
          autoScheduleCardReplenishmentOrderTimeoutInHrs !== '' &&
          autoScheduleConsumableReplenishmentOrderTimeoutInHrs !== ''
        );
      default:
        return;
    }
  };
  const selectStepUI = () => {
    switch (currentStep) {
      case 2:
        return (
          <DateTimeFormatsForm
            onChangeTimeZone={(e) => setTimeZone(e.currentTarget.value)}
            onChangeDate={(e) => setDate(e.currentTarget.value)}
            onChangeTimeShort={(e) => setTimeShort(e.currentTarget.value)}
            onChangeTimeFull={(e) => setTimeFull(e.currentTarget.value)}
            onChangeDateTimeShort={(e) =>
              setDateTimeShort(e.currentTarget.value)
            }
            onChangeDateTimeFull={(e) => setDateTimeFull(e.currentTarget.value)}
            {...{
              timeZone,
              date,
              timeShort,
              timeFull,
              dateTimeShort,
              dateTimeFull,
            }}
          />
        );
      case 3:
        return (
          <CurrencyFormatsForm
            onChangeCurrCode={(e) => setCurrCode(e.currentTarget.value)}
            onChangeCurrSymbol={(e) => setCurrSymbol(e.currentTarget.value)}
            onChangeCurrFormat={(e) => setCurrFormat(e.currentTarget.value)}
            onChangeCurrNumberFormat={(e) =>
              setCurrNumberFormat(e.currentTarget.value)
            }
            {...{
              currCode,
              currSymbol,
              currFormat,
              currNumberFormat,
            }}
          />
        );
      case 4:
        return (
          <SystemConfigurationForm
            onChangeKioskOfflineTimeoutInSecs={(e) =>
              setKioskOfflineTimeoutInSecs(e.currentTarget.value)
            }
            onChangePortalServiceOfflineMonitorTimeoutInSecs={(e) =>
              setPortalServiceOfflineMonitorTimeoutInSecs(e.currentTarget.value)
            }
            onChangeAutoScheduleCashCollectionOrderTimeoutInHrs={(e) =>
              setAutoScheduleCashCollectionOrderTimeoutInHrs(
                e.currentTarget.value
              )
            }
            onChangeAutoScheduleCardReplenishmentOrderTimeoutInHrs={(e) =>
              setAutoScheduleCardReplenishmentOrderTimeoutInHrs(
                e.currentTarget.value
              )
            }
            onChangeAutoScheduleConsumableReplenishmentOrderTimeoutInHrs={(e) =>
              setAutoScheduleConsumableReplenishmentOrderTimeoutInHrs(
                e.currentTarget.value
              )
            }
            {...{
              kioskOfflineTimeoutInSecs,
              portalServiceOfflineMonitorTimeoutInSecs,
              autoScheduleCashCollectionOrderTimeoutInHrs,
              autoScheduleCardReplenishmentOrderTimeoutInHrs,
              autoScheduleConsumableReplenishmentOrderTimeoutInHrs,
            }}
          />
        );
      case 1:
      default:
        return (
          <LocationAddressForm
            onChangeCountry={(e) => setCountry(e.currentTarget.value)}
            onChangeCulture={(e) => setCulture(e.currentTarget.value)}
            onChangeCityTag={(e) => setCityTag(e.currentTarget.value)}
            onChangeCountryTag={(e) => setCountryTag(e.currentTarget.value)}
            onChangePostCodeTag={(e) => setPostCodeTag(e.currentTarget.value)}
            onChangeGoogleMapsApiKey={(e) =>
              setGoogleMapsApiKey(e.currentTarget.value)
            }
            {...{
              country,
              culture,
              cityTag,
              countryTag,
              postCodeTag,
              googleMapsApiKey,
            }}
          />
        );
    }
  };

  const preparePayload = () => {
    return {
      country,
      culture,
      city_tag: cityTag,
      country_tag: countryTag,
      post_code_tag: postCodeTag,
      google_maps_api_key: googleMapsApiKey,
      time_zone: timeZone,
      date,
      time_short: timeShort,
      time_full: timeFull,
      date_time_short: dateTimeShort,
      date_time_full: dateTimeFull,
      code: currCode,
      symbol: currSymbol,
      currency_format: currFormat,
      number_format: currNumberFormat,
      kiosk_offline_timeout: kioskOfflineTimeoutInSecs,
      portal_service_offline_monitor_timeout: portalServiceOfflineMonitorTimeoutInSecs,
      auto_schedule_cash_collection_order_timeout: autoScheduleCashCollectionOrderTimeoutInHrs,
      auto_schedule_card_replenishment_order_timeout: autoScheduleCardReplenishmentOrderTimeoutInHrs,
      auto_schedule_consumable_replenishment_order_timeout: autoScheduleConsumableReplenishmentOrderTimeoutInHrs,
    };
  };

  return (
    <section>
      {/*<PageWrapper
        siteMapPath='Home / Admin / User Management'
        heading='Setup Wizard'
        headingIcon='far fa-list-alt'
      >*/}
      <PageWrapper
        siteMapPath='Home / Admin / System Setup'
        heading={stepHeadings[currentStep]}
        headingIcon='far fa-list-alt'
      >
        <Panel>
          {/*<PanelHeader noButton={true}>
            <i className='far fa-list-alt'>&nbsp;</i>VMS Portal Environment
            Settings
          </PanelHeader>*/}
          <PanelBody>
            <SteppedPagesWrapper
              currentStep={currentStep}
              isStepCompleted={isStepCompleted}
              stepLabels={stepLabels}
              steps={[1, 2, 3, 4]}
              totalSteps={stepLabels.length}
              stepHeading={stepHeadings[currentStep]}
              includeFooter={true}
              includePrevNext={true}
              nextCallback={(e) => {
                setCurrentStep((currentStep) =>
                  currentStep <= stepLabels.length - 1
                    ? currentStep + 1
                    : currentStep
                );
              }}
              previousCallback={(e) => {
                setErrorMsg('');
                setCurrentStep((currentStep) =>
                  currentStep > 1 ? currentStep - 1 : 1
                );
              }}
              submit={
                <Button
                  classes='btn btn-lg btn-primary'
                  onClick={(e) => {
                    props.dispatch(
                      createSystemSettings(preparePayload(), {
                        setBusy,
                        successCallback: (resp) => {
                          setSuccessMsg('System Settings saved successfully.');
                        },
                        errorCallback: (error) => {
                          setErrorMsg(error.message);
                        },
                      })
                    );
                  }}
                  disabled={busy}
                >
                  {busy ? (
                    <React.Fragment>
                      <Busy inline={true} />
                      &nbsp;
                    </React.Fragment>
                  ) : null}
                  Save <i className='fa fa-check'></i>
                </Button>
              }
            >
              <div className='mt-4 px-3'>{selectStepUI()}</div>
              <div className='px-3'>
                {
                  <React.Fragment>
                    {errorMsg ? (
                      <div className='my-3'>
                        <ErrorAlert message={errorMsg} />
                      </div>
                    ) : null}
                    {successMsg ? (
                      <div className='my-3'>
                        <SuccessAlert message={successMsg} />
                      </div>
                    ) : null}
                  </React.Fragment>
                }
              </div>
            </SteppedPagesWrapper>
          </PanelBody>
        </Panel>
      </PageWrapper>
    </section>
  );
};

export default withRouter(
  connect(null, (dispatch) => {
    return { dispatch };
  })(SetupWizard)
);
