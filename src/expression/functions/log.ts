import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Calculates the log of a number in the specified base and returns the result as a double
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("log", {
      paramCount: 2,
      returnType: ReturnType.NUMBER,
      params: [ReturnType.NUMBER, ReturnType.NUMBER],
      mapping: {
        MongoDB: "$log",
      },
    });
  }
}
