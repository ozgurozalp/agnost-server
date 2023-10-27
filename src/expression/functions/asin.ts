import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Returns the inverse sine (arcsine) of a number in radians, in the range -Pi/2 to Pi/2
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("asin", {
			paramCount: 1,
			returnType: ReturnType.NUMBER,
			params: [ReturnType.NUMBER],
			mapping: {
				MongoDB: "$asin",
				PostgreSQL: "ASIN",
				MySQL: "ASIN",
			},
		});
	}
}
