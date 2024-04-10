import { readFileSync } from "fs";
import { table } from "table";
import { classification, regexReservedCharacters, regexes } from "./utils";
import LexicalAnalyser from "./utils/LexicalAnalyser";

const main = () => {
	if (process.argv.length !== 3) {
		throw new Error("Passe o caminho do arquivo de input");
	}

	const input = readFileSync(process.argv[2], { encoding: "utf8" });

	if ([...input.matchAll(/{/g)].length > [...input.matchAll(/}/g)].length) {
		console.error("Comentário não fechado");
		return;
	}
	const lines = input.split(/\n/g);

	const groupsMinusComments = input.split(regexes.multilineComment);

	// Keeps track of a token's number of uses, so that we can skip its appearances e.g. declaring and then using a variable
	const tokenOccurences: Record<string, number> = {};

	const analyser = new LexicalAnalyser(
		{
			initial: {
				a: "and1",
				b: "beginBoolean",
				d: "do",
				e: "elseEnd",
				i: "ifInteger",
				n: "not1",
				o: "or",
				p: "procedureProgram1",
				r: "real1",
				t: "then1",
				v: "var1",
				w: "while1",
				";|\\.|:|\\(|\\)|,": "Delimitador",
				"[A-Za-z]": "Identificador",
				"\\d": "Número inteiro",
				"=|<|>|\\+|-|\\*|\\/": "Operador",
			},
			Delimitador: {
				"=": "Atribuição",
			},
			Identificador: {
				"[A-Za-z]|\\d|_": "Identificador",
			},
			"Número inteiro": {
				"\\d": "Número inteiro",
				"\\.": "float",
			},
			"Palavra reservada": {
				".": "Identificador",
			},
			float: {
				"\\d": "Número real",
			},
			word: {
				n: "and1",
				"[A-Za-z]|\\d|_": "Identificador",
			},
			and1: { n: "and2", ".": "Identificador" },
			and2: { d: "Operador", ".": "Identificador" },
			beginBoolean: { e: "begin1", o: "boolean1", ".": "Identificador" },
			begin1: { g: "begin2", ".": "Identificador" },
			begin2: { i: "begin3", ".": "Identificador" },
			begin3: { n: "Palavra reservada", ".": "Identificador" },
			boolean1: { o: "boolean2", ".": "Identificador" },
			boolean2: { l: "boolean3", ".": "Identificador" },
			boolean3: { e: "boolean4", ".": "Identificador" },
			boolean4: { a: "boolean5", ".": "Identificador" },
			boolean5: { n: "Palavra reservada", ".": "Identificador" },
			do: { o: "Palavra reservada", ".": "Identificador" },
			elseEnd: { l: "else1", n: "end", ".": "Identificador" },
			else1: { s: "else2,", ".": "Identificador" },
			else2: { e: "Palavra reservada", ".": "Identificador" },
			end: { d: "Palavra reservada", ".": "Identificador" },
			ifInteger: { f: "Palavra reservada", n: "integer1", ".": "Identificador" },
			integer1: { t: "integer2", ".": "Identificador" },
			integer2: { e: "integer3", ".": "Identificador" },
			integer3: { g: "integer4", ".": "Identificador" },
			integer4: { e: "integer5", ".": "Identificador" },
			integer5: { r: "Palavra reservada", ".": "Identificador" },
			not1: { o: "not2", ".": "Identificador" },
			not2: { t: "Palavra reservada", ".": "Identificador" },
			or: { r: "Palavra reservada", ".": "Identificador" },
			procedureProgram1: { r: "procedureProgram2", ".": "Identificador" },
			procedureProgram2: { o: "procedureProgram3", ".": "Identificador" },
			procedureProgram3: { c: "procedure1", g: "program1", ".": "Identificador" },
			procedure1: { e: "procedure2", ".": "Identificador" },
			procedure2: { d: "procedure3", ".": "Identificador" },
			procedure3: { u: "procedure4", ".": "Identificador" },
			procedure4: { r: "procedure5", ".": "Identificador" },
			procedure5: { e: "Palavra reservada", ".": "Identificador" },
			program1: { r: "program2", ".": "Identificador" },
			program2: { a: "program3", ".": "Identificador" },
			program3: { m: "Palavra reservada", ".": "Identificador" },
			real1: { e: "real2", ".": "Identificador" },
			real2: { a: "real3", ".": "Identificador" },
			real3: { l: "Palavra reservada", ".": "Identificador" },
			then1: { h: "then2", ".": "Identificador" },
			then2: { e: "then3", ".": "Identificador" },
			then3: { n: "Palavra reservada", ".": "Identificador" },
			var1: { a: "var2", ".": "Identificador" },
			var2: { r: "Palavra reservada", ".": "Identificador" },
			while1: { h: "while2", ".": "Identificador" },
			while2: { h: "while3", ".": "Identificador" },
			while3: { h: "while4", ".": "Identificador" },
			while4: { e: "Palavra reservada", ".": "Identificador" },
		},
		Object.keys(classification),
		"initial",
	);

	// Returns a table with the token and the line it's located in
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
					// numberOfOccurences > 1 && console.log(Array.from({ length: numberOfOccurences }, () => line));

					return numberOfOccurences > 1 ? Array.from({ length: numberOfOccurences }, () => line) : line;
				});

			// console.log(lineOccurences);

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
						let type = "";
						const pass = analyser.test(token);
						if (pass) {
							type = analyser.currentState;
						}

						arr.push([token, type, line]);
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
