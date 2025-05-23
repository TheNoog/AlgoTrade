# AlgoTrade Insights

AlgoTrade Insights is a sophisticated Next.js web application designed to serve as a front-end interface for a high-frequency trading system. It provides real-time market data visualization, performance monitoring, AI-driven trading parameter optimization, risk management controls, and system alerts.

## Overview

The application is built with a modern technology stack, focusing on performance, developer experience, and AI integration. It aims to provide traders and system operators with a clear and actionable view of trading activities and system health.

## Key Features

*   **Real-time Market Data Feed:** Displays live-updating stock data including ticker, price, change, volume, and status.
*   **Performance Dashboard:** Visualizes key performance indicators (KPIs) such as Net Profit/Loss, Win Rate, Average Trade Duration, and Total Trades. Includes a historical P/L chart.
*   **AI Parameter Optimizer:** Leverages Genkit and a Large Language Model (LLM) to analyze market data and suggest optimal trading parameters for various algorithms based on user-defined risk tolerance.
*   **Risk Management Controls:** Allows users to configure crucial risk parameters like stop-loss percentage, take-profit percentage, maximum position size, and leverage. (Note: These settings are intended to be sent to a backend trading engine).
*   **System Alerts:** Displays important system notifications, warnings, and errors, providing immediate feedback on the system's operational status.

## Technology Stack

*   **Framework:** Next.js (App Router)
*   **UI Library:** React
*   **Styling:** Tailwind CSS
*   **Components:** ShadCN UI
*   **AI Integration:** Genkit (with Google AI)
*   **Language:** TypeScript

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm, yarn, or pnpm

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repository-url>
    cd algotrade-insights
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```

### Running in Development

1.  **Frontend Application:**
    To run the Next.js development server:
    ```bash
    npm run dev
    ```
    This will typically start the application on `http://localhost:9002`.

2.  **Genkit AI Flows (for AI Optimizer):**
    The AI features (like the trading parameter optimizer) are powered by Genkit. To run the Genkit development server, which makes the flows available:
    ```bash
    npm run genkit:dev
    ```
    Or, to watch for changes in your flow files:
    ```bash
    npm run genkit:watch
    ```
    You'll need to have Google Cloud credentials configured for Genkit to access Google AI models. This usually involves setting the `GOOGLE_API_KEY` environment variable. Create a `.env` file in the root of the project and add your API key:
    ```
    GOOGLE_API_KEY=your_google_ai_api_key_here
    ```

## Deployment

This Next.js application can be deployed to various platforms that support Node.js applications.

### Firebase App Hosting

This project is configured for Firebase App Hosting. The `apphosting.yaml` file contains basic configuration.
1.  Ensure you have the Firebase CLI installed and configured.
2.  Set up your Firebase project.
3.  Deploy using the Firebase CLI:
    ```bash
    firebase deploy --only hosting
    ```
    Firebase App Hosting will automatically build and deploy your Next.js application. Environment variables (like `GOOGLE_API_KEY`) should be configured in the Firebase console for your App Hosting backend.

### Other Platforms (e.g., Vercel, Netlify)

1.  **Build the application:**
    ```bash
    npm run build
    ```
2.  Follow the deployment guides for your chosen platform. Most platforms will auto-detect Next.js projects and handle the build and deployment process.
3.  Ensure you configure necessary environment variables (e.g., `GOOGLE_API_KEY` for Genkit AI features) in your hosting provider's settings.

## Connecting to the Backend

This frontend application is designed to interact with a backend trading system (e.g., a C++ trading engine) for functionalities like executing trades, fetching live market data (if not simulated), and applying risk management settings.

### Configuration

1.  **API Endpoints:**
    Your backend system will expose API endpoints. You will need to update the frontend code to make requests to these endpoints. Typically, the base URL for your backend API would be configured via an environment variable.
    For example, you might add `BACKEND_API_URL` to your `.env` file:
    ```
    BACKEND_API_URL=https://your-trading-backend.example.com/api
    ```
    Then, in your frontend service files or components, you would use this variable to construct API request URLs.

2.  **Risk Management:**
    The "Risk Management Controls" tab allows users to set parameters. The `onSubmit` function in `src/components/risk-management/RiskManagement.tsx` currently logs these settings to the console. This function should be modified to send these settings to your backend API.

    ```typescript
    // Example modification in src/components/risk-management/RiskManagement.tsx
    const onSubmit: SubmitHandler<RiskManagementFormValues> = async (data) => {
      console.log("Risk Management Settings:", data);
      try {
        // const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/risk-settings`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data),
        // });
        // if (!response.ok) throw new Error('Failed to save risk settings');
        // const result = await response.json();
        toast({
          title: 'Settings Saved', // Modify to 'Settings Saved' from 'Settings Saved (Simulated)'
          description: 'Risk management parameters have been updated and sent to the backend.',
        });
      } catch (error) {
        toast({
          title: 'Save Failed',
          description: 'Could not save risk settings to the backend.',
          variant: 'destructive',
        });
      }
    };
    ```

3.  **Market Data:**
    The market data feed in `src/app/page.tsx` currently uses simulated data. You'll need to replace this with logic to fetch real-time data from your backend or a third-party market data provider.

4.  **Authentication & Authorization:**
    If your backend requires authentication, implement the necessary logic on the frontend to handle user login, token management (e.g., JWTs), and include authorization headers in API requests.

### AI Optimizer Backend Communication
The AI Optimizer (`src/components/ai-optimizer/AiOptimizer.tsx`) currently calls a Genkit flow (`src/ai/flows/optimize-trading-parameters.ts`) that is part of this Next.js application. The flow itself could be extended to:
*   Fetch live market data from an external source or your backend before calling the LLM.
*   Store or send the optimized parameters to your backend trading system.

## Further Development
*   **Error Handling:** Enhance error handling for API requests and display user-friendly messages.
*   **Real-time Updates:** Implement WebSockets or Server-Sent Events for truly real-time updates if required, especially for market data and system alerts.
*   **Security:** Ensure all security best practices are followed, especially if handling sensitive trading information.
```