import React, {useEffect, useState} from "react"
import ApexChart from "react-apexcharts"
import {Pie} from "react-chartjs-2"
import {Chart, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend} from "chart.js"
import "tailwindcss/tailwind.css"
import {useData} from "../../libs/data"
import {useSettings} from "../../libs/settings"
Chart.register(CategoryScale, LinearScale, PointElement, Tooltip, Legend, ArcElement)
export default function Home() {
	const entries = useData().ledgerEntries
	const {settings} = useSettings()
	const [months, setMonths] = useState([])
	const [categories, setCategories] = useState({incomes: {}, costs: {}})
	useEffect(() => {
		let [amount, months, categories] = [0, [], {incomes: {}, costs: {}}]
		entries.forEach(e => {
			let cur = new Date(e.date)

			// Make the categories statistics
			if(cur >= settings.range.l && cur <= settings.range.r) {
				if(e.amount > 0) {
					if(!categories.incomes.hasOwnProperty(e.categoryId)) 
						categories.incomes[e.categoryId] = {name: e.category.name, total: 0}
					categories.incomes[e.categoryId].total += e.amount
				}
				else {
					if(!categories.costs.hasOwnProperty(e.categoryId))
						categories.costs[e.categoryId] = {name: e.category.name, total: 0}
					categories.costs[e.categoryId].total += e.amount
				}
			}

			// Make the months statistics
			amount += e.amount
			let prev = months[months.length - 1]
			prev = prev?.date && new Date(prev.date)
			const divided = amount / 100
			if(prev && prev.getFullYear() == cur.getFullYear() && prev.getMonth() == cur.getMonth())
				months[months.length - 1].amount = divided
			else {
				cur.setDate(1)
				months.push({date: cur.toISOString(), amount: divided})
			}
		})
		setMonths(months)
		setCategories(categories)
	}, [entries, settings.range])
	return (
		<div className="h-full flex flex-col gap-3">
			<div className="p-3 bg-white rounded-3xl">
				<ApexChart
					type="area"
					series={[{name: "Amount", data: months.map(s => s.amount)}]}
					options={{
						chart: {id: "area-chart", toolbar: {show: true, tools: {
							download: false, selection: false, zoom: true, zoomin: false, zoomout: false, pan: false, reset: true
						}}},
						stroke: {curve: "smooth"},
						xaxis: {type: "datetime", categories: months.map(s => s.date)},
						title: {text: "Account state by months", align: "left"},
						tooltip: {x: {format: "dd/MM/yy"}},
						dataLabels: {enabled: false}
					}}
					height={230}
				/>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="bg-gray-700 bg-opacity-50 p-3 rounded-3xl flex flex-col gap-3">
					<div className="flex justify-between text-white font-semibold px-4">
						<p>Incomes by categories</p>
						<p>Total: {Object.values(categories.incomes).reduce((s, c) => s + c.total, 0) / 100} c.u.</p>
					</div>
					<div className="flex justify-center items-center px-5">
						<Pie 
							data={{ 
								labels: Object.values(categories.incomes).map(c => c.name),
								datasets: [{
									data: Object.values(categories.incomes).map(c => c.total / 100),
									backgroundColor: "rgba(56, 231, 80, .75)"
								}]
							}}
							options={{plugins: {legend: {display: false}}}}
							width="full"
						/>
					</div>
				</div>
				<div className="bg-gray-700 bg-opacity-50 p-3 rounded-3xl flex flex-col gap-4">
					<div className="flex justify-between text-white font-semibold px-4">
						<p>Costs by categories</p>
						<p>Total: {Object.values(categories.costs).reduce((s, c) => s + c.total, 0) / 100} c.u.</p>
					</div>
					<div className="flex justify-center items-center px-5">
						<Pie 
							data={{ 
								labels: Object.values(categories.costs).map(c => c.name),
								datasets: [{
									data: Object.values(categories.costs).map(c => c.total / 100),
									backgroundColor: "rgba(230, 36, 36, .75)"
								}]
							}}
							options={{plugins: {legend: {display: false}}}}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}