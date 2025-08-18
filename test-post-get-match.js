const { createClient } = require('@supabase/supabase-js');

const url = "https://gkmeqvuahoyuxexoohmy.supabase.co";
const serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbWVxdnVhaG95dXhleG9vaG15Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQ3MzM1NiwiZXhwIjoyMDcwMDQ5MzU2fQ._O7I2G5Ge7y6Q4uKT5-T7SyP1O_TJtsCcuGBiqT4Res";

async function testPostGetMatch() {
  const supabase = createClient(url, serviceKey);
  console.log('🔍 Testing POST→GET and PUT→GET data consistency...');
  
  try {
    const testData = {
      quiz_id: '474c52bb-c907-40c4-8cb1-993cfcdf2f38',
      name: 'POST-GET Test Product',
      price: 2490,
      currency: 'HUF',
      active: true,
      booking_url: 'https://test.example.com/book'
    };
    
    // 1. POST (CREATE) → GET
    console.log('\n1️⃣ POST→GET match test...');
    const { data: postedProduct, error: postError } = await supabase
      .from('products')
      .insert(testData)
      .select('name, price, currency, active, booking_url')
      .single();
      
    if (postError) {
      console.log('❌ POST error:', postError);
      return;
    }
    
    console.log('   POST result:', JSON.stringify(postedProduct));
    
    // Immediate GET after POST
    const { data: getAfterPost, error: getPostError } = await supabase
      .from('products')
      .select('name, price, currency, active, booking_url')
      .eq('name', testData.name)
      .single();
      
    if (getPostError) {
      console.log('❌ GET after POST error:', getPostError);
      return;
    }
    
    console.log('   GET result:', JSON.stringify(getAfterPost));
    
    // Compare POST and GET data
    const postGetMatch = JSON.stringify(postedProduct) === JSON.stringify(getAfterPost);
    console.log(`   POST→GET match: ${postGetMatch ? '✅ PASS' : '❌ FAIL'}`);
    
    if (!postGetMatch) {
      console.log('   POST data:', postedProduct);
      console.log('   GET data:', getAfterPost);
    }
    
    // 2. PUT (UPDATE) → GET
    console.log('\n2️⃣ PUT→GET match test...');
    const updateData = {
      name: 'PUT-GET Test Product Updated',
      price: 3490,
      currency: 'EUR',
      active: false,
      booking_url: 'https://updated.example.com/book'
    };
    
    const { data: putProduct, error: putError } = await supabase
      .from('products')
      .update(updateData)
      .eq('name', testData.name)
      .select('name, price, currency, active, booking_url')
      .single();
      
    if (putError) {
      console.log('❌ PUT error:', putError);
      return;
    }
    
    console.log('   PUT result:', JSON.stringify(putProduct));
    
    // Immediate GET after PUT
    const { data: getAfterPut, error: getPutError } = await supabase
      .from('products')
      .select('name, price, currency, active, booking_url')
      .eq('name', updateData.name)
      .single();
      
    if (getPutError) {
      console.log('❌ GET after PUT error:', getPutError);
      return;
    }
    
    console.log('   GET result:', JSON.stringify(getAfterPut));
    
    // Compare PUT and GET data
    const putGetMatch = JSON.stringify(putProduct) === JSON.stringify(getAfterPut);
    console.log(`   PUT→GET match: ${putGetMatch ? '✅ PASS' : '❌ FAIL'}`);
    
    if (!putGetMatch) {
      console.log('   PUT data:', putProduct);
      console.log('   GET data:', getAfterPut);
    }
    
    // 3. Cleanup
    console.log('\n3️⃣ Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('name', updateData.name);
      
    if (deleteError) {
      console.log('⚠️  Delete error:', deleteError);
    } else {
      console.log('✅ Test product deleted');
    }
    
    // Summary
    console.log('\n📋 SUMMARY:');
    console.log(`   POST→GET match: ${postGetMatch ? 'PASS' : 'FAIL'}`);
    console.log(`   PUT→GET match: ${putGetMatch ? 'PASS' : 'FAIL'}`);
    
  } catch (error) {
    console.log('❌ Script error:', error);
  }
}

testPostGetMatch().catch(console.error);
