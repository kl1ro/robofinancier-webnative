import prisma from "../libs/prisma.mjs"
/**
 * @param {Object} req
 * @param {String} req.name
*/
export default async function createGroup(req) {
	return {group: await prisma.group.create({data: req})}
}