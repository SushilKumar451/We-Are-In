import React, { useState, useEffect } from 'react';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Panel, PanelBody } from '../panel/panel.jsx';

const CategoryModal = ({
  label,
  isOpen,
  toggle,
  saveCategory,
  data = null,
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setCategoryName(data?.id ? data.name : '');
    setShowError(false);
  }, [data]);

  const handleSave = (event) => {
    event.preventDefault();
    setShowError(true);
    if (categoryName) {
      saveCategory(label.toLowerCase(), { category_name: categoryName });
      toggle();
      clearForm();
    }
  };

  const clearForm = () => {
    setCategoryName('');
    setShowError(false);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    setShowError(true);
    if (categoryName) {
      saveCategory(label.toLowerCase(), {
        category_name: categoryName,
        category_id: data.id,
      });
      toggle();
      clearForm();
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {data?.id ? 'Update' : 'Create'} {label} Category
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
                        placeholder='Enter category name'
                        onChange={(e) => {
                          setShowError(true);
                          setCategoryName(e.currentTarget.value);
                        }}
                        value={categoryName}
                        name='categoryName'
                      />{' '}
                      {showError && !categoryName && (
                        <small className='pt-2 text-danger'>
                          category name is required
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

export default CategoryModal;
