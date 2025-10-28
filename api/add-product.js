import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, description, price, image, category } = req.body;

  const product = { name, description, price, image, category };
  const repoOwner = "SMcollection1";
  const repoName = "SM";
  const filePath = "products.json";
  const token = process.env.GITHUB_TOKEN;

  try {
    // Get current file
    const response = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        headers: { Authorization: `token ${token}` },
      }
    );
    const data = await response.json();

    const content = Buffer.from(data.content, "base64").toString();
    const products = JSON.parse(content || "[]");
    products.push(product);

    const updatedContent = Buffer.from(
      JSON.stringify(products, null, 2)
    ).toString("base64");

    // Update file on GitHub
    const updateResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Added new product: ${product.name}`,
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
    return res.status(500).json({ message: "⚠️ Error adding product!" });
  }
}
