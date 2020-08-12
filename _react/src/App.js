import React, { useEffect, useState } from 'react';
import Governance from './components/BarCharts/Governance';
import Tooltip from './components/Misc/Tooltip';
// import Bar1 from './components/BarCharts/Bar1';
// import Bar2 from './components/BarCharts/Bar2';
// import Bar3 from './components/BarCharts/Bar3';
import Time1 from './components/Timeline/Time1';
import { Dimensions as dim, generateData, userActivity, generateInitData } from './components/Misc/Meta';

import './App.css';

const App = () => {
	const [ data, setData ] = useState(generateData());
	const changeData = () => setData(generateData());

	return (
		<div className="App" style={{ textAlign: 'center', marginTop: '50px' }}>
			{/* <div id="wrapper">
				<Governance dim={dim} />
			</div> */}
			<h4>User Activity</h4>
			<div>
				<Time1 data={userActivity} dim={dim} />
			</div>
			{/* <div id="bar-charts">
				<button onClick={changeData}>Transform</button>
				<Bar3 data={generateInitData()} dim={dim} />
				{/* <Bar1
					data1={data}
					width={dim.w / 2}
					height={dim.h / 3}
					top={dim.m.t}
					bottom={dim.m.b}
					left={dim.m.l}
					right={dim.m.r}
				/> */}
			{/* <Bar2
					data2={userActivity}
					width={dim.w}
					height={dim.h / 2}
					top={dim.m.t}
					bottom={dim.m.b}
					left={dim.m.l}
					right={dim.m.r}
				/> */
			/* </div> */}
		</div>
	);
};

export default App;
