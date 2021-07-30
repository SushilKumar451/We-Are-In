import React from 'react';
import NVD3Chart from 'react-nvd3';
import Moment from 'moment';
import d3 from 'd3';
import SweetAlert from 'react-bootstrap-sweetalert';
import service from '../../services/voucher-redemption-service';
import { UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';

import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';

class VoucherRedemptionOverview extends React.Component {
  constructor(props) {
    super(props);

    this.getDate = (minusDate) => {
      var d = new Date();
      d = d.setDate(d.getDate() - minusDate);
      return d;
    };

    this.areaChartOptions = {
      pointSize: 0.5,
      useInteractiveGuideline: true,
      durection: 300,
      showControls: false,
      controlLabels: {
        stacked: 'Stacked',
      },
      yAxis: {
        tickFormat: d3.format(',.0f'),
      },
      xAxis: {
        tickFormat: function (d) {
          var monthsName = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ];
          d = new Date(d);
          d = monthsName[d.getMonth()] + ' ' + d.getDate();
          return d;
        },
      },
    };

    this.areaChartData = [
      {
        key: 'Receipt overview',
        color: '#00D5B4',
        values: [
          { x: this.getDate(77), y: 13 },
          { x: this.getDate(76), y: 13 },
          { x: this.getDate(75), y: 6 },
          { x: this.getDate(73), y: 6 },
          { x: this.getDate(72), y: 6 },
          { x: this.getDate(71), y: 5 },
          { x: this.getDate(70), y: 5 },
          { x: this.getDate(69), y: 5 },
          { x: this.getDate(68), y: 6 },
          { x: this.getDate(67), y: 7 },
          { x: this.getDate(66), y: 6 },
          { x: this.getDate(65), y: 9 },
          { x: this.getDate(64), y: 9 },
          { x: this.getDate(63), y: 8 },
          { x: this.getDate(62), y: 10 },
          { x: this.getDate(61), y: 10 },
          { x: this.getDate(60), y: 10 },
          { x: this.getDate(59), y: 10 },
          { x: this.getDate(58), y: 9 },
          { x: this.getDate(57), y: 9 },
          { x: this.getDate(56), y: 10 },
          { x: this.getDate(55), y: 9 },
          { x: this.getDate(54), y: 9 },
          { x: this.getDate(53), y: 8 },
          { x: this.getDate(52), y: 8 },
          { x: this.getDate(51), y: 8 },
          { x: this.getDate(50), y: 8 },
          { x: this.getDate(49), y: 8 },
          { x: this.getDate(48), y: 7 },
          { x: this.getDate(47), y: 7 },
          { x: this.getDate(46), y: 6 },
          { x: this.getDate(45), y: 6 },
          { x: this.getDate(44), y: 6 },
          { x: this.getDate(43), y: 6 },
          { x: this.getDate(42), y: 5 },
          { x: this.getDate(41), y: 5 },
          { x: this.getDate(40), y: 4 },
          { x: this.getDate(39), y: 4 },
          { x: this.getDate(38), y: 5 },
          { x: this.getDate(37), y: 5 },
          { x: this.getDate(36), y: 5 },
          { x: this.getDate(35), y: 7 },
          { x: this.getDate(34), y: 7 },
          { x: this.getDate(33), y: 7 },
          { x: this.getDate(32), y: 10 },
          { x: this.getDate(31), y: 9 },
          { x: this.getDate(30), y: 9 },
          { x: this.getDate(29), y: 10 },
          { x: this.getDate(28), y: 11 },
          { x: this.getDate(27), y: 11 },
          { x: this.getDate(26), y: 8 },
          { x: this.getDate(25), y: 8 },
          { x: this.getDate(24), y: 7 },
          { x: this.getDate(23), y: 8 },
          { x: this.getDate(22), y: 9 },
          { x: this.getDate(21), y: 8 },
          { x: this.getDate(20), y: 9 },
          { x: this.getDate(19), y: 10 },
          { x: this.getDate(18), y: 9 },
          { x: this.getDate(17), y: 10 },
          { x: this.getDate(16), y: 16 },
          { x: this.getDate(15), y: 17 },
          { x: this.getDate(14), y: 16 },
          { x: this.getDate(13), y: 17 },
          { x: this.getDate(12), y: 16 },
          { x: this.getDate(11), y: 15 },
          { x: this.getDate(10), y: 14 },
          { x: this.getDate(9), y: 24 },
          { x: this.getDate(8), y: 18 },
          { x: this.getDate(7), y: 15 },
          { x: this.getDate(6), y: 14 },
          { x: this.getDate(5), y: 16 },
          { x: this.getDate(4), y: 16 },
          { x: this.getDate(3), y: 17 },
          { x: this.getDate(2), y: 7 },
          { x: this.getDate(1), y: 7 },
          { x: this.getDate(0), y: 7 },
        ],
      },
    ];

    this.dateRange = {
      currentWeek:
        Moment().subtract('days', 7).format('D MMMM YYYY') +
        ' - ' +
        Moment().format('D MMMM YYYY'),
      prevWeek:
        Moment().subtract('days', 15).format('D MMMM') +
        ' - ' +
        Moment().subtract('days', 8).format('D MMMM YYYY'),
    };
  }

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

  mainLineChart = {
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

  state = {
    data: null,
    loading: false,
    lineChart: {
      options: {
        chart: {
          toolbar: {
            show: false,
          },
        },
        colors: ['rgba(21, 25, 26, 0.5)'],
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
          name: 'High - 2020',
          data: [28, 29, 29, 28, 28, 29, 28],
        },
      ],
    },
  };

  timeOut = 1000;

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const response = await service.getReceiptOverview();

      const data = response.data.receipt_overview[0];
      this.setState({ data });
    } catch (error) {
      NotificationManager.error('Error', 'Receipt overview', this.timeOut);
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { last_month, last_week, target } = this.state.data
      ? this.state.data
      : {
          last_month: null,
          last_week: null,
          target: null,
        };

    return (
      <div>
        <div className='row'>
          <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
            <div>
              <ol className='breadcrumb'>
                <li className='breadcrumb-item active'>Receipt</li>
              </ol>
              <h1 className='page-header m-0'>Receipt Overview</h1>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-12'>
            <div className='card border-0 mb-3'>
              <div className='card-body'>
                <div className='mb-3 text-grey'>
                  <b>RECEIPT </b>
                  <span className='ml-2'>
                    <i className='fa fa-info-circle' id='popover4'></i>
                    <UncontrolledPopover
                      trigger='hover'
                      placement='top'
                      target='popover4'
                    >
                      <PopoverHeader>
                        Top products with units sold
                      </PopoverHeader>
                      <PopoverBody>
                        Products with the most individual units sold. Includes
                        orders from all sales channels.
                      </PopoverBody>
                    </UncontrolledPopover>
                  </span>
                </div>
                <div className='row'>
                  <div className='col-xl-3 col-4'>
                    <h3 className='mb-1'>{last_month?.value}</h3>
                    <div>Last Month</div>
                  </div>
                  <div className='col-xl-3 col-4'>
                    <h3 className='mb-1'>{last_week?.value}</h3>
                    <div>Last Week</div>
                  </div>
                  <div className='col-xl-3 col-4'>
                    <h3 className='mb-1'>{target?.value}</h3>
                    <div>Target</div>
                  </div>
                </div>
              </div>
              <div className='card-body p-0'>
                <div style={{ height: '269px' }}>
                  <div
                    className='widget-chart-full-width nvd3-inverse-mode'
                    style={{ height: '254px' }}
                  >
                    <NVD3Chart
                      type='stackedAreaChart'
                      datum={this.areaChartData}
                      height={260}
                      options={this.areaChartOptions}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='col-xl-6'>
            <div className='card border-0 mb-3'>
              <div className='card-body px-0'>
                <div className='widget-chart-full-width nvd3-inverse-mode'>
                  <NVD3Chart
                    type='stackedAreaChart'
                    datum={this.areaChartData}
                    height={300}
                    options={this.areaChartOptions}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='col-xl-6'>
            <div className='card border-0 mb-3'>
              <div className='card-body'>
                <div className='widget-chart-full-width nvd3-inverse-mode'>
                  <NVD3Chart
                    datum={this.mainLineChart.data}
                    type='lineChart'
                    id='lineChart'
                    height='300'
                    options={this.mainLineChart.options}
                  />
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

export default VoucherRedemptionOverview;
