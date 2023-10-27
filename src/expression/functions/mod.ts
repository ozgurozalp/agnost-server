import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Returns the remainder of the first number divided by the second
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("mod", {
			paramCount: 2,
			returnType: ReturnType.NUMBER,
			params: [ReturnType.NUMBER, ReturnType.NUMBER],
			mapping: {
				MongoDB: "$mod",
				PostgreSQL: "MOD",
				MySQL: "MOD",
			},
		});
	}
}
