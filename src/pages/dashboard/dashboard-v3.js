import React from 'react';
// import { Link } from 'react-router-dom';
import { PieChart } from 'react-minimal-pie-chart';
import NVD3Chart from 'react-nvd3';
import d3 from 'd3';
import { UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
import { Bar } from 'react-chartjs-2';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import Moment from 'moment';

class DashboardV2 extends React.Component {
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
        key: 'Unique Visitors',
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

    var randomScalingFactor = function () {
      return Math.round(Math.random() * 100);
    };

    this.barChart = {
      data: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
        ],
        datasets: [
          {
            label: 'Dataset 1',
            borderWidth: 0,
            backgroundColor: '#00D5B4',
            data: [
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        axis: { defaultFontSize: 0 },
        scales: {
          yAxes: [
            {
              display: false,
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
          xAxes: [
            {
              display: false,
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
        },
        layout: {
          padding: {
            top: 45,
            left: 45,
            right: 45,
            bottom: 15
          }
        },
      },
    };

    this.handleDateApplyEvent = (event, picker) => {
      var startDate = picker.startDate;
      var endDate = picker.endDate;
      var gap = endDate.diff(startDate, 'days');

      var currentWeek =
        startDate.format('D MMMM YYYY') + ' - ' + endDate.format('D MMMM YYYY');
      var prevWeek =
        Moment(startDate).subtract('days', gap).format('D MMMM') +
        ' - ' +
        Moment(startDate).subtract('days', 1).format('D MMMM YYYY');

      this.dateRange.currentWeek = currentWeek;
      this.dateRange.prevWeek = prevWeek;

      this.setState((dateRange) => ({
        currentWeek: currentWeek,
        prevWeek: prevWeek,
      }));
    };
  }

  render() {
    return (
      <div>
        {/* <ol className='breadcrumb float-xl-right'>
          <li className='breadcrumb-item'>
            <Link to='/dashboard/v3'>Home</Link>
          </li>
          <li className='breadcrumb-item'>
            <Link to='/dashboard/v3'>Dashboard</Link>
          </li>
          <li className='breadcrumb-item active'>Dashboard v3</li>
        </ol>
        <h1 className='page-header mb-3'>Dashboard v3</h1> */}
        <div className='d-sm-flex align-items-center mb-3'>
          <DateRangePicker
            startDate={this.startDate}
            endDate={this.endDate}
            onApply={this.handleDateApplyEvent}
          >
            <button className='btn btn-inverse mr-2 text-truncate'>
              <i className='fa fa-calendar fa-fw text-white-transparent-5 ml-n1'></i>
              <span>{this.dateRange.currentWeek}</span>
              <b className='caret'></b>
            </button>
          </DateRangePicker>
          <div className='text-muted f-w-600 mt-2 mt-sm-0'>
            compared to <span>{this.dateRange.prevWeek}</span>
          </div>
        </div>
        <div className='row'>
          <div className='col-xl-4 col-lg-6'>
            <div className='card border-0 mb-3'>
              <div className='card-body text-grey'>
                <b className='text-uppercase mb-2'>Average Daily Subscriptions</b>
                <PieChart
                  className='mt-4'
                  style={{ height: '200px' }}
                  data={[{ title: 'Three', value: 82, color: '#00D5B4' }]}
                  lineWidth='15'
                  totalValue={100}
                  height='60'
                  animate={true}
                  animationDuration={200}
                  label={() => '374'}
                  labelStyle={{
                    fontSize: '14pt',
                    fontFamily: 'Cabin, sans-serif',
                    fill: '#00D5B4',
                  }}
                  labelPosition={0}
                />
                <div className='row'>
                  <div className='col-12 px-5'>
                    <Bar
                      height={100}
                      data={this.barChart.data}
                      options={this.barChart.options}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-xl-4 col-lg-6'>
            <div className='card border-0 mb-3'>
              <div className='card-body text-grey'>
                <b className='text-uppercase mb-2'>Average Weekly Subscriptions</b>
                <PieChart
                  className='mt-4'
                  style={{ height: '200px' }}
                  data={[{ title: 'Three', value: 92, color: '#00D5B4' }]}
                  lineWidth='15'
                  totalValue={100}
                  height='60'
                  animate={true}
                  animationDuration={200}
                  label={() => '11,220'}
                  labelStyle={{
                    fontSize: '14pt',
                    fontFamily: 'Cabin, sans-serif',
                    fill: '#00D5B4',
                  }}
                  labelPosition={0}
                />
                <div className='row'>
                  <div className='col-12 px-5'>
                    <Bar
                      height={100}
                      data={this.barChart.data}
                      options={this.barChart.options}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-xl-4 col-lg-6'>
            <div className='card border-0 mb-3'>
              <div className='card-body text-grey'>
                <b className='text-uppercase mb-2'>Average Monthly Subscriptions</b>
                <PieChart
                  className='mt-4'
                  style={{ height: '200px' }}
                  data={[{ title: 'Three', value: 72, color: '#00D5B4' }]}
                  lineWidth='15'
                  totalValue={100}
                  height='60'
                  animate={true}
                  animationDuration={200}
                  label={() => '44,880'}
                  labelStyle={{
                    fontSize: '14pt',
                    fontFamily: 'Cabin, sans-serif',
                    fill: '#00D5B4',
                  }}
                  labelPosition={0}
                />
                <div className='row'>
                  <div className='col-12 px-5'>
                    <Bar
                      height={100}
                      data={this.barChart.data}
                      options={this.barChart.options}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-xl-12 col-lg-6'>
            <div className='card border-0 mb-3'>
              <div className='card-body'>
                <div className='mb-3 text-grey'>
                  <b>VOUCHERS REDEEMED</b>
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
                    <h3 className='mb-1'>127.1K</h3>
                    <div>New Visitors</div>
                    <div className='text-grey f-s-11 text-truncate'>
                      <i className='fa fa-caret-up'></i> 25.5% from previous 7
                      days
                    </div>
                  </div>
                  <div className='col-xl-3 col-4'>
                    <h3 className='mb-1'>179.9K</h3>
                    <div>Returning Visitors</div>
                    <div className='text-grey f-s-11 text-truncate'>
                      <i className='fa fa-caret-up'></i> 5.33% from previous 7
                      days
                    </div>
                  </div>
                  <div className='col-xl-3 col-4'>
                    <h3 className='mb-1'>766.8K</h3>
                    <div>Total Page Views</div>
                    <div className='text-grey f-s-11 text-truncate'>
                      <i className='fa fa-caret-up'></i> 0.323% from previous 7
                      days
                    </div>
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
        </div>
      </div>
    );
  }
}

export default DashboardV2;
