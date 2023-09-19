import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Defines logical or function
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("or", {
      paramCount: -1,
      returnType: ReturnType.BOOLEAN,
      params: ReturnType.BOOLEAN,
      mapping: {
        MongoDB: "$or",
      },
    });
  }
}
