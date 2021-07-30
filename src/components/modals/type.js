import React, { useState, useEffect } from 'react';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Panel, PanelBody } from '../panel/panel.jsx';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const TypeModal = ({
  label,
  isOpen,
  typeLabel,
  toggle,
  saveType,
  data = null,
}) => {
  const [typeName, setTypeName] = useState('');
  const [typeIcon, setTypeIcon] = useState('');
  const [showTypeError, setShowTypeError] = useState(false);
  const [showIconError, setShowIconError] = useState(false);

  useEffect(() => {
    setTypeName(data?.id ? data.name : '');
    setTypeIcon(data?.id ? data.icon : '');
    setShowTypeError(false);
    setShowIconError(false);
  }, [data]);

  const handleSave = (event) => {
    event.preventDefault();
    setShowTypeError(true);
    if (typeName) {
      saveType(label.toLowerCase(), {
        [`${typeLabel}_name`]: typeName,
        [`${typeLabel}_icon`]: typeIcon,
      });
      toggle();
      clearForm();
    }
  };

  const clearForm = () => {
    setTypeName('');
    setTypeIcon('');
    setShowTypeError(false);
    setShowIconError(false);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    setShowTypeError(true);
    if (typeName) {
      saveType(label.toLowerCase(), {
        [`${typeLabel}_name`]: typeName,
        [`${typeLabel}_icon`]: typeIcon,
        [`${typeLabel}_id`]: data.id,
      });
      toggle();
      clearForm();
    }
  };

  const encode = (event) => {
    var selectedfile = event.target.files;
    if (selectedfile.length > 0) {
      var imageFile = selectedfile[0];
      var fileReader = new FileReader();
      fileReader.onload = (fileLoadedEvent) =>
        setTypeIcon(fileLoadedEvent.target.result);
      fileReader.readAsDataURL(imageFile);
    }
  };

  const timeout = 1000;

  const onDrop = (event) => {
    setShowIconError(false);
    if (event.target.files[0].size > 70041) {
      NotificationManager.error('Error', 'File is too big', timeout);
      return;
    }
    encode(event);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {data?.id ? 'Update' : 'Create'} {label} type
      </ModalHeader>
      <ModalBody>
        <div>
          <Panel>
            <PanelBody>
              <form action='' method='POST'>
                <fieldset>
                  <div className='form-group row m-b-15'>
                    <label className='col-md-3 col-form-label'>Name</label>
                    <div className='col-md-7'>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Enter type name'
                        onChange={(e) => {
                          setShowTypeError(true);
                          setTypeName(e.currentTarget.value);
                        }}
                        value={typeName}
                        name='typeName'
                      />{' '}
                      {showTypeError && !typeName && (
                        <small className='pt-2 text-danger'>
                          type name is required
                        </small>
                      )}
                    </div>
                  </div>

                  <div className='form-group row m-b-15'>
                    <label className='col-form-label col-md-3'>Icon</label>
                    <div className='col-md-3'>
                      <input
                        type='file'
                        onChange={onDrop}
                        accept='image/x-png, image/gif, image/jpeg'
                      />
                      {showIconError && !typeIcon && (
                        <small className='pt-2 text-danger'>
                          type Icon is required
                        </small>
                      )}
                    </div>
                  </div>

                  <div className='form-group row m-b-15'>
                    <label className='col-form-label col-md-3'>Icon</label>
                    <div className='col-md-3'>
                      {typeIcon && (
                        <div className='col-md-6' style={{ paddingLeft: 0 }}>
                          <img
                            src={typeIcon}
                            alt=''
                            style={{ width: 50, height: 50 }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='form-group row'>
                    <div className='col-md-7 offset-md-3'>
                      <button
                        type='submit'
                        className='btn btn-sm btn-primary'
                        onClick={data?.id ? handleUpdate : handleSave}
                      >
                        {data?.id ? 'Update' : 'Save'}
                      </button>
                    </div>
                  </div>
                </fieldset>
              </form>
            </PanelBody>
          </Panel>
        </div>
      </ModalBody>
      <NotificationContainer />
    </Modal>
  );
};

export default TypeModal;
