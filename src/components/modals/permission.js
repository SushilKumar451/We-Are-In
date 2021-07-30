import React, { useState, useEffect } from 'react';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Panel, PanelBody } from '../panel/panel.jsx';

const PermissionModal = ({
  label,
  isOpen,
  toggle,
  saveType,
  allAccess,
  data = null,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [accessId, setAccessId] = useState('');

  const [showNameError, setShowNameError] = useState(false);
  const [showDescriptionError, setShowDescriptionError] = useState(false);
  const [showAccessIdError, setShowAccessIdError] = useState(false);

  useEffect(() => {
    setName(data?.id ? data.name : '');
    setDescription(data?.id ? data.description : '');
    setAccessId(data?.id ? data.accessId : '');

    setShowNameError(false);
    setShowDescriptionError(false);
    setShowAccessIdError(false);
  }, [data]);

  const handleSave = (event) => {
    event.preventDefault();
    setShowNameError(true);
    setShowDescriptionError(true);
    setShowAccessIdError(true);

    if (name) {
      saveType(label.toLowerCase(), {
        permission_name: name,
        permission_description: description,
        access_id: +accessId,
      });
      toggle();
      clearForm();
    }
  };

  const clearForm = () => {
    setName('');
    setDescription('');
    setAccessId('');
    setShowNameError(false);
    setShowDescriptionError(false);
    setShowAccessIdError(false);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    setShowNameError(true);
    setShowDescriptionError(true);
    setShowAccessIdError(true);

    if (name) {
      saveType(label.toLowerCase(), {
        permission_name: name,
        permission_description: description,
        access_id: accessId,
        permission_id: data.id,
      });
      toggle();
      clearForm();
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {data?.id ? 'Update' : 'Create'} Permission
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
                        placeholder='Enter name'
                        onChange={(e) => {
                          setShowNameError(true);
                          setName(e.currentTarget.value);
                        }}
                        value={name}
                        name='name'
                      />{' '}
                      {showNameError && !name && (
                        <small className='pt-2 text-danger'>
                          Permission name is required
                        </small>
                      )}
                    </div>
                  </div>

                  <div className='form-group row m-b-15'>
                    <label className='col-form-label col-md-3'>
                      Description
                    </label>
                    <div className='col-md-7'>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Enter description'
                        onChange={(e) => {
                          setShowDescriptionError(true);
                          setDescription(e.currentTarget.value);
                        }}
                        value={description}
                        name='description'
                      />{' '}
                      {showDescriptionError && !description && (
                        <small className='pt-2 text-danger'>
                          Permission description is required
                        </small>
                      )}
                    </div>
                  </div>

                  <div className='form-group row m-b-15'>
                    <label className='col-md-3 col-form-label'>Access</label>
                    <div className='col-md-7'>
                      <select
                        className='form-control '
                        value={accessId}
                        selected={
                          allAccess?.find((x) => x.access_id)?.access_id ===
                          accessId
                        }
                        onChange={(e) => {
                          setShowAccessIdError(true);
                          setAccessId(e.currentTarget.value);
                        }}
                        name='accessId'
                      >
                        <option>Select Access</option>
                        {allAccess?.map((x) => (
                          <option key={x.access_id} value={x.access_id}>
                            {x.access_name}
                          </option>
                        ))}
                        ;
                      </select>
                      {showAccessIdError && !accessId && (
                        <small className='pt-2 text-danger'>
                          Permission access is required
                        </small>
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
    </Modal>
  );
};

export default PermissionModal;
