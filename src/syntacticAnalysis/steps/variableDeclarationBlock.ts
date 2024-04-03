import { LexicalResult } from "../../lexicalAnalysis/utils/lexicalAnalysis";
import { variableDeclarationList } from "./variableDeclarationList";

export function variableDeclarationBlock(lexicalResult: LexicalResult[]) {
	// No variable declaration block in this program
	if (lexicalResult[0].token !== "var") {
		return;
	}

	// Otherwise remove it so we can continue the syntactic analysis
	lexicalResult.splice(0, 1);

	variableDeclarationList(lexicalResult);
}
