import fs from "fs";
import path from "path";

export default function handler(req, res) {
  // Path to the JSON file
  const filePath = path.join(process.cwd(), "products.json");

  if (req.method === "GET") {
    // Read products
    try {
      const data = fs.readFileSync(filePath, "utf8");
      const products = JSON.parse(data);
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ error: "Failed to load products." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
