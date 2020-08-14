// Dimensions
const dimensions = {
	width: window.innerWidth * 0.8,
	height: 400,
	margin: {
		top: 15,
		right: 15,
		bottom: 40,
		left: 60
	}
};
dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

// User Activity Data
const userActivity = (dataset) => {
	const dmlData = [];

	dataset.forEach((data) => {
		dmlData.push({
			date: data.date,
			temperatureMax: data.temperatureMax
		});
	});

	return dmlData;
};

// Governance Chart Data
const governanceAggData = () => {
	const status = [ 'pass', 'fail', 'error', 'warn' ];
	const getRandom = (max, min) => Math.floor(Math.random() * (max - min + 1) + min);
	const result = [];

	for (let i = 0; i < status.length; i++) {
		result.push({
			status: status[i],
			value: getRandom(12, 30)
		});
	}

	return result;
};

// Misc
const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);
