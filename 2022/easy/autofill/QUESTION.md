# Autofill

## Scenario

Having to do the same tasks again and again is boring. It is same when it comes to filling same CLI prompts in Linux environments on daily basis. So it will be easier we can develop an answering script to provide answers for prompts.

## Task

Develop a bash script to answer the following prompts created by questions.sh script:
```
Hi! Welcome to SLIIT Bashaway 2022.
Your team name:
No. of members in your team:
Your university:
```

You should develop a bash script to answer the above prompt as follows.
```
Hi! Welcome to SLIIT Bashaway 2022.
Your team name: <Your Team Name>
No. of members in your team: <Member count>
Your university: <University Name>

```

Then the provided bash script will create a file by your team name including your team details.
Eg: `team_name.txt`

You can test it by the following command:
`./questions.sh < ./script.sh`

