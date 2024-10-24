In the hallowed lands of ancient Hellas, where the whispering winds carry tales of old, a task is bestowed upon thee. With a port number as thy argument, craft a script that shall seek out and vanquish the daemon occupying it, if such a spirit exists. Banish this entity from the realm, restoring peace to the harbor of the given port.

## Example

```bash
$ ./execute.sh 8080
```

## Constraints

- The script must be **purely written in bash within the execute.sh file**

- The script must be **less than 30 characters** in length. (Including spaces, newlines, and the shebang line)

## Output / Evaluation Criteria

- A script that, when executed with a port number as an argument, will terminate the process occupying that port, if it exists