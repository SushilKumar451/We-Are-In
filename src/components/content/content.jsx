import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import routes from './../../config/page-route.jsx';
import { PageSettings } from './../../config/page-settings.js';

function setTitle(path, routeArray) {
  var pageTitle;
  for (var i = 0; i < routeArray.length; i++) {
    if (routeArray[i].path === path) {
      pageTitle = 'VMS Admin  | ' + routeArray[i].title;
    }
  }
  document.title = pageTitle ? pageTitle : 'VMS application';
}

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.props.history.listen(() => {
      setTitle(this.props.history.location.pathname, routes);
    });
  }

  componentDidMount() {
    setTitle(this.props.history.location.pathname, routes);
  }

  render() {
    return (
      <PageSettings.Consumer>
        {({
          pageContentFullWidth,
          pageContentClass,
          pageContentInverseMode,
        }) => (
          <div
            className={
              'content ' +
              (pageContentFullWidth ? 'content-full-width ' : '') +
              (pageContentInverseMode ? 'content-inverse-mode ' : '') +
              pageContentClass
            }
          >
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={route.component}
              />
            ))}
          </div>
        )}
      </PageSettings.Consumer>
    );
  }
}

export default withRouter(Content);
