import React, {useState, useRef, useEffect} from "react"
import {AnimatePresence, motion} from "framer-motion"
import {fadeInOut} from "../libs/animations"
import Allocation from "./Allocation"
import "tailwindcss/tailwind.css"
import LayoutButton from "./LayoutButton"
import PutButton from "./PutButton"
import makeApiRequest from "../libs/makeApiRequest"
import toast from "react-hot-toast"
/**
 * @param {Object} props
 * @param {Number} props.id
 * @param {String} props.name
 * @param {Array} props.allocations
 * @param {Function} props.onDelete
 * @param {Function} props.setAllocations
 * @param {Function} props.setGroupAllocations
*/
export default function Group(props) {
	const [selected, setSelected] = useState([])
	const [moneyToPut, setMoneyToPut] = useState(0)
	useEffect(() => {setMoneyToPut(props.allocations.reduce((s, a) => s + a.moneyToPut, 0))}, [props.allocations])
	const tickers = {amount: useRef(null)}
	// Observers seem to not work in webkit2gtk
	// useEffect(() => {
	// 	new ResizeObserver(() => {
	// 		if(!tickers.amount.current) return
	// 		if(tickers.amount.current.scrollWidth > tickers.amount.current.clientWidth) tickers.amount.current.classList.add("ticker")
	// 		else tickers.amount.current.classList.remove("ticker")
	// 	}).observe(tickers.amount.current)
	// }, [])
	useEffect(() => {if(props.allocations.length == 0) props.onDelete(props.id)})
	const disconnect = async () => {
		await Promise.all(selected.map(id => makeApiRequest("/api/editAllocation", {id, groupId: null})))
		props.setAllocations(pas => [...pas, ...props.allocations.filter(a => selected.includes(a.id))])
		if(selected.length == props.allocations.length) {props.onDelete(props.id); return}
		props.setGroupAllocations(pas => pas.filter(a => !selected.includes(a.id)))
		setSelected([])
	}
	return (
		<motion.div layout {...fadeInOut} className="bg-gray-700 bg-opacity-40 p-3 rounded-3xl flex flex-col gap-5 text-2xl">
			{
				moneyToPut ? (
					<PutButton
						moneyToPut={moneyToPut}
						onPut={async amount => {
							try {
								const nas = await Promise.all(props.allocations.map(async a => {
									const da = amount * a.moneyToPut / moneyToPut
									const na = a.amount + da
									const nm = a.moneyToPut - da
									const n = {...a, moneyToPut: nm, amount: na}
									await makeApiRequest("/api/editAllocation", n)
									return n
								}))
								setMoneyToPut(p => p - amount)
								props.setGroupAllocations(nas)
							} catch(e) {toast.error(e.message)}
						}}
					/>
				) : <></>
			}
			<div className="bg-gray-300 bg-opacity-30 px-4 py-2 rounded-full text-white font-bold">
				{props.name}
			</div>
			<div className="flex text-xl text-white font-bold gap-5">
				<div className="flex-[1] bg-gray-300 bg-opacity-30 rounded-full overflow-hidden py-2">
					<div ref={tickers.amount} className="text-center whitespace-nowrap px-4 ticker" style={{"--duration": `${5 + Math.random() * 2}s`}}>
						{props.allocations.reduce((sum, a) => sum + a.amount, 0) / 100} c.u.
					</div>
				</div>
				<div className="flex-[1] bg-gray-300 bg-opacity-30 rounded-full overflow-hidden py-2">
					<div className="text-center whitespace-nowrap px-4">
						{props.allocations.reduce((sum, a) => sum + a.rate, 0)}%
					</div>
				</div>
			</div>
			<AnimatePresence>
				{
					props.allocations.map(a => (
						<Allocation
							key={a.id}
							data={a}
							onDelete={id => props.setGroupAllocations(prev => prev.filter(a => a.id != id))}
							onSelect={id => setSelected(prev => {
								if(prev.some(s => s == id)) return prev.filter(s => s != id)
								const n = [...prev]; n.push(id); return n
							})}
							setAllocations={props.setGroupAllocations}
						/>
					))
				}
			</AnimatePresence>
			{selected.length > 0 && <LayoutButton text="Disconnect" onClick={disconnect} />}
		</motion.div>
	)
}