/**
 * Chooses a value from a list of values.
 *
 * Category: Lookup and reference
 *
 * @param {*} index_num Specifies which value argument is selected. Index_num must be a number between 1 and 254, or a formula or reference to a value containing a number between 1 and 254. If index_num is 1, CHOOSE returns value1; if it is 2, CHOOSE returns value2; and so on. If index_num is less than 1 or greater than the number of the last value in the list, CHOOSE returns the #VALUE! error value. If index_num is a fraction, it is truncated to the lowest integer before being used.
 - If index_num is 1, CHOOSE returns value1; if it is 2, CHOOSE returns value2; and so on.
 - If index_num is less than 1 or greater than the number of the last value in the list, CHOOSE returns the #VALUE! error value.
 - If index_num is a fraction, it is truncated to the lowest integer before being used.
 * @param {*} args value1, value2, ... Value 1 is required, subsequent values are optional. 1 to 254 value arguments from which CHOOSE selects a value or an action to perform based on index_num. The arguments can be numbers, value references, defined names, formulas, functions, or text.
 * @returns
 */
export function CHOOSE(...args: any[]): any;
/**
 * Returns the column number of a reference.
 *
 * Category: Lookup and reference
 *
 * @param {*} reference the value or range of values for which you want to return the column number.
 * @param {*} index
 * @returns
 */
export function COLUMN(reference: any, index: any, ...args: any[]): any;
/**
 * Returns the number of columns in a reference.
 *
 * Category: Lookup and reference
 *
 * @param {*} array An array or array formula, or a reference to a range of values for which you want the number of columns.
 * @returns
 */
export function COLUMNS(array: any, ...args: any[]): any;
/**
 * Looks in the top row of an array and returns the value of the indicated value.
 *
 * Category: Lookup and reference
 *
 * @param {*} lookup_value The value to be found in the first row of the table. Lookup_value can be a value, a reference, or a text string.
 * @param {*} table_array A table of information in which data is looked up. Use a reference to a range or a range name.
 * @param {*} row_index_num The row number in table_array from which the matching value will be returned. A row_index_num of 1 returns the first row value in table_array, a row_index_num of 2 returns the second row value in table_array, and so on. If row_index_num is less than 1, HLOOKUP returns the #VALUE! error value; if row_index_num is greater than the number of rows on table_array, HLOOKUP returns the #REF! error value.
 * @param {*} range_lookup Optional. A logical value that specifies whether you want HLOOKUP to find an exact match or an approximate match. If TRUE or omitted, an approximate match is returned. In other words, if an exact match is not found, the next largest value that is less than lookup_value is returned. If FALSE, HLOOKUP will find an exact match. If one is not found, the error value #N/A is returned.
 * @returns
 */
export function HLOOKUP(lookup_value: any, table_array: any, row_index_num: any, range_lookup: any): Error;
/**
 * Uses an index to choose a value from a reference or array.
 *
 * Category: Lookup and reference
 *
 * @param {*} array A range of values or an array constant.
 - If array contains only one row or column, the corresponding row_num or column_num argument is optional.
 - If array has more than one row and more than one column, and only row_num or column_num is used, INDEX returns an array of the entire row or column in array.
 * @param {*} row_num Required, unless column_num is present. Selects the row in array from which to return a value. If row_num is omitted, column_num is required.
 * @param {*} column_num Optional. Selects the column in array from which to return a value. If column_num is omitted, row_num is required.
 * @returns
 */
export function INDEX(array: any, row_num: any, column_num: any): any;
/**
 * Looks up values in a vector or array.
 *
 * Category: Lookup and reference
 *
 * @param {*} lookup_value A value that LOOKUP searches for in an array. The lookup_value argument can be a number, text, a logical value, or a name or reference that refers to a value.
 - If LOOKUP can't find the value of lookup_value, it uses the largest value in the array that is less than or equal to lookup_value.
 - If the value of lookup_value is smaller than the smallest value in the first row or column (depending on the array dimensions), LOOKUP returns the #N/A error value.
 * @param {*} array A range of values that contains text, numbers, or logical values that you want to compare with lookup_value. The array form of LOOKUP is very similar to the HLOOKUP and VLOOKUP functions. The difference is that HLOOKUP searches for the value of lookup_value in the first row, VLOOKUP searches in the first column, and LOOKUP searches according to the dimensions of array.
* @param {*} result_array Optional. A range that contains only one row or column. The result_array argument must be the same size as lookup_value. It has to be the same size.
 * @returns
 */
export function LOOKUP(lookup_value: any, array: any, result_array: any): any;
/**
 * Looks up values in a reference or array.
 *
 * Category: Lookup and reference
 *
 * @param {*} lookup_value The value that you want to match in lookup_array. For example, when you look up someone's number in a telephone book, you are using the person's name as the lookup value, but the telephone number is the value you want.The lookup_value argument can be a value (number, text, or logical value) or a value reference to a number, text, or logical value.
 * @param {*} lookup_array The range of values being searched.
 * @param {*} match_type Optional. The number -1, 0, or 1. The match_type argument specifies how Excel matches lookup_value with values in lookup_array. The default value for this argument is 1.
 * @returns
 */
export function MATCH(lookup_value: any, lookup_array: any, match_type: any, ...args: any[]): number | Error;
/**
 * Returns the number of rows in a reference.
 *
 * Category: Lookup and reference
 *
 * @param {*} array An array, an array formula, or a reference to a range of values for which you want the number of rows.
 * @returns
 */
export function ROWS(array: any, ...args: any[]): any;
/**
 * Returns the transpose of an array.
 *
 * Category: Lookup and reference
 *
 * @param {*} array An array or range of values on a worksheet that you want to transpose. The transpose of an array is created by using the first row of the array as the first column of the new array, the second row of the array as the second column of the new array, and so on. If you're not sure of how to enter an array formula, see Create an array formula.
 * @returns
 */
export function TRANSPOSE(array: any): any;
/**
 * Returns a list of unique values in a list or range.
 *
 * Category: Lookup and reference
 *
 * @returns
 */
export function UNIQUE(...args: any[]): any[];
/**
 * Looks in the first column of an array and moves across the row to return the value of a value.
 *
 * Category: Lookup and reference
 *
 * @param {*} lookup_value The value to be found in the first row of the table. Lookup_value can be a value, a reference, or a text string.
 * @param {*} table_array A table of information in which data is looked up. Use a reference to a range or a range name.
 * @param {*} col_index_num The row number in table_array from which the matching value will be returned. A row_index_num of 1 returns the first row value in table_array, a row_index_num of 2 returns the second row value in table_array, and so on. If row_index_num is less than 1, HLOOKUP returns the #VALUE! error value; if row_index_num is greater than the number of rows on table_array, HLOOKUP returns the #REF! error value.
 * @param {*} range_lookup Optional. A logical value that specifies whether you want HLOOKUP to find an exact match or an approximate match. If TRUE or omitted, an approximate match is returned. In other words, if an exact match is not found, the next largest value that is less than lookup_value is returned. If FALSE, HLOOKUP will find an exact match. If one is not found, the error value #N/A is returned.
 * @returns
 */
export function VLOOKUP(lookup_value: any, table_array: any, col_index_num: any, range_lookup: any): Error;
/**
 * Returns a sorted array of the elements in an array. The returned array is the same shape as the provided array argument.
 *
 * Category: Lookup and reference
 *
 * @param {*} array The range, or array to sort.
 * @param {*} sort_index Optional. A number indicating the row or column to sort by. Default is 1.
 * @param {*} sort_order Optional. A number indicating the sort order. 1 for ascending, -1 for descending. Default is 1.
 * @param {*} by_col Optional. A logical value indicating the desired sort direction. FALSE to sort by row. TRUE to sort by column. Default is FALSE.
 * @returns
 */
export function SORT(array: any, sort_index: any, sort_order: any, by_col: any): any;
/**
 * Filters an array based on a Boolean (True/False) array.
 *
 * Category: Lookup and reference
 *
 * @param {*} array The array, or range to filter. E.g. [[1,2,3],[4,5,6]]
 * @param {*} include A boolean array whose height or width is the same as the array. E.g. [[true, false, true]] OR [[true],[false]]
 * @param {*} if_empty Optional. The value to return if all values in the included array are empty (filter returns nothing). E.g. "No results"
 * @returns
 */
export function FILTER(array: any, include: any, if_empty: any): any;
/**
 * Looks up values in a reference or array.
 *
 * Category: Lookup and reference
 *
 * @param {*} lookup_value The value that you want to match in lookup_array. For example, when you look up someone's number in a telephone book, you are using the person's name as the lookup value, but the telephone number is the value you want.The lookup_value argument can be a value (number, text, or logical value) or a value reference to a number, text, or logical value.
 * @param {*} lookup_array The range of values being searched.
 * @param {*} match_mode Optional. The number -1, 0, 1 or 2. The match_mode argument specifies how Excel matches lookup_value with values in lookup_array. The default value for this argument is 0.
 * @param {*} search_mode Optional. The number -2, -1, 1 or 2. The search_mode argument specifies how Excel searches for lookup_value in lookup_array. The default value for this argument is 1.
 * @returns
 */
export function XMATCH(lookup_value: any, lookup_array: any, match_mode: any, search_mode: any, ...args: any[]): any;
