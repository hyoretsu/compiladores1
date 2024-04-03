import { LexicalResult } from "../lexicalAnalysis/utils/lexicalAnalysis";

interface SemanticInfo {
	token: string;
	type?: string;
}

type ValType = "boolean" | "char" | "integer" | "real";

const comparativeOperators = ["<", ">", "<=", ">=", "<>"];
const logicalOperators = ["and", "or"];
const relationalOperators = ["+", "-", "*", "/"];

function evaluateExpression(expressionArr: SemanticInfo[]): ValType | RegExp {
	if (expressionArr.length === 1) {
		return expressionArr[0].type as ValType;
	}

	if (expressionArr.length !== 3) {
		throw new Error("Expressão inválida passada para a função `evaluateExpression()`.");
	}

	const [val1, { token: operator }, val2] = expressionArr;

	if (val1.type === "char" || val2.type === "char") {
		throw new Error("Não são permitidas operações com valores do tipo `char`.");
	}

	if (val1.type === "boolean" || val2.type === "boolean") {
		if (val1.type !== val2.type) {
			throw new Error(
				"Valores do tipo `boolean` só podem ser relacionados com outros valores do tipo `boolean`.",
			);
		}

		if (!logicalOperators.includes(operator)) {
			throw new Error("Valores do tipo `boolean` só podem ser usados com operadores lógicos.");
		}

		return "boolean";
	}

	if (comparativeOperators.includes(operator)) {
		return "boolean";
	}

	if (!relationalOperators.includes(operator)) {
		throw new Error(
			"Valores do tipo `integer` e `real` só podem ser usados com operadores relacionais ou comparativos.",
		);
	}

	if (val2.type === "integer") {
		return /integer|real/g;
	}

	if ([val1.type, val2.type].includes("real")) {
		return "real";
	}
}

export function semanticAnalysis(lexicalResult: LexicalResult[]) {
	let argsCountdown = 0;
	let assigning = false;
	let assigningExpression: SemanticInfo[] = [];
	let declaringArgs = false;
	let declaringScope = false;
	let declaringVar = false;
	const stack: SemanticInfo[] = [];

	// console.log(lexicalResult);
	for (const [i, { token, classification, line }] of lexicalResult.entries()) {
		// console.log(stack);
		// console.log(token);
		// console.log(classification);
		if (classification !== "Identificador") {
			if (token === "end") {
				while (stack.pop().token !== "$") {}
				continue;
			}

			if (token !== "," && argsCountdown > 0) {
				argsCountdown -= 1;
			}

			const lowercaseToken = token.toLowerCase();
			if (declaringVar && ["boolean", "char", "integer", "real"].includes(lowercaseToken)) {
				for (const item of stack) {
					if (item.type === "fix") {
						item.type = lowercaseToken;
					}
				}

				continue;
			}

			if (classification === "Delimitador" && assigning) {
				assigning = false;
				const errorMessage = `Erro de tipo na expressão '${assigningExpression
					.reduce((expr, { token: term }) => `${expr} ${term}`, "")
					.slice(1)}' da linha ${"L"}`;

				const [{ type: result }, _, ...expression] = assigningExpression;
				let exprResult: string | RegExp;

				try {
					exprResult = evaluateExpression(expression);
				} catch (e) {
					throw new Error(`${errorMessage}: ${e.message}`);
				}

				if (new RegExp(exprResult, "g").exec(result) === null) {
					throw new Error(`${errorMessage}.`);
				}

				assigningExpression = [];
			}

			if (
				classification === "Delimitador" ||
				(declaringVar &&
					classification === "Palavra reservada" &&
					!["begin", "procedure"].includes(lowercaseToken))
			) {
				if (token === "(" && lexicalResult[i - 2].token.toLowerCase() === "procedure") {
					declaringArgs = true;
					argsCountdown = 3;
				}

				continue;
			}

			if (declaringArgs) {
				declaringArgs = false;
			} else if (declaringScope) {
				declaringScope = false;
			} else if (declaringVar) {
				declaringVar = false;
			} else if (token === "var") {
				declaringVar = true;
			}

			if (lowercaseToken === "procedure") {
				declaringScope = true;
				stack.push({ token: "$" });
			} else if (
				lowercaseToken === "program" ||
				(token === "begin" && lexicalResult[i - 1].token.toLowerCase() === "then")
			) {
				stack.push({ token: "$" });
			}

			if (token === ":=") {
				assigning = true;
				assigningExpression.push(
					stack.findLast(item => item.token === lexicalResult[i - 1].token),
					{ token, type: null },
				);
			} else if (assigning) {
				if (classification === "Operador") {
					assigningExpression.push({ token, type: null });
				} else if (classification === "Número inteiro") {
					assigningExpression.push({ token, type: "integer" });
				} else if (classification === "Número real") {
					assigningExpression.push({ token, type: "real" });
				}
			}

			continue;
		}

		const newToken = { token, type: "fix" };

		if (declaringArgs) {
			argsCountdown = 3;
			stack.push(newToken);
			continue;
		}

		if (stack.at(-1).token === "$" && (declaringScope || stack.length === 1)) {
			if (declaringScope) {
				stack[stack.length - 1] = { token, type: "procedure" };
				stack.push({ token: "$" });
				declaringScope = false;
			} else {
				stack.push({ token, type: "program" });
			}
			continue;
		}

		const foundIndex = stack.findIndex(item => item.token === token);

		if (declaringVar) {
			if (foundIndex > 1 && stack.findLastIndex(item => item.token === "$") < foundIndex) {
				throw new Error(`Variável '${token}' na linha ${line} já foi declarada`);
			}

			stack.push(newToken);
			continue;
		}

		if (foundIndex < 0) {
			throw new Error(`Variável '${token}' na linha ${line} não foi declarada`);
		}
		if (foundIndex === 1) {
			throw new Error(`Você usou o nome do programa '${token}' na linha ${line}, e isto não é permitido`);
		}

		if (assigning) {
			assigningExpression.push(stack.findLast(item => item.token === token));
		}
	}
}
