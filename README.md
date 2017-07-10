# Time Tracker for Slack with Google Sheets

A Serverless Node.js application to help you keep track of time spent on manual tasks in a standardised way. 
This project was inspired by the time I worked at an early-stage start-up, deciding on which manual tasks to automate is vital to creating a scalable product.

A Google Sheet is used to store the time tracking information along with a list of business activities that can be used to record time against. 
Google Spreadsheet can be shared with your colleagues with varying permission levels. 
It provides company wide visibility, makes it easy for anyone download the data as CSV and analyse it for insights.

# Demo
Here is a 1 min demo of the Time Tracker app. Click on the image to watch the video on YouTube.

[![Time Tracker for Slack Demo](http://img.youtube.com/vi/SW2PuoBAy5k/0.jpg)](http://www.youtube.com/watch?v=SW2PuoBAy5k "Time Tracker Demo")

# Architecture
Time Track function is deployed as an AWS Lambda function which is served behind an API Gateway. Orchestration of AWS resources and deployment of the application is managed by the [Serverless library](https://serverless.com/).
<img src="http://erselaker.com/assets/images/slack-time-tracker-architecture.png" alt="Time Tracker Serverless Architecture" width="70%" >

[CloudCraft was used to create the architecture diagram.](https://cloudcraft.co/)

# Set-up
To start using the application, you would need AWS, Slack and Google accounts. 

## Google Service Account
Go to [Google API Console](https://console.developers.google.com/) and create a new service account, you could do this under an existing project or create a new project if you would like to scope it. 

Make sure you check the *"Furnish a new private key"* checkbox and set the user role to Owner. 

Copy the downloaded file under `lib/` directory with the name `client_secret.json`. These credentials will be used to talk to the Google Sheet API. Check [serverless.yml](https://github.com/ersel/time-tracker-slack-gsheets/blob/master/serverless.yml#L13)
<img src="http://erselaker.com/assets/images/google_service_account_setup.png" alt="Google Service Account Setup" width="70%" >

## Google Sheets
Google Sheets document template can be [found here](https://docs.google.com/spreadsheets/d/1gMFifK-4IrPs9PL7L1Y1AxLx7DBgbhHlFM0XD5y-2uk/edit?usp=sharing) which you can just do `File -> Make a copy...`

Once you've created a copy of the file, click the Share button on the top right hand corner and share the file with the Service Account ID we have created in the previous step. 

<img src="http://erselaker.com/assets/images/google_sheet_permissions.png" alt="Google Sheets Permissions" width="70%" >


While we are here take a note of the Google Spreadsheet ID, which should be visible in the URL.
`https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_IS_HERE/edit?usp=sharing`
Copy the spreadsheet ID and paste it to the [serverless.yml config.](https://github.com/ersel/time-tracker-slack-gsheets/blob/master/serverless.yml#L14)

## Deploy to AWS
Once you have done the above steps, you can deploy time tracker application to AWS. In order to do that, you'll need to find out your AWS Access Key Id and Access Key. You should export those variables then run `serverless deploy` to deploy the application.

```
export AWS_ACCESS_KEY_ID=<your-key-here>
export AWS_SECRET_ACCESS_KEY=<your-secret-key-here>
# AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are now available for serverless to use
serverless deploy
```

When AWS deploy is finished, you'll get the URL of the AWS API Gateway endpoint dumped to the console. Take a note of that URL because we'll use it to set-up the Slack Integration.

## Slack Integration
After deploying the app to AWS, you should now have the URL to the AWS API Gateway which probably looks something like this `https://XXXXXXXXXX.execute-api.us-east-1.amazonaws.com/dev/track`. 

Now go to [Slack Apps Dashboard](https://api.slack.com/apps) and create a new application.

When you've created the new application, click on the `Add Features and Functionality` section and choose `Slash Commands`.

Fill in the Slash Command details as below.

<img src="http://erselaker.com/assets/images/slash-command.png" alt="Slash Command" width="70%" >

Congrats, you've deployed the time tracker application fully now. :tada:

# Usage

Time Tracker Application accepts 3 commands.

`\track help` to display help

`\track list` to display list of business activities supported. These can be edited by going to the `activities` tab of the Google Sheet.

`track COMPANYNUMBER "business activity" 12m` Track time command

```
/track COMPANYNUMBER "activity name or alias" duration
Duration examples: 01:11:20 or 11:20 or 1h or 1m or 1s
eg: /track 12345678 "called the client" 12m
```

In its current state time track application only accepts valid UK company numbers, but this feature can be switched off by [commenting out the these lines.](https://github.com/ersel/time-tracker-slack-gsheets/blob/master/lib/timeTrack.js#L21-L24)

# Notes

If you encounter any problems or issues while setting project up, please raise an issue on the repo. Contributions and feedback are welcome.
