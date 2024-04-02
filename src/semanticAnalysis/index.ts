import lexicalAnalysis from "../lexicalAnalysis/utils/lexicalAnalysis";

export type LexicalResult = Array<{ token: string; classification: string; line: number }>;

function main() {
	if (process.argv.length !== 3) {
		throw new Error("Passe o caminho do arquivo de input");
	}

	const lexicalResult = lexicalAnalysis(process.argv[2]).map(([token, classification, line]) => {
		return { token, classification, line };
	}) as LexicalResult;

	const scopeStack = [];
	const typeStack = [];

	let declaringArgs = false;
	let declaringScope = false;
	let declaringVar = false;
	let argsCountdown = 0;
	for (const { token, classification, line } of lexicalResult) {
		console.log(scopeStack);
		if (classification !== "Identificador") {
			if (token === "end") {
				while (scopeStack.pop() !== "$") {}
				continue;
			}

			if (token !== "," && argsCountdown > 0) {
				argsCountdown -= 1;
			}

			if (classification === "Delimitador") {
				if (token === "(") {
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
			} else {
				const lowercaseToken = token.toLowerCase();

				if (lowercaseToken === "procedure") {
					declaringScope = true;
					scopeStack.push("$");
				} else if (lowercaseToken === "program") {
					scopeStack.push("$");
				}
			}

			continue;
		}

		if (declaringArgs) {
			argsCountdown = 3;
			scopeStack.push(token);
			continue;
		}

		if (scopeStack.at(-1) === "$") {
			if (declaringScope) {
				scopeStack[scopeStack.length - 1] = token;
				scopeStack.push("$");
				declaringScope = false;
			} else {
				scopeStack.push(token);
			}
			continue;
		}

		if (declaringVar) {
			scopeStack.push(token);
			continue;
		}

		const foundIndex = scopeStack.findIndex(item => item === token);
		if (foundIndex < 0 || foundIndex === 1) {
			throw new Error(`Erro semântico no identificador '${token}' na linha ${line}`);
		}
	}

	// console.log(lexicalResult);
	console.log(scopeStack);
}

main();
