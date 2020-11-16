// eslint-disable-next-line @typescript-eslint/ban-types
type NotMethodKeys<T> = { [P in keyof T]: T[P] extends Function ? never : P };

export type Mapping<S, T, K extends keyof NotMethodKeys<T>> = T[K] | ((obj: S, key: K) => T[K]);
export type Trans4mMapping<S, T> = { [key in keyof NotMethodKeys<T>]: Mapping<S, T, key> };

export type Trans4m<S, T> = (input: S, output: Partial<T>) => T;
export function createTrans4m<S, T>(mappings: Trans4mMapping<S, T>): Trans4m<S, T> {
  return (input: S, output: Partial<T>): T => {
    for (const key of Object.keys(mappings) as Array<keyof NotMethodKeys<T>>) {
      const valueTransform = mappings[key];
      let value;
      if (typeof valueTransform === 'function') {
        value = valueTransform(input, key);
      } else {
        value = valueTransform;
      }
      output[key] = value;
    }
    return output as T;
  };
}

export * from './mapper';
