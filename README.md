📌 Project Overview — MiniMinds
 </br> </br>
MiniMinds is a playful, kid-friendly learning platform that turns lessons into bite-sized videos, quick quizzes, and shiny gem rewards. It’s built to keep children engaged while giving admins simple tools to create and manage content.
Live: https://minimindsbd.netlify.app/ </br> </br>
 </br> </br>
🧩 Features (Client Side)
👦 Student </br> </br>
 </br> </br>
Register / Login (Firebase Auth) with email verification

Personalized profile with selectable avatar

Browse courses & lessons split into short video parts (YouTube embeds)

Quizzes with instant scoring and gem rewards (optimistic UI)

Gems counter in the navbar updates immediately after actions

Standings page for friendly competition

Games hub for quick brain breaks

Premium tracks for extra practice (gated content)
 </br> </br> </br>
🎁 Rewards & Gifting </br> </br>
 </br> </br>
Earn 1–2 gems based on quiz performance

Gift section to spend or showcase achievements
 </br> </br> </br>
🧭 Smooth UX </br> </br>

Mobile-first, colorful UI (Tailwind + DaisyUI)

SweetAlert2 for friendly, kid-centric dialogs

Swiper carousels for avatar selection
 </br> </br> </br>
🛠️ Admin </br> </br>
 </br> </br>
Create Lessons with multiple parts and 5+ quiz questions

Edit / remove parts & questions with confirmation flows

Admin Dashboard Overview: total users, total lessons

Secure role check (admin only endpoints)
 </br> </br> </br>
🛠 Tech Stack </br> </br>
 </br> </br>
Frontend: React + Vite, React Router, Tailwind CSS + DaisyUI, SweetAlert2, Swiper

State & Data: TanStack React Query (caching, optimistic updates), Context API

Auth: Firebase Authentication (ID tokens)

Backend: Node.js + Express, MongoDB

HTTP: Axios with a secure interceptor (auto-attaches Firebase ID token)

Media: ImgBB for profile image uploads
 </br> </br> </br>
🔄 Key Workflows </br> </br>
👦 Student Workflow </br> </br>
 </br> </br>
Sign up / log in with Firebase (email/password).

Pick an avatar, explore lessons, and watch short video parts.

Take the quiz → get instant score → gems update immediately in the navbar (optimistic cache update).

Track progress on Standings; explore Games and Premium content.
 </br> </br> </br>
🧑‍🏫 Admin Workflow </br> </br>
 </br> </br>
Log in (admin role).

Create lesson: set lesson heading, add parts (name + YouTube link), build quiz (A–D options + correct answer).

Save and publish. Dashboard auto-counts Total Users and Total Lessons.
 </br> </br> </br>
🖼️ Avatar Change Flow </br> </br>
 </br> </br>
Student opens Avatar page (Swiper carousel).

Click Add to update user image.

React Query invalidates the navbar’s user query → avatar swaps instantly.
 </br> </br> </br>
🔐 Security & Access </br> </br>
 </br> </br>
Protected endpoints verify Firebase ID token (Authorization: Bearer <token>).

Role guard on admin routes (verifyAdmin).

Public endpoints limited to harmless data (e.g., avatar catalog, lessons if intended public).

Minimal user data exposed on public GETs (e.g., img, role, gems only).
 </br> </br> </br>
✅ Highlights </br> </br>
 </br> </br>
Instant gem updates (optimistic UI + targeted cache updates)

Kid-friendly design, big tap targets, cheerful gradients

Clean admin tooling for rapid lesson & quiz authoring

Stable data fetching with React Query (polling where needed, no flicker)
