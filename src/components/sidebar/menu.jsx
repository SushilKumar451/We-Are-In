const Menu = [
  {
    path: '/dashboard',
    icon: 'fa fa-chart-pie',
    title: 'Dashboard',
    children: [
      { path: '/dashboard/v2', title: 'Revenue' },
      { path: '/dashboard/v3', title: 'Operational' },
    ],
  },
  {
    path: '/merchant',
    icon: 'fa fa-list-ol',
    title: 'Merchant Management',
    children: [
      { path: '/merchant/overview', title: 'Overview' },
      { path: '/merchant/clients', title: 'Client Management' },
      { path: '/merchant/brands', title: 'Brand Management' },
      { path: '/merchant/merchants', title: 'Merchant Management' },
    ],
  },
  {
    path: '/voucher',
    icon: 'fa fa-th',
    title: 'Voucher Profile',
    children: [
      { path: '/voucher/overview', title: 'Overview' },
      { path: '/voucher/list', title: 'Vouchers' },
      // { path: '/voucher/v3', title: 'List v3' },
    ],
  },

  {
    path: '/loyalty',
    icon: 'fa fa-star',
    title: 'Loyalty Management',
    children: [
      { path: '/loyalty/overview', title: 'Loyalty Programmes' },
      { path: '/loyalty/list', title: 'Programmes' },
    ],
  },
  {
    path: '/customer/list',
    icon: 'fa fa-cubes',
    title: 'Consumer Management',
  },
  {
    path: '/voucher-redemption',
    icon: 'fa fa-th',
    title: 'Voucher Redemption ',
    children: [
      { path: '/voucher-redemption/overview', title: 'Overview' },
      { path: '/voucher-redemption/list', title: 'Voucher Redemptions' },
    ],
  },
  {
    path: '/revenue',
    icon: 'fa fa-cubes',
    title: 'Revenue Management',
    children: [
      { path: '/revenue/overview', title: 'Overview' },
      { path: '/revenue/list', title: 'Revenues' },
    ],
  },
  {
    path: '/events',
    icon: 'fa fa-calendar-plus',
    title: 'Events',
    children: [
      { path: '/events/overview', title: 'Overview' },
      { path: '/events/list', title: 'Create Event' },
    ],
  },
  {
    path: '/wall',
    icon: 'fa fa-photo-video',
    title: 'Social Wall',
    children: [
      { path: '/wall/overview', title: 'Overview' },
      { path: '/wall/list', title: 'Create Post' },
    ],
  },
  {
    path: '/calendar',
    icon: 'fa fa-calendar',
    title: 'Social Calendar',
  },
  {
    path: '/form',
    icon: 'fa fa-cogs',
    title: 'Admin',
    children: [
      {
        path: '/admin/systemsetup/wizard',
        title: 'System Setup',
      },
      {
        path: '/admin/users',
        title: 'User Management',
      },
      {
        path: '/admin/permission/list',
        title: 'Permission Groups',
      },
      { path: '/admin/currency/list', title: 'Currency' },
      { path: '/admin/activitylogs/list', title: 'Activity Logs' },
      { path: '/admin/county/list', title: 'Country Management' },
      { path: '/admin/list/categories', title: 'Groups & Categories' },
      { path: '/admin/list/types', title: 'Groups & Types' },
      { path: '/admin/county/list', title: 'Country counties' },
    ],
  },
];

export default Menu;
