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
	const numberOfRows = 60;

	const columns = [
		{ label: 'Name', type: 'text', format: (d) => d.name },
		{ label: 'Version', type: 'text', format: (d) => d.version },
		{ label: 'Governance Rule', type: 'text', format: (d) => d.rule },
		{ label: 'Owner', type: 'text', format: (d) => d.owner }
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
