Product Requirements Document (PRD): arte.coffee
1. Executive Summary
arte.coffee is a premium, award-winning digital platform designed as a sanctuary for creative therapy and artistic workshops. The website embodies the tagline "Terapi Seni Kreatif: Menenangkan Pikiran Sambil Berkarya," positioning itself as the premier destination for individuals seeking mental wellness through artistic expression. Targeting all age groups, the platform bridges traditional art forms with modern digital experience, offering workshops ranging from Batik (using the Gutta Tamarind method) and Pottery to contemporary crafts like Punch Needle and Journaling.

2. Vision & Strategic Objectives
Immersive Experience: Create a digital environment that feels like an art studio, utilizing cutting-edge web technologies to evoke creativity and calmness.

Seamless Ecosystem: Provide a frictionless user journey from discovering a workshop to registering, paying, and attending.

Award-Winning Standards: Achieve design excellence recognized by platforms like Awwwards by pushing the boundaries of UI/UX and animation with Three.js and GSAP.

3. Technical Architecture
3.1 Tech Stack
Category	Technology	Justification
Frontend Framework	Vite + React/Vue.js	Lightning-fast build times and hot module replacement. React/Vue provides a robust component-based architecture.
Backend / CMS	InsForge.dev	Chosen as the backend to manage dynamic content, workshop schedules, and user authentication efficiently.
Animation Engine	GSAP (GreenSock)	Industry standard for high-performance animations and seamless transitions (ScrollTrigger, Flip, SplitText). Essential for "award-winning" feel.
3D Rendering	Three.js	For immersive 3D environments, interactive particle systems, and WebGL visual effects.
Smooth Scrolling	Lenis	Enhances the perceived smoothness of the site, critical for artistic portfolios.
State Management	Zustand / Pinia	Lightweight state management for shared interaction states (pointer position, scroll progress, scene state).
4. Core Features & Functional Requirements
4.1 Visual & Artistic Design
3D Interactive World: A persistent Three.js scene that represents a "digital studio." Models (e.g., a ceramic pot, a floating batik canting, an art brush) should be rendered with hand-drawn textures to create a warm, handcrafted feel.

Portal Effect: Utilize the "MeshPortal" technique to render 3D objects inside specific bounded areas (e.g., "Screens") on the homepage, blending DOM content with WebGL.

Shader Effects: Implement custom GLSL shaders for dithering effects on workshop images to give them a unique, creative "artistic" filter.

Adaptive Theme: The 3D scene and UI should shift subtly between "Light/Dark" modes or color palettes to reflect the calming nature of the workshops (e.g., warm earth tones for pottery, vibrant hues for tie-dye).

4.2 User-Facing Interfaces
4.2.1 Landing Page (The Studio)
Hero Section: Full-screen 3D scene using Three.js (e.g., floating art tools) with typography animated by GSAP SplitText.

Workshop Categories: Visually presented as interactive 3D tiles or a dynamic grid. Hover effects should trigger GSAP animations and Three.js particle bursts.

"Scroll-Reveal" Effect: Content reveals using GSAP ScrollTrigger and Three.js shader transitions as users scroll down.

4.2.2 Workshop Discovery & Detail
Filters: Filter workshops by Age Group (Kids, Adult, Senior), Type (Batik, Pottery, Painting), and Duration.

Workshop Detail Page: Includes a 3D preview of the workshop "vibe," detailed description, schedule calendar, price, and a prominent "Register" CTA.

Schedule Integration: Real-time display of available slots fetched from the InsForge backend.

4.2.3 User Account (My Studio)
Registration/Login: Secure user authentication managed via InsForge.

Dashboard: Users can view their upcoming workshops, past attendance, and digital certificates (if any).

4.3 Instructor-Facing Interface
Login Portal: Dedicated login for instructors (Pengajar) via InsForge authentication.

Class Management: Instructors can view their assigned workshop schedules, manage attendance, and post workshop materials/announcements.

5. User Flow & Navigation
Barba.js Integration: Implement smooth, SPA-like page transitions using Barba.js. The Three.js scene persists across pages, while the DOM content swaps, creating a fluid "one-world" experience.

Hash-Based Routing: Sections should be navigable via hash links (#workshops, #about), allowing for smooth transitions between sections without full page reloads.

Mouse Interaction: 3D objects should respond subtly to mouse movements to create an organic, living feel.

6. Backend Specification (InsForge.dev)
Environment Config: Utilize VITE_API_BASE_URL for flexible deployment and centralized API configuration.

Data Models:

Workshops: id, title, description, category, instructor_id, price, schedule, max_participants.

Registrations: id, user_id, workshop_id, status, payment_status.

Users/Instructors: id, name, email, role (user/instructor), profile_image.

Authentication: Implement secure JWT-based authentication for users and instructors.

7. Performance & Accessibility
Performance: Target 60fps for Three.js rendering. Use texture optimization (WebP) and lazy loading for heavy assets.

Accessibility: Ensure a11y best practices (e.g., keyboard navigation, alt texts for images) to make art accessible to everyone.

Responsiveness: Fully responsive across devices, but design should prioritize "Desktop" for the optimal artistic experience.

8. Success Metrics (KPIs)
Engagement: Average Session Duration (Target: > 3 mins).

Conversion: Workshop Registration Completion Rate.

Technical Performance: Lighthouse Performance Score > 90.

Awards: Submission to Awwwards or CSS Design Awards for "Site of the Day."

9. Summary of Reference Architecture
Based on award-winning portfolio standards, the site should adopt a layered architecture:

DOM Layer: Standard HTML/React components for content.

3D Layer: A persistent Three.js canvas rendering the studio environment.

Animation Layer: GSAP orchestrating DOM and 3D object animations simultaneously.

Transition Layer: Barba.js handling navigation between "pages" without reloading the 3D scene.

This structure ensures that arte.coffee is not just a website, but an experience that embodies the therapeutic power of art.