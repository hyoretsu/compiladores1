import { LexicalResult } from "..";
import { simpleExpression } from "./simpleExpression";

const relationalOperators = ["=", "<", ">", "<=", ">=", "<>"];

export function expression(lexicalResult: LexicalResult) {
	simpleExpression(lexicalResult);

	if (relationalOperators.includes(lexicalResult[0].token)) {
		lexicalResult.splice(0, 1);

		simpleExpression(lexicalResult);
	}
}
