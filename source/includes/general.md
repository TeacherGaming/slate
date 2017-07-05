# General

TeacherGaming Desk, our learning platform, aims to demystify the processes behind game-based learning. It aims to provide educators with an easily understandable way of tracking and assessing the learning that happens in-game.
 
In more technical terms, the analytics part of TeacherGaming Desk is a web-based platform that collects analytics information (events) sent by games and processes it to reveal what the students (users, players) have learned while playing the game. The SDK for integrating the analytics is called TGA SDK for short.
 
This document is written for game developers that are going to integrate TeacherGaming Desk analytics into their games. It describes on a general level how to do the integration. Integration can be done either by using a ready-made SDK for your platform, or by manually using the HTTP API. More detailed information is available in the specific documents for the different SDKs and the HTTP API documentation.

## Student Login

### Student ID and Class ID

Students are identified in TGA by their class and student ids. These are used instead of real names or similar in order to prevent outsiders (anyone except their teachers or parents etc.) from identifying individual students in the system. The class id is a system-wide unique generated alphanumeric identifier that identifies a group of students (usually a class). The student id is an alphanumeric identifier that is unique within a class, and is manually set either by a teacher in the web interface or by the student on first login if automatic generation of students has been allowed for that class.
 
TeacherGaming Desk analytics (TGA) requires the game to send a class id and a student id for each student playing the game to assign data to the right student. This means that students need to login before data can be sent, except for anonymous event data.
 
Logging in can be done through the TeacherGaming app (Android only at the moment) or in the game. If users authenticate in the game you will need to add a UI where the student can type in a class id and a student id.
 
You should not save the class and student id’s in your game. The student should need to login separately every time the app is started, either through the TG App or in the game UI.

## Creating UI for In-game Authentication

For manually logging in to TGA the student needs to be able to input a Class ID and a Student ID. A good place for this UI is for example in a settings menu, or somewhere in the main menu. Usually two input fields with OK and Cancel options is enough. You can also have a Logout button to logout of TGA. Both the Class ID and Student ID fields should be either lowercase or uppercase only, not mixed case. In the system the Class ID and Student ID are not case sensitive. Uppercase only can be used to make it easier for young children to type the ids.

### Login UI Examples

![Login Example 1](images/general/tga_login_1.png "Login Example 1")