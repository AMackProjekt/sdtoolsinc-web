#!/usr/bin/env node

/**
 * Azure SQL Database Migration Script
 * Migrates database schema and data from source to target Azure SQL
 * 
 * Usage:
 *   node scripts/migrate-db.js --source "Server=localhost;Database=toolsinc" --target "Server=toolsinc.database.windows.net;Database=toolsinc-prod"
 *   node scripts/migrate-db.js --action schema-only
 *   node scripts/migrate-db.js --action data-only
 */

const sql = require('mssql');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (name) => {
  const index = args.indexOf(name);
  return index !== -1 ? args[index + 1] : null;
};

const sourceConnectionString = getArg('--source') || process.env.SOURCE_DB;
const targetConnectionString = getArg('--target') || process.env.TARGET_DB;
const action = getArg('--action') || 'full'; // full, schema-only, data-only
const dryRun = args.includes('--dry-run');

console.log('\n🔄 Azure SQL Database Migration Tool\n');
console.log('=' .repeat(50));

if (!sourceConnectionString || !targetConnectionString) {
  console.error('❌ Error: Source and target connection strings required\n');
  console.log('Usage:');
  console.log('  node scripts/migrate-db.js \\');
  console.log('    --source "Server=localhost;Database=toolsinc" \\');
  console.log('    --target "Server=toolsinc.database.windows.net;Database=toolsinc-prod"\n');
  console.log('Or set environment variables:');
  console.log('  SOURCE_DB=... TARGET_DB=... node scripts/migrate-db.js\n');
  process.exit(1);
}

// Parse connection string to config object
function parseConnectionString(connectionString) {
  const parts = connectionString.split(';');
  const config = {
    options: {
      encrypt: true,
      trustServerCertificate: false
    }
  };
  
  parts.forEach(part => {
    const [key, value] = part.split('=').map(s => s.trim());
    if (key && value) {
      switch (key.toLowerCase()) {
        case 'server':
          config.server = value;
          break;
        case 'database':
          config.database = value;
          break;
        case 'user':
        case 'user id':
          config.user = value;
          break;
        case 'password':
          config.password = value;
          break;
        case 'encrypt':
          config.options.encrypt = value.toLowerCase() === 'true';
          break;
      }
    }
  });
  
  return config;
}

async function getTableList(pool) {
  const result = await pool.request().query(`
    SELECT 
      TABLE_SCHEMA,
      TABLE_NAME,
      TABLE_TYPE
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_TYPE = 'BASE TABLE'
    AND TABLE_SCHEMA != 'sys'
    ORDER BY TABLE_SCHEMA, TABLE_NAME
  `);
  return result.recordset;
}

async function getTableSchema(pool, schema, table) {
  const result = await pool.request()
    .input('schema', sql.NVarChar, schema)
    .input('table', sql.NVarChar, table)
    .query(`
      SELECT 
        COLUMN_NAME,
        DATA_TYPE,
        CHARACTER_MAXIMUM_LENGTH,
        IS_NULLABLE,
        COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = @schema
      AND TABLE_NAME = @table
      ORDER BY ORDINAL_POSITION
    `);
  return result.recordset;
}

async function migrateSchema(sourcePool, targetPool) {
  console.log('\n📋 Migrating Schema...');
  
  // Read schema file if exists
  const schemaFile = path.join(__dirname, '..', 'api', 'schema.sql');
  if (fs.existsSync(schemaFile)) {
    console.log('  ✓ Found schema.sql file');
    const schema = fs.readFileSync(schemaFile, 'utf8');
    
    if (dryRun) {
      console.log('  ⚠ DRY RUN: Would execute schema.sql on target');
      console.log('  📄 Schema preview:');
      console.log(schema.substring(0, 500) + '...\n');
      return;
    }
    
    try {
      const statements = schema.split('GO').filter(s => s.trim());
      for (const statement of statements) {
        if (statement.trim()) {
          await targetPool.request().query(statement);
        }
      }
      console.log('  ✓ Schema applied to target database\n');
    } catch (error) {
      console.error('  ❌ Error applying schema:', error.message);
      throw error;
    }
  } else {
    console.log('  ⚠ No schema.sql file found');
    console.log('  📝 Analyzing source database structure...\n');
    
    const tables = await getTableList(sourcePool);
    console.log(`  Found ${tables.length} tables to migrate`);
    
    for (const table of tables) {
      console.log(`    • ${table.TABLE_SCHEMA}.${table.TABLE_NAME}`);
    }
    console.log();
  }
}

async function migrateData(sourcePool, targetPool) {
  console.log('\n📦 Migrating Data...');
  
  const tables = await getTableList(sourcePool);
  
  for (const table of tables) {
    const fullTableName = `${table.TABLE_SCHEMA}.${table.TABLE_NAME}`;
    console.log(`  → ${fullTableName}`);
    
    if (dryRun) {
      const countResult = await sourcePool.request()
        .query(`SELECT COUNT(*) as cnt FROM ${fullTableName}`);
      console.log(`    ⚠ DRY RUN: Would migrate ${countResult.recordset[0].cnt} rows`);
      continue;
    }
    
    try {
      // Get data from source
      const data = await sourcePool.request()
        .query(`SELECT * FROM ${fullTableName}`);
      
      if (data.recordset.length === 0) {
        console.log(`    ℹ No data to migrate`);
        continue;
      }
      
      // Insert into target (batch insert for efficiency)
      const columns = Object.keys(data.recordset[0]);
      const columnList = columns.join(', ');
      const valuePlaceholders = columns.map((_, i) => `@val${i}`).join(', ');
      
      let insertedCount = 0;
      for (const row of data.recordset) {
        const request = targetPool.request();
        columns.forEach((col, i) => {
          request.input(`val${i}`, row[col]);
        });
        
        await request.query(`
          INSERT INTO ${fullTableName} (${columnList})
          VALUES (${valuePlaceholders})
        `);
        insertedCount++;
      }
      
      console.log(`    ✓ Migrated ${insertedCount} rows`);
    } catch (error) {
      console.error(`    ❌ Error migrating ${fullTableName}:`, error.message);
      // Continue with next table
    }
  }
  
  console.log();
}

async function main() {
  console.log(`Action: ${action}`);
  console.log(`Source: ${sourceConnectionString.split(';')[0]}...`);
  console.log(`Target: ${targetConnectionString.split(';')[0]}...`);
  if (dryRun) {
    console.log('Mode: DRY RUN (no changes will be made)');
  }
  console.log();
  
  let sourcePool, targetPool;
  
  try {
    // Connect to source
    console.log('🔌 Connecting to source database...');
    const sourceConfig = parseConnectionString(sourceConnectionString);
    sourcePool = await sql.connect(sourceConfig);
    console.log('  ✓ Connected to source\n');
    
    // Connect to target
    console.log('🔌 Connecting to target database...');
    const targetConfig = parseConnectionString(targetConnectionString);
    targetPool = await sql.connect(targetConfig);
    console.log('  ✓ Connected to target\n');
    
    // Execute migration based on action
    if (action === 'full' || action === 'schema-only') {
      await migrateSchema(sourcePool, targetPool);
    }
    
    if (action === 'full' || action === 'data-only') {
      await migrateData(sourcePool, targetPool);
    }
    
    console.log('✅ Migration completed successfully!\n');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    // Close connections
    if (sourcePool) await sourcePool.close();
    if (targetPool) await targetPool.close();
  }
}

main();
