/**
 * Display a deprecation warning with the provided message if the
 * provided `test` evaluates to a falsy value (or is missing).
 *
 * @export
 * @param {string} message Description of the deprecation
 * @param {(boolean | (() => boolean))} test An optional boolean or function that evaluates to a boolean.
 * @returns
 */
export declare function deprecate(message: string, test?: boolean | (() => boolean)): void;
