# Lumix
Art website

### Get Started
- Install Docker Compose if you do not already have it.
- Set your environment variables in `.env`. This assumes your server only uses *one* domain.
    - `APP_ENV`: `dev` or `production`.
    - `CERT_DOMAIN`: Set this to your domain name.
    - `CERT_EMAIL`: The email your TLS certficiate will be registered with.
- Create the file `web/node/keys.js`, and fill in your Google API Client ID and Client Secret in it. To get those:
    1. Go to the [APIs section of GCP](https://console.cloud.google.com/apis/credentials) and create a project, then select it.
    2. Click "Create credentials" and "OAuth client ID".
    3. The Application type should be Web application. Now add your Authorized redirect URIs. Add `http://localhost/auth/google/callback` for local development and add another one for production, replacing `localhost` with your own domain name and `http` with `https`.
    4. Press "Create", and you'll be presented with your client ID and secret.

    Your keys.js file should have this format:
    ```javascript
    module.exports = {
        google: {
            clientID: "",
            clientSecret: "",
        }
    }
    ```

### Usage
- Register TLS certificate: `docker-compose -f docker-compose-extras.yml up letsencrypt-init`.
- Renew TLS certificate: `docker-compose -f docker-compose-extras.yml up letsencrypt-renew`.
- Start server: `docker-compose up`.
