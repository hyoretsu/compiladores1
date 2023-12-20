import type { Options } from "tsup";

export const tsup: Options = {
	bundle: true,
	clean: true,
	entry: ["lexicalAnalysis/*.ts"],
	esbuildOptions(options, context) {
		// the directory structure will be the same as the source
		options.outbase = "./";
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
