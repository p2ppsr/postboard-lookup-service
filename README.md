# Postboard Lookup Service

Provides a lookup service for Postboard tokens.

## Usage

This example configures the lookup service with its built-in Knex storage engine.

```js
const Confederacy = require('confederacy')
const PostboardLookup = require('postboard-lookup-service')

// Define your knexfile, either by requiring it...
const knexfile = require('../location/of/knexfile.js')
// ...or by defining it directly
const knexfile = { // See the Example Knexfiles section
  client: 'sqlite3',
  connection: {
    // ...
  }
  // ...
}

const knex = require('knex')(knexfile)

const confederacy = new Confederacy({
  managers: {
    // ...
  },
  lookupServices: {
    Postboard: new PostboardLookup({
      storageEngine: new PostboardLookup.KnexStorageEngine({
        knex
      })
    })
  }
})
```

## 🔶 Create Your Migration

You will also need to create a new database migration in your application to allow the storage engine to create its table before use. Point your Knexfile to a directory in your source code where you will store your application's database migrations, if you do not have one already. Normally, this can just be src/migrations. Create a new knex database migration file with the following contents in your codebase:

```js
// src/migrations/yyyy-mm-dd-001-add-uhrp-lookup.js
const PostboardLookup = require('postboard-lookup')
const engine = new PostboardLookup.KnexStorageEngine({
  knex
})

exports.up = async knex => {
  await engine.migrations[0].up(knex) // This sets up the UHRP service
}

exports.down = async knex => {
  await engine.migrations[0].down(knex) // This tears down the UHRP service
}
```

## Example Knexfiles

Use these example knexfiles to connect to various database engines

### mysql

```js
{
  client: 'mysql',
  connection: {
    host: '10.0.0.1',
    port: 3306,
    user: 'user',
    password: 'changeme',
    database: 'example'
  },
  useNullAsDefault: true,
  migrations: {
    directory: './path/to/migrations'
  }
}
```

### sqlite3 (so you can store headers in a local file)

```js
{
  client: 'sqlite3',
  connection: {
    filename: './path/to/database.sqlite'
  },
  useNullAsDefault: true,
  migrations: {
    directory: './path/to/migrations'
  }
}
```

