import { Request, Response } from "express";
import { GetLest3MessagesServices } from "../services/GetLest3MessagesServices";


class GetLest3MessagesController {
    async handle(request: Request, response: Response) {
        const service = new GetLest3MessagesServices(); 

        const result = await service.execute();

        return response.json(result); 
    }
}


export { GetLest3MessagesController }