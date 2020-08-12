import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const Rect = ({ x, y, width, height, fill }) => {
	return <rect x={x} y={y} width={width} height={height} fill={fill} />;
};

const XAxis = ({ scale, dim }) => {
	const axis = useRef(null);
	useEffect(() => {
		d3.select(axis.current).call(d3.axisBottom(scale));
	}, []);

	return <g className="x axis" ref={axis} transform={`translate(${dim.m.l}, ${dim.bh - dim.m.b - 20})`} />;
};

const YAxis = ({ scale, dim }) => {
	const axis = useRef(null);
	useEffect(() => {
		d3.select(axis.current).call(d3.axisLeft(scale));
	}, []);

	return <g className="axis y" ref={axis} transform={`translate(${dim.m.l}, ${dim.m.t - 40})`} />;
};

const Bar3 = ({ data, dim }) => {
	const padding = 30;
	let xScale = d3.scaleBand().domain(d3.range(data.length)).rangeRound([ 0, dim.bw ]).paddingInner(0.05);
	let yScale = d3.scaleLinear().domain([ 0, d3.max(data) ]).range([ dim.bh, 0 ]);

	return (
		<React.Fragment>
			<svg width={dim.w} height={dim.h}>
				<XAxis scale={xScale} dim={dim} />
				<YAxis scale={yScale} dim={dim} />
				{data.map((d, i) => (
					<Rect
						key={i}
						x={xScale(i) + padding}
						y={dim.bh - yScale(d) - padding}
						width={xScale.bandwidth()}
						height={yScale(d)}
						fill={'rgb(0, 0, ' + Math.round(d * 10) + ')'}
					/>
				))}
			</svg>
		</React.Fragment>
	);
};

export default Bar3;
