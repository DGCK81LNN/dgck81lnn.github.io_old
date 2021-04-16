const ESBuild = require("esbuild");

ESBuild.build({
    entryPoints: ["js/#components/index.js"],
    outfile: "js/components.min.js",
    bundle: true,
    minify: true,
    plugins: [require("esbuild-vue")()],
    target: "es2015",
    external: []
});


ESBuild.build({
    entryPoints: ["apps/lab/brainfuck.js"],
    outfile: "apps/lab/brainfuck.min.js",
    bundle: true,
    minify: true,
    target: "es2015",
    external: []
});