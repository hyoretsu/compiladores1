// Gambiarra, o '.' era pra ser um delimitador, mas quase sempre vai ser parte de um número real. Aí eu tirei ele dos delimitadores e juntei no `end.`
export const classification = {
	Atribuição: [":="],
	Delimitador: [";", ":", "(", ")", ","],
	"Palavra reservada": [
		"begin",
		"boolean",
		"char",
		"do",
		"else",
		"end",
		"end.",
		"if",
		"integer",
		"not",
		"Procedure",
		"Program",
		"procedure",
		"program",
		"real",
		"then",
		"var",
		"while",
	],
	Identificador: (str: string) => {
		return str.match(/^[A-Za-z](?:[A-Za-z]|\d|_)*$/g);
	},
	"Número inteiro": (num: string) => {
		return Number.isInteger(Number(num));
	},
	"Número real": (num: string) => {
		return !Number.isNaN(Number(num));
	},
	Operador: ["=", "<", ">", "<=", ">=", "<>", "+", "-", "or", "*", "/", "and"],
};
export const regexReservedCharacters = ["*", "+", ".", "?", "|", "\\", "^", "$", "(", ")"];
export const regexes = {
	comment: /{.+?}/g,
	delimiters: new RegExp(
		`(:=|${classification.Delimitador.map(delimiter => {
			if (regexReservedCharacters.includes(delimiter)) {
				return `\\${delimiter}`;
			}

			return delimiter;
		}).join("|")})`,
		"g",
	),
	multilineComment: /{(?:.|\s|\t|\n)+?}/g,
	whitespace: /(?:\s|\t|\n)+/g,
};
