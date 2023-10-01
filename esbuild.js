const esbuild = require("esbuild");

esbuild
    .build({
        entryPoints: ["frontend/index.tsx"],
        outdir: "public/assets",
        bundle: true,
        minify: true,
        plugins: [],
    })
    .then(() => console.log("⚡ Build complete! ⚡"))
    .catch(() => process.exit(1));