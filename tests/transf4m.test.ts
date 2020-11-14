import { value, copy, translate, createTrans4m, Trans4mMapping, reduce, map } from '../src';

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
  fooBar?: number;
  arr?: boolean[];
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

test('foo[] -> bar', () => {
  const mapping: Trans4mMapping<Foo[], Bar> = {
    foo: (objs) => objs.map((o) => o.bar).join(' '),
    bar: true,
    fooBar: reduce((sum, obj) => sum + obj.fooBar, 0),
    arr: map((o) => o.foo),
  };

  const foosBarMapper = createTrans4m(mapping);
  const foos = [
    { foo: true, bar: 'hello', fooBar: 3 },
    { foo: false, bar: 'john', fooBar: 2 },
  ];
  const bar = foosBarMapper(foos, {});
  expect(bar.foo).toBe('hello john');
  expect(bar.bar).toBe(true);
  expect(bar.fooBar).toBe(5);
  expect(bar.arr.length).toBe(2);
});
