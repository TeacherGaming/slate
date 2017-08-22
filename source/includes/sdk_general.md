# General SDK Information

In this document and in the code the SDK for integrating the analytics is often called TGA SDK for short.
 
This part of the document is written for game developers that are going to integrate TeacherGaming Desk analytics into their games. It describes on a general level how to do the integration. Integration can be done either by using a ready-made SDK for your platform or manually by using the HTTP API.

More detailed information is available in the documentation for the different SDKs and the HTTP API documentation. See the links on the left.

## Student id and Class id

Students are identified in TGA by their class and student ids. These are used instead of real names or similar in order to prevent outsiders (anyone except their teachers or parents etc.) from identifying individual students in the system. The class id is a system-wide unique generated alphanumeric identifier that identifies a group of students (usually a class). The student id is an alphanumeric identifier that is unique within a class, and is manually set either by a teacher in the web interface or by the student on first login if automatic generation of students has been allowed for that class.
 
TeacherGaming Desk analytics (TGA) requires the game to send a class id and a student id for each student playing the game to assign data to the right student. This means that students need to login before data can be sent, except for anonymous event data.
 
Logging in can be done through the TeacherGaming app or in the game. If users authenticate in the game you will need to add a UI where the student can type in a class id and a student id. Our Unity C# SDK has a ready-made UI you can use if you are developing on Unity.
 
You should not save the class and student ids in your game. The student should need to login separately every time the app is started either through the TeacherGaming app or in the game UI.

### Automatically logging in from TeacherGaming app
When the user has logged in to TeacherGaming app and launches your game the TeacherGaming app passes the login information to your game to allow your game to log in automatically as it is lauched (or brought back to foreground). On Android this is done by using Intent (when app is not already running) and Broadcast (when app is running) parameters. On iOS this is done using an URI scheme. We are planning to change Android to use the URI scheme as well in the future (the Unity SDK already supports it). On desktop platforms we pass the URI as a command line argument to the application.

The SDKs do the handling of these parameters automatically. When using an SDK all you need to do is listen to a callback (see the platform specific SDK documentation for how to do this) and react appropriately. If you are using the HTTP API you need to do the parameter handling yourself (see the HTTP API documentation and TeacherGaming app Android Intent login documentation).

When the student has logged in via TeacherGaming app you should not give the user the option to logout or to login as different student inside the game. Changing the student should only be done via the TeacherGaming app in this case. It is good if you still have the UI to show the class and student ids but you can leave it out if you wish. This can be the same UI you use to login inside the game just having the input fields and buttons in a disabled state disabled for example.

####Testing automatic login through TeacherGamning App
1. Search for app called TeacherGaming on Play or App store. Install the app and launch it.
2. Press “LOGIN TO ANALYTICS” button at the top of the screen
3. Tap 10 times TG logo at the top of the screen and a new menu will appear
4. In the new menu input your game’s package name and class id and student id
5. Press “Launch”
Your game should now run and a popup should inform you about the login result.

####Testing automatic login on mobile without TeacherGaming app

```url
URI:
<your bundle identifier>://?classid=<class id>&studentid=<student id>&command=<login/logout>

Example (in html file):

<a href = "com.fivemoreminutes.switchandglitch://?classid=h1xme&studentid=student1&command=login"> Login h1xme/student1 </a>

```
Create a html file with links according to the URI scheme or input the URI in the device browser address bar.

####Testing automatic login on desktop without TeacherGaming app
```url
Desktop command line examples:

“Switch & Glitch.exe” “com.fivemoreminutes.switchandglitch://?classid=h1xme&studentid=student1&command=login”

“Switch & Glitch.exe” “?classid=h1xme&studentid=student1&command=login”

```
On desktop platforms you should test the automatic login by giving the URI on the right as a command line parameter when starting your game.

Replace &lt;your bundle identifier&gt; with your bundle identifier (f.e. com.teachergaming.switchandglitch) &lt;class id&gt; with a class id and &lt;student id&gt; with a student id and choose login or logout as the command. Note that on desktop you can leave the &lt;your bundle identifier&gt;:// part out in case you don’t have a bundle identifier defined. You can also leave the classid=&lt;class id&gt;&studentid=&lt;student id&gt;& part out if you have logout as the command. Note that you should never leave out the ? character. Note that the parameter contains special characters, so remember to put it in "".

### Creating your own UI for in-game login
For manually logging in to TGA the student needs to be able to input a class id and a student id. A good place for this UI is for example in a settings menu, or somewhere in the main menu. Usually two input fields with OK and Cancel options is enough. You can also have a Logout button to logout of TGA. Both the class id and student id fields should be either lowercase or uppercase only, not mixed case. In the system the class id and student id are not case sensitive. Uppercase only can be used to make it easier for young children to type the ids.

####Login UI examples
<table>
<tr>
	<td width="33%">
		<img src="images/integrations/unitycsharp/image6.png"/><br>
		Unity C# SDK built-in login UI
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

## Save games, user profiles and tga login
If your game has different user profiles for different players, you should tie each tga login to a different user profile. Even if you don’t have user profiles otherwise, it is advisable to tie player progress to TGA login.

Note that when resuming the game and switching profiles, you should log the current user out and switch the profile. This can happen for example when user changes logged in user in TeacherGaming App and launches your game again and your game was already running in the background.

## Sending events
The events that have been defined in TeacherGaming Desk website are automatically generated to the SDK and can be used to send data from the game to TeacherGaming Desk. In this document just a general overview with pseudocode is given. See the platform specific SDK documentation for more detailed information. You don’t need to check if the user is logged in to TGA before sending events. The SDK will automatically check inside the function calls for this.

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
To start the event, call TGASDK.Event.&lt;EventName&gt;.Start().
You can gather all the needed data for the event before you send it using TGASDK.Event.&lt;EventName&gt;.Current.&lt;DataParameter&gt;
To send the event, call TGASDK.Event.&lt;EventName&gt;.Send()

### Sending events without duration
```csharp
// Sending an event without tracking for duration
TGASDKSomeGame.Event.ItemCrafted.Send("item1");
```
If the event is something for which it does not make sense to track a duration you can call TGASDK.Event.&lt;EventName&gt;.Send(...) with event data as parameters to send the event directly.

## Updating state
By default when user logs in, teacher will see in their dashboard state “Playing game” for that student. It is possible to update the state and detailed state for student for what they are currently doing in the game, like In main menu, Playing level 1, Playing Multiplayer, In Settings Menu. This allows teacher to see by glance in teacher dashboard what student is currently doing.

Updating state can be done using one of three function calls

* TGASDK.TGA.UpdateUserState(string state)
	* This sets the state showing below student name in teacher dashboard. It also resets detailed state showing below this state, if there was any.
* TGASDK.TGA.UpdateUserState(string state, string detailedState)
	* This sets the state showing below student name in teacher dashboard and detailed state below it.
* TGASDK.TGA.UpdateUserStateDetailedOnly(string stateDetailed)
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
