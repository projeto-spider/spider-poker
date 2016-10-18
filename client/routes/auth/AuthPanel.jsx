import React from 'react';
import LoadingBar from 'react-redux-loading-bar';

export default function AuthPanel({children}) {
	return (
		<div>
			<LoadingBar className='loading-bar' />
			<div className='login-box'>
				<div className='login-logo'>
					<b>Planning</b>Poker
				</div>
				<div className='login-box-body'>
					{children}
				</div>
			</div>
		</div>
	);
}
