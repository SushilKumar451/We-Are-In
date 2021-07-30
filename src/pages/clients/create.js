import React from 'react';
import Joi from 'joi-browser';
import SweetAlert from 'react-bootstrap-sweetalert';

import { GoogleMapComponent } from '../googleMap/googleMapComponent';
import service from '../../services/client-service';
import country from '../../utils/country/country.code';
import {
  Panel,
  PanelHeader,
  PanelBody,
} from './../../components/panel/panel.jsx';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';

class CreateClient extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMarkerShown: true,
      data: {
        client_name: '',
        email: '',
        category_id: '',
        country: '',
        county: '',
        address: '',
        po_box: '',
        logo: '',
        lat: 0.0,
        long: 0.0,
      },
      errors: {},
      loading: false,
      categories: [],
    };
  }

  timeOut = 1000;

  schema = {
    client_name: Joi.string().label('Client name').required(),
    email: Joi.string().email().label('Email').required(),
    category_id: Joi.number().label('Category').required(),
    country: Joi.string().label('Country').required(),
    county: Joi.string().label('County').required(),
    po_box: Joi.string().label('P.O Box').required(),
    logo: Joi.any(),
    address: Joi.string().label('Address').required(),
    lat: Joi.any().label('Latitude').required(),
    long: Joi.any().label('Longitude').required(),
  };

  async componentDidMount() {
    const response = await service.getClientCategories();
    const categories = response.data.client_categories;
    this.setState({ categories });
  }

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

  reset = () => {
    this.setState({
      isMarkerShown: true,
      data: {
        client_name: '',
        email: '',
        category_id: '',
        country: '',
        county: '',
        address: '',
        po_box: '',
        logo: undefined,
        lat: 0.0,
        long: 0.0,
      },
      errors: {},
    });
  };

  addClient = async (event) => {
    event.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    const data = this.state.data;
    try {
      this.setState({ loading: true });
      await service.postClient(data);
      NotificationManager.success('Success', 'Client added', this.timeOut);
      this.reset();
    } catch (error) {
      NotificationManager.error('Error', 'Could not add client', this.timeOut);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleMarkerClick = (event) => {
    const lat = event.latLng.lat();
    const long = event.latLng.lng();
    const data = { ...this.state.data, lat, long };
    this.setState({ data });
  };

  encode = (event) => {
    var selectedfile = event.target.files;
    if (selectedfile.length > 0) {
      var imageFile = selectedfile[0];
      var fileReader = new FileReader();
      fileReader.onload = (fileLoadedEvent) => {
        const { data } = this.state;
        this.setState({
          data: { ...data, logo: fileLoadedEvent.target.result },
        });
      };
      fileReader.readAsDataURL(imageFile);
    }
  };

  onDrop = (event) => {
    if (event.target.files[0].size > 70041) {
      NotificationManager.error('Error', 'File is too big', this.timeout);
      return;
    }
    this.encode(event);
  };

  render() {
    const listCountry = country.list.filter(
      (x) => x.code3 === this.state.data.country
    );
    const listCategory = this.state.categories.filter(
      (x) => x === this.state.data.category_id
    );

    const selectedCountry =
      listCountry && !!listCountry.length ? listCountry[0] : '';
    const selectedCategory =
      listCategory && !!listCategory.length ? listCategory[0] : '';

    return (
      <div className='row'>
        <div className='col-xl-12'>
          <Panel>
            <PanelHeader>Create New Client</PanelHeader>
            <PanelBody>
              <div className='row'>
                <div className='col-xl-6 col-lg-6'>
                  <div className='card border-0  mb-3'>
                    <div className='card-body'>
                      <div className='form-group row m-b-15'>
                        <label className='col-form-label col-md-3'>
                          Client Name
                        </label>
                        <div className='col-md-9'>
                          <input
                            type='text'
                            className='form-control m-b-5'
                            placeholder='Enter name'
                            value={this.state.data.client_name}
                            onChange={this.handleChange}
                            name='client_name'
                          />
                          {this.state.errors['client_name'] && (
                            <div className='pt-2 text-danger'>
                              <span>{this.state.errors['client_name']}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='form-group row m-b-15'>
                        <label className='col-form-label col-md-3'>Email</label>
                        <div className='col-md-9'>
                          <input
                            type='text'
                            className='form-control m-b-5'
                            placeholder='Enter email'
                            value={this.state.data.email}
                            onChange={this.handleChange}
                            name='email'
                          />
                          {this.state.errors['email'] && (
                            <div className='pt-2 text-danger'>
                              <span>{this.state.errors['email']}</span>
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
                              this.state.data.category_id === selectedCategory
                            }
                            onChange={this.handleChange}
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

                      <div className='form-group row m-b-15'>
                        <label className='col-form-label col-md-3'>
                          Country
                        </label>
                        <div className='col-md-9'>
                          <select
                            className='form-control'
                            value={this.state.data.country}
                            selected={
                              this.state.data.country === selectedCountry?.code3
                            }
                            onChange={this.handleChange}
                            name='country'
                          >
                            <option>Select country</option>
                            {country.list.map((x) => (
                              <option key={x.code3} value={x.code3}>
                                {x.name}
                              </option>
                            ))}
                            ;
                          </select>
                          {this.state.errors['country'] && (
                            <div className='pt-2 text-danger'>
                              <span>{this.state.errors['country']}</span>
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
                          PIN Code
                        </label>
                        <div className='col-md-9'>
                          <input
                            type='text'
                            className='form-control m-b-5'
                            placeholder='Enter PIN Code'
                            value={this.state.data.po_box}
                            onChange={this.handleChange}
                            name='po_box'
                          />
                          {this.state.errors['po_box'] && (
                            <div className='pt-2 text-danger'>
                              <span>{this.state.errors['po_box']}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='form-group row m-b-15'>
                        <label className='col-form-label col-md-3'>Logo</label>
                        <div className='col-md-4'>
                          <input
                            type='file'
                            onChange={this.onDrop}
                            accept='image/x-png, image/gif, image/jpeg'
                          />
                        </div>
                        <div className='col-md-5'>
                          {this.state.data?.logo && (
                            <img
                              src={this.state.data?.logo}
                              alt=''
                              style={{ width: 50, height: 50 }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xl-6 col-lg-6'>
                  <div className='card border-0  mb-3'>
                    <div className='card-body'>
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
                            value={this.state.data.lat}
                            onChange={this.handleChange}
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
                <div className='breadcrumb float-xl-right ml-2 pl-1'>
                  <button className='btn btn-primary' onClick={this.addClient}>
                    Create
                  </button>
                </div>
                <div className='breadcrumb float-xl-right mr-3 ml-3'>
                  <button className='btn btn-danger' onClick={this.reset}>
                    Cancel
                  </button>
                </div>
              </div>
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

export default CreateClient;
