#!/usr/bin/env node

/**
 * Azure Blob Storage Migration Script
 * Migrates files from local storage or other sources to Azure Blob Storage
 * 
 * Usage:
 *   node scripts/migrate-storage.js --source ./local-files --target toolsincstorageaccount --container client-documents
 *   node scripts/migrate-storage.js --list-containers
 */

const { BlobServiceClient } = require('@azure/storage-blob');
const { DefaultAzureCredential } = require('@azure/identity');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (name) => {
  const index = args.indexOf(name);
  return index !== -1 ? args[index + 1] : null;
};

const sourcePath = getArg('--source') || process.env.SOURCE_PATH;
const storageAccount = getArg('--target') || process.env.AZURE_STORAGE_ACCOUNT;
const containerName = getArg('--container') || 'client-documents';
const listOnly = args.includes('--list-containers');
const dryRun = args.includes('--dry-run');

console.log('\n☁️  Azure Blob Storage Migration Tool\n');
console.log('=' .repeat(50));

async function getBlobServiceClient() {
  if (!storageAccount) {
    throw new Error('Storage account name required (--target or AZURE_STORAGE_ACCOUNT env var)');
  }
  
  const accountUrl = `https://${storageAccount}.blob.core.windows.net`;
  
  // Try connection string first, then managed identity
  if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
    console.log('  🔑 Using connection string authentication');
    return BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
  } else {
    console.log('  🔑 Using Azure credential authentication');
    const credential = new DefaultAzureCredential();
    return new BlobServiceClient(accountUrl, credential);
  }
}

async function listContainers() {
  console.log(`\n📦 Listing containers in: ${storageAccount}\n`);
  
  try {
    const blobServiceClient = await getBlobServiceClient();
    
    console.log('Containers:');
    for await (const container of blobServiceClient.listContainers()) {
      console.log(`  • ${container.name}`);
      console.log(`    Created: ${container.properties.lastModified}`);
      console.log(`    Lease State: ${container.properties.leaseState}`);
      console.log();
    }
  } catch (error) {
    console.error('❌ Error listing containers:', error.message);
    console.log('\n💡 Make sure you are logged in:');
    console.log('   az login');
    console.log('   Or set AZURE_STORAGE_CONNECTION_STRING environment variable\n');
    process.exit(1);
  }
}

async function getFilesToUpload(dirPath) {
  const files = [];
  
  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else {
        const relativePath = path.relative(dirPath, fullPath);
        files.push({
          fullPath,
          relativePath: relativePath.replace(/\\/g, '/'), // Use forward slashes for blob names
          size: stat.size
        });
      }
    }
  }
  
  scanDirectory(dirPath);
  return files;
}

async function uploadFiles() {
  if (!sourcePath) {
    console.error('❌ Source path required (--source or SOURCE_PATH env var)\n');
    console.log('Usage:');
    console.log('  node scripts/migrate-storage.js \\');
    console.log('    --source ./local-files \\');
    console.log('    --target toolsincstorageaccount \\');
    console.log('    --container client-documents\n');
    process.exit(1);
  }
  
  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Source path does not exist: ${sourcePath}\n`);
    process.exit(1);
  }
  
  console.log(`Source: ${sourcePath}`);
  console.log(`Target: ${storageAccount}/${containerName}`);
  if (dryRun) {
    console.log('Mode: DRY RUN (no uploads will be performed)');
  }
  console.log();
  
  try {
    const blobServiceClient = await getBlobServiceClient();
    const containerClient = blobServiceClient.getContainerClient(containerName);
    
    // Create container if it doesn't exist
    console.log('🔍 Checking container...');
    const containerExists = await containerClient.exists();
    
    if (!containerExists) {
      if (dryRun) {
        console.log(`  ⚠ DRY RUN: Would create container: ${containerName}\n`);
      } else {
        console.log(`  Creating container: ${containerName}`);
        await containerClient.create();
        console.log('  ✓ Container created\n');
      }
    } else {
      console.log(`  ✓ Container exists\n`);
    }
    
    // Get files to upload
    console.log('📁 Scanning source directory...');
    const files = await getFilesToUpload(sourcePath);
    console.log(`  Found ${files.length} files to upload\n`);
    
    if (files.length === 0) {
      console.log('ℹ️  No files to upload\n');
      return;
    }
    
    // Calculate total size
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    console.log(`  Total size: ${totalSizeMB} MB\n`);
    
    if (dryRun) {
      console.log('📋 Files that would be uploaded:');
      files.forEach(file => {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        console.log(`  • ${file.relativePath} (${sizeMB} MB)`);
      });
      console.log('\n⚠ DRY RUN: No files were actually uploaded\n');
      return;
    }
    
    // Upload files
    console.log('⬆️  Uploading files...\n');
    let uploadedCount = 0;
    let skippedCount = 0;
    
    for (const file of files) {
      const blockBlobClient = containerClient.getBlockBlobClient(file.relativePath);
      
      // Check if blob already exists
      const exists = await blockBlobClient.exists();
      if (exists) {
        console.log(`  ⏭️  Skipping (exists): ${file.relativePath}`);
        skippedCount++;
        continue;
      }
      
      try {
        const fileStream = fs.createReadStream(file.fullPath);
        await blockBlobClient.uploadStream(fileStream, undefined, undefined, {
          blobHTTPHeaders: {
            blobContentType: getMimeType(file.relativePath)
          }
        });
        
        uploadedCount++;
        console.log(`  ✓ Uploaded: ${file.relativePath}`);
      } catch (error) {
        console.error(`  ❌ Failed: ${file.relativePath} - ${error.message}`);
      }
    }
    
    console.log();
    console.log('📊 Upload Summary:');
    console.log(`  Uploaded: ${uploadedCount}`);
    console.log(`  Skipped: ${skippedCount}`);
    console.log(`  Total: ${files.length}`);
    console.log();
    
    if (uploadedCount > 0) {
      console.log('✅ Migration completed successfully!\n');
      console.log(`🔗 Access your files at:`);
      console.log(`   https://${storageAccount}.blob.core.windows.net/${containerName}/\n`);
    }
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure you are logged in: az login');
    console.log('   2. Check storage account name is correct');
    console.log('   3. Verify you have contributor access to the storage account');
    console.log('   4. Or set AZURE_STORAGE_CONNECTION_STRING environment variable\n');
    process.exit(1);
  }
}

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.txt': 'text/plain',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.zip': 'application/zip'
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
}

async function main() {
  if (listOnly) {
    await listContainers();
  } else {
    await uploadFiles();
  }
}

main();
