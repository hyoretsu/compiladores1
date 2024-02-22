import { LexicalResult } from "..";
import { commandList } from "./commandList";

export function optionalCommands(lexicalResult: LexicalResult) {
	if (lexicalResult[0].token === "end") {
		return;
	}

	commandList(lexicalResult);
}
