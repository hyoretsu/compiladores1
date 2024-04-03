import { LexicalResult } from "../../lexicalAnalysis/utils/lexicalAnalysis";
import { expression } from "./expression";
import { expressionList } from "./expressionList";

export function factor(lexicalResult: LexicalResult[]) {
	if (lexicalResult[0].classification === "Identificador") {
		lexicalResult.splice(0, 1);

		if (lexicalResult[0].token === "(") {
			lexicalResult.splice(0, 1);

			expressionList(lexicalResult);

			// @ts-ignore
			if (lexicalResult[0].token !== ")") {
				throw new Error("Parêntesis não fechado.");
			}

			lexicalResult.splice(0, 1);
		}

		return;
	}

	const { token } = lexicalResult.splice(0, 1)[0];

	if (token === "(") {
		expression(lexicalResult);

		if (lexicalResult[0].token !== ")") {
			throw new Error("Parêntesis não fechado.");
		}

		lexicalResult.splice(0, 1);
		return;
	}

	if (token === "not") {
		factor(lexicalResult);
		return;
	}

	if (!Number.isNaN(Number(token))) {
		if (lexicalResult[0].token === ".") {
			lexicalResult.splice(0, 1);

			if (lexicalResult.splice(0, 1)[0].classification !== "Número inteiro") {
				throw new Error("Números reais não-inteiros precisam de números após o ponto (vírgula).");
			}
		}

		return;
	}

	if (token !== "true" && token !== "false") {
		throw new Error("Fator inválido.");
	}
}
