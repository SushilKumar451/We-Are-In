import React from 'react';
import { withRouter } from 'react-router';
import ReactTable from 'react-table';
import SweetAlert from 'react-bootstrap-sweetalert';
import service from '../../services/revenue-service';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';

class RevenueList extends React.Component {
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
      const response = await service.getRevenues();

      const result = response.data.subscriptions;
      this.setState({ data: { list: result } });
    } catch (error) {
      NotificationManager.error(
        'Error',
        'Could not retrieve revenue',
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  }

  reactTablecolumns = [
    {
      Header: 'Order ID',
      accessor: 'order_id',
    },
    {
      Header: 'Order status',
      accessor: 'order_status',
    },
    {
      Header: 'Payment method',
      accessor: 'payment_method',
    },
    {
      Header: 'Payment status',
      accessor: 'payment_status',
    },

    {
      Header: 'date',
      accessor: 'date',
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
    const revenues = this.state.data.list;

    return (
      <div>
        <div className='row'>
          <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
            <div>
              <ol className='breadcrumb'>
                <li className='breadcrumb-item active'>Revenue Management</li>
              </ol>
              <h1 className='page-header m-0'>Revenue Management</h1>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-xl-12 col-lg-12'>
            <div className='card mb-3'>
              <div className='card-body'>
                <ReactTable
                  data={revenues}
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
                        `/revenue/detail/${rowInfo.original.subscription_id}`
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

export default withRouter(RevenueList);
