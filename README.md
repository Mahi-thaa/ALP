In today's rapidly evolving educational landscape, personalized learning approaches are the way to go, especially for children with learning difficulties. Traditional educational methods often fall short in addressing the diverse needs of such learners, leading to disengagement and limited progress. With advancements in artificial intelligence and deep learning, particularly in transformer-based models, there is an opportunity to create intelligent systems that can better understand and respond to a child's unique emotional and behavioral cues.
ALP (Adaptive Learning Path) is an adaptive educational platform that uses transformer-based models to analyze facial expressions and gameplay behaviors of children with learning difficulties. This system will dynamically adapt the learning path of the child following challenges and feedback based on the detected emotional states promoting sustained engagement and improved learning outcomes.
While the system adjusts the learning path in real-time, it will always prioritize and adhere to the therapist s recommended path, ensuring that the adaptive process remains aligned with professional therapeutic goals.
ADAPTIVE LEARNING PATH A Real-time Research Project / Societal Related Project Project Report Submitted in partial fulfillment of requirements for B.Tech II Year II Semester course By GAYARU CHARAN 245523748303 VED THAKUR 245523748125 MAROJU ANANYA 245523748041 POTHUGANTI YAKSHITHA 245523733175 MANGALI MAHITHA 245523748039 KARREPU SREE VISHISTA 245523748028 Under the guidance of KESHAV MEMORIAL ENGINEERING COLLEGE Kachavanisingaram Village, Hyderabad, Telangana 500058.

KESHAV MEMORIAL ENGINEERING COLLEGE A Unit of Keshav Memorial Technical Education (KMTES) Approved by AICTE, New Delhi & Affiliated to Osmania University, Hyderabad CERTIFICATE This is to certify that the project work entitled “ADAPTIVE LEARNING PATH” is a bonafide work carried out by “Gayaru Charan - 245523748303, Ved Thakur 245523748125, Ananya Maroju - 245523748041, Pothuganti Yakshitha - 245523733175, Mangali Mahitha - 245523748039, Karrepu Sri Vishishta 245523748028” of II-year IV semester Bachelor of Engineering in CSE (AIML) during the academic year 2024-2025 and is a record of bonafide work carried out by them.

Project Mentor Sireesha Puppala ABSRACT CONTENTS Abstract 1 2 PAGE NO 6 Introduction 1.1 Purpose of the project 7 1.2 Proposed system 7 1.3 Scope of the project 7 Literature Survey 2.1 Emotion-Aware Adaptive Learning Systems 8 2.2 Transformer based models in image recognition 8 2.3 Adaptive Learning, Therapist Feedback, 9 and Game-Based Approaches 3 4 Software requirement specification 3.1 Functional Requirements 13 3.2 Non-Functional Requirements 15 3.3 Technology Stack 16 System Design 4.1 Use-case Description 18 4.2 Deployment Architecture 20 5 Conclusion 5.1 Summary of contributions 21 5.2 Educational Impact 21 5.3 Technical Learnings and Achievements 22 Future enhancements 22 6 References 25 7 Bibliography 26 ABSTRACT Adaptive Learning Path is a personalized, emotion-aware educational web platform developed to support children with learning difficulties by integrating emotional intelligence into digital learning environments. The system captures learners' facial expressions in real-time using webcam input, which is processed through MediaPipe’s Face Mesh to extract over 468 facial landmarks. These landmarks are analysed using a lightweight rule-based logic within a Flask API, enabling the platform to infer emotional states such as happiness, confusion, or frustration without relying on heavy deep learning models. The frontend is built using React.js, offering an interactive and child-friendly interface that adapts dynamically to emotional cues. The backend, powered by Node.js and Express.js, manages user authentication, data logging, and interaction with the Flask emotion detection service. MongoDB Atlas is used for securely storing user data, emotional trends, and therapist feedback. The system supports role-based access for students, therapists, and administrators, providing each with tailored dashboards and features. By integrating real-time emotion recognition, adaptive content delivery, and behavioural monitoring, Adaptive Learning Path enhances engagement, reduces frustration, and promotes personalized instruction. Therapists and educators can monitor progress and emotional trends through dedicated dashboards, enabling timely intervention and more informed decision-making. Designed with scalability, performance, and inclusivity in mind, the platform sets the foundation for future enhancements like voice-based emotion detection, smartwatch integration, multilingual support, and offline access—paving the way for a more empathetic and accessible learning experience.

CHAPTER 1: INTRODUCTION 1.1 PURPOSE OF THE PROJECT The primary purpose of the Adaptive Learning Path system is to support children with learning difficulties by providing a real-time, emotion-aware adaptive learning experience. By analysing facial expressions through a transformer model, the system responds statically to emotional states, adjusting the difficulty and content of educational activities accordingly. This approach aims to boost engagement, reduce frustration, and enhance learning outcomes, particularly for students who benefit from personalized instruction.

1.2 PROPOSED SYSTEM Adaptive Learning is an AI-powered web platform that integrates real-time emotion recognition with a full-stack web application. The system architecture includes a React.js frontend for user interaction, an Express.js backend for data handling, and a Flask-based API that leverages MediaPipe for facial emotion recognition. Using webcam input, the platform captures facial landmarks and infers emotional states such as happiness, confusion, or frustration. Based on the detected emotions, the backend statically adapts the learning content in real-time to better suit the learner's emotional state. Therapists or educators can monitor emotional trends and adjust learning plans using a dedicated dashboard, ensuring a more personalized and responsive learning experience.

1.3 SCOPE OF THE PROJECT Adaptive Learning is designed for educational environments that support children with learning challenges. The system targets early education or therapy-based learning by combining emotion recognition and adaptive learning. Its core functionalities include real-time emotion detection, static difficulty adjustment, therapist dashboards, and progress tracking. While it assists therapists and educators, it does not replace them—it enhances their ability to personalize instruction based on real-time behavioural and emotional data.

CHAPTER 2: LITERATURE SURVEY 2.1 EMOTION-AWARE ADAPTIVE LEARNING SYSTEMS Emotion-aware learning systems aim to improve student engagement and learning outcomes by recognizing the learner’s emotional state in real-time and adjusting the instructional content accordingly. Emotions like frustration, joy, or confusion directly impact a learner's ability to concentrate and retain knowledge. Researchers have found that real-time facial expression analysis, especially using webcams, can identify subtle emotional cues during digital learning. Studies show that models trained on datasets like FER-2013 can effectively detect core emotions such as anger, happiness, sadness, and surprise. These detected emotions can be used to personalize learning paths, offer motivational interventions, or adjust difficulty levels. Systems like “Adaptive Learning Path” build upon this by integrating MediaPipe and Flask for real-time emotion prediction, with the frontend updating based on the learner's current emotional state.

2.2 FACIAL EXPRESSION RECOGNITION USING FLASK Facial expression recognition has seen significant advancements through the integration of efficient real-time systems that can run seamlessly on resource-constrained environments. While state-ofthe-art models like Vision Transformers (ViT) and BERT have demonstrated impressive performance in large-scale affective computing tasks, they are often computationally intensive and require high-end GPUs for both training and inference. These models are typically used in research contexts where large datasets and extensive hardware resources are available. In contrast, our project, Adaptive Learning Path, is designed with a focus on practicality, speed, and low computational overhead. Rather than utilizing large pre-trained Transformer models, we leverage MediaPipe, an open-source framework by Google that provides high-fidelity facial landmark detection using lightweight machine learning models. MediaPipe efficiently tracks over 468 facial landmarks, capturing nuanced facial movements and expressions in real time. This structural information is crucial for understanding facial behaviour, particularly when working with low-resolution (48x48) grayscale input images, which are commonly used in real-time emotion detection systems due to their minimal storage and processing requirements To facilitate smooth and scalable backend communication, we integrate MediaPipe with a Flaskbased API, enabling rapid and responsive interaction between the front-end application and the facial analysis module. Flask serves as a lightweight server that handles image input, processes the landmark data, and returns emotion predictions with minimal latency. This combination allows us to build a robust and deployable system suitable for local environments such as desktops, embedded devices, or classroom setups. By avoiding complex architectures and instead relying on highly optimized tools like MediaPipe and Flask, Adaptive Learning ensures real-time performance, ease of integration, and efficient resource usage—all without sacrificing classification accuracy. This makes it a practical solution for real-world applications in educational and therapeutic contexts, especially where hardware limitations are a concern.

2.3 ADAPTIVE LEARNING, THERAPIST FEEDBACK, AND GAME-BASED APPROACHES While platforms like DreamBox or Knewton are known for adaptive content delivery, our project takes a different approach by using tools like MediaPipe and Flask. These allow the system to adapt learning content based on real-time facial expressions and behavioral cues, making it more personalized and responsive. However, few include emotional context in their adaptation process. Adaptive Learning Path extends this concept by factoring in emotional feedback to enhance personalization — a crucial feature for learners with emotional or cognitive challenges. Human-in-the-loop systems further improve adaptive platforms. Incorporating therapist or educator feedback allows the system to refine recommendations and better understand learner behaviour over time. This collaborative approach ensures the learning process is not solely dependent on machine predictions. Additionally, game-based learning benefits from emotion-aware feedback by dynamically adjusting game difficulty or instructions based on detected frustration or engagement levels. In Adaptive Learning Path, learning modules are structured to be interactive, and the backend reacts to emotional inputs to keep learners in their optimal emotional state for learning.

MOCKUP SCREENS ARCHITECTURE DIAGRAM SIGN UP PAGE LOGIN PAGE HOME PAGE CHAPTER 3: SOFTWARE REQUIREMENT SPECIFICATION 3.1 FUNCTIONAL REQUIREMENTS The functional requirements define the core features and behaviours the system must perform to meet user needs: • FR1: Real-time Facial Emotion Recognition o • FR2: Behaviour Logging During Learning Modules o • Based on detected emotions, the system should dynamically adjust the difficulty, pace, or feedback style of learning modules to maintain optimal engagement and prevent frustration.

FR5: Therapist Dashboard o • The system should use a lightweight emotion classification model trained on the FER – 2013 dataset to infer emotional states from 48x48 grayscale image inputs, ensuring fast and accurate predictions suitable for real-time performance.

FR4: Emotion-Driven Content Adaptation o • The system must continuously log user interactions, such as quiz answers, time spent on tasks, and response patterns. This data helps understand behavioural trends during the learning process.

FR3: Transformer-Based Emotion Inference o • The system must capture and analyse the learner’s facial expressions via webcam using the MediaPipe framework to classify emotions like happy, sad, angry, surprised, etc. MediaPipe detects facial landmarks in real time, and these features are then processed using a lightweight model suitable for local deployment to perform emotion classification.

Therapists should have access to a separate dashboard where they can view user progress, review emotional trends, and modify learning goals or module recommendations.

FR6: Secure Login and Role-Based Access o The platform must implement secure authentication (JWT) and provide different access levels: child user, therapist/admin. Only authorized users should be able to access sensitive features and data.

3.2 NON-FUNCTIONAL REQUIREMENTS These requirements define how the system should perform and operate, beyond just the features. • NFR1: Performance o • NFR2: Reliability o • Code should follow modular, reusable practices with clear documentation. Backend APIs and frontend components should be easy to debug and extend in future updates.

NFR5: Security o • The user interface must be intuitive, engaging, and designed with children in mind. Use of large buttons, minimal text, and friendly colors is preferred.

NFR4: Maintainability o • The middleware and backend services should have an uptime of at least 99% during active usage periods.

NFR3: Usability o • The system should provide emotion prediction responses in under 2 seconds to ensure a smooth real-time experience.

Sensitive data (such as login credentials, emotional logs, and therapist notes) should be end-to-end encrypted during transmission and securely stored using hashed tokens and secure access protocols.

NFR6: Compatibility o • The system must work across all major browsers (Chrome, Firefox, Edge) and be responsive for use on desktops, tablets, and mobile devices.

NFR7: Compliance o The platform should adhere to GDPR (General Data Protection Regulation) and COPPA (Children’s Online Privacy Protection Act) to ensure ethical data handling and privacy for underage users.

3.3 TECHNOLOGY STACK The project uses a combination of modern, scalable, and open-source technologies for its frontend, backend, AI/ML model, and database layers: • • Frontend: o React.js: For building a dynamic and responsive user interface.

o JavaScript, CSS, Core technologies for browser compatibility and styling.

Backend (Middleware): o Node.js + Express.js: RESTful API for client-server communication and integration with the database.

o Flask (Python): Handles emotion recognition and ML predictions using a lightweight API server.

Database: o • MongoDB Atlas: A scalable NoSQL cloud database to store user profiles, progress logs, emotional data, and therapist feedback.

AI/ML Frameworks: o MediaPipe: Used for real-time facial landmark detection from webcam input, enabling accurate facial expression analysis.

o OpenCV: Handles webcam frame capture and preprocessing of 48x48 grayscale images before emotion classification • o FER-2013: The dataset used to train the emotion classification model on 7 basic emotion classes (happy, sad, angry, surprised, fearful, disguised, neutral).

o Flask: Serves as a lightweight backend API to connect the front-end interface with the facial expression analysis module.

Authentication & Security: o JWT (JSON Web Tokens): For secure authentication and session management.

o RBAC (Role-Based Access Control): Controls different access levels for children and therapists.

• Tools & Platforms: o GitHub: Version control and team collaboration.

o Postman: API testing and debugging.

o Railway/Render: Deployment platforms for hosting backend and frontend components.

o For front end the tools used are Netlify and Versel CHAPTER 4: SYSTEM DESIGN 4.1 USE CASE DESCRIPTION Student: The student logs into the platform using their credentials and accesses personalized learning paths. They attempt adaptive quizzes that adjust in difficulty based on their performance and emotional responses. After each quiz, the student receives immediate, meaningful feedback to help reinforce concepts and improve learning outcomes. Therapist: The therapist monitors the progress of assigned students by reviewing their quiz performance, behavioral patterns, and emotional state as detected by the facial expression recognition system. Based on this data, the therapist can adjust learning goals, recommend interventions, and provide emotional support tailored to each student's needs. Admin: The admin is responsible for managing platform users, including students, therapists, and other stakeholders. They handle account creation, role assignments, and access controls. Additionally, the admin has access to system-wide analytics and reports, allowing them to oversee platform usage, monitor system performance, and ensure the effectiveness of the adaptive learning system.

4.2 DEPLOYMENT ARCHITECTURE • Frontend hosted on Netlify/Vercel.

• Backend on Railway or Render.

• Model API served via Flask.

• Database hosted on MongoDB Atlas.

• Authentication handled via JWT and role-based access.

CHAPTER-5: CONCLUSION 5.1 SUMMARY OF CONTRIBUTIONS The Adaptive Learning Path project presents a novel approach to personalized education by blending advanced artificial intelligence techniques with emotional intelligence. This project goes beyond academic performance and takes into account the emotional states of children while they interact with learning material. By doing so, it makes the educational process more responsive, inclusive, and child-centric. • We have successfully implemented a three-tier system using React (frontend), Express.js (backend), and Flask with MediaPipe (emotion detection API).

• A lightweight model trained in the FER – 2013 dataset enables accurate rea-time facial emotion recognition.

• Our system adapts learning or game content based on the learner’s emotional cues, with therapist input managed via a dedicated dashboard.

5.2 EDUCATIONAL IMPACT Children with learning difficulties often require tailored instruction that considers both cognitive and emotional readiness. Adaptive Learning Path addresses this by: • Promoting a stress-free learning environment, detecting frustration or confusion in realtime.

• Offering emotionally adaptive content to help maintain engagement and motivation.

• Supporting therapists and educators through dashboards that allow real-time monitoring and feedback loops.

This shift toward emotion-aware education is transformative, offering deeper insights into student behaviour and helping to design more humane and supportive learning systems.

5.3 TECHNICAL LEARNINGS AND ACHIEVEMENTS Through this project, our has team gained critical hands-on experience in: • Full-stack development using modern technologies (React, Node.js, Flask).

• Integrating machine learning models into production-ready APIs.

• Handling real-time video data and performing inference with minimal latency.

• Deploying and testing MongoDB, Express APIs, and local ML models together in a synchronized multi-terminal setup.

• Solving cross-platform and integration challenges like webcam access, cross-origin policies, and environment variable errors.

FUTURE ENHANCEMENTS As we envision the next phases of the Adaptive Learning Path project, we plan to implement several powerful features to expand the platform’s emotional intelligence, accessibility, and real-world impact. These enhancements are designed to make the learning experience more holistic, inclusive, and engaging for both learners and their support systems.

Voice-Based Emotion Detection • Integration of speech analysis models to detect tone, pitch, and sentiment.
• Adds an additional layer of emotional context by recognizing stress, hesitation, or excitement through voice.

• Useful when facial data is not available or when combined with facial cues for multimodal analysis.

Smartwatch Integration • Support for biometric data like heart rate, skin conductance, and stress indicators using wearables.
• Helps monitor physiological responses to learning content in real-time.

• Enables passive emotion tracking without needing continuous webcam access.

Regional Language Support • Multilingual interface to support learners across India and other diverse regions.
• Incorporation of native language content and instructions for better comprehension and comfort.

• Promotes inclusivity and equal access to emotionally adaptive education.

Parent Dashboard • A dedicated portal for parents to: o View their child’s weekly emotional and academic reports.
o Track progress and understand emotional trends.

o Receive suggestions on how to support learning at home.

5. Gamification with Rewards • Introduction of points, badges, and rewards for learning activities.

• Adaptive difficulty and emotional response-based challenges.

• Increases engagement and motivation, especially for younger learners.

Offline Access with Sync • Ability to use the platform offline with automatic data sync when internet becomes available.
• Essential for areas with unstable connectivity.

• Ensures continuity of learning and emotion logging without disruptions.

CHAPTER-6: REFERENCES ACADEMIC AND TECHNICAL REFERENCES

FER-2013 Dataset – Facial Expression Recognition o https://www.kaggle.com/datasets/msambare/fer2013
MediaPipe by Google – Real-time face and hand tracking o https://google.github.io/mediapipe/ SECURITY AND COMPLIANCE
JWT Authentication Overview  https://jwt.io/introduction TOOLS AND TECHNOLOGIES 1.MongoDB Atlas – Cloud Database • https://www.mongodb.com/cloud/atlas 2.React.js – Frontend Framework • https://react.dev/ 3.Node.js & Express – Backend Framework • https://expressjs.com/
Flask – Python API Development https://flask.palletsprojects.com/ BIBLIOGRAPHY GitHub Repository: https://github.com/Cheirun/alp.git This repository contains the full source code and implementation details of the Adaptive Learning Platform, including the React frontend, Express backend, Flask API integration, and MediaPipe-based facial emotion recognition module.
