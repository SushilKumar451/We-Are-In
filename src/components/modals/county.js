import React, { useState, useEffect } from 'react';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Panel, PanelBody } from '../panel/panel.jsx';

const CountyModal = ({ isOpen, parent, toggle, save, data = null }) => {
  const [countyName, setCountyName] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setCountyName(data?.id ? data.name : '');
    setShowError(false);
  }, [data]);

  const handleSave = (event) => {
    event.preventDefault();
    setShowError(true);
    if (countyName) {
      save(parent.name, {
        county_name: countyName,
        country_id: parent.parentId,
      });
      toggle();
      clearForm();
    }
  };

  const clearForm = () => {
    setCountyName('');
    setShowError(false);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    setShowError(true);
    if (countyName) {
      save(parent.name, {
        county_name: countyName,
        county_id: data.id,
        country_id: parent.parentId,
      });
      toggle();
      clearForm();
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {data?.id ? 'Update' : 'Create'} County
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
                        placeholder='Enter county name'
                        onChange={(e) => {
                          setShowError(true);
                          setCountyName(e.currentTarget.value);
                        }}
                        value={countyName}
                        name='countyName'
                      />{' '}
                      {showError && !countyName && (
                        <small className='pt-2 text-danger'>
                          county name is required
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

export default CountyModal;
