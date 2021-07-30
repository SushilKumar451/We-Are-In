import React from 'react';
import { Link } from 'react-router-dom';
// import DropdownNotification from './dropdown/notification.jsx';
import DropdownLanguage from './dropdown/language.jsx';
import DropdownProfile from './dropdown/profile.jsx';
import SearchForm from './search/form.jsx';
import DropdownMegaMenu from './dropdown/mega.jsx';

import { PageSettings } from './../../config/page-settings.js';

// import { ReactComponent as Logo } from './../../assets/img/in-logo-header.svg';

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.toggleMegaMenu = this.toggleMegaMenu.bind(this);
		this.state = { collapseMegaMenu: false };
	}

	toggleMegaMenu() {
		this.setState({ collapseMegaMenu: !this.state.collapseMegaMenu });
	}
	render() {
		return (
			<PageSettings.Consumer>
				{({toggleMobileSidebar, toggleRightSidebar, toggleMobileRightSidebar,toggleMobileTopMenu, pageHeaderLanguageBar, pageHeaderMegaMenu, pageTwoSidebar, pageTopMenu, pageSidebar}) => (
					<div id="header" className="header navbar-default">
						<div className="navbar-header">
							{pageTwoSidebar && (
								<button type="button" className="navbar-toggle" onClick={toggleMobileRightSidebar}>
									<span className="icon-bar text-dark"></span>
									<span className="icon-bar text-dark"></span>
									<span className="icon-bar text-dark"></span>
								</button>
							)}
							{/*<Link to="/" className="navbar-brand"><Logo style={{width:'150px'}}/></Link>*/}
							
							{pageHeaderMegaMenu && (
								<button type="button" className="navbar-toggle pt-0 pb-0 mr-0" onClick={this.toggleMegaMenu}>
									<span className="fa-stack fa-lg text-inverse">
										<i className="far fa-square fa-stack-2x"></i>
										<i className="fa fa-cog fa-stack-1x"></i>
									</span>
								</button>
							)}
							{pageTopMenu && pageSidebar && (
							<button type="button" className="navbar-toggle pt-0 pb-0 mr-0 collapsed" onClick={toggleMobileTopMenu}>
								<span className="fa-stack fa-lg text-inverse">
									<i className="far fa-square fa-stack-2x"></i>
									<i className="fa fa-cog fa-stack-1x"></i>
								</span>
							</button>
							)}
							{!pageSidebar && pageTopMenu && (
								<button type="button" className="navbar-toggle" onClick={toggleMobileTopMenu}>
									<span className="icon-bar"></span>
									<span className="icon-bar"></span>
									<span className="icon-bar"></span>
								</button>
							)}
						</div>
						
						{pageHeaderMegaMenu && (
							<DropdownMegaMenu collapse={this.state.collapseMegaMenu} />
						)}
						
						<ul className="navbar-nav navbar-right">
							<SearchForm />
							{/*<DropdownNotification />*/}
							
							{pageHeaderLanguageBar && (
								<DropdownLanguage />
							)}
							
							<DropdownProfile />
							
							{pageTwoSidebar && (
								<li className="divider d-none d-md-block"></li>
							)}
							
							{pageTwoSidebar && (
								<li className="d-none d-md-block">
									<Link to="/" onClick={toggleRightSidebar} className="f-s-14">
										<i className="fa fa-th"></i>
									</Link>
								</li>
							)}

							{pageSidebar && (
								<button type="button" className="navbar-toggle" onClick={toggleMobileSidebar}>
									<span className="icon-bar"></span>
									<span className="icon-bar"></span>
									<span className="icon-bar"></span>
								</button>
							)}
						</ul>
					</div>
				)}
			</PageSettings.Consumer>
		)
	}
}

export default Header;
