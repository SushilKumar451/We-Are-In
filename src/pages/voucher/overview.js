import React from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import SweetAlert from 'react-bootstrap-sweetalert';
import service from '../../services/voucher-service';
import countryISOResolver from '../../utils/flag/country.resolver';
import mapDataResolver from '../../utils/map/map-data.resolver';
import VMSDataMap from '../../components/datamap/datamap';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';

class VoucherOverview extends React.Component {
  state = {
    loading: true,
    overviewData: {
      live_vouchers: 0,
      vouchers_waiting_for_approval: 0,
      inactive_vouchers: 0,
      data: [],
    },
  };

  timeOut = 1000;

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const response = await service.getVoucherOverview();
      const overviewData = response.data.vouchers[0];
      this.setState({ overviewData });
    } catch (error) {
      console.log(error);
      NotificationManager.error(
        'Error',
        'Could not retrieve the data',
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  }

  reactTablecolumns = [
    {
      Header: ' ',
      id: 'flagKey',
      accessor: (d) => (
        <img
          src={`/assets/img/flag/16/${countryISOResolver.resolve(
            d.country_code
          )}.png`}
          alt={d.country}
        />
      ),
    },
    {
      Header: 'Country',
      accessor: 'country',
    },

    {
      Header: 'Vouchers',
      accessor: 'count',
    },
    {
      Header: 'Percentage',
      accessor: 'percentage',
    },
  ];

  render() {
    const {
      live_vouchers,
      vouchers_waiting_for_approval,
      inactive_vouchers,
      data,
    } = this.state.overviewData;

    return (
      <div>
        <div className='row'>
          <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
            <div>
              <ol className='breadcrumb'>
                <li className='breadcrumb-item active'>Voucher Profile</li>
              </ol>
              <h1 className='page-header m-0'>Voucher Overview</h1>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-xl-4 col-md-6'>
            <div className='widget widget-stats bg-dark'>
              <div className='stats-icon'>
                <i className='fa fa-desktop'></i>
              </div>
              <div className='stats-info'>
                <h4>LIVE VOUCHERS</h4>
                <p>{live_vouchers}</p>
              </div>
              <div className='stats-link'>
                <Link to=' '>{live_vouchers}</Link>
              </div>
            </div>
          </div>
          <div className='col-xl-4 col-md-6'>
            <div className='widget widget-stats bg-dark'>
              <div className='stats-icon'>
                <i className='fa fa-link'></i>
              </div>
              <div className='stats-info'>
                <h4>VOUCHERS AWAITING FOR APPROVAL</h4>
                <p>{vouchers_waiting_for_approval}</p>
              </div>
              <div className='stats-link'>
                <Link to=' '>{vouchers_waiting_for_approval} </Link>
              </div>
            </div>
          </div>
          <div className='col-xl-4 col-md-6'>
            <div className='widget widget-stats bg-dark'>
              <div className='stats-icon'>
                <i className='fa fa-users'></i>
              </div>
              <div className='stats-info'>
                <h4>INACTIVE VOUCHER</h4>
                <p> {inactive_vouchers}</p>
              </div>
              <div className='stats-link'>
                <Link to=' '>{inactive_vouchers}</Link>
              </div>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-xl-12 col-lg-12'>
            <div className='card border-0  mb-3'>
              <div className='card-body'>
                <div>Global Live Vouchers</div>
                <div className='row' style={{ minHeight: 300 }}>
                  <div className='col-xl-6 col-lg-5'>
                    <div className='card-body'>
                      <ReactTable
                        data={data}
                        columns={this.reactTablecolumns}
                        defaultPageSize={10}
                        showPageSizeOptions={true}
                        previousText='Prev'
                        nextText='Next'
                        minRows={0}
                        showPageJump={false}
                        resizable={false}
                        className='-striped'
                      />
                    </div>
                  </div>
                  <div className='col-xl-6 col-lg-5'>
                    <div
                      style={{
                        position: 'absolute',
                        height: '250px',
                        width: '500px',
                      }}
                    >
                      <VMSDataMap data={mapDataResolver.resolve(data)} />
                    </div>
                  </div>
                </div>
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

export default VoucherOverview;
