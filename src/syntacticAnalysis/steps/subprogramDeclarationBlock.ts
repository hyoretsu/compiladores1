import { LexicalResult } from "../../lexicalAnalysis/utils/lexicalAnalysis";
import { subprogramDeclaration } from "./subprogramDeclaration";

export function subprogramDeclarationBlock(lexicalResult: LexicalResult[]) {
	if (lexicalResult[0].token !== "procedure") {
		return;
	}

	subprogramDeclaration(lexicalResult);

	if (lexicalResult.splice(0, 1)[0].token !== ";") {
		throw new Error("Você precisa fechar um sub-programa com ponto-e-vírgula");
	}

	subprogramDeclarationBlock(lexicalResult);
}
