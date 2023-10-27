import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Returns the inverse hyperbolic tangent (hyperbolic arctangent) of a value
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("atanh", {
			paramCount: 1,
			returnType: ReturnType.NUMBER,
			params: [ReturnType.NUMBER],
			mapping: {
				MongoDB: "$atanh",
				PostgreSQL: "ATANH",
				MySQL: "n/a",
			},
		});
	}
}
