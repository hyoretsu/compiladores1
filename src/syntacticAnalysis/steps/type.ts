import { LexicalResult } from "..";

export function type(lexicalResult: LexicalResult) {
	const { token } = lexicalResult.splice(0, 1)[0];

	if (token !== "integer" && token !== "real" && token !== "boolean") {
		throw new Error(`Tipo de variável inválido.\nRecebido: ${token} Esperado: integer | real | boolean`);
	}
}
