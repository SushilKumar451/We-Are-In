import React from 'react';
import { withRouter } from 'react-router';
import ReactTable from 'react-table';
import SweetAlert from 'react-bootstrap-sweetalert';
import CategoryModal from '../../../components/modals/category';
import LoyaltyModal from '../../../components/modals/loyalty';
import SubscriptionModal from '../../../components/modals/subscription';
import service from '../../../services/admin-service';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';
//import 'react-table/react-table.css';

class CategoryList extends React.Component {
  state = {
    client: {
      data: [],
      filteredData: [],
      searchInput: '',
      selectedCategory: null,
      modalDialog: false,
    },
    brand: {
      data: [],
      filteredData: [],
      searchInput: '',
      selectedCategory: null,
      modalDialog: false,
    },
    merchant: {
      data: [],
      filteredData: [],
      searchInput: '',
      selectedCategory: null,
      modalDialog: false,
    },
    voucher: {
      data: [],
      filteredData: [],
      searchInput: '',
      selectedCategory: null,
      modalDialog: false,
    },
    subscription: {
      data: [],
      filteredData: [],
      searchInput: '',
      selectedCategory: null,
      modalDialog: false,
    },
    loyalty: {
      data: [],
      filteredData: [],
      searchInput: '',
      selectedCategory: null,
      modalDialog: false,
    },
  };

  timeOut = 1000;

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const [
        clientsResponse,
        brandsResponse,
        merchantsResponse,
        vouchersResponse,
        subscriptionsResponse,
        loyaltiesResponse,
      ] = await Promise.all([
        service.getClientCategories(),
        service.getBrandCategories(),
        service.getMerchantCategories(),
        service.getVoucherCategories(),
        service.getSubscriptionTypes(),
        service.getLoyaltyStatuses(),
      ]);

      this.setState({
        client: {
          ...this.state.client,
          data: clientsResponse.data.client_categories,
        },
        brand: {
          ...this.state.brand,
          data: brandsResponse.data.brand_categories,
        },
        merchant: {
          ...this.state.merchant,
          data: merchantsResponse.data.merchant_categories,
        },
        voucher: {
          ...this.state.voucher,
          data: vouchersResponse.data.voucher_categories,
        },
        subscription: {
          ...this.state.subscription,
          data: subscriptionsResponse.data.subscription_types,
        },
        loyalty: {
          ...this.state.loyalty,
          data: loyaltiesResponse.data.loyalty_statuses,
        },
      });
    } catch (error) {
      NotificationManager.error(
        'Error',
        'Could not retrieve group categories',
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
  ];

  loyaltyTableColumns = [
    {
      Header: 'ID',
      accessor: 'status_id',
    },
    {
      Header: 'Name',
      accessor: 'status_name',
    },
    {
      Header: 'Label',
      accessor: 'status_label',
    },
  ];

  subscriptionTableColumns = [
    {
      Header: 'ID',
      accessor: 'subscription_type_id',
    },
    {
      Header: 'Price',
      accessor: 'subscription_price',
    },
    {
      Header: 'Type',
      accessor: 'subscription_type',
    },
  ];

  refreshCategory = async (parent, callback, label = null) => {
    try {
      const response = await callback();
      this.setState({
        [parent]: {
          ...this.state[parent],
          data: !label
            ? response.data[`${parent}_categories`]
            : response.data[`${label}`],
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

  postCategory = async (
    parent,
    data,
    callback,
    refreshCallback,
    label = null
  ) => {
    try {
      this.setState({ loading: true });
      await callback(data);
      NotificationManager.success(
        'Success',
        `Saved ${parent} category successfully`,
        this.timeOut
      );
      await this.refreshCategory(parent, refreshCallback, label);
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

  putCategory = async (
    parent,
    data,
    callback,
    refreshCallback,
    label = null
  ) => {
    try {
      this.setState({ loading: true });
      await callback(data);
      NotificationManager.success(
        'Success',
        `Updated ${parent} category successfully`,
        this.timeOut
      );
      await this.refreshCategory(parent, refreshCallback, label);
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
      case 'subscription':
        await this.postCategory(
          parent,
          data,
          service.postSubscriptionType,
          service.getSubscriptionTypes,
          'subscription_types'
        );
        break;
      case 'loyalty':
        await this.postCategory(
          parent,
          data,
          service.postLoyaltyStatus,
          service.getLoyaltyStatuses,
          'loyalty_statuses'
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
      case 'subscription':
        await this.putCategory(
          parent,
          data,
          service.putSubscriptionType,
          service.getSubscriptionTypes,
          'subscription_types'
        );
        break;
      case 'loyalty':
        await this.putCategory(
          parent,
          data,
          service.putLoyaltyStatus,
          service.getLoyaltyStatuses,
          'loyalty_statuses'
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
      data: clientData,
      filteredData: clientFilteredData,
      selectedCategory: clientSelectedCategory,
    } = this.state.client;
    const {
      data: brandData,
      filteredData: brandFilteredData,
      selectedCategory: brandSelectedCategory,
    } = this.state.brand;
    const {
      data: merchantData,
      filteredData: merchantFilteredData,
      selectedCategory: merchantSelectedCategory,
    } = this.state.merchant;
    const {
      data: voucherData,
      filteredData: voucherFilteredData,
      selectedCategory: voucherSelectedCategory,
    } = this.state.voucher;

    const {
      data: subscriptionData,
      filteredData: subscriptionFilteredData,
      selectedCategory: subscriptionSelectedCategory,
    } = this.state.subscription;

    const {
      data: loyaltyData,
      filteredData: loyaltyFilteredData,
      selectedCategory: loyaltySelectedCategory,
    } = this.state.loyalty;
    return (
      <div>
        <div className='row'>
          <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
            <div>
              <ol className='breadcrumb'>
                <li className='breadcrumb-item active'>Group and Categories</li>
              </ol>
              <h1 className='page-header m-0'>Group and Categories</h1>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-xl-4 col-lg-4'>
            <div className='card mb-3'>
              <div className='card-body'>
                <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
                  <h5> Client Categories</h5>
                  <button
                    className='btn btn-primary'
                    onClick={() => this.toggleVisibility('client')}
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
                    value={this.state.client.searchInput || ''}
                    onChange={(e) => this.handleChange('client', e)}
                  />
                </div>

                <ReactTable
                  data={
                    clientFilteredData && clientFilteredData.length
                      ? clientFilteredData
                      : clientData
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
              label='Client'
              isOpen={this.state.client.modalDialog}
              toggle={() => this.toggleVisibility('client', true)}
              saveCategory={
                clientSelectedCategory ? this.updateCategory : this.saveCategory
              }
              data={clientSelectedCategory}
            />
          </div>

          <div className='col-xl-4 col-lg-4'>
            <div className='card mb-3'>
              <div className='card-body'>
                <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
                  <h5> Brand Categories</h5>
                  <button
                    className='btn btn-primary'
                    onClick={() => this.toggleVisibility('brand')}
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
                    value={this.state.brand.searchInput || ''}
                    onChange={(e) => this.handleChange('brand', e)}
                  />
                </div>
                <ReactTable
                  data={
                    brandFilteredData && brandFilteredData.length
                      ? brandFilteredData
                      : brandData
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
              label='Brand'
              isOpen={this.state.brand.modalDialog}
              toggle={() => this.toggleVisibility('brand', true)}
              saveCategory={
                brandSelectedCategory ? this.updateCategory : this.saveCategory
              }
              data={brandSelectedCategory}
            />
          </div>

          <div className='col-xl-4 col-lg-4'>
            <div className='card mb-3'>
              <div className='card-body'>
                <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
                  <h5> Merchant Categories</h5>
                  <button
                    className='btn btn-primary'
                    onClick={() => this.toggleVisibility('merchant')}
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
                    value={this.state.merchant.searchInput || ''}
                    onChange={(e) => this.handleChange('merchant', e)}
                  />
                </div>
                <ReactTable
                  data={
                    merchantFilteredData && merchantFilteredData.length
                      ? merchantFilteredData
                      : merchantData
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
                label='Merchant'
                isOpen={this.state.merchant.modalDialog}
                toggle={() => this.toggleVisibility('merchant', true)}
                saveCategory={
                  merchantSelectedCategory
                    ? this.updateCategory
                    : this.saveCategory
                }
                data={merchantSelectedCategory}
              />
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-xl-4 col-lg-4'>
            <div className='card mb-3'>
              <div className='card-body'>
                <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
                  <h5> Voucher Categories</h5>
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
                      this.setSelectedData('voucher', {
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

          <div className='col-xl-4 col-lg-4'>
            <div className='card mb-3'>
              <div className='card-body'>
                <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
                  <h5> Subscription Types </h5>
                  <button
                    className='btn btn-primary'
                    onClick={() => this.toggleVisibility('subscription')}
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
                    value={this.state.subscription.searchInput || ''}
                    onChange={(e) => this.handleChange('subscription', e)}
                  />
                </div>
                <ReactTable
                  data={
                    subscriptionFilteredData && subscriptionFilteredData.length
                      ? subscriptionFilteredData
                      : subscriptionData
                  }
                  columns={this.subscriptionTableColumns}
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
                      this.setSelectedData('subscription', {
                        id: rowInfo.original.subscription_type_id,
                        price: rowInfo.original.subscription_price,
                        type: rowInfo.original.subscription_type,
                      });
                    },
                  })}
                />
              </div>
              <SubscriptionModal
                label='subscription'
                isOpen={this.state.subscription.modalDialog}
                toggle={() => this.toggleVisibility('subscription', true)}
                save={
                  subscriptionSelectedCategory
                    ? this.updateCategory
                    : this.saveCategory
                }
                data={subscriptionSelectedCategory}
              />
            </div>
          </div>

          <div className='col-xl-4 col-lg-4'>
            <div className='card mb-3'>
              <div className='card-body'>
                <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
                  <h5> Loyalty Statuses </h5>
                  <button
                    className='btn btn-primary'
                    onClick={() => this.toggleVisibility('loyalty')}
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
                    value={this.state.loyalty.searchInput || ''}
                    onChange={(e) => this.handleChange('loyalty', e)}
                  />
                </div>
                <ReactTable
                  data={
                    loyaltyFilteredData && loyaltyFilteredData.length
                      ? loyaltyFilteredData
                      : loyaltyData
                  }
                  columns={this.loyaltyTableColumns}
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
                      this.setSelectedData('loyalty', {
                        id: rowInfo.original.status_id,
                        name: rowInfo.original.status_name,
                        label: rowInfo.original.status_label,
                      });
                    },
                  })}
                />
              </div>
              <LoyaltyModal
                label='loyalty'
                isOpen={this.state.loyalty.modalDialog}
                toggle={() => this.toggleVisibility('loyalty', true)}
                save={
                  loyaltySelectedCategory
                    ? this.updateCategory
                    : this.saveCategory
                }
                data={loyaltySelectedCategory}
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

export default withRouter(CategoryList);
