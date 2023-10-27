import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";
import { ClientError } from "../../utils/ClientError";

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
        PostgreSQL: "$custom",
        MySQL: "TIMESTAMPDIFF",
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
          $dateDiff: {
            startDate: this.parameters[0].getQuery(dbType, callback),
            endDate: this.parameters[1].getQuery(dbType, callback),
            unit: this.parameters[2].getQuery(dbType, callback),
          },
        };
      case DBTYPE.POSTGRESQL: {
        const funcParams = [];
        for (const entry of this.parameters) {
          funcParams.push(entry.getQuery(dbType, callback));
        }
        const unitOfMeasure = this.parameters[2]
          .getQuery(dbType)
          .replaceAll("'", "")
          .toLowerCase();

        switch (unitOfMeasure) {
          case "year":
            return `EXTRACT(YEAR FROM AGE(${funcParams[1]}::TIMESTAMP, ${funcParams[0]}::TIMESTAMP))`;
          case "quarter":
            return `FLOOR((EXTRACT(YEAR FROM AGE(${funcParams[1]}::TIMESTAMP, ${funcParams[0]}::TIMESTAMP)) * 12 + EXTRACT(MONTH FROM AGE( ${funcParams[1]}::TIMESTAMP,  ${funcParams[0]}::TIMESTAMP)))/3)`;
          case "week":
            return `FLOOR(EXTRACT(EPOCH FROM (${funcParams[1]}::TIMESTAMP - ${funcParams[0]}::TIMESTAMP)) / (60*60*24*7))`;
          case "month":
            return `(EXTRACT(YEAR FROM AGE(${funcParams[1]}::TIMESTAMP, ${funcParams[0]}::TIMESTAMP)) * 12 + EXTRACT(MONTH FROM AGE(${funcParams[1]}::TIMESTAMP, ${funcParams[0]}::TIMESTAMP)))`;
          case "day":
            return `EXTRACT(DAY FROM (${funcParams[1]}::TIMESTAMP - ${funcParams[0]}::TIMESTAMP))`;
          case "hour":
            return `FLOOR(EXTRACT(EPOCH FROM (${funcParams[1]}::TIMESTAMP - ${funcParams[0]}::TIMESTAMP)) / (60*60))`;
          case "minute":
            return `FLOOR(EXTRACT(EPOCH FROM (${funcParams[1]}::TIMESTAMP - ${funcParams[0]}::TIMESTAMP)) / 60)`;
          case "second":
            return `FLOOR(EXTRACT(EPOCH FROM (${funcParams[1]}::TIMESTAMP - ${funcParams[0]}::TIMESTAMP)))`;
          default:
            return null;
        }
      }
      case DBTYPE.MYSQL: {
        const funcParams = [];
        for (const entry of this.parameters) {
          funcParams.push(entry.getQuery(dbType, callback));
        }

        return `TIMESTAMPDIFF(${funcParams[2]
          .replaceAll("'", "")
          .toUpperCase()}, ${funcParams[0]}, ${funcParams[1]})`;
      }
      default:
        return null;
    }
  }
}
