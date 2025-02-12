import React, {createContext, useContext} from "react"
import Home from "../components/pages/Home"
import Ledger from "../components/pages/Ledger"
import Notes from "../components/pages/Notes"
export const routes = {
	"/": <Home />,
	"/ledger": <Ledger />,
	"/notes": <Notes />
}
export const RouterContext = createContext()
export const useRouter = () => useContext(RouterContext)