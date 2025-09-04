import { db } from './connection';
import { customers } from './schema';

export async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');

    const result = await db.select().from(customers).limit(1);

    console.log('✅ Database connection successful');
    console.log(`📊 Found ${result.length} sample record(s)`);

    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}
