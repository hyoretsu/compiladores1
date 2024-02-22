import { LexicalResult } from "..";

export function identifierList(lexicalResult: LexicalResult) {
	const { classification } = lexicalResult.splice(0, 1)[0];

	if (classification !== "Identificador") {
		throw new Error("Você deve começar uma declaração de variáveis com um identificador.");
	}

	// The next token is a ','
	if (lexicalResult[0].token === ",") {
		lexicalResult.splice(0, 1);
		// There will be another identifier and so on
		identifierList(lexicalResult);
	}
}
