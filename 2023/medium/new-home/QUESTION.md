# A New Home

Get ready to orchestrate a seamless data migration spectacle! In this challenge, you'll be the maestro of MongoDB as you conduct a symphony of **data transfer from one instance**, filled with valuable information, **to its barren counterpart**. Can you compose the perfect score for this, ensuring all the data finds a new home in the second instance?

## Constraints

- The script must be **purely written in bash within the execute.sh file**.

## Output / Evaluation Criteria

- All databases, collections and documents except for the system defaults which exist in the first instance (`bashaway-2k23-sunset`) must exist in the second instance (`bashaway-2k23-sunrise`)

- No extra databases, collections or documents should exist in the second instance (`bashaway-2k23-sunrise`) which do not exist in the first instance (`bashaway-2k23-sunset`)

- Make sure you clean up the working directory after the script has been executed. The working directory should be in the same state as it was before the script was executed.