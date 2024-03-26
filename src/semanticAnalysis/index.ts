import lexicalAnalysis from "../lexicalAnalysis/utils/lexicalAnalysis";

export type LexicalResult = Array<{ token: string; classification: string }>;

function main() {
	if (process.argv.length !== 3) {
		throw new Error("Passe o caminho do arquivo de input");
	}

	const lexicalResult = lexicalAnalysis(process.argv[2]).map(analysis => {
		analysis.splice(-1);

		return { token: analysis[0], classification: analysis[1] };
	}) as LexicalResult;

	const scopeStack = [];

	console.log(lexicalResult);
}

main();
