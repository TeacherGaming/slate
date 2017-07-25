## HTTP API

### General

Our HTTP API can be used if our system does not yet support your programming language / game engine.

Basically, just send data to our REST API through standard HTTPS calls. All data passed needs to be inside the GET query string. Note that for compatibility with special characters, you are always required to URL encode all data sent to our API.

### In-game Flow

1. User login
  * Successful login needs to be done before any data can be sent to TGA (except anonymous event data)
2.  Start calling playing game once every 60 seconds
  * After login is successful. This will inform the TGA system that the user is currently playing the game and the user can be tracked. Also the TGA Teacher Dashboard shows that the user is currently playing the game.
3.  Update player state as it changes in game
  * This information will be shown on the Teacher Dashboard on the TGA website so that the Teacher can easily see what the students are currently doing in game.
4.  Send event data
  * Events and the data in them have been set up on the TGA website by TeacherGaming. This is the data that is needed to track student progress.

### Login Student

> Example Output

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

#### HTTP Request

`GET https://analyticsdata.teachergaming.com/api/validate`

#### Query Parameters

Parameter | Default | Description
--------- | ------- | -----------
classid |  | TGA Class ID
studentid |  | TGA studentid
apikey | | Your game's API key

<aside class="success">
Your API key has been provided to you by TeacherGaming or hardcoded to your SDK.
</aside>

### Playing Game

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

#### HTTP Request

`GET https://analyticsdata.teachergaming.com/api/playing_game`

#### URL Parameters

Parameter | Required | Description
--------- | ------- | -----------
classid | true | TGA Class ID
studentid | true | TGA studentid
apikey | true | Your game's API key