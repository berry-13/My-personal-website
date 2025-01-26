import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type Data = {
    email: string;
    message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const data = req.body as Data;

    if (!data) return res.status(500).json({ result: "lol, nice try :)" });
    if (data.message.length < 1 || data.email.length < 1) return res.status(500).json({ result: "FIELD_EMPTY" });
    if (data.message.length > 1000) return res.status(500).json({ result: "MESSAGE_TOO_LONG" });
    if (data.email.length > 500) return res.status(500).json({ result: "NAME_TOO_LONG" });

    try {
        const response = await axios.post(process.env.WEBHOOK_URL as string, {
            embeds: [
                {
                    color: 3108090,
                    title: data.email,
                    author: {
                        name: req.headers["x-forwarded-for"] ?? req.socket.remoteAddress ?? "unknown!?",
                    },
                    description: data.message,
                },
            ],
        });

        if (response.data.err) return res.status(500).json({ result: "DISCORD_API_ERROR" });
        return res.status(200).json({ result: "Success" });
    } catch (error) {
        return res.status(500).json({ result: "DISCORD_API_ERROR" });
    }
}
