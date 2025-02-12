import React from "react"
import {AnimatePresence, motion} from "framer-motion"
import {modalBackgroundAnimation} from "../libs/animations"
export default function Slideover({children, isOpen, setIsOpen}) {
	return (
		<>
			<div className={`fixed top-0 ${isOpen ? "left-0" : "-left-72"} p-3 w-72 h-screen transition-[left] duration-300 z-50`}>
				{children}
			</div>
			<AnimatePresence>
				{
					isOpen && (
						<motion.div
							{...modalBackgroundAnimation}
							className="fixed top-0 left-0 w-screen h-screen z-40 bg-black"
							onClick={() => setIsOpen(false)}
						/>
					)
				}
			</AnimatePresence>
		</>
	)
}