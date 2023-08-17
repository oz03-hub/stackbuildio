# How to stackbuildio
It is great to develop apps but sometimes one can be overwhelmed by the sheer complexity of developing and deploying a full stack application in modern day. In a selection of hundreds of tools to develop your app which ones you should use? 

By using **stackbuildio** you leave your worries at the door and are greeted with the best set of tools and architecture to develop your amazing app with!

An application name and a short description of what your application does is enough to get the ball rolling!
## Download the repo and install required dependencies
Once you download the repo, run ```npm i``` to download package.json contents.
## Get required tools sorted
Because you are self hosting the web app, you will need to create a mongodb db and an openAI api key, I cannot disclose my own keys.

Doing this is fairly easy, go to openai.com > create account > api keys > create new. Check out the `env-example` file to how to create your own `.env`. Same way, create a mongodb database with an access user and copy the password and url into your `.env`. `.env` has default db set up already, you only need to obtain your own openAI api key.

## How to run
Once all dependencies are downloaded and keys are sorted, run `node index.js` and head to `localhost:3000`. You will be greeted with client interface of the web application. Hope you will have a great time using it!

# Architecture
Pure JS with Node.js for back end, express.js for routing, MongoDB as the database system, and OpenAI Api as external api. Node.js serves the whole application while express.js handles routings in index.js, client side makes fetch requests to special routes to communicate between back end and front end. MongoDB stores all application data, created apps and users in a special document format. OpenAI Api calls are fine tuned to handle errors or unrelated tasks supplied by the user.

## How it works
`index.js` sets up the server like any other. `mongo-module.js` has all necessary scripts for communicating with the database. `ai-module.js` has all scripts to work with openAI Api. Almost all calls on server-side are async and are awaited. On their initial access, each new user browser is assigned a unique id, this is generated using `uuid`, using this unique id the server authenticates you and decides on your authorization. Using you unique id, the server will match the apps you own and not, this is useful in update and delete operations. 

Once the user supplies the application name and description, a fetch request send the data to the server. The server then uses the `ai-module` to get a response for the request. `ai-module` is responsible for generating the tools and moderating the user input. Once it's done, it will send back a json object, which then the server will send back as a response to the fetch. Once the client receives the json response, it displays the contents or gives an alert of the `ai-module` detected an error. 

After getting a response for a new app, users have the option to share that app with others. They will be required to give a developer name, it can be anything the authentication is not based on name. After sharing their app will be listed on the bottom of the screen along with other apps.

Users can also click on an app on the list to edit and play around. Once clicked the UI is updated with new app name and description. If the user generates stack using the clicked app, it will send a request to the server. Based on the user's unique id and the app's owner id, the server will decide if this user is able to update that app. If the user is the owner of the app, an update option will be added to generated content, if not it will just generate content without update. This will prevent users from updating other people's ideas without their permission.

Users can also delete their own apps after being listed. The delete button is present on only the apps that the user owns, apps created by them. This prevents other users deleting someone elses content. 

# Examples
Try out these app ideas and see what are generated:
```
App Name: MindfulBreathe

Description: MindfulBreathe is your personal mindfulness companion. Receive random breathing exercises and relaxation prompts throughout the day to stay centered and reduce stress. The app offers a variety of guided breathing techniques and timers to fit your schedule, helping you cultivate a sense of calm and presence.
```
---
```
App Name: SkillSwap Connect

Description: SkillSwap Connect brings people together to learn and share skills. Whether you're a cooking aficionado wanting to learn photography or a fitness guru seeking guitar lessons, this app connects you with like-minded individuals for skill exchange sessions through video calls. Expand your knowledge while making meaningful connections.
```
---
```
App Name: DreamLog Journal

Description: DreamLog Journal captures your nocturnal adventures. Record voice snippets describing your dreams and receive automated text transcriptions. Dive into your dream patterns, track emotions, and get insights into your subconscious mind. Unveil the fascinating world of your dreams one entry at a time.
```
### Errors
In case of an error, it will throw an alert on screen and error will be printed on console. If the user enters a description that is not describing an application, the `ai-module` will flag the input which will force the user to enter appropriate description. Most of the time, however, the ai will try to analyze your input very carefully and still refer a stack solution in the most basic sense.

There are a few form validations, users are required to give an application name and description to generate a stack, they are also required to give a developer name for sharing an application. Users are also authenticated while doing update or delete operations.

## Feedback
You can email [me](ozel@yilmazel.com) for any questions or concerns or feedback about the application.

## Extras: Possible growths
I am planning to add a section where users will be able to share their tools as well. Many developers are working on their own unique tools that they want to gain more popularity with. The AI will also use these 'new' tools while its building a tool stack.