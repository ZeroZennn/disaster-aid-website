# **Disaster Aid Website**

## Description / Overview
Disaster Aid is a comprehensive web-based system designed for real-time reporting, verification, and monitoring of natural disasters. The platform aims to streamline crisis management by providing actionable insights, mapping affected areas, and tracking resource and assistance requirements. It serves as a vital tool for local authorities, first responders, and volunteers to coordinate disaster relief efforts efficiently.

## Demo
<!-- Insert GIF or Image of the app here -->
[Live Demo Link (Placeholder)](#)

## Features
- **Real-Time Disaster Reporting:** Quickly submit reports of natural disasters including evidence (photos/videos).
- **Interactive Map Integration:** Visual monitoring of reported disasters and affected areas using live mapping tools.
- **Assistance & Resource Tracking:** Monitor details about required assistance and distribute resources efficiently.
- **Detailed Regional Data:** Built-in comprehensive region data (Provinces, Cities, Districts, Villages) for accurate location tracking in Indonesia.
- **Data Export & Reporting:** Ability to generate and export data (via Excel) for further analysis and record-keeping.
- **Secure Authentication & Roles:** Role-based access control and secure API interactions using Laravel Sanctum.
- **Dynamic Analytics Dashboard:** Interactive charts and visualizations for data-driven decision-making.

## Tech Stack / Built With
**Frontend:**
- React (v18)
- Inertia.js
- Tailwind CSS
- Chart.js & react-chartjs-2
- Leaflet & react-leaflet

**Backend:**
- PHP 8.2+
- Laravel 12.0
- Laravel Sanctum
- Laravolt Indonesia (Regional Data)
- Laravel Excel (Maatwebsite)

**Database & Tools:**
- SQLite / MySQL / PostgreSQL (Configurable)
- Vite
- Composer & npm

## Installation
Follow these step-by-step instructions to set up the project locally:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd disaster-aid
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Install Node dependencies:**
   ```bash
   npm install
   ```

4. **Environment Setup:**
   Copy the example environment file and configure your database settings if necessary.
   ```bash
   cp .env.example .env
   ```

5. **Generate Application Key:**
   ```bash
   php artisan key:generate
   ```

6. **Run Migrations:**
   *(Ensure your database server is running or configure SQLite in `.env`)*
   ```bash
   php artisan migrate
   ```

## Usage
To run the application locally, you need to start both the backend server and the frontend build process.

1. **Start the Laravel development server:**
   ```bash
   php artisan serve
   ```
   *The backend will typically be accessible at `http://localhost:8000`.*

2. **Start the Vite development server:**
   Open a new terminal window/tab and run:
   ```bash
   npm run dev
   ```

*(Note: The Laravel starter kit provides a convenient command `npm run dev` or `composer run dev` which may start both services using concurrently, depending on your setup. Refer to your package scripts for more details.)*

## Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Credits / Acknowledgments
<!-- Insert shoutouts, team members, or inspirations here -->
