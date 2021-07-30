import React from 'react';

const PageWrapper = (props) => {
  return (
    <section>
      <div className='row'>
        <div className='col-12 d-flex justify-content-between align-items-end mb-2'>
          <div>
            <ol className='breadcrumb'>
              <li className='breadcrumb-item active'>{props.siteMapPath}</li>
            </ol>
            <h1 className='page-header m-0'>{props.heading}</h1>
          </div>
        </div>
      </div>

      {props.children}
    </section>
  );
};

export default PageWrapper;
