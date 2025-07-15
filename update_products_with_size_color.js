const mongoose = require('mongoose');
const { Product } = require('./server/models/Models');
const MyConstants = require('./server/utils/MyConstants');

// Connect to MongoDB
mongoose.connect(MyConstants.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample data for sizes and colors
const sampleSizes = [8, 9, 10, 11, 12, 13, 14, 15];
const sampleColors = ['Gold', 'Silver', 'Rose Gold', 'Platinum', 'Bronze'];

async function updateProductsWithSizeColor() {
  try {
    console.log('Updating products with size and color data...');
    
    // Get all products
    const products = await Product.find();
    
    if (products.length === 0) {
      console.log('No products found to update.');
      return;
    }
    
    // Update each product with random sizes and colors
    for (const product of products) {
      // Random number of sizes (2-5 sizes)
      const numSizes = Math.floor(Math.random() * 4) + 2;
      const randomSizes = [];
      for (let i = 0; i < numSizes; i++) {
        const randomSize = sampleSizes[Math.floor(Math.random() * sampleSizes.length)];
        if (!randomSizes.includes(randomSize)) {
          randomSizes.push(randomSize);
        }
      }
      
      // Random number of colors (1-3 colors)
      const numColors = Math.floor(Math.random() * 3) + 1;
      const randomColors = [];
      for (let i = 0; i < numColors; i++) {
        const randomColor = sampleColors[Math.floor(Math.random() * sampleColors.length)];
        if (!randomColors.includes(randomColor)) {
          randomColors.push(randomColor);
        }
      }
      
      // Update product
      await Product.findByIdAndUpdate(product._id, {
        sizes: randomSizes.sort((a, b) => a - b), // Sort sizes in ascending order
        colors: randomColors
      });
      
      console.log(`Updated product: ${product.name}`);
      console.log(`  Sizes: ${randomSizes.join(', ')}`);
      console.log(`  Colors: ${randomColors.join(', ')}`);
    }
    
    console.log('All products updated successfully!');
    
  } catch (error) {
    console.error('Error updating products:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the update
updateProductsWithSizeColor();
