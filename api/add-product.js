import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "❌ Method not allowed" });
  }

  const filePath = path.join(process.cwd(), "products.json");

  try {
    const data = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, "utf8"))
      : [];

    const product = req.body;
    data.push(product);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.status(200).json({ message: "✅ Product added successfully" });
  } catch (error) {
    res.status(500).json({ message: "⚠️ Failed to save product", error });
  }
}
