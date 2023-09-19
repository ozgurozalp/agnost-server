import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Subtracts the numbers
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("subtract", {
      paramCount: 2,
      returnType: ReturnType.NUMBER,
      params: [ReturnType.NUMBER, ReturnType.NUMBER],
      mapping: {
        MongoDB: "$subtract",
      },
    });
  }
}
