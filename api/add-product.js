export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "❌ Method not allowed" });
  }

  // Get product data from body
  const { name, description, price, image, category } = req.body;

  // Validate required fields
  if (!name || !price || !image || !category) {
    return res.status(400).json({ message: "⚠️ Missing product details" });
  }

  // Create product object
  const product = { name, description, price, image, category };

  // Environment variables from Vercel
  const repoOwner = process.env.GITHUB_USERNAME;
  const repoName = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;
  const filePath = "products.json";

  try {
    // 🟢 Get existing file content from GitHub
    const response = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      const msg = `GitHub file fetch failed (${response.status})`;
      console.error(msg);
      return res.status(500).json({ message: msg });
    }

    const data = await response.json();

    let products = [];
    if (data.content) {
      const content = Buffer.from(data.content, "base64").toString();
      products = JSON.parse(content || "[]");
    }

    // 🟣 Add new product
    products.push(product);

    // Convert to base64
    const updatedContent = Buffer.from(
      JSON.stringify(products, null, 2)
    ).toString("base64");

    // 🔵 Push update to GitHub
    const updateResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `🆕 Added new product: ${product.name}`,
          content: updatedContent,
          sha: data.sha,
        }),
      }
    );

    if (!updateResponse.ok) {
      const msg = `❌ GitHub update failed (${updateResponse.status})`;
      console.error(msg);
      return res.status(500).json({ message: msg });
    }

    return res.status(200).json({ message: "✅ Product added successfully!" });
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({ message: "⚠️ Error adding product!" });
  }
}
