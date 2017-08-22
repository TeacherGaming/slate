# Android Java SDK

This document describes the specifics of integrating TeacherGaming Desk to your game using the TGA Android Java SDK. For general integration information and links to other SDK documents see the general SDK instructions.

## First Steps
TeacherGaming will send you a `TGASDK<gamename>.java` file. Copy the `TGASDK<gamename>.java` file to your project’s `src/com/teachergaming/tga` folder. Updating the SDK can be done by simply replacing the old SDK file with new one.

## Notes
Your SDK file is called `TGASDK<gamename>.java`. Class inside that file is called `TGASDK<gamename>`. To improve readability, we have not added &lt;gamename&gt; for each method call in this document, we are mentioning TGASDK and you should add your game name after each TGASDK call to make it correct.

## Student Login

### Automatically Logging in with TeacherGaming App
For the automatic login to work correctly you need to pass the intent received in your main activity’s `onCreate` function to the SDK by calling

`TGASDKSwitchGlitch.TGA.HandleIntent(getIntent());`

````java
@Override
protected void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
    TGASDKSwitchGlitch.TGA.HandleIntent(intent);
}
```
You also need to override the onNewIntent function with the code on the right.

The Java Android SDK automatically handles broadcast logins via TG App. You can get notified about students logging in and logging out by implementing the `TGASDK.TGA.AuthUserListener`
interface and adding your listener using
`TGASDK.TGA.AddAuthUserListener(AuthUserListener added)`
Remember to also remove the listener using
`TGASDK.TGA.RemoveAuthUserListener(AuthUserListener removed)`

### Manual Login

#### See [2.1.2. Creating your own UI for in-game login](#creating-your-own-ui-for-in-game-login2.1.2.) for information about manual login and guidelines for creating a login UI.

#### Validating Login
```java
TGASDK.TGA.AuthUser(classID, studentID, listener);
```
Login can be authenticated with the code below and on the right.

`TGASDK.TGA.AuthUser(classID, studentID, listener);`

```java
// Login listener interface
public interface AuthUserListener
{
    void OnTGAAuthUserComplete(boolean authenticated);
}

// Override example
TGASDKTeacherGamingApp.TGA.AuthUser("test", "student1", new AuthUserListener() {
@Override
	public void OnTGAAuthUserComplete(boolean authenticated) {
		// Handle login here
		System.out.println("LOGIN RESPONSE: " + authenticated);
	}
});
```
Where classID and studentID are the class and student ID’s you want to login with, and listener implements the `AuthUserListener` interface to listen when the login has completed.

## Sending Events
The events that have been defined in TGA website are generated to the SDK and can be used to send data from the game to TGA.

### Sending Events with Duration
```java
// Start event
TGASDKMyGame.Event.MyEvent.Start();
...
// While event is going on update variables
TGASDKMyGame.Event.MyEvent.Current().countOfSomething += 5;
...
// Send event
TGASDKMyGame.Event.MyEvent.Send();
```
This is useful for events that have a duration. You can start an event and then send it to TeacherGaming Desk when it ends. Our SDK automatically counts time from beginning to end and appends duration to sent data. You can also modify any additional data inside the event before you send it.
To start the event, call `TGASDK.Event.<EventName>.Start()`
After that you can gather all needed data for the event. You can change additional data inside the event before you send it. All data for the started event can be changed using `TGASDK.Event.<EventName>.Current.<EventParameter>` variables.
To send the event, call `TGASDK.Event.<EventName>.Send()`

## Sending Events without Duration
```java
// Send an event immediately without tracking duration
TGASDKMyGame.Event.MyInstantaneousEvent.Send(5); // Event takes an integer parameter
```
If event is something for which it does not make sense to track duration you can call `TGASDK.Event.<EventName>.Send(...)` with the event data as parameters to send the event directly.

## Updating state

See [2.4. UPDATING STATE](#updating-state2.4.).

Updating state can be done using one of three function calls.

* `TGASDK.TGA.UpdateUserState(string state)`
	* This sets the state showing below student name in teacher dashboard. It also resets detailed state showing below this state, if there was any.
* `TGASDK.TGA.UpdateUserState(string state, string detailedState)`
	* This sets the state showing below student name in teacher dashboard and detailed state below it.
* `TGASDK.TGA.UpdateUserStateDetailedOnly(string stateDetailed)`
	* This sets the detailed state below main state and does not reset the main state. You can use this to for ex. Update round numbers or other live data happening in current state of your game.

You can keep the state update calls in your game and don’t need to check if user is logged in to TGA, we will automatically check inside the function calls if player is currently authenticated to TGA and send the state update only if so.

### State examples
```java
TGASDK.TGA.UpdateUserState("In Main Menu");
```
```java
TGASDK.TGA.UpdateUserState("In Settings Menu");
```
```java
TGASDK.TGA.UpdateUserState("Playing Singleplayer Game", "Tutorial Level 4");
```
```java
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

## Handling foreground - background transitions on android
On android you should call:
`TGASDK.TGA.HandleApplicationToBackground()`
when your application goes to background (for example in your Activity’s `onStop()`) and
`TGASDK.TGA.HandleApplicationToForeground()`
when your application returns to foreground. These stop and restart the thread sending keepalive status messages. If `HandleApplicationToBackground` is not called the thread will keep running and analytics will show the app as active even if it is on the background (for example when user has pressed home key).

## Getting Data

```java
// Login information
// Get logged in user class ID
TGASDK.TGA.getClassId()
// Get logged in user student ID
TGASDK.TGA.getStudentId()
// Logs user out of TGA.
TGASDK.TGA.Logout()
// Sets classid & studentid but skips authentication. Use with care.
TGASDK.TGA.SetTGAIds(studentId, classId)

// Creatubbles
// Returns true if teacher account is linked to creatubbles.
TGASDK.TGA.isCreatubblesLinked()
// Gets student creatubbles token, if available.
TGASDK.TGA.getCreatubblesToken()
// Gets creatubbles gallery ID where creation needs to be submitted.
TGASDK.TGA.getCreatubblesGalleryId()
```
There is some useful data you can get inside the `TGASDK<gamename>` class, like current logged in user class ID, studentID, if user is logged in or creatubbles tokens (if teacher account is linked to Creatubbles). On the right you can find the most useful ones (but you can also open the `TGASDK<gamename>.java` file and check the class TGA to find all variables and methods available).

