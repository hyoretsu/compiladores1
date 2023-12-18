import { Console } from "node:console";
import { Transform } from "node:stream";

const printTable = (input: Array<Record<string, any>>) => {
	// @see https://stackoverflow.com/a/67859384
	const ts = new Transform({
		transform(chunk, enc, cb) {
			cb(null, chunk);
		},
	});
	const logger = new Console({ stdout: ts });
	logger.table(input);
	const table = (ts.read() || "").toString();
	let result = "";
	for (const row of table.split(/[\r\n]+/)) {
		let r = row.replace(/[^┬]*┬/, "┌");
		r = r.replace(/^├─*┼/, "├");
		r = r.replace(/│[^│]*/, "");
		r = r.replace(/^└─*┴/, "└");
		r = r.replace(/'/g, " ");
		result += `${r}\n`;
	}
	console.log(result.slice(0, result.length - 2));
};

export default printTable;
