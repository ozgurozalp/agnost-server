import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Concatenates strings and returns the concatenated string
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("concat", {
			paramCount: -1,
			returnType: ReturnType.TEXT,
			params: ReturnType.TEXT,
			mapping: {
				MongoDB: "$concat",
			},
		});
	}
}
