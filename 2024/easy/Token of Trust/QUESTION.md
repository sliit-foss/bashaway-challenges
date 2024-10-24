Now, listen close, savvy coder, 'cause here's a tale that'll tangle yer thoughts. In a stronghold old and digital, there's this sly auth server sittin' snug on port 9000. Yer mission? Send a shout, a POST request down /api/auth/login, usin' them old-timey credentials: bashaway as the grand name (username) and 2k24 as the hush hush key (password). Mind ya, slap on that x-api-version header, mark it clear with 1.0, and serve up yer payload in simple form data. Take this task careful-like, 'cause only then them authentication gates'll creak open, handin' ya that sought-after token of trust.

## Constraints

- The script must be **purely written in bash within the execute.sh file**.

## Output / Evaluation Criteria

- A request must be made to the server running on port 9000 as described above.

- The script should not crash if no server is running on the specified port.