import { LexicalResult } from "../../lexicalAnalysis/utils/lexicalAnalysis";
import { args } from "./args";
import { compositeCommand } from "./compositeCommand";
import { subprogramDeclarationBlock } from "./subprogramDeclarationBlock";
import { variableDeclarationBlock } from "./variableDeclarationBlock";

export function subprogramDeclaration(lexicalResult: LexicalResult[]) {
	if (
		lexicalResult.splice(0, 1)[0].token !== "procedure" ||
		lexicalResult.splice(0, 1)[0].classification !== "Identificador"
	) {
		throw new Error("Um subprograma deve começar com a palavra reservada `procedure` e um identificador.");
	}

	args(lexicalResult);

	if (lexicalResult.splice(0, 1)[0].token !== ";") {
		throw new Error("Você precisa terminar as linhas com ponto-e-vírgula.");
	}

	variableDeclarationBlock(lexicalResult);
	subprogramDeclarationBlock(lexicalResult);
	compositeCommand(lexicalResult);
}
