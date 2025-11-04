let products = [];

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const product = req.body;
      if (!product.name || !product.image) {
        return res.status(400).json({ message: "Missing fields" });
      }
      products.push(product);
      return res.status(200).json({ message: "✅ Product added successfully" });
    } catch (error) {
      return res.status(500).json({ message: "⚠️ Server error", error });
    }
  }

  if (req.method === "GET") {
    return res.status(200).json(products);
  }

  return res.status(405).json({ message: "❌ Method not allowed" });
}
