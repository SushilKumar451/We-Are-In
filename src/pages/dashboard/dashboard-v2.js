import React from 'react';
import ReactTable from 'react-table';
// import { Link } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';
import NVD3Chart from 'react-nvd3';
import d3 from 'd3';
import { UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
import { Doughnut } from 'react-chartjs-2';

class DashboardV2 extends React.Component {
  constructor(props) {
    super(props);

    this.formatDate = (d) => {
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
    };
    this.getDate = (minusDate) => {
      var d = new Date();
      d = d.setDate(d.getDate() - minusDate);
      return d;
    };

    this.donutChartOptions = {
      donut: true,
      showLegend: false,
      growOnHover: false,
      arcsRadius: [
        { inner: 0.65, outer: 0.93 },
        { inner: 0.6, outer: 1 },
      ],
      margin: { left: 10, right: 10, top: 10, bottom: 10 },
      donutRatio: 0.5,
      labelFormat: d3.format(',.0f'),
    };
    this.donutChartData = [
      { label: 'Return Visitors', value: 784466, color: '#348fe2' },
      { label: 'New Visitors', value: 416747, color: '#00ACAC' },
    ];

    this.areaChartOptions = {
      pointSize: 0.5,
      useInteractiveGuideline: true,
      durection: 300,
      showControls: false,
      controlLabels: {
        stacked: 'Stacked'
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
        color: 'rgba(21, 25, 26,.9)',
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
      {
        key: 'Page Views',
        color: 'rgba(0,213,180,.9)',
        values: [
          { x: this.getDate(77), y: 14 },
          { x: this.getDate(76), y: 13 },
          { x: this.getDate(75), y: 15 },
          { x: this.getDate(73), y: 14 },
          { x: this.getDate(72), y: 13 },
          { x: this.getDate(71), y: 15 },
          { x: this.getDate(70), y: 16 },
          { x: this.getDate(69), y: 16 },
          { x: this.getDate(68), y: 14 },
          { x: this.getDate(67), y: 14 },
          { x: this.getDate(66), y: 13 },
          { x: this.getDate(65), y: 12 },
          { x: this.getDate(64), y: 13 },
          { x: this.getDate(63), y: 13 },
          { x: this.getDate(62), y: 15 },
          { x: this.getDate(61), y: 16 },
          { x: this.getDate(60), y: 16 },
          { x: this.getDate(59), y: 17 },
          { x: this.getDate(58), y: 17 },
          { x: this.getDate(57), y: 18 },
          { x: this.getDate(56), y: 15 },
          { x: this.getDate(55), y: 15 },
          { x: this.getDate(54), y: 15 },
          { x: this.getDate(53), y: 19 },
          { x: this.getDate(52), y: 19 },
          { x: this.getDate(51), y: 18 },
          { x: this.getDate(50), y: 18 },
          { x: this.getDate(49), y: 17 },
          { x: this.getDate(48), y: 16 },
          { x: this.getDate(47), y: 18 },
          { x: this.getDate(46), y: 18 },
          { x: this.getDate(45), y: 18 },
          { x: this.getDate(44), y: 16 },
          { x: this.getDate(43), y: 14 },
          { x: this.getDate(42), y: 14 },
          { x: this.getDate(41), y: 13 },
          { x: this.getDate(40), y: 14 },
          { x: this.getDate(39), y: 13 },
          { x: this.getDate(38), y: 10 },
          { x: this.getDate(37), y: 9 },
          { x: this.getDate(36), y: 10 },
          { x: this.getDate(35), y: 11 },
          { x: this.getDate(34), y: 11 },
          { x: this.getDate(33), y: 11 },
          { x: this.getDate(32), y: 10 },
          { x: this.getDate(31), y: 9 },
          { x: this.getDate(30), y: 10 },
          { x: this.getDate(29), y: 13 },
          { x: this.getDate(28), y: 14 },
          { x: this.getDate(27), y: 14 },
          { x: this.getDate(26), y: 13 },
          { x: this.getDate(25), y: 12 },
          { x: this.getDate(24), y: 11 },
          { x: this.getDate(23), y: 13 },
          { x: this.getDate(22), y: 13 },
          { x: this.getDate(21), y: 13 },
          { x: this.getDate(20), y: 13 },
          { x: this.getDate(19), y: 14 },
          { x: this.getDate(18), y: 13 },
          { x: this.getDate(17), y: 13 },
          { x: this.getDate(16), y: 19 },
          { x: this.getDate(15), y: 21 },
          { x: this.getDate(14), y: 22 },
          { x: this.getDate(13), y: 25 },
          { x: this.getDate(12), y: 24 },
          { x: this.getDate(11), y: 24 },
          { x: this.getDate(10), y: 22 },
          { x: this.getDate(9), y: 16 },
          { x: this.getDate(8), y: 15 },
          { x: this.getDate(7), y: 12 },
          { x: this.getDate(6), y: 12 },
          { x: this.getDate(5), y: 15 },
          { x: this.getDate(4), y: 15 },
          { x: this.getDate(3), y: 15 },
          { x: this.getDate(2), y: 18 },
          { x: this.getDate(2), y: 18 },
          { x: this.getDate(0), y: 17 },
        ],
      },
    ];

    this.doughnutChart = {
      data: {
        labels: ['Series 1', 'Series 2'],
        datasets: [
          {
            data: [300, 50],
            backgroundColor: [
              'rgba(0,213,180,.8)',
              'rgba(21, 25, 26,.6)',
            ],
            borderColor: ['white'],
            borderWidth: 0,
            label: 'My dataset',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          align: 'end',
          labels: {
            boxWidth: 6,
            usePointStyle: true,
            fontColor: '#333',
            fontFamily: 'Cabin, sans-serif',
            fontStyle: 'bold'
          },
        },
      },
    };

    this.map = {
      center: {
        lat: 59.95,
        lng: 30.33,
      },
      zoom: 9,
    };
    this.date = new Date();

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
        ],
        datasets: [
          {
            label: 'Dataset 1',
            borderWidth: 0,
            borderColor: '#727cb6',
            backgroundColor: 'rgba(0,213,180,.8)',
            data: [
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
            ],
          },
          {
            label: 'Dataset 2',
            borderWidth: 0,
            borderColor: '#2d353c',
            backgroundColor: 'rgba(0,213,180,.8)',
            data: [
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
            right: 115,
            bottom: 4,
            left: 10,
          },
        },
      },
    };

    this.reactTabledata = [
      {
        country: 'USA',
        revenue: 4.977,
        userActivity: [1, 3, 5, 7, 8, 9],
        subscription: 1.34,
        package: [7, 5],
      },
      {
        country: 'Australia',
        revenue: 2.02,
        userActivity: [1, 3, 5, 8, 9],
        subscription: 7.34,
        package: [9, 5],
      },
      {
        country: 'India',
        revenue: 4.7,
        userActivity: [1, 3, 5, 7, 8, 9],
        subscription: 4.34,
        package: [7, 1],
      },
      {
        country: 'Brazil',
        revenue: 3.3,
        userActivity: [7, 8, 9, 4, 1, 8],
        subscription: 2.22,
        package: [1, 2],
      },
      {
        country: 'Turkey',
        revenue: 3.22,
        userActivity: [1, 3, 3, 4, 5, 7],
        subscription: 4.34,
        package: [2, 5],
      },
      {
        country: 'Canada',
        revenue: 2.57,
        userActivity: [1, 3, 5, 7, 85, 1],
        subscription: 3.55,
        package: [7, 5],
      },
    ];

    this.reactTablecolumns = [
      {
        Header: 'Country',
        accessor: 'country',
      },
      {
        Header: 'Revenue',
        accessor: 'revenue',
      },
      {
        Header: 'User Activity',
        accessor: 'userActivity',
      },
      {
        Header: 'Subscription',
        accessor: 'subscription',
      },
      {
        Header: 'Package',
        accessor: 'package',
      },
    ];
  }

  render() {
    return (
      <div>
        {/*<ol className='breadcrumb float-xl-right'>
          <li className='breadcrumb-item'>
            <Link to='/dashboard/v2'>Home</Link>
          </li>
          <li className='breadcrumb-item'>
            <Link to='/dashboard/v2'>Dashboard</Link>
          </li>
          <li className='breadcrumb-item active'>Dashboard v2</li>
        </ol>
        <h1 className='page-header'>Dashboard v2</h1>*/}
        <div className='row'>
          <div className='col-xl-12 col-lg-6'>
            <div className='card border-0 mb-3'>
              <div className='card-body'>
                <div className='mb-3 text-grey'>
                  <b>VISITORS ANALYTICS</b>
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
        <div className='row'>
          <div className='col-xl-4 col-lg-6'>
            <div className='card border-0 mb-3'>
              <div className='card-body'>
                <b className='mb-3 text-uppercase text-grey'>Revenue - Subscriptions</b>
                <div className='mb-3' style={{ height: '235px' }}>
                  <Doughnut
                    data={this.doughnutChart.data}
                    options={this.doughnutChart.options}
                  />
                </div>
                <div className='row'>
                  <div className='col-6 my-3 d-flex justify-content-center align-content-center'>
                    <div>
                      <p className='text-uppercase font-weight-bold m-0'>Revenue</p>
                      <p className='h1 font-weight-bold text-primary m-0'>$37,258</p>
                      <div className='text-grey f-s-11 text-truncate'>
                        <i className='fa fa-caret-up'></i> 5.33% from previous 7
                        days
                      </div>
                    </div>
                    {/*<Bar
                      width={25}
                      height={20}
                      data={this.barChart.data}
                      options={this.barChart.options}
                    />*/}
                  </div>
                  <div className='col-6 my-3 d-flex justify-content-center align-content-center'>
                    <div>
                      <p className='text-uppercase font-weight-bold m-0'>Subscription</p>
                      <p className='h1 font-weight-bold text-secondary m-0'>27%</p>
                      <div className='text-grey f-s-11 text-truncate'>
                        <i className='fa fa-caret-up'></i> 5.33% from previous 7
                        days
                      </div>
                    </div>
                    {/*<Bar
                      width={25}
                      height={20}
                      data={this.barChart.data}
                      options={this.barChart.options}
                    />*/}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-xl-8 col-lg-6'>
            <div className='card border-0 mb-3'>
              <div className='card-body'>
                <div className='mb-2 text-grey'>
                  <b className='text-uppercase'>Bird's Eye</b>
                  <span className='ml-2'>
                    <i className='fa fa-info-circle' id='popover5'></i>
                    <UncontrolledPopover
                      trigger='hover'
                      placement='top'
                      target='popover5'
                    >
                      <PopoverHeader>Total sales</PopoverHeader>
                      <PopoverBody>
                        Net sales (gross sales minus discounts and returns) plus
                        taxes and shipping. Includes orders from all sales
                        channels.
                      </PopoverBody>
                    </UncontrolledPopover>
                  </span>
                </div>
                <div className='bg-black mb-3' style={{ height: '206px' }}>
                  <GoogleMapReact
                    bootstrapURLKeys={{ key: "AIzaSyCkMtlwwq0Kaamk2y1QK4RLmPy0bgu7x44" }}
                    defaultCenter={this.map.center}
                    defaultZoom={this.map.zoom}
                  ></GoogleMapReact>
                </div>

                <div>
                  <ReactTable
                    data={this.reactTabledata}
                    columns={this.reactTablecolumns}
                    defaultPageSize={2}
                    showPageSizeOptions={false}
                    previousText='Prev'
                    nextText='Next'
                    showPageJump={false}
                    resizable={false}
                    className='-highlight'
                  />
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
