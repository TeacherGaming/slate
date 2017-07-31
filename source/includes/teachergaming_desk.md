# TeacherGaming Desk

This documentation covers the technical details needed by developers aiming to integrate TeacherGaming Desk in their games or other applications.

The TeacherGaming Desk is a classroom toolbox designed to make game-based learning accessible to everyone.  It combinines a portfolio of games with pedagogical support and real-time analytics.

From a technical point of view TeacherGaming Desk is made of three things.

1. A web based platform ( [https://desk.teachergaming.com](https://desk.teachergaming.com) ) for teachers, administrators and game developers called Teachergaming Desk that implements the following functionalities for its users.
	* Teachers
		* Lesson plans for using games in education
		* Analytics information about student skill progress and real-time information about what students are doing in a game
		* Managing students and classes
		* Viewing screenshots and other creations students send to Creatubbles
	* Administrators
		* Manage subscriptions
		* Manage teachers
	* Developers
		* Manage games and their information
		* Define the analytics for a game by managing skills, events and activities
		* Generate SDKs for games
		* Create lessons for games
		* Provide oAuth single sign on support for using the TeacherGaming Desk login in other web based applications
2. TeacherGaming App ( [Android](https://play.google.com/store/apps/details?id=com.teachergaming.com), [iOS](https://itunes.apple.com/us/app/teachergaming/id1221257680) )
	* Download games
	* Launch games
		* with automatic TeacherGaming Desk student login
3. Games with TeacherGaming Desk integration
	* Send analytics to TeacherGaming Desk
	* Send screenshots and other creations to Creatubbles

