In a mystical forge, a blacksmith named Orin crafts enchanted artifacts using secret keys that unlock elemental powers. These keys which are provided as **build arguments vary with each creation** and must be embedded into the artifact's blueprint during the forging process.

An example of a list of required keys (which will be generated during tests) and the corresponding build command to its artifact are as follows:

```.env.example
KEY1=
KEY2=
```

```bash
docker build --build-arg KEY1=fire --build-arg KEY2=water -t bashaway-2k24-enchanted-artifact .
```

If you were Orin, how would you inscribe these ever-changing keys into the artifact's blueprint, ensuring they are seamlessly integrated and activated during the forging process? 

## Constraints

- The script must be **purely written in bash within the execute.sh file**

- You are allowed to make changes to the Dockerfile

## Output / Evaluation Criteria

- The given express server should be able to be built with the given Dockerfile and run successfully. It's root route should all key values as a JSON object (These key values should be the same as the ones in the .env file and are picked from the container environment)

- The script should not execute if the .env.example file is missing