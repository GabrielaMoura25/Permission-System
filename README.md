# Permission-System Project

The Permission-System is a full-stack web application built with [Vite](https://vitejs.dev/), [Prisma](https://www.prisma.io/), [MongoDB](https://www.mongodb.com/), [Node.js](https://nodejs.org/), [Fastify](https://www.fastify.io/) and [TypeScript](https://www.typescriptlang.org/). It provides an efficient development experience and utilizes the latest technologies to ensure high performance. It enables users to manage and view details of their profiles.

## Languages and Frameworks

### Frontend:

- <span style="color: #5e83b3">Vite</span>: The frontend is developed using Vite, a modern framework for building web applications with React.

- <span style="color: #5e83b3">React</span>: React is used for creating interactive and efficient user interfaces.

### Backend:

- <span style="color: #5e83b3">Fastify</span>: Fastify is a lightweight and efficient web framework for Node.js. It is used to create the backend of the application.

- <span style="color: #5e83b3">Node.js</span>: Node.js is the execution platform for server-side JavaScript.

- <span style="color: #5e83b3">Prisma</span>: Prisma is an Object-Relational Mapping (ORM) tool that facilitates interaction with databases. In this project, it is configured to connect to MongoDB.

- <span style="color: #5e83b3">MongoDB</span>: A NoSQL database that offers scalability and flexibility. Prisma is configured to work with MongoDB.
 
## Features and Functionalities

## Basic HTTP Authentication:

The application uses basic HTTP authentication to ensure security in requests.

## Unit Testing:

Unit tests are implemented to ensure code robustness. They can be executed using the `npm test` command in the frontend or backend directory.

## Installation

Make sure you have Node.js and npm installed on your system.

## Configuration and Execution

1. Clone the Repository:

```bash
git clone https://github.com/GabrielaMoura25/Permission-System.git
or
git clone git@github.com:GabrielaMoura25/Permission-System.git
 
cd Permission-System
```

2. Install Dependencies:

- Frontend Configuration:

```bash
cd frontend
npm install
```

- Backend Configuration:

```bash
cd backend
npm install
```

3. Start the Frontend and Backend:

- Frontend:

```bash
cd frontend
npm run dev
```

- Backend: Uses Prisma to interact with MongoDB. Here are the steps to initialize and populate the database:

```bash
cd backend
npm run dev
```

- The application will be available at http://localhost:5173.

## Testing

Run tests using the following command:

```bash
cd frontend # or cd backend
npm test
```
## Important

- Remember that to perform searches on the site, you must use the emails registered in the database.
- Data is already registered in the `prisma/seeds.ts` file.

## Populating the Database

To add more data to the database, you can edit the `prisma/seeds.ts` file with the desired data and then run the command:

```bash
npm run dev
```
This will ensure that the data is updated in the database.

Keep in mind that this application uses basic HTTP authentication. To make direct queries to the database, you can use tools such as Postman, Insomnia, NoSQL, or access MongoDB Atlas.

#### I hope you enjoy working with the project!
