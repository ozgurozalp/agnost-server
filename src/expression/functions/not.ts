import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Defines logical not function
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("not", {
      paramCount: 1,
      returnType: ReturnType.BOOLEAN,
      params: ReturnType.BOOLEAN,
      mapping: {
        MongoDB: "$custom",
      },
    });
  }
}
