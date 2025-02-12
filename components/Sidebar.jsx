import React, {useEffect, useState} from "react"
import "tailwindcss/tailwind.css"
import {AnimatePresence} from "framer-motion"
import Allocation from "./Allocation"
import Group from "./Group"
import GroupButton from "./GroupButton"
import makeApiRequest from "../libs/makeApiRequest"
import LayoutButton from "./LayoutButton"
import {useData} from "../libs/data"
export default function Sidebar() {
	const props = (() => {const {categories, ledgerEntries, ...rest} = useData(); return rest})()
	const [selectedAllocations, setSelectedAllocations] = useState([])
	const handleGroup = async name => {
		const {group: {id: groupId}} = await makeApiRequest("/api/createGroup", {name})
		await Promise.all(selectedAllocations.map(async id => makeApiRequest("/api/editAllocation", {id, groupId})))
		await props.reload()
	}
	return (
		<div className="h-full flex flex-col gap-5 overflow-y-auto no-scrollbar rounded-3xl bg-white bg-opacity-60 backdrop-blur-sm shadow-black shadow-md p-3">
			<AnimatePresence>
				{selectedAllocations.length > 0 && <GroupButton onGroup={selectedAllocations.length > 0 && handleGroup} key="gb" />}
				{
					props.groups.map(g => (
						<Group
							{...g}
							key={"g" + g.id}
							onDelete={id => props.setGroups(prev => prev.filter(g => g.id != id))}
							setGroupAllocations={p => props.setGroups(pgs => {
								const ngs = [...pgs]
								const gi = ngs.findIndex(cg => cg.id == g.id)
								ngs[gi].allocations = p instanceof Function ? p(ngs[gi].allocations) : p
								return ngs
							})}
							setAllocations={props.setAllocations}
						/>
					))
				}
				{
					props.allocations.map(a => (
						<Allocation
							key={"a" + a.id}
							data={a}
							onDelete={id => props.setAllocations(prev => prev.filter(a => a.id != id))}
							onSelect={id => setSelectedAllocations(prev => {
								if(prev.some(s => s == id)) return prev.filter(s => s != id)
								const n = [...prev]; n.push(id); return n
							})}
							setAllocations={props.setAllocations}
						/>
					))
				}
				<LayoutButton
					onClick={() => props.setAllocations(pas => [...pas, {id: Math.max(...props.allocations.map(a => a.id)) + 1}])}
					text="Create new"
					key="cb"
				/>
			</AnimatePresence>
		</div>
	)
}