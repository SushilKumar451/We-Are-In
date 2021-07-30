import React from 'react';
import Datamap from 'react-datamaps';
import SweetAlert from 'react-bootstrap-sweetalert';
import service from '../../services/revenue-service';
import NVD3Chart from 'react-nvd3';
import d3 from 'd3';

import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';
import './revenue.bar.css';

class RevenueOverview extends React.Component {
  constructor(props) {
    super(props);
    this.getDate = (minusDate) => {
      var d = new Date();
      d = d.setDate(d.getDate() - minusDate);
      return d;
    };
  }

  state = {
    data: {
      growth: null,
      revenue: null,
      subscriptions: null,
      total_voucher_redeemed: null,
    },
    loading: false,
    lineChart: {
      options: {
        chart: {
          toolbar: {
            show: false,
          },
        },
        colors: ['#8A2BE2', '#7FFFD4'],
        xaxis: {
          show: false,
        },
        yaxis: {
          min: 20,
          max: 40,
          show: false,
        },
      },
      series: [
        {
          name: 'Steady - 2020',
          data: [25, 29, 24, 28, 28, 29, 28],
        },
        {
          name: 'Flexible - 2020',
          data: [29, 25, 30, 24, 29, 23, 29],
        },
      ],
    },
    revenue_by_location_data: [
      { id: 1, name: 'New York', value: 72 },
      { id: 2, name: 'San Francisco', value: 39 },
      { id: 3, name: 'Sydney', value: 25 },
      { id: 4, name: 'Singapore', value: 61 },
    ],
  };

  setLineChartData = () => {
    var sin = [],
      cos = [];
    for (var i = 0; i < 100; i++) {
      sin.push({ x: i, y: Math.sin(i / 10) });
      cos.push({ x: i, y: 0.5 * Math.cos(i / 10) });
    }
    return [
      { values: sin, key: 'Previous Week', color: '#00ACAC' },
      { values: cos, key: 'Current Week', color: '#348fe2' },
    ];
  };

  setBarChatData = () => {
    return [
      {
        key: 'Cumulative Return',
        values: [
          { label: 'Jan', value: 50, color: '#b6c2c9' },
          { label: 'Jan', value: 29, color: '#2d353c' },

          { label: 'Feb', value: 40, color: '#b6c2c9' },
          { label: 'Feb', value: 15, color: '#2d353c' },

          { label: 'Mar', value: 60, color: '#b6c2c9' },
          { label: 'Mar', value: 32, color: '#2d353c' },

          { label: 'Apr', value: 200, color: '#b6c2c9' },
          { label: 'Apr', value: 165, color: '#2d353c' },

          { label: 'May', value: 70, color: '#b6c2c9' },
          { label: 'May', value: 44, color: '#2d353c' },

          { label: 'Jun', value: 100, color: '#b6c2c9' },
          { label: 'Jun', value: 98, color: '#2d353c' },

          { label: 'Jul', value: 46, color: '#b6c2c9' },
          { label: 'Jul', value: 13, color: '#2d353c' },

          { label: 'Aug', value: 20, color: '#b6c2c9' },
          { label: 'Aug', value: 5, color: '#2d353c' },
        ],
      },
    ];
  };

  lineChart = {
    data: this.setLineChartData(),
    options: {
      yAxis: {
        tickFormat: d3.format(',.2f'),
      },
      xAxis: {
        tickFormat: d3.format(',.1f'),
      },
    },
  };

  barChart = {
    data: this.setBarChatData(),
  };

  timeOut = 1000;

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const response = await service.getRevenueOverview();

      const data = response.data.receipt_overview[0];
      this.setState({ data });
    } catch (error) {
      NotificationManager.error('Error', 'Revenue overview', this.timeOut);
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const {
      growth,
      revenue,
      subscriptions,
      total_voucher_redeemed,
    } = this.state.data;
    const { revenue_by_location_data } = this.state;
    return (
      <div>
        <div className='row'>
          <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
            <div>
              <ol className='breadcrumb'>
                <li className='breadcrumb-item active'>Revenue Overview</li>
              </ol>
              <h1 className='page-header m-0'>Revenue Overview</h1>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-xl-6'>
            <div className='card border-0 mb-3'>
              <div className='card-body'>
                <div className='row'>
                  <div className='col-xl-6'>
                    <div>
                      <div className='col-xl-12 rounded border pt-3'>
                        <h5>Voucher Redeemed</h5>
                        <p>Today :{total_voucher_redeemed?.today || 0}</p>
                        <p>Month :{total_voucher_redeemed?.month || 0}</p>
                        <p>Year :{total_voucher_redeemed?.year || 0}</p>
                      </div>

                      <div className='col-xl-12 rounded border pt-3 mt-2'>
                        <h5>Revenue</h5>
                        <p>Today : {revenue?.today || 0}</p>
                        <p>Month : {revenue?.month || 0}</p>
                        <p>Year : {revenue?.year || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className='col-xl-6'>
                    <div>
                      <div className='col-xl-12 rounded border pt-3'>
                        <h5>Subscriptions</h5>
                        <p>Today : {subscriptions?.today || 0}</p>
                        <p>Month : {subscriptions?.month || 0}</p>
                        <p>Year : {subscriptions?.year || 0}</p>
                      </div>

                      <div className='col-xl-12  rounded border pt-3 mt-2'>
                        <h5>Growth</h5>
                        <p>Today : {growth?.today || 0}</p>
                        <p>Month : {growth?.month || 0}</p>
                        <p>Year : {growth?.year || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='col-xl-6'>
            <div className='card border-0 mb-3'>
              <div className='card-body'>
                <div className='col-xl-12'>
                  <h5>PROJECTIONS VS ACTUALS</h5>
                  <div className='revenue'>
                    <NVD3Chart
                      datum={this.barChart.data}
                      type='discreteBarChart'
                      id='barChart'
                      height='270'
                      x='label'
                      y='value'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-xl-6'>
            <div className='card border-0 mb-3'>
              <div className='card-body'>
                <div className='col-xl-10'>
                  <h5>REVENUE </h5>
                  <NVD3Chart
                    datum={this.lineChart.data}
                    type='lineChart'
                    id='lineChart'
                    height='300'
                    options={this.lineChart.options}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='col-xl-6'>
            <div className='card border-0  mb-3'>
              <div className='card-body'>
                <div className='col-xl-12'>
                  <h5>REVENUE BY LOCATION</h5>
                  <div className='row'>
                    <div className='col-xl-6 mb-4 '>
                      <Datamap />
                    </div>
                    <div className='col-xl-5 offset-md-1'>
                      <div className='col-xl-12 rounded border m-3 pt-2'>
                        <p>Active Users</p>
                        <h3>644</h3>
                      </div>
                      <div className='col-xl-12 rounded border m-3 pt-2'>
                        <p>Vouchers Redemptions Per Minute</p>
                        <h3>276</h3>
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-xl-6'>
                      {revenue_by_location_data.map((x) => (
                        <div
                          key={x.id}
                          className='progress rounded-corner m-b-15'
                        >
                          <div
                            className='progress-bar bg-purple progress-bar-striped progress-bar-animated'
                            style={{ width: `${x.value}%` }}
                          >
                            {x.name} : {x.value}k
                          </div>
                        </div>
                      ))}
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

export default RevenueOverview;
