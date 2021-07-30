import React from 'react';
import { withRouter } from 'react-router';
import ReactTable from 'react-table';
import SweetAlert from 'react-bootstrap-sweetalert';
import service from '../../../services/admin-service';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';

class ActivityLogList extends React.Component {
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
      const response = await service.getActivityLogs();
      const result = response.data?.activity_logs;
      this.setState({ data: { list: result || [] } });
    } catch (error) {
      NotificationManager.error(
        'Error',
        'Could not retrieve logs',
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  }

  reactTablecolumns = [
    {
      Header: 'Id',
      accessor: 'user_log_id',
    },
    {
      Header: 'Activity',
      accessor: 'activity',
    },
    {
      Header: 'Action By',
      accessor: 'action_by',
    },
    {
      Header: 'Page Name',
      accessor: 'page_name',
    },
    {
      Header: 'User Id',
      accessor: 'user_id',
    },
  ];

  render() {
    const brands = this.state.data.list;

    return (
      <div>
        <div className='row'>
          <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
            <div>
              <ol className='breadcrumb'>
                <li className='breadcrumb-item active'>Activity Logs</li>
              </ol>
              <h1 className='page-header m-0'>Activity Logs</h1>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-xl-12 col-lg-12'>
            <div className='card mb-3'>
              <div className='card-body'>
                <ReactTable
                  data={brands}
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
                        `/brand/edit/${rowInfo.original.brand_id}`
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

export default withRouter(ActivityLogList);
