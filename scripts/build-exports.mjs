// Build every hosted export, one Vite pass each.
//
// The exports table lives in vite.exports.config.js. Each export is a classic
// self-executing IIFE, and Rollup/Rolldown cannot emit multiple IIFE entries in
// a single pass ("Multiple entry points are not supported when output formats
// include umd or iife"), so this walks the table and builds each entry in turn.
//
// Adding an export is a single line in the table — nothing here changes.

import { build } from "vite";
import { exports, exportConfig } from "../vite.exports.config.js";

for (const name of Object.keys(exports)) {
  console.log(`\n[exports] ${name} → assets/js/${name}.js`);
  await build({ configFile: false, ...exportConfig(name) });
}
