# URL Scraper

## Scenario

You and Nimal are freelance web developers who usually deliver low-budget projects. To minimize the budget, you always try using non-copyrighted media files (images, videos etc.) and minimum hosting space. Therefore, you have been using media files hosted on the internet instead of hosting the media files among the website artifacts. These media files are 3rd-party hosted public image sets, etc., without any CORS issues.

After some time, your clients complain about missing images on their websites. After checking up on their complaints, you two realize that some of the 3rd-party hosted images have been removed or deleted. To avoid such incidents further, you two plan to download all the media files you have used in your projects and host them in a CDN.

You two understand this as a tedious task, so you suggest Nimal automate the whole thing. As a skilled Linux user, you agree to develop an automation script to list URLs of the media files included in each project. At the same time, Nimal takes care of automating downloading those media files using the URLs you will provide.

## Task

Develop a Bash script to list the URLs of all the media files used in a given website project directory. Assume that all these websites are developed only using HTML and CSS where no JavaScript or other programming language is used. The script should append the URLs to a text file saved as "url_list.txt."

## Hint

As the media files are not hosted among the website artifacts but some remote source, the best way to figure a way out is to follow the source.

## Instructions

Bash script file and the url_list.txt files are already copied into the "bashaway-test-site" project folder for your ease.
