import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Returns the month of a date as a number between 1 and 12
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("month", {
			paramCount: 1,
			returnType: ReturnType.NUMBER,
			params: [ReturnType.DATE],
			mapping: {
				MongoDB: "$month",
			},
		});
	}
}
