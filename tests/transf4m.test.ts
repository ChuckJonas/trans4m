import { copy, translate, createTrans4m, Trans4mMapping, reduce, map, select, applyTrans4m } from '../src';

test('readme', () => {
  type Candidate = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    scores: number[];
  };

  type Employee = {
    id: string;
    candidateId: string;
    name: string;
    email: string;
    scoreCount: number;
    scoreTotal: number;
    averageScore: number;
  };

  //== 1 define mappings

  const withScores = select((c: Candidate) => c.scores);
  const scoreCount = withScores((scores) => scores.length);
  const scoreTotal = withScores(reduce((sum, s) => sum + s, 0));

  const mapping: Trans4mMapping<Candidate, Employee> = {
    id: 'e-1',
    candidateId: translate('id'),
    name: (obj) => obj.firstName + ' ' + obj.lastName,
    email: copy,
    scoreTotal,
    scoreCount,
    averageScore: (obj) => scoreTotal(obj) / scoreCount(obj),
  };

  //== 2 create trans4m function

  const candidateToEmployee = createTrans4m(mapping);

  //== 3 transform objects
  const c: Candidate = {
    id: 'c-1',
    firstName: 'john',
    lastName: 'doe',
    email: 'john@example.com',
    scores: [1, 3, 5],
  };

  const employee = candidateToEmployee(c, {});
});

type Contact = {
  fullName: string;
  street: string;
  city: string;
  state: string;
  account?: {
    id: string;
  };
};

type BillingContact = {
  name: string;
  address: string;
};

type Invoice = {
  id: string;
  total: number;
  tax: number;
  lineItems: LineItem[];
  contact: BillingContact;
};

type LineItem = {
  id: string;
  name: string;
  price: number;
};

type AggregateInput = {
  lineItems: LineItem[];
  contact: Contact;
};

test('aggregate e-2-e', () => {
  const selectLineItems = select((obj: AggregateInput) => obj.lineItems);
  const selectContact = select((obj: AggregateInput) => obj.contact);

  const contactMapping: Trans4mMapping<Contact, BillingContact> = {
    name: translate('fullName'),
    address: (obj) => `${obj.street} ${obj.city}`,
  };

  const contactToBillingContact = createTrans4m(contactMapping);

  const totalOrder = selectLineItems(reduce((sum, i) => sum + i.price, 0));

  const getTax = (value: number) => value * 0.07;

  const mapping: Trans4mMapping<AggregateInput, Invoice> = {
    id: 'e-1',
    lineItems: selectLineItems(),
    total: totalOrder,
    tax: select(totalOrder)(getTax),
    contact: selectContact(applyTrans4m(contactToBillingContact, {})),
  };

  const candidateToEmployee = createTrans4m(mapping);

  const c: AggregateInput = {
    lineItems: [],
    contact: {
      fullName: 'john',
      street: '123 king st',
      city: 'lander',
      state: 'wy',
    },
  };

  const employee = candidateToEmployee(c, {});
  expect(employee.contact.name).toBe('john');
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
