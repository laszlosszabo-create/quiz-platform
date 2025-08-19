-- Add compared_price column to products table
-- This column will store the original price for discount display

ALTER TABLE products 
ADD COLUMN compared_price DECIMAL(10,2) NULL;

-- Add comment for documentation
COMMENT ON COLUMN products.compared_price IS 'Original price for discount comparison display';

-- Update existing products (optional)
-- UPDATE products SET compared_price = NULL WHERE compared_price IS NULL;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name = 'compared_price';
