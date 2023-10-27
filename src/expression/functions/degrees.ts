import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Converts an input value measured in radians to degrees
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("degrees", {
      paramCount: 1,
      returnType: ReturnType.NUMBER,
      params: [ReturnType.NUMBER],
      mapping: {
        MongoDB: "$radiansToDegrees",
        PostgreSQL: "DEGREES",
        MySQL: "DEGREES",
      },
    });
  }
}
