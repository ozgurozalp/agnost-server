import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Returns the year part of a date
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("year", {
      paramCount: 1,
      returnType: ReturnType.NUMBER,
      params: [ReturnType.DATE],
      mapping: {
        MongoDB: "$year",
      },
    });
  }
}
