import React, { useState, useEffect } from 'react';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Panel, PanelBody } from '../panel/panel.jsx';

const SubscriptionModal = ({ label, isOpen, toggle, save, data = null }) => {
  const [subscriptionPrice, setSubscriptionPrice] = useState('');
  const [subscriptionType, setSubscriptionType] = useState('');
  const [showPriceError, setShowPriceError] = useState(false);
  const [showTypeError, setShowTypeError] = useState(false);

  useEffect(() => {
    setSubscriptionPrice(data?.id ? data.price : '');
    setSubscriptionType(data?.id ? data.type : '');
    setShowPriceError(false);
    setShowTypeError(false);
  }, [data]);

  const handleSave = (event) => {
    event.preventDefault();
    setShowPriceError(true);
    setShowTypeError(true);
    if (subscriptionPrice) {
      save(label.toLowerCase(), {
        subscription_price: subscriptionPrice,
        subscription_type: subscriptionType,
      });
      toggle();
      clearForm();
    }
  };

  const clearForm = () => {
    setSubscriptionPrice('');
    setSubscriptionType('');
    setShowPriceError(false);
    setShowTypeError(false);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    setShowPriceError(true);
    setShowTypeError(true);
    if (subscriptionPrice) {
      save(label.toLowerCase(), {
        subscription_price: subscriptionPrice,
        subscription_type: subscriptionType,
        subscription_type_id: data.id,
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
                    <label className='col-md-3 col-form-label'>Price</label>
                    <div className='col-md-7'>
                      <input
                        type='number'
                        className='form-control'
                        placeholder='Enter subscription price'
                        onChange={(e) => {
                          setShowPriceError(true);
                          setSubscriptionPrice(e.currentTarget.value);
                        }}
                        value={subscriptionPrice}
                        name='subscriptionPrice'
                      />{' '}
                      {showPriceError && !subscriptionPrice && (
                        <small className='pt-2 text-danger'>
                          price name is required
                        </small>
                      )}
                    </div>
                  </div>

                  <div className='form-group row m-b-15'>
                    <label className='col-form-label col-md-3'>Type</label>
                    <div className='col-md-7'>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Enter subscription type'
                        onChange={(e) => {
                          setShowTypeError(true);
                          setSubscriptionType(e.currentTarget.value);
                        }}
                        value={subscriptionType}
                        name='subscriptionType'
                      />{' '}
                      {showTypeError && !subscriptionType && (
                        <small className='pt-2 text-danger'>
                          type label is required
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

export default SubscriptionModal;
