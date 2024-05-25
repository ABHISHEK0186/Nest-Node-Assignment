# Dynamic Form API with NestJS

This project is a NestJS application that dynamically creates tables in a PostgreSQL database based on user input. It also allows inserting data into these dynamically created tables and querying them.

## Features

- Dynamic table creation via `/form` post endpoint.
- Insert data into dynamically created tables via `/fill_data?form_title={value}` post endpoint.
- Retrieve data via `/fill_data?form_title={value}` get endpoint
- Input validation using class-validator.
- Error handling with appropriate HTTP status codes.

## Technologies Used

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [class-validator](https://github.com/typestack/class-validator)
- [Docker](https://www.docker.com/)

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ABHISHEK0186/Nest-Node-Assignment.git
   ```

2. Create a `.env` file at the root of your project and add postgres configurations to it:
   ```bash
   POSTGRES_USERNAME = "postgres"
   POSTGRES_PASSWORD = "hello@123"
   POSTGRES_DB = "bigohtech"
  ```

## Running the app

```bash
docker-compose up --build
```

## API endpoints

1. Create Form
   - URL: `/form`
   - Mehtod: `POST`
   - Request Body: 
    {
    "uniqueId": "uuid",
    "title" : "test3",
    "name" : "string",
    "email" : "email",
    "phoneNumber": "number",
    "isGraduate" : "boolean"
    }  
   - Response: 
     `201 Created` if the table is created successfully.
     `400 Bad Request` if the table already exists.
     `500 Internal Server Error` for other errors.  

2. Fill Form
   - URL: `/fill_data?form_title={value}`
   - Mehtod: `POST`
   - Request Body: 
    {
    "uniqueId": "2ef45e77-e632-4e56-816a-c09ea06095cb",
    "name" : "Abhishek",
    "email" : "ab@gmail.com",
    "phoneNumber": 7895665487 ,
    "isGraduate" : true
    } 
   - Response: 
     `201 Created` if the data is inserted successfully.
     `400 Bad Request` data validation errors.
     `404 Not Found` if the table(form) does not exists.
     `500 Internal Server Error` for other errors. 

3. Get Form Data
   - URL: `/fill_data?form_title={value}`
   - Mehtod: `GET`
   - Response: 
     `200 OK` for successful requests.
     `400 Bad Request` missing query parameter.
     `404 Not Found` if the table(form) does not exists.
     `500 Internal Server Error` for other errors.      


## Project Structure 
```bash
src
├── form
│   ├── form.controller.ts
│   ├── form.module.ts
│   └── form.service.ts
├── main.ts
└── app.module.ts
```

## Stay in touch

- Author - [Abhishek Vinayak](vinayak.abhishek11@gmail.com)



