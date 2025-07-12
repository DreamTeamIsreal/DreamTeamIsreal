# DreamTeamIsrael

A pioneering platform dedicated to fostering direct citizen engagement and proposing a new governance model for Israel: **"Direct Citizen Government."** This application serves as a digital bridge, enabling citizens to actively participate in shaping the nation's future, from candidate submission to data visualization and collaborative team building.

---

### Translated Versions of this README:

* [עברית (Hebrew)](./README.he.md)
* [العربية (Arabic)](./README.ar.md)
* [አማርኛ (Amharic)](./README.am.md)
* [Русский (Russian)](./README.ru.md)

---

### 🌐 Live Demo

**Visit the live application:** [DreamTeamIsrael on GitHub Pages](https://dreamteamisreal.github.io/DreamTeamIsreal/)

---

### The Core Concept: "Direct Citizen Government"

This platform is built upon a foundational vision for a new Israeli governing model. We invite you to delve into the detailed proposal that outlines the principles, mechanisms, and benefits of empowering citizens directly.

**Explore the Concept Document in your preferred language:**

* [**English:** Proposal for the New Governance Model for Israel: "Direct Citizen Government"](./concept_docs/concept_en.md)
* [**עברית:** הצעת המודל המשטרי החדש לישראל: "ממשלת האזרח הישיר"](./concept_docs/concept_he.md)
* [**العربية:** اقتراح نموذج الحكم الجديد لإسرائيل: "حكومة المواطن المباشر"](./concept_docs/concept_ar.md)
* [**አማርኛ:** ለእስራኤል አዲስ የአስተዳደር ሞዴል ሀሳብ፡ “ቀጥተኛ የዜጎች መንግስት”](./concept_docs/concept_am.md)
* [**Русский:** Предложение новой модели управления для Израиля: «Правительство прямого участия граждан»](./concept_docs/concept_ru.md)

---

## Features

* **Candidate Submission:** Empower citizens to propose and support candidates.
* **Team Builder:** Facilitate the formation of collaborative teams around shared goals.
* **Data Visualization:** Provide insights into citizen preferences and participation data.
* **Candidates Directory:** A comprehensive list of proposed candidates and their profiles.
* **Multilingual Support:** Full support for Hebrew, Arabic, Amharic, Russian, and English with RTL (Right-to-Left) directionality where applicable.

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js (LTS version recommended)
* npm or Yarn (package manager)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/DreamTeamIsrael/DreamTeamIsrael.git](https://github.com/DreamTeamIsrael/DreamTeamIsrael.git)
    cd DreamTeamIsrael
    ```

## Running the Application

To run the application, follow these steps:

1.  **Install Dependencies:**
    Navigate to the project root and install the necessary dependencies:
    ```bash
    npm install
    ```

2.  **Start the Development Server:**
    To run the application in development mode (with hot-reloading), use:
    ```bash
    npm run dev
    ```
    This will typically start the server at `http://localhost:5173` (or another port if 5173 is in use).

3.  **Build for Production (Optional):**
    To create a production-ready build of the application, run:
    ```bash
    npm run build
    ```
    This will generate optimized static assets in the `dist` directory.

4.  **Preview Production Build (Optional):**
    To serve and preview the production build locally, use:
    ```bash
    npm run preview
    ```
    This is useful for testing the built version before deployment.

### Running the Application

This project consists of two main parts: the React frontend and the Node.js backend API. Both need to be running concurrently.

1.  **Start the Backend Server:**
    Open a new terminal window, navigate to the `server` directory, and start the Node.js server:
    ```bash
    cd server
    node server.js # Or `npm start` if you have a start script defined in server/package.json
    ```
    (Ensure your backend is configured to run on `http://localhost:5000` as per the React app's API calls, or update the `API_BASE_URL` in `src/api/usersApi.ts` accordingly).

2.  **Start the Frontend Development Server:**
    Open another terminal window, navigate to the project root (`DreamTeamIsrael`), and start the React development server:
    ```bash
    npm start # or yarn start
    ```
    This will usually open the application in your browser at `http://localhost:3000`.

---

## Technologies Used

* **Frontend:** React, TypeScript, React Router, Tailwind CSS, `react-i18next`, Lucide React
* **Backend:** Node.js, Express.js (potentially with PostgreSQL/MongoDB as discussed)

---

## Contributing

We welcome contributions from the community! If you're interested in improving this project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes and ensure they are well-tested.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to the project's coding standards and includes relevant tests.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

For any inquiries or collaborations, please contact us at [contact@dreamteamisrael.org](mailto:contact@dreamteamisrael.org).

---
