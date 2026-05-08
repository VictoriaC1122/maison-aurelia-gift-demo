import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const target = path.join(root, "data", "products.json");
const raw = await fs.readFile(target, "utf8");
const data = JSON.parse(raw);

console.log(`Loaded ${data.products.length} products across ${data.categories.length} categories.`);
console.log("Edit data/products.json to replace placeholders with final product names, prices, and descriptions.");
