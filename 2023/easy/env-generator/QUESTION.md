# Env generator

In the realm of Kubernetes secrets, harness the power of **bash** to create ".env" files from their secret counterparts. The script should be able to generate multiple .env files from a single yaml file.

Example secret name to file mapping

- secret-name --> todo-service-secret
- file-name --> .env.todo

There will be multiple secrets in the yaml file

## Constraints

- The script must be **purely written in bash within the execute.sh file**.

## Output / Evaluation Criteria

- The generated files should be inside a directory called **out** with the instructed file format
