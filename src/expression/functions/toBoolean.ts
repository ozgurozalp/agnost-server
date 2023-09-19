import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Converts the input value to a boolean
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("toBoolean", {
      paramCount: 1,
      returnType: ReturnType.BOOLEAN,
      params: [ReturnType.ANY],
      mapping: {
        MongoDB: "$toBool",
      },
    });
  }
}
