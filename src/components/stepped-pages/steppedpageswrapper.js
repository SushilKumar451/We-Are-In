import React from 'react';
import StepsCounter from './stepscounter';
import FooterWrapper from '../footer-wrapper/footerwrapper';
import Button from '../form-group/button';

const SteppedPagesWrapper = (props) => {
  return (
    <section>
      <div className='my-4'>
        <StepsCounter
          steps={props.steps}
          stepLabels={props.stepLabels}
          activeStep={props.currentStep}
          isStepCompleted={props.isStepCompleted}
        />
      </div>

      {/*<div> {props.stepHeading} </div>*/}

      {props.children}

      {props.includeFooter ? (
        <FooterWrapper classes="mt-4 px-3 border-0">
          {props.footer ? props.footer : null}
          {props.includePrevNext ? (
            <div className='row'>
              <div className='col-6'>
                <Button
                  className='btn btn-lg btn-white'
                  onClick={props.previousCallback}
                >
                  Previous
                </Button>
              </div>
              <div className='col-6 text-right'>
                {props.currentStep === props.totalSteps ? (
                  props.submit
                ) : (
                  <Button
                    className='btn btn-lg btn-primary'
                    onClick={props.nextCallback}
                  >
                    Next <i className="fa fa-arrow-right"></i>
                  </Button>
                )}
              </div>
            </div>
          ) : null}
        </FooterWrapper>
      ) : null}
    </section>
  );
};

export default SteppedPagesWrapper;
