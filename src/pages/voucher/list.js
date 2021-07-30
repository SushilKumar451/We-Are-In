import React from 'react';
import Joi from 'joi-browser';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import auth from '../../redux/actions/auths/index';
import service from '../../services/voucher-service';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';
import Logo from '../../assets/img/logo.png';

class VoucherList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        name: '',
        email: '',
        password: '',
      },
      loading: false,
      errors: {},
      modalDialog: false,
      list: [],
    };
  }
  timeOut = 1000;

  schema = {
    name: Joi.string().label('Your name').required(),
    email: Joi.string().label('Email').required(),
    password: Joi.string().label('Password').required(),
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

  reactTablecolumns = [
    {
      Header: 'UID',
      accessor: 'uid',
    },
    {
      Header: 'Name',
      accessor: 'voucher_name',
    },
    {
      Header: 'Category',
      accessor: 'voucher_category',
    },
    {
      Header: 'Brand ',
      accessor: 'brand_name',
    },
    {
      Header: 'Merchant ',
      accessor: 'merchant_name',
    },
    {
      Header: 'Country',
      accessor: 'country',
    },
    {
      Header: 'Launch Date',
      accessor: 'start_date',
    },
    {
      Header: 'End Date',
      accessor: 'end_date',
    },
    {
      Cell: (
        <div className='text-right'>
          <i className='fa fa-edit'></i>
        </div>
      ),
    },
  ];

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const response = await service.getVouchers();
      const list = response.data.vouchers;
      this.setState({ list });
    } catch (error) {
      console.log(error);
      NotificationManager.error(
        'Error',
        'Could not retrieve the data',
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  }

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
    this.setState({
      data: {
        name: '',
        email: '',
        password: '',
      },
      errors: {},
    });
  };

  signInForVoucher = (event) => {
    event.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    const { name, email, password } = this.state.data;

    const data = {
      name,
      email,
      password,
    };

    this.props.signInForVoucher(data);
    this.reset();
    this.setState({ modalDialog: false });
    // navigate to the create page.
    this.props.history.push('/voucher/create');
  };

  render() {
    const vouchers = this.state.list;
    return (
      <div>
        <div className='row'>
          <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
            <div>
              <ol className='breadcrumb'>
                <li className='breadcrumb-item active'>Voucher Profile</li>
              </ol>
              <h1 className='page-header m-0'>Voucher List</h1>
            </div>
            <button
              type='button'
              className='btn btn-primary'
              onClick={() => this.setState({ modalDialog: true })}
            >
              <i className='fa fa-plus'></i> Create Voucher
            </button>
          </div>
        </div>

        <div className='row'>
          <div className='col-xl-12 col-lg-12'>
            <div className='card mb-3'>
              <div className='card-body'>
                <ReactTable
                  data={vouchers}
                  columns={this.reactTablecolumns}
                  defaultPageSize={10}
                  showPageSizeOptions={true}
                  previousText='Prev'
                  nextText='Next'
                  minRows={0}
                  showPageJump={false}
                  resizable={false}
                  className='-striped'
                  getTrProps={(state, rowInfo, column, instance) => ({
                    onClick: (e) => {
                      this.props.history.push(
                        `/voucher/edit/${rowInfo.original.voucher_id}`
                      );
                    },
                  })}
                />
              </div>
            </div>
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
        <Modal
          isOpen={this.state.modalDialog}
          toggle={() => this.setState({ modalDialog: false })}
        >
          <ModalHeader toggle={() => this.setState({ modalDialog: false })}>
            New Voucher
          </ModalHeader>
          <ModalBody className='px-5 py-5'>
            <div className='mb-3 text-center'>
              <img src={Logo} width='80px' alt='In Control' />
            </div>
            <form action='' method='POST'>
              <fieldset>
                <div className='form-group m-b-15'>
                  <label className=''>Name</label>
                  <input
                    type='name'
                    className='form-control form-control-lg'
                    placeholder='Enter name'
                    onChange={this.handleChange}
                    name='name'
                  />
                  {this.state.errors['name'] && (
                    <small className='pt-2 text-danger'>
                      {this.state.errors['name']}
                    </small>
                  )}
                </div>
                <div className='form-group m-b-15'>
                  <label className=''>Email address</label>
                  <input
                    type='email'
                    className='form-control form-control-lg'
                    placeholder='Enter email'
                    onChange={this.handleChange}
                    name='email'
                  />
                  {this.state.errors['email'] && (
                    <small className='pt-2 text-danger'>
                      {this.state.errors['email']}
                    </small>
                  )}
                </div>
                <div className='form-group m-b-15'>
                  <label className=''>Password</label>
                  <input
                    type='password'
                    className='form-control form-control-lg'
                    placeholder='Password'
                    onChange={this.handleChange}
                    name='password'
                  />
                  {this.state.errors['password'] && (
                    <small className='pt-2 text-danger'>
                      {this.state.errors['password']}
                    </small>
                  )}
                </div>

                <div className='form-group'>
                  <button
                    type='submit'
                    className='btn btn-lg btn-primary btn-block'
                    onClick={this.signInForVoucher}
                  >
                    Proceed
                  </button>
                </div>
              </fieldset>
            </form>
          </ModalBody>
        </Modal>
        <NotificationContainer />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  signInForVoucher: (data) => dispatch(auth.voucherSignIn(data)),
});

export default connect(null, mapDispatchToProps)(withRouter(VoucherList));
