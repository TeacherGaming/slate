# General SDK Information

## What is TGA SDK

The analytics part of TeacherGaming Desk can be described as a web-based platform that collects analytics information (events and state) sent by games and processes it to reveal what the students (users, players) have learned while playing the game. The SDK for integrating the analytics is called TeacherGaming Desk Analytics SDK, or TGA SDK for short.

This part of the document is written for all game developers that are going to integrate TeacherGaming Desk analytics into their games. It describes how to do the integration on a general level. Integration can be done either by using a ready-made SDK for your platform, or by manually using the HTTP API. More detailed information is available in the specific parts for each SDK, easily accessed from the table of contents on the left.

## Integration flow

Integrating TeacherGaming Desk analytics to a game is done in collaboration with TeacherGaming and the game developer (you). The flow is as follows.

1. We send your way a suggestion of what the skills and the game events linked to those skills could be - this will be the basis for the analytics framework and something we can finalise together with you. 
2. Once the framework is ready, we generate the game specific SDK code and send that over so you can add it to the game.
3. You send us a test build and fix possible bugs (we do our best to assist but hope you're taking charge of this)
4. You send us the final build and we get it into our system and in the hands of the users in the subscription service.

## Student id and Class id

Students are identified in TeacherGaming Desk by their class and student ids. These are used instead of real names or similar in order to prevent outsiders (anyone except their teachers or parents etc.) from identifying individual students in the system. The class id is a system-wide unique generated alphanumeric identifier that identifies a group of students (usually a class). The student id is an alphanumeric identifier that is unique within a class, and is manually set either by a teacher in the web interface or by the student on first login if automatic generation of students has been allowed for that class.
 
TeacherGaming Desk requires the game to send a class id and a student id for each student playing the game to assign data to the right student. This means that students need to login before data can be sent.
 
Logging in can be done through the TeacherGaming app or in the game UI. Logging in through the app is the primary method and implementing the automatic login through TeacherGaming app is mandatory since that is required for it to work. Implementing an in-game login UI is optional but recommended. Our Unity C# SDK has a ready-made UI you can use if you are developing on Unity.
 
You should not save the class and student ids in your game. The student should need to login separately every time the app is started either through the TeacherGaming app or in the in-game UI.

### Automatically logging in from TeacherGaming app

When the user has logged in to TeacherGaming app and launches your game the TeacherGaming app passes the login information to your game when it is lauched (or brought back to foreground).

On iOS this is done using an URI scheme.

On Android this is done by using Launch Intent (when app is not already running) and Broadcast Intent (when app is running) parameters.  We are planning to change Android to also use the URI scheme in the future, so all new integrations on Android should support that. Support for Intent & Broadcast is also still needed since the TeacherGaming app still currently uses those. The ready-made SDKs currently support both Intent and URI scheme logins on Android.

On desktop platforms we pass the login information to the game as a command line parameter. The parameter is formed as URI parameters in the same way as when using the URI scheme on mobile platforms.

The SDKs do the handling of these parameters automatically. When using an SDK all you need to do is listen to a callback (see the platform specific SDK documentation for how to do this) and react appropriately. If you are using the HTTP API you need to do the parameter handling yourself (see [7.2.3. AUTHENTICATION / LOGIN THROUGH TeacherGaming app](#authentication-login-through-teachergaming-app7.2.3.) ).

When the student has logged in via TeacherGaming app you should not give the user the option to logout or to login as different student inside the game. Changing the student should only be done via the TeacherGaming app in this case. It is good if you still have the UI to show the class and student ids but you can leave it out if you wish. This can be the same UI you use to login inside the game just having the input fields and buttons in a disabled state disabled for example.

#### Testing automatic login through TeacherGaming app
1. Get TeacherGaming app from [https://app.teachergaming.com/](https://app.teachergaming.com/). Install the app and launch it.
2. Press “LOGIN TO ANALYTICS” button at the top of the screen
3. Tap 10 times TG logo at the top of the screen and a new menu will appear
4. In the new menu input your game’s package name (on mobile platforms) and class id and student id
5. Press “Launch”
Your game should now run and a popup should inform you about the login result.

#### Testing automatic login on mobile without TeacherGaming app

```url
URI:
<your bundle identifier>://?classid=<class id>&studentid=<student id>&command=<login/logout>

Example (in html file):

<a href = "com.fivemoreminutes.testgame://?classid=h1xme&studentid=student1&command=login"> Login h1xme/student1 </a>

```
Create a html file with links according to the URI scheme or input the URI in the device browser address bar.

Replace &lt;your bundle identifier&gt; with your bundle identifier (f.e. com.teachergaming.testgame) &lt;class id&gt; with a class id and &lt;student id&gt; with a student id and choose login or logout as the command. You can leave the classid=&lt;class id&gt;&studentid=&lt;student id&gt;& part out if you have logout as the command. Note that you should never leave out the ? character.

#### Testing automatic login on desktop without TeacherGaming app
```url
Desktop command line examples:

“Switch & Glitch.exe” “com.fivemoreminutes.testgame://?classid=h1xme&studentid=student1&command=login”

“Switch & Glitch.exe” “?classid=h1xme&studentid=student1&command=login”

```
On desktop platforms you can test the automatic login by giving the URI as a command line parameter when starting your game.

Note that on desktop you can leave the &lt;your bundle identifier&gt;:// part out. Note that the parameter contains special characters, so remember to put it in "".

### Creating your own UI for in-game login
For logging in to TeacherGaming Desk in-game the student needs to be able to input a class id and a student id. A good place for this UI is for example in a settings menu, or somewhere in the main menu. Usually two input fields with OK and Cancel options are enough. You can also have a Logout button to log out of TGA. Both the class id and student id fields should be either lowercase or uppercase only, not mixed case. In the system the class id and student id are not case sensitive. Uppercase only can be used to make it easier for young children to type the ids.

#### Login UI examples
<table>
<tr>
	<td width="33%">
		<img src="images/integrations/unitycsharp/image6.png"/><br>
		Unity C# SDK built-in login UI. Lower left button is logout, lower right login, and the X (close) is cancel.z
	</td>
	<td width="33%">
		<img src="images/integrations/general/image4.png"/><br>
		Switch & Glitch manual login
	</td>
	<td width="33%">
		<img src="images/integrations/general/image6.png"/><br>
		Switch & Glitch logged in via TeacherGaming app
	</td>
</tr>
</table>

## Save games, user profiles and TeacherGaming student login
If your game has different user profiles for different players, you should tie each TeacherGaming login to a different user profile. Even if you don’t have user profiles it is advisable to tie player progress to TeacherGaming login.

Note that the user can put your game in the background, go back to TeacherGaming app, and log out and/or log in with different student & class ids. For desktop games this is not a problem since launching the game again from TeacherGaming app after that launches a new instance of it, but for mobile games you should check if the login has changed when your game comes back to foreground and handle it (f.e. change profile, go back to main menu) in the way best suited for your game.

## Sending events

### Events

<img src="https://lh4.googleusercontent.com/VtDWUbo3BPfeezwgdUPXas8hx8aXul8ixq1qBd4kAebsk6KCQmtFlmfxQDh2jYFlpdkOPQ4JRtPiLPY=w1920-h950-rw" />

Events are the primary vehicle for sending analytics information from the game to TeacherGaming Desk. They are used to collect the relevant information about the students actions in the game so that TeacherGaming Desk can calculate how playing the game advances the students real-world skills in the relevant topics and so that the students progress within a given lesson can be properly shown.

The events are designed by TeacherGaming in collaboration with the game developer. After design is complete the event definitions are input in the TeacherGaming Desk system by TeacherGaming staff. This defines what kind of events are accepted when the game sends them using the HTTP API. When using a ready-made SDK the game specific event code is generated before the SDK is sent to the developer. The SDK also uses the HTTP API for sending the events.

Events can have three types of parameters: strings, integers or booleans. In the generated SDK event sending code each event defined in TeacherGaming Desk will have its own class under `TGASDK<GameName>.Event` the functions of which you can use to send the event. In this section a general overview with pseudocode is given. See the platform specific SDK documentation for more detailed information on how to send the events.

You don’t need to check if the student is logged in to TeacherGaming before sending events. The SDK will automatically check inside the function calls for this.

### Sending events with duration
```csharp
// Tracking an event with duration
// Level Start
TGASDKSomeGame.Event.LevelCompleted.Start();

// Within level, when player gets score
TGASDK.SomeGame.Event.LevelCompleted.Score += 1

// At the end of the level
TGASDKSomeGame.Event.LevelCompleted.Send();
```
Our SDK can automatically count time for an event and append duration to sent data. You can modify any additional data inside the event before you send it.
To start the event, call `TGASDK.Event.<EventName>.Start()`.
You can gather all the needed data for the event before you send it using `TGASDK.Event.<EventName>.Current.<DataParameter>`
To send the event, call `TGASDK.Event.<EventName>.Send()`

### Sending events without duration
```csharp
// Sending an event without tracking for duration
TGASDKSomeGame.Event.ItemCrafted.Send("item1");
```
If the event is something for which it does not make sense to track a duration you can call `TGASDK.Event.<EventName>.Send(...)` with event data as parameters to send the event directly.

## Updating state
By default when user logs in, teacher will see in their dashboard state “Playing game” for that student. It is possible to update the state and detailed state for student for what they are currently doing in the game, like In main menu, Playing level 1, Playing Multiplayer, In Settings Menu. This allows teacher to see by glance in teacher dashboard what student is currently doing.

What states are displayed for a given game is designed by TeacherGaming in collaboration with the game developer.

Updating state can be done using one of three function calls

* `TGASDK.TGA.UpdateUserState(string state)`
	* This sets the state showing below student name in teacher dashboard. It also resets detailed state showing below this state, if there was any.
* `TGASDK.TGA.UpdateUserState(string state, string detailedState)`
	* This sets the state showing below student name in teacher dashboard and detailed state below it.
* `TGASDK.TGA.UpdateUserStateDetailedOnly(string stateDetailed)`
	* This sets the detailed state below main state and does not reset the main state. You can use this to for example update round numbers or other live data happening in current state of your game.

You can keep the state update calls in your game and don’t need to check if user is logged in to TGA, we will automatically check inside the function calls if player is currently logged in to TGA and send the state update only if so.

### State examples
```csharp
TGASDK.TGA.UpdateUserState("In Main Menu");
```
```csharp
TGASDK.TGA.UpdateUserState("In Settings Menu");
```
```csharp
TGASDK.TGA.UpdateUserState("Playing Singleplayer Game", "Tutorial Level 4");
```
```csharp
// When game begun
TGASDK.TGA.UpdateUserState("Playing Multiplayer Game");
// When round changed
TGASDK.TGA.UpdateUserStateDetailedOnly("Round 2");
```
<table>
<tr>
	<td width="20%"> <img src="images/integrations/unitycsharp/image5.png"/> </td>
	<td width="20%"> <img src="images/integrations/unitycsharp/image4.png"/> </td>
	<td width="20%"> <img src="images/integrations/unitycsharp/image2.png"/> </td>
	<td width="20%"> <img src="images/integrations/unitycsharp/image1.png"/> </td>
	<td width="20%"> <img src="images/integrations/unitycsharp/image3.png"/> </td>
</tr>
<tr>
	<td><small>Default state for logged-in student </small></td>
	<td><small>Student is in main menu </small></td>
	<td><small>Student is in settings menu</small></td>
	<td><small>Student is playing singleplayer game, Tutorial Level 4 has been passed for detailed state</small></td>
	<td><small>Student is playing multiplayer game, Round number is being passed to detailed state when round changes</small></td>
</tr>
</table>
