import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), "products.json");

  if (req.method === "GET") {
    try {
      const data = fs.existsSync(filePath)
        ? JSON.parse(fs.readFileSync(filePath, "utf8"))
        : [];
      res.status(200).json(data);
    } catch {
      res.status(500).json({ message: "⚠️ Failed to load products" });
    }
  } else if (req.method === "POST") {
    try {
      const product = req.body;
      const data = fs.existsSync(filePath)
        ? JSON.parse(fs.readFileSync(filePath, "utf8"))
        : [];
      data.push(product);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      res.status(200).json({ message: "✅ Product added" });
    } catch {
      res.status(500).json({ message: "⚠️ Failed to add product" });
    }
  } else {
    res.status(405).json({ message: "❌ Method not allowed" });
  }
}
