import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Calculates the distance between two geo points in meters
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("distance", {
			paramCount: 2,
			returnType: ReturnType.NUMBER,
			params: [ReturnType.GEOPOINT, ReturnType.GEOPOINT],
			mapping: {
				MongoDB: "$custom",
			},
		});
	}

	/**
	 * Returns the coordinates part of a geo point in MongoDB
	 * @param {any} value Either a geo point object or a geo point field name
	 * @returns Query structure
	 */
	getCoordinates(value: any): any {
		// If this is an object return coordinates array
		if (Array.isArray(value) === false && typeof value === "object")
			return value.coordinates;
		else return value + ".coordinates";
	}

	/**
	 * Returns the database specific query structure of the where condition
	 * @param {string} dbType The database type
	 * @returns Query structure
	 */
	getQuery(dbType: string, callback: (fieldPath: string) => string): any {
		const coordinates1 = this.parameters[0].getQuery(dbType, callback);
		const coordinates2 = this.parameters[1].getQuery(dbType, callback);

		switch (dbType) {
			case DBTYPE.MONGODB:
				// Using the ‘haversine’ formula
				return {
					$let: {
						vars: {
							lon1: { $arrayElemAt: [this.getCoordinates(coordinates1), 0] },
							lat1: { $arrayElemAt: [this.getCoordinates(coordinates1), 1] },
							lon2: { $arrayElemAt: [this.getCoordinates(coordinates2), 0] },
							lat2: { $arrayElemAt: [this.getCoordinates(coordinates2), 1] },
							pi: 3.141592653589793,
							// Earth radius in km is 6378.137, we multiply it with 1000 to convert to meters
							multiplier: 1000,
						},
						in: {
							$multiply: [
								{
									$multiply: [
										2,
										{
											$atan2: [
												{
													$sqrt: {
														$add: [
															{
																$pow: [
																	{
																		$sin: {
																			$divide: [
																				{
																					$divide: [
																						{
																							$multiply: [
																								{
																									$subtract: [
																										"$$lat2",
																										"$$lat1",
																									],
																								},
																								"$$pi",
																							],
																						},
																						180,
																					],
																				},
																				2,
																			],
																		},
																	},
																	2,
																],
															},
															{
																$multiply: [
																	{
																		$multiply: [
																			{
																				$cos: {
																					$divide: [
																						{
																							$multiply: ["$$lat1", "$$pi"],
																						},
																						180,
																					],
																				},
																			},
																			{
																				$cos: {
																					$divide: [
																						{
																							$multiply: ["$$lat2", "$$pi"],
																						},
																						180,
																					],
																				},
																			},
																		],
																	},
																	{
																		$pow: [
																			{
																				$sin: {
																					$divide: [
																						{
																							$divide: [
																								{
																									$multiply: [
																										{
																											$subtract: [
																												"$$lon2",
																												"$$lon1",
																											],
																										},
																										"$$pi",
																									],
																								},
																								180,
																							],
																						},
																						2,
																					],
																				},
																			},
																			2,
																		],
																	},
																],
															},
														],
													},
												},
												{
													$sqrt: {
														$subtract: [
															1,
															{
																$add: [
																	{
																		$pow: [
																			{
																				$sin: {
																					$divide: [
																						{
																							$divide: [
																								{
																									$multiply: [
																										{
																											$subtract: [
																												"$$lat2",
																												"$$lat1",
																											],
																										},
																										"$$pi",
																									],
																								},
																								180,
																							],
																						},
																						2,
																					],
																				},
																			},
																			2,
																		],
																	},
																	{
																		$multiply: [
																			{
																				$multiply: [
																					{
																						$cos: {
																							$divide: [
																								{
																									$multiply: ["$$lat1", "$$pi"],
																								},
																								180,
																							],
																						},
																					},
																					{
																						$cos: {
																							$divide: [
																								{
																									$multiply: ["$$lat2", "$$pi"],
																								},
																								180,
																							],
																						},
																					},
																				],
																			},
																			{
																				$pow: [
																					{
																						$sin: {
																							$divide: [
																								{
																									$divide: [
																										{
																											$multiply: [
																												{
																													$subtract: [
																														"$$lon2",
																														"$$lon1",
																													],
																												},
																												"$$pi",
																											],
																										},
																										180,
																									],
																								},
																								2,
																							],
																						},
																					},
																					2,
																				],
																			},
																		],
																	},
																],
															},
														],
													},
												},
											],
										},
									],
								},
								"$$multiplier",
							],
						},
					},
				};
			case DBTYPE.POSTGRESQL:
				const earthRadius = 6371008.8; // in meters
				return `(${earthRadius} * 2 * ASIN(
					SQRT(
						POW(SIN(RADIANS((${coordinates2}::POINT)[1] - (${coordinates1}::POINT)[1]) / 2), 2) +
						COS(RADIANS((${coordinates1}::POINT)[1])) * COS(RADIANS((${coordinates2}::POINT)[1])) *
						POW(SIN(RADIANS((${coordinates2}::POINT)[0] - (${coordinates1}::POINT)[0]) / 2), 2)
					)
				))`;
			case DBTYPE.MYSQL:
				return `ST_Distance_Sphere(${coordinates1}, ${coordinates2})`;
			default:
				return null;
		}
	}
}
