import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Adds numbers
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("now", {
      paramCount: 0,
      returnType: ReturnType.DATETIME,
      params: ReturnType.ANY,
      mapping: {
        MongoDB: "$currentDate",
        PostgreSQL: "NOW",
        MySQL: "NOW",
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
        return { $currentDate: { format: "iso" } };
      case DBTYPE.POSTGRESQL:
      case DBTYPE.MYSQL:
        return "NOW()";
      default:
        return null;
    }
  }
}
