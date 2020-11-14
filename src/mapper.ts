/**
 * Copies the same field as the specified target
 * @param obj: Source Object
 * @param field: Shared Source & Target Field
 */
export const copy = <S, T>(obj: S, field: keyof T & keyof S) => obj[field];

/**
 * Copies specified field
 * @param field Field of S to use
 */
export const translate = <S, K extends keyof S>(field: K) => (obj: S): S[K] => obj[field];

/**
 *  Converts (obj: S, field: keyof T & keyof S) to `fn(field)(object)`
 * @param fn1 curry function `fn(field)(object)`
 */
export function copyCurry<S, R>(fn1: (field: keyof S) => (obj: S) => R) {
  return (obj: S, field: keyof S) => {
    return fn1(field)(obj);
  };
}

/**
 * Just returns the passed in value
 * @param value
 */
export const value = <V>(value: V) => () => value;
