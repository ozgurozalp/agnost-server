import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Returns the inverse tangent (arctangent) of a value in radians, in the range -Pi/2 to Pi/2
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("atan", {
			paramCount: 1,
			returnType: ReturnType.NUMBER,
			params: [ReturnType.NUMBER],
			mapping: {
				MongoDB: "$atan",
				PostgreSQL: "ATAN",
				MySQL: "ATAN",
			},
		});
	}
}
