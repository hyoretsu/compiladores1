import { LexicalResult } from "..";
import { optionalCommands } from "./optionalCommands";

export function compositeCommand(lexicalResult: LexicalResult) {
	if (lexicalResult.splice(0, 1)[0].token !== "begin") {
		throw new Error("Você precisa começar comandos compostos com a palavra reservada 'begin'");
	}

	optionalCommands(lexicalResult);

	if (lexicalResult.splice(0, 1)[0].token !== "end") {
		throw new Error("Você precisa terminar comandos compostos com a palavra reservada 'end'");
	}
}
