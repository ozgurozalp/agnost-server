import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Returns the day of the year for a date as a number between 1 and 366
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("dayOfYear", {
			paramCount: 1,
			returnType: ReturnType.NUMBER,
			params: [ReturnType.DATE],
			mapping: {
				MongoDB: "$dayOfYear",
			},
		});
	}
}
