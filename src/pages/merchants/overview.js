import React from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import SweetAlert from 'react-bootstrap-sweetalert';
import service from '../../services/merchant-service';
// import countryISOResolver from '../../utils/flag/country.resolver';
import mapDataResolver from '../../utils/map/map-data.resolver';
import VMSDataMap from '../../components/datamap/datamap';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';

class MerchantOverview extends React.Component {
  state = {
    data: {
      overviewData: null,
    },
    loading: false,
  };

  timeOut = 1000;

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const response = await service.getMerchantOverview();
      const result = response.data[0];

      this.setState({ data: { overviewData: result } });
    } catch (error) {
      NotificationManager.error('Error', 'Merchant overview', this.timeOut);
    } finally {
      this.setState({ loading: false });
    }
  }

  reactTablecolumns = [
    {
      Header: ' ',
      id: 'flagKey',
      // accessor: (d) => (
      //   <img
      //     src={`/assets/img/flag/16/${countryISOResolver.resolve(
      //       d.country_code
      //     )}.png`}
      //     alt={d.country}
      //   />
      // ),
    },
    {
      Header: 'Country',
      accessor: 'country',
    },
    {
      Header: 'Percentage',
      accessor: 'percentage',
    },
  ];

  render() {
    const { total_brands, total_clients, total_merchants, data } = this.state
      .data.overviewData
      ? this.state.data.overviewData
      : {
          total_brands: null,
          total_clients: null,
          total_merchants: null,
          data: [],
        };

    return (
      <div>
        <div className='row'>
          <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
            <div>
              <ol className='breadcrumb'>
                <li className='breadcrumb-item active'>Merchant Management</li>
              </ol>
              <h1 className='page-header m-0'>Merchant Overview</h1>
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
                <h4>CLIENT</h4>
                <p>{total_clients}</p>
              </div>
              <div className='stats-link'>
                <Link to=' '>{total_clients}</Link>
              </div>
            </div>
          </div>
          <div className='col-xl-4 col-md-6'>
            <div className='widget widget-stats bg-dark'>
              <div className='stats-icon'>
                <i className='fa fa-link'></i>
              </div>
              <div className='stats-info'>
                <h4>BRANDS</h4>
                <p>{total_brands}</p>
              </div>
              <div className='stats-link'>
                <Link to=' '>{total_brands} </Link>
              </div>
            </div>
          </div>
          <div className='col-xl-4 col-md-6'>
            <div className='widget widget-stats bg-dark'>
              <div className='stats-icon'>
                <i className='fa fa-users'></i>
              </div>
              <div className='stats-info'>
                <h4>MERCHANTS</h4>
                <p> {total_merchants}</p>
              </div>
              <div className='stats-link'>
                <Link to=' '>{total_merchants}</Link>
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

        <div className='row'>
          <div className='col-xl-12 col-lg-12'>
            <div className='card border-0  mb-3'>
              <div className='card-body'>
                <div>Global Live Merchants</div>
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
        <NotificationContainer />
      </div>
    );
  }
}

export default MerchantOverview;
