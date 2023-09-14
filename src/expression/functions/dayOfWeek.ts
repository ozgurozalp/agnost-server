import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Returns the day of the week for a date as a number between 1 (Sunday) and 7 (Saturday)
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("dayOfWeek", {
			paramCount: 1,
			returnType: ReturnType.NUMBER,
			params: [ReturnType.DATE],
			mapping: {
				MongoDB: "$dayOfWeek",
			},
		});
	}
}
