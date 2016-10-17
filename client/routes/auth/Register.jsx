import React, {Component} from 'react';
import {
	FormGroup,
	FormControl,
	Button,
} from 'react-bootstrap';
import {addClass, removeClass} from '../../utils';

export default class Register extends Component {
	constructor(props) {
		super(props);

		[
			'valid',
			'onChange',
		].forEach(prop => this[prop] = this[prop].bind(this));
	}

	componentWillMount() {
		this.setState({
			username: '',
			email: '',
			password: '',
			repassword: '',
			dirty: {
				username: false,
				email: false,
				password: false,
				repassword: false,
			},
		});
	}

	componentDidMount() {
		addClass('body', 'login-page');
	}

	componentWillUnmount() {
		removeClass('body', 'login-page');
	}

	valid(prop) {
		if (!this.state.dirty[prop]) {
			return undefined;
		}

		if (prop === 'repassword') {
			return this.state.password !== this.state.repassword
				? 'error'
				: undefined;
		}

		return this.state[prop].length
			? undefined
			: 'error';
	}

	onChange(prop) {
		return ev => {
			this.setState({
				[prop]: ev.target.value,
				dirty: Object.assign({}, this.state.dirty, {[prop]: true}),
			});
		};
	}

	render() {
		return (
			<div>
				<p className='login-box-msg'>Sign up</p>


				<form>
					<FormGroup
						controlId="username"
						validationState={this.valid('username')}
					>
						<FormControl
							type="text"
							value={this.state.username}
							placeholder='Username'
							onChange={this.onChange('username')}
						/>
						<FormControl.Feedback />
					</FormGroup>

					<FormGroup
						controlId="email"
						validationState={this.valid('email')}
					>
						<FormControl
							type="text"
							value={this.state.email}
							placeholder='Email'
							onChange={this.onChange('email')}
						/>
						<FormControl.Feedback />
					</FormGroup>

					<FormGroup
						controlId="password"
						validationState={this.valid('password')}
					>
						<FormControl
							type="text"
							value={this.state.password}
							placeholder="Password"
							onChange={this.onChange('password')}
						/>
						<FormControl.Feedback />
					</FormGroup>

					<FormGroup
						controlId="repassword"
						validationState={this.valid('repassword')}
					>
						<FormControl
							type="text"
							value={this.state.repassword}
							placeholder="Confirm password"
							onChange={this.onChange('repassword')}
						/>
						<FormControl.Feedback />
					</FormGroup>

					<Button
						block
						type='submit'
						bsStyle='primary'
						className='btn-flat'
					>
						Sign Up
					</Button>
				</form>
			</div>
		);
	}
}
