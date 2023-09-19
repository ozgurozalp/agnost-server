import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Converts the input value to a string
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("toString", {
      paramCount: 1,
      returnType: ReturnType.TEXT,
      params: [ReturnType.ANY],
      mapping: {
        MongoDB: "$toString",
      },
    });
  }
}
