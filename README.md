# Eco-Deliver
Welcome to the Eco-Friendly Food Delivery Route Optimization Website! 
This project aims to develop a website that optimizes food delivery routes for local restaurants while minimizing environmental impact. The website utilizes HERE Routing APIs and Mobile SDKs to calculate efficient delivery routes and provides users with insights on environmental benefits.

## Features

### 1. Address Entry and Mapping
- Allows users to input restaurant and delivery addresses through a user-friendly interface using a search function or manually inputting the address.
- Utilizes HERE GeoCoding API to retrieve coordinates of the restaurant location.

### 2. Delivery Address Collection
- Users can input delivery addresses either through manual entry or utilizing map pin-pointing.
- Calculates optimized delivery routes between two locations using the HERE Routing API, considering factors such as distance, traffic conditions, and potential petrol stops.

### 3. Route Optimization
- Once restaurant and delivery addresses are inputted, the app calculates the most efficient delivery route.
- Considers factors such as distance, traffic, and carbon emissions reduction.
- Provides estimated time of arrival (ETA) for each delivery location.
- Users can interact with dropdown menus or checkboxes to adjust route settings according to their preferences, providing flexibility in route planning.

### 4. Carbon Footprint Calculation
- The app calculates the carbon emissions saved by using an optimized delivery route compared to a traditional route.
- Provides users with information on carbon savings to encourage environmentally friendly practices.

### 5. Real-Time Data Integration
- The system integrates real-time data sources, such as traffic information and weather conditions, to dynamically adjust route calculations.
- By incorporating live traffic updates and weather forecasts, the website ensures that delivery routes remain optimized and efficient, even in changing conditions.

### 6. Error Handling

- The app implements robust error handling to ensure smooth user experience and graceful handling of unexpected scenarios. Here are some key aspects of error handling in the application:
- The app handles network errors effectively, providing users with feedback on connectivity issues.
- The app validates user inputs to ensure they are in the correct format and within acceptable ranges.
- Invalid inputs prompt appropriate error messages to guide users in providing correct information.
