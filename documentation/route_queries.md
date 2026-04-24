# Route Queries

Some routes offer additional behavior to a route when a `?` exists in the URL. These are called query string parameters or route queries. Route queries are used to modify the behavior of a route. Below are the available route queries.

## Devices

/devices.html

### Parameters

#### `?nodekey={nodekey of a pending device}`

When this parameter exists, it will automatically open the New Device form and pre-fill the Device Key input automatically. Everything right of the `=` is used as the value of the input.

 Below is an example of how to set up a redirect in NGINX from the default headscale /register/{nodekey} URL to utilize this parameter:

```nginx
    ...

    location /register/nodekey {
        # Ensure the target path matches your BASE_PATH setting (default: /webXui)
        rewrite ^/register/(.*)$ /webXui/devices.html?nodekey=$1 redirect;
    }

    # Ensure this location block matches your BASE_PATH setting (default: /webXui)
    location /webXui {

    ...
```
