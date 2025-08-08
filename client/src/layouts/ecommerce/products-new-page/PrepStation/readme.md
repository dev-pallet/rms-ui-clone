# Prep Station Module

This folder contains the `Prep Station` module of the `pallet` project. The Prep Station module is designed to manage the creation and listing of prep stations for restaurant workflows.

## Features

### Prep Station Creation
- Create new prep stations with relevant details.
- Define workflows and configurations for prep stations.

### Route
- '/products/prep-station' for listing
- '/products/prep-station/creation' for creation of prep station

### Prep Station Listing
- View a list of all existing prep stations.
- Manage and update prep station details.

## Folder Structure

```
PrepStation/
├── PrepStationCreation/
│   └── index.js
├── PrepStationListing/
│   └── index.js
```

### Components

#### PrepStationCreation
- **File**: [`PrepStationCreation/index.js`](client/src/layouts/ecommerce/products-new-page/PrepStation/PrepStationCreation/index.js)
- **Purpose**: Handles the creation of new prep stations.
- **Key Features**:
  - Form-based input for prep station details.
  - Validation of user input.
  - Integration with backend APIs for saving prep station data.

#### PrepStationListing
- **File**: [`PrepStationListing/index.js`](client/src/layouts/ecommerce/products-new-page/PrepStation/PrepStationListing/index.js)
- **Purpose**: Displays a list of existing prep stations.
- **Key Features**:
  - Fetches and displays prep station data from the backend.
  - Provides options for editing or deleting prep stations.

## API Integration

The Prep Station module integrates with backend services for managing prep stations:
- `createPrepStation`
- `getPrepStationList`
- `updatePrepStation`
- `deletePrepStation`

These services are imported from:
[`config/Services`](client/src/config/Services.js)

## Contribution

Feel free to contribute to this module by submitting pull requests or reporting issues.

## License

This project is licensed under the MIT License.