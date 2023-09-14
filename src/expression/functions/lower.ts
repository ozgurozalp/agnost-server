import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Converts a string to lowercase and returns the resulting new string
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("lower", {
			paramCount: 1,
			returnType: ReturnType.TEXT,
			params: [ReturnType.TEXT],
			mapping: {
				MongoDB: "$toLower",
			},
		});
	}
}
