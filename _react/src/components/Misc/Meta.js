import * as d3 from 'd3';

export const Dimensions = {
	w: 800,
	h: 500,
	m: {
		t: 30,
		l: 30,
		b: 30,
		r: 30
	}
};

Dimensions.bh = Dimensions.h - Dimensions.m.t - Dimensions.m.b;
Dimensions.bw = Dimensions.w - Dimensions.m.l - Dimensions.m.r;

export const generateData = (value, length = 5) =>
	d3.range(length).map((item, index) => ({
		index: index,
		date: index,
		value: value === null || value === undefined ? Math.random() * 100 : value
	}));

export const generateInitData = (type = 'bar') => {
	const numValues = 30;
	const maxRange = Math.random() * 1000;
	let dataset = [];
	for (let i = 0; i < numValues; i++) {
		let newNumber1 = Math.floor(Math.random() * maxRange);
		let newNumber2 = Math.floor(Math.random() * maxRange);
		if (type === 'scatter') dataset.push([ newNumber1, newNumber2 ]);
		if (type === 'bar') dataset.push(newNumber1);
	}

	return dataset;
};

export const userActivity = [
	{
		date: '22:00',
		value: '0'
	},
	{
		date: '23:00',
		value: '1'
	},
	{
		date: '00:00',
		value: '1'
	},
	{
		date: '01:00',
		value: '0'
	},
	{
		date: '02:00',
		value: '0'
	},
	{
		date: '03:00',
		value: '1'
	},
	{
		date: '04:00',
		value: '1'
	},
	{
		date: '05:00',
		value: '0'
	},
	{
		date: '06:00',
		value: '0'
	},
	{
		date: '07:00',
		value: '1'
	},
	{
		date: '08:00',
		value: '0'
	},
	{
		date: '09:00',
		value: '0'
	},
	{
		date: '10:00',
		value: '0'
	},
	{
		date: '11:00',
		value: '0'
	},
	{
		date: '12:00',
		value: '0'
	},
	{
		date: '13:00',
		value: '0'
	},
	{
		date: '14:00',
		value: '0'
	},
	{
		date: '15:00',
		value: '0'
	},
	{
		date: '16:00',
		value: '0'
	},
	{
		date: '17:00',
		value: '0'
	},
	{
		date: '18:00',
		value: '0'
	},
	{
		date: '19:00',
		value: '0'
	},
	{
		date: '20:00',
		value: '0'
	},
	{
		date: '21:00',
		value: '1'
	}
];

export default {
	Dimensions,
	generateData,
	userActivity
};
