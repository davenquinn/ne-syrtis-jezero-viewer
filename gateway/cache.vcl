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

//sub vcl_cache {
//    # Only cache tiles marked as cacheable by the backend
//    if (bereq.url ~ "^/tiles/" && bereq.http.X-Cacheable) {
//        if (bereq.http.X-Cacheable == "true") {
//            return (pass);
//        }
//    }
//}

sub vcl_deliver {
    # Add a header to indicate the response was served by Varnish
    set resp.http.X-Cache = "HIT";
}
