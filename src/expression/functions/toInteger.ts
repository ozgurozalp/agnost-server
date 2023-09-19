import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Converts the input value to an integer
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("toInteger", {
      paramCount: 1,
      returnType: ReturnType.NUMBER,
      params: [ReturnType.ANY],
      mapping: {
        MongoDB: "$toInt",
      },
    });
  }
}
