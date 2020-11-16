# trans4m

A typed library for transforming properties from one object onto another.  Built to help with the transform step of Extract-Transform-Load.

The primarily goal of this library is to maximize readability and reduce state via a declarative API.

## Install

`npm -i trans4m`

## Usage

At it's core the library is very simple:

1. Define Mappings
2. create a `trans4m` function
3. transform objects

### Example 

[CodeSandbox.io Link](https://codesandbox.io/s/trans4m-demo-0odhx)

```ts
import {
  createTrans4m,
  Trans4mMapping,
  copy,
  translate,
  select,
  reduce
} from "trans4m";

/*
This example show mapping a Candidate to an Employee
*/

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
  id: "e-1",
  candidateId: translate("id"),
  name: (obj) => obj.firstName + " " + obj.lastName,
  email: copy,
  scoreTotal,
  scoreCount,
  averageScore: (obj) => scoreTotal(obj) / scoreCount(obj)
};

//== 2 create trans4m function

const candidateToEmployee = createTrans4m(mapping);

//== 3 transform objects
const c: Candidate = {
  id: "c-1",
  firstName: "john",
  lastName: "doe",
  email: "john@example.com",
  scores: [6, 7, 5]
};

const employee = candidateToEmployee(c, {});
```



