# Manual Integration and HTTP API

This document describes how to manually integrate your game with TeacherGaming Desk without using a ready-made SDK.

The document is divided into use cases. First we describe and give examples on how to handle automatic login e.g. login parameters coming in from the TeacherGaming App. After that we describe the HTTP API you can use to communicate with TeacherGaming Desk. When integrating with TeacherGaming Desk basically you just send data to our REST API through standard HTTPS calls. All data passed needs to be inside the GET query string. Note that for compatibility with special characters, you are always required to URL encode all data sent to our API.

## In-game Flow

1. User login
  * Successful login needs to be done before any data can be sent to TeacherGaming Desk
2. Start calling playing game once every 60 seconds
  * After login is successful. This will inform the TeacherGaming Desk system that the user is currently playing the game and the user can be tracked. Also the TeacherGaming Desk Teacher Dashboard shows that the user is currently playing the game.
3. Update player state as it changes in game
  * This information will be shown on the Teacher Dashboard on the TeacherGaming Desk website so that the Teacher can easily see what the students are currently doing in game.
4. Send event data
  * Events and the data in them have been set up on the TeacherGaming Desk website by TeacherGaming. This is the data that is needed to track student progress.

## Student Login

### Manual Authentication / Login
Login a student to our system. Class id is unique throughout the whole system and student id is unique throughout the class the user is in. Student id can be thought as an username and class id as a password.

### HTTP Request
#### URL
`https://analyticsdata.teachergaming.com/api/validate`

#### Parameters

Parameter | Default | Description
--------- | ------- | -----------
classid |  | TeacherGaming Desk Class ID
studentid |  | TeacherGaming Desk studentid
apikey | | Your game's API key

<aside class="info">
Your API key has been provided to you by TeacherGaming or hardcoded to your SDK.
</aside>

#### response
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
Key | Value
--- | -----
success | 1 for successful login, 0 for failed login
message | Detailed information about the login result.
debug | Debug information
responseCreatedAt | Datetime when reponse was created
login_message | login message that can be displayed to user on successful login
login_message_html | same as above but with html bold tags in id’s
subscription_expired | true if TeacherGaming Desk subscription is expired otherwise false
subscription_expired_message | Message that can be displayed to user if subscription has expired
student | studentid of the logged in student, SHA256 hash of this id, boolean of whether account was created and boolean of whether teacher has linked creatubbles
class | classid  of the logged in student, SHA256 hash of this id and boolean of whether student self signup is allowed
game_name | name of the game student logged in

#### Example usage
`https://analyticsdata.teachergaming.com/api/validate?studentid=johndoe&classid=democlass&apikey=K8SaQRDsSFdFt5zFthTy`

### Authentication / Login through TeacherGaming App
To support automatic login you need to handle the login parameters being given to your game by the TeacherGaming App. On Android this is done by using Intent (when app is not already running) and Broadcast (when app is running) parameters. On iOS this is done using a URL scheme. We are planning to change both mobile platforms to use the URL scheme in the future. On desktop latforms the login parameters are passed as command line paramters when starting the game.

#### Intent Login
```csharp
// Example code for handling the login intent from TeacherGaming App in an Android game.
// Example is in Unity and C# but you can adapt it for your language & engine.

// Intent login at App Start (Unity C# code)
// This function is run from a Start() in Monobehaviour.

private bool TryLoginFromAndroidIntent()
{
    // Get the class, activity (context) and intent from unity android side
#if UNITY_ANDROID && !UNITY_EDITOR
    AndroidJavaClass javaClass = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
    AndroidJavaObject context = javaClass.GetStatic<AndroidJavaObject>("currentActivity");
    AndroidJavaObject intent = context.Call<AndroidJavaObject>("getIntent");

    // Check if intent has TeacherGaming Desk login related extras
    bool hasClassId = intent.Call<bool>("hasExtra", "TGA-classid");
    bool hasStudentId = intent.Call<bool>("hasExtra", "TGA-studentid");
    bool hasCommand = intent.Call<bool>("hasExtra", "TGA-command");
    string command = "";
    string classId = "";
    string studentId = "";
    if (hasCommand)
    {
        command = intent.Call<string>("getStringExtra", "TGA-command");
    }

    if (hasClassId && hasStudentId && (!hasCommand || command == "login"))
    {
        classId = intent.Call<string>("getStringExtra", "TGA-classid");
        studentId = intent.Call<string>("getStringExtra", "TGA-studentid");

        if (classId != "" && studentId != "" && classId != null && studentId != null &&
          classId != "null" && studentId != "null")
        {
            // Got class id & student id & commanded to login. Start login process.
            // CALL LOGIN CODE HERE
            return true;
        }
        else
        {
            return false;
        }
    }
    else
    {
        return false;
    }
#else
    return false;
#endif
}
```
Intent is an abstract description of an operation to be performed used in Android applications. Intent can also contain key value pair extras, which can be used to send data internally in app or externally to another app. For the case where the game is not running yet, the TeacherGaming App simply starts the app using an intent that contains the class id and student id as extras.

Keys and values used in TeacherGaming App intents

Key | Value
--- | -----
TGA-classid | User’s Class ID. Not needed if not logging in.
TGA-studentid | User’s Student ID. Not needed if not logging in.
TGA-command | "login" or "logout" Do we login or logout.

When using a TGA SDK all of this is handled automatically. However when there is no TGA SDK available for the engine you are using (and you are using the HTTP API directly) or you for some other reason need to implement this yourself you can refer to the examples on the right for help.

If you are unfamiliar with Android development and wish to know more about intents, please refer to the Android documentation: [https://developer.android.com/reference/android/content/Intent.html](https://developer.android.com/reference/android/content/Intent.html)

```csharp
// Receiving broadcasts
// Unity C# code
void OnApplicationPause(bool paused) 
{
    AndroidJavaClass tgaReceiver = new AndroidJavaClass("com.teachergaming.tgareceiver.TGABroadcastReceiver");
    tgaReceiver.CallStatic("createInstance");

    // Get static variables from plugin
    string receivedClassID = tgaReceiver.GetStatic<string>("classId");
    string receivedStudentID = tgaReceiver.GetStatic<string>("studentId");

    if (receivedClassID != null && receivedStudentID != null)
    {
        // login code here ...
    }
}
```
```java
// Android Java code for BroadcastReceiver
public class TGABroadcastReceiver extends BroadcastReceiver {
   public static String classId;
   public static String studentId;

   public TGABroadcastReceiver() {
   }

   @Override
   public void onReceive(Context context, Intent intent)
   {
       String receivedClassId = intent.getStringExtra("TGA-classid");
       String receivedStudentId = intent.getStringExtra("TGA-studentid");

       if (receivedClassId != null && receivedStudentId != null
               && receivedClassId.length() > 0 && receivedStudentId.length() > 0)
       {
           classId = receivedClassId;
           studentId = receivedStudentId;
       }
       else
       {
           classId = null;
           studentId = null;
       }
   }
}
```
```xml
<!--AndroidManifest for the receiver-->
<!--You need to add this part to your AndroidManifest.xml file to support the broadcast receiver:-->
<receiver
    android:name=".TGABroadcastReceiver"
    android:enabled="true"
    android:exported="true">
    <intent-filter>
        <action android:name="com.teachergaming.com.TGAbroadcast" />
    </intent-filter>
</receiver>
```
#### Broadcast login (while game is running)

When the game is running intents can be received via broadcast. Receiving broadcasts requires a BroadcastReceiver. Implementation may differ depending on the engine you are using for your game.

TGA Unity SDK uses an Android plugin for receiving broadcasts.

#### Testing with TeacherGaming App
1. Install the app from google play: https://play.google.com/store/apps/details?id=com.teachergaming.com&hl=en
  (or search: TeacherGaming)
2. Open the TeacherGaming Application on your device
3. Press “Login to Analytics” button at the top of the screen
4. Tap the laptop image 10 times at the top of the screen A new menu will open where you can input the following information:
    * Your game package name, for example: com.FiveMoreMinutes.SwitchAndGlitch
    * Class ID
    * Student ID
    * Press “Launch” and the TeacherGaming App will run your game and send given id’s to it.

```url
Example URI scheme for testing login:
com.teachergaming.switchandglitch://?classid=5mm&userid=marko&command=login
```
On iOS the app is launched using the URI scheme
`<your app bundle identifier>://?classid=<class id>&studentid=<student id>&command=<login/logout>`

For how to handle URL schemes on iOS see the relevant documentation for your programming language/engine/platform.

## Check class
Can be used to check if a class with a given class id exists in the system.

### HTTP Request
#### URL
https://analyticsdata.teachergaming.com/api/check_class

#### Parameters
Key | Value
--- | -----
apikey | Api key of your game
classid | TeacherGaming Desk class id


#### Response
```json
{
    "success": 1,
    "message": "Class check successfull, class found with this id.",
    "responseCreatedAt": "2017-06-13T07:10:16.249Z",
    "debug": {
        "sent": "2017-03-15T12:05:35.722Z",
        "container": "zo5jajsD99beDQyt7-pv0n"
    },
    "class": {
        "classid": "<classid>",
        "class_exists" : true,
        "classid_unique": "<HashedUniqueClassID>"
    },
}
```
Key | Value
--- | -----
success | 1 for success, 0 for fail.
message | Detailed information about the result
debug | Debug information
responseCreatedAt | Datetime when reponse was created 
class | Described in the following table

Key | Value
--- | -----
classid | The class id (same as the one given as parameter)
class_exists | True if class exists, false if not
classid_unique | Unique id of the class

#### Example Usage
`https://analyticsdata.teachergaming.com/api/check_class?classid=democlass&apikey=K8SaQRDsSFdFt5zFthTy`

## Playing Game (keep alive)
Inform TeacherGaming Desk that the user is currently logged in and playing. Send once every minute. If TeacherGaming Desk does not receive this request for 3 minutes it will deduce that the student has quit the game and log him out.

### HTTP Request
#### URL
https://analyticsdata.teachergaming.com/api/playing_game

#### Parameters
Key | Value
--- | -----
classid | TeacherGaming Desk class id
studentid | TeacherGaming Desk id of the student in the class
apikey | Api key of your game

#### Response
```json
{
    "success": 1,
    "message": "Student playtime added",
    "responseCreatedAt": "2017-06-13T07:10:16.249Z",
    "debug": {
        "sent": "2017-03-15T12:05:35.722Z",
        "container": "zo5jajsD99beDQyt7-pv0n"
    },
    "game_name": "<game’s name>",
    "class": {
        "classid": "<classid>",
        "classid_unique": "<HashedUniqueClassID>"
    },
    "student": {
        "studentid": "<studentid>",
        "studentid_unique": "<HashedUniqueStudentID>"
    }
}
```
Key | Value
--- | -----
success | 1 for success, 0 for fail.
message | Detailed information about the result
debug | Debug information
responseCreatedAt | Datetime when reponse was created 
game_name | Name of the game the student is logged in
student | studentid of the logged in student and SHA256 hash of this id
class | classid  of the logged in student and SHA256 hash of this id

#### Example Usage
`https://analyticsdata.teachergaming.com/api/playing_game?studentid=johndoe&classid=democlass&apikey=K8SaQRDsSFdFt5zFthTy`

## Player State
Inform TeacherGaming Desk what the user is currently doing in game.
Separate calls for State and Detailed State.
For example: State = Playing Game, Detailed State = Level 1

### HTTP Request

#### URL
`https://analyticsdata.teachergaming.com/api/update_state`

`https://analyticsdata.teachergaming.com/api/update_state_detailed`

#### Parameters
Key | Value
--- | -----
classid | TeacherGaming Desk class id
studentid | TeacherGaming Desk id of the student in the class
apikey | Api key of your game
state | What the user is currently doing

#### Response
```json
{
    "success": 1,
    // IF CALLING STATE:
    "message": "Student state updated to: <newstate>",
    // IF CALLING DETAILED STATE: 
    "message": "Student detailed state updated to: <newdetailedstate>",
    "responseCreatedAt": "2017-06-13T07:12:46.311Z",
    "debug": {
        "sent": "2017-03-15T12:05:35.722Z",
        "container": "zo5jajsD99beDQyt7-pv0n"
    },
    "game_name": "<game’s name>",
    // IF CALLING STATE:
    "new_state": "<newstate>",
    // IF CALLING DETAILED STATE:
    "new_detailed_state": "<newstatedetailed>",
    "class": {
        "classid": "<classid>",
        "classid_unique": "<HashedUniqueClassID>"
    },
    "student": {
        "studentid": "<studentid>",
        "studentid_unique": "<HashedUniqueStudentID>"
    }
}
```
Key | Value
--- | -----
success | 1 for success, 0 for fail.
message | Detailed information about the result + state sent to method
debug | Debug information
responseCreatedAt | Datetime when reponse was created 
game_name | name of the game student logged in
new_state | 
new_detailed_state | State that was sent to method in a more detailed form
student | studentid of the logged in student and SHA256 hash of this id
class | classid  of the logged in student and SHA256 hash of this id

####Example Usage
`https://analyticsdata.teachergaming.com/api/update_state?studentid=johndoe&classid=democlass&apikey=K8SaQRDsSFdFt5zFthTy&state=Playing game`

`https://analyticsdata.teachergaming.com/api/update_state_detailed?studentid=johndoe&classid=democlass&apikey=K8SaQRDsSFdFt5zFthTy&state=Level 1`

## Event Data
Send event data to TeacherGaming Desk. The events and needed data for your game can be seen on the Events page on the TeacherGaming Desk website.

### HTTP Request

#### URL
`https://analyticsdata.teachergaming.com/api/track`

#### Parameters

##### Required
Key | Value
--- | -----
apikey | Api key of your game
eventname | The event name that you are submitting data for.

##### Optional
Key | Value
--- | -----
classid | TeacherGaming Desk class id
studentid | TeacherGaming Desk id of the student in the class
duration | How long it took to complete the event in milliseconds.
Optional data | Optional event data for your event is passed in key=value pairs. This is the data that has been set by TeacherGaming for each Event that is tracked in your game Examples: levelID=JungleLevel3 Score=3

#### Response
```json
{
    "success": 1,
    "message": "Event tracked succesfully.",
    "responseCreatedAt": "2017-06-13T07:21:44.594Z",
    "debug": {
        "sent": "2017-03-15T12:05:35.722Z",
        "container": "zo5jajsD99beDQyt7-pv0n"
    },
    "game_name": "<game’s name>",
    "event": "<eventname>",
    "student": {
        "studentid": "<studentid>",
        "studentid_unique": "<HashedUniqueStudentID>"
    },
    "class": {
        "classid": "<classid>",
        "classid_unique": "<HashedUniqueClassID>"
    },
    "data": {},
    "duration": 0
}
```
Key | Value
--- | -----
success | 1 for success, 0 for fail.
message | Detailed information about the result
debug | Debug information
responseCreatedAt | Datetime when reponse was created 
game_name | name of the game student logged in
event | name of the event that is being tracked
student | studentid of the logged in student and SHA256 hash of this id
class | classid  of the logged in student and SHA256 hash of this id
data | All of the additional data fields sent to method
duration | Duration of the event, sent to method  

#### Example Usage
This is the LevelComplete event in Switch & Glitch
`https://analyticsdata.teachergaming.com/api/track?apikey=K8SaQRDsSFdFt5zFthTy&studentid=johndoe&classid=democlass&eventname=LevelComplete&GameType=Network&LevelId=Level1&TileCount=20&FailedTileCount=-1&SuccessTileCount=3&CommitCount=1&Score=101&duration=17389`

## Student Logout
You can allow student to log out of TeacherGaming Desk only if your game is not subscription based. Logging out stops all student specific interactions with TeacehrGaming Desk.

### HTTP Request

#### URL
`https://analyticsdata.teachergaming.com/api/logout_student`

#### Parameters
Key | Value
--- | -----
classid | TeacherGaming Desk class id
studentid | TeacherGaming Desk id of the student in the class
apikey | Api key of your game

#### Response
```json
{
  "success": 1,
  "message": "Student logged out",
  "responseCreatedAt": "2017-06-13T06:56:25.169Z",
  "debug": {
      "sent": "2017-03-15T12:05:35.722Z",
      "container": "zo5jajsD99beDQyt7-pv0n"
  },
  "game_name": "<game’s name>",
  "class": {
      "classid": "<classid>",
      "classid_unique": "<HashedUniqueClassID>"
  },
  "student": {
      "studentid": "<studentid>",
      "studentid_unique": "<HashedUniqueStudentID>"
  }
}
```
Key | Value
--- | -----
success | 1 for success, 0 for fail.
message | Detailed information about the result
debug | Debug information
responseCreatedAt | Datetime when reponse was created 
game_name | Name of the game student logged out of
student | studentid of the logged out student and SHA256 hash of this id
class | classid of the logged out student and SHA256 hash of this id

#### Example Usage
`https://analyticsdata.teachergaming.com/api/logout_student?studentid=johndoe&classid=democlass&apikey=K8SaQRDsSFdFt5zFthTy`