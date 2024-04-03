import { LexicalResult } from "../../lexicalAnalysis/utils/lexicalAnalysis";
import { compositeCommand } from "./compositeCommand";
import { elseBlock } from "./elseBlock";
import { expression } from "./expression";
import { expressionList } from "./expressionList";

export function command(lexicalResult: LexicalResult[]) {
	if (lexicalResult[0].classification === "Identificador") {
		lexicalResult.splice(0, 1);

		// Ativação de procedimento
		if (lexicalResult[0].token === "(") {
			lexicalResult.splice(0, 1);

			expressionList(lexicalResult);

			if (lexicalResult.splice(0, 1)[0].token !== ")") {
				throw new Error("Você deve fechar as aspas que abriu na ativação do procedimento.");
			}
		} else {
			console.log(lexicalResult);
			if (lexicalResult.splice(0, 1)[0].token !== ":=") {
				throw new Error("Toda inicialização de variável deve conter o operador de atribuição ':='");
			}

			expression(lexicalResult);
		}

		return;
	}

	if (lexicalResult[0].token === "if") {
		lexicalResult.splice(0, 1);
		expression(lexicalResult);
		if (lexicalResult.splice(0, 1)[0].token !== "then") {
			throw new Error("Todo 'if' deve ter um bloco 'then'");
		}
		command(lexicalResult);
		elseBlock(lexicalResult);
		return;
	}

	if (lexicalResult[0].token === "while") {
		lexicalResult.splice(0, 1);
		expression(lexicalResult);
		if (lexicalResult.splice(0, 1)[0].token !== "do") {
			throw new Error("Todo 'while' deve ter um bloco 'do'");
		}
		command(lexicalResult);
		return;
	}

	compositeCommand(lexicalResult);
}
