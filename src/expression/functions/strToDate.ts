import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Converts a date & time string in a specific format to a date & time value
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("strToDate", {
			paramCount: 1,
			returnType: ReturnType.DATE,
			params: ReturnType.TEXT,
			mapping: {
				MongoDB: "$custom",
				PostgreSQL: "TO_TIMESTAMP",
				MySQL: "STR_TO_DATE",
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
					$dateFromString: {
						dateString: this.parameters[0].getQuery(dbType, callback),
						format: "%Y-%m-%d %H:%M:%S",
					},
				};
			case DBTYPE.POSTGRESQL:
				return `TO_TIMESTAMP(${this.parameters[0].getQuery(
					dbType,
					callback
				)}, 'YYYY-MM-DD HH24:MI:SS')::TIMESTAMP`;
			case DBTYPE.MYSQL:
				return `STR_TO_DATE(${this.parameters[0].getQuery(
					dbType,
					callback
				)}, '%Y-%m-%d %H:%i:%s')`;
			default:
				return null;
		}
	}
}
