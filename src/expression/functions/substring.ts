import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Returns the substring of a string. The substring starts with the character at the specified index (zero-based) in the string for the number of characters (count) specified.
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("substring", {
			paramCount: 3,
			returnType: ReturnType.TEXT,
			params: [ReturnType.TEXT, ReturnType.NUMBER, ReturnType.NUMBER],
			mapping: {
				MongoDB: "$substrCP",
			},
		});
	}
}
