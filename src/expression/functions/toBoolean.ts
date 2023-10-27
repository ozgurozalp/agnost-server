import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Converts the input value to a boolean
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("toBoolean", {
      paramCount: 1,
      returnType: ReturnType.BOOLEAN,
      params: [ReturnType.ANY],
      mapping: {
        MongoDB: "$toBool",
        PostgreSQL: "$custom",
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
      case DBTYPE.POSTGRESQL: {
        const value = this.parameters[0].getQuery(dbType, callback);
        return `${value}::BOOLEAN`;
      }
      case DBTYPE.MYSQL: {
        const value = this.parameters[0].getQuery(dbType, callback);
        return `(${value} IS NOT NULL AND ${value} <> 0)`;
      }
      default:
        return null;
    }
  }
}
