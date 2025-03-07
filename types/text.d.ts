/**
 * -- Not implemented --
 *
 * Changes full-width (double-byte) English letters or katakana within a character string to half-width (single-byte) characters.
 *
 * Category: Text
 *
 * @param {*} text The text or a reference to a value that contains the text you want to change. If text does not contain any full-width letters, text is not changed.
 * @returns
 */
export function ASC(): void;
/**
 * -- Not implemented --
 *
 * Converts a number to text, using the ß (baht) currency format.
 *
 * Category: Text
 *
 * @param {*} number A number you want to convert to text, or a reference to a value containing a number, or a formula that evaluates to a number.
 * @returns
 */
export function BAHTTEXT(): void;
/**
 * Returns the character specified by the code number.
 *
 * Category: Text
 *
 * @param {*} number A number between 1 and 255 specifying which character you want. The character is from the character set used by your computer. Note: Excel for the web supports only CHAR(9), CHAR(10), CHAR(13), and CHAR(32) and above.
 * @returns
 */
export function CHAR(number: any): string | Error;
/**
 * Removes all nonprintable characters from text.
 *
 * Category: Text
 *
 * @param {*} text Any worksheet information from which you want to remove nonprintable characters.
 * @returns
 */
export function CLEAN(text: any): any;
/**
 * Returns a numeric code for the first character in a text string.
 *
 * Category: Text
 *
 * @param {*} text The text for which you want the code of the first character.
 * @returns
 */
export function CODE(text: any): any;
/**
 * Joins several text items into one text item.
 *
 * Category: Text
 *
 * @returns
 */
export function CONCATENATE(...args: any[]): any;
/**
 * -- Not implemented --
 *
 * Changes half-width (single-byte) English letters or katakana within a character string to full-width (double-byte) characters.
 *
 * Category: Text
 *
 * @param {*} text The text or a reference to a value that contains the text you want to change. If text does not contain any half-width English letters or katakana, text is not changed.
 * @returns
 */
export function DBCS(): void;
/**
 * Converts a number to text, using the $ (dollar) currency format.
 *
 * Category: Text
 *
 * @param {*} number A number, a reference to a value containing a number, or a formula that evaluates to a number.
 * @param {*} decimals Optional. The number of digits to the right of the decimal point. If this is negative, the number is rounded to the left of the decimal point. If you omit decimals, it is assumed to be 2.
 * @returns
 */
export function DOLLAR(number: any, decimals?: any): any;
/**
 * Checks to see if two text values are identical.
 *
 * Category: Text
 *
 * @param {*} text1 The first text string.
 * @param {*} text2 The second text string.
 * @returns
 */
export function EXACT(text1: any, text2: any, ...args: any[]): any;
/**
 * Locate one text string within a second text string, and return the number of the starting position of the first text string from the first character of the second text string.
 *
 * Category: Text
 *
 * @param {*} find_text The text you want to find.
 * @param {*} within_text The text containing the text you want to find.
 * @param {*} start_num Optional. Specifies the character at which to start the search. The first character in within_text is character number 1. If you omit start_num, it is assumed to be 1.
 * @returns
 */
export function FIND(find_text: any, within_text: any, start_num: any, ...args: any[]): any;
/**
 * Formats a number as text with a fixed number of decimals.
 *
 * Category: Text
 *
 * @param {*} number The number you want to round and convert to text.
 * @param {*} decimals Optional. The number of digits to the right of the decimal point.
 * @param {*} no_commas Optional. A logical value that, if TRUE, prevents FIXED from including commas in the returned text.
 * @returns
 */
export function FIXED(number: any, decimals?: any, no_commas?: any): any;
/**
 * Formula.js only
 *
 * @param {*} value
 * @returns
 */
export function HTML2TEXT(value: any): any;
/**
 * Returns the leftmost characters from a text value.
 *
 * Category: Text
 *
 * @param {*} text The text string that contains the characters you want to extract.
 * @param {*} num_chars Optional. Specifies the number of characters you want LEFT to extract.
 * @returns
 */
export function LEFT(text: any, num_chars: any): any;
/**
 * Returns the number of characters in a text string
 *
 * Category: Text
 *
 * @param {*} text The text whose length you want to find. Spaces count as characters.
 * @returns
 */
export function LEN(text: any, ...args: any[]): any;
/**
 * Converts text to lowercase.
 *
 * Category: Text
 *
 * @param {*} text The text you want to convert to lowercase. LOWER does not change characters in text that are not letters.
 * @returns
 */
export function LOWER(text: any, ...args: any[]): any;
/**
 * Returns a specific number of characters from a text string starting at the position you specify
 *
 * Category: Text
 *
 * @param {*} text The text string containing the characters you want to extract.
 * @param {*} start_num The position of the first character you want to extract in text. The first character in text has start_num 1, and so on.
 * @param {*} num_chars Specifies the number of characters you want MID to return from text.
 * @returns
 */
export function MID(text: any, start_num: any, num_chars: any): any;
/**
 * Converts text to number in a locale-independent manner.
 *
 * Category: Text
 *
 * @param {*} text The text to convert to a number.
 * @param {*} decimal_separator Optional. The character used to separate the integer and fractional part of the result.
 * @param {*} group_separator Optional. The character used to separate groupings of numbers, such as thousands from hundreds and millions from thousands.
 * @returns
 */
export function NUMBERVALUE(text: any, decimal_separator: any, group_separator: any): number | Error;
/**
 * -- Not implemented --
 */
export function PRONETIC(): void;
/**
 * Capitalizes the first letter in each word of a text value.
 *
 * Category: Text
 *
 * @param {*} text Text enclosed in quotation marks, a formula that returns text, or a reference to a value containing the text you want to partially capitalize.
 * @returns
 */
export function PROPER(text: any): any;
/**
 * Formula.js only
 *
 * @param {*} text
 * @param {*} regular_expression
 * @returns
 */
export function REGEXEXTRACT(text: any, regular_expression: any, ...args: any[]): any;
/**
 * Formula.js only
 *
 * @param {*} text
 * @param {*} regular_expression
 * @param {*} full
 * @returns
 */
export function REGEXMATCH(text: any, regular_expression: any, full: any, ...args: any[]): any;
/**
 * Formula.js only
 *
 * @param {*} text
 * @param {*} regular_expression
 * @param {*} replacement
 * @returns
 */
export function REGEXREPLACE(text: any, regular_expression: any, replacement: any, ...args: any[]): any;
/**
 * Replaces characters within text
 *
 * Category: Text
 *
 * @param {*} old_text Text in which you want to replace some characters.
 * @param {*} num_chars The number of characters in old_text that you want REPLACE to replace with new_text.
 * @param {*} length he number of characters in old_text that you want REPLACEB to replace with new_text.
 * @param {*} new_text he text that will replace characters in old_text.
 * @returns
 */
export function REPLACE(old_text: any, num_chars: any, length: any, new_text: any): string | Error;
/**
 * Repeats text a given number of times.
 *
 * Category: Text
 *
 * @param {*} text The text you want to repeat.
 * @param {*} number_times A positive number specifying the number of times to repeat text.
 * @returns
 */
export function REPT(text: any, number_times: any): any;
/**
 * Returns the rightmost characters from a text value
 *
 * Category: Text
 *
 * @param {*} text The text string containing the characters you want to extract.
 * @param {*} num_chars Optional. Specifies the number of characters you want RIGHT to extract.
 * @returns
 */
export function RIGHT(text: any, num_chars: any): any;
/**
 * Finds one text value within another (not case-sensitive)
 *
 * Category: Text
 *
 * @param {*} find_text The text that you want to find.
 * @param {*} within_text The text in which you want to search for the value of the find_text argument.
 * @param {*} start_num Optional. The character number in the within_text argument at which you want to start searching.
 * @returns
 */
export function SEARCH(find_text: any, within_text: any, start_num: any): number | Error;
/**
 * Formula.js only
 *
 * @param {*} text
 * @param {*} separator
 * @returns
 */
export function SPLIT(text: any, separator: any): any;
/**
 * Substitutes new text for old text in a text string.
 *
 * Category: Text
 *
 * @param {*} text The text or the reference to a value containing text for which you want to substitute characters.
 * @param {*} old_text The text you want to replace.
 * @param {*} new_text The text you want to replace old_text with.
 * @param {*} instance_num Optional. Specifies which occurrence of old_text you want to replace with new_text. If you specify instance_num, only that instance of old_text is replaced. Otherwise, every occurrence of old_text in text is changed to new_text.
 * @returns
 */
export function SUBSTITUTE(text: any, old_text: any, new_text: any, instance_num: any, ...args: any[]): any;
/**
 * Converts its arguments to text.
 *
 * Category: Text
 *
 * @param {*} value The value you want to test.
 * @returns
 */
export function T(value: any): string | Error;
/**
 * -- Partially implemented --
 *
 * The following are not supported:
 * - Scientific notation
 * - Leading and trailing zeros
 * - Some special formats like "[<=9999999]###-####;(###) ###-####", "###° 00' 00''"
 * - Fractions
 * - Dates and times
 * - Some accounting formats
 * - Thousands separator
 *
 * Formats a number and converts it to text.
 *
 * Category: Text
 * @params {*} value A numeric value that you want to be converted into text.
 * @params {*} format_text A text string that defines the formatting that you want to be applied to the supplied value.
 * @returns
 */
export function TEXT(value: any, format_text: any): any;
/**
 * Combines the text from multiple ranges and/or strings.
 *
 * Category: Text
 * @param {*} delimiter A text string, either empty, or one or more characters enclosed by double quotes, or a reference to a valid text string. If a number is supplied, it will be treated as text.
 * @param {*} ignore_empty If TRUE, ignores empty values.
 * @param {*} args Text item to be joined. A text string, or array of strings, such as a range of values.
 * @returns
 */
export function TEXTJOIN(delimiter: any, ignore_empty: any, ...args: any): any;
/**
 * Removes spaces from text.
 *
 * Category: Text
 *
 * @param {*} text The text from which you want spaces removed.
 * @returns
 */
export function TRIM(text: any): any;
/**
 * Converts text to uppercase.
 *
 * Category: Text
 *
 * @param {*} text The text you want converted to uppercase. Text can be a reference or text string.
 * @returns
 */
export function UPPER(text: any): any;
/**
 * Converts a text argument to a number.
 *
 * Category: Text
 *
 * @param {*} text The text enclosed in quotation marks or a reference to a value containing the text you want to convert.
 * @returns
 */
export function VALUE(text: any): any;
/**
 * Joins several text items into one text item.
 *
 * Category: Text
 *
 * @returns
 */
export function CONCAT(...args: any[]): any;
/**
 * Returns the character specified by the code number.
 *
 * Category: Text
 *
 * @param {*} number A number between 1 and 255 specifying which character you want. The character is from the character set used by your computer. Note: Excel for the web supports only CHAR(9), CHAR(10), CHAR(13), and CHAR(32) and above.
 * @returns
 */
export function UNICHAR(number: any): string | Error;
/**
 * Returns a numeric code for the first character in a text string.
 *
 * Category: Text
 *
 * @param {*} text The text for which you want the code of the first character.
 * @returns
 */
export function UNICODE(text: any): any;
