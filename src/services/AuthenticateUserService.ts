import axios from "axios";
import prismaClient from "../prisma";
import { sign } from "jsonwebtoken";


interface IAcessTokenResponse {
    access_token: string
}

interface IUserResponse {
    avatar_url: string,
    login: string,
    id: number,
    name: string
}

class AuthenticateUserService {
    async execute(code: string){
        const url = "http://github.com/login/oauth/access_token";

        const { data: acessTokenResponse } = await axios.post<IAcessTokenResponse>(url, null, {
            params: { 
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                client_id: process.env.GITHUB_CLIENT_ID,
                code,
            },
            headers: {
                "Accept": "application/json"
            }
        });

        const response = await axios.get<IUserResponse>("http://api.github.com/user", {
               headers: {
                    authorization: `Bearer ${acessTokenResponse.access_token}`,
                },
            }
        );

        const { login, id, avatar_url, name } = response.data

        let user = await prismaClient.user.findFirst({
            where: {
                github_id: id
            }
        })

        if(!user) {
            user = await prismaClient.user.create({
                data: {
                    github_id: id,
                    login,
                    avatar_url,
                    name
                }
            })
        }

        const token = sign(
            {
            user: {
                name: user.name,
                avatar_ur: user.avatar_url,
                id:user.id
            }
        },
        process.env.JWT_SECRET,
        {
            subject: user.id,
            expiresIn: "1d"
        }
        )

        return { token, user };

    }
}


export{ AuthenticateUserService };