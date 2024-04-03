import lexicalAnalysis, { LexicalResult } from "../lexicalAnalysis/utils/lexicalAnalysis";
import { semanticAnalysis } from "./steps";

function main() {
	if (process.argv.length !== 3) {
		throw new Error("Passe o caminho do arquivo de input.");
	}

	const lexicalResult = lexicalAnalysis(process.argv[2]).map<LexicalResult>(
		([token, classification, line]) => ({ token, classification, line }),
	);

	try {
		semanticAnalysis(lexicalResult);
	} catch (e) {
		if (e instanceof Error) {
			console.error(e.message);
		}
	}
}

main();
