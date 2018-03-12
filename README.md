# Lumix
Art website

### Get Started
- Install Docker Compose if you do not already have it.
- Set your environment variables in `.env`. This assumes your server only uses *one* domain.
    - `APP_ENV`: `dev` or `production`.
    - `CERT_DOMAIN`: Set this to your domain name.
    - `CERT_EMAIL`: The email your TLS certficiate will be registered with.
- Create the file `web/node/keys.js`, that looks like this:
    ```javascript
    module.exports = {
        passportSessionStoreSecret: "",
    }
    ```

### Usage
- Register TLS certificate: `docker-compose -f docker-compose-extras.yml up letsencrypt-init`.
- Renew TLS certificate: `docker-compose -f docker-compose-extras.yml up letsencrypt-renew`.
- Start server: `docker-compose up`.
