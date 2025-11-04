let products = [
  {
    name: "Lip Gloss Set",
    category: "Cosmetics",
    price: "1200",
    image: "https://i.imgur.com/9tKp5Ew.jpg"
  }
];

export default function handler(req, res) {
  if (req.method === "GET") {
    // ✅ Return all products
    return res.status(200).json(products);
  }

  if (req.method === "POST") {
    // ✅ Add new product
    const { name, category, price, image } = req.body;

    if (!name || !category || !price || !image) {
      return res.status(400).json({ message: "⚠️ Missing fields" });
    }

    const newProduct = { name, category, price, image };
    products.push(newProduct);

    return res
      .status(200)
      .json({ message: "✅ Product added successfully!", product: newProduct });
  }

  // ❌ If method is not GET or POST
  return res.status(405).json({ message: "❌ Method not allowed" });
}
