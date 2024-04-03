import { readFileSync } from "fs";
import { classification, regexReservedCharacters, regexes } from ".";

export type LexicalResult = {
	token: string;
	classification: string;
	line: number;
};

export default function lexicalAnalysis(inputPath: string) {
	const input = readFileSync(inputPath, { encoding: "utf8" });

	if ([...input.matchAll(/{/g)].length > [...input.matchAll(/}/g)].length) {
		console.error("Comentário não fechado");
		return;
	}

	const lines = input.split(/\n/g);

	const groupsMinusComments = input.split(regexes.multilineComment);

	// Keeps track of a token's number of uses, so that we can skip its appearances e.g. declaring and then using a variable
	const tokenOccurences: Record<string, number> = {};

	// Returns a table with the token and the line it's located in
	const tokens = groupsMinusComments.flatMap(group => {
		function findLine(str: string) {
			Object.assign(tokenOccurences, {
				[str]: (tokenOccurences[str] || 0) + 1,
			});

			// Find all occurences of the token
			const lineOccurences = lines
				.filter(
					line =>
						line.search(
							// We can't simply do `line.search(str)` because it would also find variables that are substrings, so we need to add '\b' into a regex. But then it won't account for EOL and whitespace, so we have to manually filter those too
							new RegExp(
								`${regexReservedCharacters.includes(str) ? `\\${str}` : str}(?:\\b|$|(${
									regexes.whitespace.source
								}))`,
								"g",
							),
						) >= 0,
				)
				.flatMap(line => {
					const numberOfOccurences = [
						...line.matchAll(
							new RegExp(
								str
									.split("")
									.map(char => (regexReservedCharacters.includes(char) ? `\\${char}` : char))
									.join(""),
								"g",
							),
						),
					].length;
					// numberOfOccurences > 1 && console.log(Array.from({ length: numberOfOccurences }, () => line));

					return numberOfOccurences > 1 ? Array.from({ length: numberOfOccurences }, () => line) : line;
				});

			// console.log(lineOccurences);

			// Get the xth occurence of the token, get its index (line) and add 1 to make it human-readable
			return lines.indexOf(lineOccurences[tokenOccurences[str] - 1]) + 1;
		}

		// Otherwise, filter whitespaces and the like
		return group
			.split(regexes.whitespace)
			.filter(group2 => group2)
			.flatMap(group2 => {
				const tokens = group2
					.split(regexes.delimiters)
					.filter(token => token)
					// Separar identificadores de operadores que foram confundidos como um token só
					.flatMap(token => token.split(/([^:<>]=|>=?|<=?|<>|\+|-|\*|\/)/g))
					.filter(token => token);

				return tokens.map(token => [token, findLine(token)]);
			});
	}) as [string, number][];

	const result = tokens.reduce<[string, string, number][]>((arr, [token, line]) => {
		const type = Object.entries(classification).find(([_, chars]) => {
			return typeof chars === "function" ? chars(token) : chars.includes(token);
		});
		if (!type) {
			throw new Error(`Erro de classificação no token \`${token}\` da linha ${line}`);
		}

		arr.push([token, type![0], line]);
		return arr;
	}, []);

	return result;
}
