# C++ SDK

## General

This document describes the specifics of integrating Teachergaming Desk to your game using the TGA C++ SDK. For general integration information and links to other SDK documents see the general SDK information.

## Requirements
Our current SDK requires a C++ compiler with C++ 11 support. It has been tested with Microsoft Visual (Studio) C++ 2015.

Optional: The SDK has builtin support for using libcurl (https://curl.haxx.se/libcurl/) or Unreal Engine's HTTP functionality for implementing the needed HTTP requests. There is also an interface you can override to provide your own implementation if you can't use either of those.

## First Steps

```cpp
// TGA SDK initialization examples

// Unreal Engine ------------
#include "TGAHTTPUnreal.hpp"
//...
	std::vector<std::string> parameters;
	// Get command line parameters
	std::string cmdLine(TCHAR_TO_UTF8(*FCommandLine::Get()));
	std::istringstream iss(cmdLine);
	std::copy(std::istream_iterator<std::string>(iss),
	std::istream_iterator<std::string>(),
	std::back_inserter(parameters));

	// Initialize TGA SDK
	TGASDKMyGame::Init(new TGAHTTPUnreal(), parameters);
// --------------------------

// Using libcurl ------------
#include "TGAHTTPlibcurl.hpp"
//...
	std::vector<std::string> parameters;
	// Get parameters
	if (argc > 1)
		for (int i = 1; i < argc; ++i)
			parameters.push_back(string(argv[i]));

	// Initialize TGA SDK
	TGASDKMyGame::Init(new TGAHTTPlibcurl(), parameters);
// --------------------------

// Using your own TGAHTTPImplementation implementation
#include "TGAHTTPForMyEngine.hpp"
//...
	std::vector<std::string> parameters;
	// Get parameters ...
	
	// Initialize TGA SDK
	TGASDKMyGame::Init(new TGAHTTPForMyEngine(), parameters);
// --------------------------
```

1. TeacherGaming will send you a .zip package with the latest SDK and assets.
2. Unzip to your location of choice (inside your project is ok).
3. Inside the package you will find the tgasdk directory that contains the SDK header files (.hpp).  Add it to your project’s include directories.
	* TGA SDK is a header only library, so there are no source code files that need to be compiled nor library files that need to be linked. All code is in the header files.
4. Prepare for making HTTP requests, choose one
	* If using Unreal Engine, enable exceptions for your project (add `bEnableExceptions = true;` to your ProjectName.Build.cs)
	* Install libcurl (https://curl.haxx.se/libcurl/) and add it to your project
	* Implement `TGAHTTPImplementation` yourself
5. Add a call to `TGASDK<yourgamenamehere>::Init(...)` to your game’s initialization code. 
	* As the first parameter, use one of these. Ownership is transferred to TGASDK.
		* `new TGAHTTPUnreal()` if using Unreal Engine
			* need to `#include "tgasdk/TGAHTTPUnreal.hpp"` first
		* `new TGAHTTPlibcurl()`
			* need to `#include "tgasdk/TGAHTTPlibcurl.hpp"` first
		* an instance your own implementation of `TGAHTTPImplementation`
			* #include your own implementation's header
	* As the second parameter give a list of the command line parameters your application was started with.
6. Add a call to `TGASDK<yourgamenamehere>::Cleanup()` to your game’s cleanup code.
 
## Notes

Your SDK file is called TGASDK&lt;yourgamenamehere&gt;.hpp. Class inside that file is called TGASDK&lt;yourgamenamehere&gt;. To improve readability, we have not added &lt;yourgamenamehere&gt; for each method call in this document, we are mentioning TGASDK and you should add your game name after each TGASDK call to make it correct.

## Student Login
Logging in can be done through the TeacherGaming app or in game. If users authenticate in game you will need to add a menu where user can type in a classid and a studentid. Authentication must be done before data can be sent.

### Automatically Logging in with TeacherGaming app
```cpp
// You need to supply command line parameters to the initializer for automatic login to work
std::vector<std::string> parameters;
// Get command line parameters and insert them to the vector
TGASDKMyGame::Init(new TGAHTTPlibcurl(), parameters); <- supply the parameters as parameter

// You can listen to login/logout events by implementing the TGASDK::TGA::LoginStatusChangeListener interface
class MyClassThatListensToLoginStatusChanges : public TGASDK::TGA::LoginStatusChangeListener
{
public:
	/// Override to listen for login status changes
	virtual void OnLoginStatusChanged(bool loggedIn)
	{
		// If loggedIn is true, the student has just logged in, if false, logged out.
		// NOTE! Calls to this function may (and usually do) happen in another thread.
	};

	void Initialize()
	{
		TGASDKMyGame::TGA::AddLoginStatusChangeListener(this);
	};

	void Destruct()
	{
		TGASDKMyGame::TGA::RemoveLoginStatusChangeListener(this);	
	};
};
```
For the automatic login system to work in the C++ SDK you need to supply the command line parameters when calling `TGASDK<yourgamenamehere>::Init(...)`.

Logging in via TeacerhGaming App is automatically handled by the SDK. You can use `TGASDK::TGA::AddLoginStatusChangeListener` to add listeners (that implement `TGASDK::LoginStatusChangeListener` inteface) to get notified when the login status changes. The callback gives you one boolean parameter that is true if a student logged in and false if the current student logged out. Remember to call `TGASDK::TGA::RemoveLoginStatusChangeListener` before your listener is deleted. Note that the listener can be (and usually is) called in another thread.

You can use the `TGASDK::TGA::LoggedInExternally()` function to check if the user logged in using the TeacherGaming App.

You can test the automatic login by giving your game a command line parameter of the following format.

`<your bundle identifier>://?classid=<class id>&studentid=<student id>&command=<login/logout>`

### Custom Login Menu

When the student has logged in via TG App, you should not give the user the option to logout or to login as a different student inside the game. Changing the student should only be done via the TG App in this case. It is good if you still have the UI to show the class and student ids. This can be the same UI you use to login inside the game just having the input fields and buttons in a disabled state disabled for example.

Here is an example of a TGA login UI (the built-in UI in the Unity SDK).

<img src="images/integrations/unitycsharp/image6.png"/>

```cpp
class LoginUI : public TGASDK::TGA::LoginStatusChangeListener
{
	void LoginButtonPressed(const string& classId, const string& studentId)
	{
		TGASDK::TGA::LoginAsync(classId, studentId);
	}
}
```
From your login menu you need to pass the class id and student id to the auth process. To do this simply call 

`static void TGASDK::TGA::LoginAsync(const std::string& classId, const std::string& studentId);`

Calling this function will start the login process in a new thread. Use `TGASDK::TGA::AddLoginStatusChangeListener` to add listeners (that implement `TGASDK::LoginStatusChangeListener` inteface) to get notified when the login process has finished. The callback gives you one boolean parameter that is true if a student logged successfully and false if the login failed or if the student logged out. Remember to call `TGASDK::TGA::RemoveLoginStatusChangeListener` before your listener is deleted. **Note that the listener can be (and usually is) called in another thread.**

## Sending Events
The events that have been defined in TGA website are generated to the SDK and can be used to send data from the game to TGA. All the events have their own inner class inside `TGA<yourgamename>`.Event with a member variable for each event parameter and functions to start and send the event.

### Sending events with duration
```cpp
// Start event
TGASDKMyGame::Event::MyEvent::Start();
...
// While event is going on update variables
TGASDKMyGame::Event::MyEvent::Current().countOfSomething += 5;
...
// Send event
TGASDKMyGame::Event::MyEvent::Send();
```
This is useful to start an event and send it to us when it’s ready. Our SDK automatically counts time from beginning to end and appends duration to sent data. You can also modify any additional data inside the event before you send it.
To start the event, call `TGASDK::Event::<EventName>::Start()`
Now you can gather all needed data for the event. You can change additional data inside the event before you send it. Any data for the started event can be changed using `TGASDK::Event::<EventName>::Current().<datavariable>`
To send the event, call `TGASDK::Event::<EventName>::Send()`

### Sending events without duration
```cpp
// Send an event immediately without tracking duration
TGASDKMyGame::Event::MyInstantaneousEvent::Send(5); // Event takes an integer parameter
```
You can call `GASDK::Event::<EventName>::Send(...)` with event data as parameters to send an event immediately, without tracking for duration.

## Updating state

Updating state can be done using one of three function calls

* `TGASDK::TGA::UpdateUserState(const std::string& state)`
	* This sets the state showing below student name in teacher dashboard. It also resets detailed state showing below this state, if there was any.
* `TGASDK::TGA::UpdateUserState(const std::string& state, const std::string& detailedState)`
	* This sets the state showing below student name in teacher dashboard and detailed state below it.
* `TGASDK::TGA::UpdateUserStateDetailedOnly(const std::string& stateDetailed)`
	* This sets the detailed state below main state and does not reset the main state. You can use this to for ex. Update round numbers or other live data happening in current state of your game.

You can keep the state update calls in your game and don’t need to check if user is logged in to TGA, we will automatically check inside the function calls if player is currently authenticated to TGA and send the state update only if so.

### State examples
```cpp
TGASDK::TGA::UpdateUserState("In Main Menu");
```
```cpp
TGASDK::TGA::UpdateUserState("In Settings Menu");
```
```cpp
TGASDK::TGA::UpdateUserState("Playing Singleplayer Game", "Tutorial Level 4");
```
```cpp
// When game begun
TGASDK:::TGA:::UpdateUserState("Playing Multiplayer Game");
// When round changed
TGASDK::TGA::UpdateUserStateDetailedOnly("Round 2");
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
Here (on the right) are some functions you can use to get status information about TGA. All of these are static functions of TGASDK::TGA.

### Subscription information
```csharp
// Subscription information

// Returns true if game subscription has expired, otherwise false.
bool SubscriptionExpired()

// Returns the message that should be shown to user if the subscription has expired
string SubscriptionExpiredMessage()
```
These functions can be used to query if there is a valid subscription for the game. For testing the subscription, there are these two classes: Class h1xme never has subscription expired. Class h1xjr always has subscription expired. Both of these classes have student self-signup enabled so user can login with any studentid for testing.