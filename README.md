# Blogger

# Blogger Project Setup Guide

Welcome to the **Blogger** project! Follow the steps below to get the project running on your local machine and start contributing.

### 1. Clone the Repository

First, clone the project repository to your local machine. Open your terminal (Git Bash or any terminal you use) and run:

```bash
git clone https://github.com/Shivprasad-Solanke/Blogger.git
```

This will create a copy of the project folder on your computer.

### 2. Set Up Python Virtual Environment

After cloning the repository, navigate to the project folder:

```bash
cd Blogger
```

Next, create a Python virtual environment to manage dependencies:

```bash
python -m venv env
```

Activate the virtual environment:

- **Windows**:
    ```bash
    source env/Scripts/activate
    ```

- **Mac/Linux**:
    ```bash
    source env/bin/activate
    ```

You should now see `(env)` in your terminal, indicating that the virtual environment is activated.

### 3. Install Project Dependencies

Install the required dependencies listed in `requirements.txt`:

```bash
pip install -r requirements.txt
```

This will install all the necessary packages (like FastAPI and Uvicorn).

### 4. Create a New Branch

Before making any changes, it's important to create a new branch for your work. Run the following command to create a new branch based on the `main` branch:

```bash
git checkout -b <your-branch-name>
```

For example, if you’re working on the login page, you might name your branch `feature/login-page`:

```bash
git checkout -b feature/login-page
```

### 5. Make Changes

Now, you can start working on the project. Make your changes to the files as needed.

### 6. Stage and Commit Changes

After making changes, you need to **stage** and **commit** your changes:

- Stage your changes:

    ```bash
    git add .
    ```

    This stages all the changes. You can also stage specific files by replacing `.` with the file name.

- Commit your changes with a descriptive message:

    ```bash
    git commit -m "Added login page"
    ```

### 7. Push Your Branch

Once you've committed your changes, push the branch to GitHub:

```bash
git push -u origin <your-branch-name>
```

For example:

```bash
git push -u origin feature/login-page
```

### 8. Create a Pull Request (PR)

Go to the [GitHub repository](https://github.com/Shivprasad-Solanke/Blogger) and open a **Pull Request** to merge your changes into the `main` branch. Describe the changes you made and request a review from the team.

### 9. Pull Latest Changes

Before starting new work or when someone else has pushed changes, make sure to pull the latest changes from the `main` branch:

```bash
git checkout main
git pull origin main
```

Then, merge the latest `main` branch into your feature branch:

```bash
git checkout <your-branch-name>
git merge main
```

Resolve any conflicts if necessary.

### 10. Run the Development Server

Once the dependencies are installed, you can start the FastAPI server by running:

```bash
uvicorn main:app --reload
```

This will start the development server. You should see output indicating that the server is running on `http://127.0.0.1:8000`.

### 11. Open the Application

Open your web browser and go to:

```
http://127.0.0.1:8000
```

You should see the FastAPI documentation page. You can also access the interactive API docs at:

```
http://127.0.0.1:8000/docs
```

---

### Important Notes:
- Always **create a new branch** for each task or feature.
- **Pull the latest changes** from the main branch before starting work and regularly throughout the development process.
- Use **descriptive commit messages** for your changes.
- **Activate the virtual environment** when working on the project.
- If you add new packages, run:

    ```bash
    pip freeze > requirements.txt
    ```