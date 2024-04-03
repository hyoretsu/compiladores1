import { LexicalResult } from "../../lexicalAnalysis/utils/lexicalAnalysis";
import { term } from "./term";

const signs = ["+", "-"];
const additiveOperators = [...signs, "or"];

export function simpleExpression(lexicalResult: LexicalResult[], loop = false) {
	if (signs.includes(lexicalResult[0].token)) {
		lexicalResult.splice(0, 1);
	}

	term(lexicalResult);

	simpleExpressionLoop(lexicalResult);
}

function simpleExpressionLoop(lexicalResult: LexicalResult[]) {
	if (!additiveOperators.includes(lexicalResult[0].token)) {
		return;
	}

	lexicalResult.splice(0, 1);

	term(lexicalResult);

	if (additiveOperators.includes(lexicalResult[0].token)) {
		simpleExpressionLoop(lexicalResult);
	}
}
