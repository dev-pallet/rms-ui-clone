# Restaurant Product Creation

This module is part of the `pallet` project and is designed to manage the creation and updating of restaurant products. It provides functionality for defining product details, variants, additional attributes, and sales channels. This page will only show if the retailType from local storage is 'RESTAURANT'

## Features

- **Product Description**: Define product name, types, categories, tax details, and storage type.
- **Variants**: Add multiple variants with specifications like prep time, calories, weight, and unit of measure.
- **Additional Attributes**: Specify attributes such as allergens, spice levels, organic certification, and SEO tags.
- **Sales Channels**: Configure sales channels for dine-in, delivery, and other modes.
- **Recipe Management**: Add recipes and cooking instructions for each variant.
- **Auto-Generator**: Automatically fill product details using AI.

## Code Structure

### Main Component

The main component is `RestaurantProductCreation` located at:
[`client/src/layouts/ecommerce/products-new-page/RestaurantProductCreation/index.js`](client/src/layouts/ecommerce/products-new-page/RestaurantProductCreation/index.js)

### Key Subcomponents

- **Product Description**: [`components/ProductDesc`](client/src/layouts/ecommerce/products-new-page/RestaurantProductCreation/components/ProductDesc/index.js)
- **Product Variant**: [`components/ProductVariant`](client/src/layouts/ecommerce/products-new-page/RestaurantProductCreation/components/ProductVariant/index.js)
- **Additional Restaurant Details**: [`components/AdditionalRestaurantDetails`](client/src/layouts/ecommerce/products-new-page/RestaurantProductCreation/components/AdditionalRestaurantDetails/index.js)

## Functions Used

### `handleValidatePayload`

- **Purpose**: Validates the payload before creating or updating a product.
- **Key Features**:
  - Ensures required fields like `productName`, `productTypes`, `mainMenuCategory`, and `variantName` are filled.
  - Checks if sales channels are provided when `eligibleForSale` is selected.
  - Displays error messages using `showSnackbar` if validation fails.

### `transformImageListToObject`

- **Purpose**: Converts an array of images into an object with predefined keys (e.g., `front`, `back`, `top`).
- **Key Features**:
  - Maps images to specific directions for better organization.

### `handleCreateProduct`

- **Purpose**: Handles the creation of a new product.
- **Key Features**:
  - Validates the payload using `handleValidatePayload`.
  - Constructs a detailed payload including product details, variants, attributes, and sales channels.
  - Sends the payload to the backend using `createRestaurantProduct`.
  - Displays success or error messages based on the response.

### `handleGetProductDetails`

- **Purpose**: Fetches product details for editing.
- **Key Features**:
  - Retrieves product data using `getProductDetailsRestaurant`.
  - Fetches recipe details using `getRecipeDetailsRestaurant`.
  - Populates state variables (`productDescription`, `variantData`, `additionalAttributes`) with the fetched data.

### `handleUpdateProducts`

- **Purpose**: Handles the update of an existing product.
- **Key Features**:
  - Constructs a payload similar to `handleCreateProduct` but includes `productId` and `variantId` for updates.
  - Sends the payload to the backend using `updateProductDetailsNew`.
  - Displays success or error messages based on the response.

### `showSnackbar`

- **Purpose**: Displays notifications to the user.
- **Key Features**:
  - Used to show error or success messages throughout the component.

### `navigate`

- **Purpose**: Navigates to different routes.
- **Key Features**:
  - Redirects the user back to the previous page after creating or updating a product.

## API Integration

The module integrates with backend services for creating and updating products:

- `createRestaurantProduct`
- `updateProductDetailsNew`
- `getProductDetailsRestaurant`
- `getRecipeDetailsRestaurant`

These services are imported from:
[`config/Services`](client/src/config/Services.js)

## Contribution

Feel free to contribute to this module by submitting pull requests or reporting issues.

## License

This project is licensed under the MIT License.
