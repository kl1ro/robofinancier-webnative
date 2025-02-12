import React, {useRef, useState, memo} from "react"
import {motion} from "framer-motion"
import "tailwindcss/tailwind.css"
import {fadeInOut} from "../libs/animations"
import ExitButton from "./ExitButton"
import toast from "react-hot-toast"
import makeApiRequest from "../libs/makeApiRequest"
import PutButton from "./PutButton"
const keys = ["id", "groupId", "name", "rate", "amount", "remind", "moneyToPut"]
/**
 * @param {Object} props
 * @param {Object} props.data
 * @param {Number} props.data.id
 * @param {Number} props.data.groupId
 * @param {String} props.data.name
 * @param {Number} props.data.rate
 * @param {Number} props.data.amount
 * @param {boolean} props.data.remind
 * @param {Number} props.data.moneyToPut
 * @param {Function} props.setAllocations
 * @param {Function} props.onDelete
 * @param {Function} props.onSelect
*/
const Allocation = props => {
	const [form, setForm] = useState(props.data)
	const [isBeingEdited, setIsBeingEdited] = useState(Object.keys(props.data).length != keys.length)
	const [isSelected, setIsSelected] = useState(false)
	const tickers = {amount: useRef(null), name: useRef(null)}
	// Observers seem to not work in webkit2gtk
	// useEffect(() => {
	// 	const observers = ["amount", "name"].map(k => {
	// 		if(!tickers[k].current) return
	// 		const instance = new ResizeObserver(() => {
	// 			if(!tickers[k].current) return
	// 			if(tickers[k].current.scrollWidth >= tickers[k].current.clientWidth) tickers[k].current.classList.add("ticker")
	// 			else tickers[k].current.classList.remove("ticker")
	// 		})
	// 		instance.observe(tickers[k].current)
	// 		return instance
	// 	})
	// 	return () => observers.forEach(o => o && o.disconnect())
	// }, [isBeingEdited])
	return (
		<motion.div layout {...fadeInOut} className="flex flex-col gap-4 bg-white rounded-3xl p-3 text-2xl font-bold">
			{
				!isBeingEdited ? (
					<>
						{
							(props.data.moneyToPut && !props.data.groupId) ? (
								<PutButton
									moneyToPut={props.data.moneyToPut}
									onPut={async amount => {
										try {
											const nm = props.data.moneyToPut - amount
											const na = props.data.amount + amount
											await makeApiRequest("/api/editAllocation", {id: props.data.id, moneyToPut: nm, amount: na})
											props.setAllocations(pas => {
												const nas = [...pas]
												const n = {...props.data, moneyToPut: nm, amount: na}
												nas[nas.findIndex(a => a.id == props.data.id)] = n
												setForm(n)
												return nas
											})
										} catch(e) {toast.error(e.message)}
									}}
								/>
							) : <></>
						}
						<div className="flex justify-between gap-7 items-center">
							<div className="flex-[2] bg-blue-700 text-white rounded-full py-2 overflow-hidden">
								<div ref={tickers.name} className="text-center whitespace-nowrap px-4 ticker" style={{"--duration": `${5 + Math.random() * 2}s`}}>
									{props.data.name}
								</div>
							</div>
							<div className="flex-[1]">
								{props.data.rate}%
							</div>
						</div>
						<div className="flex gap-5">
							<div className="flex-[2] overflow-hidden rounded-full">
								<div ref={tickers.amount} className="text-center whitespace-nowrap ticker" style={{"--duration": `${5 + Math.random() * 2}s`}}>
									{props.data.amount / 100} c.u.
								</div>
							</div>
							<div className="flex-1 flex justify-end gap-5 items-center">
								<button onClick={() => setIsBeingEdited(true)} className="px-1 py-1">
									Edit
								</button>
								<button
									className={`w-7 h-7 border-black border-2 rounded-full ${isSelected && "bg-blue-600"} transition-colors duration-300`}
									onClick={() => {setIsSelected(!isSelected); props.onSelect(props.data.id)}}
								/>
							</div>
						</div>
					</>
				) : (
					<>
						<div className="flex pr-3">
							<div className="flex-[2]">
								<input
									type="text"
									className="w-full bg-blue-700 text-white rounded-full py-2 text-center focus:outline-none placeholder:text-slate-200"
									defaultValue={props.data.name}
									placeholder="Name"
									onChange={event => setForm({...form, name: event.target.value})}
								/>
							</div>
							{
								Object.keys(props.data).length == keys.length && (
									<div className="flex-[1] flex justify-end items-center">
										<ExitButton onClick={() => {setIsBeingEdited(false); setForm({...props.data})}} />
									</div>
								)
							}
						</div>
						<div className="flex gap-5">
							<div className="flex-[1] text-center">
								Amount
							</div>
							<div className="flex-[1] text-center">
								Rate
							</div>
						</div>
						<div className="flex gap-5">
							<input
								type="number"
								className="w-full shadow-gray-600 shadow-md rounded-full py-2 focus:outline-none text-center px-4"
								defaultValue={props.data.amount ? (props.data.amount / 100) : 0}
								onChange={event => setForm({...form, amount: Number(event.target.value) * 100})}
							/>
							<input
								type="number"
								className="w-full shadow-gray-600 shadow-md rounded-full py-2 text-center focus:outline-none px-4"
								defaultValue={props.data.rate ? props.data.rate : 0}
								onChange={event => setForm({...form, rate: Number(event.target.value)})}
							/>
						</div>
						<form className="flex gap-5">
							<div className="flex-[1] flex justify-center">
								<label htmlFor="remind" className="cursor-pointer">Remind</label>
							</div >
							<div className="flex-[1] flex justify-center">
								<input
									id="remind"
									type="checkbox"
									className="cursor-pointer h-7 w-7"
									defaultChecked={props.data.remind}
									onChange={event => setForm({...form, remind: event.target.checked})}
								/>
							</div>
						</form>
						<div className="flex gap-2">
							<button
								className="flex-[1] px-2 py-2 bg-blue-700 text-white rounded-full transition-colors duration-300 hover:bg-blue-500"
								onClick={async () => {
									try {
										if(Object.keys(props.data).length != keys.length) {
											const {id, ...rest} = form
											var {allocation} = await makeApiRequest("/api/createAllocation", rest)
										}
										else await makeApiRequest("/api/editAllocation", form)
										props.setAllocations(pas => {
											const nas = [...pas]
											nas[nas.findIndex(a => a.id == props.data.id)] = allocation || form
											return nas
										})
										setIsBeingEdited(false)
									} catch(e) {toast.error(e.message)}
								}}
							>
								Save
							</button>
							<button
								className="flex-[1] px-2 py-2 bg-red-500 text-white rounded-full transition-colors duration-300 hover:bg-red-700"
								onClick={async () => {
									try {
										if(Object.keys(props.data).length != keys.length) {props.onDelete(props.data.id); return}
										await makeApiRequest("/api/deleteAllocation", {id: props.data.id})
										props.onDelete(props.data.id)
									} catch(e) {toast.error(e.message)}
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
export default memo(Allocation)