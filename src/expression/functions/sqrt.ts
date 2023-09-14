import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Calculates the square root of a positive number and returns the result as a decimal
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("sqrt", {
			paramCount: 1,
			returnType: ReturnType.NUMBER,
			params: [ReturnType.NUMBER],
			mapping: {
				MongoDB: "$sqrt",
			},
		});
	}
}
