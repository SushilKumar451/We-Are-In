import React from 'react';
import { withRouter } from 'react-router';
import Joi from 'joi-browser';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';
import { GoogleMapComponent } from '../googleMap/googleMapComponent';
import brandService from '../../services/brand-service';
import clientService from '../../services/client-service';
import country from '../../utils/country/country.code';
import ContactTable from '../../components/contactTable/contact.table';
import {
  Panel,
  PanelHeader,
  PanelBody,
} from './../../components/panel/panel.jsx';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';

class BrandDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMarkerShown: true,
      contactTable: {
        open: false,
      },
      clients: [],
      data: {
        uid: '',
        brand_id: '',
        brand_name: '',
        category_id: '',
        country: '',
        county: '',
        address: '',
        po_box: '',
        logo: '',
        telephone: '',
        lat: 0.0,
        long: 0.0,
        merchant_count: 0,
        brand_contact: [],
      },
      errors: {},
      loading: false,
      isEditable: false,
      categories: [],
    };
  }

  timeOut = 1000;

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const isEditable = this.props.match.path.split('/').includes('edit');

      const res = await brandService.getBrand(this.props.match.params.id);
      const data = res.data.brand[0];

      const response = await clientService.getClients();
      const clients = response.data;

      const resp = await brandService.getBrandCategories();
      const categories = resp.data.brand_categories;

      this.setState({ data, clients, categories, isEditable });
    } catch (error) {
      console.log(error);
      // NotificationManager.error('Error', 'Could not retrieve clients', this.timeOut);
    } finally {
      this.setState({ loading: false });
    }
  }

  schema = {
    uid: Joi.any(),
    brand_name: Joi.string().label('Brand name').required(),
    brand_id: Joi.string().label('Brand Id').required(),
    category_id: Joi.number().label('Category').required(),
    client_id: Joi.any().label('Client').required(),
    country: Joi.string().label('Country').required(),
    county: Joi.string().label('County').required(),
    po_box: Joi.string().label('P.O Box').required(),
    address: Joi.string().label('Address').required(),
    logo: Joi.string().label('logo').required(),
    telephone: Joi.string().min(6).label('Telephone').required(),
    lat: Joi.any().label('Latitude').required(),
    long: Joi.any().label('Longitude').required(),
    brand_contact: Joi.any(),
    merchant_count: Joi.any(),
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

  updateBrand = async (event) => {
    event.preventDefault();
    if (!this.state.isEditable) return;

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    const {
      brand_name,
      client_id,
      category_id,
      country,
      county,
      address,
      po_box,
      logo,
      telephone,
      lat,
      long,
      uid,
    } = this.state.data;

    const data = {
      client_id,
      brand_id: this.props.match.params.id,
      brand_name,
      category_id,
      country,
      county,
      address,
      po_box,
      logo,
      telephone,
      lat,
      long,
      uid,
    };

    try {
      this.setState({ loading: true });
      await brandService.putBrand(data);

      NotificationManager.success('Success', 'Brand updated', this.timeOut);
    } catch (error) {
      NotificationManager.error(
        'Error',
        'Could not update brand',
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
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

  addContact = async (param) => {
    try {
      const id = this.props.match.params.id;
      await brandService.postContact({ ...param, brand_id: id });

      NotificationManager.success('Success', 'Contact Added', this.timeOut);
      const res = await brandService.getBrand(id);
      const data = res.data.brand[0];

      this.setState({ data });
    } catch (error) {
      console.log(error);
      NotificationManager.error('Error', 'Could not add contact', this.timeOut);
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

  render() {
    const listCountry = country.list.filter(
      (x) => x.code3 === this.state.data.country
    );
    const listCategory = this.state.categories.filter(
      (x) => x === this.state.data.category_id
    );
    const listClient = this.state.clients.filter(
      (x) => x.client_id === this.state.data.client_id
    );
    const selectedCountry =
      listCountry && !!listCountry.length ? listCountry[0] : '';
    const selectedCategory =
      listCategory && !!listCategory.length ? listCategory[0] : '';
    const selectedClient =
      listClient && !!listClient.length ? listClient[0] : '';

    return (
      <div className='row'>
        <div className='col-xl-12'>
          <Panel>
            <PanelHeader>
              {' '}
              {this.state.isEditable ? 'Edit Brand ' : 'Brand Details'}
            </PanelHeader>
            <PanelBody>
              <div className='row'>
                <div className='col-xl-6 col-lg-6'>
                  <div className='card   border-0  mb-3'>
                    <div className='card-body'>
                      <div>
                        <div className='form-group row m-b-15'>
                          <label className='col-form-label col-md-3'>
                            Brand Name
                          </label>
                          <div className='col-md-9'>
                            <input
                              type='text'
                              className='form-control m-b-5'
                              placeholder='Enter voucher name'
                              value={this.state.data.brand_name}
                              onChange={this.handleChange}
                              name='brand_name'
                              disabled={!this.state.isEditable}
                            />
                            {this.state.errors['brand_name'] && (
                              <div className='pt-2 text-danger'>
                                <span>{this.state.errors['brand_name']}</span>
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
                                <span>{this.state.errors['category_id']}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className='form-group row m-b-15'>
                          <label className='col-form-label col-md-3'>
                            Clients
                          </label>
                          <div className='col-md-9'>
                            <select
                              className='form-control'
                              value={this.state.data.client_id}
                              selected={
                                this.state.data.client_id ===
                                selectedClient.client_id
                              }
                              onChange={this.handleChange}
                              name='client_id'
                              disabled={!this.state.isEditable}
                            >
                              <option>Select client </option>
                              {this.state.clients.map((x) => (
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
                          <label className='col-form-label col-md-3'>
                            Country
                          </label>
                          <div className='col-md-9'>
                            <select
                              className='form-control'
                              value={this.state.data.country}
                              selected={
                                this.state.data.country ===
                                selectedCountry?.code3
                              }
                              onChange={this.handleChange}
                              name='country'
                              disabled={!this.state.isEditable}
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
                            Logo
                          </label>
                          <div className='col-md-9'>
                            <input
                              type='logo'
                              className='form-control m-b-5'
                              placeholder='Enter logo'
                              value={this.state.data.logo}
                              onChange={this.handleChange}
                              name='logo'
                              disabled={!this.state.isEditable}
                            />
                            {this.state.errors['logo'] && (
                              <div className='pt-2 text-danger'>
                                <span>{this.state.errors['logo']}</span>
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
                            Telephone number
                          </label>
                          <div className='col-md-9'>
                            <input
                              type='text'
                              className='form-control m-b-5'
                              placeholder='Enter telephone number'
                              value={this.state.data.telephone}
                              onChange={this.handleChange}
                              name='telephone'
                              disabled={!this.state.isEditable}
                            />
                            {this.state.errors['telephone'] && (
                              <div className='pt-2 text-danger'>
                                <span>{this.state.errors['telephone']}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className='form-group row m-b-15'>
                          <label className='col-form-label col-md-3'>
                            P.O Box
                          </label>
                          <div className='col-md-9'>
                            <input
                              type='text'
                              className='form-control m-b-5'
                              placeholder='Enter p.o box'
                              value={this.state.data.po_box}
                              onChange={this.handleChange}
                              name='po_box'
                              disabled={!this.state.isEditable}
                            />
                            {this.state.errors['po_box'] && (
                              <div className='pt-2 text-danger'>
                                <span>{this.state.errors['po_box']}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xl-6 col-lg-6'>
                  <div className='card  border-0   mb-3'>
                    <div className='card-body'>
                      <div>
                        <div className='mb-2'>
                          <GoogleMapComponent
                            isMarkerShown={this.state.isMarkerShown}
                            onMarkerClick={this.handleMarkerClick}
                            disabled={!this.state.isEditable}
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
                              disabled={!this.state.isEditable}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {this.state.isEditable && (
                  <div className='breadcrumb float-xl-right  mr-3 ml-3'>
                    <button
                      className='btn btn-primary'
                      onClick={this.updateBrand}
                    >
                      Update
                    </button>
                  </div>
                )}
              </div>
              <div className='row'>
                <div className='col-xl-12 col-lg-12'>
                  <div className='breadcrumb float-xl-right'>
                    <Link
                      className='btn btn-primary'
                      to={`/merchant/create/${this.props.match.params.id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      Create Merchant
                    </Link>
                  </div>
                </div>{' '}
              </div>

              <h5> Brand Contacts</h5>
              <div className='row'>
                <div className='col-xl-12 col-lg-12'>
                  <div className='card mb-3'>
                    <div className='card-body'>
                      <ReactTable
                        data={this.state.data.brand_contact || []}
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
                  text='Add Brand Contact'
                  onSubmit={(data) => {
                    this.addContact(data);
                    this.setState({ contactTable: { open: false } });
                  }}
                  onCancel={() =>
                    this.setState({ contactTable: { open: false } })
                  }
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

export default withRouter(BrandDetail);
