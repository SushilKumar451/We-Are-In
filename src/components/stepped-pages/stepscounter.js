import React from 'react';

const StepsCounter = (props) => {
  let colWidth =
    12 / (props.steps && props.steps.length > 0 ? props.steps.length : 1);

  const selectBgColor = (step) => {
    let bgColor = '#bbb';
    if (props.activeStep === step) {
      bgColor = 'linear-gradient(45deg, #75d4e8, #01d4b4, #0177a9)';
    }
    if (props.isStepCompleted(step)) {
      bgColor = 'green';
    }
    return bgColor;
  };

  return (
    <React.Fragment>
      <div className='row'>
        {props.steps
          ? props.steps.map((step, i) => {
              return (
                <div className={`col-${colWidth} m-0 p-0`}>
                  <div className='row m-0 p-0 align-items-center justify-content-center'>
                    <div className='col-4 col-md-5 m-0 p-0'>
                      {i > 0 ? <hr className='my-0' /> : null}
                    </div>
                    <div className='col-4 col-md-2 m-0 p-0'>
                      <div
                        style={
                          props.style
                            ? props.style
                            : {
                                fontSize: '15pt',
                                borderWidth: '1px',
                                borderRadius: '30px',
                                padding: '0.35rem',
                                textAlign: 'center',
                                color: '#fff',
                                borderColor: '#bbb',
                                backgroundColor: selectBgColor(step),
                                backgroundImage: selectBgColor(step),
                              }
                        }
                      >
                        {props.isStepCompleted(step) ? (
                          <i className='fa fa-check text-white'></i>
                        ) : (
                          step
                        )}
                      </div>
                    </div>
                    <div className='col-4 col-md-5 m-0 p-0'>
                      {i < props.steps.length - 1 ? (
                        <hr className='my-0' />
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })
          : null}
      </div>
      <div className='row my-2'>
        {props.stepLabels
          ? props.stepLabels.map((label, i) => {
              return (
                <div className={`col-${colWidth} h6 m-0 p-0 text-center`}>
                  {label}
                </div>
              );
            })
          : null}
      </div>
    </React.Fragment>
  );
};

export default StepsCounter;
