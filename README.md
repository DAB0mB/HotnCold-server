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
    # Firebase-admin related credentials. See https://firebase.google.com/docs/reference/admin/node/admin.credential
    FIREBASE_PROJECT_ID
    FIREBASE_CLIENT_EMAIL
    FIREBASE_PRIVATE_KEY
    FIREBASE_DB_URL
    # How long a status chat is gonna live once created
    STATUS_TTL
    # How long will authentication token last (in seconds)
    AUTH_TTL
    # An extra margin to subtract from queries which run against the status expiration date (ms). Higher value will result in more statuses.
    STATUS_EXPR_MARGIN
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

## Test

To create test-data you can use the run seeder files in `src/seeders`:

    $ yarn sequelize db:seed --seed <filename>

## Prod

Push to Heroku and pray:

    $ git push heroku master
