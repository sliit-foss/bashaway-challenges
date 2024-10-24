In a quaint coding workshop, a diligent gopher is tasked with ensuring the integrity of a Golang codebase. Craft a GitHub Actions workflow with a single job named unit-tests, which will execute the test suites within the codebase across 2 versions of Golang. The tests require a MongoDB database, which you must set up and provide. The way to do so, falls upon you. Assist the gopher in this digital trial, thereby helping to prove that even the smallest of gophers can uphold the highest standards of code.

## Constraints

- The script must be **purely written in bash within the execute.sh file**.

## Output / Evaluation Criteria

- There should be an executable GitHub Actions workflow file where the job named unit-tests runs the test suites within the codebase. 

- The MongoDB database should be set up and provided for the tests to run successfully. The database name should be `elemental`.

- The test output should be informative.

- The workflow should be executed for the following versions of Golang:
  - 1.21.0
  - 1.22.0

- The workflow you write is executed using [Act](https://nektosact.com). Make sure that the workflow is compatible with it.
