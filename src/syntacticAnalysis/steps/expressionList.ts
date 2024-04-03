import { LexicalResult } from "../../lexicalAnalysis/utils/lexicalAnalysis";
import { expression } from "./expression";

export function expressionList(lexicalResult: LexicalResult[]) {
	expression(lexicalResult);

	if (lexicalResult[0].token === ",") {
		lexicalResult.splice(0, 1);

		expressionList(lexicalResult);
	}
}
