import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Adds numbers
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("add", {
      paramCount: -1,
      returnType: ReturnType.NUMBER,
      params: ReturnType.NUMBER,
      mapping: {
        MongoDB: "$add",
      },
    });
  }
}
