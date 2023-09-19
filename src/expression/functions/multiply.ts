import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Multiplies the numbers
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("multiply", {
      paramCount: -1,
      returnType: ReturnType.NUMBER,
      params: ReturnType.NUMBER,
      mapping: {
        MongoDB: "$multiply",
      },
    });
  }
}
