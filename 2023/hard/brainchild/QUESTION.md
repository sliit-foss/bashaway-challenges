# Brainchild

Imagine you're the hero of efficiency, tasked with a mission to clone all publicly visible repositories of a GitHub organization in one swift move. Your brainchild is a custom command invokable as **git clone-gh-org <organization-name> <destination>**. This is fully yours to design and implement. No more manual cloning, just pure automation. Can you write a script to streamline your GitHub adventures?

## Constraints

- The script must be **purely written in bash within the execute.sh file**.

- Do not write anything to the **out** folder.

## Output / Evaluation Criteria

- Successfull invokation of the command should be able to clone all public repositories of an organization to a given destination.

  - Example: Invoking **git clone-gh-org sliit-foss ./out** should clone all public repositories of the organization **sliit-foss** to the **out** folder. At the time of writing this, the organization has 82 public repositories.
  
- Only public repositories should be cloned
