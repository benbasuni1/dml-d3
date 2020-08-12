import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import Tooltip from '../Misc/Tooltip';

const status = [ 'pass', 'fail', 'error', 'warn' ];

const generateGovernanceData = (num) => {
	const fakeServiceName = (length) => {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
		return result;
	};
	const getRandom = () => Math.floor(Math.random() * Math.floor(4));

	let result = [];
	let obj = {};

	for (let i = 0; i < num; i++) {
		result.push({
			serviceName: fakeServiceName(Math.floor(Math.random() * 10) + 5),
			status: status[getRandom(status)]
		});
		if (!obj[status[getRandom(status)]]) {
			obj[status[getRandom(status)]] = 1;
		} else {
			obj[status[getRandom(status)]]++;
		}
	}

	result.push(obj);
	return result;
};

const XAxis = ({ scale, dim }) => {
	const axis = useRef(null);
	useEffect(() => {
		d3.select(axis.current).call(d3.axisBottom(scale));
	}, []);

	return <g className="x axis" ref={axis} transform={`translate(${dim.m.l}, ${dim.bh - dim.m.b + 20})`} />;
};

const YAxis = ({ scale, dim }) => {
	const axis = useRef(null);
	useEffect(() => {
		d3.select(axis.current).call(d3.axisLeft(scale));
	}, []);

	return <g className="axis y" ref={axis} transform={`translate(${dim.m.l}, ${dim.m.t - 40})`} />;
};

const Rect = ({ xScale, yScale, status, value, setTooltip }) => {
	const [ fillColor, setFillColor ] = useState('blue');
	const padding = 30;
	return (
		<rect
			x={xScale(status) + padding}
			y={yScale(value) - 10}
			width={xScale.bandwidth()}
			height={yScale(0) - yScale(value)}
			fill={fillColor}
			onMouseOver={() => {
				setFillColor('green');
				setTooltip([ status, value ]);
			}}
			onMouseLeave={() => {
				setTooltip(false);
				setFillColor('blue');
			}}
		/>
	);
};

const Governance = ({ dim }) => {
	const [ tooltip, setTooltip ] = useState(false);
	const [ data, setData ] = useState([]);

	useEffect(() => {
		setData(generateGovernanceData(100));
	}, []);

	if (data.length > 1) {
		const aggData = data[data.length - 1];
		const xScale = d3.scaleBand().domain(status).rangeRound([ 0, dim.bw ]).paddingInner(0.01);
		const yScale = d3.scaleLinear().domain([ 0, d3.max(Object.values(aggData)) ]).range([ dim.bh, 0 ]);

		return (
			<React.Fragment>
				{tooltip && <Tooltip info={tooltip} scales={[ xScale, yScale ]} dim={dim} />}
				<svg width={dim.w} height={dim.h}>
					<XAxis scale={xScale} dim={dim} />
					<YAxis scale={yScale} dim={dim} />
					<g>
						{Object.entries(aggData).map((d, i) => {
							const [ status, value ] = d;
							return (
								<Rect
									key={i}
									xScale={xScale}
									yScale={yScale}
									status={status}
									value={value}
									setTooltip={setTooltip}
								/>
							);
						})}
					</g>
				</svg>
			</React.Fragment>
		);
	} else {
		return <div>hello</div>;
	}
};

export default Governance;
