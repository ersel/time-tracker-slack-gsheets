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

# Set-up
To start using the application, you would need AWS, Slack and Google accounts. 

## Google Service Account
Go to [Google API Console](https://console.developers.google.com/) and create a new service account, you could do this under an existing project or create a new project if you would like to scope it. 

Make sure you check the *"Furnish a new private key"* checkbox and set the user role to Owner. 

Copy the downloaded file under `lib/` directory with the name `client_secret.json`. These credentials will be used to talk to the Google Sheet API. Check [serverless.yml](https://github.com/ersel/time-tracker-slack-gsheets/blob/master/serverless.yml#L13)
<img src="http://erselaker.com/assets/images/google_service_account_setup.png" alt="Time Tracker Serverless Architecture" width="70%" >

## Google Sheets
Google Sheets document template could be [found here](https://docs.google.com/spreadsheets/d/1gMFifK-4IrPs9PL7L1Y1AxLx7DBgbhHlFM0XD5y-2uk/edit?usp=sharing) which you can just do `File -> Make a copy...`

Once you've created a copy of the file, click the Share button on the top right hand corner and share the file with the Service Account ID we have created in the previous step. 
<img src="http://erselaker.com/assets/images/google_sheet_permissions.png" alt="Time Tracker Serverless Architecture" width="70%" >
