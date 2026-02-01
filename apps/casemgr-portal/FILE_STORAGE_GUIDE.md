# Production Deployment Guide

## File Upload/Download Implementation

### Current Status (Development)
Files are stored in browser localStorage with Base64 encoding. This is **for demonstration only** and not suitable for production.

### Production Integration Options

#### Option 1: Azure Blob Storage (Recommended for Azure Static Web Apps)

**Benefits:**
- Seamless integration with Azure ecosystem
- Cost-effective for large files
- Built-in CDN support
- Managed identity authentication

**Setup:**
```bash
npm install @azure/storage-blob @azure/identity
```

**Implementation:**
```typescript
import { BlobServiceClient } from '@azure/storage-blob'
import { DefaultAzureCredential } from '@azure/identity'

const blobServiceClient = new BlobServiceClient(
  `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`,
  new DefaultAzureCredential()
)

export async function uploadToAzure(file: File, clientId: string) {
  const containerClient = blobServiceClient.getContainerClient('client-documents')
  const blobName = `${clientId}/${Date.now()}-${file.name}`
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)
  
  await blockBlobClient.uploadData(file, {
    blobHTTPHeaders: { blobContentType: file.type }
  })
  
  return blockBlobClient.url
}
```

**Required Configuration:**
- Create Azure Storage Account
- Create container: `client-documents`
- Configure CORS for your domain
- Set up Managed Identity or SAS tokens
- Add environment variable: `AZURE_STORAGE_ACCOUNT`

---

#### Option 2: AWS S3

**Benefits:**
- Highly scalable
- Global presence
- Extensive API support

**Setup:**
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

**Implementation:**
```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

export async function uploadToS3(file: File, clientId: string) {
  const key = `clients/${clientId}/${Date.now()}-${file.name}`
  
  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type
  }))
  
  return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`
}
```

**Required Configuration:**
- Create S3 bucket
- Configure bucket policy and CORS
- Create IAM user with S3 permissions
- Add environment variables: `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME`

---

#### Option 3: Firebase Storage

**Benefits:**
- Easy setup
- Real-time updates
- Free tier available

**Setup:**
```bash
npm install firebase
```

**Implementation:**
```typescript
import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const storage = getStorage()

export async function uploadToFirebase(file: File, clientId: string) {
  const storageRef = ref(storage, `clients/${clientId}/${Date.now()}-${file.name}`)
  const snapshot = await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(snapshot.ref)
  return downloadURL
}
```

**Required Configuration:**
- Create Firebase project
- Enable Storage in Firebase Console
- Set up security rules
- Add Firebase config to environment

---

### Security Best Practices

1. **File Validation**
   - Validate file types on server-side
   - Implement virus/malware scanning
   - Enforce size limits (currently 10MB)
   - Check file signatures, not just extensions

2. **Access Control**
   - Implement role-based access
   - Generate signed URLs with expiration
   - Log all file access attempts
   - Encrypt sensitive documents

3. **Storage Organization**
   ```
   /client-documents/
     /{clientId}/
       /{timestamp}-{filename}
   ```

4. **Data Retention**
   - Implement lifecycle policies
   - Archive old documents
   - Comply with data protection regulations
   - Provide bulk export functionality

---

### API Integration

Replace the functions in `lib/file-storage.ts`:

```typescript
// Production API example
export async function uploadFile(
  file: File,
  metadata: { type: string; description?: string; uploadedBy: string },
  clientId?: string
): Promise<StoredFile> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', metadata.type)
  formData.append('uploadedBy', metadata.uploadedBy)
  if (metadata.description) formData.append('description', metadata.description)
  if (clientId) formData.append('clientId', clientId)

  const response = await fetch('/api/files/upload', {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  })

  if (!response.ok) throw new Error('Upload failed')
  return response.json()
}

export async function getClientFiles(clientId: string): Promise<StoredFile[]> {
  const response = await fetch(`/api/clients/${clientId}/files`, {
    headers: { 'Authorization': `Bearer ${getAuthToken()}` }
  })
  return response.json()
}

export async function downloadFile(file: StoredFile) {
  // Get signed URL from backend
  const response = await fetch(`/api/files/${file.id}/download`, {
    headers: { 'Authorization': `Bearer ${getAuthToken()}` }
  })
  const { url } = await response.json()
  
  // Trigger download
  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  link.click()
}
```

---

### Environment Variables

Add to `.env.local`:

```bash
# Azure Blob Storage
AZURE_STORAGE_ACCOUNT=your-account-name
AZURE_STORAGE_CONTAINER=client-documents

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
S3_BUCKET_NAME=your-bucket

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket

# API
NEXT_PUBLIC_API_URL=https://api.yourapp.com
```

---

### Testing Checklist

- [ ] Upload various file types (.pdf, .docx, .jpg, .png)
- [ ] Test file size limits (reject >10MB)
- [ ] Verify file type validation
- [ ] Test download functionality
- [ ] Verify delete permissions
- [ ] Test concurrent uploads
- [ ] Check mobile responsiveness
- [ ] Verify error handling
- [ ] Test with slow network
- [ ] Verify data persistence

---

### Migration Strategy

1. **Phase 1: Keep mock data** (Current)
2. **Phase 2: Add backend API** (Replace localStorage calls)
3. **Phase 3: Integrate cloud storage** (Azure Blob/S3/Firebase)
4. **Phase 4: Add advanced features** (Virus scanning, OCR, thumbnails)

---

### Support

For implementation assistance, refer to:
- [Azure Blob Storage Docs](https://learn.microsoft.com/azure/storage/blobs/)
- [AWS S3 Docs](https://docs.aws.amazon.com/s3/)
- [Firebase Storage Docs](https://firebase.google.com/docs/storage)
