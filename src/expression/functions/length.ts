import { Function } from "../Function";
import { ReturnType } from "../../utils/types";

/**
 * Returns the number of characters in the specified string
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("length", {
      paramCount: 1,
      returnType: ReturnType.NUMBER,
      params: [ReturnType.TEXT],
      mapping: {
        MongoDB: "$strLenCP",
        PostgreSQL: "CHAR_LENGTH",
        MySQL: "CHAR_LENGTH",
      },
    });
  }
}
