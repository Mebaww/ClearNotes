import "server-only"
import { prisma } from "../prisma"
import { AppError } from "../errors"

export async function resetUsageIfNeeded(userId: string) {

    const user = await prisma.user.findUnique({
        where: {id: userId},
        select: {
            monthlyCreditsUsed: true,
            usageResetAt: true
        }
    })


    if(!user) {
        throw new AppError("INVALID_REQUEST", "User not found.")
    }


    const now = new Date()

    if(!user.usageResetAt || now > user.usageResetAt){
        const nextReset = new Date()

        nextReset.setMonth(nextReset.getMonth() + 1)

        return prisma.user.update({
            where: {id: userId},
            data: {
                monthlyCreditsUsed: 0,
                usageResetAt: nextReset
            }
        })
    }
    return user
}

