# Punic Wars

In the midst of an epic battle between ancient Rome and Carthage, a commander faced a critical decision. Several battalions of enemy troops approached and the catapults had to be aimed to fire at them. The commander had to decide which battalion to fire at, and how many catapults to use. The commander had a list of the enemy battalions, and the number of catapults required to destroy each one. The commander also knew how many catapults were available. The commander decided to destroy the battalion with the highest number of catapults required to destroy it, and to use all the catapults available to destroy it. If there were multiple battalions with the same number of catapults required, the commander would choose the battalion with the lowest index in the list. The commander would then repeat this process until there were no more catapults available. If there were still enemy battalions remaining, the commander would retreat and the battle would be lost. Catapults could not be reused to destroy multiple battalions.

# Example

## Invokation
```bash
bash execute.sh -c 3 -b '1 2 3 4 5 6 7 8 9 10'
```

- `-c` represents the number of catapults available.
- `-b` represents the number of catapults required to destroy each battalion. Each item in the list represents a new battalion.

## Output
```bash
1
```

## Explanation

- The first battalion requires 1 catapult to destroy it.
- The second battalion requires 2 catapults to destroy it.
- The third battalion requires 3 catapults to destroy it.

The commander has 3 catapults available. The commander will destroy the third battalion with 3 catapults. The commander has no more catapults available. The commander will retreat and the battle will be lost.

## Constraints

- The script must be **purely written in bash within the execute.sh file**.

## Output / Evaluation Criteria

- A single integer to the console representing the number of enemy battalions destroyed.

- The script must output a suitable warning if the catapults or battalions are missing and exit gracefully.