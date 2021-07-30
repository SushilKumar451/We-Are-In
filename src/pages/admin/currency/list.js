import React from 'react';
import { withRouter } from 'react-router';
import ReactTable from 'react-table';
import SweetAlert from 'react-bootstrap-sweetalert';
import CurrencyModal from '../../../components/modals/currency';
import service from '../../../services/admin-service';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';

class CurrencyList extends React.Component {
  state = {
    currency: {
      data: [],
      filteredData: [],
      searchInput: '',
      modalDialog: false,
      selectedType: null,
    },
  };

  timeOut = 1000;

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const currencyResponse = await service.getCurrencies();

      this.setState({
        currency: {
          ...this.state.currency,
          data: currencyResponse.data.currencies,
          selectedType: null,
        },
      });
    } catch (error) {
      NotificationManager.error(
        'Error',
        'Could not retrieve currency',
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  }

  tableSearch = (parent) => {
    let { searchInput, data } = this.state[parent];
    let filteredData = data.filter((value) => {
      return (
        value.currency_code.toLowerCase().includes(searchInput.toLowerCase()) ||
        value.currency_symbol
          .toLowerCase()
          .includes(searchInput.toLowerCase()) ||
        value.currency_format
          .toLowerCase()
          .includes(searchInput.toLowerCase()) ||
        value.currency_number_format
          .toLowerCase()
          .includes(searchInput.toLowerCase())
      );
    });
    this.setState({ [parent]: { ...this.state[parent], data, filteredData } });
  };

  handleChange = (parent, event) => {
    this.setState(
      { [parent]: { ...this.state[parent], searchInput: event.target.value } },
      () => {
        this.tableSearch(parent);
      }
    );
  };

  currencyTablecolumns = [
    {
      Header: 'ID',
      accessor: 'currency_id',
    },
    {
      Header: 'Code',
      accessor: 'currency_code',
    },
    {
      Header: 'Symbol',
      accessor: 'currency_symbol',
    },
    {
      Header: 'Format',
      accessor: 'currency_format',
    },
    {
      Header: 'Number Format',
      accessor: 'currency_number_format',
    },
  ];

  refreshType = async (label, parent, callback) => {
    try {
      const response = await callback();
      this.setState({
        [parent]: {
          ...this.state[parent],
          data: response.data[`${label}`],
          selectedType: null,
        },
      });
    } catch (e) {
      NotificationManager.error(
        'Error',
        `Could not refresh ${parent}, please try again later`,
        this.timeOut
      );
    }
  };

  postType = async (parent, data, label, callback, refreshCallback) => {
    try {
      this.setState({ loading: true });
      await callback(data);
      NotificationManager.success(
        'Success',
        `Saved ${parent} successfully`,
        this.timeOut
      );
      await this.refreshType(label, parent, refreshCallback);
    } catch (e) {
      NotificationManager.error(
        'Error',
        `Could not save ${parent}, please try again later`,
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  };

  putType = async (parent, data, label, callback, refreshCallback) => {
    try {
      this.setState({ loading: true });
      await callback(data);
      NotificationManager.success(
        'Success',
        `Updated ${parent} successfully`,
        this.timeOut
      );
      await this.refreshType(label, parent, refreshCallback);
    } catch (e) {
      NotificationManager.error(
        'Error',
        `Could not update ${parent} , please try again later`,
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  };

  saveType = async (parent, data) => {
    switch (parent) {
      case 'currency':
        await this.postType(
          parent,
          data,
          'currencies',
          service.postCurrency,
          service.getCurrencies
        );
        break;
      default:
        break;
    }
  };

  updateType = async (parent, data) => {
    switch (parent) {
      case 'currency':
        await this.putType(
          parent,
          data,
          'currencies',
          service.putCurrency,
          service.getCurrencies
        );
        break;
      default:
        break;
    }
  };

  toggleVisibility = (parent, withData = false) =>
    withData
      ? this.setState({
          [parent]: {
            ...this.state[parent],
            modalDialog: !this.state[parent].modalDialog,
            selectedType: null,
          },
        })
      : this.setState({
          [parent]: {
            ...this.state[parent],
            modalDialog: !this.state[parent].modalDialog,
          },
        });

  setSelectedData = (parent, data) =>
    this.setState({
      [parent]: {
        ...this.state[parent],
        modalDialog: true,
        selectedType: data,
      },
    });

  render() {
    const {
      data: currencyData,
      filteredData: currencyFilteredData,
      selectedType,
    } = this.state.currency;

    return (
      <div>
        <div className='row'>
          <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
            <div>
              <ol className='breadcrumb'>
                <li className='breadcrumb-item active'>Currencies</li>
              </ol>
              <h1 className='page-header m-0'>Currencies</h1>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-xl-9 col-lg-9'>
            <div className='card mb-3'>
              <div className='card-body'>
                <div className='col-12 d-flex justify-content-between align-right mb-2'>
                  <h5> Currency List</h5>
                  <button
                    className='btn btn-primary'
                    onClick={() => this.toggleVisibility('currency')}
                    style={{ textDecoration: 'none' }}
                  >
                    <i className='fa fa-plus'></i> Create
                  </button>
                </div>

                <div className='col-xl-3 col-lg-3'>
                  <input
                    type='text'
                    className='form-control m-b-5'
                    placeholder='search ....'
                    name='searchInput'
                    value={this.state.currency.searchInput || ''}
                    onChange={(e) => this.handleChange('currency', e)}
                  />
                </div>

                <ReactTable
                  data={
                    currencyFilteredData && currencyFilteredData.length
                      ? currencyFilteredData
                      : currencyData
                  }
                  columns={this.currencyTablecolumns}
                  defaultPageSize={5}
                  showPageSizeOptions={true}
                  previousText='Prev'
                  nextText='Next'
                  minRows={0}
                  showPageJump={false}
                  resizable={false}
                  className='-striped'
                  getTrProps={(state, rowInfo, column, instance) => ({
                    onClick: (e) => {
                      this.setSelectedData('currency', {
                        id: rowInfo.original.currency_id,
                        code: rowInfo.original.currency_code,
                        symbol: rowInfo.original.currency_symbol,
                        format: rowInfo.original.currency_format,
                        numberFormat: rowInfo.original.currency_number_format,
                        type: 'currency',
                      });
                    },
                  })}
                />
              </div>
            </div>

            <CurrencyModal
              label='currency'
              isOpen={this.state.currency.modalDialog}
              toggle={() => this.toggleVisibility('currency', true)}
              saveType={selectedType ? this.updateType : this.saveType}
              data={selectedType}
            />
          </div>
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

export default withRouter(CurrencyList);
