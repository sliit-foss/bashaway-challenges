# Numerological Incantation

In the mystical land of Numeria, Master Emeric, a humble scribe and mathematician, discovered the ancient Scroll of Prime Mysteries. Legend has it that this scroll contains the key to unlocking the secrets of numbers in the realm. Tasked with a noble quest by the kingdom's wise wizard, Emeric must create a bash script, akin to a magical incantation, to **represent any number's prime factors in the sacred format of f1 x f2 x f3 x fn** and unlock the ancient numerological secrets of Numeria.

## Example Invokation

```bash
bash execute.sh 12
```

## Constraints

- The script must be **purely written in bash within the execute.sh file**.

## Output / Evaluation Criteria

- A single line to the console that represents the prime factors of the number passed in as the first argument to the script. The output should be in the format of f1 x f2 x f3 x fn, where each f is a prime factor of the number passed in. If the number is prime, the output should be the number itself.

- The script should not crash if no number is passed in as an argument. Instead, it should print a message to the console that says "Please pass in a number as an argument to the script."