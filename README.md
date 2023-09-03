
## Screenshots

![App Screenshot](https://github.com/JulianKoehler/Kanban-Board/blob/main/public/assets/preview.png?raw=true)


# Kanban Task Manager

This is my current and biggest private project, in which I invested by far the most time compared to all the other projects. The work is still in progress.

It is basically an application for managing tasks based on the Kanban concept. I learned really a lot along this project, which I started in March 2023, even before my first Job as a developer and am totally aware of the fact that some parts of the codebase may need some refactoring. WORK IN PROGRESS =)

What is currently possible:

* Creating your own user account with your protected boards
* Complete CRUD functionality for boards, columns, tasks and subtasks
* Select between dark and light theme

What is planned for the future:

* Collaboration: Giving other users permission to work on your boards
* Consequently searching for other users either with name or ID to add them to your boards
* Assign Tasks to specific users
* Dashboard Page for the user

## Tech Stack

**Client:** React (NextJS), Redux, TailwindCSS

**Server:** NextJS, Firebase

The data fetching is being managed by RTK Query since it offers a great package with all different kind of fetching states, caching and integration to an existing RTK Store.

Allthough I know that I would not need the NextJS API Routes per se, I wanted to separate concerns and created a seperate API Route for each task to perform. These endpoints are then reaching out to the actual firebase database.



## Demo

Insert gif or link to demo


## Deployment

Check out the live Version via the following Link:

https://kanban-board-jet.vercel.app/

Feel free to create your own account or use the following Demo User Account:

email: test@account.com

password: Welcome123


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

- Loading Skeleton UI
- Testing
- Animationen w/ Framer Motion


## Lessons Learned

The biggest thing that I learned is that bringing in a new big libgrary like RTK Query can have bigger consequences to the rest of your code as one might initially think. I gained a lot of performance and code quality but had to refactor a lot of code to make it work.

I also learned a lot about abstraction. There are situations where it makes sense to create resuable abstractions but there are also cases where code might look very similar but performas different logic.