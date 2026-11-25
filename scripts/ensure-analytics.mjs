#!/usr/bin/env node
/**
 * Re-applies the 51.la analytics include to src/layouts/Base.astro after an
 * upstream merge. Upstream does not know about the analytics component, and
 * `git merge -X theirs` resolves conflicts in favor of upstream, so the one
 * line we added to Base.astro can get dropped. This script restores it.
 *
 * Run on every sync (see .github/workflows/sync-and-translate.yml). Idempotent.
 */

import { readFile, writeFile, access } from "node:fs/promises";

const LAYOUT = "src/layouts/Base.astro";
const COMPONENT = "src/components/LaAnalytics.astro";

const COMPONENT_SRC = `---
// 51.la analytics for the Chinese mirror of contributors.home-assistant.io.
// Only rendered in production builds, so \`pnpm dev\` stays clean.
// This file only exists on the Chinese branch, so upstream merges never touch it.
const prod = import.meta.env.PROD;
---

{prod && (
  <script
    is:inline
    charset="UTF-8"
    id="LA_COLLECT"
    src="//sdk.51.la/js-sdk-pro.min.js?id=3MhQABjxy4RZQ6Ig&ck=3MhQABjxy4RZQ6Ig"
  ></script>
)}
`;

const IMPORT_LINE = 'import LaAnalytics from "../components/LaAnalytics.astro";';

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

let changed = false;

// 1. The component file itself never conflicts, but restore it if it vanished.
if (!(await exists(COMPONENT))) {
  await writeFile(COMPONENT, COMPONENT_SRC, "utf8");
  console.log(`restored ${COMPONENT}`);
  changed = true;
}

let layout = await readFile(LAYOUT, "utf8");
const original = layout;

// 2. The import inside the frontmatter.
if (!layout.includes("LaAnalytics")) {
  // The frontmatter is the first --- ... --- block of the file.
  const fmEnd = layout.indexOf("\n---", 4);
  if (fmEnd === -1) {
    console.error(`Could not find the frontmatter of ${LAYOUT}, skipping`);
    process.exit(1);
  }
  layout = `${layout.slice(0, fmEnd)}\n${IMPORT_LINE}${layout.slice(fmEnd)}`;
  console.log(`restored ${IMPORT_LINE}`);
}

// 3. The component usage at the end of <head>.
if (!layout.includes("<LaAnalytics />")) {
  if (!layout.includes("</head>")) {
    console.error(`Could not find </head> in ${LAYOUT}, skipping`);
    process.exit(1);
  }
  layout = layout.replace("</head>", "  <LaAnalytics />\n  </head>");
  console.log("restored <LaAnalytics /> in <head>");
}

// 4. The site is Chinese; the lang attribute helps search engines and screen readers.
if (layout.includes('<html lang="en">')) {
  layout = layout.replace('<html lang="en">', '<html lang="zh-CN">');
  console.log('changed <html lang="en"> to <html lang="zh-CN">');
}

if (layout !== original) {
  await writeFile(LAYOUT, layout, "utf8");
  changed = true;
}

// 5. astro.config.ts must define SITE_URL/BASE_PATH for the mirror deploy.
//    An upstream merge can drop the declarations while keeping our
//    `site: SITE_URL` lines, which breaks `pnpm build` with
//    "SITE_URL is not defined". Restore them when missing.
const CONFIG = "astro.config.ts";
let config = await readFile(CONFIG, "utf8");
if (!config.includes("const SITE_URL")) {
  const anchor = "export default defineConfig({";
  if (!config.includes(anchor)) {
    console.error(`Could not find ${anchor} in ${CONFIG}, skipping`);
    process.exit(1);
  }
  const declarations =
    "// Chinese mirror deployment: served from hasscn.top/contributors. Both\n" +
    "// overridable so the upstream root deploy keeps working from this branch.\n" +
    'const SITE_URL = process.env.SITE_URL || "https://www.hasscn.top";\n' +
    'const BASE_PATH = process.env.SITE_BASE_PATH || "/contributors";\n\n';
  config = config.replace(anchor, `${declarations}${anchor}`);
  console.log(`restored SITE_URL/BASE_PATH declarations in ${CONFIG}`);
  changed = true;
}
if (!config.includes("site: SITE_URL")) {
  config = config.replace(/site: "[^"]*"/, "site: SITE_URL,\n  base: BASE_PATH");
  console.log(`restored site/base mirror values in ${CONFIG}`);
  changed = true;
}
if (config !== (await readFile(CONFIG, "utf8"))) {
  await writeFile(CONFIG, config, "utf8");
  changed = true;
}

console.log(changed ? "analytics include re-applied" : "analytics include already in place");
