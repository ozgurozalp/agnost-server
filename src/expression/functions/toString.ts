import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Converts the input value to a string
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("toString", {
			paramCount: 1,
			returnType: ReturnType.TEXT,
			params: [ReturnType.ANY],
			mapping: {
				MongoDB: "$toString",
				PostgreSQL: "CAST",
				MySQL: "CAST",
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
				return `${value}::TEXT`;
			}
			case DBTYPE.MYSQL: {
				const value = this.parameters[0].getQuery(dbType, callback);
				return `CAST(${value} AS CHAR)`;
			}
			default:
				return null;
		}
	}
}
