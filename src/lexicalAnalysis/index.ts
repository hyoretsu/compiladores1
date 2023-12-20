import { table } from "table";
import input from "./input.txt";
import { classification, regexReservedCharacters, regexes } from "./utils";

const main = () => {
	if ([...input.matchAll(/{/g)].length > [...input.matchAll(/}/g)].length) {
		console.error("Comentário não fechado");
		return;
	}

	// Separate each line to inform later on in the table
	const lines = input.split(/\n/g);

	// Remove comments
	const groupsMinusComments = input.split(regexes.multilineComment);

	// Keeps track of a token's number of uses, so that we can skip its appearances e.g. declaring and then using a variable
	const tokenOccurences: Record<string, number> = {};

	// Returns a 2-D array of [token, line]
	const tokens = groupsMinusComments.flatMap(group => {
		const findLine = (str: string) => {
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

					return numberOfOccurences > 1 ? Array.from({ length: numberOfOccurences }, () => line) : line;
				});

			// Get the xth occurence of the token, get its index (line) and add 1 to make it human-readable
			return lines.indexOf(lineOccurences[tokenOccurences[str] - 1]) + 1;
		};

		// Otherwise, filter whitespaces and the like
		return group
			.split(regexes.whitespace)
			.filter(group2 => group2)
			.flatMap(group2 => {
				const tokens = group2.split(regexes.delimiters).filter(token => token);

				return tokens.map(token => [token, findLine(token)]);
			});
	}) as [string, number][];

	try {
		console.log(
			table(
				tokens.reduce(
					(arr, [token, line]) => {
						const type = Object.entries(classification).find(([_, chars]) => {
							return typeof chars === "function" ? chars(token) : chars.includes(token);
						});
						if (!type) {
							throw new Error(`Erro de classificação no token \`${token}\` da linha ${line}`);
						}

						arr.push([token, type![0], line]);
						return arr;
					},
					[["Token", "Classificação", "Linha"]] as Array<string | number>[],
				),
			),
		);
	} catch (e) {
		if (e instanceof Error) {
			console.error(e.message);
			return;
		}
	}
};

main();
