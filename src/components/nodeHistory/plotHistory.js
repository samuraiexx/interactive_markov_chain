import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

export default function History({ node }) {

  const data = (node) => {
    const visitedArray = node.visited;
    return visitedArray.map((timesVisited, step) => {
      return {
        name: step.toString(),
        "visits/# of steps": timesVisited / (step === 0 ? 1 : step),
      };
    });
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
      <Line type="monotone" dataKey="visits/# of steps" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
  );
}