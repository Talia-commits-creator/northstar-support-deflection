const express = require('express');
const cors = require('cors');
const { checkStock } = require('./data/inventory');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend integration
app.use(cors());
app.use(express.json());

/**
 * GET /api/stock?product=<product>&size=<size>
 * Returns stock availability status for a product/size combination.
 */
app.get('/api/stock', (req, res) => {
  const { product, size } = req.query;

  const result = checkStock(product, size);

  if (result.error) {
    return res.status(result.statusCode || 400).json({ error: result.error });
  }

  return res.json({
    product: result.product,
    size: result.size,
    status: result.status,
    available: result.available
  });
});

// Start Express web server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Stock Availability API running on port ${PORT}`);
  });
}

module.exports = app;
