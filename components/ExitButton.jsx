import React from "react"
import {RxCross2} from "react-icons/rx"
import "tailwindcss/tailwind.css"
/**
 * @param {Object} props
 * @param {Function} props.onClick
 * @param {Number} props.size
*/
export default function ExitButton(props) {
	return (
		<button onClick={props.onClick}>
			<RxCross2 size={props.size || 40} className="rounded-full hover:bg-slate-400 hover:text-white transition-colors duration-300 p-1" />
		</button>
	)
}