import React from 'react';
import { withRouter } from 'react-router';
import ReactTable from 'react-table';
import SweetAlert from 'react-bootstrap-sweetalert';
import CountyModal from '../../../components/modals/county';
import service from '../../../services/admin-service';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';
//import 'react-table/react-table.css';

class CountyList extends React.Component {
  state = {
    country: {
      data: [],
      filteredData: [],
      searchInput: '',
      modalDialog: false,
      selectedData: null,
    },
    county: {
      data: [],
      filteredData: [],
      searchInput: '',
      modalDialog: false,
      selectedData: null,
    },
  };

  timeOut = 1000;

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const countyResponse = await service.getCountries();
      this.setState({
        country: {
          ...this.state.country,
          data: countyResponse.data.countries,
          selectedData: null,
        },
      });
    } catch (error) {
      NotificationManager.error(
        'Error',
        'Could not retrieve countries',
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  }

  tableSearch = (parent) => {
    let { searchInput, data } = this.state[parent];
    let filteredData = data.filter((value) => {
      return parent === 'country'
        ? value.country_name
            .toLowerCase()
            .includes(searchInput.toLowerCase()) ||
            value.country_code3
              .toLowerCase()
              .includes(searchInput.toLowerCase())
        : value.county_name.toLowerCase().includes(searchInput.toLowerCase());
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

  countryTablecolumns = [
    {
      Header: 'Code',
      accessor: 'country_code3',
    },
    {
      Header: 'Name',
      accessor: 'country_name',
    },
  ];

  countyTablecolumns = [
    {
      Header: 'Name',
      accessor: 'county_name',
    },
  ];

  voucherTablecolumns = [
    {
      Header: 'ID',
      accessor: 'voucher_details_id',
    },
    {
      Header: 'Name',
      accessor: 'label',
    },
  ];

  refreshType = async (label, parent, callback) => {
    try {
      const response = await callback(
        parent === 'county' ? this.state.country.selectedData.id : undefined
      );

      this.setState({
        [parent]: {
          ...this.state[parent],
          data: response.data[`${label}`],
          selectedData: null,
        },
      });
    } catch (e) {
      NotificationManager.error(
        'Error',
        `Could not refresh ${parent} categories, please try again later`,
        this.timeOut
      );
    }
  };

  post = async (parent, data, label, callback, refreshCallback) => {
    try {
      this.setState({ loading: true });
      await callback(data);
      NotificationManager.success(
        'Success',
        `Saved ${parent} Type successfully`,
        this.timeOut
      );
      await this.refreshType(label, parent, refreshCallback);
    } catch (e) {
      NotificationManager.error(
        'Error',
        `Could not save ${parent} Type, please try again later`,
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  };

  put = async (parent, data, label, callback, refreshCallback) => {
    try {
      this.setState({ loading: true });
      await callback(data);
      NotificationManager.success(
        'Success',
        `Updated ${parent} Type successfully`,
        this.timeOut
      );
      await this.refreshType(label, parent, refreshCallback);
    } catch (e) {
      NotificationManager.error(
        'Error',
        `Could not update ${parent} Type, please try again later`,
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  };

  save = async (parent, data) => {
    switch (parent) {
      case 'county':
        await this.post(
          parent,
          data,
          'counties',
          service.postCounty,
          service.getCounties
        );
        break;
      case 'country':
      default:
        break;
    }
  };

  update = async (parent, data) => {
    switch (parent) {
      case 'county':
        await this.put(
          parent,
          data,
          'counties',
          service.putCounty,
          service.getCounties
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
            selectedData: null,
          },
        })
      : this.setState({
          [parent]: {
            ...this.state[parent],
            modalDialog: !this.state[parent].modalDialog,
          },
        });

  reloadCounty = async (countryId) => {
    try {
      this.setState({ loading: true });
      const response = await service.getCounties(countryId);
      const counties = response.data.counties;

      this.setState({
        county: {
          ...this.state.county,
          data: counties,
          filteredData: [],
        },
      });
    } catch (error) {
      NotificationManager.error(
        'Error',
        'Could not retrieve counties',
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  };

  setSelectedData = (parent, data) => {
    this.setState({
      [parent]: {
        ...this.state[parent],
        modalDialog: true,
        selectedData: data,
      },
    });

    switch (parent) {
      case 'country':
        this.reloadCounty(data.id);
        break;
      default:
        break;
    }
  };

  render() {
    const {
      data: countryData,
      filteredData: countryFilteredData,
      selectedData: countrySelectedData,
    } = this.state.country;
    const {
      data: countyData,
      filteredData: countyFilteredData,
      selectedData: countySelectedData,
    } = this.state.county;

    return (
      <div>
        <div className='row'>
          <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
            <div>
              <ol className='breadcrumb'>
                <li className='breadcrumb-item active'>Country Counties</li>
              </ol>
              <h1 className='page-header m-0'>Country Counties</h1>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-xl-6 col-lg-6'>
            <div className='card mb-3'>
              <div className='card-body'>
                <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
                  <h5> Countries</h5>
                </div>

                <div className='col-xl-12 col-lg-12'>
                  <input
                    type='text'
                    className='form-control m-b-5'
                    placeholder='search ....'
                    name='searchInput'
                    value={this.state.country.searchInput || ''}
                    onChange={(e) => this.handleChange('country', e)}
                  />
                </div>

                <ReactTable
                  data={
                    countryFilteredData && countryFilteredData.length
                      ? countryFilteredData
                      : countryData
                  }
                  columns={this.countryTablecolumns}
                  defaultPageSize={20}
                  showPageSizeOptions={true}
                  previousText='Prev'
                  nextText='Next'
                  minRows={0}
                  showPageJump={false}
                  resizable={false}
                  className='-striped'
                  getTrProps={(state, rowInfo, column, instance) => ({
                    onClick: (e) => {
                      this.setSelectedData('country', {
                        id: rowInfo.original.country_id,
                        name: rowInfo.original.country_name,
                      });
                    },
                  })}
                />
              </div>
            </div>
          </div>

          <div className='col-xl-6 col-lg-6'>
            <div className='card mb-3'>
              <div className='card-body'>
                <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
                  <h5>
                    {' '}
                    Counties{' '}
                    {countrySelectedData
                      ? ` for ${countrySelectedData.name}`
                      : ''}
                  </h5>
                  {countrySelectedData && (
                    <button
                      className='btn btn-primary'
                      onClick={() => this.toggleVisibility('county')}
                      style={{ textDecoration: 'none' }}
                    >
                      <i className='fa fa-plus'></i> Create
                    </button>
                  )}
                </div>

                <div className='col-xl-12 col-lg-12'>
                  <input
                    type='text'
                    className='form-control m-b-5'
                    placeholder='search ....'
                    name='searchInput'
                    value={this.state.county.searchInput || ''}
                    onChange={(e) => this.handleChange('county', e)}
                  />
                </div>
                <ReactTable
                  data={
                    countyFilteredData && countyFilteredData.length
                      ? countyFilteredData
                      : countyData
                  }
                  columns={this.countyTablecolumns}
                  defaultPageSize={20}
                  showPageSizeOptions={true}
                  previousText='Prev'
                  nextText='Next'
                  minRows={0}
                  noDataText={
                    countrySelectedData ? 'No County found' : 'Select a country'
                  }
                  showPageJump={false}
                  resizable={false}
                  className='-striped'
                  getTrProps={(state, rowInfo, column, instance) => ({
                    onClick: (e) => {
                      this.setSelectedData('county', {
                        id: rowInfo.original.county_id,
                        name: rowInfo.original.county_name,
                      });
                    },
                  })}
                />
              </div>
            </div>
            <CountyModal
              isOpen={this.state.county.modalDialog}
              parent={{ name: 'county', parentId: countrySelectedData?.id }}
              toggle={() => this.toggleVisibility('county', true)}
              save={countySelectedData ? this.update : this.save}
              data={countySelectedData}
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

export default withRouter(CountyList);
