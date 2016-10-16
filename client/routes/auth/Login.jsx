import React, {Component} from 'react';
import {addClass, removeClass} from '../../utils';

export default class Login extends Component {
	componentDidMount() {
		addClass('body', 'login-page');
	}

	componentWillUnmount() {
		removeClass('body', 'login-page');
	}

	render() {
		return (
			<div>
				<p className='login-box-msg'>Sign in</p>

				<form method="post" action="/">
					<div className="form-group has-feedback">
						<input type="email" className="form-control" placeholder="Username or Email" />
						<span className="glyphicon glyphicon-envelope form-control-feedback" />
					</div>
					<div className="form-group has-feedback">
						<input type="password" className="form-control" placeholder="Password" />
						<span className="glyphicon glyphicon-lock form-control-feedback" />
					</div>
					<button type="submit" className="btn btn-primary btn-block btn-flat">Sign In</button>
				</form>
			</div>
		);
	}
}
