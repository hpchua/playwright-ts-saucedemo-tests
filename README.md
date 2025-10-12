# SauceDemo E2E Test Automation Portfolio

> **🚧 This is an active, work-in-progress project.** It is being developed to showcase modern test automation skills and best practices. New features and improvements are being added regularly.

A robust end-to-end test automation framework for the [SauceDemo](https://www.saucedemo.com/) website, built with **Playwright** and **TypeScript**. This project demonstrates a scalable and maintainable approach to QA automation, applying software engineering principles to testing.

---

## Table of Contents

-   [About The Project](#about-the-project)
-   [Tech Stack](#tech-stack)
-   [Key Features Implemented](#key-features-implemented)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
-   [How to Run Tests](#how-to-run-tests)
-   [Project Structure](#project-structure)
-   [Roadmap & Future Enhancements](#roadmap--future-enhancements)

---

## About The Project

The primary goal of this project is to create a comprehensive test automation suite that is easy to maintain, extend, and run. It serves as a practical demonstration of my skills in building automation frameworks from the ground up, leveraging my background in software engineering to apply development best practices to quality assurance.

This framework is designed to be:

-   **Reliable:** Tests are atomic, independent, and resistant to minor UI changes.
-   **Maintainable:** Utilizes the Page Object Model (POM) to separate test logic from page-specific code, making updates easy.
-   **Scalable:** The structure allows for the easy addition of new tests and pages without cluttering the existing codebase.

---

## Tech Stack

-   **Test Runner:** [Playwright](https://playwright.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Package Manager:** [NPM](https://www.npmjs.com/)
-   **Code Formatter:** [Prettier](https://prettier.io/) for consistent code style.

---

## Key Features Implemented

-   **End-to-End Test Scenarios:** Coverage for critical user flows from login to checkout.
-   **Page Object Model (POM):** All page locators and actions are abstracted into reusable page classes, promoting clean and maintainable test scripts.
-   **Cross-Browser Compatibility:** Tests are configured to run against multiple browsers (Chromium, Firefox, WebKit).
-   **Detailed HTML Reports:** Generates a comprehensive and interactive HTML report after each test run to easily visualize test results and debug failures.

#### Automated Test Scenarios (Completed):

✔️ User authentication (valid login, invalid login, locked-out user)
✔️ Viewing and sorting products on the inventory page

#### Automated Test Scenarios (Current Progress):

✔️ Adding and removing items from the shopping cart
✔️ Full checkout process: from cart to "Thank You" page

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher is recommended)
-   NPM (comes bundled with Node.js)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/your-repository-name.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd your-repository-name
    ```
3.  **Install project dependencies:**
    ```sh
    npm install
    ```
4.  **Install Playwright browsers:**
    ```sh
    npx playwright install
    ```

---

## How to Run Tests

You can execute the tests using the following commands in your terminal.

1.  **Run all tests in headless mode:**
    ```sh
    npx playwright test
    ```
2.  **Run tests in headed mode to watch the execution:**
    ```sh
    npx playwright test --headed
    ```
3.  **Run tests for a specific browser:**
    ```sh
    npx playwright test --project=chromium
    ```
4.  **Open the latest HTML test report:**
    ```sh
    npx playwright show-report
    ```

---

## Project Structure

To Be Provided Once The Project is completed.

## Roadmap & Future Enhancements

This section outlines planned features and improvements, demonstrating a forward-thinking approach to testing and framework development.

-   **[Planned] Implement Data-Driven Testing:**

    -   Refactor tests to use external data files (e.g., JSON) to handle multiple test data sets for users, products, and shipping information.

-   **[Planned] CI/CD Integration:**

    -   Set up a GitHub Actions workflow (`.github/workflows/playwright.yml`) to automatically trigger the test suite on every push and pull request, ensuring continuous quality checks.

-   **[Planned] API Testing:**

    -   Incorporate Playwright's API testing capabilities to test application endpoints directly. This will create a hybrid testing approach that reduces reliance on slower UI tests for certain scenarios (like authentication).

-   **[Planned] Visual Regression Testing:**

    -   Integrate a visual snapshot testing library to automatically catch unintended UI changes, bugs, or style regressions that functional tests might miss.

-   **[Planned] Accessibility Testing:**
    -   Add automated accessibility (a11y) checks to the test suite to ensure the application is usable by everyone, catching issues like missing alt tags or incorrect ARIA roles.
