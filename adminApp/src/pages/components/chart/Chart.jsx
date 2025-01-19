import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const data = [
  { name: "January", Total: 300 },
  { name: "February", Total: 800 },
  { name: "March", Total: 800 },
  { name: "April", Total: 1600 },
  { name: "May", Total: 800 },
  { name: "June", Total: 1700 },
  { name: "June", Total: 1700 },
  { name: "June", Total: 1700 },
  { name: "June", Total: 1700 },
  { name: "June", Total: 1700 },
];

const Chart = ({ aspect, title }) => {
  return (
    <div className="flex-[4] shadow-lg bg-white rounded p-2.5 text-gray-600">
      <div className="mb-5">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />
          <CartesianGrid strokeDasharray="3 3" className="stroke-[#e4e1e1]" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
