import { value, copy, translate, createTrans4m, Trans4mMapping } from '../src';

test('1=1', () => {
  expect(value(1)()).toBe(1);
});

type Foo = {
  foo: boolean;
  bar: string;
  fooBar: number;
};

type Bar = {
  foo: string;
  bar: boolean;
  fooBar: number;
};

test('foo -> bar', () => {
  const mapping: Trans4mMapping<Foo, Bar> = {
    foo: translate('bar'),
    bar: true,
    fooBar: copy,
  };

  const fooBarMapper = createTrans4m(mapping);
  const foo = { foo: true, bar: 'hello', fooBar: 3 };
  const bar = fooBarMapper(foo, {});
  expect(bar.foo).toBe(foo.bar);
  expect(bar.bar).toBe(true);
  expect(bar.fooBar).toBe(foo.fooBar);
});
