import React from 'react';

export default function AuthPanel({children}) {
	return (
		<div className='login-box'>
			<div className='login-logo'>
				<b>Planning</b>Poker
			</div>
			<div className='login-box-body'>
				{children}
			</div>
		</div>
	);
}
