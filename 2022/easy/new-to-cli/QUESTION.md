# New to CLI

ICT teacher of ABC school is working on familiarizing CLI tools among his students as most of the school students have no experience using CLI tools. As a start, he is thinking of grouping students in to multiple teams and let them experience the interactive nature of CLI through a simple Bash script. Each team will get access to a Linux PC with this script. 

Your task is to develop that bash script for him. Teams are named as the team members preferred which may contain Uppercase, Lowercase, Numbers but not special characters execpt dash (-), underscore (_) and whitespace ( ).

This script should be interactive enough to prompt and get the following information from the team and save the data to a .txt file with team name. (eg: \<team_name>.txt. Whitespaces in middle of the group name should be replaced with underscore in the file name)
- Group Name
- Member Names
- Member NIC Numbers
- Member Phone Numbers
- Member Addresses

To get an idea about how long it took for each student to complete the prompted form, you should add timestamp at the following instances.
- Start of script
- End at entering Team Name.
- End of each students turn
- End of script

Make sure the team will not be needing to run the script more than once to enter the team details.