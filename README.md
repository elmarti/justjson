# Express JS Dynamic Routes

This project demonstrates a simple Express.js server with the capability to dynamically load routes based on a specified directory.

## Getting Started

To get started, you need to have Node.js and npm installed on your system.

## Installation

1. Clone the repository: `git clone https://github.com/yourusername/yourrepository.git`
2. Navigate into the directory: `cd yourrepository`
3. Install dependencies: `npm install`

## Usage

1. The server loads routes based on the folders in the specified directory (defaulting to 'routes').
2. For each route, you need a `data.json` file and an optional `config.json` file in the corresponding directory.
3. The `data.json` file contains the initial data for the route.
4. The `config.json` file can specify which HTTP methods (get, post, patch, delete) are enabled for the route and what field should be used as the id for PATCH and DELETE requests. If no config file is present, it defaults to enabling all methods and using 'id' as the id field.

Example structure of `data.json`:

```json
[
    {
        "id": "1",
        "name": "John Doe",
        "email": "john@example.com"
    },
    {
        "id": "2",
        "name": "Jane Doe",
        "email": "jane@example.com"
    }
]
```

Example structure of config.json:

```json
{
    "methods": ["get", "post", "patch", "delete"],
    "idField": "id"
}
```
Run the server: `npm start` or `yarn start`

The server will print out the registered routes on startup. You can access the routes on http://localhost:1234/{route}