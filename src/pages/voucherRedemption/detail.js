import React, { createRef } from 'react';
import { withRouter } from 'react-router-dom';
import Pdf from 'react-to-pdf';
import SweetAlert from 'react-bootstrap-sweetalert';
import voucherRedemptionService from '../../services/voucher-redemption-service';
import dateHelper from '../../utils/date/date.converter';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';

class VoucherRedemptionDetail extends React.Component {
  constructor(props) {
    super(props);
    this.divRef = createRef();
    this.state = {
      data: {
        to: null,
        from: null,
        invoice: null,
        task_description: null,
      },
      loading: false,
    };
  }

  timeOut = 1000;

  async componentDidMount() {
    try {
      this.setState({ loading: true });

      const response = await voucherRedemptionService.getReceipt(
        this.props.match.params.id
      );
      const data = response.data.receipt[0];

      this.setState({
        data,
      });
    } catch (error) {
      console.log(error);
      NotificationManager.error(
        'Error',
        'Could not retrieve subscription',
        this.timeOut
      );
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <div className='row'>
        <div class="col-12 d-flex justify-content-between align-items-end mb-2">
          <div>
            <ol class="breadcrumb">
              <li class="breadcrumb-item active">Voucher Redemptions</li>
            </ol>
            <h1 class="page-header m-0">Invoice</h1>
          </div>
          <Pdf
            targetRef={this.divRef}
            filename='invoice.pdf'
            options={{ orientation: 'landscape' }}
          >
            {({ toPdf }) => (
              <button className='btn btn-primary' onClick={toPdf}>
                <i className='fa fa-download'></i> Export pdf
              </button>
            )}
          </Pdf>
        </div>
        <div className='col-12'>
          <div className='card border-0 mb-3'>
            <div className='card-header bg-dark text-white'>
              <div className='row'>
                <div className='col-xl-4 pt-3'>
                  <em>From</em>
                  <p className='h1'>{this.state.data.from?.name}</p>
                  Address: <p className='h5'>{this.state.data.from?.address}</p>
                  Phone: <p className='h5'>{this.state.data.from?.Telephone}</p>
                  Fax: <p className='h5'>{this.state.data.from?.Fax}</p>
                </div>
                <div className='col-xl-4 pt-3'>
                  <em>To</em>
                  <p className='h1'>{this.state.data.to?.name}</p>
                  Email: <p className='h5'>{this.state.data.to?.email}</p>
                  Phone: <p className='h5'>{this.state.data.to?.Telephone}</p>
                  Fax: <p className='h5'>{this.state.data.from?.Fax}</p>
                </div>
                <div className='col-xl-4 pt-3'>
                  <em>Invoice</em>
                  <p className='h1'>
                    {this.state.data.invoice
                      ? dateHelper.friendlyDate(
                          this.state.data.invoice?.redemption_t
                        )
                      : null}
                  </p>
                  <p className='h3'>{`#${this.state.data.invoice?.receipt_id || ''}`}</p>
                  <p className='h3'>{this.state.data.invoice?.brand_name}</p>
                </div>
              </div>
            </div>
            <div className='card-body'>
              <div className='row'>
                <div ref={this.divRef} className='col-12'>
                  <h4 className='py-3'>TASK DESCRIPTION</h4>
                  <div className='pb-5'>
                    <div className='row'>
                      <div className='col-sm-6 col-lg-4'>
                        Merchant
                        <p className='h4'>{this.state.data.task_description?.merchant}</p>
                      </div>
                      <div className='col-sm-6 col-lg-4'>
                        Voucher name
                        <p className='h4'>
                          {this.state.data.task_description?.voucher_name}
                        </p>
                      </div>

                      <div className='col-12 pt-3'>
                        Voucher description
                        <p className='h4'>
                          {
                            this.state.data.task_description
                              ?.voucher_description
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className='m-0'>
                      * Make all cheques payable to{' '}
                      {this.state.data.from?.name}
                    </p>
                    <p className='m-0'>* Payment is due within 30 days</p>
                    <p className='m-0'>
                      * If you have any questions concerning this invoice,
                      contact
                      {` ${this.state.data.from?.name || ''} on ${
                        this.state.data.from?.Telephone || ''
                      }`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className='card-footer'>
              <div className=' d-flex justify-content-center'>
                <p className='m-0'>THANK YOU FOR YOUR BUSINESS</p>
              </div>
              <div className=' d-flex justify-content-center'>
                <p className='m-0'>
                  <span className='pr-2'>
                    <icon className='fas fa-globe' />{' '}
                    matiasgallipoli.com
                  </span>
                  <span className='pr-2'>
                    <icon className='fas fa-phone-volume' />{' '}
                    T:016-18192302
                  </span>
                  <span className='pr-2'>
                    <icon className='fas fa-envelope' />{' '}
                    rtiemps@gmail.com
                  </span>
                </p>
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

export default withRouter(VoucherRedemptionDetail);
