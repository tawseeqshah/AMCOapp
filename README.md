# AMCO App

This application is designed for AMCo’s proforma generation, vehicle search, and leads punching. It streamlines the process of creating quotation proformas, browsing available vehicles, and managing potential customer leads.

## Features

- **Proforma Generation**: Quickly create and customize proforma invoices for vehicle sales.
- **Vehicle Search**: Search and filter through the AMCo vehicle catalog by model, type, and specifications.
- **Leads Punching**: Capture and track leads directly in the app, with fields for customer details, interests, and follow-up status.
- **User-Friendly Interface**: Intuitive UI for seamless workflow and rapid data entry.
- **Export & Share**: Export generated proformas as PDF and share via email.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Flutter SDK (if mobile support is included)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tawseeqshah/AMCOapp.git
   cd AMCOapp
   ```

2. **Install dependencies**
   - For a Node.js frontend or backend:
     ```bash
     npm install
     ```
   - For a Flutter mobile project:
     ```bash
     flutter pub get
     ```

3. **Configure environment**
   - Copy `.env.example` to `.env` and fill in the required API keys and database URLs.

### Running the App

- **Web / Backend**
  ```bash
  npm run dev
  ```
- **Mobile (Android / iOS)**
  ```bash
  flutter run
  ```

## Usage

1. **Generate Proforma**
   - Navigate to the “Proforma” tab.
   - Fill in customer and vehicle details.
   - Click “Generate” to preview and download.

2. **Search Vehicles**
   - Go to the “Vehicles” tab.
   - Use filters (model, type, price range) to refine results.
   - Select a vehicle to view details.

3. **Lead Management**
   - Open the “Leads” section.
   - Click “New Lead” and enter customer information.
   - Save to add to the leads list; update status as you follow up.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request:

1. Fork it
2. Create your feature branch (`git checkout -b feature/Name`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/Name`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
