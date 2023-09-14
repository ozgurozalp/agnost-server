import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Converts a value to a MongoDB ObjectId(). If the value cannot be converted to an ObjectId, it returns errors. If the value is null or missing, it returns null.
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("toObjectId", {
			paramCount: 1,
			returnType: ReturnType.ID,
			params: [ReturnType.ANY],
			mapping: {
				MongoDB: "$toObjectId",
			},
		});
	}
}
