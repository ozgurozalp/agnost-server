import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Returns the second part of a date as a number between 0 and 59
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("second", {
      paramCount: 1,
      returnType: ReturnType.NUMBER,
      params: [ReturnType.DATE],
      mapping: {
        MongoDB: "$second",
      },
    });
  }
}
