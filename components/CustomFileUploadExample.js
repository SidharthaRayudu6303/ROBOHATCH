/**
 * Custom File Upload Example
 * 
 * FLOW:
 * 1. User selects file(s) for custom printing
 * 2. User fills in details (name, email, phone, requirements)
 * 3. Frontend uploads file via POST /api/v1/custom-files/upload
 * 4. Backend sends email with file attachment to admin
 * 5. Backend stores metadata (filename, customer details, timestamp)
 * 6. NO S3 USAGE - files sent directly via email
 */

import { useState } from 'react';
import { uploadCustomFile } from '@/lib/api';

export default function CustomFileUploadExample() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    requirements: '',
    quantity: 1,
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadId, setUploadId] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file types (3D models, images, PDFs)
    const validTypes = [
      'model/stl',
      'application/sla',
      'model/obj',
      'image/jpeg',
      'image/png',
      'application/pdf',
      '.stl',
      '.obj',
      '.sla',
    ];
    
    const invalidFiles = selectedFiles.filter(file => {
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      return !validTypes.some(type => 
        file.type === type || extension === type
      );
    });
    
    if (invalidFiles.length > 0) {
      setError(`Invalid file types: ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }
    
    // Validate file size (max 50MB per file)
    const oversizedFiles = selectedFiles.filter(file => file.size > 50 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`Files too large (max 50MB): ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }
    
    setFiles(selectedFiles);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }
    
    setIsUploading(true);
    setError(null);

    try {
      /**
       * Create FormData for multipart/form-data upload
       */
      const uploadFormData = new FormData();
      
      // Add files
      files.forEach(file => {
        uploadFormData.append('files', file);
      });
      
      // Add customer details
      uploadFormData.append('name', formData.name);
      uploadFormData.append('email', formData.email);
      uploadFormData.append('phone', formData.phone);
      uploadFormData.append('requirements', formData.requirements);
      uploadFormData.append('quantity', formData.quantity);

      /**
       * POST /api/v1/custom-files/upload
       * 
       * Backend will:
       * 1. Receive files and customer details
       * 2. Send email to admin with file attachments
       * 3. Store metadata in database:
       *    - upload_id
       *    - user_id (if authenticated)
       *    - customer_name
       *    - customer_email
       *    - customer_phone
       *    - requirements
       *    - quantity
       *    - file_names (JSON array)
       *    - total_size
       *    - created_at
       * 4. Return uploadId
       * 
       * NO S3 STORAGE - Files sent directly via email
       */
      const result = await uploadCustomFile(uploadFormData);
      
      setUploadId(result.uploadId);
      setUploadSuccess(true);
      
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message || 'Failed to upload files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setFormData({
      name: '',
      email: '',
      phone: '',
      requirements: '',
      quantity: 1,
    });
    setUploadSuccess(false);
    setUploadId(null);
    setError(null);
  };

  // Success Screen
  if (uploadSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <i className="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
          <h1 className="text-3xl font-bold text-dark-brown mb-4">
            Upload Successful!
          </h1>
          <p className="text-gray-600 mb-2">
            Upload ID: <span className="font-bold text-primary-orange">{uploadId}</span>
          </p>
          <p className="text-gray-600 mb-8">
            We've received your files and will contact you shortly with a quote.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <i className="fas fa-info-circle text-blue-500 mr-2"></i>
            <span className="text-sm text-blue-800">
              You'll receive a confirmation email at <strong>{formData.email}</strong>
            </span>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleReset}
              className="bg-primary-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-hover-orange transition-all"
            >
              Upload Another File
            </button>
            <a 
              href="/"
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Upload Form
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Custom 3D Printing Upload</h1>
      <p className="text-gray-600 mb-8">
        Upload your 3D model files (.STL, .OBJ) and we'll provide a quote
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">
            <i className="fas fa-cloud-upload-alt text-primary-orange mr-2"></i>
            Upload Files
          </h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-orange transition-all cursor-pointer">
            <input
              type="file"
              id="fileInput"
              multiple
              accept=".stl,.obj,.sla,.jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="fileInput" className="cursor-pointer">
              <i className="fas fa-file-upload text-5xl text-gray-400 mb-4"></i>
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-500">
                STL, OBJ, SLA, JPG, PNG, PDF (max 50MB per file)
              </p>
            </label>
          </div>
          
          {/* Selected Files List */}
          {files.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Selected Files:</h3>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <i className="fas fa-file text-primary-orange"></i>
                      <span className="font-medium">{file.name}</span>
                      <span className="text-sm text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFiles(files.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Customer Details */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">
            <i className="fas fa-user text-primary-orange mr-2"></i>
            Your Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-primary-orange"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-primary-orange"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-primary-orange"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Quantity *</label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-primary-orange"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Special Requirements (optional)
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                rows={4}
                placeholder="Color, material, size, finish, delivery date, etc."
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-primary-orange"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading || files.length === 0}
          className="w-full bg-gradient-to-r from-primary-orange to-hover-orange text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <span className="flex items-center justify-center gap-2">
              <i className="fas fa-spinner fa-spin"></i>
              Uploading Files...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <i className="fas fa-paper-plane"></i>
              Submit for Quote
            </span>
          )}
        </button>
      </form>
      
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          <i className="fas fa-info-circle mr-2"></i>
          How it works:
        </h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
          <li>Upload your 3D model files and provide details</li>
          <li>We'll review your files and requirements</li>
          <li>You'll receive a quote within 24 hours via email</li>
          <li>Once approved, we'll start production</li>
          <li>Your custom prints will be delivered to your address</li>
        </ol>
      </div>
    </div>
  );
}

/**
 * API REQUEST EXAMPLE:
 * 
 * POST /api/v1/custom-files/upload
 * Content-Type: multipart/form-data
 * 
 * FormData:
 * - files: [File, File, ...]
 * - name: "John Doe"
 * - email: "john@example.com"
 * - phone: "9876543210"
 * - requirements: "Red color, PLA material, smooth finish"
 * - quantity: 5
 * 
 * BACKEND RESPONSE:
 * {
 *   "uploadId": "UPLOAD-2026-001234",
 *   "message": "Files uploaded successfully. We'll contact you soon.",
 *   "filesReceived": ["model1.stl", "model2.obj"],
 *   "totalSize": "15.5 MB"
 * }
 * 
 * BACKEND ACTIONS:
 * ✅ Receives files via multipart/form-data
 * ✅ Sends email to admin with file attachments
 * ✅ Stores metadata in custom_uploads table
 * ✅ Sends confirmation email to customer
 * ✅ NO S3 USAGE - Files sent directly via email
 */
