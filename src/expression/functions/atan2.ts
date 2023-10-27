import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Returns the inverse tangent (arc tangent) of y / x, where y and x are the first and second parameters of the function respectively
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("atan2", {
			paramCount: 2,
			returnType: ReturnType.NUMBER,
			params: [ReturnType.NUMBER, ReturnType.NUMBER],
			mapping: {
				MongoDB: "$atan2",
				PostgreSQL: "ATAN2",
				MySQL: "ATAN2",
			},
		});
	}
}
