import prisma from "../libs/prisma.mjs"
import ApiError from "../libs/ApiError.mjs"
/**
 * @param {Object} req
 * @param {Number} req.id
*/
export default async function deleteAllocation(req) {
	const allocation = await prisma.allocation.findFirst({where: {id: req.id}, include: {group: {include: {allocations: true}}}})
	if(!allocation) throw new ApiError(`Allocation doesn't exist`)
	if(allocation.groupId && allocation.group.allocations.length == 1)
		var groupPromise = prisma.group.delete({where: {id: allocation.groupId}})
	await Promise.all([groupPromise, prisma.allocation.delete({where: {id: req.id}})])
}