import React, { useState, useRef } from 'react';

const Tooltip = ({ info, scales, dim }) => {
	const [ status, value ] = info;
	const [ xScale, yScale ] = scales;

	const x = dim.w / 1.5 + xScale(status);
	const y = yScale(value) + dim.m.t;

	return (
		<div
			id="tooltip"
			style={{
				background: 'white',
				transform: `translate(calc(-50% + ${x}px),` + `calc(-100% + ${y}px)` + `)`,
				transition: 'all 1.5s ease-out',
				position: 'absolute',
				top: '100px',
				padding: '0.6em 1em',
				background: '#fff',
				textAlign: 'center',
				border: '1px solid #ddd',
				zIndex: '10',
				pointerEvents: 'none'
			}}
		>
			<strong>{status}</strong>
			<p>{value}</p>
		</div>
	);
};

export default Tooltip;
