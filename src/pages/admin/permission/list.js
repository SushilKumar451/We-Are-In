import React from 'react';
import { withRouter } from 'react-router';
import ReactTable from 'react-table';
import SweetAlert from 'react-bootstrap-sweetalert';
import PermissionModal from '../../../components/modals/permission';
import service from '../../../services/admin-service';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';

class PermissionList extends React.Component {
  state = {
    permission: {
      data: [],
      filteredData: [],
      searchInput: '',
      modalDialog: false,
      selectedType: null,
      allAccess: [],
    },
  };

  timeOut = 1000;

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const permissionResponse = await service.getPermissions();
      const allAccessResponse = await service.getAccessLevels();
      this.setState({
        permission: {
          ...this.state.permission,
          data: permissionResponse.data.permissions,
          allAccess: allAccessResponse.data.access_level,
          selectedType: null,
        },
      });
    } catch (error) {
      NotificationManager.error(
        'Error',
        'Could not retrieve permissions',
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
        value.permission_name
          .toLowerCase()
          .includes(searchInput.toLowerCase()) ||
        value.permission_description
          .toLowerCase()
          .includes(searchInput.toLowerCase()) ||
        value.access_name.toLowerCase().includes(searchInput.toLowerCase())
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

  permissionTablecolumns = [
    {
      Header: 'ID',
      accessor: 'permission_id',
    },
    {
      Header: 'Name',
      accessor: 'permission_name',
    },
    {
      Header: 'Description',
      accessor: 'permission_description',
    },
    {
      Header: 'Access',
      accessor: 'access_name',
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
        `Could not update ${parent}, please try again later`,
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  };

  saveType = async (parent, data) => {
    switch (parent) {
      case 'permission':
        await this.postType(
          parent,
          data,
          'permissions',
          service.postPermission,
          service.getPermissions
        );
        break;
      default:
        break;
    }
  };

  updateType = async (parent, data) => {
    switch (parent) {
      case 'permission':
        await this.putType(
          parent,
          data,
          'permissions',
          service.putPermission,
          service.getPermissions
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
      data: permissionData,
      filteredData: permissionFilteredData,
      selectedType,
    } = this.state.permission;

    return (
      <div>
        <div className='row'>
          <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
            <div>
              <ol className='breadcrumb'>
                <li className='breadcrumb-item active'>Permissions</li>
              </ol>
              <h1 className='page-header m-0'>Permissions</h1>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-xl-9 col-lg-9'>
            <div className='card mb-3'>
              <div className='card-body'>
                <div className='col-12 d-flex justify-content-between align-right mb-2'>
                  <h5> Permissions List</h5>
                  <button
                    className='btn btn-primary'
                    onClick={() => this.toggleVisibility('permission')}
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
                    value={this.state.permission.searchInput || ''}
                    onChange={(e) => this.handleChange('permission', e)}
                  />
                </div>

                <ReactTable
                  data={
                    permissionFilteredData && permissionFilteredData.length
                      ? permissionFilteredData
                      : permissionData
                  }
                  columns={this.permissionTablecolumns}
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
                      this.setSelectedData('permission', {
                        id: rowInfo.original.permission_id,
                        name: rowInfo.original.permission_name,
                        description: rowInfo.original.permission_description,
                        accessId: rowInfo.original.access_id,
                        type: 'permission',
                      });
                    },
                  })}
                />
              </div>
            </div>

            <PermissionModal
              label='permission'
              isOpen={this.state.permission.modalDialog}
              toggle={() => this.toggleVisibility('permission', true)}
              saveType={selectedType ? this.updateType : this.saveType}
              allAccess={this.state.permission.allAccess}
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

export default withRouter(PermissionList);
