import React from 'react';
import Joi from 'joi-browser';
import { withRouter } from 'react-router';
import SweetAlert from 'react-bootstrap-sweetalert';
import { GoogleMapComponent } from '../googleMap/googleMapComponent';
import service from '../../services/merchant-service';
import voucherService from '../../services/voucher-service';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import TimeInputRange from '../../components/timeInputRange/index';
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
import classnames from 'classnames';

class CreateMerchant extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMarkerShown: true,
      ...days.timeRange,
      data: {
        merchant_name: '',
        category_id: '',
        merchant_ads: '',
        description: '',
        county: '',
        address: '',
        lat: 0.0,
        long: 0.0,
        amenities: [],
        opening_hours: [],
      },
      activeTab: '1',
      firstStep: true,
      secondStep: false,
      errors: {},
      loading: false,
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
    merchant_ads: Joi.string().label('Merchant Ads').required(),
    county: Joi.string().label('County').required(),
    description: Joi.string().label('Description').required(),
    address: Joi.string().label('Address').required(),
    lat: Joi.any().label('Latitude').required(),
    long: Joi.any().label('Longitude').required(),
    category_id: Joi.number().label('Category').required(),
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

  reset = () => {
    const data = this.state.data;
    const amenityList = this.state.amenityList;
    this.setState({
      isMarkerShown: true,
      secondStep: false,
      firstStep: true,
      ...days.timeRange,
      data: {
        ...data,
        amenities: JSON.parse(JSON.stringify(amenityList)),
        merchant_name: '',
        category_id: '',
        merchant_ads: '',
        description: '',
        county: '',
        address: '',
        lat: 0.0,
        long: 0.0,
        opening_hours: [],
      },
      errors: {},
      loading: false,
    });
  };

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  addMerchant = async (event) => {
    event.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors) return;

    const {
      merchant_name,
      description,
      county,
      address,
      category_id,
      merchant_ads,
      lat,
      long,
      amenities,
      opening_hours,
    } = this.state.data;

    const data = {
      merchant_name,
      brand_id: this.props.match.params.id,
      description,
      county,
      address,
      merchant_ads,
      category_id: +category_id,
      lat,
      long,
      amenities,
      opening_hours,
    };

    try {
      this.setState({ loading: true });
      await service.postMerchant(data);
      NotificationManager.success('Success', 'Merchant added', this.timeOut);
      this.reset();
    } catch (error) {
      NotificationManager.error(
        'Error',
        'Could not add the merchant',
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

  handleMarkerClick = (event) => {
    const lat = event.latLng.lat();
    const long = event.latLng.lng();
    const data = { ...this.state.data, lat, long };
    this.setState({ data });
  };

  async componentDidMount() {
    try {
      const [categoryResponse, amenityResponse] = await Promise.all([
        await service.getMerchantCategories(),
        await voucherService.getAmenities(),
      ]);

      const categories = categoryResponse.data.merchant_categories;
      const amenities = amenityResponse.data.amenities;
      const data = this.state.data;

      this.setState({
        categories,
        data: { ...data, amenities },
        amenityList: JSON.parse(JSON.stringify(amenities)),
      });
    } catch (error) {
      NotificationManager.error(
        'Error',
        'Could not retrieve amenities',
        this.timeOut
      );
    }
  }

  render() {
    const listCategory = this.state.categories?.filter(
      (x) => x === this.state.data.category_id
    );

    const selectedCategory =
      listCategory && !!listCategory.length ? listCategory[0] : '';

    const amenities = this.state.data.amenities;
    const days = this.state.days;
    return (
      <div className='row'>
        <div className='col-xl-12'>
          <Panel>
            <PanelHeader>Create New Merchant</PanelHeader>
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
                        <span className='d-sm-block d-none'>Opening times</span>
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
                              value={this.state[x.value]}
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

                  <button
                    className='btn btn-success mr-5 pr-5 pl-5'
                    onClick={this.addMerchant}
                  >
                    Save
                  </button>
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
export default withRouter(CreateMerchant);
