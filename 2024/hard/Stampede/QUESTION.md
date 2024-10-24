Alright, code wrangler, here's a tale from the frontier of the digital plains. You got yerself a modest HTTP server, just sittin' there in time with a whole lotta GET endpoints. Your task? Spin it up on port 7000 and set up a proxy ahead of it at port 8000, one that plays gatekeeper and won't let more than five requests mosey through every 60 seconds. Get this contraption workin' right, and keep that server from gettin' overwhelmed by a stampede of requests. Show yer tech taming skills and keep things runnin' smooth out on the wild web frontier.

## Constraints

- The script must be **purely written in bash within the execute.sh file**

## Output / Evaluation Criteria

- A proxy server must be set up on port 8000.

- The proxy server must limit incoming requests to five every 60 seconds.

- The proxy server must forward requests to the given HTTP server which must be running on port 7000.

- The script should not execute if the server file is not present. (It will be present within a src directory when the test runs)
