# CalenGen

**CalenGen** is a tool for generating calendars, designed to simplify the creation and management of work schedules.

## Description

CalenGen allows users to quickly create customizable calendars with features such as reminders, recurring events, and integration with other services. This tool is ideal for personal use as well as for teams that need to coordinate their work shifts effectively.

## Installation

To install CalenGen, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/taras711/CalenGen.git
   ```
2. Navigate to the project directory:
   ```bash
   cd CalenGen
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

After installation, you can start CalenGen with the following command:

```bash
npm start
```

Once running, the application will be available at `http://localhost:3000`. Open this address in your browser to start using CalenGen.

## Features

- **Shift Scheduling (Harmonogram)**: Users can customize their calendar according to their work schedule by choosing from multiple work shift types. The system allows users to set a cycle for day and night weeks or configure shifts individually.
- **Customizable Workdays**: Users can modify their workdays if they were absent on a scheduled workday (e.g., marking it as a vacation day or a non-working day). Similarly, if they worked on a scheduled day off, they can change it to a working day and mark it as an overtime shift.
- **Event Planning**: Users can create multiple events for specific days, assign them different types and importance levels, and view them either within the calendar or on a dedicated event page. This page allows various actions to be performed on the events. 
- **Smart Sorting and Filtering**: The event management system remembers sorting and filtering preferences.
- **Work Time Tracking and Statistics**: The system tracks worked hours, updates data when users modify their schedule, and provides a detailed summary. The statistics page displays total worked hours, vacation days, overtime shifts, and performance percentages based on selected periods (current month, specific month, or all time). Each month is automatically added to the statistics category, and percentage values reflect work completion.
- **Weather and Notifications**: The main page displays current weather conditions, including temperature, wind speed and direction, and cloud coverage. Users can view an hourly forecast and check the weather for upcoming days. The system also tracks the weather for the next workday and provides relevant alerts. For example, if the user has a shift the next day and rain is expected, they will receive a reminder to take an umbrella.
- **Vertical Month Slider**: The calendar is designed as a vertical slider, displaying one specific month at a time for easy navigation between months.
- **Mobile App**: The application is developed for mobile devices (APK) and built on the DroidScript framework.

## Contribution

We welcome contributions from the community. If you would like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Added a new feature: your-feature-name"
   ```
4. Push the changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Create a Pull Request to the original repository.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Contact

If you have any questions or suggestions, feel free to reach out via email: [taras711@example.com](mailto:taras711@example.com).

