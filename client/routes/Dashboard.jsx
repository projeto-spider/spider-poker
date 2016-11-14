import React from 'react';

export default function Dashboard({children}) {
	return (
		<div className="wrapper">

			<header className="main-header">

				<a href="#" className="logo">
					<span className="logo-mini"><b>P</b>Poker</span>
					<span className="logo-lg"><b>Planning</b>Poker</span>
				</a>

				<nav className="navbar navbar-static-top" role="navigation">
					<div className="navbar-custom-menu">
						<ul className="nav navbar-nav">
						</ul>
					</div>
				</nav>
			</header>
			<aside className="main-sidebar">

				<section className="sidebar">
					<ul className="sidebar-menu">
						<li className="header">MENU</li>
						<li className="active"><a href="#"><i className="fa fa-link"></i> <span>Link</span></a></li>
						<li><a href="#"><i className="fa fa-link"></i> <span>Another Link</span></a></li>
						<li className="treeview">
							<a href="#"><i className="fa fa-link"></i> <span>Multilevel</span>
								<span className="pull-right-container">
									<i className="fa fa-angle-left pull-right"></i>
								</span>
							</a>
							<ul className="treeview-menu">
								<li><a href="#">Link in level 2</a></li>
								<li><a href="#">Link in level 2</a></li>
							</ul>
						</li>
					</ul>
				</section>
			</aside>

			<div className="content-wrapper" style={{minHeight: window.innerHeight}}>
				<section className="content-header">
					<h1>
						Page Header
						<small>Optional description</small>
					</h1>
				</section>

				<section className="content">

					{children}

				</section>
			</div>

			<footer className="main-footer">
				<div className="pull-right hidden-xs">
					Anything you want
				</div>
				<strong>Copyright &copy; 2016 <a href="#">Company</a>.</strong> All rights reserved.
			</footer>

			<aside className="control-sidebar control-sidebar-dark">
				<ul className="nav nav-tabs nav-justified control-sidebar-tabs">
					<li className="active"><a href="#" data-toggle="tab"><i className="fa fa-home"></i></a></li>
					<li><a href="#" data-toggle="tab"><i className="fa fa-gears"></i></a></li>
				</ul>
				<div className="tab-content">
					<div className="tab-pane active" id="control-sidebar-home-tab">
						<h3 className="control-sidebar-heading">Recent Activity</h3>
						<ul className="control-sidebar-menu">
							<li>
								<a href="#">
									<i className="menu-icon fa fa-birthday-cake bg-red"></i>

									<div className="menu-info">
										<h4 className="control-sidebar-subheading">Langdon's Birthday</h4>

										<p>Will be 23 on April 24th</p>
									</div>
								</a>
							</li>
						</ul>

						<h3 className="control-sidebar-heading">Tasks Progress</h3>
						<ul className="control-sidebar-menu">
							<li>
								<a href="#">
									<h4 className="control-sidebar-subheading">
										Custom Template Design
										<span className="pull-right-container">
											<span className="label label-danger pull-right">70%</span>
										</span>
									</h4>

									<div className="progress progress-xxs">
										<div className="progress-bar progress-bar-danger" style={{width: '70%'}}></div>
									</div>
								</a>
							</li>
						</ul>

					</div>
					<div className="tab-pane" id="control-sidebar-stats-tab">Stats Tab Content</div>
					<div className="tab-pane" id="control-sidebar-settings-tab">
						<form method="post">
							<h3 className="control-sidebar-heading">General Settings</h3>

							<div className="form-group">
								<label className="control-sidebar-subheading">
									Report panel usage
									<input type="checkbox" className="pull-right" checked />
								</label>

								<p>
									Some information about this general settings option
								</p>
							</div>
						</form>
					</div>
				</div>
			</aside>
			<div className="control-sidebar-bg"></div>
		</div>
	);
}
