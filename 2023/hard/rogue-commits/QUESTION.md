# Rogue Commits

Imagine you're on an epic quest to uncover hidden treasures in a mysterious forest. Along the way, you encounter a rogue character named **github-actions[bot]*** who's been leaving confusing markers. To solve the puzzle and claim the treasures, you need to change all instances of **github-actions[bot]** to just **github-actions** in your digital map. Can you decipher the mystery and secure the loot?

## Constraints

- The script must be **purely written within the execute.sh file**.

- You can install any tool you need to complete the task

- Do not write anything to the **out** folder. All modifications should be within the cloned repository within **src**

## Output / Evaluation Criteria

- All committer and author names of commits where the author is **github-actions[bot]** must be updated to **github-actions**

- **No commits should be lost**. This includes the initial commit, merge commits, etc.

- **The current branch should not change**.