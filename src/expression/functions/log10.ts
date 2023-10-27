import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Calculates the log base 10 of a number and returns the result as a decimal number
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("log10", {
      paramCount: 1,
      returnType: ReturnType.NUMBER,
      params: [ReturnType.NUMBER],
      mapping: {
        MongoDB: "$log10",
        PostgreSQL: "LOG10",
        MySQL: "LOG10",
      },
    });
  }
}
