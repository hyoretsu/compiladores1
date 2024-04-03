import { LexicalResult } from "../../lexicalAnalysis/utils/lexicalAnalysis";
import { paramsList } from "./paramsList";

export function args(lexicalResult: LexicalResult[]) {
	if (lexicalResult[0].token !== "(") {
		return;
	}

	lexicalResult.splice(0, 1);

	paramsList(lexicalResult);

	if (lexicalResult.splice(0, 1)[0].token !== ")") {
		throw new Error("Você deve fechar os parêntesis dos argumentos da função.");
	}
}
