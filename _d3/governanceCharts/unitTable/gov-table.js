const mockData = [
	{
		name: 'Accounts',
		version: '1.0',
		rule: 'WARN: NFRs not populated',
		owner: 'Group 1'
	},
	{
		name: 'Accounts',
		version: '1.0',
		rule: 'WARN: Group',
		owner: 'Group 1'
	},
	{
		name: 'Person',
		version: '1.5',
		rule: 'WARN: Group',
		owner: 'Group 1'
	},
	{
		name: 'Person',
		version: '1.5',
		rule: 'WARN: Group',
		owner: 'Group 1'
	},
	{
		name: 'Person',
		version: '1.5',
		rule: 'WARN: Incorrect Version Format',
		owner: 'Group 1'
	},
	{
		name: 'Person',
		version: '1.5',
		rule: 'WARN: Missing Classifications',
		owner: 'Group 1'
	},
	{
		name: 'Person',
		version: '1.5',
		rule: 'WARN: URI Versioning',
		owner: 'Group 1'
	},
	{
		name: 'Person',
		version: '2.0',
		rule: 'PASS: Classifications Populated',
		owner: 'Everyone'
	},
	{
		name: 'Money Balance',
		version: '3.1',
		rule: 'WARN: Incorrect Version Format',
		owner: 'Important People'
	},
	{
		name: 'Money Balance',
		version: '3.1',
		rule: 'WARN: Missing Classifications',
		owner: 'Important People'
	},
	{
		name: 'Money Balance',
		version: '3.1',
		rule: 'WARN: NFRs not populated',
		owner: 'Important People'
	},
	{
		name: 'Money Balance',
		version: '3.1',
		rule: 'ERROR: URI Versioning',
		owner: 'Important People'
	}
];

async function drawTable() {
	// load data
	const dateParser = d3.timeParse('%Y-%m-%d');
	const dateAccessor = (d) => dateParser(d.date);
	let dataset = mockData;
	dataset = dataset.sort((a, b) => dateAccessor(a) - dateAccessor(b));

	const table = d3.select('#table');

	const dateFormat = (d) => d3.timeFormat('%-m/%d')(dateParser(d));
	const hourFormat = (d) => d3.timeFormat('%-I %p')(new Date(d * 1000));
	const format24HourTime = (d) => +d3.timeFormat('%H')(new Date(d * 1000));

	const numberOfRows = 60;
	const colorScale = d3.interpolateHcl('#a5c3e8', '#efa8a1');
	const grayColorScale = d3.interpolateHcl('#fff', '#bdc4ca');
	const tempScale = d3
		.scaleLinear()
		.domain(d3.extent(dataset.slice(0, numberOfRows), (d) => d.temperatureMax))
		.range([ 0, 1 ]);
	const timeScale = d3.scaleLinear().domain([ 0, 24 ]).range([ 0, 80 ]);
	const humidityScale = d3
		.scaleLinear()
		.domain(d3.extent(dataset.slice(0, numberOfRows), (d) => d.windSpeed))
		.range([ 0, 1 ]);

	const columns = [
		{ label: 'Name', type: 'date', format: (d) => dateFormat(d.date) },
		{ label: 'Version', type: 'text', format: (d) => d.summary },
		{
			label: 'Rule Aggregate',
			type: 'number',
			format: (d) => d3.format('.1f')(d.temperatureMax),
			background: (d) => colorScale(tempScale(d.temperatureMax))
		},
		{
			label: 'Governance Rule',
			type: 'marker',
			format: (d) => '|',
			transform: (d) => `translateX(${timeScale(format24HourTime(d.apparentTemperatureMaxTime))}%)`
		},
		{
			label: 'Owner',
			type: 'number',
			format: (d) => d3.format('.2f')(d.windSpeed),
			background: (d) => grayColorScale(humidityScale(d.windSpeed))
		}
	];

	table
		.append('thead')
		.append('tr')
		.selectAll('thead')
		.data(columns)
		.enter()
		.append('th')
		.text((d) => d.label)
		.attr('class', (d) => d.type);

	const body = table.append('tbody');

	dataset.slice(0, numberOfRows).forEach((d) => {
		body
			.append('tr')
			.selectAll('td')
			.data(columns)
			.enter()
			.append('td')
			.text((column) => column.format(d))
			.attr('class', (column) => column.type)
			.style('background', (column) => column.background && column.background(d))
			.style('transform', (column) => column.transform && column.transform(d));
	});
}
drawTable();
