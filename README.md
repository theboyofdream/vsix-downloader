# 🧩 VSIX Downloader

A simple tool to download `.vsix` files directly from any Visual Studio Code extension URL.

## ⚡ Features

- Paste a VS Code extension link
- Click "Download"
- Instantly fetches the `.vsix` file from the Marketplace

## 📦 How to Use

1. Open `index.html` in your browser (no install needed)
2. Paste the VS Code Marketplace extension URL (e.g., `https://marketplace.visualstudio.com/items?itemName=ms-python.python`)
3. Hit the **Download** button
4. Done 🎉 — your `.vsix` file will start downloading

## 🧠 Why This Exists

Sometimes you wanna sideload VS Code extensions offline — for example:

- Working in remote/dev containers where Marketplace isn't accessible
- Using VS Code forks (like VSCodium) that don’t support the full Marketplace or lack certain extensions
- You just wanna stash a `.vsix` for backup or manual install

This tool makes it super easy without needing the VS Code CLI or Marketplace access from within the app.

## 📜 License

MIT — use it freely, remix it, or improve it!
