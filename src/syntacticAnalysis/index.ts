import lexicalAnalysis, { LexicalResult } from "../lexicalAnalysis/utils/lexicalAnalysis";
import { compositeCommand, subprogramDeclarationBlock, variableDeclarationBlock } from "./steps";

function main() {
	if (process.argv.length !== 3) {
		throw new Error("Passe o caminho do arquivo de input");
	}

	const lexicalResult = lexicalAnalysis(process.argv[2]).map<LexicalResult>(
		([token, classification, line]) => ({ token, classification, line }),
	);

	const programAndId = lexicalResult.splice(0, 3);

	if (
		programAndId[0].token !== "program" ||
		programAndId[1].classification !== "Identificador" ||
		programAndId[2].token !== ";"
	) {
		throw new Error("Um programa deve começar com a diretiva 'program', um identificador e ponto-e-vírgula");
	}

	variableDeclarationBlock(lexicalResult);
	subprogramDeclarationBlock(lexicalResult);
	compositeCommand(lexicalResult);

	if (lexicalResult[0].token !== ".") {
		throw new Error("Um programa deve terminar com o caractere '.'");
	}

	if (lexicalResult.length > 1) {
		throw new Error(
			"Usar um '.' indica que o programa terminou, portanto não pode haver mais coisas escritas além disso.",
		);
	}
}

main();
