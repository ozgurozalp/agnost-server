import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Returns the hyperbolic tangent of a value that is measured in radians
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("tanh", {
      paramCount: 1,
      returnType: ReturnType.NUMBER,
      params: [ReturnType.NUMBER],
      mapping: {
        MongoDB: "$tanh",
      },
    });
  }
}
