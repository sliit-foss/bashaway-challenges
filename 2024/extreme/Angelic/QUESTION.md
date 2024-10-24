In the ethereal realms where angels and demons vie for dominion, thou art entrusted with a task of divine complexity. Two microservices found within `src`, forged by angelic hands in due time, must be dockerized and deployed unto a celestial Kubernetes cluster with namespace `lifeforge`. Establish `a singular gateway at angelic.bashaway.sliitfoss.org` where the path `/fallen` shall guide the request to the `fallen microservice`, and the path `/` shall direct it to the `regular microservice`. 

Any other path shall return a 404, proclaiming, "Lost in the Abyss, path not found". Inscribe within the heavens the environment variables: SERVICE_VERSION whispering the semver version 1.0.0, SERVICE_HOST declaring the host address, and SERVICE_PORT announcing the port number of each celestial service. Demonstrate your mastery over the forces of deployment, navigating the delicate balance between the realms. May the angels guide your hand, and the demons tremble at your might.

## Constraints

- None

## Output / Evaluation Criteria

- A service named `fallen` must be deployed on the Kubernetes cluster.

- A service named `regular` must be deployed on the Kubernetes cluster.

- The services must be accessible via the endpoints at http://angelic.bashaway.sliitfoss.org/fallen and http://angelic.bashaway.sliitfoss.org respectively.
