import React from 'react';
import { withRouter } from 'react-router';
import ReactTable from 'react-table';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Link } from 'react-router-dom';
import service from '../../../services/admin-service';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';
//import 'react-table/react-table.css';
import 'react-notifications/lib/notifications.css';

class UserList extends React.Component {
  state = {
    data: [],
    filteredData: [],
    searchInput: '',
  };

  timeOut = 1000;

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const response = await service.getUsers();
      const result = response.data.users;
      this.setState({ data: result });
    } catch (error) {
      NotificationManager.error(
        'Error',
        'Could not retrieve users',
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  }

  tableSearch = () => {
    let { searchInput, data } = this.state;
    let filteredData = data.filter((value) => {
      return (
        value.forename.toLowerCase().includes(searchInput.toLowerCase()) ||
        // value.surname.toLowerCase().includes(searchInput.toLowerCase()) ||
        value.username.toLowerCase().includes(searchInput.toLowerCase())
        
      );
    });
    this.setState({ filteredData });
  };

  handleChange = (event) => {
    this.setState({ searchInput: event.target.value }, () => {
      this.tableSearch();
    });
  };

  reactTablecolumns = [
    // {
    //   Header: 'ForeName',
    //   accessor: 'forename',
    // },
    // {
    //   Header: 'Surname',
    //   accessor: 'surname',
    // },
    // {
    //   Header: 'Username',
    //   accessor: 'email',
    // },
    {
      Header: 'Username',
      accessor: 'forename',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Create by',
      accessor: 'created_by',
    },
    {
      Header: 'Date Created',
      accessor: 'date_created',
    },
    {
      Cell: (
        <div className='text-right'>
          <i className='fa fa-edit'></i>
        </div>
      ),
    },
  ];

  render() {
    const { data, filteredData } = this.state;
    return (
      <div>
        <div className='row'>
          <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
            <div>
              <ol className='breadcrumb'>
                <li className='breadcrumb-item active'>User Management</li>
              </ol>
              <h1 className='page-header m-0'>User Management</h1>
            </div>
            <Link
              className='btn btn-primary'
              to='/admin/user/create'
              style={{ textDecoration: 'none' }}
            >
              <i className='fa fa-plus'></i> Create User
            </Link>
          </div>
        </div>

        <div className='row'>
          <div className='col-xl-12 col-lg-12'>
            <div className='card mb-3'>
              <div className='card-body'>
                <div className='col-xl-4 col-lg-4'>
                  <input
                    type='text'
                    className='form-control m-b-5'
                    placeholder='search ....'
                    name='searchInput'
                    value={this.state.searchInput || ''}
                    onChange={this.handleChange}
                  />
                </div>
                <ReactTable
                  data={
                    filteredData && filteredData.length ? filteredData : data
                  }
                  columns={this.reactTablecolumns}
                  defaultPageSize={10}
                  showPageSizeOptions={true}
                  previousText='Prev'
                  nextText='Next'
                  minRows={0}
                  showPageJump={false}
                  resizable={false}
                  className='-striped'
                  getTrProps={(state, rowInfo, column, instance) => ({
                    // onClick: (e) => {
                    //   this.props.history.push(
                    //     `/admin/users/${rowInfo.original.id}`
                    //   );
                    // },
                  })}
                />
              </div>
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

export default withRouter(UserList);