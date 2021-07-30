import React from 'react';
import Joi from 'joi-browser';
import SweetAlert from 'react-bootstrap-sweetalert';

class ContactTable extends React.Component {
  state = {
    data: { forename: '', surname: '', email: '', telephone: '' },
    errors: {},
  };

  schema = {
    forename: Joi.string().label('Forename').required(),
    surname: Joi.string().label('Surname').required(),
    email: Joi.string().email().label('Email').required(),
    telephone: Joi.string().label('Telephone').required(),
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

  handleSubmit = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    const { onSubmit } = this.props;
    const { forename, surname, email, telephone } = this.state.data;
    onSubmit({ forename, surname, email, telephone });
    this.reset();
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    this.reset();
    onCancel();
  };

  reset = () => {
    this.setState({
      data: { forename: '', surname: '', email: '', telephone: '' },
      errors: {},
    });
  };

  render() {
    const { open, text } = this.props;
    return (
      <div>
        {open && (
          <SweetAlert
            primary
            title=''
            showCancel
            confirmBtnText='Add'
            confirmBtnBsStyle='primary btn-sm'
            cancelBtnBsStyle='danger btn-sm'
            onConfirm={this.handleSubmit}
            onCancel={this.handleCancel}
          >
            <div>
              <span>{text}</span>
              <div className='row'>
                <div className='col-xl-12 col-lg-12'>
                  <div className='card border-0 '>
                    <div className='card-body'>
                      <div>
                        <div className='form-group row m-b-15'>
                          <label className='col-form-label col-md-3'>
                            Forename
                          </label>
                          <div className='col-md-9'>
                            <input
                              type='text'
                              className='form-control m-b-5'
                              placeholder='Enter forename'
                              value={this.state.data.forename}
                              onChange={this.handleChange}
                              name='forename'
                            />
                          </div>
                          {this.state.errors['forename'] && (
                            <small className='text-danger ml-5 pl-5'>
                              {this.state.errors['forename']}
                            </small>
                          )}
                        </div>

                        <div className='form-group row m-b-15'>
                          <label className='col-form-label col-md-3'>
                            Surname
                          </label>
                          <div className='col-md-9'>
                            <input
                              type='text'
                              className='form-control m-b-5'
                              placeholder='Enter surname'
                              value={this.state.data.surname}
                              onChange={this.handleChange}
                              name='surname'
                            />
                          </div>
                          {this.state.errors['surname'] && (
                            <small className='text-danger ml-5 pl-5'>
                              {this.state.errors['surname']}
                            </small>
                          )}
                        </div>

                        <div className='form-group row m-b-15'>
                          <label className='col-form-label col-md-3'>
                            Email
                          </label>
                          <div className='col-md-9'>
                            <input
                              type='text'
                              className='form-control m-b-5'
                              placeholder='Enter email'
                              value={this.state.data.email}
                              onChange={this.handleChange}
                              name='email'
                            />
                          </div>
                          {this.state.errors['email'] && (
                            <small className='text-danger ml-5 pl-5'>
                              {this.state.errors['email']}
                            </small>
                          )}
                        </div>

                        <div className='form-group row m-b-15'>
                          <label className='col-form-label col-md-3'>
                            Telephone
                          </label>
                          <div className='col-md-9'>
                            <input
                              type='text'
                              className='form-control m-b-5'
                              placeholder='Enter telephone'
                              value={this.state.data.telephone}
                              onChange={this.handleChange}
                              name='telephone'
                            />
                          </div>
                          {this.state.errors['telephone'] && (
                            <small className='text-danger ml-5 pl-5'>
                              {this.state.errors['telephone']}
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SweetAlert>
        )}
      </div>
    );
  }
}

export default ContactTable;
