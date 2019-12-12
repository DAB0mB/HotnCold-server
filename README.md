# Hot&Cold (Server)

## Setup

Configure the following services:

- [Heroku](https://heroku.com/).
- [MapBox](https://www.mapbox.com/).
- [Cloudinary](https://cloudinary.com/).
- [PostgesSQL](https://www.postgresql.org/).

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
    # Milliseconds to wait before garbage collecting someone's location OR
    # the threshold of which a user is not considered as actively searching anymore
    ACTIVE_MS
    # *Optional: Server port. Defaults to 8000
    PORT
    # *Optional: Server host. Defaults to 0.0.0.0
    HOST

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
