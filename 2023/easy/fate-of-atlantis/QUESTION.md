# Fate of Atlantis

In the midst of an ancient underwater war between the cities of Atlantis and Lemuria, there was a single, treasured log file within a chest named src. This log contained the secrets of numerous battles, with each entry marked by a unique correlation id, symbolizing the enemy's incursions.

In this epic struggle, the fate of Atlantis depended on uncovering a specific set of log entries that matched a given correlation code. The question was simple: Could they locate these vital entries within the log and decipher the enemy's plans, thereby tipping the scales in their favor in this ancient and ongoing battle for dominance?


Example invokation:-

```bash
bash execute.sh 243d8ebfd86602a2873cc671cc783540
```

## Constraints

- The script must be **purely written in bash within the execute.sh file**.

## Output / Evaluation Criteria

- The set of log entries that match the given correlation id should be printed to the console in the order they appear in the log file.

- The script should not crash if no correlation id is provided.
