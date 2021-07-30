import React from 'react';
import { withRouter } from 'react-router';
import ReactTable from 'react-table';
import SweetAlert from 'react-bootstrap-sweetalert';
import service from '../../services/voucher-redemption-service';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';

class VoucherRedemptionList extends React.Component {
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
      const response = await service.getReceipts();
      const result = response.data.receipts;
      this.setState({ data: { list: result } });
    } catch (error) {
      NotificationManager.error(
        'Error',
        'Could not retrieve receipts',
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
      Header: 'Client',
      accessor: 'client_name',
    },
    {
      Header: 'Brand',
      accessor: 'brand_name',
    },
    {
      Header: 'Merchant',
      accessor: 'merchant_name',
    },
    {
      Header: 'Location',
      accessor: 'location',
    },
    {
      Header: 'Redeemed by',
      accessor: 'Redeemed_by',
    },
    {
      Header: 'Redeemed date',
      accessor: 'redemption_ts',
    },
    {
      Header: 'Status',
      accessor: 'status',
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
    const receipts = this.state.data.list;

    return (
      <div>
        <div className='row'>
          <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
            <div>
              <ol className='breadcrumb'>
                <li className='breadcrumb-item active'>Receipt</li>
              </ol>
              <h1 className='page-header m-0'>Receipt Management</h1>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-xl-12 col-lg-12'>
            <div className='card mb-3'>
              <div className='card-body'>
                <ReactTable
                  data={receipts}
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
                        `/voucher-redemption/detail/${rowInfo.original.receipt_id}`
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

export default withRouter(VoucherRedemptionList);
