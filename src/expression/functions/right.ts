import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Returns the last count characters from the end of the main string as a new string
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("right", {
      paramCount: 2,
      returnType: ReturnType.TEXT,
      params: [ReturnType.TEXT, ReturnType.NUMBER],
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
          $cond: {
            if: {
              $gt: [
                this.parameters[1].getQuery(dbType, callback),
                {
                  $strLenCP: this.parameters[0].getQuery(dbType, callback),
                },
              ],
            },
            then: this.parameters[0].getQuery(dbType, callback),
            else: {
              $substrCP: [
                this.parameters[0].getQuery(dbType, callback),
                {
                  $subtract: [
                    {
                      $strLenCP: this.parameters[0].getQuery(dbType, callback),
                    },
                    this.parameters[1].getQuery(dbType, callback),
                  ],
                },
                this.parameters[1].getQuery(dbType, callback),
              ],
            },
          },
        };
      default:
        return null;
    }
  }
}
