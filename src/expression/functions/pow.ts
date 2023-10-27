import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Raises a number to the specified exponent and returns the result. 0 (zero) cannot be raised by a negative exponent in POW function
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("pow", {
      paramCount: 2,
      returnType: ReturnType.NUMBER,
      params: [ReturnType.NUMBER, ReturnType.NUMBER],
      mapping: {
        MongoDB: "$pow",
        PostgreSQL: "POW",
        MySQL: "POW",
      },
    });
  }
}
