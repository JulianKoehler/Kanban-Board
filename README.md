
## Screenshots

![App Screenshot](https://github.com/JulianKoehler/Kanban-Board/blob/main/public/assets/preview.png?raw=true)


# Kanban Task Manager

Check out the live Version via the following Link:

https://kanban-board-jet.vercel.app/

Feel free to create your own account or use the following Demo User Account:

email: test@account.com

password: Welcome123

This is my current and biggest portfolio project, in which I invested by far the most time compared to all the other projects. I am actively working on it in my free time to add more features and improve my skills.

It is an application for managing projects and tasks based on the Kanban concept. I learned really a lot along this project, which I started in March 2023, even before my first Job as a developer and did a big code refactoring lately.

What is currently possible:

* Creating your own user account with your protected boards
* Complete CRUD functionality for boards, columns, tasks and subtasks
* Select between dark and light theme
* Collaboration: Giving other users permission to work on your boards
* Consequently searching for other users either with name or ID to add them to your boards
* Assign Tasks to specific users

What is planned for the future:

* Comment Section within the Task Modal to communicate with other team members. Maybe even with a WebSocket.

Also checkout the Roadmap at the very bottom where I list my smaller updates planned to enhance the codebase and the existing features!

Known current limitations:

* At the moment this app might not work with Safari, if so please allow cross-site tracking for the cookie that bears your access token.


## Tech Stack

**Client:** TypeScript, React (NextJS), Redux, TailwindCSS

Currently the codebase is running on Next14 but still on pages Router. The plan is to switch to app Router and also refactor the code design, make the components way smaller and modular.
The data fetching is being managed by RTK Query since it offers a great package with all different kind of fetching states, caching and integration to an existing RTK Store.

**Server:** Python, fastAPI, Postgresql, SQLAlchemy as ORM

Finally I coded my very own backend system for this app. The results are amazing, even when having a huge board with lots of stages and tasks the loading time is reduced heavily. I realized that SQL is way more efficient in this case than trying to model relational data with NoSQL. Also I am able to connect the user data according to the requirements which was not possible with the Firestore.


## Deployment

**Client**
Vercel

**Server**
Linux VM Droplet on Digital Ocean,
Nginx as Reverse Proxy in combination with Cerbot for SSL communication


## Run Locally

Clone the project

```bash
  git clone https://github.com/JulianKoehler/Kanban-Board.git
```

Go to the project directory

```bash
  cd kanban
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


## Roadmap

- Providing a warning to the User when he wants to delete a stage since this will delete all tasks
- Task prioritie
- Implementing a blocked flag for a task when currently being edited by team member
- Unit tests for both frontend and backend


## Lessons Learned

The biggest thing that I learned is that bringing in a new big libgrary like RTK Query can have bigger consequences to the rest of your code as one might initially think. I gained a lot of performance and code quality but had to refactor a lot of code to make it work.

I also learned a lot about abstraction. There are situations where it makes sense to create resuable abstractions but there are also cases where code might look very similar but performas different logic.
