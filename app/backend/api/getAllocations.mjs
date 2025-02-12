import prisma from "../libs/prisma.mjs"
export default async function getAllocations() {
	return {allocations: await prisma.allocation.findMany({where: {groupId: null}})}
}