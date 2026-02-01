# Custom File Upload Guide - Email-Based System

## Overview

Custom file upload system for 3D printing orders. Files are sent directly via email to admin - **NO S3 storage**.

## Flow Diagram

```
┌─────────────┐
│   User      │
│  Selects    │
│   Files     │
└──────┬──────┘
       │
       │ Fills customer details
       ↓
┌─────────────────────────────────────┐
│  Frontend                           │
│  - Creates FormData                 │
│  - Appends files                    │
│  - Appends customer details         │
└──────┬──────────────────────────────┘
       │
       │ POST /api/v1/custom-files/upload
       │ Content-Type: multipart/form-data
       ↓
┌───────────────────────────────────────────────────┐
│  Backend                                          │
│  1. Receives files via multer                     │
│  2. Validates file types & sizes                  │
│  3. Generates uploadId                            │
│  4. Stores metadata in database                   │
│  5. Sends email with file attachments             │
│  6. NO S3 STORAGE                                 │
└──────┬────────────────────────────────────────────┘
       │
       │ Email sent successfully
       ↓
┌─────────────────────────────────────┐
│  Frontend Success Screen            │
│  - Shows uploadId                   │
│  - Confirms email sent              │
└─────────────────────────────────────┘
```

## Frontend Implementation

### lib/api.js

```javascript
/**
 * Upload custom file for printing
 * POST /api/v1/custom-files/upload
 */
export async function uploadCustomFile(formData) {
  const response = await fetch(`${API_BASE_URL}/api/v1/custom-files/upload`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  return await response.json();
}
```

### Usage Example

```javascript
const handleSubmit = async (e) => {
  const uploadFormData = new FormData();
  
  // Add files
  files.forEach(file => {
    uploadFormData.append('files', file);
  });
  
  // Add details
  uploadFormData.append('name', formData.name);
  uploadFormData.append('email', formData.email);
  uploadFormData.append('phone', formData.phone);
  uploadFormData.append('requirements', formData.requirements);
  uploadFormData.append('quantity', formData.quantity);

  const result = await uploadCustomFile(uploadFormData);
};
```

## Backend Implementation

### Express + Multer + Nodemailer

```javascript
const multer = require('multer');
const nodemailer = require('nodemailer');

// Memory storage (no disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

router.post('/custom-files/upload', upload.array('files', 10), async (req, res) => {
  const { name, email, phone, requirements, quantity } = req.body;
  const files = req.files;
  
  const uploadId = `UPLOAD-${Date.now()}`;
  
  // Store metadata
  await db.query(`
    INSERT INTO custom_uploads (upload_id, customer_name, customer_email, 
                                customer_phone, requirements, quantity, 
                                file_names, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
  `, [uploadId, name, email, phone, requirements, quantity, 
      JSON.stringify(files.map(f => f.originalname))]);
  
  // Send email with attachments
  await transporter.sendMail({
    from: 'noreply@robohatch.com',
    to: 'admin@robohatch.com',
    subject: `New Custom Print - ${uploadId}`,
    html: `Customer: ${name}<br>Email: ${email}<br>Phone: ${phone}`,
    attachments: files.map(f => ({
      filename: f.originalname,
      content: f.buffer,
    })),
  });
  
  res.json({ uploadId, message: 'Upload successful' });
});
```

## Database Schema

```sql
CREATE TABLE custom_uploads (
  upload_id VARCHAR(50) PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  requirements TEXT,
  quantity INT NOT NULL,
  file_names JSON NOT NULL,
  status ENUM('pending', 'quoted', 'approved', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

```env
# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=noreply@robohatch.com
SMTP_PASS=your_password
ADMIN_EMAIL=admin@robohatch.com
```

## Key Features

✅ **No S3** - Files sent via email only  
✅ **Instant notification** - Admin gets immediate email  
✅ **Simple setup** - No AWS configuration  
✅ **File attachments** - Complete files in email  
✅ **Metadata storage** - Customer details in database  

## Testing

1. Upload small .stl file (< 5MB)
2. Check admin email for attachments
3. Verify database record created
4. Check customer confirmation email
