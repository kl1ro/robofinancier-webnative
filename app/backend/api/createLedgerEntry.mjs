import prisma from "../libs/prisma.mjs"
export default async function createLedgerEntry(req) {
	try {
	const e = await prisma.ledgerEntry.create({data: req, include: {allocation: true, group: true, category: true}})
	if(!e.allocationId && !e.groupId) {
		const as = await prisma.allocation.findMany()
		await Promise.all(as.map(a => prisma.allocation.update({
			where: {id: a.id},
			data: !a.remind || e.amount < 0
				? {amount: Math.round(a.amount + e.amount / 100 * a.rate)}
				: {moneyToPut: Math.round(a.moneyToPut + e.amount / 100 * a.rate)}
		})))
	}
	else if(e.allocationId) await prisma.allocation.update({
		where: {id: e.allocationId},
		data: !e.allocation.remind || e.amount < 0 ? {amount: e.allocation.amount + e.amount} : {moneyToPut: e.allocation.moneyToPut + e.amount}
	})
	else if(e.groupId){
		const as = await prisma.allocation.findMany({where: {groupId: e.groupId}})
		const gr = as.reduce((s, a) => s + a.rate, 0)
		await Promise.all(as.map(a => prisma.allocation.update({
			where: {id: a.id},
			data: !a.remind || e.amount < 0
				? {amount: Math.round(a.amount + e.amount * a.rate / gr)}
				: {moneyToPut: Math.round(a.moneyToPut + e.amount * a.rate / gr)}
		})))
	}
	return {ledgerEntry: e}
} catch(e) {console.log(e.message); throw new Error()}
}