# Redis Relay

Climb aboard the Redis expedition! Fire up an instance on your local machine, with the credentials **username: default, password: 5ax4*1$2** and **port: 6380.** Your mission: **Inject 500 random stringy keys and values into this cache** and make sure to include the special key 'bashaway-2k23' with its value set to the current timestamp in epoch format (milliseconds). Are you up for an adventure?

## Constraints

- The script must be **purely written in bash within the execute.sh file**.

## Output / Evaluation Criteria

- It should be possible to connect to the Redis instance using the credentials provided above.
- The Redis instance should contain 500 keys, including the special key **bashaway-2k23** with its value set to the current timestamp in epoch format (milliseconds).