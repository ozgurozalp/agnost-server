import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Calculates the natural logarithm of a number and returns the result as a decimal number
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("ln", {
      paramCount: 1,
      returnType: ReturnType.NUMBER,
      params: [ReturnType.NUMBER],
      mapping: {
        MongoDB: "$ln",
        PostgreSQL: "LN",
        MySQL: "LN",
      },
    });
  }
}
