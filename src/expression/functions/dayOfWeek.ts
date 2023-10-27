import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Returns the day of the week for a date as a number between 1 (Sunday) and 7 (Saturday)
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("dayOfWeek", {
      paramCount: 1,
      returnType: ReturnType.NUMBER,
      params: [ReturnType.DATE],
      mapping: {
        MongoDB: "$dayOfWeek",
        PostgreSQL: "$custom",
        MySQL: "DAYOFWEEK",
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
        return super.getQuery(dbType, callback);
      case DBTYPE.POSTGRESQL:
        return `(EXTRACT(DOW FROM ${this.parameters[0].getQuery(
          dbType,
          callback,
        )}::DATE) + 1)`;
      case DBTYPE.MYSQL:
        return `DAYOFWEEK(${this.parameters[0].getQuery(dbType, callback)})`;
      default:
        return null;
    }
  }
}
