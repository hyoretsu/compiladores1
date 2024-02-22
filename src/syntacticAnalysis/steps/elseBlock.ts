import { LexicalResult } from "..";
import { command } from "./command";

export function elseBlock(lexicalResult: LexicalResult) {
	if (lexicalResult[0].token === "else") {
		lexicalResult.splice(0, 1);
		command(lexicalResult);
	}
}
