import React from 'react';
import { withRouter } from 'react-router';
import ReactTable from 'react-table';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Link } from 'react-router-dom';
import service from '../../services/client-service';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';
//import 'react-table/react-table.css';
import 'react-notifications/lib/notifications.css';

class ClientList extends React.Component {
  state = {
    data: {
      list: [],
    },
    loading: false,
  };

  timeOut = 1000;

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const response = await service.getClients();
      const result = response.data;
      this.setState({ data: { list: result } });
    } catch (error) {
      NotificationManager.error(
        'Error',
        'Could not retrieve clients',
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  }

  reactTablecolumns = [
    {
      Header: 'UID',
      accessor: 'uid',
    },
    {
      Header: 'Name',
      accessor: 'client_name',
    },
    {
      Header: 'Category',
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

  render() {
    const clients = this.state.data.list;
    return (
      <div>
        <div className='row'>
          <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
            <div>
              <ol className='breadcrumb'>
                <li className='breadcrumb-item active'>Client Management</li>
              </ol>
              <h1 className='page-header m-0'>Client Management</h1>
            </div>
            <Link
              className='btn btn-primary'
              to='/client/create'
              style={{ textDecoration: 'none' }}
            >
              <i className='fa fa-plus'></i> Create Client
            </Link>
          </div>
        </div>

        <div className='row'>
          <div className='col-xl-12 col-lg-12'>
            <div className='card mb-3'>
              <div className='card-body'>
                <ReactTable
                  data={clients}
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
                        `/client/edit/${rowInfo.original.client_id}`
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

export default withRouter(ClientList);
