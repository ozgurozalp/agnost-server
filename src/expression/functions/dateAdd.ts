import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Adds a period of time to the input date & time value and returns the resulting date & time value
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("dateAdd", {
      paramCount: 3,
      returnType: ReturnType.DATE,
      params: [ReturnType.DATE, ReturnType.NUMBER, ReturnType.TEXT],
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
          $dateAdd: {
            startDate: this.parameters[0].getQuery(dbType, callback),
            amount: this.parameters[1].getQuery(dbType, callback),
            unit: this.parameters[2].getQuery(dbType, callback),
          },
        };
      default:
        return null;
    }
  }
}
