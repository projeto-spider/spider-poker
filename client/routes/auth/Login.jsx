import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {
	FormGroup,
	FormControl,
	Button,
} from 'react-bootstrap';
import {login} from '../../reducers/auth';
import {
	clear as clearMessages,
	AUTH_INVALID,
} from '../../reducers/flash';
import {addClass, removeClass} from '../../utils';

class Login extends Component {
	constructor(props) {
		super(props);

		[
			'valid',
			'onChange',
			'onSubmit',
		].forEach(prop => this[prop] = this[prop].bind(this));
	}

	componentWillMount() {
		this.setState({
			username: '',
			password: '',
			dirty: {
				username: false,
				password: false,
			},
		});
	}

	componentDidMount() {
		addClass('body', 'login-page');
	}

	componentWillUnmount() {
		removeClass('body', 'login-page');
	}

	componentWillReceiveProps(props) {
		if (props.loggedIn) {
			return this.props.router.push('/');
		}
	}

	valid(prop) {
		if (!this.state.dirty[prop]) {
			return undefined;
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
		this.props.clearMessages(AUTH_INVALID);
		this.props.login(this.state.username, this.state.password)
	}

	render() {
		return (
			<div>
				<p className='login-box-msg'>Sign in</p>

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
							placeholder="Username or Email"
							onChange={this.onChange('username')}
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

					<Button
						block
						type='submit'
						bsStyle='primary'
						className='btn-flat'
					>
						Sign In
					</Button>
				</form>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	flash: state.flash,
	loggedIn: state.auth.loggedIn,
});

const mapDispatchToProps = dispatch => ({
	...(bindActionCreators({
		login,
		clearMessages,
	}, dispatch)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withRouter(Login));
