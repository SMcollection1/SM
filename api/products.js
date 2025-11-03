import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "products.json");

  if (req.method === "GET") {
    try {
      const data = fs.readFileSync(filePath, "utf8");
      const products = JSON.parse(data || "[]");
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "❌ Failed to load products." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
