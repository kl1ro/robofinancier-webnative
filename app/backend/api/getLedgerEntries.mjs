import prisma from "../libs/prisma.mjs"
export default async function getLedgerEntries(req) {
	return {ledgerEntries: await prisma.ledgerEntry.findMany({
		where: req.where,
		...(() => req.orderBy ? {orderBy: req.orderBy} : {orderBy: {date: "asc"}})(),
		include: {allocation: true, group: true, category: true}
	})}
}