A diligent historian is tasked with uncovering the past of a mysterious machine. His mission is to write a script that, when given a number, reveals the number of commands previously executed on an enigmatic device. However, there's a twist: the historical commands and the script reside in separate worlds **(processes)**, necessitating synchronization through an elusive history file. Wear the shoes of this historian and craft this script that bridges these worlds

## Example Invokation

```bash
bash execute.sh N
```

- N is the number of historical commands to be displayed

## Constraints

- The script must be **purely written in bash within the execute.sh file**.

## Output / Evaluation Criteria

- The script should output a list of the last N commands executed on the machine, where N is the number provided as an argument.