import React from 'react';

export default function Dashboard({children}) {
	return (
		<div className="wrapper">

 			<header className="main-header">

 				<a href="index2.html" className="logo">
 					<span className="logo-mini"><b>A</b>LT</span>
 					<span className="logo-lg"><b>Admin</b>LTE</span>
				</a>

 				<nav className="navbar navbar-static-top" role="navigation">
 					<a href="#" className="sidebar-toggle" data-toggle="offcanvas" role="button">
						<span className="sr-only">Toggle navigation</span>
					</a>
 					<div className="navbar-custom-menu">
						<ul className="nav navbar-nav">
 							<li className="dropdown messages-menu">
 								<a href="#" className="dropdown-toggle" data-toggle="dropdown">
									<i className="fa fa-envelope-o"></i>
									<span className="label label-success">4</span>
								</a>
								<ul className="dropdown-menu">
									<li className="header">You have 4 messages</li>
									<li>
 										<ul className="menu">
											<li>
 												<a href="#">
													<div className="pull-left">
														<img src="dist/img/user2-160x160.jpg" className="img-circle" alt="User Image" />
													</div>
 													<h4>
														Support Team
														<small><i className="fa fa-clock-o"></i> 5 mins</small>
													</h4>
 													<p>Why not buy a new awesome theme?</p>
												</a>
											</li>
 										</ul>
 									</li>
									<li className="footer"><a href="#">See All Messages</a></li>
								</ul>
							</li>

 							<li className="dropdown notifications-menu">
 								<a href="#" className="dropdown-toggle" data-toggle="dropdown">
									<i className="fa fa-bell-o"></i>
									<span className="label label-warning">10</span>
								</a>
								<ul className="dropdown-menu">
									<li className="header">You have 10 notifications</li>
									<li>
 										<ul className="menu">
											<li>
 												<a href="#">
													<i className="fa fa-users text-aqua"></i> 5 new members joined today
												</a>
											</li>
 										</ul>
									</li>
									<li className="footer"><a href="#">View all</a></li>
								</ul>
							</li>
 							<li className="dropdown tasks-menu">
 								<a href="#" className="dropdown-toggle" data-toggle="dropdown">
									<i className="fa fa-flag-o"></i>
									<span className="label label-danger">9</span>
								</a>
								<ul className="dropdown-menu">
									<li className="header">You have 9 tasks</li>
									<li>
 										<ul className="menu">
											<li>
 												<a href="#">
 													<h3>
														Design some buttons
														<small className="pull-right">20%</small>
													</h3>
 													<div className="progress xs">
 														<div className="progress-bar progress-bar-aqua" style={{width: '20%'}} role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
															<span className="sr-only">20% Complete</span>
														</div>
													</div>
												</a>
											</li>
 										</ul>
									</li>
									<li className="footer">
										<a href="#">View all tasks</a>
									</li>
								</ul>
							</li>
 							<li className="dropdown user user-menu">
 								<a href="#" className="dropdown-toggle" data-toggle="dropdown">
									<img src="dist/img/user2-160x160.jpg" className="user-image" alt="User Image" />
 									<span className="hidden-xs">Alexander Pierce</span>
								</a>
								<ul className="dropdown-menu">
 									<li className="user-header">
										<img src="dist/img/user2-160x160.jpg" className="img-circle" alt="User Image" />

										<p>
											Alexander Pierce - Web Developer
											<small>Member since Nov. 2012</small>
										</p>
									</li>
 									<li className="user-body">
										<div className="row">
											<div className="col-xs-4 text-center">
												<a href="#">Followers</a>
											</div>
											<div className="col-xs-4 text-center">
												<a href="#">Sales</a>
											</div>
											<div className="col-xs-4 text-center">
												<a href="#">Friends</a>
											</div>
										</div>
 									</li>
 									<li className="user-footer">
										<div className="pull-left">
											<a href="#" className="btn btn-default btn-flat">Profile</a>
										</div>
										<div className="pull-right">
											<a href="#" className="btn btn-default btn-flat">Sign out</a>
										</div>
									</li>
								</ul>
							</li>
 							<li>
								<a href="#" data-toggle="control-sidebar"><i className="fa fa-gears"></i></a>
							</li>
						</ul>
					</div>
				</nav>
			</header>
 			<aside className="main-sidebar">

 				<section className="sidebar">

 					<div className="user-panel">
						<div className="pull-left image">
							<img src="dist/img/user2-160x160.jpg" className="img-circle" alt="User Image" />
						</div>
						<div className="pull-left info">
							<p>Alexander Pierce</p>
 							<a href="#"><i className="fa fa-circle text-success"></i> Online</a>
						</div>
					</div>

 					<form action="#" method="get" className="sidebar-form">
						<div className="input-group">
							<input type="text" name="q" className="form-control" placeholder="Search..." />
									<span className="input-group-btn">
										<button type="submit" name="search" id="search-btn" className="btn btn-flat"><i className="fa fa-search"></i>
										</button>
									</span>
						</div>
					</form>

 					<ul className="sidebar-menu">
						<li className="header">HEADER</li>
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

 			<div className="content-wrapper">
 				<section className="content-header">
					<h1>
						Page Header
						<small>Optional description</small>
					</h1>
					<ol className="breadcrumb">
						<li><a href="#"><i className="fa fa-dashboard"></i> Level</a></li>
						<li className="active">Here</li>
					</ol>
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
					<li className="active"><a href="#control-sidebar-home-tab" data-toggle="tab"><i className="fa fa-home"></i></a></li>
					<li><a href="#control-sidebar-settings-tab" data-toggle="tab"><i className="fa fa-gears"></i></a></li>
				</ul>
 				<div className="tab-content">
 					<div className="tab-pane active" id="control-sidebar-home-tab">
						<h3 className="control-sidebar-heading">Recent Activity</h3>
						<ul className="control-sidebar-menu">
							<li>
								<a href="javascript::;">
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
								<a href="javascript::;">
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
