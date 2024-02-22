import { table } from "table";
import lexicalAnalysis from "./utils/lexicalAnalysis";

function main() {
	if (process.argv.length !== 3) {
		throw new Error("Passe o caminho do arquivo de input");
	}

	const analysis = lexicalAnalysis(process.argv[2]);

	try {
		console.log(table([["Token", "Classificação", "Linha"], ...analysis]));
	} catch (e) {
		if (e instanceof Error) {
			console.error(e.message);
			return;
		}
	}
}

main();
