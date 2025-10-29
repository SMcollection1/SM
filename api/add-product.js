import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "❌ Method not allowed" });
  }

  const { name, description, price, image, category } = req.body;

  if (!name || !price || !image || !category) {
    return res.status(400).json({ message: "⚠️ Missing product details" });
  }

  const product = { name, description, price, image, category };
  const repoOwner = process.env.GITHUB_USERNAME;
  const repoName = process.env.GITHUB_REPO;
  const filePath = "products.json";
  const token = process.env.GITHUB_TOKEN;

  try {
    // 🟢 Get current file content
    const response = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      { headers: { Authorization: `token ${token}` } }
    );
    const data = await response.json();

    let content = "";
    let products = [];
    if (data.content) {
      content = Buffer.from(data.content, "base64").toString();
      products = JSON.parse(content || "[]");
    }

    // 🟣 Add new product
    products.push(product);
    const updatedContent = Buffer.from(
      JSON.stringify(products, null, 2)
    ).toString("base64");

    // 🔵 Update file on GitHub
    const updateResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `🆕 Added new product: ${product.name}`,
          content: updatedContent,
          sha: data.sha,
        }),
      }
    );

    if (updateResponse.ok) {
      return res.status(200).json({ message: "✅ Product added successfully!" });
    } else {
      return res.status(500).json({ message: "❌ Failed to update file!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "⚠️ Error adding product!" });
  }
}
