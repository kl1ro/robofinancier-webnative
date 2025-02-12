import React from "react"
import "tailwindcss/tailwind.css"
import {RxCross2} from "react-icons/rx"
import {AnimatePresence, motion} from "framer-motion"
import {modalBackgroundAnimation, scaleInOut} from "../libs/animations"
import {useSettings} from "../libs/settings"
export default function SettingsModal() {
	const {settings, setSettings, isOpen, setIsOpen} = useSettings()
	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div {...modalBackgroundAnimation} className="fixed top-0 left-0 w-screen h-screen bg-black" />
					<div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
						<div onClick={() => setIsOpen(false)} className="w-full h-full z-[1]"/>
						<motion.div {...scaleInOut} className="px-4 md:px-0 w-full md:w-[600px] max-h-96 absolute z-[2]">
							<div className="h-full rounded-3xl bg-white text-white backdrop-blur-sm bg-opacity-30 shadow-xl shadow-black py-4 px-10 overflow-y-auto no-scrollbar">
								<div className="flex flex-col gap-4">
									<div className="flex flex-row justify-between">
										<h3 className="text-2xl font-extrabold">
											Settings
										</h3>
										<button onClick={() => setIsOpen(false)}>
											<RxCross2 size={30} className="" />
										</button>
									</div>
									<div className="grid grid-cols-5 gap-4">
										<div className="font-bold text-xl col-span-2">Date range:</div>
										<div className="grid grid-cols-1 md:grid-cols-2 col-span-3 gap-3">
											<div className="flex justify-end gap-3">
												<div>From:</div>
												<input
													type="date"
													value={settings.range.l.toISOString().slice(0, 10)}
													onChange={e => setSettings(s => ({...s, range: {...settings.range, l: new Date(e.target.value)}}))}
													className="text-black rounded-lg px-4"
												/>
											</div>
											<div className="flex justify-end gap-3">
												<div>To:</div>
												<input
													type="date"
													value={settings.range.r.toISOString().slice(0, 10)}
													onChange={e => setSettings(s => ({...s, range: {...settings.range, r: new Date(e.target.value)}}))}
													className="text-black rounded-lg px-4"
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	)
}