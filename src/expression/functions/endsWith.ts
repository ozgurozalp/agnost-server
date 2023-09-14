import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Checks whether a string ends with the characters of a specified string, returning true or false as appropriate
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("endsWith", {
			paramCount: 2,
			returnType: ReturnType.BOOLEAN,
			params: [ReturnType.TEXT, ReturnType.TEXT],
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
							$lt: [
								{
									$subtract: [
										{
											$strLenCP: this.parameters[0].getQuery(dbType, callback),
										},
										{
											$strLenCP: this.parameters[1].getQuery(dbType, callback),
										},
									],
								},
								0,
							],
						},
						then: false,
						else: {
							$eq: [
								{
									$indexOfCP: [
										this.parameters[0].getQuery(dbType, callback),
										this.parameters[1].getQuery(dbType, callback),
										{
											$subtract: [
												{
													$strLenCP: this.parameters[0].getQuery(
														dbType,
														callback
													),
												},
												{
													$strLenCP: this.parameters[1].getQuery(
														dbType,
														callback
													),
												},
											],
										},
									],
								},
								{
									$subtract: [
										{
											$strLenCP: this.parameters[0].getQuery(dbType, callback),
										},
										{
											$strLenCP: this.parameters[1].getQuery(dbType, callback),
										},
									],
								},
							],
						},
					},
				};
			default:
				return null;
		}
	}
}
