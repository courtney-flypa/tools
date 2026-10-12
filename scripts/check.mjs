import { readFile, access } from 'node:fs/promises';
import assert from 'node:assert/strict';
const tools = JSON.parse(await readFile(new URL('../public/tools.json', import.meta.url), 'utf8'));
assert(Array.isArray(tools), 'tools.json must contain an array');
const slugs = new Set();
for (const tool of tools) {
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tool.slug), `Invalid slug: ${tool.slug}`);
  assert(!slugs.has(tool.slug), `Duplicate slug: ${tool.slug}`);
  slugs.add(tool.slug);
  for (const key of ['title', 'description', 'category']) assert(typeof tool[key] === 'string' && tool[key].trim(), `Missing ${key}: ${tool.slug}`);
  assert(Array.isArray(tool.tags) && tool.tags.every((tag) => typeof tag === 'string'), `Invalid tags: ${tool.slug}`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(tool.date) && Number.isFinite(Date.parse(tool.date)) && new Date(tool.date).toISOString().slice(0, 10) === tool.date, `Invalid date: ${tool.slug}`);
  await access(new URL(`../public/${tool.slug}/index.html`, import.meta.url));
}
for (const path of ['index.html', '404.html', 'assets/style.css', 'assets/catalog.js', 'assets/mushroom.svg']) await access(new URL(`../public/${path}`, import.meta.url));
console.log(`Catalog valid: ${tools.length} tools. Required pages and assets present.`);
