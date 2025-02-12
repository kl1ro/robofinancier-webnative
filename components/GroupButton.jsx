import React, {useState} from "react"
import {motion} from "framer-motion"
import "tailwindcss/tailwind.css"
import ExitButton from "./ExitButton"
import toast from "react-hot-toast"
import {fadeInOut} from "../libs/animations"
/**
 * @param {Object} props
 * @param {Function} props.onGroup
*/
export default function GroupButton(props) {
	const [clicked, setClicked] = useState(false)
	const [name, setName] = useState("")
	if(!props.onGroup && clicked) setClicked(false)
	const handleGroup = () => {
		if(!name) {toast.error("Name is required"); return}
		props.onGroup(name); setName(""); setClicked(false)
	}
	return (
		<motion.div layout {...fadeInOut} className="text-xl text-white font-bold 2xl:text-2xl">
			{
				!(clicked && props.onGroup) ? (
					<button
						className="w-full text-center rounded-3xl bg-gray-700 bg-opacity-40 py-4 transition-colors duration-300 hover:bg-gray-500"
						onClick={() => setClicked(true)}
					>
						Group selected
					</button>
				) : (
					<div className="bg-gray-600 bg-opacity-40 flex flex-col gap-5 p-3 rounded-3xl">
						<div className="flex">
							<div className="flex-[3] flex items-center">
								<input
									type="text"
									className="w-full rounded-full py-2 px-4 outline-none text-black placeholder:text-center text-center"
									placeholder="Name"
									onChange={event => setName(event.target.value)}
								/>
							</div>
							<div className="flex-[1] flex justify-center items-center">
								<ExitButton onClick={() => setClicked(false)} />
							</div>
						</div>
						<button
							onClick={handleGroup}
							className="py-2 rounded-full bg-gray-800 bg-opacity-40 hover:bg-gray-600 transition-colors duration-300 text-2xl"
						>
							Submit
						</button>
					</div>
				)
			}
		</motion.div>
	)
}