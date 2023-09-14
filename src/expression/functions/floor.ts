import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Returns the largest integer less than or equal to the specified number
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("floor", {
			paramCount: 1,
			returnType: ReturnType.NUMBER,
			params: [ReturnType.NUMBER],
			mapping: {
				MongoDB: "$floor",
			},
		});
	}
}
