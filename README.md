# 🐞 GitHub Issues & Workflow Guide

SyncScript follows a structured workflow using **GitHub Issues + Pull Requests (PRs)** to ensure clean code, easy collaboration, and proper testing.

---

## 🎯 Why We Use Issues

Instead of working randomly, we:

* Break the project into **small tasks**
* Assign tasks to team members
* Track progress easily
* Avoid conflicts and confusion

---

## 📌 What is a GitHub Issue?

An **Issue** is a task or feature.

Examples:

* Create login UI
* Design database schema
* Add API for vault creation
* Fix bug in annotation form

---

## 🧩 How to Create an Issue

1. Go to **GitHub Repo → Issues tab**
2. Click **New Issue**
3. Add:

### 📝 Title (Short & Clear)

Example:

```
Create Login Page UI
```

### 📄 Description (Explain task)

Example:

```
- Create login form using React
- Add email and password fields
- Add basic validation
- Connect UI later with backend
```

---

## 🏷️ Add Labels (Optional but Recommended)

You can create labels like:

* `frontend`
* `backend`
* `database`
* `bug`
* `enhancement`

---

## 👤 Assign the Issue

Assign it to a team member:

* Click **Assignees**
* Select person responsible

---

## 🔢 Use Small Tasks (VERY IMPORTANT)

❌ BAD:

```
Build entire frontend
```

✅ GOOD:

```
Create Navbar component
Create Login Page
Create Vault Dashboard UI
```

👉 Small tasks = Easy testing + fewer bugs

---

## 🔄 Complete Workflow (Step-by-Step)

### Clone (One time only)
* git clone https://github.com/Bilalnasir057558/SyncScript.git
* cd SyncScript

### 1️⃣ Pick an Issue

* Go to Issues tab
* Assign yourself OR take assigned task

---

### 2️⃣ Create a Branch

Branch name should match the issue:

```
git checkout -b feature/login-ui
```

---

### 3️⃣ Do Small Work Only

👉 Keep changes small and focused
👉 Do NOT solve multiple issues in one PR

---

### 4️⃣ Commit Changes

```
git add .
git commit -m "Added login page UI"
```

---

### 5️⃣ Push Branch

```
git push origin feature/login-ui
```

---

### 6️⃣ Create Pull Request (PR)

* Go to GitHub
* Click **Compare & Pull Request**

---

### ✍️ PR Title

```
Add Login Page UI
```

---

### 📄 PR Description (IMPORTANT)

```
Closes #5

What I did:
- Created login UI
- Added input validation

What to test:
- Check form layout
- Try empty inputs
```

👉 `Closes #5` automatically closes the issue after merge

---

### 7️⃣ Request Review

* Ask 1–2 teammates to review
* They will:

  * Approve OR
  * Suggest changes

---

### 8️⃣ Fix Feedback (if any)

```
git add .
git commit -m "Fixed validation issue"
git push
```

👉 PR updates automatically

---

### 9️⃣ Merge PR

After approval:

* Click **Merge**
* Issue will auto close

---

## 🧪 Testing Rule (VERY IMPORTANT)

Before approving PR:

✔ Run the project
✔ Check if feature works
✔ Ensure nothing is broken

---

## 📏 Team Rules (Must Follow)

✅ Always create an Issue before coding
✅ One Issue = One PR
✅ Keep PR small (max 1 feature)
✅ Always get at least 1 approval
✅ Never push directly to `main`

---

## 🚫 What NOT to Do

❌ Don’t push large code without PR
❌ Don’t mix multiple features in one PR
❌ Don’t ignore review comments
❌ Don’t work without creating an issue

---

## 🧠 Pro Tip (Important for Beginners)

If confused:

👉 First create Issue
👉 Then ask in group
👉 Then start coding

---

## 🏁 Example Workflow

1. Create Issue → "Create Vault API"
2. Create branch → `feature/vault-api`
3. Write code
4. Push
5. Create PR → "Add Vault API"
6. Get approval
7. Merge

---

This workflow ensures:
✔ Clean code
✔ Easy debugging
✔ Better teamwork
✔ Professional project structure
