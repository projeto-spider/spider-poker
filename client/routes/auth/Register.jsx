import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {
	FormGroup,
	FormControl,
	Button,
} from 'react-bootstrap';
import {
	rejectRegister,
} from '../../reducers/auth';
import {
	clear as clearMessages,
	REGISTER_INVALID,
} from '../../reducers/flash';
import {api} from '../../lib';
import {addClass, removeClass} from '../../utils';

class Register extends Component {
	constructor(props) {
		super(props);

		[
			'valid',
			'onChange',
			'onSubmit',
			'onSuccess',
			'onError',
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

	onSubmit(ev) {
		ev.preventDefault();
		this.props.clearMessages(REGISTER_INVALID);

		const {username, password, email} = this.state;
		api.auth.register({
			username, password, email,
		})
			.then(this.onSuccess)
			.catch(this.onError);
	}

	onSuccess(data) {
		return this.props.router.push('/auth/login');
	}

	onError(data) {
		this.props.rejectRegister('Invalid credentials');
	}

	render() {
		return (
			<div>
				<p className='login-box-msg'>Sign up</p>

				{this.props.flash.map((message, id) => (
					<div key={id}>{message.text}</div>
				))}

				<form onSubmit={this.onSubmit}>
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
							type="password"
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
							type="password"
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

const mapStateToProps = state => ({
	flash: state.flash,
});

const mapDispatchToProps = dispatch => ({
	...(bindActionCreators({
		clearMessages,
		rejectRegister,
	}, dispatch)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withRouter(Register));
