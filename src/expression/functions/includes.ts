import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Checks whether the main string includes the characters of the search string, returning true or false as appropriate
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("includes", {
      paramCount: 3,
      returnType: ReturnType.BOOLEAN,
      params: [ReturnType.TEXT, ReturnType.TEXT, ReturnType.STATICBOOLEAN],
      mapping: {
        MongoDB: "$custom",
      },
    });
  }

  /**
   * Returns the database specific query structure of the where condition
   * @param {string} dbType The database type
   * @returns Query structure
   */
  getQuery(dbType: string, callback: (fieldPath: string) => string): any {
    switch (dbType) {
      case DBTYPE.MONGODB:
        return {
          $regexMatch: {
            input: this.parameters[0].getQuery(dbType, callback),
            regex: this.parameters[1].getQuery(dbType, callback),
            options:
              this.parameters[2].getQuery(dbType, callback) === false
                ? "i"
                : undefined,
          },
        };
      default:
        return null;
    }
  }
}
