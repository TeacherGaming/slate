---
title: API Reference

language_tabs:
  - shell
  - http
  - C#
  - ruby
  - python
  - javascript

toc_footers:
  - <a href='#'>Sign Up for a Developer Key</a>
  - <a href='https://github.com/tripit/slate'>Documentation Powered by Slate</a>

includes:
  - errors

search: true
---

# Introduction

TeacherGaming Desk, our learning platform, aims to demystify the processes behind game-based learning. It aims to provide educators with an easily understandable way of tracking and assessing the learning that happens in-game.
 
In more technical terms, the analytics part of TeacherGaming Desk is a web-based platform that collects analytics information (events) sent by games and processes it to reveal what the students (users, players) have learned while playing the game. The SDK for integrating the analytics is called TGA SDK for short.
 
This document is written for game developers that are going to integrate TeacherGaming Desk analytics into their games. It describes on a general level how to do the integration. Integration can be done either by using a ready-made SDK for your platform, or by manually using the HTTP API. More detailed information is available in the specific documents for the different SDKs and the HTTP API documentation.

# Student Login

## Student ID and Class ID

Students are identified in TGA by their class and student ids. These are used instead of real names or similar in order to prevent outsiders (anyone except their teachers or parents etc.) from identifying individual students in the system. The class id is a system-wide unique generated alphanumeric identifier that identifies a group of students (usually a class). The student id is an alphanumeric identifier that is unique within a class, and is manually set either by a teacher in the web interface or by the student on first login if automatic generation of students has been allowed for that class.
 
TeacherGaming Desk analytics (TGA) requires the game to send a class id and a student id for each student playing the game to assign data to the right student. This means that students need to login before data can be sent, except for anonymous event data.
 
Logging in can be done through the TeacherGaming app (Android only at the moment) or in the game. If users authenticate in the game you will need to add a UI where the student can type in a class id and a student id.
 
You should not save the class and student id’s in your game. The student should need to login separately every time the app is started, either through the TG App or in the game UI.

> To authorize, use this code:

```ruby
require 'kittn'

api = Kittn::APIClient.authorize!('meowmeowmeow')
```

```python
import kittn

api = kittn.authorize('meowmeowmeow')
```

```shell
# With shell, you can just pass the correct header with each request
curl "api_endpoint_here"
  -H "Authorization: meowmeowmeow"
```

```javascript
const kittn = require('kittn');

let api = kittn.authorize('meowmeowmeow');
```

> Make sure to replace `meowmeowmeow` with your API key.

Kittn uses API keys to allow access to the API. You can register a new Kittn API key at our [developer portal](http://example.com/developers).

Kittn expects for the API key to be included in all API requests to the server in a header that looks like the following:

`Authorization: meowmeowmeow`

<aside class="notice">
You must replace <code>meowmeowmeow</code> with your personal API key.
</aside>

# API

## Login Student

```http
https://analyticsdata.teachergaming.com/api/validate
```

```C#
// Create new Auth object and start authentication
TGASDK.TGA.TGAAuth tgaAuth = new TGASDK.TGA.TGAAuth(this, TGASDK.TGA.TGAAuth.AuthUser(classID, studentID));
 
// Wait for auth result
yield return tgaAuth.authResult;
 
if (tgaAuth.authResult.Equals("true"))
{
      // Authentication succeeded (classid & studentid we’re correct)
}
else
{
// Authentication failed (classid & studentid we’re not correct)
}
```

> The above command returns JSON structured like this:

```json
{
  "success": 1,
  "message": "Student with this ID exists in this class.",
  "responseCreatedAt": "2017-06-13T07:08:47.763Z",
  "debug": {
      "sent": "2017-03-15T12:05:35.722Z",
      "container": "zo5jajsD99beDQyt7-pv0n"
  },
  "login_message": "Logged into class <classid> with studentid <studentid>",
  "login_message_html": "Logged into class <b>classid</b> with studentid <b>studentid</b>",
  "subscription": {
      "subscription_expired": false,
      "subscription_expired_message": "Your subscription has expired."
  },
  "student": {
      "studentid": "<studentid>",
      "studentid_unique": "<HashedUniqueStudentID>",
      "created_account": false,
      "teacher_creatubbles_linked": true
  }
  "class": {
      "classid": "<classid>",
      "classid_unique": "<HashedUniqueClassID>",
      "allow_student_signup": true
  },
  "game_name": "<game’s name>"
}
```

Login user to our system. Class ID is unique throughout the whole system and student ID is unique throughout the class the user is in. Student ID can be thought as an username and class ID as a password.

### HTTP Request

`GET https://analyticsdata.teachergaming.com/api/validate`

### Query Parameters

Parameter | Default | Description
--------- | ------- | -----------
classid |  | TGA Class ID
studentid |  | TGA studentid
apikey | | Your game's API key

<aside class="success">
Your API key has been provided to you by TeacherGaming or hardcoded to your SDK.
</aside>

## Playing Game

```ruby
require 'kittn'

api = Kittn::APIClient.authorize!('meowmeowmeow')
api.kittens.get(2)
```

```python
import kittn

api = kittn.authorize('meowmeowmeow')
api.kittens.get(2)
```

```shell
curl "http://example.com/api/kittens/2"
  -H "Authorization: meowmeowmeow"
```

```javascript
const kittn = require('kittn');

let api = kittn.authorize('meowmeowmeow');
let max = api.kittens.get(2);
```

> The above command returns JSON structured like this:

```json
{
  "id": 2,
  "name": "Max",
  "breed": "unknown",
  "fluffiness": 5,
  "cuteness": 10
}
```

Inform TGA that the user is currently logged in and playing. Send once every minute.

<aside class="warning">Inside HTML code blocks like this one, you can't use Markdown, so use <code>&lt;code&gt;</code> blocks to denote code.</aside>

### HTTP Request

`GET https://analyticsdata.teachergaming.com/api/playing_game`

### URL Parameters

Parameter | Default | Description
--------- | ------- | -----------
classid |  | TGA Class ID
studentid |  | TGA studentid
apikey | | Your game's API key