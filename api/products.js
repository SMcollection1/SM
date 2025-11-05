import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "products.json");

  if (req.method === "GET") {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      const products = JSON.parse(data || "[]");
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ error: "Error reading products file" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
