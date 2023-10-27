import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Raises Euler’s number (e, the base of the natural logarithm) to the specified exponent and returns the result
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("exp", {
			paramCount: 1,
			returnType: ReturnType.NUMBER,
			params: [ReturnType.NUMBER],
			mapping: {
				MongoDB: "$exp",
				PostgreSQL: "EXP",
				MySQL: "EXP",
			},
		});
	}
}
