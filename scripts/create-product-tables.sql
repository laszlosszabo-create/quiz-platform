-- Product-specific configurations table
CREATE TABLE IF NOT EXISTS product_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, key)
);

-- Product-specific AI prompts table
CREATE TABLE IF NOT EXISTS product_ai_prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  lang VARCHAR(5) NOT NULL DEFAULT 'hu',
  ai_prompt TEXT NOT NULL,
  system_prompt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, lang)
);

-- Enable RLS
ALTER TABLE product_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_ai_prompts ENABLE ROW LEVEL SECURITY;

-- Create policies for product_configs
CREATE POLICY "Enable read access for all users" ON product_configs
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON product_configs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON product_configs
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for authenticated users" ON product_configs
    FOR DELETE USING (true);

-- Create policies for product_ai_prompts
CREATE POLICY "Enable read access for all users" ON product_ai_prompts
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON product_ai_prompts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON product_ai_prompts
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for authenticated users" ON product_ai_prompts
    FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_configs_product_id ON product_configs(product_id);
CREATE INDEX IF NOT EXISTS idx_product_configs_key ON product_configs(key);
CREATE INDEX IF NOT EXISTS idx_product_ai_prompts_product_id ON product_ai_prompts(product_id);
CREATE INDEX IF NOT EXISTS idx_product_ai_prompts_lang ON product_ai_prompts(lang);
