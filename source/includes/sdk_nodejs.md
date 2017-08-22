# Node.js SDK

Analytics sdk integration instructions for node.js based web applications.

## First Steps
```javascript
// Require example
var TG = require(“./TGASDK<gamename>.js”);
```
1. TeacherGaming will send you a `TGASDK<gamename>.zip` archive.
2. Copy the following files to their respective folders:
	* tgnodejs-client.min.js <client side>
	* tgnodejs.min.css <stylesheet for the dialog>
	* TGASDK<gamename>.js <server side>
3. Link/require each file wherever you are going to use them
4. Install the cookies node module with following command: 
	* `npm install cookies`
	* You also need to require the cookies node module in the same file where your /tgapi route will exist

## Student Login/Logout
As TeacherGaming Desk analytics (TGA) requires the game to send a Class ID and a Student ID for each user playing the game to assign data for right user, users need to login before data can be sent.

Logging in can be done through the TeacherGaming App (TG App) or in game. If users authenticate in game you will need to add a button which will open a login dialog.

### Automatically Logging in with TG App
```url
Example: 

https://<origin>?classid=example&studentid=example
```
Client side of the SDK handles the automatic login completely so you don’t need to do anything else except ensure that client side code has been required on client side. TG App will send Class ID and Student ID as url parameters.


### Manual Login/Logout
Manual login is secondary option for students that didn’t login through TG App. Client side code has a login dialog. You need to create a button that calls the following function when clicked:

`TG.createDialog();`

This will show up the dialog to user. It will show either login fields if user is not logged in or info page with logout button if user is logged in.

#### Validating login/logout

Server side of the SDK will validate login/logout and send it to TGA. You will however need to pass the login/logout parameters to the server side of the SDK through a route. You will also need to pass the response from the login/logout back to the client side inside the callback.

#### Route Example
Example is done in Meteor-framework.

```javascript
Router.route('tgapi', function(req, res) {
	var cookies = new Cookies(req, res);

	TG[*action parameter*](*query parameters obj*, cookies, function(response) {
		// WRITEHEAD
		// SEND RESPONSE
	});
});
```

#### Cookies
```javascript
var cookies = new Cookies(req, res);
```
This SDK uses cookies node module to store credentials. These cookies will expire in 48hrs. *To enable the cookies you need to create new cookies instance inside the tgapi/ and pass it to the functions. You need to pass the routes request and response to the cookies instance.*

#### Client side
Client side will pass the Class ID and Student ID as url parameters to tgapi/ route which you will need to catch. 

Client will send parameters from dialog to following url: 
`<origin>/tgapi?action=login&classid=<classid>&studentid=<studentid>`

## Sending Events (client only)
The events that have been defined in TGA website are generated to the SDK and can be used to send data from the game to TGA. 

### Sending Events with Duration
```javascript
// Examples:

// Start:
TG.exampleEvent.start();

// Send:
TG.exampleEvent.send(param1, param2);
```
This is useful to start an event and send it to TeacherGaming Desk when it’s ready. Our SDK automatically counts time from beginning to end and appends duration to sent data. When sending the event you need to pass the needed parameters to the function, otherwise it will throw an error and no event will be sent.
To start the event, call `TG.<EventName>.start()`
Now you can gather all needed data for the event. 
To send the event, call `TG.<EventName>.send(*data parameters*)`

### Sending Events without Duration
If event is something which you cannot track duration of just call `TG.<EventName>.send()` with the parameters.

## Updating State (client only)

See [2.4. UPDATING STATE](#updating-state2.4.).

Updating state can be done using the following function:
`TG.updateState(“state”, detailed);`

The detailed-parameter is a boolean. 

If it is set to false, function sets the state showing below student name in teacher dashboard. It also resets detailed state showing below this state, if there was any.

If set to true, function sets the detailed state that shows below basic state

You can keep the state update calls in your game and don’t need to check if user is logged in to TGA, we will automatically check inside the function calls if player is currently authenticated to TGA and send the state update only if so.

### State examples
```javascript
TG.updateState("In Main Menu", false);
```
```javascript
TG.updateState("In Settings Menu", false);
```
```javascript
TG.updateState("Playing Singleplayer Game", false);
TG.updateState("Tutorial Level 4", true);
```
```javascript
// When game begun
TG.updateState("Playing Multiplayer Game", false);
// When round changed
TG.updateState("Round 2", true);
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



