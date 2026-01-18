const pool = require('../config/database');
const bcrypt = require('bcryptjs');

async function fixPatientPassword() {
  console.log('🔧 Fixing patient password...');
  
  const client = await pool.connect();
  
  try {
    // Check current user
    const userResult = await client.query(
      'SELECT id, email, password FROM users WHERE email = $1',
      ['patient@example.com']
    );

    if (userResult.rows.length === 0) {
      console.log('❌ User patient@example.com not found. Creating user...');
      
      // Create the user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Test123!', salt);
      
      const insertResult = await client.query(
        `INSERT INTO users (name, email, phone, password, role, is_verified) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id, email`,
        ['Demo Patient', 'patient@example.com', '+12345678901', hashedPassword, 'patient', true]
      );
      
      console.log('✅ Created user:', insertResult.rows[0]);
    } else {
      const user = userResult.rows[0];
      console.log(`📋 Found user: ${user.email} (ID: ${user.id})`);
      
      // Test current password
      const testPassword = 'Test123!';
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log(`🔍 Current password valid: ${isValid}`);
      
      if (!isValid) {
        console.log('🔄 Updating password...');
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(testPassword, salt);
        
        await client.query(
          'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2',
          [newHashedPassword, 'patient@example.com']
        );
        
        // Verify the new password
        const verifyResult = await client.query(
          'SELECT password FROM users WHERE email = $1',
          ['patient@example.com']
        );
        const verifyValid = await bcrypt.compare(testPassword, verifyResult.rows[0].password);
        console.log(`✅ Password updated. Verification: ${verifyValid ? 'SUCCESS' : 'FAILED'}`);
      } else {
        console.log('✅ Password is already correct');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  fixPatientPassword()
    .then(() => {
      console.log('✅ Fix completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fix failed:', error);
      process.exit(1);
    });
}

module.exports = { fixPatientPassword };
