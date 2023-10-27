import abs from "./functions/abs";
import add from "./functions/add";
import and from "./functions/and";
import ceil from "./functions/ceil";
import charIndex from "./functions/charIndex";
import concat from "./functions/concat";
import divide from "./functions/divide";
import endsWith from "./functions/endsWith";
import eq from "./functions/eq";
import exists from "./functions/exists";
import floor from "./functions/floor";
import gt from "./functions/gt";
import gte from "./functions/gte";
import inFunc from "./functions/in";
import includes from "./functions/includes";
import left from "./functions/left";
import length from "./functions/length";
import lower from "./functions/lower";
import lt from "./functions/lt";
import lte from "./functions/lte";
import ltrim from "./functions/ltrim";
import mod from "./functions/mod";
import multiply from "./functions/multiply";
import neq from "./functions/neq";
import nin from "./functions/nin";
import not from "./functions/not";
import or from "./functions/or";
import right from "./functions/right";
import round from "./functions/round";
import rtrim from "./functions/rtrim";
import sqrt from "./functions/sqrt";
import startsWith from "./functions/startsWith";
import substring from "./functions/substring";
import subtract from "./functions/subtract";
import trim from "./functions/trim";
import upper from "./functions/upper";
import size from "./functions/size";
import exp from "./functions/exp";
import ln from "./functions/ln";
import log from "./functions/log";
import log10 from "./functions/log10";
import pow from "./functions/pow";
import sin from "./functions/sin";
import cos from "./functions/cos";
import tan from "./functions/tan";
import sinh from "./functions/sinh";
import cosh from "./functions/cosh";
import tanh from "./functions/tanh";
import asin from "./functions/asin";
import acos from "./functions/acos";
import atan from "./functions/atan";
import atan2 from "./functions/atan2";
import asinh from "./functions/asinh";
import acosh from "./functions/acosh";
import atanh from "./functions/atanh";
import radians from "./functions/radians";
import degrees from "./functions/degrees";
import dateAdd from "./functions/dateAdd";
import dateDiff from "./functions/dateDiff";
import hour from "./functions/hour";
import minute from "./functions/minute";
import second from "./functions/second";
import year from "./functions/year";
import month from "./functions/month";
import dayOfMonth from "./functions/dayOfMonth";
import dayOfWeek from "./functions/dayOfWeek";
import dayOfYear from "./functions/dayOfYear";
import strToDate from "./functions/strToDate";
import now from "./functions/now";
import toDecimal from "./functions/toDecimal";
import toBoolean from "./functions/toBoolean";
import toInteger from "./functions/toInteger";
import toDate from "./functions/toDate";
import toString from "./functions/toString";
import toObjectId from "./functions/toObjectId";
import distance from "./functions/distance";
import point from "./functions/point";

// Register all functions in lowercase letters
export const FunctionManager: Record<string, any> = {
	$abs: abs,
	$add: add,
	$and: and,
	$ceil: ceil,
	$charindex: charIndex,
	$concat: concat,
	$divide: divide,
	$endswith: endsWith,
	$eq: eq,
	$exists: exists,
	$floor: floor,
	$gt: gt,
	$gte: gte,
	$in: inFunc,
	$includes: includes,
	$left: left,
	$length: length,
	$lower: lower,
	$lt: lt,
	$lte: lte,
	$ltrim: ltrim,
	$mod: mod,
	$multiply: multiply,
	$neq: neq,
	$nin: nin,
	$not: not,
	$or: or,
	$right: right,
	$round: round,
	$rtrim: rtrim,
	$sqrt: sqrt,
	$startswith: startsWith,
	$substring: substring,
	$subtract: subtract,
	$trim: trim,
	$upper: upper,
	$size: size,
	$exp: exp,
	$ln: ln,
	$log: log,
	$log10: log10,
	$pow: pow,
	$sin: sin,
	$cos: cos,
	$tan: tan,
	$sinh: sinh,
	$cosh: cosh,
	$tanh: tanh,
	$asin: asin,
	$acos: acos,
	$atan: atan,
	$atan2: atan2,
	$asinh: asinh,
	$acosh: acosh,
	$atanh: atanh,
	$radians: radians,
	$degrees: degrees,
	$dateadd: dateAdd,
	$datediff: dateDiff,
	$hour: hour,
	$minute: minute,
	$second: second,
	$year: year,
	$month: month,
	$dayofmonth: dayOfMonth,
	$dayofweek: dayOfWeek,
	$dayofyear: dayOfYear,
	$strtodate: strToDate,
	$now: now,
	$todecimal: toDecimal,
	$toboolean: toBoolean,
	$tointeger: toInteger,
	$todate: toDate,
	$tostring: toString,
	$toobjectid: toObjectId,
	$distance: distance,
	$point: point,
};
