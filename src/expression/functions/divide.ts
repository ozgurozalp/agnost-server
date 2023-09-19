import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Divides numbers
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("divide", {
      paramCount: 2,
      returnType: ReturnType.NUMBER,
      params: [ReturnType.NUMBER, ReturnType.NUMBER],
      mapping: {
        MongoDB: "$divide",
      },
    });
  }
}
