import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Returns the inverse hyperbolic cosine (hyperbolic arc cosine) of a value
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("acosh", {
      paramCount: 1,
      returnType: ReturnType.NUMBER,
      params: [ReturnType.NUMBER],
      mapping: {
        MongoDB: "$acosh",
        PostgreSQL: "ACOSH",
        MySQL: "n/a",
      },
    });
  }
}
