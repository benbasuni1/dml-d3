import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
const format = d3.format('.2f');

const XAxis = ({ bottom, left, height, scale }) => {
	const axis = useRef(null);
	useEffect(() => {
		d3.select(axis.current).call(d3.axisBottom(scale));
	}, []);
	return <g className="axis x" ref={axis} transform={`translate(${left}, ${height - bottom})`} />;
};

const YAxis = ({ top, left, scale }) => {
	const axis = useRef(null);
	useEffect(() => {
		d3.select(axis.current).call(d3.axisLeft(scale));
	}, []);
	return <g className="axis y" ref={axis} transform={`translate(${left}, ${top})`} />;
};

const Rect = ({ data, x, y, height, top, bottom }) => {
	return (
		<g transform={`translate(${x(data.date)}, ${y(data.value)})`}>
			<rect width={x.bandwidth()} height={height - bottom - top - y(data.value)} fill="steelblue" />
		</g>
	);
};

const Bar2 = ({ data2, width, height, top, bottom, left, right }) => {
	const x = d3.scaleBand().range([ 0, width - left - right ]).domain(data2.map((d) => d.date)).padding(0.1);
	const y = d3.scaleLinear().range([ height - top - bottom, 0 ]).domain([ 0, d3.max(data2, (d) => d.value) ]);

	return (
		<React.Fragment>
			<svg width={width} height={height + 200}>
				<XAxis scale={x} top={top} bottom={bottom} left={left} right={right} height={height} />
				<YAxis scale={y} top={top} bottom={bottom} left={left} right={right} />
				<g transform={`translate(${left}, ${top})`}>
					{data2.map((d, i) => (
						<Rect key={d + i} data={d} x={x} y={y} top={top} bottom={bottom} height={height} />
					))}
				</g>
			</svg>
		</React.Fragment>
	);
};

export default Bar2;
