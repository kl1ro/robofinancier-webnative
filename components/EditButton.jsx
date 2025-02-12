import React from "react"
import {MdEdit} from "react-icons/md"
import "tailwindcss/tailwind.css"
/**
 * @param {Object} props
 * @param {Function} props.onClick
 * @param {Number} props.size
*/
export default function EditButton(props) {
	return (
		<button onClick={props.onClick}>
			<MdEdit size={props.size || 40} className="rounded-full hover:bg-slate-400 hover:text-white transition-colors duration-300 p-1" />
		</button>
	)
}