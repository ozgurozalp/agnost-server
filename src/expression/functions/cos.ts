import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Returns the cosine of a value that is measured in radians
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("cos", {
      paramCount: 1,
      returnType: ReturnType.NUMBER,
      params: [ReturnType.NUMBER],
      mapping: {
        MongoDB: "$cos",
        PostgreSQL: "COS",
        MySQL: "COS",
      },
    });
  }
}
