import React from "react"
import "tailwindcss/tailwind.css"
import {useState} from "react"
import {motion} from "framer-motion"
import toast from "react-hot-toast"
/**
 * @param {Object} props
 * @param {Number} props.moneyToPut
 * @param {Function} props.onPut
*/
export default function PutButton(props) {
	const [formFlag, setFormFlag] = useState(false)
	const [amount, setAmount] = useState(props.moneyToPut)
	const put = () => {
		if(amount <= 0) {toast.error("Amount to put needs to be more than 0"); return}
		if(amount > props.moneyToPut) {setErrorMessage("Amounts needs to be less or equal to the money you need to put"); return}
		setFormFlag(false)
		setAmount(props.moneyToPut - amount)
		props.onPut(amount)
	}
	return (  
		<motion.div layout className="h-fit">
			{
				!formFlag ? (
					<button
						className="w-full h-12 text-white bg-rose-500 rounded-3xl flex justify-center items-center p-1 font-extrabold text-lg transition-all duration-300 hover:scale-105"
						onClick={() => setFormFlag(true)}
					>
						Put {props.moneyToPut / 100} c.u.
					</button>
				) : (
					<div className="transition-all duration-300 bg-slate-500 flex flex-col space-y-4 rounded-3xl h-fit text-xl font-extrabold p-3">
						<div className="flex flex-row text-base"> 
							<input
								className="bg-slate-400 w-2/3 px-2 text-white rounded-lg"
								type="number"
								value={amount / 100}
								onChange={event => setAmount(Number(event.target.value) * 100)}
							/>
							<button className="bg-blue-700 ml-4 text-lg px-2 rounded-lg text-white" onClick={put}>Submit</button>
						</div>
						<button
							className="bg-orange-500 transition-all duration-300 hover:scale-105 text-white ml-2 h-auto rounded-3xl font-extrabold items-center p-1 px-3"
							type="button" 
							onClick={() => {setFormFlag(false); setAmount(props.moneyToPut)}}
						>
							Cancel
						</button>
					</div>
				)
			}
		</motion.div>
	)
}