import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method === "POST") {
    const filePath = path.join(process.cwd(), "products.json");

    try {
      const newProduct = req.body;
      let products = [];

      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf-8");
        products = JSON.parse(data || "[]");
      }

      products.push(newProduct);
      fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

      res.status(200).json({ message: "✅ Product added successfully!" });
    } catch (err) {
      res.status(500).json({ message: "❌ Error saving product." });
    }
  } else {
    res.status(405).json({ message: "❌ Method not allowed" });
  }
}
