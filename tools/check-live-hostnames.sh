#!/usr/bin/env bash
set -euo pipefail

EXPECTED_APEX="https://mediumfeel.com/"
EXPECTED_WWW="https://www.mediumfeel.com/"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

fetch_headers() {
  curl --silent --show-error --max-redirs 0 --head "$1" 2>&1 | tr -d '\r' || true
}

apex_headers="$(fetch_headers "$EXPECTED_APEX")"
www_headers="$(fetch_headers "$EXPECTED_WWW")"

echo "$apex_headers" | grep -q '^HTTP/.* 200' || fail "Apex homepage must return HTTP 200"
echo "$www_headers" | grep -q '^HTTP/.* 301' || fail "www hostname must issue an HTTP 301 redirect"
echo "$www_headers" | grep -iq '^location: https://mediumfeel.com/$' || fail "www hostname must redirect to https://mediumfeel.com/"

apex_body="$(curl --silent --show-error "$EXPECTED_APEX")"
echo "$apex_body" | grep -q '<link rel="canonical" href="https://mediumfeel.com/">' || fail "Homepage canonical tag must point to the apex URL"

cert_details="$(echo | openssl s_client -connect www.mediumfeel.com:443 -servername www.mediumfeel.com 2>/dev/null | openssl x509 -noout -ext subjectAltName)"
echo "$cert_details" | grep -q 'DNS:mediumfeel.com' || fail "TLS certificate must cover mediumfeel.com"
echo "$cert_details" | grep -q 'DNS:www.mediumfeel.com' || fail "TLS certificate must cover www.mediumfeel.com"

echo "Live hostname checks passed."
