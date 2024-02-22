import { LexicalResult } from "..";
import { expression } from "./expression";

export function expressionList(lexicalResult: LexicalResult) {
	expression(lexicalResult);

	if (lexicalResult[0].token === ",") {
		lexicalResult.splice(0, 1);

		expressionList(lexicalResult);
	}
}
