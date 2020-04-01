# Hot&Cold (Server)

## Setup

Configure the following services:

- [Heroku](https://heroku.com/).
- [MapBox](https://www.mapbox.com/).
- [Cloudinary](https://cloudinary.com/).
- [PostgesSQL](https://www.postgresql.org/).
- [Twilio](https://www.twilio.com/).

You will need to add [PostGIS](https://postgis.net/install/) extension to PostgresSQL to enable geo spatial indexing and querying. On Heroku, the extension is already installed out of the box and you only need to enable it with `CREATE EXTENSION postgis;` (See [reference](https://devcenter.heroku.com/articles/postgis)).

Define environment variables in `.env` file (NEVER COMMIT):

    # Cloudinary API URL
    CLOUDINARY_URL
    # Database URL, template:
    # postgres://user:password@host:port/dbname
    DATABASE_URL
    # Access token given by MapBox's API
    MAPBOX_ACCESS_TOKEN
    # Auth secret for JWT
    AUTH_SECRET
    # Twilio account SID
    TWILIO_ACCOUNT_SID
    # Twilio auth token
    TWILIO_AUTH_TOKEN
    # Skip SMS messaging
    TWILIO_SKIP
    # One time passcode timeout in milliseconds
    OTP_TIMEOUT
    # Test phone number regexp for local testing
    # Will return the passcode with the response
    TEST_PHONE_LOCAL
    # Phone number regexp for testing with phone
    # Will send the passcode via a text message
    TEST_PHONE_SMS
    # Google Sheets client email
    SHEETS_CLIENT_EMAIL
    # Google Sheets private key. Use brackets (") for line skips with \n
    SHEETS_PRIVATE_KEY
    # Whitelist Google Sheet ID
    WHITELIST_SHEET_ID
    # Firebase-admin related credentials. See https://firebase.google.com/docs/reference/admin/node/admin.credential
    FIREBASE_PROJECT_ID
    FIREBASE_CLIENT_EMAIL
    FIREBASE_PRIVATE_KEY
    FIREBASE_DB_URL
    # Timeout for status location
    STATUS_LOCATION_TIMEOUT
    # Timeout for user location
    USER_LOCATION_TIMEOUT
    # The proximity of which user's details can be revealed to someone in meters
    DISCOVERY_DISTANCE
    # How long will authentication token last (in seconds)
    AUTH_TTL
    # *Optional: Server port. Defaults to 8000
    PORT
    # *Optional: Server host. Defaults to 0.0.0.0
    HOST

Alternatively, you can define these variables in Heroku's dashboard.

Install dependencies:

    $ yarn

In a new environment, migrate DB schema changes:

    $ yarn sequelize db:migrate

## Dev

Start the API:

    $ yarn start

Optionally, you can run the garbage collector on a second tab:

    $ yarn garbage-collect

## Test

To create test-data you can use the run seeder files in `src/seeders`:

    $ yarn sequelize db:seed --seed <filename>

## Prod

Push to Heroku and pray:

    $ git push heroku master
