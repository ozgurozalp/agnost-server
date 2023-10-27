import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Constructs and returns a geo point value given the constituent longitude and latitude properties
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("point", {
			paramCount: 2,
			returnType: ReturnType.GEOPOINT,
			params: [ReturnType.NUMBER, ReturnType.NUMBER],
			mapping: {
				MongoDB: "$custom",
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
				return {
					type: "Point",
					coordinates: [
						this.parameters[0].getQuery(dbType, callback),
						this.parameters[1].getQuery(dbType, callback),
					],
				};
			case DBTYPE.POSTGRESQL:
				return `'${this.parameters[0].getQuery(
					dbType,
					callback
				)},${this.parameters[1].getQuery(dbType, callback)}'::POINT`;
			case DBTYPE.MYSQL:
				return `POINT(${this.parameters[0].getQuery(
					dbType,
					callback
				)} ${this.parameters[1].getQuery(dbType, callback)})`; // Note that no commas between x and y coordinates
			default:
				return null;
		}
	}
}
