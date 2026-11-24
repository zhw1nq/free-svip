export default async function handler(req, res) {
    const sheetUrl = process.env.SHEET_WEBHOOK_URL;
    if (!sheetUrl) {
        return res.status(200).json({ items: [] });
    }

    if (req.method === "POST") {
        try {
            const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
            const steam = String(body?.s || "").trim().slice(0, 180);
            const reward = String(body?.r || "").trim().slice(0, 60);

            if (!steam) return res.status(400).json({ ok: false });

            await fetch(sheetUrl, {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify({ s: steam, r: reward }),
                redirect: "follow"
            });

            return res.status(200).json({ ok: true });
        } catch {
            return res.status(400).json({ ok: false });
        }
    }

    if (req.method === "GET") {
        try {
            const r = await fetch(sheetUrl, { redirect: "follow" });
            const data = await r.json();
            return res.status(200).json({
                items: Array.isArray(data?.items) ? data.items : []
            });
        } catch {
            return res.status(200).json({ items: [] });
        }
    }

    return res.status(405).json({ ok: false });
}
