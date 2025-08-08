// generateDocsGemini.js
import fs from 'fs-extra';
import path from 'path';
import { globby } from 'globby';
import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = 'AIzaSyCc0cSOR1SdXpnoNPVMkHBMDEGSqmZtEd4';
const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const filesToDocument = [
  //   {
  //     path: 'client/src/layouts/ecommerce/add-staff/index.js',
  //     docName: 'add-staff.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/all-org-page/OrgLocationPage.js',
  //     docName: 'org-location-page.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/all-org-page/AllOrg_loc.js',
  //     docName: 'all-org-loc.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/all-org-page/Dashboardpage.js',
  //     docName: 'dashboard-page.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/all-org-page/HeadOffice.js',
  //     docName: 'head-office.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/purchase-exclusive/components/create-grn',
  //     docName: 'purchase-grn-creation.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/purchase-exclusive/components/grn-new-details',
  //     docName: 'purchase-grn-details.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/purchase-exclusive/index.js',
  //     docName: 'purchase-grn-listing.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/purchase-indent/index.js',
  //     docName: 'purchase-indent-listing.txt',
  //   },
  //     {
  //         path: 'client/src/layouts/ecommerce/purchase-main',
  //         docName: 'purchase-order.txt',
  //     },
  //     {
  //         path: 'client/src/layouts/ecommerce/purchase-returns',
  //         docName: 'purchase-returns.txt',
  //     },
  //     {
  //         path: 'client/src/layouts/ecommerce/purchase-made',
  //         docName: 'purchase-payment-made.txt',
  //     },
  //     {
  //         path: 'client/src/layouts/ecommerce/purchase-bills',
  //         docName: 'purchase-bills.txt',
  //     },
  //     {
  //         path: 'client/src/layouts/ecommerce/purchase',
  //         docName: 'purchase-mobile.txt',
  //     },
  //   {
  //     path: 'client/src/layouts/ecommerce/purchase-indent/components/new-purchase-indent',
  //     docName: 'purchase-indent-creation.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/sales-order/new-sales',
  //     docName: 'sales-order-creation.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/sales-order/payments',
  //     docName: 'sales-order-payments.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/sales-order/returns',
  //     docName: 'sales-order-returns.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/sales-order/new-sales/index.js',
  //     docName: 'sales-order-listing.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/reports',
  //     docName: 'reports.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/customer/components',
  //     docName: 'customer-creation-details.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/customer/index.js',
  //     docName: 'customer-listing.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/apps-integration/CouponSettings',
  //     docName: 'coupon-settings.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/all-org-page/BillingInformation',
  //     docName: 'billing-information.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/apps-integration/WhatsappBusiness',
  //     docName: 'whatsapp-business.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/apps-integration/Notification',
  //     docName: 'notification-settings.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/inventory/stock-transfer',
  //     docName: 'stock-transfer.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/inventory/expiry-management',
  //     docName: 'expiry-management.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/inventory/ros-app-inventory',
  //     docName: 'inventory-management.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/inventory/stock-adjustment',
  //     docName: 'stock-adjustment.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/inventory/stock-balance',
  //     docName: 'stock-balance.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/inventory/stock-count',
  //     docName: 'stock-count.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/inventory/abc-analysis',
  //     docName: 'inventory-abc-analysis.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/knowledge-base',
  //     docName: 'knowledge-base.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/offers-promo',
  //     docName: 'offers-promo.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/pallet-hyperlocal',
  //     docName: 'pallet-hyperlocal.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/apps-integration/LoyalitySettings',
  //     docName: 'loyalty-settings.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/shop-location',
  //     docName: 'location-editing.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/setting/newRetail',
  //     docName: 'organization-editing.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/users-roles',
  //     docName: 'user-listing-editing.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/vendor/components',
  //     docName: 'vendor-creation-details.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/product/all-products',
  //     docName: 'all-products-listing.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/product/assortment-mapping',
  //     docName: 'assortment-mapping.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/product/bulk-price-edit',
  //     docName: 'bulk-price-edit.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/product/bundleProduct',
  //     docName: 'bundle-product.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/product/new-product-screen',
  //     docName: 'product-creation.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/product/restaurant-details',
  //     docName: 'restaurant-details.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/product/restaurant-listing',
  //     docName: 'restaurant-listing.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/product/ros-app-products',
  //     docName: 'mobile-view-products.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/products-new-page/index.js',
  //     docName: 'products-masters.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/products-new-page/Brand',
  //     docName: 'brand.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/products-new-page/components',
  //     docName: 'product-components.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/products-new-page/Online-product-category-page',
  //     docName: 'online-product-category-page.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/products-new-page/PriceEditByUpload',
  //     docName: 'price-edit-by-upload.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/products-new-page/Products-detail-page',
  //     docName: 'products-detail-page.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/products-new-page/Recipe',
  //     docName: 'products-recipe.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/products-new-page/RestaurantProductCreation',
  //     docName: 'restaurant-product-creation.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/products-new-page/Tax',
  //     docName: 'products-tax.txt',
  //   },
  //   {
  //     path: 'client/src/layouts/ecommerce/products-new-page/UrlGeneratorPage',
  //     docName: 'products-url-generator.txt',
  //   },
  //   {
  //     path: 'client/src/protectedRoutes..js',
  //     docName: 'protected-routes.txt',
  //   },
  //   {
  //     path: 'client/src/App.js',
  //     docName: 'all-navigation.txt',
  //   },
  // {
  //   path: 'client/src/layouts/ecommerce/apps-integration/Pos',
  //   docName: 'pos.txt',
  // },
  // {
  //   path: 'client/src/layouts/ecommerce/apps-integration/AllreadyInstalledApps.js',
  //   docName: 'allready-installed-apps.txt',
  // },
  // {
  //   path: 'client/src/layouts/ecommerce/CustomerDetails',
  //   docName: 'customer-details.txt',
  // },
  // {
  //   path: 'client/src/layouts/ecommerce/headoffice-sellers',
  //   docName: 'headoffice-sellers.txt',
  // },
  // {
  //   path: 'client/src/layouts/ecommerce/headoffice-store',
  //   docName: 'headoffice-store.txt',
  // },
  // {
  //   path: 'client/src/layouts/ecommerce/Pallet-pay',
  //   docName: 'pallet-pay.txt',
  // },
  // {
  //   path: 'client/src/routes.js',
  //   docName: 'sidenavbar.txt',
  // },
];

// Very important:
// - **Include navigation paths and interactions with links or buttons that open a new page.**
// - DO NOT IGNORE any navigation paths or interactions, even if they seem obvious.
// - For example: Navigate to [Purchase Indent](http://localhost:3002/purchase/purchase-indent)
const basePrompt = `
Generate a plain English .txt document describing what this React component does from the user’s point of view. Don't mention this line in the document.

The documentation must be:
- Comprehensive but simple
- Designed to help a Large Language Model (LLM) understand this UI for RAG or fine-tuning purposes
- Focused only on user-visible actions, UI elements, and screen flows
- Also mention top 5 questions that users might ask about this component/page


Include:
- All visible UI elements: buttons, inputs, dropdowns, labels, tables, etc.
- What happens when each element is clicked, selected, or filled
- Step-by-step explanation of workflows
- Page navigation: if clicking something opens a new page, popup, or tab, clearly describe that
- Modal interactions, file uploads, checkboxes, toggles, etc.
- Use **simple, readable, non-technical language**

Do NOT include:
- Variable or function names (e.g., handleClick, fetchData)
- React/JS keywords or logic (e.g., useEffect, useState, props, Redux)
- API or backend references
- CSS/styling information

Format:
- Use Markdown-style structure
- Use **bold** for button and section names
- Use \`---\` to separate UI sections
`;

async function generateDocGemini({ combinedCode, docName }) {
  try {
    const fullPrompt = `${basePrompt}\n\nHere is the React component code:\n\n\`\`\`jsx\n${combinedCode}\n\`\`\`\n\nBegin below:\n`;

    console.log(`⏳ Generating doc with Gemini: ${docName}...`);

    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
    });

    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const outPath = path.resolve('generated-docs', docName);
    await fs.ensureDir(path.dirname(outPath));
    await fs.writeFile(outPath, responseText, 'utf8');

    console.log(`✅ Doc saved: ${outPath}`);
  } catch (err) {
    console.error(`❌ Error generating doc for ${docName}:`, err.message);
  }
}

async function processConfig({ path: configPath, docName }) {
  const absolutePath = path.resolve(configPath);
  const stats = await fs.stat(absolutePath);

  if (stats.isDirectory()) {
    const files = await globby(['**/*.{js,jsx,tsx}'], {
      cwd: absolutePath,
      absolute: true,
    });

    if (!files.length) {
      console.warn(`⚠️ No JS/JSX/TSX files found in folder: ${configPath}`);
      return;
    }

    let combinedCode = '';
    for (const file of files) {
      const code = await fs.readFile(file, 'utf8');
      combinedCode += `\n\n// File: ${file}\n${code}`;
    }

    await generateDocGemini({ combinedCode, docName });
  } else if (stats.isFile()) {
    const code = await fs.readFile(absolutePath, 'utf8');
    await generateDocGemini({ combinedCode: code, docName });
  } else {
    console.warn(`⚠️ Skipping unknown type: ${configPath}`);
  }
}

(async () => {
  console.log('📚 Starting Gemini doc generation...\n');

  for (const fileConfig of filesToDocument) {
    await processConfig(fileConfig);
  }

  console.log('\n🏁 Done with Gemini!');
})();
