import React, { useState,  useCallback } from 'react';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { ChartContainer } from "./components/ui/chart";

interface DataItem {
  [key: string]: any; 
}



export default function DynamicChart() {
  const [apiUrl, setApiUrl] = useState("https://swapi.dev/api");
  const [data, setData] = useState<DataItem[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [chartType, setChartType] = useState<"bar" | "line">("bar"); // Removed "pie"
  const [endpoints, setEndpoints] = useState<string[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("");

  // Fetch available endpoints from the initial API URL
  const fetchEndpoints = useCallback(async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        console.error("Error fetching endpoints:", response.status, response.statusText);
        return;
      }
      const responseData = await response.json();
      setEndpoints(Object.keys(responseData).filter(key => typeof responseData[key] === 'string'));
      setSelectedEndpoint(""); 
      setColumns([]); 
      setData([]); 
    } catch (error) {
      console.error("Error fetching endpoints:", error);
    }
  }, [apiUrl]);

  // Fetch data from the selected endpoint
  const fetchDataFromEndpoint = useCallback(async () => {
    if (!selectedEndpoint) return;
    try {
      const response = await fetch(`${apiUrl}/${selectedEndpoint}`);
      if (!response.ok) {
        console.error("Error fetching data:", response.status, response.statusText);
        return;
      }
      const responseData = await response.json();
      const formattedData = Array.isArray(responseData.results) 
        ? responseData.results.map((item: DataItem) => {
            const newItem = { ...item };
            selectedColumns.forEach(column => {
              if (typeof newItem[column] === "number") {
                newItem[column] = Math.ceil(newItem[column]);
              }
            });
            return newItem;
          })
        : [responseData]; 

      setData(formattedData);
      if (formattedData.length > 0) {
        setColumns(Object.keys(formattedData[0]));
      } else {
        console.error("Invalid response structure:", responseData);
        setColumns([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl, selectedEndpoint, selectedColumns]);

const renderChart = () => {
  const chartConfig = selectedColumns.reduce<Record<string, { label: string; color: string }>>((acc, column) => {
    acc[column] = {
      label: column,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    };
    return acc;
  }, {});

  const ChartComponent = chartType === "bar" ? BarChart : LineChart; 
  const maxValue = selectedColumns.length > 1
    ? Math.ceil(Math.max(...data.map((item) => item[selectedColumns[1]] || 0))) * 1.1 
    : undefined;

  return (
    <ChartContainer config={chartConfig} className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={data} margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
          <>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={selectedColumns[0]} angle={-45} interval={0} height={60} />
            <YAxis
              domain={[0, maxValue || 'auto']}
              padding={{ top: 20, bottom: 20 }}
              tickFormatter={(value) => Math.ceil(value).toString()}
            />
          </>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="custom-tooltip">
                    <h4>{payload[0].name}</h4>
                    {payload.map((entry, index) => (
                      <p key={`label-${index}`} style={{ color: entry.color }}>
                        {`${entry.name}: ${typeof entry.value === 'number' ? Math.ceil(entry.value).toString() : "N/A"}`}
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          {chartType === "bar" && selectedColumns.slice(1).map((column) => (
            <Bar key={column} dataKey={column} fill={chartConfig[column].color} />
          ))}
          {chartType === "line" && selectedColumns.slice(1).map((column) => (
            <Line key={column} type="monotone" dataKey={column} stroke={chartConfig[column].color} />
          ))}
        </ChartComponent>
      </ResponsiveContainer>
    </ChartContainer>
  );
};


  return (
    <Card className="w-full max-w-4xl mx-auto my-8 shadow-2xl p-6 pulse-shadow">
 


      <CardHeader>
        <CardTitle>Dynamic API Chart</CardTitle>
        <CardDescription>Enter an API endpoint and select data to visualize</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Enter API URL"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
          />
          <Button onClick={fetchEndpoints}>Fetch Endpoints</Button>
        </div>
        {endpoints.length > 0 && (
          <div className="mt-4">
            <label>Select an endpoint:</label>
            <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
              <SelectTrigger>
                <SelectValue placeholder="Choose endpoint" />
              </SelectTrigger>
              <SelectContent>
                {endpoints.map((endpoint) => (
                  <SelectItem key={endpoint} value={endpoint}>
                    {endpoint}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="mt-2" onClick={fetchDataFromEndpoint}>Fetch Data</Button>
          </div>
        )}
        {columns.length > 0 && (
          <div>
            <label>Select columns</label>
            <div>
              {columns.map((column) => (
                <label key={column}>
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(column)}
                    onChange={(e) => {
                      setSelectedColumns(e.target.checked
                        ? [...selectedColumns, column]
                        : selectedColumns.filter((c) => c !== column)
                      );
                    }}
                  />
                  {column}
                </label>
              ))}
            </div>
          </div>
        )}
        <Select value={chartType} onValueChange={(value) => setChartType(value as "bar" | "line")}> {/* Removed pie from here */}
          <SelectTrigger>
            <SelectValue placeholder="Select chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Bar</SelectItem>
            <SelectItem value="line">Line</SelectItem>
          </SelectContent>
        </Select>
        {data.length > 0 && selectedColumns.length > 0 && renderChart()}
      </CardContent>
    </Card>
  );
}
