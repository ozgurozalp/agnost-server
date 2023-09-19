import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Calculates the difference between two date & time values as a duration.
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("dateDiff", {
      paramCount: 3,
      returnType: ReturnType.NUMBER,
      params: [ReturnType.DATE, ReturnType.DATE, ReturnType.TEXT],
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
          $dateDiff: {
            startDate: this.parameters[0].getQuery(dbType, callback),
            endDate: this.parameters[1].getQuery(dbType, callback),
            unit: this.parameters[2].getQuery(dbType, callback),
          },
        };
      default:
        return null;
    }
  }
}
