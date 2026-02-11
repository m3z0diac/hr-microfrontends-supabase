# hr-microfrontends-supabase
A polyglot microfrontend architecture (React Host + Angular Remote) for HR management, powered by Supabase Auth &amp; DB.
=======
# HR System: Polyglot Microfrontends with Supabase

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Webpack](https://img.shields.io/badge/webpack-%238DD6F9.svg?style=for-the-badge&logo=webpack&logoColor=black)

> A proof-of-concept HR Dashboard demonstrating how to integrate **React** (Host) and **Angular** (Remote) using **Webpack Module Federation**, with a unified backend and authentication layer provided by **Supabase**.

## Key Features

* **Hybrid Architecture:** React Shell hosting an Angular Microfrontend seamlessly.
* **Unified Authentication:** Single Sign-On (SSO) experience. Log in via React, access data in Angular using the same Supabase session.
* **Role-Based Data:** Secure data access using PostgreSQL Row Level Security (RLS).
* **Domain:** * **Employees (React):** Management of employee profiles.
    * **Salaries (Angular):** Complex data grid for salary history and payments.

## Tech Stack

* **Host (Shell):** React 18
* **Remote A:** React (Employee Module)
* **Remote B:** Angular 16+ (Salary Module)
* **Orchestration:** Webpack 5 Module Federation
* **Backend:** Supabase (PostgreSQL, Auth, Auto-generated APIs)



## Commands to run

#### ```npm install```
#### ```npx nx serve employeeMfe --port=4205```
#### ```visit http://localhost:4200/```
=======
# hr-microfrontends-supabase
A polyglot microfrontend architecture (React Host + Angular Remote) for HR management, powered by Supabase Auth &amp; DB.

