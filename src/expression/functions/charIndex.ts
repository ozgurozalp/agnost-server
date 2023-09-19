import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Searches a string for an occurrence of a substring and returns the index (zero-based) of the first occurrence. If the substring is not found, returns -1 in MongoDB and 0 in SQL databases.
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("charIndex", {
      paramCount: 3,
      returnType: ReturnType.NUMBER,
      params: [ReturnType.TEXT, ReturnType.TEXT, ReturnType.NUMBER],
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
        if (this.parameters[2])
          return {
            $indexOfCP: [
              this.parameters[0].getQuery(dbType, callback),
              this.parameters[1].getQuery(dbType, callback),
              this.parameters[2].getQuery(dbType, callback),
            ],
          };
        else
          return {
            $indexOfCP: [
              this.parameters[0].getQuery(dbType, callback),
              this.parameters[1].getQuery(dbType, callback),
            ],
          };
      default:
        return null;
    }
  }
}
