import React from 'react';
import Joi from 'joi-browser';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ReactTable from 'react-table';

import DatePicker from 'react-datepicker';
import SweetAlert from 'react-bootstrap-sweetalert';
import brandService from '../../services/brand-service';

import clientService from '../../services/client-service';
import voucherService from '../../services/voucher-service';
import merchantService from '../../services/merchant-service';
import TimeInputRange from '../../components/timeInputRange/index';
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
import * as days from '../../utils/days/time-range';
import 'react-datetime/css/react-datetime.css';
import 'react-datepicker/dist/react-datepicker.css';
import classnames from 'classnames';

class VoucherDetail extends React.Component {
  constructor(props) {
    super(props);
    this.init();
    this.state = {
      ...days.timeRange,
      data: {
        voucher_name: '',
        client_id: '',
        brand_id: '',
        category_id: '',
        merchant_id: '',
        voucher_details: [],
        amenities: [],
        start_date: '',
        end_date: '',
        opening_time: [],
        now: false,
        exclude_national_holidays: false,
        push_to: '',
      },
      editable: false,
      merchantDetails: null,
      activeTab: '1',
      categories: [],
      isMarkerShown: true,
      voucherDetails: [],
      firstStep: true,
      secondStep: false,
      clientList: [],
      merchantList: [],
      brandList: [],
      errors: {},
      loading: false,
      disabledBtn: true,
      days: [
        { id: 1, label: 'Monday', value: 'monday' },
        { id: 2, label: 'Tuesday', value: 'tuesday' },
        { id: 3, label: 'Wednesday', value: 'wednesday' },
        { id: 4, label: 'Thursday', value: 'thursday' },
        { id: 5, label: 'Friday', value: 'friday' },
        { id: 6, label: 'Saturday', value: 'saturday' },
        { id: 7, label: 'Sunday', value: 'sunday' },
      ],
    };
  }

  timeOut = 1000;

  schema = {
    voucher_name: Joi.string().label('Voucher name').required(),
    client_id: Joi.string()
      .replace('Select client', '')
      .label('Client name')
      .required(),
    category_id: Joi.string()
      .replace('Select category', '')
      .label('Category')
      .required(),
    brand_id: Joi.string()
      .replace('Select brand', '')
      .label('Brand name')
      .required(),
    merchant_id: Joi.string()
      .replace('Select merchant', '')
      .label('Merchant name')
      .required(),
    voucher_details: Joi.any(),
    amenities: Joi.any(),
    start_date: Joi.date(),
    end_date: Joi.date(),
    opening_time: Joi.any(),
    exclude_national_holidays: Joi.boolean(),
    push_to: Joi.string(),
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
      const editable = this.props.match.path.split('/').includes('edit');
      this.setState({ editable });

      const res = await voucherService.getVoucher(this.props.match.params.id);
      const data = res.data.voucher[0];
      let { start_date, end_date } = data;
      start_date = dateHelper.convert(start_date);
      end_date = dateHelper.convert(end_date);

      this.setState({
        data: { ...data, start_date, end_date },
      });

      const { client_id, brand_id, merchant_id } = data;
      await this.getBrands(client_id);
      await this.getMerchants(brand_id);
      await this.getMerchantDetails(merchant_id);
      this.timeRangeResolver();
    } catch (error) {
      console.log(error);
      // NotificationManager.error('Error', 'Could not retrieve clients', this.timeOut);
    } finally {
      this.setState({ loading: false });
    }
  }

  init = async () => {
    try {
      const [
        clientResponse,
        voucherResponse,
        categoryResponse,
      ] = await Promise.all([
        clientService.getClients(),
        voucherService.getDetails(),
        voucherService.getVoucherCategories(),
        voucherService.getAmenities(),
      ]);

      const clientList = clientResponse.data;
      const voucherDetails = voucherResponse.data.voucher_details;
      const categories = categoryResponse.data.voucher_categories;

      this.setState({
        categories,
        clientList,
        voucherDetails,
      });
    } catch (error) {
      console.log(error);
      NotificationManager.error(
        'Error',
        'Could not retrieve clients',
        this.timeOut
      );
    }
  };

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

  handleCheckBoxChange = (parent, { currentTarget: input }) => {
    const data = { ...this.state.data };
    const list = [...data[parent]];
    const name = input.name;
    const value = input.checked;

    const existed = list.find((x) => x.name === name);
    if (existed) {
      existed.value = value;
    } else list.push({ name, value });

    this.setState({ data: { ...data, [parent]: list } });
  };

  handleRangeChange = (name, { max, min }) => {
    const data = { ...this.state.data };
    const list = [...data.opening_time];
    const open = min;
    const close = max;

    const existed = list.find((x) => x.name === name);
    if (existed) {
      existed.value = { open, close };
    } else list.push({ name: name, value: { open, close } });

    this.setState({ data: { ...data, opening_time: list } });
  };

  validateFirst = () => {
    const listError = [];
    const dataList = [
      'voucher_name',
      'client_id',
      'brand_id',
      'merchant_id',
      'category_id',
    ];
    const { data } = this.state;
    dataList.forEach((x) => {
      let input = { name: x, value: `${data[x]}` };

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
      //const merchantList = [];
      if (!brandList || !brandList.length)
        NotificationManager.warning(
          'Warning',
          'There are no brands for this client',
          this.timeOut
        );
      this.setState({ brandList });
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
        disabledBtn: false,
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

  updateVoucher = async () => {
    this.setState({ loading: true });
    try {
      const data = { ...this.state.data };
      let { start_date, end_date } = data;
      start_date = dateHelper.convertToSimpleDate(start_date);
      end_date = dateHelper.convertToSimpleDate(end_date);
      const category_id = +data.category_id;

      await voucherService.putVoucher({
        ...data,
        start_date,
        end_date,
        category_id,
      });
      NotificationManager.success('Success', 'Voucher updated', this.timeOut);
    } catch (error) {
      console.log(error);
      NotificationManager.error(
        'Error',
        'Could not add the voucher',
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  };

  timeRangeResolver = () => {
    const { opening_time } = this.state.data;
    if (!opening_time || !opening_time.length) return;
    opening_time.forEach((x) => {
      this.setState({ [x.name]: { min: x.value.open, max: x.value.close } });
    });
  };

  render() {
    const voucherDetails = this.state.voucherDetails;
    const amenities = this.state.merchantDetails?.amenities || [];
    const { data, categories } = this.state;
    const listCategory = categories.filter(
      (x) => x.category_id === this.state.data.category_id
    );

    const selectedCategory =
      listCategory && !!listCategory.length ? listCategory[0] : '';
    const days = this.state.days;
    const contacts = this.state.merchantDetails
      ? this.state.merchantDetails.merchant_contact || []
      : [];
    return (
      <div className='row'>
        <div className='col-xl-12'>
          <Panel>
            <PanelHeader>
              {!this.state.editable ? 'Voucher Details' : 'Edit Voucher'}{' '}
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
                        disabled={!this.state.editable}
                        value={this.state.data.voucher_name}
                        onChange={this.handleChange}
                        name='voucher_name'
                      />
                      {this.state.errors['voucher_name'] && (
                        <div className='pt-2 text-danger'>
                          <span>{this.state.errors['voucher_name']}</span>
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
                        disabled={!this.state.editable}
                        name='client_id'
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
                        disabled={!this.state.editable}
                        name='brand_id'
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
                        disabled={!this.state.editable}
                        name='merchant_id'
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
                  <div className='form-group row m-b-15'>
                    <label className='col-form-label col-md-3'>Category</label>
                    <div className='col-md-9'>
                      <select
                        className='form-control'
                        selected={
                          this.state.data.category_id ===
                          selectedCategory?.category_id
                        }
                        value={this.state.data.category_id}
                        onChange={this.handleChange}
                        disabled={!this.state.editable}
                        name='category_id'
                      >
                        <option>Select category</option>
                        {this.state.categories.map((x) => (
                          <option key={x.category_id} value={x.category_id}>
                            {x.category_name}
                          </option>
                        ))}
                        ;
                      </select>
                      {this.state.errors['category_id'] && (
                        <div className='pt-2 text-danger'>
                          <span>{this.state.errors['category_id']}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    className='btn btn-success mr-5 pr-5 pl-5'
                    onClick={this.validateFirst}
                    disabled={this.state.disabledBtn}
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
                        <span className='d-sm-none'>Voucher Details</span>
                        <span className='d-sm-block d-none'>
                          Voucher Details
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
                        <span className='d-sm-none'>Amenities</span>
                        <span className='d-sm-block d-none'>Amenities</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeTab === '4',
                        })}
                        onClick={() => {
                          this.toggleTab('4');
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
                            lat={this.state.data?.lat || ''}
                            long={this.state.data?.long || ''}
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
                              value={this.state.data?.lat || ''}
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
                              value={this.state.data?.long || ''}
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
                              value={this.state.data?.logo || ''}
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
                      {voucherDetails.map((x, i) => (
                        <div
                          key={x.voucher_details_id}
                          className='form-group row m-b-15'
                        >
                          <label className='col-form-label col-md-3'>
                            <img
                              src={x.voucher_details_icon}
                              alt={x.label}
                              style={{
                                width: 35,
                                height: 30,
                                paddingRight: 5,
                              }}
                            />
                            {x.label}
                          </label>
                          <div className='col-md-9 '>
                            <div className='switcher switcher-success'>
                              <input
                                type='checkbox'
                                name={x.name}
                                disabled={!this.state.editable}
                                id={x.name}
                                onChange={(x) =>
                                  this.handleCheckBoxChange(
                                    'voucher_details',
                                    x
                                  )
                                }
                                checked={
                                  this.state.data.voucher_details.find(
                                    (t) => t.name === x.name
                                  )?.value || false
                                }
                              />
                              <label htmlFor={x.name}></label>
                            </div>
                          </div>
                        </div>
                      ))}{' '}
                    </TabPane>
                    <TabPane tabId='3'>
                      {amenities.map((x, i) => (
                        <div key={i} className='form-group row m-b-15'>
                          <label className='col-form-label col-md-3'>
                            <img
                              src={x.amenities_icon}
                              alt={x.label}
                              style={{
                                width: 35,
                                height: 30,
                                paddingRight: 5,
                              }}
                            />
                            {x.label}
                          </label>
                          <div className='col-md-9 '>
                            <div className='switcher switcher-success'>
                              <input
                                type='checkbox'
                                name={x.name}
                                id={x.name}
                                onChange={(x) =>
                                  this.handleCheckBoxChange('amenities', x)
                                }
                                checked={x.value || false}
                                disabled
                              />
                              <label htmlFor={x.name}></label>
                            </div>
                          </div>
                        </div>
                      ))}{' '}
                    </TabPane>
                    <TabPane tabId='4'>
                      <div>
                        <div className='form-group row m-b-15'>
                          <label className='col-form-label col-lg-2'>
                            Excluding national holidays
                          </label>
                          <div className='col-md-8'>
                            <div className='switcher switcher-success'>
                              <input
                                type='checkbox'
                                name='exclude_national_holidays'
                                id='exclude_national_holidays'
                                disabled={!this.state.editable}
                                onChange={(x) =>
                                  this.setState({
                                    data: {
                                      ...data,
                                      exclude_national_holidays:
                                        x.currentTarget.checked,
                                    },
                                  })
                                }
                                checked={
                                  this.state.data.exclude_national_holidays
                                }
                              />
                              <label htmlFor='exclude_national_holidays'></label>
                            </div>
                          </div>
                        </div>
                        <div className='form-group row m-b-15'>
                          <label className='col-form-label col-lg-2'>NOW</label>
                          <div className='col-md-8'>
                            <div className='switcher switcher-success'>
                              <input
                                type='checkbox'
                                name='now'
                                id='now'
                                onChange={(x) =>
                                  this.setState({
                                    data: {
                                      ...data,
                                      now: x.currentTarget.checked,
                                    },
                                  })
                                }
                                checked={this.state.data.now}
                              />
                              <label htmlFor='now'></label>
                            </div>
                          </div>
                        </div>

                        <div className='form-group row'>
                          <label className='col-lg-2 col-form-label'>
                            Push to
                          </label>
                          <div className='col-lg-8'>
                            <select
                              className='form-control'
                              value={this.state.data.push_to}
                              onChange={this.handleChange}
                              disabled={!this.state.editable}
                              name='push_to'
                            >
                              <option>Select </option>
                              <option value='Global'> Global </option>
                              <option value='Conurbation / city,'>
                                {' '}
                                Conurbation / city,{' '}
                              </option>
                              <option value='Favourites'> Favourites </option>
                              <option value='Previously redeemed members'>
                                {' '}
                                Previously redeemed members{' '}
                              </option>
                            </select>
                          </div>
                        </div>

                        <div className='form-group row'>
                          <label className='col-lg-2 col-form-label'>
                            Start Date
                          </label>
                          <div className='col-lg-8'>
                            <DatePicker
                              selected={this.state.data.start_date}
                              dateFormat='dd/MM/yyyy'
                              onChange={(x) => this.handleDate('start_date', x)}
                              className='form-control'
                              disabled={!this.state.editable}
                              name='start_date'
                            />
                          </div>
                        </div>
                        <div className='form-group row'>
                          <label className='col-lg-2 col-form-label'>
                            End Date
                          </label>
                          <div className='col-lg-8'>
                            <DatePicker
                              selected={this.state.data.end_date}
                              dateFormat='dd/MM/yyyy'
                              onChange={(x) => this.handleDate('end_date', x)}
                              className='form-control'
                              disabled={!this.state.editable}
                              name='end_date'
                            />
                          </div>
                        </div>

                        {days.map((x) => (
                          <div className='form-group row pt-3' key={x.id}>
                            <label className='col-lg-2 col-form-label'>
                              {x.label}
                            </label>
                            <div className='col-lg-8'>
                              <TimeInputRange
                                onChange={(value) =>
                                  this.setState({ [x.value]: value })
                                }
                                onChangeComplete={(value) =>
                                  this.handleRangeChange(x.value, value)
                                }
                                value={this.state[x.value]}
                              />
                            </div>
                          </div>
                        ))}
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

                  {this.state.editable && (
                    <button
                      className='btn btn-success mr-5 pr-5 pl-5'
                      onClick={this.updateVoucher}
                    >
                      Update
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

const mapStateToProps = (state, auth = state.auth) => ({
  isSignedInForVoucher: auth.signedInForAdminRole,
  hasError: auth.hasError,
  loading: auth.loading,
});

export default connect(mapStateToProps)(withRouter(VoucherDetail));
