# Android Java SDK

This document describes the specifics of integrating TeacherGaming Desk to your game using the TGA Android Java SDK. For general integration information and links to other SDK documents see the general SDK instructions.

## First Steps
TeacherGaming will send you a `TGASDK<gamename>.java` file. Copy the `TGASDK<gamename>.java` file to your project’s `src/com/teachergaming/tga` folder. Updating the SDK can be done by simply replacing the old SDK file with new one.

## Notes
Your SDK file is called `TGASDK<gamename>.java`. Class inside that file is called `TGASDK<gamename>`. To improve readability, we have not added &lt;gamename&gt; for each method call in this document, we are mentioning TGASDK and you should add your game name after each TGASDK call to make it correct.

## Student Login

### Automatically Logging in with TeacherGaming App
For the automatic login to work correctly you need to pass the intent received in your main activity’s onCreate function to the SDK by calling

`TGASDKSwitchGlitch.TGA.HandleIntent(getIntent());

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


// Interface
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

