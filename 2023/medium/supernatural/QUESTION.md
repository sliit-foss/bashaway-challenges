# Supernatural

In the mysterious town of Twilight Hollow, a lone vampire named Seraphina faced an unyielding tide of supernatural adversaries. She longed for a companion, and through ancient texts, she discovered the secrets to an ancient ritual to create a clone of herself named Isabella. This clone would not only share her physical appearance but also her thoughts and experiences, feeling everything that happened to her.

Your mission is to aid Seraphina in this cloning process. You are **given a docker container running Alpine Linux named seraphina which you must clone into another named isabella**. These containers must be meticulously configured to ensure that **any file created or modified within the directory /twilight in the first container is immediately mirrored in the other**. This supernatural synchronization is essential for Seraphina and Isabella to stand united against the relentless threats of Twilight Hollow.

## Constraints

- None

## Output / Evaluation Criteria

- The name of the second container must be **isabella**.

- The contents of the first container must be **identical to the second container**.

- Any file created or modified within the directory /twilight in the first container must be **immediately mirrored in the other**.