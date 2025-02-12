import prisma from "../libs/prisma.mjs"
function getGroupRate(as, gid) {
	if(gid == null) return undefined
	return as.reduce((s, a) => a.groupId == gid ? (s + a.rate) : s, 0)
}
export default async function editLedgerEntry(req) {
	const e = await prisma.ledgerEntry.findFirst({where: {id: req.id}})
	const ne = await prisma.ledgerEntry.update({where: {id: req.id}, data: req, include: {allocation: true, category: true, group: true}})
	await Promise.all(await prisma.allocation.findMany().then(as => {
		let gr = getGroupRate(as, e.groupId)
		as = as.map(a => {
			if(!e.groupId && !e.allocationId) a.amount -= Math.round(e.amount * a.rate / 100)
			else if(gr && a.groupId == e.groupId) a.amount -= Math.round(e.amount * a.rate / gr)
			else if(a.id == e.allocationId) a.amount -= e.amount
			return a
		})
		gr = getGroupRate(as, ne.groupId)
		return Promise.all(as.map(a => {
			if(!ne.groupId && !ne.allocationId) {
				if(!a.remind || ne.amount < 0) a.amount += Math.round(ne.amount * a.rate / 100)
				else a.moneyToPut += Math.round(ne.amount * a.rate / 100)
			}
			else if(ne.groupId && a.groupId == ne.groupId) {
				if(!a.remind || ne.amount < 0) a.amount += Math.round(ne.amount * a.rate / gr)
				else a.moneyToPut += Math.round(ne.amount * a.rate / gr)
			}
			else if(a.id == ne.allocationId) {
				if(!a.remind || ne.amount < 0) a.amount += ne.amount
				else a.moneyToPut += ne.amount
			}
			return prisma.allocation.update({where: {id: a.id}, data: a})
		}))
	}))
}