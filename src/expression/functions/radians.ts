import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Converts an input value measured in degrees to radians
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("radians", {
			paramCount: 1,
			returnType: ReturnType.NUMBER,
			params: [ReturnType.NUMBER],
			mapping: {
				MongoDB: "$degreesToRadians",
				PostgreSQL: "RADIANS",
				MySQL: "RADIANS",
			},
		});
	}
}
