import React from 'react';
import NVD3Chart from 'react-nvd3';
import d3 from 'd3';
import ReactTable from 'react-table';
import Joi from 'joi-browser';
import { GoogleMapComponent } from '../googleMap/googleMapComponent';
import { withRouter } from 'react-router';
import SweetAlert from 'react-bootstrap-sweetalert';
import service from '../../services/customer-service';

import {
  Panel,
  PanelHeader,
  PanelBody,
} from '../../components/panel/panel.jsx';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';

class CustomerDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        customer_id: '',
        firstname: '',
        surname: '',
        phone: '',
        email: '',
        status_id: '',
        create_date: '',
        location_by_location: [],
        location_stats: [],
        subscription: null,
        total_saved_value: null,
        vouchers_redeemed: [],
        picture: null,
      },
      isEditable: false,
      status: [],
      errors: {},
      loading: false,
      lineChart: {
        options: {
          chart: {
            type: 'line',
            height: 350,
            shadow: {
              enabled: true,
              color: '#2d353c',
              top: 18,
              left: 7,
              blur: 10,
              opacity: 1,
            },
            toolbar: {
              show: false,
            },
          },
          title: {
            text: 'Average High & Low Total Saved value',
            align: 'center',
          },
          colors: ['#348fe2', '#00acac'],
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: 'smooth',
            width: 3,
          },
          grid: {
            row: {
              colors: ['rgba(182, 194, 201, 0.1)', 'transparent'],
              opacity: 0.5,
            },
          },
          markers: {
            size: 2,
          },
          xaxis: {
            categories: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri'],
            axisBorder: {
              show: true,
              color: 'rgba(182, 194, 201, 0.5)',
              height: 1,
              width: '100%',
              offsetX: 0,
              offsetY: -1,
            },
            axisTicks: {
              show: true,
              borderType: 'solid',
              color: '#b6c2c9',
              height: 6,
              offsetX: 0,
              offsetY: 0,
            },
          },
          yaxis: {
            min: 0,
            max: 100,
          },
          legend: {
            show: true,
            position: 'top',
            offsetY: -10,
            horizontalAlign: 'right',
            floating: true,
          },
        },
        series: [
          {
            name: 'High - 2020',
            data: [28, 29, 33, 36, 32, 32, 33],
          },
          {
            name: 'Low - 2020',
            data: [27, 26, 35, 37, 33, 30, 31],
          },
        ],
      },
    };
    this.onDrop = this.onDrop.bind(this);
  }

  timeOut = 1000;

  schema = {
    firstname: Joi.string().label('Firstname').required(),
    surname: Joi.string().label('Surname').required(),
    customer_id: Joi.number().required(),
    phone: Joi.string()
      .min(11)
      .max(16)
      .regex(/^\d+$/)
      .label('Phone number')
      .required(),
    email: Joi.string().email().label('Email').required(),
    status_id: Joi.string()
      .replace('Select status', '')
      .label('Status')
      .required(),
    create_date: Joi.any(),
    location_by_location: Joi.any(),
    location_stats: Joi.any(),
    subscription: Joi.any(),
    total_saved_value: Joi.any(),
    vouchers_redeemed: Joi.any(),
    picture: Joi.any(),
  };

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const isEditable = this.props.match.path.split('/').includes('edit');
      this.setState({ isEditable });

      const resStatus = await service.getCustomerStatus();
      const res = await service.getCustomer(this.props.match.params.id);
      const status = resStatus.data.customer_statuses;

      const data = res.data.customer_profile[0];
      this.setState({ data, status });
    } catch (error) {
      console.log(error);
      // NotificationManager.error('Error', 'Could not retrieve clients');
    } finally {
      this.setState({ loading: false });
    }
  }

  reactTablecolumns = [
    {
      Header: 'ID',
      accessor: 'uid',
    },
    {
      Header: 'Client',
      accessor: 'client',
    },
    {
      Header: 'Category',
      accessor: 'category_name',
    },
    {
      Header: 'Merchant',
      accessor: 'merchant',
    },
    {
      Header: 'Location',
      accessor: 'location',
    },
    {
      Header: 'Phone',
      accessor: 'telephone',
    },

    {
      Header: 'Venue',
      accessor: 'venue',
    },
    {
      Header: 'Created Date',
      accessor: 'date_created',
    },
  ];

  onDrop(event) {
    const data = this.state.data;
    let errors = this.state.errors;
    if (event.target.files[0].size > 70041) {
      NotificationManager.error('Error', 'File is too big', this.timeOut);
      this.setState({
        errors: { ...errors, picture: true },
      });
      return;
    }

    delete errors['picture'];
    this.setState({
      data: { ...data, picture: event.target.files[0] },
      errors,
    });
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

  setLineChartData = () => {
    var sin = [],
      cos = [];
    for (var i = 0; i < 100; i++) {
      sin.push({ x: i, y: Math.sin(i / 10) });
      cos.push({ x: i, y: 0.5 * Math.cos(i / 10) });
    }
    return [
      { values: sin, key: 'Previous Week', color: '#00ACAC' },
      { values: cos, key: 'Current Week', color: '#348fe2' },
    ];
  };

  mainLineChart = {
    data: this.setLineChartData(),
    options: {
      yAxis: {
        tickFormat: d3.format(',.2f'),
      },
      xAxis: {
        tickFormat: d3.format(',.1f'),
      },
    },
  };

  reset = () => {
    this.setState({
      isMarkerShown: true,
      data: {
        client_name: '',
        category_id: '',
        country: '',
        county: '',
        address: '',
        po_box: '',
        lat: 0.0,
        long: 0.0,
      },
      errors: {},
    });
  };

  updateCustomer = async (event) => {
    event.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    const {
      firstname,
      surname,
      phone,
      email,
      status_id,
      customer_id,
    } = this.state.data;

    try {
      this.setState({ loading: true });
      await service.putCustomer({
        customer_id,
        firstname,
        surname,
        phone,
        email,
        status_id: +status_id,
      });
      NotificationManager.success('Success', 'Customer added', this.timeOut);
      this.reset();
    } catch (error) {
      NotificationManager.error(
        'Error',
        'Could not add customer',
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <div>
        <div className='row'>
          <div className='col-xl-6'>
            <Panel>
              <PanelHeader>Profile</PanelHeader>
              <PanelBody>
                <div className='card border-0  mb-3'>
                  <div className='card-body'>
                    <div className='row'>
                      <div className='col-xl-6'>
                        <h4>Profile</h4>
                        <img
                          src='https://divefgvozsznd.cloudfront.net/justinhenry.jpeg'
                          alt='profile'
                          width='100'
                          height='100'
                        />
                        <p className='pt-3'>First name(s)</p>
                        {!this.state.isEditable ? (
                          <h4>{this.state.data.firstname}</h4>
                        ) : (
                          <>
                            <input
                              type='text'
                              className='form-control m-b-5'
                              placeholder='Enter firstname'
                              value={this.state.data.firstname}
                              onChange={this.handleChange}
                              name='firstname'
                            />
                            {this.state.errors['firstname'] && (
                              <div className='pt-2 text-danger'>
                                <span>{this.state.errors['firstname']}</span>
                              </div>
                            )}
                          </>
                        )}

                        <p>Last name</p>
                        {!this.state.isEditable ? (
                          <h4>{this.state.data.surname}</h4>
                        ) : (
                          <>
                            <input
                              type='text'
                              className='form-control m-b-5'
                              placeholder='Enter lastname'
                              value={this.state.data.surname}
                              onChange={this.handleChange}
                              name='surname'
                            />
                            {this.state.errors['surname'] && (
                              <div className='pt-2 text-danger'>
                                <span>{this.state.errors['surname']}</span>
                              </div>
                            )}
                          </>
                        )}
                        <button
                          className='btn btn-success mr-3 pr-3 pl-3 mt-5'
                          onClick={this.updateCustomer}
                        >
                          update
                        </button>
                      </div>
                      <div className='col-xl-6'>
                        <p className='pt-1'>UID</p>
                        <h4>{this.state.data.uid || '000000'}</h4>
                        <p>Member since</p>
                        <h4>{this.state.data.create_date}</h4>

                        <p className='pt-3'>Email</p>
                        {!this.state.isEditable ? (
                          <h4>{this.state.data.email}</h4>
                        ) : (
                          <>
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
                          </>
                        )}

                        <p>Contact number</p>
                        {!this.state.isEditable ? (
                          <h4>{this.state.data.phone}</h4>
                        ) : (
                          <>
                            <input
                              type='text'
                              className='form-control m-b-5'
                              placeholder='Enter phone number'
                              value={this.state.data.phone}
                              onChange={this.handleChange}
                              name='phone'
                            />
                            {this.state.errors['phone'] && (
                              <div className='pt-2 text-danger'>
                                <span>{this.state.errors['phone']}</span>
                              </div>
                            )}
                          </>
                        )}

                        <p>Status</p>
                        {!this.state.isEditable ? (
                          <h4>{this.state.data.status_id}</h4>
                        ) : (
                          <>
                            <select
                              className='form-control'
                              value={this.state.data.status_id}
                              onChange={this.handleChange}
                              name='status_id'
                            >
                              <option>Select status </option>
                              {this.state.status.map((x) => (
                                <option key={x.status_id} value={x.status_id}>
                                  {x.status_name}
                                </option>
                              ))}
                              ;
                            </select>
                            {this.state.errors['status_id'] && (
                              <div className='pt-2 text-danger'>
                                <span>{this.state.errors['status_id']}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </PanelBody>
            </Panel>
          </div>
          <div className='col-xl-6'>
            <Panel>
              <PanelHeader>Vouchers Redeemed</PanelHeader>
              <PanelBody>
                <div className='card border-0  mb-3'>
                  <div className='card-body'>
                    <ReactTable
                      data={this.state.data.vouchers_redeemed}
                      columns={this.reactTablecolumns}
                      defaultPageSize={10}
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
              </PanelBody>
            </Panel>
          </div>
        </div>
        <div className='row'>
          <div className='col-xl-6'>
            <Panel>
              <PanelHeader>Total saved value</PanelHeader>
              <PanelBody>
                <div className='card border-0  mb-3'>
                  <div className='card-body'>
                    <div className='row'>
                      <div className='col-xl-6'>
                        <p>Current week</p>
                        <h4>{`£${
                          this.state.data.total_saved_value?.current || 0
                        }`}</h4>
                        <p>
                          {this.state.data.total_saved_value?.change || '0.0%'}
                        </p>
                      </div>

                      <div className='col-xl-6'>
                        <p>Previous week</p>
                        <h4>{`£${
                          this.state.data.total_saved_value?.previous || 0
                        }`}</h4>
                      </div>
                    </div>
                    <div className='col-xl-10'>
                      <NVD3Chart
                        datum={this.mainLineChart.data}
                        type='lineChart'
                        id='lineChart'
                        height='220'
                        options={this.mainLineChart.options}
                      />
                    </div>
                  </div>
                </div>
              </PanelBody>
            </Panel>
            <Panel>
              <PanelHeader>Subscription</PanelHeader>
              <PanelBody>
                <div className='card'>
                  <div className='card-body'>
                    <div className='row'>
                      <div className='col-xl-4'>
                        <p>Subscription Type</p>
                        <h4>
                          {this.state.data.subscription?.subscription_type}
                        </h4>
                        <p>Core Subscription</p>
                        <h4>
                          {this.state.data.subscription?.core_subscription}
                        </h4>
                      </div>
                      <div className='col-xl-4'>
                        <p>Additional Subscriptions</p>
                        <h4>Birmingham</h4>
                        <h4>London</h4>
                        <h4>Newcastle</h4>
                        <h4>Leeds</h4>
                      </div>
                      <div className='col-xl-4'>
                        <p>Total monthly revenue</p>
                        <h4>
                          {this.state.data.subscription?.total_monthly_revenue}
                        </h4>
                        <p>Total annual revenue</p>
                        <h4>
                          {this.state.data.subscription?.total_annual_revenue}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </PanelBody>
            </Panel>
          </div>
          <div className='col-xl-6'>
            <Panel>
              <PanelHeader>Vouchers Locations by location</PanelHeader>
              <PanelBody>
                <div className='card border-0  mb-3'>
                  <div className='card-body'>
                    <GoogleMapComponent
                      isMarkerShown={this.state.data.location_by_location}
                      onMarkerClick={this.handleMarkerClick}
                    />
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
      </div>
    );
  }
}

export default withRouter(CustomerDetail);
