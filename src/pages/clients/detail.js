import React from 'react';
import { withRouter } from 'react-router';
import Joi from 'joi-browser';
import ReactTable from 'react-table';
import SweetAlert from 'react-bootstrap-sweetalert';
import { GoogleMapComponent } from '../googleMap/googleMapComponent';
import service from '../../services/client-service';
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

class ClientDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMarkerShown: true,
      contactTable: {
        open: false,
      },
      data: {
        uid: '',
        client_name: '',
        client_id: '',
        category_id: '',
        country: '',
        county: '',
        address: '',
        po_box: '',
        logo: undefined,
        lat: 0.0,
        long: 0.0,
        client_contacts: [],
      },
      errors: {},
      loading: false,
      isEditable: false,
      categories: [],
    };
  }

  timeOut = 1000;

  schema = {
    uid: Joi.any(),
    client_name: Joi.string().label('Client name').required(),
    client_id: Joi.string().label('Client Id').required(),
    category_id: Joi.number().label('Category').required(),
    category_name: Joi.string(),
    country: Joi.string().label('Country').required(),
    county: Joi.string().label('County').required(),
    po_box: Joi.string().label('P.O Box').required(),
    logo: Joi.any(),
    address: Joi.string().label('Address').required(),
    lat: Joi.any().label('Latitude').required(),
    long: Joi.any().label('Longitude').required(),
    client_contacts: Joi.any(),
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

  updateClient = async (event) => {
    event.preventDefault();
    if (!this.state.isEditable) return;

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    const {
      client_name,
      category_id,
      country,
      county,
      address,
      po_box,
      logo,
      lat,
      long,
      uid,
    } = this.state.data;

    const data = {
      client_id: this.props.match.params.id,
      client_name,
      category_id,
      country,
      county,
      address,
      po_box,
      logo,
      lat,
      long,
      uid,
    };

    try {
      this.setState({ loading: true });
      await service.putClient(data);
      NotificationManager.success('Success', 'Client update', this.timeOut);
    } catch (error) {
      NotificationManager.error(
        'Error',
        'Could not update client',
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  };

  addContact = async (param) => {
    try {
      const id = this.props.match.params.id;
      await service.postContact({ ...param, client_id: id });
      NotificationManager.success('Success', 'Contact Added', this.timeOut);
      const res = await service.getClient(id);
      const data = res.data.client[0];
      let { lat, long } = data;
      lat = lat ? lat : 0;
      long = long ? long : 0;
      this.setState({ data: { ...data, lat, long } });
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

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const isEditable = this.props.match.path.split('/').includes('edit');
      this.setState({ isEditable });

      const res = await service.getClient(this.props.match.params.id);
      const response = await service.getClientCategories();
      const categories = response.data.client_categories;

      const data = res.data.client[0];
      let { lat, long, logo } = data;
      lat = lat ? lat : 0;
      long = long ? long : 0;
      logo = logo || undefined;
      this.setState({ data: { ...data, lat, long, logo }, categories });
    } catch (error) {
      console.log(error);
      // NotificationManager.error('Error', 'Could not retrieve clients');
    } finally {
      this.setState({ loading: false });
    }
  }

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
      (x) => x === this.state.category_id
    );
    const selectedCountry =
      listCountry && !!listCountry.length ? listCountry[0] : '';
    const selectedCategory =
      listCategory && !!listCategory.length ? listCategory[0] : '';

    return (
      <div className='row'>
        <div className='col-xl-12'>
          <Panel>
            <PanelHeader>
              {' '}
              {this.state.isEditable ? 'Edit Client' : 'Client Details'}
            </PanelHeader>
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
                            disabled={!this.state.isEditable}
                          />
                          {this.state.errors['client_name'] && (
                            <div className='pt-2 text-danger'>
                              <span>{this.state.errors['client_name']}</span>
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
                          ddisabled={!this.state.isEditable}
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
                {this.state.isEditable && (
                  <div className='row mb-5'>
                    <div className='col-xl-12 col-lg-12'>
                      <div className='breadcrumb float-xl-right  mr-3 ml-3'>
                        <button
                          className='btn btn-primary'
                          onClick={this.updateClient}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <h5> Client Contacts</h5>
              <div className='row'>
                <div className='col-xl-12 col-lg-12'>
                  <div className='card mb-3'>
                    <div className='card-body'>
                      <ReactTable
                        data={this.state.data.client_contacts || []}
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

export default withRouter(ClientDetail);
