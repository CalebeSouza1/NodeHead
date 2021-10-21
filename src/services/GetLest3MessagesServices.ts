import prismaClient from "../prisma"

class GetLest3MessagesServices {
    async execute() {
        const messages = await prismaClient.message.findMany({
            take: 3, 
            orderBy: {
                created_at: "desc"
            },
            include: {
                user: true
            },
        }); 
    
        return messages; 

    }
}

export { GetLest3MessagesServices }