# Eldoria

In the mystical realm of Eldoria, scattered scrolls of ancient lore emerged, each bearing various items and values measured in the currency of the distant lands, Gold Drakes. The Council of Elders are to gather to unlock their secrets, employing the "Merge and Convert Ritual" to **unify the scrolls** into one compendium. An algorithm is to be written for this divine purpose as well as to **sort the values in descending order**. A final enchantment needs to **convert the Gold Drakes to the realm's currency, Silver Sovereigns, with 1 Gold Drake equating to 178 Silver Sovereigns**. The council of elders seek your help on this, to harmonize the scrolls and reveal their true wisdom aligned with the local economy.

## Constraints

- The script must be **purely written in bash within the execute.sh file**.

## Output / Evaluation Criteria

- A single merged **csv** file to the **out** folder, with the **values converted to Silver Sovereigns and sorted in descending order**. The file should be named **merged-scrolls.csv**. The original csv files will be within the **src** folder.

- The converted value must be rounded to the nearest 2 decimal places. For example, 1.2385 should become 1.24, and 1 should become 1.00.

- The currency in the header of the csv file should be **Silver Sovereigns**.

- The script should not crash if the src directory is empty or does not exist.
