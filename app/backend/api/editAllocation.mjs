import prisma from "../libs/prisma.mjs"
import checkAllocationsRatesSum from "../libs/checkAllocationsRatesSum.mjs"
export default async function editAllocation(req) {
	if(req.rate) await checkAllocationsRatesSum(req)
	if(req.groupId == null) {
		const allocation = await prisma.allocation.findFirst({where: {id: req.id}, include: {group: {include: {allocations: true}}}})
		if(allocation.groupId && allocation.group.allocations.length == 1)
			var groupPromise = prisma.group.delete({where: {id: allocation.groupId}})
	}
	await Promise.all([groupPromise, prisma.allocation.update({where: {id: req.id}, data: req})])
}