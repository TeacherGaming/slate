# oAuth

Desk works as oAuth 2 identity provider server. To gain access to these features, please contact us to get your `client_id` and `client_secret` generated for you.

In a nutshell:

1. Request your `client_id` and `client_secret` from TeacherGaming
2. Redirect user to login URL as mentioned in section [Authorization](#authorization)
2. User gets redirected to your specified URL, you will get code as parameter. Call our [Token](#token) endpoint to exchange that code for token
3. Verify that token is correct and user is correct by calling our [Profile](#user-profile) endpoint.

## Authorization

We currently support authorization code flow. You will need to redirect the user to our request URL and pass the additional parameters.

### Request

`GET https://analyticsdata.teachergaming.com/api/oauth/authorize`

### Query Parameters

Parameter | Default | Description
--------- | ------- | -----------
client_id |  | Your `client_id`.
redirect_uri |  | URL where client gets redirected after succesfull login. These are whitelisted by Teachergaming.
student_login | | Set to `true` to login as a student. No need to include this parameter if doing teacher login.
switch_teacher_student_login | | Set to `true` to allow switching between teacher and student logins.
response_type | | only `code` allowed for now.

After succesfull login, user will be redirected back to your redirect_uri with code in GET query parameter. Use this code to fetch the token for the user as explained in section [Token](#token).

## Token

This endpoint can be used to exchange oauth code with token.

### Request

`GET https://analyticsdata.teachergaming.com/api/oauth/token`

### Query Parameters

> <span style="color: green">Example Success Output</span>

```json
{
  "success": 1,
  "message": "Token created succesfully.",
  "responseCreatedAt": "2017-07-26T09:47:48.733Z",
  "token": "<YourToken>",
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

Parameter | Default | Description
--------- | ------- | -----------
client_id |  | Your `client_id`.
client_secret |  | Your `client_secret`.
student_login | | Set to true if student. Do not include this parameter if teacher.
code | | Code you got from us in the [Authorization](#Authorization) section.

## User Profile

This endpoint returns information about the user. Requires valid token. This method is useful for verifying that the user information like email address is correct after getting token for a user.

### Request

`GET https://analyticsdata.teachergaming.com/api/oauth/profile`

### Query Parameters

> <span style="color: green">Example Success Output</span>

```json
{
  "success": 1,
  "message": "Profile information fetched succesfully.",
  "responseCreatedAt": "2017-07-26T09:51:01.858Z",
  "isStudent": false,
  "email": "<userEmail>"
}
```

> <span style="color: red">Example Failed Output</span>

```json
{
  "success": 0,
  "message": "Token not found."
}
```

Parameter | Default | Description
--------- | ------- | -----------
client_id |  | Your `client_id`.
client_secret |  | Your `client_secret`.
student_login | | Set to true if student. Do not include this parameter if teacher.
token | | Your token.

## Revoke Token

This endpoint can be used to revoke a token.

### Request

`GET https://analyticsdata.teachergaming.com/api/oauth/revoke`

### Query Parameters

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
  "message": "Token not found."
}
```

Parameter | Default | Description
--------- | ------- | -----------
client_id |  | Your `client_id`.
client_secret |  | Your `client_secret`.
student_login | | Set to true if student. Do not include this parameter if teacher.
token | | Your token.
