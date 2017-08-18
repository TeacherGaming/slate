# Unity C# SDK

## General

This document describes the specifics of integrating TGA to your game using the TGA Unity C# SDK. For general integration information and links to other SDK documents see the general SDK instructions.

### Requirements
Our current SDK requires Unity 4.0.0f7 or later. If you need an SDK for an earlier version of Unity please contact us.
### First steps
* TeacherGaming will send you a .unitypackage with the latest SDK and assets.
* Import the package by selecting “Assets -> Import package -> Custom package” in Unity.
* Attach the SDK script to a GameObject that is not deleted during the game. The script is located in “TGAGameSpecific/” folder and is named TGASDK<yourgamenamehere>.cs
* Updating the SDK and assets can usually be done by simply importing new package and updated files will automatically be detected.
	* If you are having problems and would like to try a complete reimport of the SDK, you can delete the following directories & files before importing the package
		* TGA
		* TGAGameSpecific
		* StreamingAssets/TGA
		* Plugins/Android/AndroidManifest.xml
	* In older versions of the SDK you needed to manually attach the CreatubblesManager script to a GameObject. You no longer need to do this and should remove it if you have attached it previously.

### Notes
Your game specific SDK file is called TGASDK<yourgamenamehere>.cs. Class inside that file is called TGASDK<yourgamenamehere>. To improve readability, we have not added <yourgamenamehere> for each method call in this document, we are mentioning TGASDK and you should add your game name after each TGASDK call to make it correct.

## Student login
Logging in can be done through the TeacherGaming app (Android only at the moment) or in game. If users authenticate in game you will need to add a menu where user can type in a classid and a studentid. Authentication must be done before data can be sent.

### Automatically logging in with TeacherGaming App
```csharp
// Automatically logging in with TeacherGaming App
// Login status delegate & event (in TGASDK.TGA)
public delegate void LoginStatusListener(bool isLoggedIn);
public static event LoginStatusListener OnLoginStatusChanged;
```
```xml
<!-- Assets/Plugins/Android/AndroidManifest.xml -->
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.unity3d.player">
  <application android:icon="@drawable/app_icon" android:label="@string/app_name">
	
	<activity android:name="com.unity3d.player.UnityPlayerActivity"
			  android:label="@string/app_name"
			  android:configChanges="fontScale|keyboard|keyboardHidden|locale|mnc|mcc|navigation|orientation|screenLayout|screenSize|smallestScreenSize|uiMode|touchscreen">
        <intent-filter>
			<action android:name="android.intent.action.MAIN" />
			<category android:name="android.intent.category.LAUNCHER" />
		</intent-filter>
	</activity>
	
	<activity android:name="com.teachergaming.tga.TGAAndroidUriSchemeActivity"
            android:label="@string/app_name"
            android:launchMode="singleTop">
	    <intent-filter>
	    	<action android:name="android.intent.action.VIEW" />
	    	<category android:name="android.intent.category.DEFAULT" />
	    	<category android:name="android.intent.category.BROWSABLE" />
	    	<data android:scheme="YOUR.BUNDLEIDENTIFIER.HERE" /> <!-- REPLACE WITH YOUR GAME'S ANDROID APP BUNDLE IDENTIFIER -->
	    </intent-filter>
    </activity>

	<receiver
	    android:name="com.teachergaming.tgareceiver.TGABroadcastReceiver"
	    android:enabled="true"
	    android:exported="true" >
	    <intent-filter>
	        <action android:name="com.teachergaming.com.TGAbroadcast" />
	    </intent-filter>
	</receiver>

  </application>
</manifest> 
```
```url
You can test automatic login using the following URI format
<your bundle identifier>://?classid=<class id>&studentid=<student id>&command=<login/logout>
```
Logging in via TeacherGaming App is automatically handled by the SDK. You can listen to the TGASDK.TGA.OnLoginStatusChanged C# event to get notified when the login status changes. The event gives you one boolean parameter that is true if a student logged in and false if the current student logged out. The event is implemented using the C# delegate & event system.

You can use the TGASDK.TGA.LoggedInExternally() to check if the user logged in using the TeacherGaming App.

Note for Android! In future versions of TeacherGaming App we are moving to use URI schemes to forward the login parameters to games on Android, like we already do on iOS. For this to work you need to specify your app's bundle id for the com.teachergaming.tga.TGAAndroidUriSchemeActivity activity in the AndroidManifest.xml file in Assets/Plugins/Android.

On Android and iOS you can test the uri scheme login by creating a .html file with links according to the URI scheme and opening it in your device browser and clicking on the links.

On desktop platforms you should test the automatic login by giving the uri as a command line parameter when starting your game. See https://docs.google.com/document/d/1nEJ5EGwO6JxTTmJGixvxEcBb0VhpMN7sEfOjGHY4JkI/edit#heading=h.1u1ow8hobpr for details.

### Built-in login menu
```csharp
// Built-in login menu
// Using the built-in login menu

// First check that not already logged in externally
if (!TGASDK.TGA.LoggedInExternally())
{
	// Then show the login UI
	TGASDK.TGA.CreateLoginPanel();
}
```
The TGA Unity C# SDK can create a ready made UI that has all the authentication functionality built in. See the code example on the right on how to use it.
A login dialog will be created that looks like this (without the blue background)

![UnityCSharp Login Example](images/integrations/unitycsharp/image6.png "UnityCSharp Login Example")

This dialog will inform user if the login failed or succeeded. As with login via TeacherGaming App you can listen to the TGASDK.TGA.OnLoginStatusChanged event to get notified when the login status changes.


### Handling subscription required
You can define the compile time symbol TGA_SUBSCRIPTION_REQUIRED to make the login menu require a subscription. If the symbol is defined you cannot login if you don't have an active subscription and you cannot close the login menu without logging in. Pressing X in the top-right corner will quit the application by calling Application.Quit(). You can also supply your own function for quitting as a parameter for TGASDK.TGA.CreateLoginPanel() for example if you need to bypass your Monobehaviour.OnApplicationQuit handler that calls Application.CancelQuit.

When TGA_SUBSCRIPTION_REQUIRED is defined you should show the login window when the game app is started (main menu or equivalent).
 
### Custom login menu
```csharp
// Custom login menu
// Logging in from code

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
Note: If a student has logged in externally (using TeacherGaming App) your custom login menu should not allow changing the login nor logging out. You can check if the user has logged in externally using TGASDK.TGA.LoggedInExternally(). It is recommended you still have the UI to show the class and student ids. This can be the same UI you use to login inside the game just having the input fields and buttons in a disabled state disabled for example.

If you choose to create your own login menu you need to pass the class id and student id to the auth process. From a Monobehaviour script you need to run a coroutine with the code on the right.

You can also listen to the TGASDK.TGA.OnLoginStatusChanged event to get notified when the login status changes.

## Sending events
The events that have been defined in TeacherGaming Desk website are generated to the SDK and can be used to send data from the game to Desk. All the events have their own inner class inside TGA&lt;yourgamename&gt;.Event with a property for each event parameter and functions to start and send the event.

### Sending events with duration
```csharp
// This is an example with our game Switch N’ Glitch.

/// When the player enters a singleplayer level, in our StartGame() function 
TGASDKSwitchGlitch.Event.SPLevelComplete.Start(); 

// And when the player has completed the level:
TGASDKSwitchGlitch.Event.SPLevelComplete.Current.LevelId = Client.UIActiveClient.LocalGame.GameBoard.PrefabPath;
TGASDKSwitchGlitch.Event.SPLevelComplete.Current.FailedCommandCount = player.failedTileCount;
TGASDKSwitchGlitch.Event.SPLevelComplete.Current.CommitCount = player.totalCommitCount;
TGASDKSwitchGlitch.Event.SPLevelComplete.Current.OptimalCommitsForLevel = Client.UIActiveClient.LocalGame.GameBoard.programExecutionsGoal;
TGASDKSwitchGlitch.Event.SPLevelComplete.Current.MetagelCollected = player.playerScore;
TGASDKSwitchGlitch.Event.SPLevelComplete.Send();
```
This is useful for events that have a clear start and end times and as such a duration. Our SDK can automatically count time from beginning to end and append duration to sent data. You can also modify any additional data inside the event before you send it.
To start an event, call TGASDK.Event.<EventName>.Start()
You can change additional data inside the event before you send it. All data for the started event can be changed using TGASDK.Event.<EventName>.Current.<ParameterName>
To send the event, call TGASDK.Event.<EventName>.Send() without parameters.

### Sending events without duration
```csharp
// Sending an event without duration

// This example is from KerbalEdu
TGASDKKerbalEdu.Event.SituationChange.Send(FlightGlobals.ActiveVessel.mainBody.bodyName, FlightGlobals.ActiveVessel.situation.ToString(), (int)FlightGlobals.ActiveVessel.totalMass);
```
You can call TGASDK.Event.<EventName>.Send(...) with event data as parameters to send an event immediately, without tracking for duration.

## Updating state

Updating state can be done using one of three function calls

* TGASDK.TGA.UpdateUserState(string state)
	* This sets the state showing below student name in teacher dashboard. It also resets detailed state showing below this state, if there was any.
* TGASDK.TGA.UpdateUserState(string state, string detailedState)
	* This sets the state showing below student name in teacher dashboard and detailed state below it.
* TGASDK.TGA.UpdateUserStateDetailedOnly(string stateDetailed)
	* This sets the detailed state below main state and does not reset the main state. You can use this to for ex. Update round numbers or other live data happening in current state of your game.

You can keep the state update calls in your game and don’t need to check if user is logged in to TGA, we will automatically check inside the function calls if player is currently authenticated to TGA and send the state update only if so.

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

## Creatubbles
Creatubbles integration can be used to take a screenshot of the game and send it to TGA and Creatubbles web page. To use this feature the user needs to be logged in to TGA and the CreatubblesManager script needs to be attached to a gameobject as explained in the FIRST STEPS section.

### Usage
```csharp
/// Creatubbles
TGASDK.TGA.ScreenShotToCreatubbles();
```
To send a screenshot to TGA you can simply call TGASDK.TGA.ScreenShotToCreatubbles(). This will take a screenshot and open a UI that shows you the image that would be sent and where you can enter a description for the screenshot.
![Creatubbles UI](images/integrations/unitycsharp/image7.png "Creatubbles UI")

For example you can create a simple button to send the screenshot and show it in your in-game UI. There is a camera texture in the “TGA/Resources/Graphics/” folder that you can use with the button if you wish.

## Getting information
### General information
```csharp
// General information

// Call example: TGASDK.TGA.IsUserLoggedIn()

// Login information

// Returns true if logged into TGA, otherwise false.
bool IsUserLoggedIn()

// Returns true if logged into TGA via broadcast (TGA App), otherwise false.
bool LoggedInExternally()

// Returns the student ID used for login.
string GetStudentId()

// Returns the class ID used for login.
string GetClassId()
```
Here (on the right) are some functions you can use to get status information about TGA. All of these are static functions of TGASDK.TGA.

### Subscription information
```csharp
// Subscription information

// Returns true if game subscription has expired, otherwise false.
bool SubscriptionExpired()

// Returns the message that should be shown to user if the subscription has expired
string SubscriptionExpiredMessage()
```
These functions can be used to query if there is a valid subscription for the game. For testing the subscription, there are these two classes: Class h1xme never has subscription expired. Class h1xjr always has subscription expired. Both of these classes have student self-signup enabled so user can login with any studentid for testing.
