import "tailwindcss/tailwind.css"
import React, {useState} from "react"
import {motion} from "framer-motion"
import {fadeInOut} from "../libs/animations"
import EditButton from "./EditButton"
import ExitButton from "./ExitButton"
import {useData} from "../libs/data"
import makeApiRequest from "../libs/makeApiRequest"
import toast from "react-hot-toast"
/**
 * @param {Object} props
 * @param {Object} props.data
 * @param {Number} props.data.id
 * @param {String} props.data.date
 * @param {Number} props.data.allocationId
 * @param {Number} props.data.groupId
 * @param {Number} props.data.categoryId
 * @param {Number} props.data.amount
 * @param {String} props.data.record
 * @param {Object} props.data.allocation
 * @param {Object} props.data.group
 * @param {Object} props.data.category
 * @param {Function} props.setEntries
*/
export default function LedgerEntry(props) {
	let {categories, allocations, groups, reload} = useData()
	allocations = [...allocations, ...groups.flatMap(g => g.allocations)]
	const [data, setData] = useState(props.data)
	const [form, setForm] = useState(props.data)
	const [isBeingEdited, setIsBeingEdited] = useState(!props.data.amount)
	return (
		<motion.div layout {...fadeInOut} className="flex flex-col gap-3 h-fit rounded-xl bg-white shadow-black shadow-md text-md font-bold p-1">
			{
				!isBeingEdited ? (
					<>
						<div className="flex gap-4">
							<div className="bg-blue-700 rounded-full w-3/4 text-white flex justify-center items-center">
								{new Date(data.date).toDateString()}
							</div>
							<div className="flex-[1] flex justify-center items-center">
								<EditButton size={30} onClick={() => setIsBeingEdited(true)} />
							</div>
						</div>
						<div className="px-3 flex flex-col gap-3">
							<div className="grid grid-cols-2 gap-3">
								<div className="px-2 border-black border-2 rounded-full text-center truncate">
									{data.group?.name || data.allocation?.name || "All"}
								</div>
								<div className="px-2 border-black border-2 rounded-full text-center truncate">
									{data.category.name}
								</div>
							</div>
							{data.record && <div className="rounded-2xl bg-slate-100 px-3 py-3">{data.record}</div>}
						</div>
						<div className={`mx-6 rounded-full py-1 ${data.amount > 0 ? "bg-green-300" : "bg-red-300"}`} />
						<div className="flex justify-end px-6 text-lg font-bold">
							<div>{data.amount / 100} c.u.</div>
						</div>
					</>
				) : (
					<>
						<div className="flex gap-4">
							<input
								type="date"
								onChange={event => setForm(f => ({...f, date: new Date(event.target.value).toISOString()}))}
								defaultValue={form.date?.slice(0, 10) || new Date().toISOString().slice(0, 10)}
								className="bg-blue-700 rounded-full w-3/4 text-white flex justify-center items-center"
							/>
							{
								data.amount && (
									<div className="flex-[1] flex justify-center items-center">
										<ExitButton size={30} onClick={() => {setIsBeingEdited(false); setForm(data)}} />
									</div>
								)
							}
						</div>
						<div className="grid grid-cols-2">
							<div className="text-center">Amount</div>
							<div className="text-center">Allocation</div>
						</div>
						<div className="grid grid-cols-2 gap-3 px-3">
							<input
								type="number"
								className="border-gray-300 border-2 rounded-lg px-2"
								defaultValue={form.amount ? (form.amount / 100) : 0}
								onChange={e => setForm(f => ({...f, amount: Number(e.target.value) * 100}))}
							/>
							<select
								onChange={event => setForm(f => ({...f, ...(() => (
									(event.target.value.startsWith("a") && {groupId: null, allocationId: Number(event.target.value.slice(1))}) ||
									(event.target.value.startsWith("g") && {allocationId: null, groupId: Number(event.target.value.slice(1))}) ||
									{}
								))()}))}
								value={(form.allocationId && "a" + form.allocationId) || (form.groupId && "g" + form.groupId) || "all"}
							>
								{
									allocations.length ? (
										<>
											<option value="all" key="allocation all">All</option>
											<optgroup label="Allocations" key="allocations optgroup">
												{allocations.map(a => <option value={"a" + a.id} key={"a" + a.id}>{a.name}</option>)}
											</optgroup>
											{
												groups.length > 0 && (
													<optgroup label="Allocations groups">
														{groups.map(g => <option value={"g" + g.id} key={"g" + g.id}>{g.name}</option>)}
													</optgroup>
												)
											}
										</>
									) : <option value={"none"} key="n">No allocations</option> 
								}
							</select>
            </div>
						<div className="grid grid-cols-2 gap-3 px-3">
							<div className="text-center">Category</div>
							<select
								onChange={e => setForm(f => ({...f, category: {
									id: Number(e.target.value) ? Number(e.target.value) : e.target.value,
									name: categories.find(c => c.id == Number(e.target.value))?.name
								}}))}
								value={form.category?.id}
							>
								<option value="new">New category</option>
								{categories.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}
							</select>
						</div>
						{
							form.category?.id == "new" ? (
								<div className="grid grid-cols-2 gap-3 px-3">
									<div className="text-center">Name:</div>
									<input
										type="text"
										className="rounded-lg border-gray-300 border-2 px-2"
										onChange={e => setForm(f => ({...f, category: {id: "new", name: e.target.value}}))}
									/>
								</div>
							) : "" 
						}
						<div className="px-3">
							<textarea
								className="rounded-lg border-gray-300 border-2 px-2 min-h-10 w-full"
								placeholder="Record"
								defaultValue={form.record}
								onChange={e => setForm(f => ({...f, record: e.target.value}))}
							/>
						</div>
						<div className="grid grid-cols-2 gap-2">
							<button
								className="px-2 py-1 bg-blue-700 text-white rounded-full transition-colors duration-300 hover:bg-blue-500"
								onClick={async () => {
									try {
										const {allocation, group, category, id, ...rest} = form
										if(!data.amount) var {ledgerEntry: e} = await makeApiRequest("/api/createLedgerEntry", {...rest, categoryId: category.id})
										else await makeApiRequest("/api/editLedgerEntry", {id, ...rest})
										await reload()
										setData(e || form)
										setIsBeingEdited(false)
									} catch(e) {toast.error(e.message)}
								}}
							>
								Save
							</button>
							<button
								className="px-2 py-1 bg-red-500 text-white rounded-full transition-colors duration-300 hover:bg-red-700"
								onClick={async () => {
									if(!data.amount) {props.setEntries(es => es.filter(e => e.id != data.id)); return}
									await makeApiRequest("/api/deleteLedgerEntry", {id: data.id})
									await reload()
									props.setEntries(es => es.filter(e => e.id != data.id))
								}}
							>
								Delete
							</button>
						</div>
					</>
				)
			}
		</motion.div>
	)
}