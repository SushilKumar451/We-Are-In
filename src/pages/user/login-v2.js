import React from 'react';
import Joi from 'joi-browser';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';
import { PageSettings } from './../../config/page-settings.js';
import { ReactComponent as Logo } from '../../assets/img/in-logo.svg';
import auth from '../../redux/actions/auths/index';

class LoginV2 extends React.Component {
  static contextType = PageSettings;

  constructor(props) {
    super(props);

    this.state = {
      activeBg: '/assets/img/login-bg/login-bg.svg',
      bg1: true,
      bg2: false,
      bg3: false,
      bg4: false,
      bg5: false,
      bg6: false,
      data: { email: '', password: '' },
      errors: {},
    };
    this.selectBg = this.selectBg.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  selectBg(e, active, bg) {
    e.preventDefault();

    this.setState((state) => ({
      activeBg: bg,
      bg1: active === 'bg1' ? true : false,
      bg2: active === 'bg2' ? true : false,
      bg3: active === 'bg3' ? true : false,
      bg4: active === 'bg4' ? true : false,
      bg5: active === 'bg5' ? true : false,
      bg6: active === 'bg6' ? true : false,
    }));
  }

  componentDidMount() {
    this.context.handleSetPageSidebar(false);
    this.context.handleSetPageHeader(false);
  }

  componentWillUnmount() {
    this.context.handleSetPageSidebar(true);
    this.context.handleSetPageHeader(true);
  }

  schema = {
    email: Joi.string().email().label('Email address').required(),
    password: Joi.string().min(4).label('Password').required(),
  };

  validate = () => {
    const options = { abortEarly: true };
    const { error } = Joi.validate(this.state.data, this.schema, options);

    if (!error) return null;

    const errors = {};
    error.details.forEach((x) => {
      errors[x.path[0]] = x.message;
    });
    return errors;
  };

  handleSubmit(event) {
    event.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    const { email, password } = this.state.data;
    this.props.login({ email, password });
  //  this.props.history.push('/dashboard/v3');
  }

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
  };

  handleBlur = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    this.setState({ errors });
  };

  render() {
    return (
      <React.Fragment>
        <div className='login-cover'>
          <div className='login-cover-image bg-dark'></div>
          <div className='login-cover-bg'></div>
        </div>
        <div className='row justify-content-center'>
          <div className='col-6 text-center'>
            <Logo />
          </div>
        </div>
        <div className='login login-v2'>
          <div className='login-content'>
            <form className='margin-bottom-0' onSubmit={this.handleSubmit}>
              <div className='form-group m-b-20'>
                <input
                  type='text'
                  id='email'
                  name='email'
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  value={this.state.data.email}
                  className='form-control form-control-lg'
                  placeholder='Email Address'
                  required
                />
                {this.state.errors['email'] && (
                  <div className='pt-2 text-danger'>
                    <span>{this.state.errors['email']}</span>
                  </div>
                )}
              </div>
              <div className='form-group m-b-20'>
                <input
                  type='password'
                  id='password'
                  name='password'
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  value={this.state.data.password}
                  className='form-control form-control-lg'
                  placeholder='Password'
                  required
                />
                {this.state.errors['password'] && (
                  <div className='pt-2 text-danger'>
                    <span>{this.state.errors['password']}</span>
                  </div>
                )}
              </div>
              <div className='form-group mb-5'>
                {this.props.hasError && (
                  <p href='/' className='text-danger'>
                    Invalid Username or Password
                  </p>
                )}
                <a href='/' className='text-muted'>
                  Forgot password?
                </a>
              </div>

              <div className='login-buttons'>
                <button
                  type='submit'
                  disabled={this.props.loading}
                  className='btn btn-primary border-0 btn-block btn-lg rounded-pill text-uppercase'
                >
                  Login
                </button>
              </div>
              {this.props.loading && (
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

              <div className='form-group mt-5'>
                <a href='/' className=''>
                  Help
                </a>
              </div>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.auth.currentUser,
  hasError: state.auth.hasError,
  loading: state.auth.loading,
});

const mapDispatchToProps = (dispatch) => ({
  login: (data) => dispatch(auth.login(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LoginV2));
