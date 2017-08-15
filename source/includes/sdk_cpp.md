# C++ SDK

## General

This document describes the specifics of integrating Teachergaming Desk to your game using the TGA C++ SDK. For general integration information and links to other SDK documents see the general SDK information.

## Requirements
Our current SDK requires a C++ compiler with C++ 11 support. It has been tested with Microsoft Visual (Studio) C++ 2015.

Optional: The SDK has builtin support for using libcurl (https://curl.haxx.se/libcurl/) or Unreal Engine's HTTP functionality for implementing the needed HTTP requests. There is also an interface you can override to provide your own implementation if you can't use either of those.

## First Steps

1. TeacherGaming will send you a .zip package with the latest SDK and assets.
2. Unzip to your location of choice (inside your project is ok).
3. Inside the package you will find the tgasdk directory that contains the SDK header files (.hpp).  Add it to your project’s include directories.
	* TGA SDK is a header only library, so there are no source code files that need to be compiled nor library files that need to be linked. All code is in the header files.
4. Prepare for making HTTP requests, choose one
	* If using Unreal Engine, enable exceptions for your project (add )
	* If you are using some other engine that has HTTP requests or otherwise want to use some other HTTP implementation, implement TGAHTTPImplementation using that
	* Otherwise, install libcurl (https://curl.haxx.se/libcurl/) and add it to your project
5. Add a call to TGASDK<yourgamenamehere>::Init(...) to your game’s initialization code. 
	* As the first parameter, use one of these
		* new TGAHTTPUnreal() if using Unreal Engine
			* need to #include "tgasdk/TGAHTTPUnreal.hpp" first
		* an instance your own implementation of TGAHTTPImplementation
		* new TGAHTTPlibcurl()
			* need to #include "tgasdk/TGAHTTPlibcurl.hpp" first
	* As the second parameter use a list of the command line parameters your application was started with.
6. Add a call to TGASDK<yourgamenamehere>::Cleanup() to your game’s cleanup code.


