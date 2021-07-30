import React from 'react';
import { withRouter } from 'react-router';
import ReactTable from 'react-table';
import SweetAlert from 'react-bootstrap-sweetalert';
import CategoryModal from '../../../components/modals/category';
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
    },
    amenity: {
      data: [],
      filteredData: [],
      searchInput: '',
      modalDialog: false,
    },
    voucher: {
      data: [],
      filteredData: [],
      searchInput: '',
      modalDialog: false,
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
          data: offersResponse.data.client_categories,
        },
        amenity: {
          ...this.state.amenity,
          data: amenitiesResponse.data.brand_categories,
        },
        voucher: {
          ...this.state.voucher,
          data: vouchersResponse.data.voucher_categories,
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
      return value.category_name
        .toLowerCase()
        .includes(searchInput.toLowerCase());
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

  reactTablecolumns = [
    {
      Header: 'ID',
      accessor: 'category_id',
    },
    {
      Header: 'Name',
      accessor: 'category_name',
    },
    {
      Cell: (
        <div className='text-right'>
          <i className='fa fa-edit'></i>
        </div>
      ),
    },
  ];

  refreshCategory = async (parent, callback) => {
    try {
      const response = await callback();
      this.setState({
        [parent]: {
          ...this.state[parent],
          data: response.data[`${parent}_categories`],
          selectedCategory: null,
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

  postCategory = async (parent, data, callback, refreshCallback) => {
    try {
      this.setState({ loading: true });
      await callback({ category_name: data });
      NotificationManager.success(
        'Success',
        `Saved ${parent} category successfully`,
        this.timeOut
      );
      await this.refreshCategory(parent, refreshCallback);
    } catch (e) {
      NotificationManager.error(
        'Error',
        `Could not save ${parent} category, please try again later`,
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  };

  putCategory = async (parent, data, callback, refreshCallback) => {
    try {
      this.setState({ loading: true });
      await callback(data);
      NotificationManager.success(
        'Success',
        `Updated ${parent} category successfully`,
        this.timeOut
      );
      await this.refreshCategory(parent, refreshCallback);
    } catch (e) {
      NotificationManager.error(
        'Error',
        `Could not update ${parent} category, please try again later`,
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  };

  saveCategory = async (parent, data) => {
    switch (parent) {
      case 'client':
        await this.postCategory(
          parent,
          data,
          service.postClientCategory,
          service.getClientCategories
        );
        break;
      case 'brand':
        await this.postCategory(
          parent,
          data,
          service.postBrandCategory,
          service.getBrandCategories
        );
        break;
      case 'merchant':
        await this.postCategory(
          parent,
          data,
          service.postMerchantCategory,
          service.getMerchantCategories
        );
        break;
      case 'voucher':
        await this.postCategory(
          parent,
          data,
          service.postVoucherCategory,
          service.getVoucherCategories
        );
        break;
      default:
        break;
    }
  };

  updateCategory = async (parent, data) => {
    switch (parent) {
      case 'client':
        await this.putCategory(
          parent,
          data,
          service.putClientCategory,
          service.getClientCategories
        );
        break;
      case 'brand':
        await this.putCategory(
          parent,
          data,
          service.putBrandCategory,
          service.getBrandCategories
        );
        break;
      case 'merchant':
        await this.putCategory(
          parent,
          data,
          service.putMerchantCategory,
          service.getMerchantCategories
        );
        break;
      case 'voucher':
        await this.putCategory(
          parent,
          data,
          service.putVoucherCategory,
          service.getVoucherCategories
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
            selectedCategory: null,
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
        selectedCategory: data,
      },
    });

  render() {
    const {
      data: offerData,
      filteredData: offerFilteredData,
      selectedCategory: offerSelectedCategory,
    } = this.state.offer;
    const {
      data: amenityData,
      filteredData: amenityFilteredData,
      selectedCategory: amenitySelectedCategory,
    } = this.state.amenity;
    const {
      data: voucherData,
      filteredData: voucherFilteredData,
      selectedCategory: voucherSelectedCategory,
    } = this.state.voucher;

    return (
      <div>
        <div className='row'>
          <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
            <div>
              <ol className='breadcrumb'>
                <li className='breadcrumb-item active'>
                  Offer Types, Amenities and Voucher details
                </li>
              </ol>
              <h1 className='page-header m-0'>
                Offer Types, Amenities and Voucher details
              </h1>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-xl-6 col-lg-6'>
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

                <div className='col-xl-4 col-lg-4'>
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
                  columns={this.reactTablecolumns}
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
                      this.setSelectedData('client', {
                        id: rowInfo.original.category_id,
                        name: rowInfo.original.category_name,
                      });
                    },
                  })}
                />
              </div>
            </div>

            <CategoryModal
              label='Offer'
              isOpen={this.state.offer.modalDialog}
              toggle={() => this.toggleVisibility('offer', true)}
              saveCategory={
                clientSelectedCategory ? this.updateCategory : this.saveCategory
              }
              data={offerSelectedCategory}
            />
          </div>

          <div className='col-xl-6 col-lg-6'>
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

                <div className='col-xl-4 col-lg-4'>
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
                  columns={this.reactTablecolumns}
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
                      this.setSelectedData('brand', {
                        id: rowInfo.original.category_id,
                        name: rowInfo.original.category_name,
                      });
                    },
                  })}
                />
              </div>
            </div>
            <CategoryModal
              label='Amenity'
              isOpen={this.state.amenity.modalDialog}
              toggle={() => this.toggleVisibility('amenity', true)}
              saveCategory={
                amenitySelectedCategory
                  ? this.updateCategory
                  : this.saveCategory
              }
              data={amenitySelectedCategory}
            />
          </div>
        </div>

        <div className='row'>
          <div className='col-xl-6 col-lg-6'>
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
                <div className='col-xl-4 col-lg-4'>
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
                  columns={this.reactTablecolumns}
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
                      this.setSelectedData('merchant', {
                        id: rowInfo.original.category_id,
                        name: rowInfo.original.category_name,
                      });
                    },
                  })}
                />
              </div>
              <CategoryModal
                label='Voucher'
                isOpen={this.state.voucher.modalDialog}
                toggle={() => this.toggleVisibility('voucher', true)}
                saveCategory={
                  voucherSelectedCategory
                    ? this.updateCategory
                    : this.saveCategory
                }
                data={voucherSelectedCategory}
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
