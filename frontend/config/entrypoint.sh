#!/usr/bin/env sh
set -eu

export APITOOL_SERVER_HOST="${APITOOL_SERVER_HOST:=server}"
export APITOOL_SERVER_USER="${APITOOL_SERVER_USER:=root}"
VARS_TO_SUBSTITUTE='$APITOOL_SERVER_HOST:$APITOOL_SERVER_USER'

envsubst "${VARS_TO_SUBSTITUTE}" < /etc/openresty/nginx.conf.template > /etc/openresty/nginx.conf

if [ ! -f /etc/fallback-certs/resty-auto-ssl-fallback.crt ]; then
  openssl req -new -newkey rsa:2048 -days 3650 -nodes -x509 \
    -subj '/CN=sni-support-required-for-valid-ssl' \
    -keyout /etc/fallback-certs/resty-auto-ssl-fallback.key \
    -out /etc/fallback-certs/resty-auto-ssl-fallback.crt
fi

exec "$@"
