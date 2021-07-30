import React from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import SweetAlert from 'react-bootstrap-sweetalert';
import service from '../../services/loyalty-service';
import countryISOResolver from '../../utils/flag/country.resolver';
import mapDataResolver from '../../utils/map/map-data.resolver';
import VMSDataMap from '../../components/datamap/datamap';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';

class LoyaltyOverview extends React.Component {
  state = {
    loading: true,
    overviewData: {
      live_loyalty_programmes: 0,
      awaiting_approval_loyalty_programmes: 0,
      archived_loyalty_programmes: 0,
      loyalty_count_by_country: [],
    },
  };

  timeOut = 1000;

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const response = await service.getLoyaltyOverview();

      const overviewData = response.data.loyalties[0];
      this.setState({
        overviewData,
      });
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
      Header: 'Loyalties',
      accessor: 'count',
    },
    {
      Header: 'Percentage',
      accessor: 'percentage',
    },
  ];

  render() {
    const {
      live_loyalty_programmes,
      awaiting_approval_loyalty_programmes,
      archived_loyalty_programmes,
      loyalty_count_by_country,
    } = this.state.overviewData;

    return (
      <div>
        <div className='row'>
          <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
            <div>
              <ol className='breadcrumb'>
                <li className='breadcrumb-item active'>Loyalty Management</li>
              </ol>
              <h1 className='page-header m-0'>Loyalty Overview</h1>
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
                <h4>LIVE PROGRAMMES</h4>
                <p>{live_loyalty_programmes}</p>
              </div>
              <div className='stats-link'>
                <Link to=' '>{live_loyalty_programmes}</Link>
              </div>
            </div>
          </div>
          <div className='col-xl-4 col-md-6'>
            <div className='widget widget-stats bg-dark'>
              <div className='stats-icon'>
                <i className='fa fa-link'></i>
              </div>
              <div className='stats-info'>
                <h4>LOYALTIES AWAITING FOR APPROVAL</h4>
                <p>{awaiting_approval_loyalty_programmes}</p>
              </div>
              <div className='stats-link'>
                <Link to=' '>{awaiting_approval_loyalty_programmes} </Link>
              </div>
            </div>
          </div>
          <div className='col-xl-4 col-md-6'>
            <div className='widget widget-stats bg-dark'>
              <div className='stats-icon'>
                <i className='fa fa-users'></i>
              </div>
              <div className='stats-info'>
                <h4>INACTIVE PROGRAMMES</h4>
                <p> {archived_loyalty_programmes}</p>
              </div>
              <div className='stats-link'>
                <Link to=' '>{archived_loyalty_programmes}</Link>
              </div>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-xl-12 col-lg-12'>
            <div className='card border-0  mb-3'>
              <div className='card-body'>
                <div>Global Live Loyalties</div>
                <div className='row' style={{ minHeight: 300 }}>
                  <div className='col-xl-6 col-lg-5'>
                    <div className='card-body'>
                      <ReactTable
                        data={loyalty_count_by_country}
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
                      <VMSDataMap
                        data={mapDataResolver.resolve(loyalty_count_by_country)}
                      />
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

export default LoyaltyOverview;
