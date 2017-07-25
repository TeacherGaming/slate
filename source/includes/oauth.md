# oAuth

Desk works as oAuth 2 identity provider server. To gain access to these features, please contact us to get your `client_id` and `client_secret` generated for you.

In a nutshell:

1. Request your `client_id` and `client_secret` from TeacherGaming
2. Redirect user to login URL as mentioned in section [Authorization](#authorization)
2. User gets redirected to your specified URL, you will get code as parameter. Call our [Token](#token) endpoint to exchange that code for token
3. Verify that token is correct and user is correct by calling our [Profile](#user-profile) endpoint.

## Authorization

We currently support authorization code flow. You will need to redirect the user to our request URL and pass the additional parameters.

> <span style="color: green">Example Succesfull Output</span>

```json
{
  "success": 1,
  "token": "yourAccessToken",
  "message": "Token created",
}
```

> <span style="color: red">Example Failed Output</span>

```json
{
  "success": 0,
  "message": "Code not found",
}
```

### Request

`GET https://analyticsdata.teachergaming.com/api/oauth/authorize`

### Query Parameters

Parameter | Default | Description
--------- | ------- | -----------
client_id |  | Your `client_id`.
redirect_uri |  | URL where client gets redirected after succesfull login. These are whitelisted by Teachergaming.
student_login | | Set to true to login as a student. Leave as empty if doing teacher login.
response_type | | only `code` allowed for now.

After succesfull login, user will be redirected back to your redirect_uri with code in GET query parameter. Use this code to fetch the token for the user as explained in section [Token](#token).

## Token

This can be used to exchange oauth code with token.

### Request

### Query Parameters

Parameter | Default | Description
--------- | ------- | -----------
client_id |  | Your `client_id`.
client_secret |  | Your `client_secret`.
student_login | | Set to true to login as a student. Leave as empty if doing teacher login.
code | | Code you got from us in the [Authorization](#Authorization) section.

## Revoking Token

## User Profile

