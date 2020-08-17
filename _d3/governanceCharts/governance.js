async function drawGovernanceChart() {
	const initData = [
		{ category: 'bus', status: 'fail', value: 34 },
		{ category: 'third', status: 'fail', value: 12 },
		{ category: 'sys', status: 'fail', value: 10 },
		{ category: 'other', status: 'fail', value: 20 },
		{ category: 'sys', status: 'warn', value: 12 },
		{ category: 'bus', status: 'warn', value: 12 },
		{ category: 'third', status: 'warn', value: 21 },
		{ category: 'other', status: 'warn', value: 40 },
		{ category: 'bus', status: 'pass', value: 18 },
		{ category: 'sys', status: 'pass', value: 15 },
		{ category: 'third', status: 'pass', value: 3 },
		{ category: 'other', status: 'pass', value: 30 },
		{ category: 'sys', status: 'error', value: 19 },
		{ category: 'third', status: 'error', value: 12 },
		{ category: 'bus', status: 'error', value: 22 },
		{ category: 'other', status: 'error', value: 10 }
	];

	let data = initData.filter((d) => d.category === 'bus');

	const statuses = data.map((d) => d.status).sort().reduce((prev, curr) => {
		if (prev.indexOf(curr) === -1) prev.push(curr);
		return prev;
	}, []);

	const color = (status) => {
		let colors = statuses.map((status, i) => {
			return {
				status: status,
				color: d3.schemeSet2[i]
			};
		});
		let found = colors.find((c) => c.status === status);
		return found ? found.color : 'black';
	};

	const x = d3
		.scaleLinear()
		.domain([ 0, d3.max(data, (d) => d.value) ])
		.range([ 0, dimensions.width - dimensions.margin.left - dimensions.margin.right ])
		.nice();

	const y = d3
		.scaleBand()
		.domain(statuses)
		.range([ 0, dimensions.height - dimensions.margin.top - dimensions.margin.bottom ])
		.padding(0.2);

	let svg = d3.select('#wrapper').append('svg').attr('width', dimensions.width).attr('height', dimensions.height);
	let bounds = svg
		.append('g')
		.classed('view', true)
		.attr('transform', `translate(${dimensions.margin.left}, ${dimensions.margin.top})`);

	const yAxisGenerator = d3.axisLeft().scale(y);
	const yAxis = bounds.append('g').attr('class', 'y-axis').call(yAxisGenerator);
	const xAxisGenerator = d3.axisBottom().scale(x);
	const xAxis = bounds
		.append('g')
		.attr('class', 'x-axis')
		.style('transform', `translateY(${dimensions.boundedHeight}px)`)
		.call(xAxisGenerator);

	xAxis
		.append('text')
		.attr('class', 'x-axis-label')
		.attr('x', dimensions.boundedWidth / 2)
		.attr('y', dimensions.margin.bottom)
		.html('Count');

	yAxis
		.append('text')
		.attr('class', 'y-axis-label')
		.attr('x', -dimensions.boundedHeight / 2)
		.attr('y', -dimensions.margin.left + 10)
		.html('Rules');

	// Draw the bars.
	bounds
		.selectAll('rect')
		.data(data)
		.join('rect')
		.attr('class', 'rectangle')
		.attr('fill', (d) => color(d.status))
		.attr('x', 0)
		.attr('y', (d) => y(d.status))
		.attr('width', (d) => x(d.value))
		.attr('height', y.bandwidth())
		.on('mouseover', function(d, i) {
			tooltip
				.html(`<div>Status: ${capitalize(d.status)}</div><div>Value: ${d.value}</div>`)
				.style('visibility', 'visible');
			d3.select(this).transition().attr('fill', 'grey');
		})
		.on('mousemove', function() {
			tooltip.style('top', d3.event.pageY - 10 + 'px').style('left', d3.event.pageX + 10 + 'px');
		})
		.on('mouseout', function() {
			tooltip.html(``).style('visibility', 'hidden');
			d3.select(this).transition().attr('fill', (d) => color(d.status));
		});

	tooltip = d3
		.select('body')
		.append('div')
		.attr('class', 'd3-tooltip')
		.style('position', 'absolute')
		.style('z-index', '10')
		.style('visibility', 'hidden')
		.style('padding', '10px')
		.style('background', 'rgba(0,0,0,0.6)')
		.style('border-radius', '4px')
		.style('color', '#fff')
		.text('a simple tooltip');

	const elements = [ 'Business Capability', 'System (IT)', '3rd Party', 'Other' ];

	const selector = d3.select('#drop').append('select').attr('id', 'dropdown').on('change', function(d) {
		selection = document.getElementById('dropdown');
		let category, data;

		if (selection.value === 'Business Capability') {
			category = 'bus';
		} else if (selection.value === '3rd Party') {
			category = 'third';
		} else if (selection.value === 'System (IT)') {
			category = 'sys';
		} else {
			category = 'other';
		}

		data = initData.filter((d) => d.category === category);

		// scale x axis
		x
			.domain([ 0, d3.max(data, (d) => d.value) ])
			.range([ 0, dimensions.width - dimensions.margin.left - dimensions.margin.right ])
			.nice();

		xAxis.call(xAxisGenerator);

		// change bar value
		d3
			.selectAll('.rectangle')
			.transition()
			.attr('class', 'rectangle')
			.attr('fill', (d) => color(d.status))
			.attr('x', 0)
			.attr('y', (d) => y(d.status))
			.attr('width', (d) => x(d.value))
			.attr('height', y.bandwidth());
	});

	selector
		.selectAll('option')
		.data(elements)
		.enter()
		.append('option')
		.attr('value', function(d) {
			return d;
		})
		.text(function(d) {
			return d;
		});
}
drawGovernanceChart();
