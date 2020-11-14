# trans4m

A typed library for transforming properties from one object onto another.  Built to help with the transform step of Extract-Transform-Load.

## Install

`npm -i trans4m`

## Usage

At it's core the library is very simple:

1. Define Mappings
2. create `trans4m` function
3. transform objects

### Example 

[CodeSandbox.io Link](https://codesandbox.io/s/trans4m-demo-0odhx)

```ts
import { createTrans4m, Trans4mMapping, copy } from "trans4m";

type Candidate = {
  firstName: string;
  lastName: string;
  email: string;
  scores: number[];
};

type Employee = {
  name: string;
  email: string;
  totalScore: number;
};

//1 define mappings

const mapping: Trans4mMapping<Candidate, Employee> = {
  email: copy,
  name: (obj) => obj.firstName + " " + obj.lastName,
  totalScore: (obj) => obj.scores.reduce((sum, s) => sum + s, 0)
};

//2 create trans4m function

const canidateToEmployee = createTrans4m(mapping);

//3 transform objects
const c: Candidate = {
  firstName: "john",
  lastName: "doe",
  email: "john@example.com",
  scores: [1, 3, 5]
};

const employee = canidateToEmployee(c, {});
```

### Mapping Functions

== documentation coming soon ==
