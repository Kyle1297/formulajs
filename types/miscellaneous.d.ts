export function ARGS2ARRAY(...args: any[]): any;
/**
 * Formula.js only
 *
 * @param {*} context
 * @param {*} reference
 * @returns
 */
export function REFERENCE(context: any, reference: any, ...args: any[]): any;
/**
 * Formula.js only
 *
 * @param {*} array
 * @param {*} separator
 * @returns
 */
export function JOIN(array: any, separator: any): any;
/**
 * Formula.js only
 *
 * @returns
 */
export function NUMBERS(...args: any[]): any;
/**
 * SINGLE (@ symbol)
 *
 * Implicit intersection - Reduces many values to a single value, e.g. [[1, 2], [3, 4]] -> 1. Supports Excel versions without dynamic array functionality.
 *
 * @param {*} value The value to be reduced to a single value. Can be a number, string, boolean, array, etc.
 * @returns
 */
export function SINGLE(value: any): any;
export const FLATTEN: typeof utils.flatten;
import * as utils from "./utils/common.js";
