import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Converts the input value to a decimal
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("toDecimal", {
      paramCount: 1,
      returnType: ReturnType.NUMBER,
      params: [ReturnType.ANY],
      mapping: {
        MongoDB: "$toDecimal",
      },
    });
  }
}
