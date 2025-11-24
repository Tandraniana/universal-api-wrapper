import APIWrapper from '../src/index.js';

// Initialize the API wrapper
const api = new APIWrapper({
  apiKey: 'your-api-key-here',
  baseURL: 'https://api.example.com/v1',
  cacheTTL: 300000 // 5 minutes
});

// Example usage
async function demonstrateAPI() {
  try {
    // Get data by ID
    const data = await api.getData('123');
    console.log('Retrieved data:', data);

    // Get all data with filters
    const allData = await api.getAllData({
      limit: 10,
      offset: 0,
      sort: 'created_at'
    });
    console.log('All data:', allData);

    // Create a new item
    const newItem = await api.createItem({
      name: 'Example Item',
      description: 'This is an example item',
      category: 'examples'
    });
    console.log('Created item:', newItem);

    // Update an item
    const updatedItem = await api.updateItem('123', {
      name: 'Updated Item Name',
      description: 'Updated description'
    });
    console.log('Updated item:', updatedItem);

    // Search items
    const searchResults = await api.searchItems('example', {
      category: 'examples',
      limit: 5
    });
    console.log('Search results:', searchResults);

    // Delete an item
    await api.deleteItem('123');
    console.log('Item deleted successfully');

  } catch (error) {
    console.error('API Error:', error.message);
  }
}

// Run examples
demonstrateAPI();
