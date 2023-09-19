import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Returns the minute part of a date as an integer between 0 and 59
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("minute", {
      paramCount: 1,
      returnType: ReturnType.NUMBER,
      params: [ReturnType.DATE],
      mapping: {
        MongoDB: "$minute",
      },
    });
  }
}
