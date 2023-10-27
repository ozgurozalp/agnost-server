import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Returns the year part of a date
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("year", {
      paramCount: 1,
      returnType: ReturnType.NUMBER,
      params: [ReturnType.DATE],
      mapping: {
        MongoDB: "$year",
        PostgreSQL: "$custom",
        MySQL: "$custom",
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
        return `EXTRACT(YEAR FROM ${this.parameters[0].getQuery(
          dbType,
          callback,
        )}::DATE)`;
      case DBTYPE.MYSQL:
        return `EXTRACT(YEAR FROM ${this.parameters[0].getQuery(
          dbType,
          callback,
        )})`;
      default:
        return null;
    }
  }
}
