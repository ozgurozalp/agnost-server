import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Returns the day of the month for a date as a number between 1 and 31
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("dayOfMonth", {
			paramCount: 1,
			returnType: ReturnType.NUMBER,
			params: [ReturnType.DATE],
			mapping: {
				MongoDB: "$dayOfMonth",
			},
		});
	}
}
