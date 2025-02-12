import prisma from "../libs/prisma.mjs"
export default async function getGroups() {
	return {groups: await prisma.group.findMany({include: {allocations: true}})}
}