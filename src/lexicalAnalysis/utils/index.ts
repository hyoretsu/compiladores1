export const classification = {
	Atribuição: [":="],
	Delimitador: [";", ".", ":", "(", ")", ","],
	"Palavra reservada": [
		"begin",
		"boolean",
		"do",
		"else",
		"end",
		"if",
		"integer",
		"not",
		"procedure",
		"program",
		"real",
		"then",
		"var",
		"while",
	],
	Identificador: (str: string) => str.match(/^[A-Za-z](?:[A-Za-z]|\d|_)*$/g),
	"Número inteiro": (num: string) => Number.isInteger(Number(num)),
	"Número real": (num: string) => !Number.isNaN(Number(num)),
	Operador: ["=", "<", ">", "<=", ">=", "<>", "+", "-", "or", "*", "/", "and"],
};
export const regexReservedCharacters = ["*", "+", ".", "?", "|", "\\", "^", "$", "(", ")"];
export const regexes = {
	comment: /{.+?}/g,
	delimiters: new RegExp(
		`(:=|${classification.Delimitador.map(delimiter =>
			regexReservedCharacters.includes(delimiter) ? `\\${delimiter}` : delimiter,
		).join("|")})`,
		"g",
	),
	multilineComment: /{(?:.|\s|\t|\n)+?}/g,
	whitespace: /(?:\s|\t|\n)+/g,
};
