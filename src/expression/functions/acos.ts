import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Returns the inverse cosine (arccosine) of a number, in radians in the range 0 to Pi
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("acos", {
			paramCount: 1,
			returnType: ReturnType.NUMBER,
			params: [ReturnType.NUMBER],
			mapping: {
				MongoDB: "$acos",
				PostgreSQL: "ACOS",
				MySQL: "ACOS",
			},
		});
	}
}
