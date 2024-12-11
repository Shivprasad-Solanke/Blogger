# Blogger Project Setup Guide

Welcome to the **Blogger** project! Follow these steps to set up the project on your local machine and start contributing effectively.

---

### 1. Clone the Repository

Clone the project repository to your local machine. Open your terminal (Git Bash or any terminal you use) and run:

```bash
git clone https://github.com/Shivprasad-Solanke/Blogger.git
```

This will create a copy of the project folder on your computer.

---

### 2. Set Up Python Virtual Environment

Navigate to the project folder:

```bash
cd Blogger
```

Create a Python virtual environment to manage dependencies:

```bash
python -m venv env
```

Activate the virtual environment:

- **Windows**:
    ```bash
    .\env\Scripts\Activate
    ```

- **Mac/Linux**:
    ```bash
    source env/bin/activate
    ```

You should now see `(env)` in your terminal, indicating that the virtual environment is activated.

---

### 3. Install Project Dependencies

With the virtual environment activated, install all necessary packages:

```bash
pip install -r requirements.txt
```

This will install FastAPI, Uvicorn, and other required libraries.

---

### 4. Create a New Branch

To work independently and avoid conflicts, create a new branch for your task:

```bash
git checkout -b feature/<your-feature-name>
```

Example:
```bash
git checkout -b feature/dashboard
```

---

### 5. Start Your Work

#### Dashboard Task for Team Leader:
- Navigate to the **`app/dashboard`** folder.
- Open `dashboard.py` to define your routes.
- Edit the `dashboard.html` template located in `app/dashboard/templates/`.

For reference:

- The Dashboard should:
  - Display the user’s blogs with options to **Edit** or **Delete**.
  - Include a "Create Blog" button that redirects to a blog creation form.

#### Other Team Members:

1. Check your assigned folder (`login_signup` or `blog`) inside `app/`.
2. Open and edit the respective `.py` file to define backend routes.
3. Modify the HTML templates in the `templates/` folder within your assigned module.

---

### 6. Run the Development Server

To verify the project setup and test your routes, start the server:

```bash
uvicorn app.main:app --reload
```

- Open a browser and go to `http://127.0.0.1:8000`.
- Verify that the application loads correctly.
- Check the interactive API documentation at `http://127.0.0.1:8000/docs`.

---

### 7. Save and Commit Your Work

Once you’ve completed your task:

1. **Stage your changes**:
   ```bash
   git add .
   ```

2. **Commit your changes** with a descriptive message:
   ```bash
   git commit -m "Implemented Dashboard with Edit and Delete functionality"
   ```

3. **Push your branch** to the repository:
   ```bash
   git push -u origin feature/dashboard
   ```

---

### 8. Submit a Pull Request (PR)

1. Go to the [GitHub repository](https://github.com/Shivprasad-Solanke/Blogger).
2. Create a Pull Request (PR) to merge your branch into the `main` branch.
3. Add a clear description of the changes you made.
4. Request a review from the team leader or other members.

---

### 9. Pull Latest Changes

Before starting a new task or when notified of updates, pull the latest changes:

1. Switch to the `main` branch:
   ```bash
   git checkout main
   ```

2. Pull the latest updates:
   ```bash
   git pull origin main
   ```

3. Merge the latest changes into your branch:
   ```bash
   git checkout <your-branch-name>
   git merge main
   ```

Resolve any conflicts if necessary.

---

### Final Notes:
- Always activate your virtual environment when working on the project.
- Regularly push your changes to ensure work isn’t lost.
- Coordinate with team members to avoid duplication.