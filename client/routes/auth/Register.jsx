import React, {Component} from 'react';
import {addClass, removeClass} from '../../utils';

export default class Register extends Component {
	componentDidMount() {
		addClass('body', 'login-page');
	}

	componentWillUnmount() {
		removeClass('body', 'login-page');
	}

	render() {
		return (
			<div>
				<p className='login-box-msg'>Sign up</p>

				<form action="../../index.html" method="post">
					<div className="form-group has-feedback">
						<input type="text" className="form-control" placeholder="Full name" />
						<span className="glyphicon glyphicon-user form-control-feedback" />
					</div>
					<div className="form-group has-feedback">
						<input type="email" className="form-control" placeholder="Email" />
						<span className="glyphicon glyphicon-envelope form-control-feedback" />
					</div>
					<div className="form-group has-feedback">
						<input type="password" className="form-control" placeholder="Password" />
						<span className="glyphicon glyphicon-lock form-control-feedback" />
					</div>
					<div className="form-group has-feedback">
						<input type="password" className="form-control" placeholder="Retype password" />
						<span className="glyphicon glyphicon-log-in form-control-feedback" />
					</div>
					<button type="submit" className="btn btn-primary btn-block btn-flat">Register</button>
				</form>
			</div>
		);
	}
}
