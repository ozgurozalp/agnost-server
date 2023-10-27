import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Concatenates strings and returns the concatenated string
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("concat", {
      paramCount: -1,
      returnType: ReturnType.TEXT,
      params: ReturnType.PRIMITIVE,
      mapping: {
        MongoDB: "$concat",
        PostgreSQL: "||",
        MySQL: "CONCAT",
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
      case DBTYPE.MYSQL:
        return super.getQuery(dbType, callback);
      case DBTYPE.POSTGRESQL:
        const funcParams = [];
        for (const entry of this.parameters) {
          funcParams.push(entry.getQuery(dbType, callback));
        }

        return `(${funcParams.join(" || ")})`;
      default:
        return null;
    }
  }
}
