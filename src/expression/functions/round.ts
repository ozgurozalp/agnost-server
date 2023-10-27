import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Rounds a number to a whole integer or to a specified decimal place
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("round", {
      paramCount: 2,
      returnType: ReturnType.NUMBER,
      params: [ReturnType.NUMBER, ReturnType.NUMBER],
      mapping: {
        MongoDB: "$round",
        PostgreSQL: "ROUND",
        MySQL: "ROUND",
      },
    });
  }
}
