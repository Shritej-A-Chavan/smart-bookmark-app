# Smart Bookmark App

A simple and secure bookmark manager built with **Next.js** and **Supabase**.  
Users can sign in with Google and manage their own bookmarks with full database-level security.


## Features

- Google OAuth authentication
- Create, view, and delete bookmarks
- Secure Row Level Security (RLS)
- Optimistic UI updates
- Real-time support with graceful fallbacks
- Clean and minimal UI


## Problems Faced & How I Solved Them

This project involved working with **Supabase for the first time**, so several challenges came up during development. Below are the key problems I faced and how I solved them.

### Working with a New Stack Efficiently

**Challenge:**  
This was my first end-to-end project using Supabase alongside Next.js (App Router).

**Approach:**  
- Followed a **project-based learning style**, focusing only on concepts required to build each feature.
- Broke the application into small, manageable modules (authentication → bookmarks CRUD → realtime).
- Learned necessary concepts (sessions, RLS, policies, subscriptions) exactly when they were needed.
- Referred to official Supabase and Next.js documentation instead of making assumptions.
- Used AI-assisted tools to clarify unfamiliar concepts and accelerate understanding.
- Debugged issues by carefully reading logs and error messages before applying fixes.
- Tested each feature in isolation before integrating it into the full application.

This structured, requirement-driven approach helped me quickly adapt to a new stack while maintaining clarity, security, and code stability.


### Realtime Not Updating Immediately in Same Tab

**Problem:**  
After adding a new bookmark, it was saved successfully in the database, but it did not appear immediately in the UI.  
The new bookmark only showed up after refreshing the page or switching browser tabs.

**Root Cause:**  
Supabase Realtime does not always emit insert events instantly to the **same client session** that performs the insert.

**Solution:**  
Instead of relying only on Realtime, I implemented **optimistic UI updates**.

- After inserting a bookmark, I immediately updated the local state.
- Used Supabase’s returning feature to get the inserted row.
