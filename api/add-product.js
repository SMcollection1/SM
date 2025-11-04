import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const filePath = path.join(process.cwd(), "products.json");
    const product = req.body;

    try {
      // Read existing data
      const data = fs.existsSync(filePath)
        ? JSON.parse(fs.readFileSync(filePath, "utf8"))
        : [];

      // Add new product
      data.push(product);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      res.status(200).json({ message: "✅ Product added successfully" });
    } catch (error) {
      res.status(500).json({ message: "⚠️ Failed to save product", error });
    }
  } else {
    res.status(405).json({ message: "❌ Method not allowed" });
  }
}
