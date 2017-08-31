## Generate Public/Private Keys


#### Generate the keys, do not enter password
```sh
ssh-keygen -t rsa -b 2048 -f file_private
```

**output:**

*file_private*

*file_private.pub*


#### Convert to PEM

```sh
openssl rsa -in file_private -pubout -outform PEM -out file_private.pem
```
