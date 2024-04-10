import type { Options } from "tsup";

export const tsup: Options = {
	bundle: true,
	clean: true,
	entry: ["src/lexicalAnalysis/*.ts", "src/semanticAnalysis/index.ts", "src/syntacticAnalysis/*.ts"],
	esbuildOptions(options, context) {
		// the directory structure will be the same as the source
		options.outbase = "./src";
	},
	format: ["iife"],
	injectStyle: true,
	minify: true,
	outDir: "build",
	outExtension: () => {
		return {
			js: ".js",
		};
	},
	target: "es6",
};
