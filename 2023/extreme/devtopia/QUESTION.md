# Devtopia

In the enchanted realm of Devtopia, ancient Container images, each holding a fragment of a powerful microservice, await your command. Your quest: summon these images locally and infuse them with the mystical energies of their dependencies. You may delve into the sacred scrolls of its source code should you need and ensure that the arcane environments are harmoniously configured within a network of name **bashaway-2k23**. Fear not, for you may conjure whimsical illusions to mock the unnecessary services which are not in scope.

Venture forth, intrepid coder, into the mystical realms of containers, and spin a tapestry of microservices that will echo through the ages!

## Images

- **orchestrator**     -    ghcr.io/akalanka47000/pharmaceutical-orchestrator:dd2657a68e316a53d29cc6eaad896ca90c99804c-1
- **auth-service**     -    ghcr.io/akalanka47000/pharmaceutical-auth-service:3e8749f240308773af4b0508a9245f9dd91c2ecd-1
- **user-service**     -    ghcr.io/akalanka47000/pharmaceutical-user-service:3e8749f240308773af4b0508a9245f9dd91c2ecd-1
- **email-service**    -    ghcr.io/akalanka47000/pharmaceutical-email-service:3e8749f240308773af4b0508a9245f9dd91c2ecd-1
- **product-service**  -    ghcr.io/akalanka47000/pharmaceutical-product-service:3e8749f240308773af4b0508a9245f9dd91c2ecd-1
- **sms-service**      -    ghcr.io/akalanka47000/pharmaceutical-sms-service:3e8749f240308773af4b0508a9245f9dd91c2ecd-1

## Source Code

- [Repository Link](https://github.com/akalanka47000/pharmaceutical)

- All required environment keys are over here within each service directory under a file named **.env.example**

- You may find the DockerFile which was used to build the images under **workspace-scripts/services/build/docker**.


## Constraints

- You must use docker for the solution.

- You may mock certain keys such as the keys required to connect with external email and sms servers. (But the services must be up and running)

- You do not need to run the other services which are not in the above list but you must handle the errors which may occur due to the absence of those services.

## Output / Evaluation Criteria

- All 6 services should be running in the same network named **bashaway-2k23**.

- The container names should be **orchestrator**, **auth-service**, **user-service**, **email-service**, **product-service** and **sms-service**.

- The services should be able to communicate with each other.

- Only the orchestrator should be exposed to the host machine on port 2002. The other services should not be exposed and should run internally on port **8080** within their respective containers.

- Some services require mongodb and redis which means you'll need to run mongodb and redis containers as well.