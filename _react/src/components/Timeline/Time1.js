import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const XAxis = ({ scale, dim }) => {
	const axis = useRef(null);
	useEffect(() => {
		let axisBottom = d3.axisBottom(scale).ticks(d3.timeHour).tickFormat(d3.timeFormat('%H:%M')).ticks(8);
		d3.select(axis.current).call(axisBottom);
	}, []);
	return <g className="axis x" ref={axis} transform={`translate(${dim.m.l}, ${dim.bh + 30})`} />;
};

const YAxis = ({ scale, dim }) => {
	const axis = useRef(null);
	useEffect(() => {
		let axisLeft = d3.axisLeft(scale).tickFormat(d3.format('d')).ticks(1);
		d3.select(axis.current).call(axisLeft);
	}, []);
	return <g className="axis y" ref={axis} transform={`translate(${dim.m.l}, ${dim.m.t})`} />;
};

const analyzeData = (data, flag, arr) => {
	data.forEach((d) => {
		let today = new Date();
		let yesterday = new Date();
		let currentDate;
		yesterday.setDate(yesterday.getDate() - 1);

		if (d.date !== '00:00' && !flag) {
			currentDate = yesterday;
		} else {
			flag = true;
			currentDate = today;
		}

		currentDate.setHours(d.date.split(':')[0]);
		currentDate.setMinutes(d.date.split(':')[1]);
		currentDate.setSeconds(0);

		arr.push({
			date: currentDate,
			value: +d.value
		});
	});

	return arr;
};

const Time1 = ({ data, dim }) => {
	const arr = analyzeData(data, false, []);
	const xScale = d3.scaleTime().domain(d3.extent(arr, (d) => d.date)).range([ 0, dim.bw ]);
	const yScale = d3.scaleLinear().domain(d3.extent(arr, (d) => d.value)).rangeRound([ dim.bh, 0 ]);
	const line = d3.line().x((d) => xScale(d.date)).y((d) => yScale(d.value));

	return (
		<React.Fragment>
			<svg width={dim.w} height={dim.h}>
				<XAxis scale={xScale} dim={dim} />
				<YAxis scale={yScale} dim={dim} />
				<g transform={`translate(${dim.m.l}, ${dim.m.t})`}>
					<path
						className="line"
						d={line(arr)}
						onMouseEnter={() => console.log('hello')}
						onMouseLeave={() => console.log('bye')}
					/>
				</g>
			</svg>
		</React.Fragment>
	);
};

export default Time1;

/*
	const tooltip = d3.select('#tooltip');
	const tooltipCircle = bounds
		.append('circle')
		.attr('class', 'tooltip-circle')
		.attr('r', 4)
		.attr('stroke', '#af9358')
		.attr('fill', 'white')
		.attr('stroke-width', 2)
		.style('opacity', 0);

	function onMouseMove() {
		const mousePosition = d3.mouse(this);
		const hoveredDate = xScale.invert(mousePosition[0]);

		const getDistanceFromHoveredDate = (d) => Math.abs(xAccessor(d) - hoveredDate);
		const closestIndex = d3.scan(dataset, (a, b) => getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b));
		const closestDataPoint = dataset[closestIndex];

		const closestXValue = xAccessor(closestDataPoint);
		const closestYValue = yAccessor(closestDataPoint);

		const formatDate = d3.timeFormat('%B %A %-d, %Y');
		tooltip.select('#date').text(formatDate(closestXValue));

		const formatTemperature = (d) => `${d3.format('.1f')(d)}°F`;
		tooltip.select('#temperature').html(formatTemperature(closestYValue));

		const x = xScale(closestXValue) + dimensions.margin.left;
		const y = yScale(closestYValue) + dimensions.margin.top;

		tooltip.style('transform', `translate(` + `calc( -50% + ${x}px),` + `calc(-100% + ${y}px)` + `)`);

		tooltip.style('opacity', 1);

		tooltipCircle.attr('cx', xScale(closestXValue)).attr('cy', yScale(closestYValue)).style('opacity', 1);
	}

	function onMouseLeave() {
		tooltip.style('opacity', 0);

		tooltipCircle.style('opacity', 0);
	}
*/
