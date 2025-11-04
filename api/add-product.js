let products = [
  {
    name: "Lip Gloss Set",
    category: "Cosmetics",
    price: "1200",
    image: "https://i.imgur.com/9tKp5Ew.jpg"
  }
];

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { name, category, price, image } = req.body;

      if (!name || !category || !price || !image) {
        return res.status(400).json({ message: "⚠️ Missing fields" });
      }

      const newProduct = { name, category, price, image };
      products.push(newProduct);

      return res
        .status(200)
        .json({ message: "✅ Product added successfully", product: newProduct });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "⚠️ Server error" });
    }
  }

  if (req.method === "GET") {
    return res.status(200).json(products);
  }

  return res.status(405).json({ message: "❌ Method not allowed" });
}
