import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Returns the hour part of a date as a number between 0 and 23
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("hour", {
			paramCount: 1,
			returnType: ReturnType.NUMBER,
			params: [ReturnType.DATE],
			mapping: {
				MongoDB: "$hour",
			},
		});
	}
}
