# TeacherGaming Desk

The TeacherGaming Desk is a classroom toolbox designed to make game-based learning accessible to everyone.  It combinines a portfolio of games with pedagogical support and real-time analytics.

From a technical point of view TeacherGaming Desk is made of three things.

<img src="https://lh3.googleusercontent.com/k-mq_EkwgTnbG4lFdZVd6R5B0yznujjWrO3jy-kQVAmoV-vWK6aFtKain9lA-_6KAWLhTUgRc8umatc=w1920-h901-rw"/>

1. TeacherGaming App ([https://app.teachergaming.com/](https://app.teachergaming.com/)) that is installed on student devices. TeacherGaming App is used to
	* Download games
	* Launch games
		* with automatic TeacherGaming Desk student login
			* User logs into TeacherGaming App. Login is passed on to the game when lauched.
	* Notify students when the Teacher starts a lesson
2. Games with TeacherGaming Desk integration (TGA SDK)
	* Log in using TeacherGaming Desk student id and class id
		* Can be used for license check (DRM)
	* Send analytics to TeacherGaming Desk
	* Send screenshots and other creations to Creatubbles
3. A web based platform (called TeacherGaming Desk) ( [https://desk.teachergaming.com](https://desk.teachergaming.com) ) for teachers, administrators, game developers and TeacherGaming that implements the following functionalities for its users.
	* Teachers
		* Lesson plans for using games in education
		* Analytics information about student skill progress and real-time information about what students are doing in a game
		* Viewing screenshots and other creations students send to Creatubbles
		* Managing students and classes
	* Administrators
		* Manage subscriptions
		* Manage teachers
	* Game developers
		* Provide oAuth single sign on support for using the TeacherGaming Desk login in other web based applications
		* HTTP API for sending analytics and otherwise integrating to TeacherGaming desk (when not using a ready-made SDK)
	* TeacherGaming
		* Manage games and their information
		* Define the analytics for a game by managing skills, events and activities
		* Generate SDKs for games
		* Create lessons for gamesä
		

