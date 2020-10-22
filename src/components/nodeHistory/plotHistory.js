import React, { PureComponent } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

export default function History({node}) {

    const data = (node) => {
        const visitedArray = node.visited;
        console.log(visitedArray);
        return visitedArray.map((timesVisited, step) => {
            return {
                name: step.toString(),
                visits: timesVisited / (step === 0 ? 1 : step),
            };
        });
        return [
                {
                    name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
                },
                {
                    name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
                },
                {
                    name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
                },
                {
                    name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
                },
                {
                    name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
                },
                {
                    name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
                },
                {
                    name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
                },
               ]; 
    };

    return (
      <LineChart
        width={500}
        height={300}
        data={data(node)}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="visits" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    );
}