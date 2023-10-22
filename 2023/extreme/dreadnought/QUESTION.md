# Dreadnought

Amid the backdrop of World War I, a coastal town's code enthusiasts drew inspiration from the historical events of the era. In one memorable battle, the HMS Dreadnought which was the pride of her majesty's navy, faced off against an enemy ship that relentlessly sent distress signals every second as it found itself outgunned and desperate for aid.

Captain Samuel "Codebeard" O'Malley, fascinated by this wartime tale, set out to create a bash script that would pay homage to this history. The script **spun up a local Kafka broker**, mirroring the enemy ship's relentless distress signals by continuously **publishing random messages to a Kafka topic named "SOS."** As the **script ran quietly in the background**, it evoked the tension and drama of that pivotal World War I naval battle, blending historical narrative with technical innovation.

## Constraints

- None

## Output / Evaluation Criteria

- Should be able to connect to the kafka broker on port 9092 and consume messages from the SOS topic which are being published every second