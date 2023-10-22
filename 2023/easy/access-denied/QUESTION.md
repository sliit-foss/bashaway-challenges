# Access Denied

In the distant age of 2150, within the heart of a cyberpunk cityscape, a clandestine group of hackers has devised a command-line interface known as **execute.sh.** This interface, powered by a quantum matrix, allows users to run scripts only if a given set of keys exist in the encrypted ether of their environment. By invoking this script with the enigmatic **--keys** flag and specifying the desired **--script**, users navigate the digital labyrinth of permissions.

But beware, for in this shadowy world, failure to possess the required env keys triggers a relentless AI sentinel to proclaim, **Access Denied!** The hackers of tomorrow must tread lightly, for even the most ingenious code can unravel in the face of missing variables.

Example invokation:-

```bash
bash execute.sh --keys=ENV_KEY1,ENV_KEY2 --script=./script.sh # script.sh runs only if ENV_KEY1 and ENV_KEY2 exist
```

## Constraints

- The script must be **purely written in bash within the execute.sh file**.

## Output / Evaluation Criteria

- A script which can be invoked with the **--keys** and **--script** flags and satisfies the constraints above.

- The script must be able to handle any number of keys.

- The script must output **Access Denied** if any of the keys are missing.

- The script must output a suitable warning if the **--script** flag or **--keys** flag are missing and exit gracefully.
