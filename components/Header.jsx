import React from "react"
import "tailwindcss/tailwind.css"
import {FaMoneyBillAlt} from "react-icons/fa"
import {IoMdSettings} from "react-icons/io"
import Link from "./Link"
import {useSettings} from "../libs/settings"
export default function Header({openSlideover}) {
	const {setIsOpen: setIsSettingsModalOpen} = useSettings()
	return (
		<div className="h-16 rounded-3xl bg-white bg-opacity-60 backdrop-blur-sm flex items-center shadow-md shadow-black px-5">
			<button onClick={openSlideover} className="lg:hidden">
				<FaMoneyBillAlt size={30} className="text-gray-800" />
			</button>
			<div className="flex flex-1 gap-7 lg:gap-12 px-4 justify-center">
				<Link label="Home" href="/home" />
				<Link label="Ledger" href="/ledger" />
				<Link label="Notes" href="/notes" />
			</div>
			<button onClick={() => setIsSettingsModalOpen(true)}>
				<IoMdSettings size={35} className="p-1" />
			</button>
		</div>
	)
}