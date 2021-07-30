import React from 'react';
import { withRouter } from 'react-router';
import Joi from 'joi-browser';
import SweetAlert from 'react-bootstrap-sweetalert';
import { GoogleMapComponent } from '../googleMap/googleMapComponent';
import service from '../../services/merchant-service';
import ReactTable from 'react-table';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import TimeInputRange from '../../components/timeInputRange/index';
import voucherService from '../../services/voucher-service';
import {
  Panel,
  PanelHeader,
  PanelBody,
} from './../../components/panel/panel.jsx';
import * as days from '../../utils/days/time-range';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';
import ContactTable from '../../components/contactTable/contact.table';
import classnames from 'classnames';

class MerchantDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMarkerShown: true,
      contactTable: {
        open: false,
      },
      data: {
        merchant_name: '',
        merchant_id: '',
        category_id: '',
        brand_id: '',
        merchant_ads: '',
        description: '',
        county: '',
        address: '',
        lat: 0.0,
        long: 0.0,
        amenities: [],
        opening_hours: [],
        merchant_contact: [],
        uid: '',
      },
      activeTab: '1',
      secondStep: false,
      firstStep: true,
      ...days.timeRange,
      errors: {},
      isEditable: false,
      loading: true,
      categories: [],
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
    merchant_name: Joi.string().label('Merchant name').required(),
    merchant_id: Joi.string().label('Merchant id').required(),
    category_id: Joi.number().label('Category').required(),
    brand_id: Joi.string().label('Brand id').required(),
    merchant_ads: Joi.string().label('Merchant Ads').required(),
    county: Joi.string().label('County').required(),
    description: Joi.string().label('Description').required(),
    address: Joi.string().label('Address').required(),
    lat: Joi.any().label('Latitude').required(),
    long: Joi.any().label('Longitude').required(),
    merchant_contact: Joi.any(),
    uid: Joi.any(),
    amenities: Joi.any(),
    opening_hours: Joi.any(),
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

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const isEditable = this.props.match.path.split('/').includes('edit');
      this.setState({ isEditable });

      const [
        merchantData,
        categoryResponse,
        amenityResponse,
      ] = await Promise.all([
        service.getMerchant(this.props.match.params.id),
        service.getMerchantCategories(),
        voucherService.getAmenities(),
      ]);

      const merchant = merchantData.data.merchant[0];
      const categories = categoryResponse.data.merchant_categories;
      const amenities = amenityResponse.data.amenities;
      const data = this.state.data;

      this.setState({
        categories,
        data: { ...data, ...this.getData(merchant) },
        amenityList: JSON.parse(JSON.stringify(amenities)),
      });
      this.timeRangeResolver();
    } catch (error) {
      console.log(error);
      // NotificationManager.error('Error', 'Could not retrieve clients', this.timeOut);
    } finally {
      this.setState({ loading: false });
    }
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  handleCheckBoxChange = (parent, obj, { currentTarget: input }) => {
    const data = { ...this.state.data };
    const list = [...data[parent]];
    const value = input.checked;

    const existed = list.find((x) => obj.amenities_id === x.amenities_id);
    if (existed) {
      existed.value = value;
    } else list.push({ ...obj, value });

    this.setState({ data: { ...data, [parent]: list } });
  };

  handleRangeChange = (name, { max, min }) => {
    const data = { ...this.state.data };
    const list = [...data.opening_hours];
    const open = min;
    const close = max;

    const existed = list.find((x) => x.name === name);
    if (existed) {
      existed.value = { open, close };
    } else list.push({ name: name, value: { open, close } });

    this.setState({ data: { ...data, opening_hours: list } });
  };

  getData = (data) => {
    const {
      address,
      brand_id,
      county,
      merchant_id,
      merchant_name,
      merchant_contact,
      merchant_ads,
      description,
      category_id,
      uid,
      opening_hours,
      amenities,
    } = data;
    let { lat, long } = data;
    lat = lat ? lat : 0;
    long = long ? long : 0;
    return {
      address,
      brand_id,
      county,
      merchant_id,
      merchant_name,
      merchant_contact,
      description,
      merchant_ads,
      lat,
      long,
      category_id,
      uid,
      opening_hours: opening_hours || [],
      amenities: amenities || [],
    };
  };

  addContact = async (param) => {
    try {
      const id = this.props.match.params.id;
      await service.postContact({ ...param, merchant_id: id });
      NotificationManager.success('Success', 'Contact Added', this.timeOut);
      const res = await service.getMerchant(id);
      const data = res.data.merchant[0];
      this.setState({
        data: this.getData(data),
      });
    } catch (error) {
      console.log(error);
      NotificationManager.error('Error', 'Could not add contact', this.timeOut);
    } finally {
      this.setState({ loading: false });
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
      Header: 'Mobile',
      accessor: 'telephone',
    },
  ];

  updateMerchant = async (event) => {
    event.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors) return;

    const {
      merchant_name,
      description,
      brand_id,
      county,
      address,
      merchant_ads,
      lat,
      long,
      category_id,
      uid,
      amenities,
      opening_hours,
    } = this.state.data;

    const data = {
      merchant_name,
      merchant_id: this.props.match.params.id,
      brand_id,
      description,
      county,
      address,
      merchant_ads,
      lat,
      long,
      category_id,
      uid,
      amenities,
      opening_hours,
    };

    try {
      this.setState({ loading: true });
      await service.putMerchant(data);
      NotificationManager.success('Success', 'Merchant updated', this.timeOut);
    } catch (error) {
      NotificationManager.error(
        'Error',
        'Could not update the merchant',
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  };

  validateFirst = () => {
    const listError = [];
    const dataList = [
      'merchant_name',
      'category_id',
      'merchant_ads',
      'description',
      'county',
      'address',
    ];
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

  handleMarkerClick = (event) => {
    const lat = event.latLng.lat();
    const long = event.latLng.lng();
    const data = { ...this.state.data, lat, long };
    this.setState({ data });
  };

  timeRangeResolver = () => {
    const { opening_hours } = this.state.data;
    if (!opening_hours || !opening_hours.length) return;
    opening_hours.forEach((x) => {
      this.setState({ [x.name]: { min: x.value.open, max: x.value.close } });
    });
  };

  render() {
    const listCategory = this.state.categories?.filter(
      (x) => x === this.state.data.category_id
    );

    const selectedCategory =
      listCategory && !!listCategory.length ? listCategory[0] : '';

    const amenities = this.state.amenityList;
    const days = this.state.days;
    return (
      <div>
        <div className='row'>
          <div className='col-xl-12'>
            <Panel>
              <PanelHeader>
                {' '}
                {this.state.isEditable ? 'Edit Merchant' : 'Merchant Details'}
              </PanelHeader>
              <PanelBody>
                {this.state.firstStep && (
                  <div className='row'>
                    <div className='col-xl-6'>
                      <div className='card border-0 mb-3'>
                        <div className='card-body'>
                          <div>
                            <div className='form-group row m-b-15'>
                              <label className='col-form-label col-md-3'>
                                Merchant Name
                              </label>
                              <div className='col-md-9'>
                                <input
                                  type='text'
                                  className='form-control m-b-5'
                                  placeholder='Enter name'
                                  value={this.state.data.merchant_name}
                                  onChange={this.handleChange}
                                  name='merchant_name'
                                  disabled={!this.state.isEditable}
                                />
                                {this.state.errors['merchant_name'] && (
                                  <div className='pt-2 text-danger'>
                                    <span>
                                      {this.state.errors['merchant_name']}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className='form-group row m-b-15'>
                              <label className='col-form-label col-md-3'>
                                Category
                              </label>
                              <div className='col-md-9'>
                                <select
                                  className='form-control'
                                  value={this.state.data.category_id}
                                  selected={
                                    this.state.data.category_id ===
                                    selectedCategory
                                  }
                                  onChange={this.handleChange}
                                  name='category_id'
                                  disabled={!this.state.isEditable}
                                >
                                  <option>Select category</option>
                                  {this.state.categories.map((x) => (
                                    <option
                                      key={x.category_id}
                                      value={x.category_id}
                                    >
                                      {x.category_name}
                                    </option>
                                  ))}
                                  ;
                                </select>
                                {this.state.errors['category_id'] && (
                                  <div className='pt-2 text-danger'>
                                    <span>
                                      {this.state.errors['category_id']}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className='form-group row m-b-15'>
                              <label className='col-form-label col-md-3'>
                                Description
                              </label>
                              <div className='col-md-9'>
                                <input
                                  type='text'
                                  className='form-control m-b-5'
                                  placeholder='Enter description'
                                  value={this.state.data.description}
                                  onChange={this.handleChange}
                                  name='description'
                                  disabled={!this.state.isEditable}
                                />
                                {this.state.errors['description'] && (
                                  <div className='pt-2 text-danger'>
                                    <span>
                                      {this.state.errors['description']}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className='form-group row m-b-15'>
                              <label className='col-form-label col-md-3'>
                                County
                              </label>
                              <div className='col-md-9'>
                                <input
                                  type='text'
                                  className='form-control m-b-5'
                                  placeholder='Enter county'
                                  value={this.state.data.county}
                                  onChange={this.handleChange}
                                  name='county'
                                  disabled={!this.state.isEditable}
                                />
                                {this.state.errors['county'] && (
                                  <div className='pt-2 text-danger'>
                                    <span>{this.state.errors['county']}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className='form-group row m-b-15'>
                              <label className='col-form-label col-md-3'>
                                Address
                              </label>
                              <div className='col-md-9'>
                                <textarea
                                  type='text'
                                  className='form-control m-b-5'
                                  placeholder='Enter address'
                                  value={this.state.data.address}
                                  onChange={this.handleChange}
                                  name='address'
                                  multiple
                                  disabled={!this.state.isEditable}
                                />
                                {this.state.errors['address'] && (
                                  <div className='pt-2 text-danger'>
                                    <span>{this.state.errors['address']}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className='form-group row m-b-15'>
                              <label className='col-form-label col-md-3'>
                                Merchant Adverts
                              </label>
                              <div className='col-md-9'>
                                <input
                                  type='text'
                                  className='form-control m-b-5'
                                  placeholder='Enter merchant adverts'
                                  value={this.state.data.merchant_ads}
                                  onChange={this.handleChange}
                                  name='merchant_ads'
                                  disabled={!this.state.isEditable}
                                />
                                {this.state.errors['merchant_ads'] && (
                                  <div className='pt-2 text-danger'>
                                    <span>
                                      {this.state.errors['merchant_ads']}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='col-xl-6'>
                      <div className='card border-0 mb-3'>
                        <div className='card-body'>
                          <div>
                            <div className='mb-2'>
                              <GoogleMapComponent
                                isMarkerShown={this.state.isMarkerShown}
                                onMarkerClick={this.handleMarkerClick}
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
                                  onChange={this.handleChange}
                                  value={this.state.data.lat}
                                  name='lat'
                                  disabled={!this.state.isEditable}
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
                                  value={this.state.data.long}
                                  onChange={this.handleChange}
                                  name='long'
                                  disabled={!this.state.isEditable}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
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
                          <span className='d-sm-none'>Amenities</span>
                          <span className='d-sm-block d-none'>Amenities</span>
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
                          <span className='d-sm-none'>Opening times</span>
                          <span className='d-sm-block d-none'>
                            Opening times
                          </span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                      <TabPane tabId='1'>
                        {amenities.map((x, i) => (
                          <div
                            key={x.amenities_id}
                            className='form-group row m-b-15'
                          >
                            <label className='col-form-label col-md-3'>
                              <img
                                src={x.amenities_icon}
                                alt={x.label}
                                style={{
                                  width: 30,
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
                                  onChange={(y) =>
                                    this.handleCheckBoxChange('amenities', x, y)
                                  }
                                  checked={
                                    this.state.data.amenities.find(
                                      (t) => t.name === x.name
                                    )?.value || false
                                  }
                                  disabled={!this.state.isEditable}
                                />
                                <label htmlFor={x.name}></label>
                              </div>
                            </div>
                          </div>
                        ))}{' '}
                      </TabPane>
                      <TabPane tabId='2'>
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
                                value={
                                  this.state.data[x.value] ||
                                  this.state[x.value]
                                }
                                disabled={!this.state.isEditable}
                              />
                            </div>
                          </div>
                        ))}
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
                        onClick={this.updateMerchant}
                      >
                        Update
                      </button>
                    )}
                  </div>
                )}
              </PanelBody>
            </Panel>
          </div>
        </div>

        <h5> Merchant Contacts</h5>
        <div className='row'>
          <div className='col-xl-12 col-lg-12'>
            <div className='card mb-3'>
              <div className='card-body'>
                <ReactTable
                  data={this.state.data.merchant_contact || []}
                  columns={this.reactTablecolumns}
                  defaultPageSize={5}
                  showPageSizeOptions={true}
                  previousText='Prev'
                  nextText='Next'
                  minRows={0}
                  showPageJump={false}
                  resizable={false}
                  className='-striped'
                />
              </div>
            </div>
          </div>
          <ContactTable
            open={this.state.contactTable.open}
            text='Add Client Contact'
            onSubmit={(data) => {
              this.addContact(data);
              this.setState({ contactTable: { open: false } });
            }}
            onCancel={() => this.setState({ contactTable: { open: false } })}
          />
          <div className='breadcrumb float-xl-right  mr-3 ml-3'>
            <button
              className='btn btn-primary'
              onClick={() => {
                this.setState({ contactTable: { open: true } });
              }}
            >
              Add contact
            </button>
          </div>
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
export default withRouter(MerchantDetail);
