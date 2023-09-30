# What's your ID?

Mrs Perera is a lecturer of ECD Univertsity. She teaches "English for Academic Purpose" to a class of First year students.

She has asked the students to submit a an assignment through the learning management system. The Students were supposed to name the file with their student ID but none of the students has done that.

Given that every student has included their student ID somewhere in the file, find the student ID and remane the file as \<STUDENT ID>.txt

# Input format
The set of files will be in the "Files" directory.
Every file will include the Student ID in one line, the line will only have the student ID.
The student ID will be in the SIDXXXX format where X is a number between 0-9.

<br/>
<br/>

 # Docker build & run
```
 > docker build -t question1 .
 > docker run -it question1
 root@xxxxx: /usr/src/app# >  bash script.sh
 
 ```