# Pack-o-Matic

In a futuristic world driven by decentralized computing, a cutting-edge command-line utility known as "Pack-o-Matic" has emerged to **revolutionize code packaging**. Tasked with taming a bustling directory of **shell scripts residing in within src** domain, "Pack-o-Matic" deftly **wraps each script into a sleek tarball, bestowing upon it the very name it once bore**.

These newly minted packages can be plugged into NodeJS and users can invoke them with a simple "npx" command, summoning the script's wisdom at their fingertips. A world where code is packaged and summoned effortlessly, "Pack-o-Matic" stands as the sentinel of streamlined script deployment in the digital age.

## Constraints

- The script must be **purely written in bash within the execute.sh file**.

## Output / Evaluation Criteria

- NPM packages packed as tarballs for each script in the **src** directory should be present within a **out** directory

- The tarballs should be named after the script they contain, with the extension ".tgz". For example, **if the script was named hello-world, the tarball should be named hello-world.tgz**. (The version number of the package is not important)

- After installing one of these packages, the script should be executable via the "npx" command. For example, if the script was named "hello-world", the command "npx hello-world" should execute the script.

- The script should not crash if the src directory is empty or does not exist.
