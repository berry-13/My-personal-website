import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default function awake(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).json({ result: "Method Not Allowed" });

    const config = {
        headers: {
            "Authorization": `Bearer ${process.env.AWAKE_TOKEN}`,
            "Content-Type": "application/json",
        },
    };

    axios
        .get(`${process.env.AWAKE_BASE_URL}/api/states/${process.env.DEVICE}`, config)
        .then(response => {
            if (response.data.err) return res.status(500).json({ result: "API_ERROR" });

            const isDoNotDisturb = response.data.state === "undefined" ? "false" : response.data.state !== "off";

            return res.status(200).json({ result: "Success", isDoNotDisturb });
        })
        .catch(error => {
            return res.status(500).json({ result: "API_CALL_FAILED", error: error.message });
        });
}
