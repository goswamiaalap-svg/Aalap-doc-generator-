# Authentication

The HGM-06 API uses JSON Web Tokens (JWT) for authentication. You must include your token in the `Authorization` header of every request.

## Obtaining a Token
You can generate a token from your developer dashboard. It is valid for 30 days.

## Example Usage

```javascript
fetch('https://api.hgm06.com/v1/resource', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE',
    'Content-Type': 'application/json'
  }
});
```

> **Warning:** Never expose your token in public repositories or client-side code without proper environment variable constraints.
