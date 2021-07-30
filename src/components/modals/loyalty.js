import React, { useState, useEffect } from 'react';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Panel, PanelBody } from '../panel/panel.jsx';

const LoyaltyModal = ({ label, isOpen, toggle, save, data = null }) => {
  const [loyaltyName, setLoyaltyName] = useState('');
  const [loyaltyLabel, setLoyaltyLabel] = useState('');
  const [showNameError, setShowNameError] = useState(false);
  const [showLabelError, setShowLabelError] = useState(false);

  useEffect(() => {
    setLoyaltyName(data?.id ? data.name : '');
    setLoyaltyLabel(data?.id ? data.label : '');
    setShowNameError(false);
    setShowLabelError(false);
  }, [data]);

  const handleSave = (event) => {
    event.preventDefault();
    setShowNameError(true);
    setShowLabelError(true);
    if (loyaltyName) {
      save(label.toLowerCase(), {
        status_name: loyaltyName,
        status_label: loyaltyLabel,
      });
      toggle();
      clearForm();
    }
  };

  const clearForm = () => {
    setLoyaltyName('');
    setLoyaltyLabel('');
    setShowNameError(false);
    setShowLabelError(false);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    setShowNameError(true);
    setShowLabelError(true);
    if (loyaltyName) {
      save(label.toLowerCase(), {
        status_name: loyaltyName,
        status_label: loyaltyLabel,
        status_id: data.id,
      });
      toggle();
      clearForm();
    }
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
                        placeholder='Enter loyalty name'
                        onChange={(e) => {
                          setShowNameError(true);
                          setLoyaltyName(e.currentTarget.value);
                        }}
                        value={loyaltyName}
                        name='loyaltyName'
                      />{' '}
                      {showNameError && !loyaltyName && (
                        <small className='pt-2 text-danger'>
                          loyalty name is required
                        </small>
                      )}
                    </div>
                  </div>

                  <div className='form-group row m-b-15'>
                    <label className='col-form-label col-md-3'>Label</label>
                    <div className='col-md-7'>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Enter loyalty label'
                        onChange={(e) => {
                          setShowLabelError(true);
                          setLoyaltyLabel(e.currentTarget.value);
                        }}
                        value={loyaltyLabel}
                        name='loyaltyLabel'
                      />{' '}
                      {showLabelError && !loyaltyLabel && (
                        <small className='pt-2 text-danger'>
                          loyalty label is required
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

export default LoyaltyModal;
