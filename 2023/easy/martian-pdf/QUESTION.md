# Martian PDF

On the enigmatic red planet of Mars, where ancient scrolls of knowledge are inscribed in strange hieroglyphs, imagine stumbling upon a peculiar Martian PDF. Its pages are like fragments of Martian history, filled with alien symbols and cryptic runes. Your mission, as a galactic explorer, is to decode the secrets of a specific Martian page using the mystical language of Bash.

As you venture through the Martian PDF, your Bash skills act as an interplanetary Rosetta Stone, deciphering the word count of the chosen page. Just as Martians might decode the mysteries of Earth's languages, you'll unveil the Martian page's word count, bridging the gap between worlds with your digital prowess.

## Example Invocation

```bash
bash execute.sh 1 # 1st page
```

## Constraints

- The script must be **purely written in bash within the execute.sh file**.

## Output / Evaluation Criteria

- A **single integer to the console** representing the **word count of a specific page of the given PDF file named mystery.pdf** which can be found within the **src** directory.

- If the page does not exist, the script should output **0**.

- The script should not crash if the src directory is empty or does not exist or if a page number is not provided.