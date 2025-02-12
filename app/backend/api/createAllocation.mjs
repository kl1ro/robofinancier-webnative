import checkAllocationsRatesSum from "../libs/checkAllocationsRatesSum.mjs"
import prisma from "../libs/prisma.mjs"
/**
 * @param {object} req
 * @param {Number} req.groupId
 * @param {String} req.name
 * @param {Number} req.rate
 * @param {Number} req.amount
 * @param {boolean} req.remind
*/
export default async function createAllocation(req) {
	await checkAllocationsRatesSum(req)
	return {allocation: await prisma.allocation.create({data: req})}
}