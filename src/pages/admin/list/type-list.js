import React from 'react';
import { withRouter } from 'react-router';
import ReactTable from 'react-table';
import SweetAlert from 'react-bootstrap-sweetalert';
import TypeModal from '../../../components/modals/type';
import service from '../../../services/admin-service';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';
//import 'react-table/react-table.css';

class TypeList extends React.Component {
  state = {
    offer: {
      data: [],
      filteredData: [],
      searchInput: '',
      modalDialog: false,
      selectedType: null,
    },
    amenity: {
      data: [],
      filteredData: [],
      searchInput: '',
      modalDialog: false,
      selectedType: null,
    },
    voucher: {
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
      const [
        offersResponse,
        amenitiesResponse,
        vouchersResponse,
      ] = await Promise.all([
        service.getOfferTypes(),
        service.getAmenities(),
        service.getVoucherDetails(),
      ]);

      this.setState({
        offer: {
          ...this.state.offer,
          data: offersResponse.data.offer_types,
          selectedType: null,
        },
        amenity: {
          ...this.state.amenity,
          data: amenitiesResponse.data.amenities,
          selectedType: null,
        },
        voucher: {
          ...this.state.voucher,
          data: vouchersResponse.data.voucher_details,
          selectedType: null,
        },
      });
    } catch (error) {
      NotificationManager.error(
        'Error',
        'Could not retrieve types',
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  }

  tableSearch = (parent) => {
    let { searchInput, data } = this.state[parent];
    let filteredData = data.filter((value) => {
      return value.label.toLowerCase().includes(searchInput.toLowerCase());
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

  offerTablecolumns = [
    {
      Header: 'ID',
      accessor: 'offer_type_id',
    },
    {
      Header: 'Name',
      accessor: 'name',
    },
  ];

  amenityTablecolumns = [
    {
      Header: 'ID',
      accessor: 'amenities_id',
    },
    {
      Header: 'Name',
      accessor: 'label',
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
        `Could not refresh ${parent} categories, please try again later`,
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

  putType = async (parent, data, label, callback, refreshCallback) => {
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

  saveType = async (parent, data) => {
    switch (parent) {
      case 'offer':
        await this.postType(
          parent,
          data,
          'offer_types',
          service.postOfferType,
          service.getOfferTypes
        );
        break;
      case 'amenity':
        await this.postType(
          parent,
          data,
          'amenities',
          service.postAmenity,
          service.getAmenities
        );
        break;
      case 'voucher':
        await this.postType(
          parent,
          data,
          'voucher_details',
          service.postVoucherDetail,
          service.getVoucherDetails
        );
        break;
      default:
        break;
    }
  };

  updateType = async (parent, data) => {
    switch (parent) {
      case 'offer':
        await this.putType(
          parent,
          data,
          'offer_types',
          service.putOfferType,
          service.getOfferTypes
        );
        break;
      case 'amenity':
        await this.putType(
          parent,
          data,
          'amenities',
          service.putAmenity,
          service.getAmenities
        );
        break;
      case 'voucher':
        await this.putType(
          parent,
          data,
          'voucher_details',
          service.putVoucherDetail,
          service.getVoucherDetails
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
      data: offerData,
      filteredData: offerFilteredData,
      selectedType: offerSelectedType,
    } = this.state.offer;
    const {
      data: amenityData,
      filteredData: amenityFilteredData,
      selectedType: amenitySelectedType,
    } = this.state.amenity;
    const {
      data: voucherData,
      filteredData: voucherFilteredData,
      selectedType: voucherSelectedType,
    } = this.state.voucher;

    return (
      <div>
        <div className='row'>
          <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
            <div>
              <ol className='breadcrumb'>
                <li className='breadcrumb-item active'>
                  Offers, Amenities and Voucher details
                </li>
              </ol>
              <h1 className='page-header m-0'>
                Offers, Amenities and Voucher details
              </h1>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-xl-4 col-lg-4'>
            <div className='card mb-3'>
              <div className='card-body'>
                <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
                  <h5> Offer Types</h5>
                  <button
                    className='btn btn-primary'
                    onClick={() => this.toggleVisibility('offer')}
                    style={{ textDecoration: 'none' }}
                  >
                    <i className='fa fa-plus'></i> Create
                  </button>
                </div>

                <div className='col-xl-12 col-lg-12'>
                  <input
                    type='text'
                    className='form-control m-b-5'
                    placeholder='search ....'
                    name='searchInput'
                    value={this.state.offer.searchInput || ''}
                    onChange={(e) => this.handleChange('offer', e)}
                  />
                </div>

                <ReactTable
                  data={
                    offerFilteredData && offerFilteredData.length
                      ? offerFilteredData
                      : offerData
                  }
                  columns={this.offerTablecolumns}
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
                      this.setSelectedData('offer', {
                        id: rowInfo.original.offer_type_id,
                        name: rowInfo.original.name,
                        label: rowInfo.original.label,
                        icon: rowInfo.original.offer_type_icon,
                        value: rowInfo.original.value,
                        type: 'offer',
                      });
                    },
                  })}
                />
              </div>
            </div>

            <TypeModal
              label='Offer'
              typeLabel='offer_type'
              isOpen={this.state.offer.modalDialog}
              toggle={() => this.toggleVisibility('offer', true)}
              saveType={offerSelectedType ? this.updateType : this.saveType}
              data={offerSelectedType}
            />
          </div>

          <div className='col-xl-4 col-lg-4'>
            <div className='card mb-3'>
              <div className='card-body'>
                <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
                  <h5> Amenities</h5>
                  <button
                    className='btn btn-primary'
                    onClick={() => this.toggleVisibility('amenity')}
                    style={{ textDecoration: 'none' }}
                  >
                    <i className='fa fa-plus'></i> Create
                  </button>
                </div>

                <div className='col-xl-12 col-lg-12'>
                  <input
                    type='text'
                    className='form-control m-b-5'
                    placeholder='search ....'
                    name='searchInput'
                    value={this.state.amenity.searchInput || ''}
                    onChange={(e) => this.handleChange('amenity', e)}
                  />
                </div>
                <ReactTable
                  data={
                    amenityFilteredData && amenityFilteredData.length
                      ? amenityFilteredData
                      : amenityData
                  }
                  columns={this.amenityTablecolumns}
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
                      this.setSelectedData('amenity', {
                        id: rowInfo.original.amenities_id,
                        name: rowInfo.original.name,
                        label: rowInfo.original.label,
                        icon: rowInfo.original.amenities_icon,
                        value: rowInfo.original.value,
                        type: 'voucher',
                      });
                    },
                  })}
                />
              </div>
            </div>
            <TypeModal
              label='Amenity'
              typeLabel='amenities'
              isOpen={this.state.amenity.modalDialog}
              toggle={() => this.toggleVisibility('amenity', true)}
              saveType={amenitySelectedType ? this.updateType : this.saveType}
              data={amenitySelectedType}
            />
          </div>

          <div className='col-xl-4 col-lg-4'>
            <div className='card mb-3'>
              <div className='card-body'>
                <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
                  <h5> Voucher Details</h5>
                  <button
                    className='btn btn-primary'
                    onClick={() => this.toggleVisibility('voucher')}
                    style={{ textDecoration: 'none' }}
                  >
                    <i className='fa fa-plus'></i> Create
                  </button>
                </div>
                <div className='col-xl-12 col-lg-12'>
                  <input
                    type='text'
                    className='form-control m-b-5'
                    placeholder='search ....'
                    name='searchInput'
                    value={this.state.voucher.searchInput || ''}
                    onChange={(e) => this.handleChange('voucher', e)}
                  />
                </div>
                <ReactTable
                  data={
                    voucherFilteredData && voucherFilteredData.length
                      ? voucherFilteredData
                      : voucherData
                  }
                  columns={this.voucherTablecolumns}
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
                      this.setSelectedData('voucher', {
                        id: rowInfo.original.voucher_details_id,
                        name: rowInfo.original.name,
                        label: rowInfo.original.label,
                        icon: rowInfo.original.voucher_details_icon,
                        value: rowInfo.original.value,
                        type: 'voucher',
                      });
                    },
                  })}
                />
              </div>
              <TypeModal
                label='Voucher'
                typeLabel='voucher_details'
                isOpen={this.state.voucher.modalDialog}
                toggle={() => this.toggleVisibility('voucher', true)}
                saveType={voucherSelectedType ? this.updateType : this.saveType}
                data={voucherSelectedType}
              />
            </div>
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

export default withRouter(TypeList);
