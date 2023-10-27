import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";
import { ClientError } from "../../utils/ClientError";

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
        PostgreSQL: "$custom",
        MySQL: "TIMESTAMPADD",
      },
    });
  }

  /**
   * Validates the function and its parameters
   * @param {string} dbType The database type
   */
  validate(dbType: string): void {
    super.validate(dbType);

    const validItems = [
      "year",
      "quarter",
      "week",
      "month",
      "day",
      "hour",
      "minute",
      "second",
    ];

    const unitOfMeasure = this.parameters[2]
      .getQuery(dbType)
      .replaceAll("'", "")
      .toLowerCase();

    if (!validItems.includes(unitOfMeasure))
      throw new ClientError(
        "invalid_parameter",
        `Function '${
          this.name
        }' expects unit of measure parameter either one of the following '${validItems.join(
          ", ",
        )}'.`,
      );
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
      case DBTYPE.POSTGRESQL: {
        const funcParams = [];
        for (const entry of this.parameters) {
          funcParams.push(entry.getQuery(dbType, callback));
        }

        return `(${funcParams[0]}::TIMESTAMP + (${
          funcParams[1]
        } || ' ' || ${funcParams[2].toUpperCase()})::INTERVAL)`;
      }
      case DBTYPE.MYSQL: {
        const funcParams = [];
        for (const entry of this.parameters) {
          funcParams.push(entry.getQuery(dbType, callback));
        }

        return `TIMESTAMPADD(${funcParams[2]
          .replaceAll("'", "")
          .toUpperCase()}, ${funcParams[1]}, ${funcParams[0]})`;
      }
      default:
        return null;
    }
  }
}
