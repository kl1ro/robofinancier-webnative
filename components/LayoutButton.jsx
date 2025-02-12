import React from "react"
import "tailwindcss/tailwind.css"
import {fadeInOut} from "../libs/animations"
import {motion} from "framer-motion"
/**
 * @param {Object} props
 * @param {Function} props.onClick
 * @param {String} props.text
*/
export default function LayoutButton(props) {
	return (
		<motion.button
			className="w-full text-center rounded-3xl bg-gray-700 bg-opacity-40 py-4 transition-colors duration-300 hover:bg-gray-500 text-xl text-white font-bold 2xl:text-2xl"
			layout {...fadeInOut}
			onClick={props.onClick}
		>
			{props.text}
		</motion.button>
	)
}