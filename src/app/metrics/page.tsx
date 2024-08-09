"use client";

import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto"; // Automatically register the required components
import { routes } from "@/service/api/routes";

interface StoryMetrics {
	topic_name: string;
	stories_started: number;
	stories_completed: number;
	stories_abandoned: number;
}

const MetricsPage = () => {
	const [data, setData] = useState<StoryMetrics[]>([]);
	const [year, setYear] = useState(new Date().getFullYear());
	const [month, setMonth] = useState(new Date().getMonth() + 1);

	const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const yearStr = event.target.value;
		const yearInt = parseInt(yearStr);
		setYear(yearInt);
	};

	const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monthStr = event.target.value;
		const monthInt = parseInt(monthStr);
		setMonth(monthInt);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { data } = await routes.metrics(year, month);
				setData(data ?? []);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [year, month]);

	const chartData = {
		labels: data.map(item => item.topic_name),
		datasets: [
			{
				label: "Stories Started",
				data: data.map(item => item.stories_started),
				backgroundColor: "rgba(75, 192, 192, 0.5)",
			},
			{
				label: "Stories Completed",
				data: data.map(item => item.stories_completed),
				backgroundColor: "rgba(54, 162, 235, 0.5)",
			},
			{
				label: "Stories Abandoned",
				data: data.map(item => item.stories_abandoned),
				backgroundColor: "rgba(255, 99, 132, 0.5)",
			},
		],
	};

	return (
		<div className="flex flex-col items-center w-full space-y-4 p-8">
			<h1>Metrics Dashboard</h1>
			{/* Controls */}
			<div className="flex flex-col items-start space-y-4">
				<div
					className="flex items-center justify-center space-x-2"
					style={{ width: "10rem" }}
				>
					<label htmlFor="year">Year:</label>
					<input
						id="year"
						type="number"
						value={year}
						onChange={handleYearChange}
						className="text-black rounded-md p-2"
					/>
				</div>
				<div
					className="flex items-center justify-center space-x-2"
					style={{ width: "10rem" }}
				>
					<label htmlFor="month">Month:</label>
					<input
						id="month"
						type="number"
						min="1"
						max="12"
						value={month}
						onChange={handleMonthChange}
						className="text-black rounded-md p-2"
					/>
				</div>
			</div>
			{/* Chart */}
			<div
				className="flex flex-col items-center w-full space-y-4"
				style={{ overflowY: "auto" }}
			>
				{data.length > 0 ? (
					<div className="justify-center flex flex-col items-center h-screen w-full space-y-4">
						<Pie data={chartData} />
					</div>
				) : (
					<p>No data available</p>
				)}
			</div>
		</div>
	);
};

export default MetricsPage;
