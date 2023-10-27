import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Returns the absolute value of a number
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("abs", {
      paramCount: 1,
      returnType: ReturnType.NUMBER,
      params: [ReturnType.NUMBER],
      mapping: {
        MongoDB: "$abs",
        PostgreSQL: "ABS",
        MySQL: "ABS",
      },
    });
  }
}
