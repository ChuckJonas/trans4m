import { Trans4m } from '.';

/*
  == 1-to-1 ==
*/

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

/*
  == Collections ==
*/

/**
 * Curry version of `array.map`
 * @param fn Mapping function
 */
export const map = <S, R>(fn: (obj: S, i?: number, arr?: S[]) => R) => (objects: S[]) => objects.map(fn);

/**
 * Curry version of `array.map`
 * @param fn Reduce Function
 *
 * ```typescript
  const mapping: Trans4mMapping<LineItem[], Order> = {
    id: '123',
    total: reduce((sum, li) => sum + li.cost, 0),
  };
  ```
 */
export const reduce = <S, R>(fn: (result: R, obj: S, i?: number, arr?: S[]) => R, init: R) => (objects: S[]) => objects.reduce(fn, init);

/*
  == Misc ==
*/

/**
 *
 * @param sFn Select Function.  Returns a function where the input is the returned value.
 * @return A new function, that accepts an optional "next" function.  If not set, returns the selected value from sFn
 * example:
 * ```typescript
 * const order: Order = {
 *  id: '123',
 *  lineItems: [
 *   name: 'one',
 *   total: 3.50
 * ]
 *}
 *
 *const selectLineItems = select((o: Order) => o.lineItems);
 *const lineItems = select((o: Order) => o.lineItems)()(order);
 *const sumTotal = selectLineItems(reduce(li => li.total))(order);
 *```
 */
export function select<T, S>(sFn: (obj: T) => S) {
  function next<G>(nFn: (o: S) => G): (obj: T) => G;
  function next(): (obj: T) => S;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function next(...args: any) {
    const [fn] = args;
    return (obj: T) => (fn ? fn(sFn(obj)) : sFn(obj));
  }

  return next;
}

export function applyTrans4m<S, T>(fn: Trans4m<S, T>, init: Partial<T>) {
  return (obj: S) => {
    return fn(obj, init);
  };
}

/**
 * Just returns the passed in value
 * @param value
 */
export const value = <V>(value: V) => () => value;
