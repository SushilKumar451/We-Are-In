import React, { useState } from 'react';
import Joi from 'joi-browser';
import SweetAlert from 'react-bootstrap-sweetalert';
import service from '../../../services/admin-service';
import Switch from "react-switch";
import Select from 'react-select'
import {
  Panel,
  PanelHeader,
  PanelBody,
} from './../../../components/panel/panel.jsx';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';


class CreateUser extends React.Component {
  constructor(props) {
    super(props);
   this.handleChangecheck = this.handleChangecheck.bind(this); 
   this.handleClick = this.handleClick.bind(this); 
   
    this.state = {
      data: {
        email: '',
        password: '',
        forename: '',
        permission_id: 1,
        subadmin: false,
        is_super_user: true,
        role_id:1,
        // text1: "hello",
        // textDisplay:false,
        // value: 'yes'
        // forename: '',
        // surname: '',
        // telephone: '',
      },
      errors: {},
      permissions: [1,2,3],
      roles :[1,2,3],

    };
    
  }

  timeOut = 1000;

  schema = {
    email: Joi.string().email().label('Email').required(),
    password: Joi.string().min(8).label('Password').required(),
    forename: Joi.string().label('Username').required(),
    role_id: Joi.number().label('Role'),

    permission_id: Joi.number().label('Permissions'),
    subadmin: Joi.boolean().label('Sub Admin'),
    is_super_user: Joi.boolean().label('Super Admin'),
    // forename: Joi.string().label('Forename').required(),
    // surname: Joi.string().label('Surname').required(),
    // telephone: Joi.string()
    //   .min(11)
    //   .max(16)
    //   .regex(/^\d+$/)
    //   .label('Telephone number')
    //   .required(),
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
    console.log({ error } );
    return error ? error.details[0].message : null;
  };
  async componentDidMount() {
    this.setState({ is_super_user : true });
    this.setState({ subadmin : false });

    // const response = await service.getPermissions();
    
    // const permissions = response.data.permissions;
    // console.log(permissions);
    // this.setState({ permissions });
  }


  handleChangecheck(checked) {
    this.setState({ is_super_user : checked });
    this.setState({ subadmin : !checked });
  }
  handleClick(checked) {
    console.log("handleClick", checked); 
    this.setState({ subadmin : checked });
    this.setState({ is_super_user : !checked });
  }


  handleChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data['is_super_user'] = this.state.is_super_user ; 
    data['subadmin'] = this.state.subadmin ; 
   
    data[input.name] = input.value;
    this.setState({ data });
    const returnedErrors = this.validateProperty(input);
    const errors = this.state.errors;
    console.log(errors);
    errors[input.name] = returnedErrors;
    this.setState({ errors });
  };

  reset = () => {
    console.log("reset");
    this.setState({
      data: {
        email: '',
        password: '',
        forename: '',
        permission_id: 0,
        subadmin: false,
        is_super_user: true
        // forename: '',
        // surname: '',
        // telephone: '',
      },
      errors: {},
    });
  };

  
  addUser = async (event) => {
    event.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors)
    {
      console.log(errors);
      return;
    } 
    console.log("handleChangecheck state", this.state.is_super_user); 
    const { data } = this.state;
    data['is_super_user'] = this.state.is_super_user ; 
    data['subadmin'] = this.state.subadmin ; 
    console.log("data", data )
   
    try {
      this.setState({ loading: true });
      await service.createUser(data);
      NotificationManager.success('Success', 'User added', this.timeOut);
      this.reset();
    } catch (error) {
      console.log(error);
      NotificationManager.error('Error', 'Could not add user', this.timeOut);
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

//   ToggleButton(){
//     this.setState((currentState) => ({
//         textDisplay: currentState.textDisplay, 
//     }));
// }
  render() {
    // const listPermissions = this.state.permissions.filter(
    //   (x) => x === this.state.data.permission_id
    // );
    // const selectedRoles =
    // listPermissions && !!listPermissions.length ? listPermissions[0] : '';
    return (
      <div className='row'>
        <div className='col-xl-12'>
          <Panel>
            <PanelHeader>Create New User</PanelHeader>
            <PanelBody>
              <div className='row'>
                <div className='col-xl-12 col-lg-12'>
                  <div className='card border-0  mb-3'>
                    <div className='card-body'>
                      <div className='form-group row m-b-15'>
                        <label className='col-form-label col-md-2'>Email</label>
                        <div className='col-md-10'>
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
                        <label className='col-form-label col-md-2'>
                          Password
                        </label>
                        <div className='col-md-10'>
                          <input
                            type='password'
                            className='form-control m-b-5'
                            placeholder='Enter password'
                            value={this.state.data.password}
                            onChange={this.handleChange}
                            name='password'
                          />
                          {this.state.errors['password'] && (
                            <div className='pt-2 text-danger'>
                              <span>{this.state.errors['password']}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='form-group row m-b-15'>
                        <label className='col-form-label col-md-2'>
                          Username
                        </label>
                        <div className='col-md-10'>
                          <input
                            type='text'
                            className='form-control m-b-5'
                            placeholder='Enter username'
                            value={this.state.data.forename}
                            onChange={this.handleChange}
                            name='forename'
                          />
                          {this.state.errors['forename'] && (
                            <div className='pt-2 text-danger'>
                              <span>{this.state.errors['forename']}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* <div className='form-group row m-b-15'>
                        <label className='col-form-label col-md-2'>
                          Roles
                        </label>
                        <div className='col-md-10'>
                        <select
                            className='form-control'
                            value={this.state.data.role_id}
                            selected={
                              this.state.data.role_id === selectedRoles
                            }
                            onChange={this.handleChange}
                            name='role_id'
                          >
                            <option>Select Roles</option>
                            {this.state.roles.map((x) => (
                              <option key={x.role_id} value={x.role_id}>
                                {x.roles_name}
                              </option>
                            ))}
                            ;
                          </select>
                          {this.state.errors['role_id'] && (
                            <div className='pt-2 text-danger'>
                              <span>Role must be selected</span>
                            </div>
                          )}
                      </div>
                      </div> */}

                    <div className='form-group row m-b-15'>
                        <label className='col-form-label col-md-2'>
                        Role
                        </label>
                        <div className='col-md-10'>
                        <Select value={
                              this.state.data.role_id
                            }  placeholder='Select Role'  options={this.state.roles.map((x) => (
                              <option key={x.role_id} value={x.role_id}>
                                {x.role_name}
                              </option>
                            ))} isMulti />
                            {this.state.errors['role_id'] && (
                            <div className='pt-2 text-danger'>
                              <span>Role must be selected</span>
                            </div>
                          )}
                      </div>
                      </div>


                      <div className='form-group row m-b-15'>
                        <label className='col-form-label col-md-2'>
                        Permissions
                        </label>
                        <div className='col-md-10'>
                        <Select value={
                              this.state.data.permission_id
                            }  placeholder='Select Permissions'  options={this.state.permissions.map((x) => (
                              <option key={x.permission_id} value={x.permissions_id}>
                                {x.permissions_name}
                              </option>
                            ))} isMulti />
                            {this.state.errors['permission_id'] && (
                            <div className='pt-2 text-danger'>
                              <span>Permissions must be selected</span>
                            </div>
                          )}
                      </div>
                      </div>

                      <div className='form-group row m-b-15'>
                        <label className='col-form-label col-md-2'>
                        Super Admin
                        </label>
                        <div className='col-md-10'>
                        <div style={{width: '15%'}}>
                        <Switch onChange={this.handleChangecheck}
                        name="is_super_user" checked={this.state.is_super_user} />
                        {/* <BootstrapSwitchButton 
                         onlabel={this.state.data.superadmin}
                        onstyle='danger'
                        offlabel='None'
                        name='superadmin'
                        checked={false}
                        offstyle='success'
                        checked={false} onstyle="primary" 
                        style='w-100 mx-3' /> */}
                       
                      </div>
                      </div>
                      </div>
                      

      
                      <div className='form-group row m-b-15'>
                        <label className='col-form-label col-md-2'>
                       Sub Admin
                        </label>
                        <div className='col-md-10'>
                        <Switch onChange={this.handleClick}
                           name="subadmin" checked={this.state.subadmin} />
                        
                      </div>
                      </div>

                      
                      {/* <div className='form-group row m-b-15'>
                        <label className='col-form-label col-md-2'>
                          Forename
                        </label>
                        <div className='col-md-10'>
                          <input
                            type='text'
                            className='form-control m-b-5'
                            placeholder='Enter forename'
                            value={this.state.data.forename}
                            onChange={this.handleChange}
                            name='forename'
                          />
                          {this.state.errors['forename'] && (
                            <div className='pt-2 text-danger'>
                              <span>{this.state.errors['forename']}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='form-group row m-b-15'>
                        <label className='col-form-label col-md-2'>
                          Surname
                        </label>
                        <div className='col-md-10'>
                          <input
                            type='text'
                            className='form-control m-b-5'
                            placeholder='Enter surname'
                            value={this.state.data.surname}
                            onChange={this.handleChange}
                            name='surname'
                          />
                          {this.state.errors['surname'] && (
                            <div className='pt-2 text-danger'>
                              <span>{this.state.errors['surname']}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='form-group row m-b-15'>
                        <label className='col-form-label col-md-2'>
                          Telephone
                        </label>
                        <div className='col-md-10'>
                          <input
                            type='number'
                            className='form-control m-b-5'
                            placeholder='Enter telephone'
                            value={this.state.data.telephone}
                            onChange={this.handleChange}
                            name='telephone'
                          />
                          {this.state.errors['telephone'] && (
                            <div className='pt-2 text-danger'>
                              <span>{this.state.errors['telephone']}</span>
                            </div>
                          )}
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>

                <div className='breadcrumb float-xl-right ml-2 pl-1'>
                  <button className='btn btn-primary' onClick={this.addUser}>
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

export default CreateUser;