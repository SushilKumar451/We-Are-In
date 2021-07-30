import React from 'react';
import Joi from 'joi-browser';
import { withRouter } from 'react-router-dom';
import ReactTable from 'react-table';

import DatePicker from 'react-datepicker';
import SweetAlert from 'react-bootstrap-sweetalert';
import brandService from '../../services/brand-service';
import dateConverter from '../../utils/date/date.converter';
import clientService from '../../services/client-service';
import loyaltyService from '../../services/loyalty-service';
import merchantService from '../../services/merchant-service';
import { GoogleMapComponent } from '../googleMap/googleMapComponent';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import dateHelper from '../../utils/date/date.converter';
import {
  Panel,
  PanelHeader,
  PanelBody,
} from '../../components/panel/panel.jsx';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';
import 'react-datetime/css/react-datetime.css';
import 'react-datepicker/dist/react-datepicker.css';
import classnames from 'classnames';

class LoyaltyDetail extends React.Component {
  constructor(props) {
    super(props);
    this.init();
    this.state = {
      data: {
        loyalty_name: '',
        client_id: '',
        brand_id: '',
        merchant_id: '',
        programme_description: '',
        programme_terms_and_conditions: '',
        status_id: '',
        start_date: '',
        end_date: '',
        amount_of_stamps_required: 0,
        reward_for_full_stamps: '',
        max_stamps_per_day: 0,
        max_stamps_per_client: 0,
      },
      isEditable: false,
      merchantDetails: null,
      statusList: [],
      activeTab: '1',
      isMarkerShown: true,
      firstStep: true,
      secondStep: false,
      clientList: [],
      merchantList: [],
      brandList: [],
      errors: {},
      loading: false,
      amountList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      otherList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    };
  }

  timeOut = 1000;

  schema = {
    loyalty_name: Joi.string().label('Loyalty name').required(),
    client_id: Joi.string()
      .replace('Select client', '')
      .label('Client name')
      .required(),
    brand_id: Joi.string()
      .replace('Select brand', '')
      .label('Brand name')
      .required(),
    merchant_id: Joi.string()
      .replace('Select merchant', '')
      .label('Merchant name')
      .required(),
    programme_description: Joi.string(),
    programme_terms_and_conditions: Joi.string(),
    status_id: Joi.string(),
    start_date: Joi.string(),
    end_date: Joi.string(),
    amount_of_stamps_required: Joi.number(),
    reward_for_full_stamps: Joi.string(),
    max_stamps_per_day: Joi.number(),
    max_stamps_per_client: Joi.number(),
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);

    if (!error) return null;

    const errors = {};
    error.details.forEach((x) => {
      errors[x.path[0]] = x.message;
    });
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  reactTablecolumns = [
    {
      Header: 'Forename',
      accessor: 'forename',
    },
    {
      Header: 'Surname',
      accessor: 'surname',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Phone',
      accessor: 'phone',
    },
  ];

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const isEditable = this.props.match.path.split('/').includes('edit');
      this.setState({ isEditable });
      const [
        loyaltyResponse,
        clientResponse,
        statusResponse,
      ] = await Promise.all([
        loyaltyService.getLoyalty(this.props.match.params.id),
        clientService.getClients(),
        loyaltyService.getLoyaltyStatus(),
      ]);
      const clientList = clientResponse.data;
      const statusList = statusResponse.data.loyalty_statuses;
      const loyaltyDetails = loyaltyResponse.data.loyalties[0];
      const data = this.state.data;
      const cleanData = this.cleanseData(loyaltyDetails);
      let { start_date, end_date } = cleanData;

      this.setState({
        clientList,
        statusList,
        data: { ...data, ...cleanData, start_date, end_date },
      });
      await this.getBrands(cleanData.client_id);
      await this.getMerchants(cleanData.brand_id);
      await this.getMerchantDetails(cleanData.merchant_id);
    } catch (error) {
      console.log(error);
      // NotificationManager.error('Error', 'Could not retrieve clients', this.timeOut);
    } finally {
      this.setState({ loading: false });
    }
  }

  cleanseData = (data) => {
    const {
      uid,
      loyalty_id,
      loyalty_name,
      client_id,
      brand_id,
      merchant_id,
      programme_description,
      programme_terms_and_conditions,
      status_id,
      start_date,
      end_date,
      amount_of_stamps_required,
      reward_for_full_stamps,
      max_stamps_per_day,
      max_stamps_per_client,
    } = data;
    return {
      uid,
      loyalty_id,
      loyalty_name,
      client_id,
      brand_id,
      merchant_id,
      programme_description,
      programme_terms_and_conditions,
      status_id,
      start_date: dateConverter.convert(start_date, '/'),
      end_date: dateConverter.convert(end_date, '/'),
      amount_of_stamps_required,
      reward_for_full_stamps,
      max_stamps_per_day,
      max_stamps_per_client,
    };
  };

  init = async () => {};

  handleChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data });

    const returnedErrors = this.validateProperty(input);
    const errors = this.state.errors;
    errors[input.name] = returnedErrors;
    this.setState({ errors });

    if (!returnedErrors) this.optionalCaller(input);
  };

  validateFirst = () => {
    const listError = [];
    const dataList = ['loyalty_name', 'client_id', 'brand_id', 'merchant_id'];
    const { data } = this.state;

    dataList.forEach((x) => {
      let input = { name: x, value: data[x] };
      const returnedErrors = this.validateProperty(input);
      const errors = this.state.errors;
      errors[input.name] = returnedErrors;
      this.setState({ errors });
      if (returnedErrors) listError.push(returnedErrors);
    });

    if (!!listError.length) return;
    this.setState({ firstStep: false, secondStep: true });
  };

  optionalCaller = (input) => {
    switch (input.name) {
      case 'client_id':
        this.getBrands(input.value);
        break;
      case 'brand_id':
        this.getMerchants(input.value);
        break;
      case 'merchant_id':
        this.getMerchantDetails(input.value);
        break;
      default:
        break;
    }
  };

  getBrands = async (clientId) => {
    this.setState({ loading: true });
    try {
      const response = await brandService.getBrandsByClientId(clientId);
      const brandList = response.data.client_contacts;
      const merchantList = [];
      if (!brandList || !brandList.length)
        NotificationManager.warning(
          'Warning',
          'There are no brands for this client',
          this.timeOut
        );
      this.setState({ brandList, merchantList });
    } catch (error) {
      console.log(error);
      NotificationManager.error('Error', 'Could not the brands', this.timeOut);
    } finally {
      this.setState({ loading: false });
    }
  };

  getMerchants = async (brandId) => {
    this.setState({ loading: true });
    try {
      const response = await merchantService.getMerchantsByBrandId(brandId);
      const merchantList = response.data.brand_contacts;
      if (!merchantList || !merchantList.length)
        NotificationManager.warning(
          'Warning',
          'There are no merchants for this client',
          this.timeOut
        );
      this.setState({ merchantList });
    } catch (error) {
      console.log(error);
      NotificationManager.error(
        'Error',
        'Could not get the merchants',
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  };

  getMerchantDetails = async (merchantId) => {
    this.setState({ loading: true });
    try {
      const response = await merchantService.getMerchant(merchantId);
      const merchantDetails = response.data.merchant[0];

      this.setState({
        merchantDetails,
      });
    } catch (error) {
      console.log(error);
      NotificationManager.error(
        'Error',
        'Could not get the merchants details',
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  };

  handleDate = (name, event) => {
    const data = { ...this.state.data };
    const value = event;
    data[name] = value;
    this.setState({ data });

    const returnedErrors = this.validateProperty({ name, value });
    const errors = this.state.errors;
    errors[name] = returnedErrors;
    this.setState({ errors });
  };

  handleMarkerClick = (event) => {
    const lat = event.latLng.lat();
    const long = event.latLng.lng();
    const data = { ...this.state.data, lat, long };
    this.setState({ data });
  };

  updateLoyalty = async () => {
    this.setState({ loading: true });
    try {
      const data = { ...this.state.data };
      let { start_date, end_date, status_id } = data;
      start_date = dateHelper.convertToSimpleDate(start_date);
      end_date = dateHelper.convertToSimpleDate(end_date);

      await loyaltyService.putLoyalty({
        ...data,
        status_id: +status_id,
        start_date,
        end_date,
      });
      NotificationManager.success('Success', 'Loyalty updated', this.timeOut);
    } catch (error) {
      console.log(error);
      NotificationManager.error(
        'Error',
        'Could not add the loyalty',
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const contacts = this.state.merchantDetails
      ? this.state.merchantDetails.merchant_contact || []
      : [];
    const amountList = this.state.amountList;
    const otherList = this.state.otherList;
    return (
      <div className='row'>
        <div className='col-xl-12'>
          <Panel>
            <PanelHeader>
              {this.state.isEditable ? 'Edit loyalty' : 'Loyalty detail'}{' '}
            </PanelHeader>
            <PanelBody>
              {this.state.firstStep && (
                <div>
                  <div className='form-group row m-b-15'>
                    <label className='col-form-label col-md-3'>Name</label>
                    <div className='col-md-9'>
                      <input
                        type='text'
                        className='form-control m-b-5'
                        placeholder='Enter name'
                        value={this.state.data.loyalty_name}
                        onChange={this.handleChange}
                        name='loyalty_name'
                        disabled={!this.state.isEditable}
                      />
                      {this.state.errors['loyalty_name'] && (
                        <div className='pt-2 text-danger'>
                          <span>{this.state.errors['loyalty_name']}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='form-group row m-b-15'>
                    <label className='col-form-label col-md-3'>Clients</label>
                    <div className='col-md-9'>
                      <select
                        className='form-control'
                        value={this.state.data.client_id}
                        onChange={this.handleChange}
                        name='client_id'
                        disabled={!this.state.isEditable}
                      >
                        <option>Select client </option>
                        {this.state.clientList.map((x) => (
                          <option key={x.client_id} value={x.client_id}>
                            {x.client_name}
                          </option>
                        ))}
                        ;
                      </select>
                      {this.state.errors['client_id'] && (
                        <div className='pt-2 text-danger'>
                          <span>{this.state.errors['client_id']}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='form-group row m-b-15'>
                    <label className='col-form-label col-md-3'>Brand</label>
                    <div className='col-md-9'>
                      <select
                        className='form-control'
                        value={this.state.data.brand_id}
                        onChange={this.handleChange}
                        name='brand_id'
                        disabled={!this.state.isEditable}
                      >
                        <option>Select brand </option>
                        {this.state.brandList.map((x) => (
                          <option key={x.brand_id} value={x.brand_id}>
                            {x.brand_name}
                          </option>
                        ))}
                        ;
                      </select>
                      {this.state.errors['brand_id'] && (
                        <div className='pt-2 text-danger'>
                          <span>{this.state.errors['brand_id']}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='form-group row m-b-15'>
                    <label className='col-form-label col-md-3'>Merchant</label>
                    <div className='col-md-9'>
                      <select
                        className='form-control'
                        value={this.state.data.merchant_id}
                        onChange={this.handleChange}
                        name='merchant_id'
                        disabled={!this.state.isEditable}
                      >
                        <option>Select merchant </option>
                        {this.state.merchantList.map((x) => (
                          <option key={x.merchant_id} value={x.merchant_id}>
                            {x.merchant_name}
                          </option>
                        ))}
                        ;
                      </select>
                      {this.state.errors['merchant_id'] && (
                        <div className='pt-2 text-danger'>
                          <span>{this.state.errors['merchant_id']}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    className='btn btn-success mr-5 pr-5 pl-5'
                    onClick={this.validateFirst}
                  >
                    Next
                  </button>
                </div>
              )}
              {this.state.secondStep && (
                <div>
                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeTab === '1',
                        })}
                        onClick={() => {
                          this.toggleTab('1');
                        }}
                      >
                        <span className='d-sm-none'>Merchant Details</span>
                        <span className='d-sm-block d-none'>
                          Merchant Details
                        </span>
                      </NavLink>
                    </NavItem>

                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeTab === '2',
                        })}
                        onClick={() => {
                          this.toggleTab('2');
                        }}
                      >
                        <span className='d-sm-none'>Programme Details</span>
                        <span className='d-sm-block d-none'>
                          Programme Details
                        </span>
                      </NavLink>
                    </NavItem>

                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeTab === '3',
                        })}
                        onClick={() => {
                          this.toggleTab('3');
                        }}
                      >
                        <span className='d-sm-none'>Status</span>
                        <span className='d-sm-block d-none'>Status</span>
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId='1'>
                      <div className='col-xl-12 col-lg-12'>
                        <div className='card mb-3'>
                          <div className='card-body'>
                            <ReactTable
                              data={contacts}
                              columns={this.reactTablecolumns}
                              showPageSizeOptions={false}
                              showPagination={false}
                              minRows={0}
                              className='-striped'
                            />
                          </div>
                        </div>

                        <div className='mb-2'>
                          <GoogleMapComponent
                            isMarkerShown={this.state.isMarkerShown}
                            onMarkerClick={this.handleMarkerClick}
                            lat={this.state.merchantDetails?.lat || ''}
                            long={this.state.merchantDetails?.long || ''}
                          />
                        </div>
                        <div className='form-group row m-b-15'>
                          <label className='col-form-label col-md-3'>
                            Latitude
                          </label>
                          <div className='col-md-9'>
                            <input
                              type='text'
                              className='form-control m-b-5'
                              disabled
                              value={this.state.merchantDetails?.lat || ''}
                              name='lat'
                            />
                          </div>
                        </div>
                        <div className='form-group row m-b-15'>
                          <label className='col-form-label col-md-3'>
                            Longitude
                          </label>
                          <div className='col-md-9'>
                            <input
                              type='text'
                              className='form-control m-b-5'
                              disabled
                              value={this.state.merchantDetails?.long || ''}
                              name='long'
                            />
                          </div>
                        </div>
                        <div className='form-group row m-b-15'>
                          <label className='col-form-label col-md-3'>
                            Merchant Logo
                          </label>
                          <div className='col-md-9'>
                            <input
                              type='text'
                              className='form-control m-b-5'
                              disabled
                              value={this.state.merchantDetails?.logo || ''}
                              name='merchant_logo'
                            />
                            {this.state.errors['merchant_logo'] && (
                              <div className='pt-2 text-danger'>
                                <span>
                                  {this.state.errors['merchant_logo']}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TabPane>

                    <TabPane tabId='2'>
                      <div>
                        <div className='form-group row m-b-15'>
                          <label className='col-form-label col-md-2'>
                            Programme Description
                          </label>
                          <div className='col-md-6'>
                            <textarea
                              className='form-control'
                              rows='3'
                              id='programme_description'
                              name='programme_description'
                              onChange={this.handleChange}
                              disabled={!this.state.isEditable}
                            />
                          </div>
                        </div>

                        <div className='form-group row m-b-15'>
                          <label className='col-form-label col-md-2'>
                            Programme Terms and Condition
                          </label>
                          <div className='col-md-6'>
                            <textarea
                              className='form-control'
                              rows='3'
                              id='programme_terms_and_conditions'
                              name='programme_terms_and_conditions'
                              onChange={this.handleChange}
                              disabled={!this.state.isEditable}
                            />
                          </div>
                        </div>
                      </div>
                    </TabPane>

                    <TabPane tabId='3'>
                      <div>
                        <div className='form-group row m-b-15'>
                          <label className='col-form-label col-md-2'>
                            Status
                          </label>
                          <div className='col-md-4'>
                            <select
                              className='form-control'
                              value={this.state.data.status_id}
                              onChange={this.handleChange}
                              name='status_id'
                              disabled={!this.state.isEditable}
                            >
                              <option>Select status </option>
                              {this.state.statusList.map((x) => (
                                <option key={x.status_id} value={x.status_id}>
                                  {x.status_name}
                                </option>
                              ))}
                              ;
                            </select>
                          </div>
                        </div>

                        <div className='form-group row'>
                          <label className='col-lg-2 col-form-label'>
                            Start date
                          </label>
                          <div className='col-lg-4'>
                            <DatePicker
                              selected={this.state.data.start_date}
                              dateFormat='dd/MM/yyyy'
                              onChange={(x) => this.handleDate('start_date', x)}
                              className='form-control'
                              name='start_date'
                              disabled={!this.state.isEditable}
                            />
                          </div>
                        </div>

                        <div className='form-group row'>
                          <label className='col-lg-2 col-form-label'>
                            End date
                          </label>
                          <div className='col-lg-4'>
                            <DatePicker
                              selected={this.state.data.end_date}
                              dateFormat='dd/MM/yyyy'
                              onChange={(x) => this.handleDate('end_date', x)}
                              className='form-control'
                              name='end_date'
                              disabled={!this.state.isEditable}
                            />
                          </div>
                        </div>

                        <div className='form-group row m-b-15'>
                          <label className='col-form-label col-md-2'>
                            Amount of stamps required
                          </label>
                          <div className='col-md-4'>
                            <select
                              className='form-control'
                              value={this.state.data.amount_of_stamps_required}
                              onChange={this.handleChange}
                              name='amount_of_stamps_required'
                              disabled={!this.state.isEditable}
                            >
                              <option>Select amount </option>
                              {amountList.map((x) => (
                                <option key={x} value={x}>
                                  {x}
                                </option>
                              ))}
                              ;
                            </select>
                          </div>
                        </div>

                        <div className='form-group row m-b-15'>
                          <label className='col-form-label col-md-2'>
                            Maximum stamps per day
                          </label>
                          <div className='col-md-4'>
                            <select
                              className='form-control'
                              value={this.state.data.max_stamps_per_day}
                              onChange={this.handleChange}
                              name='max_stamps_per_day'
                              disabled={!this.state.isEditable}
                            >
                              <option>Select Maximum </option>
                              {otherList.map((x) => (
                                <option key={x} value={x}>
                                  {x}
                                </option>
                              ))}
                              ;
                            </select>
                          </div>
                        </div>

                        <div className='form-group row m-b-15'>
                          <label className='col-form-label col-md-2'>
                            Maximum stamps per client
                          </label>
                          <div className='col-md-4'>
                            <select
                              className='form-control'
                              value={this.state.data.max_stamps_per_client}
                              onChange={this.handleChange}
                              name='max_stamps_per_client'
                              disabled={!this.state.isEditable}
                            >
                              <option>Select Maximum </option>
                              {otherList.map((x) => (
                                <option key={x} value={x}>
                                  {x}
                                </option>
                              ))}
                              ;
                            </select>
                          </div>
                        </div>

                        <div className='form-group row m-b-15'>
                          <label className='col-form-label col-md-2'>
                            Reward for full stamps
                          </label>
                          <div className='col-md-4'>
                            <input
                              type='text'
                              className='form-control m-b-5'
                              placeholder='Enter reward'
                              value={this.state.data.reward_for_full_stamps}
                              onChange={this.handleChange}
                              name='reward_for_full_stamps'
                              disabled={!this.state.isEditable}
                            />
                          </div>
                        </div>
                      </div>
                    </TabPane>
                  </TabContent>
                  <button
                    className='btn btn-success mr-5 pr-5 pl-5'
                    onClick={() =>
                      this.setState({ secondStep: false, firstStep: true })
                    }
                  >
                    Previous
                  </button>

                  {this.state.isEditable && (
                    <button
                      className='btn btn-success mr-5 pr-5 pl-5'
                      onClick={this.updateLoyalty}
                    >
                      update
                    </button>
                  )}
                </div>
              )}
            </PanelBody>
          </Panel>
        </div>

        {this.state.loading && (
          <SweetAlert
            title=''
            onConfirm={() => {}}
            style={{ background: 'rgba(0, 0, 0, 0)' }}
            customButtons={<React.Fragment></React.Fragment>}
          >
            <div className='fa-10x d-flex justify-content-center'>
              <i className='fas fa-spinner fa-spin'></i>
            </div>
          </SweetAlert>
        )}

        <NotificationContainer />
      </div>
    );
  }
}

export default withRouter(LoyaltyDetail);
