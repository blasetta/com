# **App Name**: ComTech Hub Roma

## Core Features:

- User Authentication: User authentication via Google Sign-In with Firebase. On new user sign-up, a Firebase Cloud Function will create a user document in Firestore.
- Event Display: Display upcoming and past events. Events are queried from Firestore based on event date.
- Newsletter Subscription: Users can subscribe and unsubscribe from the newsletter via a settings toggle, stored in their user document in Firestore.
- Blog Display: Blog posts show a title, snippet, and link to an external website.
- Blog Management (CRUD): Admin can create, read, update, and delete blog posts. Data is stored in Firestore.
- Event Management (CRUD): Admin can create, read, update, and delete events. Data is stored in Firestore.
- Newsletter Creation & Sending: Admin writes the newsletter content and sends it. Content is saved to Firestore and a Cloud Function triggers an email service to send the newsletter to all users with mailAdmin is true.
- User Management: Admin can search users by email or displayName and update a user's role (user or admin). User data is stored in Firestore.

## Style Guidelines:

- Dark Mode Background: Charcoal (#1A1A1A). Light Mode Background: Off-white (#F5F5F7).
- Dark Mode Text: Light Gray (#EAEAEA). Light Mode Text: Dark Gray (#2C2C2C).
- Primary Accent: Terracotta (#E67E22) for buttons, links, and CTAs.
- Subtle Accent: Dark Mode Mid-Gray (#4A4A4A). Light Mode Light-Gray (#E0E0E0) for borders, dividers, and disabled states.
- Headings Font: 'Inter' (sans-serif) in bold weights.
- Body Text Font: 'Source Sans 3' (humanist).
- Cards will be used to display events and content, with sufficient spacing to avoid overcrowding.
- Primary buttons (e.g., Join, Subscribe) will have a solid terracotta background. Secondary buttons (e.g., Learn More) will be outlined or have a light gray background, all buttons include hover/press states.
- Use either Feather Icons or Tabler Icons for a consistent look.
- Use a consistent spacing system (multiples of 8px) for margins, padding, and positioning.