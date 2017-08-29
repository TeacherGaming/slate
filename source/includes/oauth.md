# oAuth

Desk works as oAuth 2 identity provider server. To gain access to these features, please contact us to get your `client_id` and `client_secret` generated for you.

In a nutshell:

1. Request your `client_id` and `client_secret` from TeacherGaming
2. Redirect user to login URL as mentioned in section `Authorization`
2. User gets redirected to your specified URL, you will get code as parameter. Call our `Token` endpoint to exchange that code for access token
3. Verify that access token is correct and user is correct by calling our `Profile` endpoint.

## Authorization

We currently support authorization code flow. You will need to redirect the user to our request URL and pass the additional parameters.

### Request Type

GET

### Url

`https://desk.teachergaming.com/api/oauth/authorize`

<aside class="notice">
Note that the domain here is different than most other API methods in the documentation. Make sure to copy the correct URL from here.
</aside>

### Parameters

Parameter | Description | Required
--------- | ------- | -----------
response_type | only `code` allowed for now. | **true**
client_id | Your `client_id`. | **true**
redirect_uri | URL where client gets redirected after succesfull login. These are whitelisted by Teachergaming. | **true**
student_login | Set to `true` to login as a student. No need to include this parameter if doing teacher login, or you can pass false. | false
switch_teacher_student_login | Set to `true` to allow switching between teacher and student logins. | false

### Response

```curl
// Example of address where user's browser gets redirected after succesfull login
https://yourRedirectUri.com?code=<yourcode>&is_teacher=<true|false>
```

After succesfull login, user will be redirected back to your redirect_uri with code in GET query parameter. Use this code to fetch the access token for the user as explained in section `Token`.

Key | Value
--- | -----
code | Code that can be exchanged for access token.
is_teacher | True if logged in as a teacher, otherwise false.

## Token

This endpoint can be used to exchange oauth code with access token.

### Request Type

GET

### Url

`https://analyticsdata.teachergaming.com/api/oauth/token`

### Parameters

Parameter | Description | Required
--------- | ------- | -----------
grant_type | Set to `authorization_code`. Required by oAuth standard. | **true**
code | Code you got from us in the `Authorization` section. | **true**
redirect_uri | Same redirect_uri used in `Authorization` section. | **true**
client_id | Your `client_id`. | **true**
client_secret | Your `client_secret`. | **true**

### Response

> <span style="color: green">Example Success Output</span>

```json
{
  "success": 1,
  "message": "Token created succesfully.",
  "responseCreatedAt": "2017-07-26T09:47:48.733Z",
  "access_token": "<YourToken>",
  "token_type": "bearer",
  "expires_in": 0,
  "service": "<ServiceName>"
}
```

> <span style="color: red">Example Failed Output</span>

```json
{
  "success": 0,
  "message": "Code not found."
}
```

Returns back the token that can be used to access rest of oAuth endpoints.

Key | Value
--- | -----
success | 1 for success, 0 for failure.
access_token | User's access token.
token_type | Type of token. Currently only bearer.
expires_in | Time when token expires. 0 means token does not expire.
service | Your service's name.

## User Profile

This endpoint returns information about the user. Requires valid token. This method is useful for verifying that the user information like email address is correct after getting token for a user.

### Request Type

GET

### Url

`https://analyticsdata.teachergaming.com/api/oauth/profile`

### Parameters

Parameter | Description | Required
--------- | ------- | -----------
access_token | User's access token | **true**

### Response

> <span style="color: green">Example Teacher Success Output</span>

```json
{
  "success": 1,
  "message": "Profile information fetched succesfully.",
  "responseCreatedAt": "2017-07-26T09:51:01.858Z",
  "isStudent": false,
  "teacher": {
      "first_name": "<first_name>",
      "last_name": "<last_name>",
      "email": "<email>",
      "unique_id": "<unique_id>"
  },
  "institution": {},
  "subscription": {
      "active": false,
      "expired": true
  }
}
```

> <span style="color: green">Example Student Success Output</span>

```json
{
  "success": 1,
  "message": "Profile information fetched succesfully.",
  "responseCreatedAt": "2017-07-26T09:51:01.858Z",
  "isStudent": true,
  "student": {
    "name": "<studentname>",
      "studentid": "<studentid>",
      "studentid_unique": "<studentid_unique>"
  },
  "class": {
      "class_name": "<classname>",
      "classid": "<classid>",
      "classid_unique": "<classid_unique>"
  },
  "subscription": {
      "active": true,
      "expired": false
  }
}
```

> <span style="color: red">Example Failed Output</span>

```json
{
  "success": 0,
  "message": "Access token not found.",
  "error": "invalid_request",
  "error_description": "Access token not found."
}
```

<aside class="notice">
Some values in this response are only available for teachers and some for students. See the role column for more information.
</aside>

Key | Value | Role
--- | ----- | -----
success | 1 for success, 0 for failure. | both
isStudent | true if this user is student, false otherwise. | both
subscription | Information if user currently has active subscription | both
teacher | Information about the teacher | teacher
institution | Information about the institution user is part of. Can be empty if user is not part of any institution. | teacher
student | Information about the student | student
class | Information about class the student is part of | student

## Classes

This endpoint returns the classes and students assosicated with the authorized teacher. Requires valid token. This method is useful for example for creating accounts for the students in your game.

### Request Type

GET

### Url

`https://analyticsdata.teachergaming.com/api/oauth/classes`

### Parameters

Parameter | Description | Required
--------- | ------- | -----------
access_token | User's access token. | **true**

### Response

> <span style="color: green">Example Classes Success Output</span>

```json
{
  "success": 1,
  "message": "Teachers classes information fetched succesfully.",
  "responseCreatedAt": "2017-08-28T14:43:51.572Z",
  "debug": {
    "container": "undefined",
    "host": "Tietokone-PC"
  },
  "classes": [
    {
      "classid": "<classid>",
      "classid_unique": "<uniqueclassid>",
      "class_name": "<classname>",
      "students": [
        {
          "studentid": "<studentid>",
          "studentid_unique": "<unique_studentid>"
        }
      ]
    }
  ]
}
```

> <span style="color: red">Example Failed Output</span>

```json
{
    "success": 0,
    "message": "Access token cannot be empty.",
    "error": "invalid_request",
    "error_description": "Access token cannot be empty."
}
```

Key | Value
--- | -----
success | 1 for success, 0 for failure.
message | Information about the request (f.e. error message)
debug | Debug information
classes | Teacher's classes (array of class json elements described below)

#### Class element

Key | Value
--- | -----
classid | Class id of the class. Student inputs this when logging in.
classid_unique | Unique id for the class. Can be used f.e. for databases. Does not change.
class_name | Name of the class
students | Students belonging to the class (array of class json elements described below)

#### Student element

Key | Value
--- | -----
studentid | Student id. Student inputs this and the class id when logging in.
studentid_unique | Unique id for the student. Can be used f.e. for databases. Does not change.

## Revoke Token

This endpoint can be used to revoke a token.

### Request Type

GET

### Url

`https://analyticsdata.teachergaming.com/api/oauth/revoke`

### Parameters

Parameter | Description | Required
--------- | ------- | -----------
access_token | User's access token. | **true**

### Response

> <span style="color: green">Example Success Output</span>

```json
{
  "success": 1,
  "message": "Token revoked succesfully.",
  "responseCreatedAt": "2017-07-26T10:03:45.218Z"
}
```

> <span style="color: red">Example Failed Output</span>

```json
{
  "success": 0,
  "message": "Access token not found.",
  "error": "invalid_request",
  "error_description": "Access token not found."
}
```

Key | Value
--- | -----
success | 1 for success, 0 for failure.


