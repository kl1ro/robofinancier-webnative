import React, {useEffect, useLayoutEffect, useState} from "react"
import "tailwindcss/tailwind.css"
import toast, {Toaster} from "react-hot-toast"
import {routes, RouterContext} from "../libs/router"
import {DataContext} from "../libs/data"
import {SettingsContext} from "../libs/settings"
import Slideover from "../components/Slideover"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import makeApiRequest from "../libs/makeApiRequest"
import SettingsModal from "../components/SettingsModal"
const backgroundImage = `url(./backgrounds/${Math.round(Math.random() * 6)}.jpg)`
const now = new Date()
const [m, y] = [now.getMonth(), now.getFullYear()]
export default function App() {
	const [path, setPath] = useState("/")
	const [isSlideoverOpen, setIsSlideoverOpen] = useState(false)
	const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
	const [data, setData] = useState({allocations: [], groups: [], ledgerEntries: [], categories: []})
	const [settings, setSettings] = useState({
		range: (() => {
			const [l, r] = [new Date(), new Date()]
			l.setDate(1); r.setDate(31)
			return {l, r}
		})()
	})
	const reload = () => Promise.all([
		makeApiRequest("/api/getAllocations").then(({allocations}) => setData(d => ({...d, allocations}))),
		makeApiRequest("/api/getGroups").then(({groups}) => setData(d => ({...d, groups}))),
		makeApiRequest("/api/getLedgerEntries").then(({ledgerEntries}) => setData(d => ({...d, ledgerEntries})))
	])
	useLayoutEffect(() => {(async () => {
		await reload().catch(e => toast.error(e.message))
	})()}, [])
	useEffect(() => {
		setData(d => ({...d, categories: (() => {
			const cs = []; data.ledgerEntries.forEach(e => {if(!cs.some(c => c.id == e.category.id)) cs.push(e.category)}); return cs
		})()}))
	}, [data.ledgerEntries])
	return (
		<RouterContext.Provider value={{navigate: setPath}}>
			<DataContext.Provider value={{
				...data,
				setAllocations: c => setData(d => ({...d, allocations: c instanceof Function ? c(d.allocations) : c})),
				setGroups: c => setData(d => ({...d, groups: c instanceof Function ? c(d.groups) : c})),
				setLedgerEntries: c => setData(d => ({...d, ledgerEntries: c instanceof Function ? c(d.ledgerEntries) : c})),
				reload
			}}>
				<SettingsContext.Provider value={{settings, setSettings, isOpen: isSettingsModalOpen, setIsOpen: setIsSettingsModalOpen}}>
					<div className="h-full bg-cover" style={{backgroundImage}}>
						<div className="h-full bg-black bg-opacity-30 p-3 flex gap-3">
							<div className="w-72 hidden lg:block">
								<Sidebar />
							</div>
							<div className="flex flex-col flex-1 gap-3">
								<div className="hidden lg:block">
									<Header openSlideover={() => setIsSlideoverOpen(true)} />
								</div>
								<div className="flex-1 bg-white bg-opacity-60 backdrop-blur-sm rounded-3xl p-3 shadow-md shadow-black overflow-y-auto no-scrollbar">
									{routes[path] || routes["/"]}
								</div>
								<div className="lg:hidden">
									<Header openSlideover={() => setIsSlideoverOpen(true)} />
								</div>
							</div>
						</div>
					</div>
					<Toaster />
					<Slideover isOpen={isSlideoverOpen} setIsOpen={setIsSlideoverOpen}>
						<Sidebar />
					</Slideover>
					<SettingsModal />
				</SettingsContext.Provider>
			</DataContext.Provider>
		</RouterContext.Provider>
	)
}