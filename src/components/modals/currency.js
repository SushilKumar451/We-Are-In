import React, { useState, useEffect } from 'react';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Panel, PanelBody } from '../panel/panel.jsx';

const CurrencyModal = ({ label, isOpen, toggle, saveType, data = null }) => {
  const [code, setCode] = useState('');
  const [symbol, setSymbol] = useState('');
  const [format, setFormat] = useState('');
  const [numberFormat, setNumberFormat] = useState('');

  const [showCodeError, setShowCodeError] = useState(false);
  const [showSymbolError, setShowSymbolError] = useState(false);
  const [showFormatError, setShowFormatError] = useState(false);
  const [showNumberFormatError, setShowNumberFormatError] = useState(false);

  useEffect(() => {
    setCode(data?.id ? data.code : '');
    setSymbol(data?.id ? data.symbol : '');
    setFormat(data?.id ? data.format : '');
    setNumberFormat(data?.id ? data.numberFormat : '');

    setShowCodeError(false);
    setShowSymbolError(false);
    setShowFormatError(false);
    setShowNumberFormatError(false);
  }, [data]);

  const handleSave = (event) => {
    event.preventDefault();
    setShowCodeError(true);
    setShowSymbolError(true);
    setShowFormatError(true);
    setShowNumberFormatError(true);

    if (code) {
      saveType(label.toLowerCase(), {
        currency_code: code,
        currency_symbol: symbol,
        currency_format: format,
        currency_number_format: numberFormat,
      });
      toggle();
      clearForm();
    }
  };

  const clearForm = () => {
    setCode('');
    setSymbol('');
    setFormat('');
    setNumberFormat('');
    setShowCodeError(false);
    setShowSymbolError(false);
    setShowFormatError(false);
    setShowNumberFormatError(false);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    setShowCodeError(true);
    setShowSymbolError(true);
    setShowFormatError(true);
    setShowNumberFormatError(true);

    if (code) {
      saveType(label.toLowerCase(), {
        currency_code: code,
        currency_symbol: symbol,
        currency_format: format,
        currency_number_format: numberFormat,
        currency_id: data.id,
      });
      toggle();
      clearForm();
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {data?.id ? 'Update' : 'Create'} Currency
      </ModalHeader>
      <ModalBody>
        <div>
          <Panel>
            <PanelBody>
              <form action='' method='POST'>
                <fieldset>
                  <div className='form-group row m-b-15'>
                    <label className='col-md-3 col-form-label'>Code</label>
                    <div className='col-md-7'>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Enter code'
                        onChange={(e) => {
                          setShowCodeError(true);
                          setCode(e.currentTarget.value);
                        }}
                        value={code}
                        name='code'
                      />{' '}
                      {showCodeError && !code && (
                        <small className='pt-2 text-danger'>
                          Currency code is required
                        </small>
                      )}
                    </div>
                  </div>

                  <div className='form-group row m-b-15'>
                    <label className='col-form-label col-md-3'>Symbol</label>
                    <div className='col-md-7'>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Enter symbol'
                        onChange={(e) => {
                          setShowSymbolError(true);
                          setSymbol(e.currentTarget.value);
                        }}
                        value={symbol}
                        name='symbol'
                      />{' '}
                      {showSymbolError && !symbol && (
                        <small className='pt-2 text-danger'>
                          Currency symbol is required
                        </small>
                      )}
                    </div>
                  </div>

                  <div className='form-group row m-b-15'>
                    <label className='col-md-3 col-form-label'>Format</label>
                    <div className='col-md-7'>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Enter format'
                        onChange={(e) => {
                          setShowFormatError(true);
                          setFormat(e.currentTarget.value);
                        }}
                        value={format}
                        name='format'
                      />{' '}
                      {showFormatError && !format && (
                        <small className='pt-2 text-danger'>
                          Currency format is required
                        </small>
                      )}
                    </div>
                  </div>

                  <div className='form-group row m-b-15'>
                    <label className='col-form-label col-md-3'>
                      Number format
                    </label>
                    <div className='col-md-7'>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Enter number format'
                        onChange={(e) => {
                          setShowNumberFormatError(true);
                          setNumberFormat(e.currentTarget.value);
                        }}
                        value={numberFormat}
                        name='numberFormat'
                      />{' '}
                      {showNumberFormatError && !numberFormat && (
                        <small className='pt-2 text-danger'>
                          Currency number format is required
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

export default CurrencyModal;
