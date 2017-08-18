# HTTP API

Our HTTP API can be used if we don't yet have an SDK for your programming language / game engine.

Basically, just send data to our REST API through standard HTTPS calls. All data passed needs to be inside the GET query string. Note that for compatibility with special characters, you are always required to URL encode all data sent to our API.

## In-game Flow

1. User login
  * Successful login needs to be done before any data can be sent to TGA (except anonymous event data)
2. Start calling playing game once every 60 seconds
  * After login is successful. This will inform the TGA system that the user is currently playing the game and the user can be tracked. Also the TGA Teacher Dashboard shows that the user is currently playing the game.
3. Update player state as it changes in game
  * This information will be shown on the Teacher Dashboard on the TGA website so that the Teacher can easily see what the students are currently doing in game.
4. Send event data
  * Events and the data in them have been set up on the TGA website by TeacherGaming. This is the data that is needed to track student progress.

## Student Login

### Authentication / Login through TeacherGaming App
To support automatic login you need to handle the login parameters being given to your game by the TeacherGaming App. On Android this is done by using Intent (when app is not already running) and Broadcast (when app is running) parameters. On iOS this is done using a url scheme. We are planning to change all platforms to use the URL scheme in the future.

#### Intent Login
```csharp
// Example
// Intent login at App Start (Unity C# code)

// This function is run from a Start() in Monobehaviour.

private bool TryLoginFromAndroidIntent()
{
    // Get the class, activity (context) and intent from unity android side
#if UNITY_ANDROID && !UNITY_EDITOR
    AndroidJavaClass javaClass = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
    AndroidJavaObject context = javaClass.GetStatic<AndroidJavaObject>("currentActivity");
    AndroidJavaObject intent = context.Call<AndroidJavaObject>("getIntent");

    // Check if intent has TGA login related extras
    bool hasClassId = intent.Call<bool>("hasExtra", "TGA-classid");
    bool hasStudentId = intent.Call<bool>("hasExtra", "TGA-studentid");
    bool hasCommand = intent.Call<bool>("hasExtra", "TGA-command");
    string command = "";
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
            StartCoroutine(TryExternalLogin());
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
Intent is an abstract description of an operation to be performed used in Android applications. Intent can also contain key value pair, extras, which can be used to send data internally in app or externally to another app.

TG App uses broadcasting for sending the login information to your game while your game is running, which also requires a BroadcastReceiver to receive the broadcast. For the case where the app is not running, we simply start the app with the intent.

When using a TGA SDK all of this is handled automatically. However if there is no TGA SDK available for the engine you are using (and you are using the HTTP API directly) or you for some reason need to implement this yourself you can refer to the following examples for help.

Keys and values used in TG App intents

<table>
    <tr><td>Key</td><td>Value</td></tr>
    <tr><td>TGA-classid</td><td>User’s Class ID. Not needed if not logging in.</td></tr>
    <tr><td>TGA-studentid</td><td>User’s Student ID. Not needed if not logging in.</td></tr>
    <tr><td>TGA-command</td><td>login or logout Do we login or logout.</td></tr>
</table>


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

    if (receivedClassID != null && receivedStudentID != null){
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
#### Broadcast login (while App is running)

When the app is running intents can be received via broadcast. Receiving broadcast requires a BroadcastReceiver. Implementation may differ depending on the engine you are using for your game.

TGA Unity SDK uses an Android plugin for receiving broadcasts.

#### Testing with TeacherGaming App
1. Install the app from google play: https://play.google.com/store/apps/details?id=com.teachergaming.com&hl=en
  (or search: TeacherGaming)
2. Open the TG application on your device
3. Press “Login to Analytics” button at the top of the screen
4. Tap the laptop image 10 times at the top of the screen A new menu will open where you can input the following information:
    * Your game package name, for example: com.FiveMoreMinutes.SwitchAndGlitch
    * Class ID
    * Student ID
    * Press “Launch” and the TG app will run your game and send given id’s to it.

```url
Example URI scheme for testing login:
com.teachergaming.switchandglitch://?classid=5mm&userid=marko&command=login
```
On iOS the app is launched using the URI scheme
`<your app bundle identifier>://?classid=<class id>&studentid=<student id>&command=<login/logout>`

For how to handle URL schemes on iOS see the relevant documentation for your programming language/engine/platform.


### HTTP Request

Login user to our system. Class ID is unique throughout the whole system and student ID is unique throughout the class the user is in. Student ID can be thought as an username and class ID as a password.
`GET https://analyticsdata.teachergaming.com/api/validate`

### Query Parameters
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
Parameter | Default | Description
--------- | ------- | -----------
classid |  | TGA Class ID
studentid |  | TGA studentid
apikey | | Your game's API key

<aside class="info">
Your API key has been provided to you by TeacherGaming or hardcoded to your SDK.
</aside>

#### Query response example on the right.

## Playing Game

Inform TGA that the user is currently logged in and playing. Send once every minute.

### HTTP Request

`GET https://analyticsdata.teachergaming.com/api/playing_game`

### URL Parameters

Parameter | Required | Description
--------- | ------- | -----------
classid | true | TGA Class ID
studentid | true | TGA studentid
apikey | true | Your game's API key