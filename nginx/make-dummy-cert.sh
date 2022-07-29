openssl genrsa -out dummy.key 2048
openssl req -new -sha256 -key dummy.key -out dummy.csr
openssl req -x509 -sha256 -days 365 -key dummy.key -in dummy.csr -out dummy.crt
