import { LexicalResult } from "../../lexicalAnalysis/utils/lexicalAnalysis";
import { factor } from "./factor";

const multiplicativeOperators = ["*", "/", "or"];

export function term(lexicalResult: LexicalResult[], loop = false) {
	if (loop) {
		if (!multiplicativeOperators.includes(lexicalResult[0].token)) {
			return;
		}

		lexicalResult.splice(0, 1);
	}

	factor(lexicalResult);

	term(lexicalResult, true);
}
