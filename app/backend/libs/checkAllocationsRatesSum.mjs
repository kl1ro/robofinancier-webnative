import prisma from "./prisma.mjs"
import ApiError from "./ApiError.mjs"
export default async function checkAllocationsRatesSum(req) {
	const sum = (await prisma.allocation.findMany()).reduce((sum, a) => a.id != req.id ? (sum + a.rate) : sum, 0) + req.rate
	if(sum > 100) throw new ApiError(`The sum of the allocations rates need to be less or equal to 100, got ${sum}`)
}