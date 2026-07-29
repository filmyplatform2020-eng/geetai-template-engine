# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> guide page loads
- Location: e2e/navigation.spec.ts:13:5

# Error details

```
Error: apiRequestContext.get: connect ECONNREFUSED ::1:3000
Call log:
  - → GET http://localhost:3000/guide/macbook-pro-16-m4
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.34 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br

```