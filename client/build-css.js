const { compile } = require("@tailwindcss/node");
const { Scanner } = require("@tailwindcss/oxide");
const fs = require("fs");
const path = require("path");

async function buildCss() {
  const inputCssPath = path.resolve(__dirname, "app/input.css");
  const outputCssPath = path.resolve(__dirname, "app/globals.css");

  // Read base input CSS
  const input = fs.readFileSync(inputCssPath, "utf8");

  // Compile with Tailwind v4
  const compiler = await compile(input, {
    from: inputCssPath,
    base: __dirname,
    onDependency: () => {},
  });

  // Scan all project source files for classes
  const scanner = new Scanner({
    sources: [
      {
        base: __dirname,
        pattern: "{app,components,lib}/**/*.{tsx,ts,jsx,js,html}",
        negated: false,
      },
    ],
  });

  const candidates = Array.from(scanner.scan());
  console.log(`[Tailwind] Scanned ${candidates.length} class candidates.`);

  // Build full CSS
  const compiledCss = compiler.build(candidates);

  // Write directly to app/globals.css
  fs.writeFileSync(outputCssPath, compiledCss, "utf8");
  console.log(`[Tailwind] Written ${compiledCss.length} bytes to app/globals.css.`);
}

buildCss().catch((err) => {
  console.error("[Tailwind] Compilation error:", err);
  process.exit(1);
});
