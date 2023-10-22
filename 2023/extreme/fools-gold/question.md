## Fools Gold

Within the treacherous waters of the Grand Line, a pirate captain was burying his treasure on a remote island. He chose to **set up** a digital **MySQL** chest **on port 3307**, guarded by a fierce **root key of "fools-gold" and a strict limit of 2 connections**.

Just in case this key was lost, he also **created a user account with the username "ace" and the password "firefist"**. This key had the ability to unlock the entirety of the treasure. The captain was confident that his treasure was safe, but he was wrong.

On one fateful day, a rival pirate crew managed to steal one of these keys. They were able to connect to the database and steal the treasure. When they opened the chest, what they found was a single database named **vault**. Inside this database was a single table named **gold**. This table contained only 5 records with the following fields:

- id (int)
- name (string)
- value (int).

The thieves were dissapointed. They decided to leave the treasure behind and sail off into the distant sea.

### Constraints

- The script must be **purely written in bash within the execute.sh file**.

### Output

- A local mysql instance running on **port 3307** with the **root user having the password "fools-gold"** and a **user named "ace" with the password "firefist"** with a **database named vault** and a **table named gold** with the following fields:

  - id (int)
  - name (string)
  - value (int)

- 5 random records populated in the table named **gold**

- A **connection limit of 2** to the mysql instance
