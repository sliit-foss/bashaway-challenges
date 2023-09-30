# The Email Assistant

## Scenario

You're a volunteer in a non-profit organization that conducts various humanitarian projects with celebrities. As a non-profit organization, the primary source of income will be sponsorships and partnerships from external individuals and organizations, including celebrities. Raising funds via sponsorships and partnerships is not easy. They have to reach many external entities, such as individuals and companies, within a short period by using only a few volunteers. 

Their primary way of getting in touch with external entities is emailing. Whenever they initiate a project, they create a list of email addresses of external entities which may be interested in their project. Then they send a customized email for each by modifying an email template. It is very time-consuming as they have to create every email manually.

## Task

As a volunteer in their organization with IT knowledge, they request you to do something to make it easier. So your task is to develop a bash script to modify the given email template (template.txt) and create customized email bodies refering the details given in the recipients.txt file. Content in the recipients.txt file takes the following format.

```
<Recipient's_Name>,<Recipient's_Email_Address>
<Personalized_Text_1>
<Personalized_Text_2>
<Personalized_Text_3>
<Blank_Line>
```

Information common to all the personalized emails tot be sent such as Sender's Name, Project Name, Project Description have to be entered as runtime arguments.

`./script.sh <Sender's_Name> <Project_Name> <Project_Description>`

Each personalized email body should be saved as a separate text file named by the recipient's email address as below.

`sales@company-name.com.txt`

Use the "emails" folder to store the personalized email text files.