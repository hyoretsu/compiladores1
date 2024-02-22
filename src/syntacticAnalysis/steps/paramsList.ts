import { LexicalResult } from "..";
import { identifierList } from "./identifierList";
import { type } from "./type";

export function paramsList(lexicalResult: LexicalResult) {
	identifierList(lexicalResult);

	if (lexicalResult.splice(0, 1)[0].token !== ":") {
		throw new Error("Um ou mais identificadores de variáveis devem ser seguidos de ':'");
	}

	type(lexicalResult);

	// Nada ou ;
	if (lexicalResult[0].token === ";") {
		lexicalResult.splice(0, 1);
		paramsList(lexicalResult);
	}

	if (lexicalResult[0].token !== ")") {
		throw new Error("Você não colocou um ponto-e-vírgula mas passou outro parâmetro.");
	}
}
