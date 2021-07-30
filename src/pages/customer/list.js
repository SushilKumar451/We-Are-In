import React from 'react';
import { withRouter } from 'react-router';
import ReactTable from 'react-table';
import SweetAlert from 'react-bootstrap-sweetalert';
import service from '../../services/customer-service';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';
import 'react-table/react-table.css';
import 'react-notifications/lib/notifications.css';

class CustomerList extends React.Component {
  state = {
    customers: [],
    loading: false,
  };

  timeOut = 1000;

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const response = await service.getCustomers();
      const customers = response.data.customers;
      this.setState({ customers });
    } catch (error) {
      NotificationManager.error(
        'Error',
        'Could not retrieve customers',
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  }

  reactTablecolumns = [
    {
      Header: 'ID',
      accessor: 'customer_id',
    },
    {
      Header: 'Category',
      accessor: 'customer',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Location',
      accessor: 'location',
    },
    {
      Header: 'Phone',
      accessor: 'phone',
    },
    {
      Header: 'Status',
      accessor: 'status_name',
    },
    {
      Header: 'Created Date',
      accessor: 'create_date',
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
    const customers = this.state.customers;

    return (
      <div>
        <div className='row'>
          <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
            <div>
              <ol className='breadcrumb'>
                <li className='breadcrumb-item active'>Customer Management</li>
              </ol>
              <h1 className='page-header m-0'>Customer Profile</h1>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-xl-12 col-lg-12'>
            <div className='card mb-3'>
              <div className='card-body'>
                <ReactTable
                  data={customers}
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
                    onClick: (e) => {
                      this.props.history.push(
                        `/customer/edit/${rowInfo.original.customer_id}`
                      );
                    },
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
export default withRouter(CustomerList);
