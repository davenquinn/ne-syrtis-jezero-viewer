vcl 4.1;

backend default {
    .host = "gateway";
    .port = "80";
}

# Remove all cookies from the request
# (this backend doesn't have access-controlled content)
sub vcl_recv {
    unset req.http.Cookie;

    return (hash);
}

sub vcl_deliver {
    # Add a header to indicate the response was served by Varnish
    set resp.http.X-Cache = "HIT";
}
