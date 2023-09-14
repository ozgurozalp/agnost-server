import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Converts the input value to a date
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("toDate", {
			paramCount: 1,
			returnType: ReturnType.DATE,
			params: [ReturnType.ANY],
			mapping: {
				MongoDB: "$toDate",
			},
		});
	}
}
