import prisma from "../libs/prisma.mjs"
export default async function deleteLedgerEntry(req) {
	const e = await prisma.ledgerEntry.findFirst({where: {id: req.id}})
	if(!e.allocationId && !e.groupId) await prisma.allocation.findMany().then(as => Promise.all(as.map(a => prisma.allocation.update({ 
		where: {id: a.id}, data: {amount: a.amount - e.amount / 100 * a.rate}
	}))))
	else if(e.allocationId) await prisma.allocation.findFirst({where: {id: e.allocationId}}).then(a => prisma.allocation.update({ 
		where: {id: a.id}, data: {amount: a.amount - e.amount}
	}))
	else {
		const as = await prisma.allocation.findMany({where: {groupId: e.groupId}})
		const gr = as.reduce((s, a) => s + a.rate, 0)
		await Promise.all(as.map(a => prisma.allocation.update({where: {id: a.id}, data: {amount: a.amount - e.amount * a.rate / gr}})))
	}
	await prisma.ledgerEntry.delete({where: {id: req.id}})
}