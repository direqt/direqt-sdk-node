# OpenAI integration with Direqt Chatbot Sample


## Description:
This README provides an example of integrating Direqt's SDK with OpenAI for building a chatbot. It is aimed at developers familiar with OpenAI's chatbot capabilities who want to leverage Direqt's console.


## Technologies Used 
- ```Typescript```
- ```Direqt Messaging API``` 
- ```OpenAI```
- ```Ngrok ```


## Documentation and Resources 
- [Direqt Documentation](https://docs.direqt.ai/messaging-api/)
- [OpenAI Documentation](https://platform.openai.com/docs/api-reference)
- [Ngrok Documentation](https://ngrok.com/docs)
- [Direqt Console](https://console.direqt.io/login)


## Pre-requisites 
- ```Node: v18.16.0```
- ```Direqt account``` ```Direqt Access Token``` ```Direqt Signing Secret```
- ```OpenAI account``` ```OpenAI API Key```
- ```Ngrok``` 


## Installation 

1. Clone This Repository : 
   ``` git clone [repo url]```

2. Install Dependencies to Your Project 
``` $ npm install ```

## Setup 
To set up this project, you will need to create a .env file.
Navigate inside your  ```.env``` file and paste the correct naming conventions which can be found in the .env.sample.
Before running the project you will need to configure your OpenAI API Key, Direqt's Signing Secret, and Access Token. 


## To Find Your OpenAI API Key:
   - To obtain your OpenAI API key, you need to access your personal OpenAI account and locate the API keys section.
   - Inside your account, create a new secret key, assign it a name, and copy the key.
   - Paste the copied API key into your .env file. 

## To Find Your Direqt Access Token, Signing Secret and Configure Your Chatbot: 
   - Open your terminal and execute the command ```ngrok http 3000``` Note that 3000 represents the port number on which your server is running. If you are utilizing a different port, make sure to adjust the port number accordingly in the code.
   - Copy the "Forwarding" address provided by ngrok. Make sure to select the "http" address, which should follow a format similar to: 'https://12345678.ngrok.io'.
   - Visit Direqt's website and log in using your credentials: https://console.direqt.io/login
   - Click on "Add ChatBot".
   - Proceed with the necessary steps to configure your chatbot.
   - Go to the Webhook section and insert your ngrok URL in the designated "Webhook URL" field. 
   - The Access Token and Signing Secret should be displayed below the location where you entered your ngrok URL, within the credentials section.


   ## Back on you development machine:
   - Paste your Direqt keys into your  ```.env``` file. 
   - Run your code: ``` $ npm run start ```
   - NOTE: In order for your ngrok http 3000 url to keep working, you must have ngrok running in a separate terminal as ```npm run start``` runs in the background.

   ## Back on your Direqt Console 
   You should see your OpenAI Chatbot live and ready to go! Congratulations! You have successfully integrated OpenAI with Direqt's console.


   Copyright (c) 2023 Direqt Inc.
