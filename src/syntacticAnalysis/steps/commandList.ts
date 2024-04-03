import { LexicalResult } from "../../lexicalAnalysis/utils/lexicalAnalysis";
import { command } from "./command";

export function commandList(lexicalResult: LexicalResult[]) {
	command(lexicalResult);

	if (lexicalResult[0].token === ";") {
		lexicalResult.splice(0, 1);

		// @ts-ignore
		if (lexicalResult[0].token !== "end") {
			commandList(lexicalResult);
		}
	}
}
