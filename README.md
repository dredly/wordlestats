# wordlestats
A simple webapp that keeps track of your wordle results in local storage, so you don't need to make an account to view stats
## running locally
```make build-local && ./wordlestats_local```
## deploying
```make build-prod && scp wordlestats root@<droplet_ip_address>:/root/wordlestats```