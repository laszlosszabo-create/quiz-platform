const { createClient } = require('@supabase/supabase-js');

const url = "https://gkmeqvuahoyuxexoohmy.supabase.co";
const serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbWVxdnVhaG95dXhleG9vaG15Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQ3MzM1NiwiZXhwIjoyMDcwMDQ5MzU2fQ._O7I2G5Ge7y6Q4uKT5-T7SyP1O_TJtsCcuGBiqT4Res";

async function testAuditLog() {
  const supabase = createClient(url, serviceKey);
  console.log('🔍 Testing audit log functionality...');
  
  try {
    // 1. CREATE PRODUCT
    console.log('\n1️⃣ Creating test product...');
    const { data: product, error: createError } = await supabase
      .from('products')
      .insert({
        quiz_id: '474c52bb-c907-40c4-8cb1-993cfcdf2f38',
        name: 'Audit Test Product',
        price: 1990,
        currency: 'HUF',
        active: true,
        booking_url: 'https://test.example.com'
      })
      .select()
      .single();
      
    if (createError) {
      console.log('❌ Create error:', createError);
      return;
    }
    
    console.log('✅ Product created with ID:', product.id);
    
    // Small delay to ensure audit log is written
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 2. UPDATE PRODUCT
    console.log('\n2️⃣ Updating product...');
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update({ 
        name: 'Updated Audit Test Product', 
        price: 2990 
      })
      .eq('id', product.id)
      .select()
      .single();
      
    if (updateError) {
      console.log('❌ Update error:', updateError);
      return;
    }
    
    console.log('✅ Product updated');
    
    // Small delay to ensure audit log is written
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 3. CHECK AUDIT LOGS
    console.log('\n3️⃣ Checking audit logs...');
    const { data: auditLogs, error: auditError } = await supabase
      .from('audit_logs')
      .select('action, resource_type, resource_id, user_email, created_at')
      .eq('resource_type', 'product')
      .eq('resource_id', product.id)
      .order('created_at', { ascending: false });
      
    if (auditError) {
      console.log('❌ Audit query error:', auditError);
    } else if (!auditLogs || auditLogs.length === 0) {
      console.log('⚠️  NINCS LOG - No audit logs found for product operations');
    } else {
      console.log(`✅ Found ${auditLogs.length} audit log entries:`);
      auditLogs.forEach((log, index) => {
        console.log(`   ${index + 1}. ${log.action} | ${log.resource_type} | ${log.resource_id} | ${log.user_email || 'NULL'} | ${log.created_at}`);
      });
    }
    
    // 4. DELETE PRODUCT
    console.log('\n4️⃣ Deleting product...');
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id);
      
    if (deleteError) {
      console.log('❌ Delete error:', deleteError);
      return;
    }
    
    console.log('✅ Product deleted');
    
    // Small delay to ensure audit log is written
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 5. FINAL AUDIT CHECK
    console.log('\n5️⃣ Final audit logs check...');
    const { data: finalAuditLogs, error: finalAuditError } = await supabase
      .from('audit_logs')
      .select('action, resource_type, resource_id, user_email, created_at')
      .eq('resource_type', 'product')
      .eq('resource_id', product.id)
      .order('created_at', { ascending: false });
      
    if (finalAuditError) {
      console.log('❌ Final audit query error:', finalAuditError);
    } else if (!finalAuditLogs || finalAuditLogs.length === 0) {
      console.log('⚠️  NINCS LOG - No audit logs found after all operations');
    } else {
      console.log(`📋 FINAL AUDIT SUMMARY - ${finalAuditLogs.length} total entries:`);
      finalAuditLogs.forEach((log, index) => {
        console.log(`   ${index + 1}. ${log.action} | ${log.resource_type} | ${log.resource_id} | ${log.user_email || 'NULL'} | ${log.created_at}`);
      });
    }
    
  } catch (error) {
    console.log('❌ Script error:', error);
  }
}

testAuditLog().catch(console.error);
