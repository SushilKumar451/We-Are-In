import React from 'react';
import { withRouter } from 'react-router';
import ReactTable from 'react-table';
import SweetAlert from 'react-bootstrap-sweetalert';
import service from '../../services/merchant-service';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';

class MerchantList extends React.Component {
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
      const response = await service.getMerchants();
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
      accessor: 'merchant_name',
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
    const merchants = this.state.data.list;

    return (
      <div>
        <div className='row'>
          <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
            <div>
              <ol className='breadcrumb'>
                <li className='breadcrumb-item active'>Merchant Management</li>
              </ol>
              <h1 className='page-header m-0'>Merchant Management</h1>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-xl-12 col-lg-12'>
            <div className='card mb-3'>
              <div className='card-body'>
                <ReactTable
                  data={merchants}
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
                        `/merchant/edit/${rowInfo.original.merchant_id}`
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

export default withRouter(MerchantList);
