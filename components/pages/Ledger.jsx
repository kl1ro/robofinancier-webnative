import React, {useEffect, useState} from "react"
import LedgerEntry from "../LedgerEntry"
import {AnimatePresence} from "framer-motion"
import makeApiRequest from "../../libs/makeApiRequest"
import {useSettings} from "../../libs/settings"
export default function Ledger() {
	const {settings} = useSettings()
	const [entries, setEntries] = useState([])
	useEffect(() => {makeApiRequest("/api/getLedgerEntries", {
		orderBy: {date: "desc"}, where: {date: {gte: settings.range.l, lte: settings.range.r}}
	}).then(({ledgerEntries: es}) => setEntries(es))}, [settings.range])
	return (
		<div className="h-full grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
			<button
				onClick={() => setEntries(es => {let id = 1; entries.forEach(e => {if(e.id > id) id = e.id + 1}); return [{id}, ...es]})}
				className="text-2xl font-extrabold rounded-xl flex justify-center items-center bg-white h-[137px] shadow-black shadow-md"
			>
				+
			</button>
			<AnimatePresence>
				{entries.map(e => <LedgerEntry data={e} key={e.id} setEntries={setEntries} />)}
			</AnimatePresence>
		</div>
	)
}