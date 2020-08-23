async function drawGovernanceChart() {
	const max = 40;
	const min = 10;
	const initData = [
		{ category: 'bus', status: 'fail', value: Math.floor(Math.random() * (max - min + 1) + min) },
		{ category: 'third', status: 'fail', value: Math.floor(Math.random() * (max - min + 1) + min) },
		{ category: 'sys', status: 'fail', value: Math.floor(Math.random() * (max - min + 1) + min) },
		{ category: 'other', status: 'fail', value: Math.floor(Math.random() * (max - min + 1) + min) },
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

	const taxonomyElements = [ 'Business Capability', 'System (IT)', '3rd Party', 'Other' ];
	const ruleElements = [ 'URL Correction', 'Status Unverified', 'Missing Methods', 'Misc' ];
	const lifecycleElements = [ 'In Progress', 'Request Approval', 'Approved', 'Deprecated' ];
	const ownerElements = [ 'Admin', 'Developer', 'Team1', 'Team2' ];

	const reDrawBars = (category) => {
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
	};

	const taxonomySelector = d3.select('#drop').append('select').attr('id', 'dropdown1').on('change', function(d) {
		selection = document.getElementById('dropdown1');
		let category;

		switch (selection.value) {
			case taxonomyElements[0]:
				category = 'bus';
				break;
			case taxonomyElements[1]:
				category = 'third';
				break;
			case taxonomyElements[2]:
				category = 'sys';
				break;
			case taxonomyElements[3]:
				category = 'other';
				break;
		}

		reDrawBars(category);
	});

	const ruleSelector = d3.select('#drop2').append('select').attr('id', 'dropdown2').on('change', function(d) {
		selection = document.getElementById('dropdown2');
		let category;

		switch (selection.value) {
			case ruleElements[0]:
				category = 'bus';
				break;
			case ruleElements[1]:
				category = 'third';
				break;
			case ruleElements[2]:
				category = 'sys';
				break;
			case ruleElements[3]:
				category = 'other';
				break;
		}

		reDrawBars(category);
	});

	const lifecycleSelector = d3.select('#drop3').append('select').attr('id', 'dropdown3').on('change', function(d) {
		selection = document.getElementById('dropdown3');
		let category;

		switch (selection.value) {
			case lifecycleElements[0]:
				category = 'bus';
				break;
			case lifecycleElements[1]:
				category = 'third';
				break;
			case lifecycleElements[2]:
				category = 'sys';
				break;
			case lifecycleElements[3]:
				category = 'other';
				break;
		}

		reDrawBars(category);
	});

	const ownerSelector = d3.select('#drop4').append('select').attr('id', 'dropdown4').on('change', function(d) {
		selection = document.getElementById('dropdown4');
		let category;

		switch (selection.value) {
			case ownerElements[0]:
				category = 'bus';
				break;
			case ownerElements[1]:
				category = 'third';
				break;
			case ownerElements[2]:
				category = 'sys';
				break;
			case ownerElements[3]:
				category = 'other';
				break;
		}

		reDrawBars(category);
	});

	const setSelector = (selector, elements) => {
		selector.selectAll('option').data(elements).enter().append('option').attr('value', (d) => d).text((d) => d);
	};

	setSelector(taxonomySelector, taxonomyElements);
	setSelector(ruleSelector, ruleElements);
	setSelector(lifecycleSelector, lifecycleElements);
	setSelector(ownerSelector, ownerElements);
}
drawGovernanceChart();
