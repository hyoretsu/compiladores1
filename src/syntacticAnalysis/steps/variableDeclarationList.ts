import { LexicalResult } from "../../lexicalAnalysis/utils/lexicalAnalysis";
import { identifierList } from "./identifierList";
import { type } from "./type";

export function variableDeclarationList(lexicalResult: LexicalResult[]) {
	identifierList(lexicalResult);

	if (lexicalResult.splice(0, 1)[0].token !== ":") {
		throw new Error("Um ou mais identificadores de variáveis devem ser seguidos de ':'");
	}

	type(lexicalResult);

	if (lexicalResult.splice(0, 1)[0].token !== ";") {
		throw new Error("Você precisa terminar as linhas com ponto-e-vírgula");
	}

	if (lexicalResult[0].classification === "Identificador") {
		variableDeclarationList(lexicalResult);
	}
}
