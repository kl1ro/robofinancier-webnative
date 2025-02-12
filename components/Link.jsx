import React from "react"
import {useRouter} from "../libs/router"
export default function Link({href, label}) {
	const {navigate} = useRouter()
	return (
		<button onClick={() => navigate(href)} className="h-full px-2 text-xl md:text-3xl font-bold">
			{label}
		</button>
	)
}