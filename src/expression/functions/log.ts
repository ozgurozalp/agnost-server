import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Calculates the log of a number in the specified base and returns the result as a double
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("log", {
      paramCount: 2,
      returnType: ReturnType.NUMBER,
      params: [ReturnType.NUMBER, ReturnType.NUMBER],
      mapping: {
        MongoDB: "$log",
        PostgreSQL: "LOG",
        MySQL: "n/a",
      },
    });
  }

  /**
   * Returns the database specific query structure of the where condition
   * @param {string} dbType The database type
   * @returns Query structure
   */
  getQuery(dbType: string, callback?: (fieldPath: string) => string): any {
    switch (dbType) {
      case DBTYPE.MONGODB:
        return super.getQuery(dbType, callback);
      case DBTYPE.POSTGRESQL:
        const funcParams = [];
        for (const entry of this.parameters) {
          funcParams.push(entry.getQuery(dbType, callback));
        }

        return `LOG(${funcParams[1]}, ${funcParams[0]})`;
      default:
        return null;
    }
  }
}
