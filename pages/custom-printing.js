import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState } from 'react';

export default function CustomPrinting() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    material: '',
    color: '',
    quantity: '1',
    description: '',
    deliveryOption: 'standard'
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const materials = [
    { value: 'pla', label: 'PLA (Polylactic Acid) - Standard', price: '₹50/gram' },
    { value: 'abs', label: 'ABS (Acrylonitrile Butadiene Styrene) - Durable', price: '₹60/gram' },
    { value: 'petg', label: 'PETG - Strong & Flexible', price: '₹70/gram' },
    { value: 'tpu', label: 'TPU (Flexible) - Rubber-like', price: '₹100/gram' },
    { value: 'nylon', label: 'Nylon - High Strength', price: '₹120/gram' },
    { value: 'resin', label: 'Resin - High Detail', price: '₹200/gram' }
  ];

  const colors = [
    'White', 'Black', 'Red', 'Blue', 'Green', 'Yellow', 
    'Orange', 'Purple', 'Pink', 'Gray', 'Brown', 'Transparent'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    // TODO: Send formData and uploadedFile to backend API
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        material: '',
        color: '',
        quantity: '1',
        description: '',
        deliveryOption: 'standard'
      });
      setUploadedFile(null);
    }, 3000);
  };

  return (
    <>
      <Head>
        <title>Custom 3D Printing - ROBOHATCH</title>
        <meta name="description" content="Submit your custom 3D printing request" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <section className="min-h-screen pt-[120px] pb-20 bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <i className="fas fa-print text-6xl text-primary-orange mb-5 inline-block"></i>
            <h1 className="text-5xl text-[#2c3e50] mb-5 font-bold">Custom 3D Printing Request</h1>
            <p className="text-xl text-[#666] max-w-3xl mx-auto">Upload your design and let us bring your ideas to life with precision 3D printing</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
            {/* Form Section */}
            <div className="bg-white rounded-2xl shadow-[0_5px_25px_rgba(0,0,0,0.1)] p-8 lg:p-10">
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                {/* Personal Information */}
                <div className="border-b border-[#e0e0e0] pb-8">
                  <h3 className="text-2xl text-[#2c3e50] mb-6 font-semibold flex items-center gap-3">
                    <i className="fas fa-user text-primary-orange"></i>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div className="flex flex-col">
                      <label htmlFor="name" className="text-[#2c3e50] mb-2 font-medium text-sm">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your name"
                        className="px-4 py-3 border-2 border-[#e0e0e0] rounded-lg transition-all focus:outline-none focus:border-primary-orange focus:shadow-[0_0_0_3px_rgba(255,94,77,0.1)]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="email" className="text-[#2c3e50] mb-2 font-medium text-sm">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="px-4 py-3 border-2 border-[#e0e0e0] rounded-lg transition-all focus:outline-none focus:border-primary-orange focus:shadow-[0_0_0_3px_rgba(255,94,77,0.1)]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="phone" className="text-[#2c3e50] mb-2 font-medium text-sm">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+91 XXXXX XXXXX"
                      className="px-4 py-3 border-2 border-[#e0e0e0] rounded-lg transition-all focus:outline-none focus:border-primary-orange focus:shadow-[0_0_0_3px_rgba(255,94,77,0.1)]"
                    />
                  </div>
                </div>

                {/* Design Upload */}
                <div className="border-b border-[#e0e0e0] pb-8">
                  <h3 className="text-2xl text-[#2c3e50] mb-6 font-semibold flex items-center gap-3">
                    <i className="fas fa-upload text-primary-orange"></i>
                    Upload Your Design
                  </h3>
                  <div className="relative">
                    <input
                      type="file"
                      id="file-upload"
                      accept=".stl,.obj,.3mf,.jpg,.jpeg,.png,.pdf"
                      onChange={handleFileUpload}
                      required
                      className="hidden"
                    />
                    <label htmlFor="file-upload" className={`border-2 border-dashed ${uploadedFile ? 'border-primary-orange bg-primary-orange/5' : 'border-[#ddd] bg-[#fafafa]'} rounded-xl p-10 text-center cursor-pointer transition-all hover:border-primary-orange hover:bg-primary-orange/5 flex flex-col items-center gap-3`}>
                      {uploadedFile ? (
                        <>
                          <i className="fas fa-check-circle text-5xl text-primary-orange"></i>
                          <span className="text-lg text-[#2c3e50] font-medium">{uploadedFile.name}</span>
                          <small className="text-sm text-[#666]">Click to change file</small>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-cloud-upload-alt text-5xl text-primary-orange"></i>
                          <span className="text-lg text-[#2c3e50] font-medium">Click to upload or drag & drop</span>
                          <small className="text-sm text-[#666]">Supported: STL, OBJ, 3MF</small>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Material & Color */}
                <div className="border-b border-[#e0e0e0] pb-8">
                  <h3 className="text-2xl text-[#2c3e50] mb-6 font-semibold flex items-center gap-3">
                    <i className="fas fa-layer-group text-primary-orange"></i>
                    Material & Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div className="flex flex-col">
                      <label htmlFor="material" className="text-[#2c3e50] mb-2 font-medium text-sm">Material Type *</label>
                      <select
                        id="material"
                        name="material"
                        value={formData.material}
                        onChange={handleChange}
                        required
                        className="px-4 py-3 border-2 border-[#e0e0e0] rounded-lg transition-all focus:outline-none focus:border-primary-orange focus:shadow-[0_0_0_3px_rgba(255,94,77,0.1)]"
                      >
                        <option value="">Select material</option>
                        {materials.map((mat) => (
                          <option key={mat.value} value={mat.value}>
                            {mat.label} - {mat.price}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="color" className="text-[#2c3e50] mb-2 font-medium text-sm">Color *</label>
                      <select
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        required
                        className="px-4 py-3 border-2 border-[#e0e0e0] rounded-lg transition-all focus:outline-none focus:border-primary-orange focus:shadow-[0_0_0_3px_rgba(255,94,77,0.1)]"
                      >
                        <option value="">Select color</option>
                        {colors.map((color) => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                      <label htmlFor="quantity" className="text-[#2c3e50] mb-2 font-medium text-sm">Quantity *</label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="1"
                        max="100"
                        required
                        className="px-4 py-3 border-2 border-[#e0e0e0] rounded-lg transition-all focus:outline-none focus:border-primary-orange focus:shadow-[0_0_0_3px_rgba(255,94,77,0.1)]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="deliveryOption" className="text-[#2c3e50] mb-2 font-medium text-sm">Delivery Speed *</label>
                      <select
                        id="deliveryOption"
                        name="deliveryOption"
                        value={formData.deliveryOption}
                        onChange={handleChange}
                        required
                        className="px-4 py-3 border-2 border-[#e0e0e0] rounded-lg transition-all focus:outline-none focus:border-primary-orange focus:shadow-[0_0_0_3px_rgba(255,94,77,0.1)]"
                      >
                        <option value="standard">Standard (7-10 days) - Free</option>
                        <option value="express">Express (3-5 days) - ₹200</option>
                        <option value="urgent">Urgent (1-2 days) - ₹500</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div>
                  <h3 className="text-2xl text-[#2c3e50] mb-6 font-semibold flex items-center gap-3">
                    <i className="fas fa-comment-dots text-primary-orange"></i>
                    Additional Details
                  </h3>
                  <div className="flex flex-col">
                    <label htmlFor="description" className="text-[#2c3e50] mb-2 font-medium text-sm">Project Description (Optional)</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Tell us more about your project, specific requirements, dimensions, or any special instructions..."
                      className="px-4 py-3 border-2 border-[#e0e0e0] rounded-lg transition-all resize-y focus:outline-none focus:border-primary-orange focus:shadow-[0_0_0_3px_rgba(255,94,77,0.1)]"
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={submitted} className="bg-gradient-to-br from-primary-orange to-[#ff3b29] text-white text-lg font-semibold px-10 py-4 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(255,94,77,0.35)] flex items-center justify-center gap-3">
                  {submitted ? (
                    <>
                      <i className="fas fa-check-circle"></i>
                      Request Submitted!
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Submit Request
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Info Sidebar */}
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.08)] p-6">
                <i className="fas fa-info-circle text-3xl text-primary-orange mb-4 inline-block"></i>
                <h4 className="text-xl text-[#2c3e50] mb-4 font-semibold">How It Works</h4>
                <ol className="list-decimal list-inside space-y-2 text-[#555] leading-relaxed">
                  <li>Fill out the form with your details</li>
                  <li>Upload your 3D model or design image</li>
                  <li>Select material and specifications</li>
                  <li>Submit your request</li>
                  <li>We'll review and send you a quote</li>
                  <li>Approve and we'll start printing!</li>
                </ol>
              </div>

              <div className="bg-white rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.08)] p-6">
                <i className="fas fa-clock text-3xl text-primary-orange mb-4 inline-block"></i>
                <h4 className="text-xl text-[#2c3e50] mb-4 font-semibold">Turnaround Time</h4>
                <ul className="space-y-2 text-[#555] leading-relaxed">
                  <li><strong>Standard:</strong> 7-10 business days</li>
                  <li><strong>Express:</strong> 3-5 business days</li>
                  <li><strong>Urgent:</strong> 1-2 business days</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.08)] p-6">
                <i className="fas fa-dollar-sign text-3xl text-primary-orange mb-4 inline-block"></i>
                <h4 className="text-xl text-[#2c3e50] mb-4 font-semibold">Pricing</h4>
                <p className="text-[#555] mb-3">Final price depends on:</p>
                <ul className="space-y-2 text-[#555] leading-relaxed mb-4">
                  <li>Model size & complexity</li>
                  <li>Material type</li>
                  <li>Quantity ordered</li>
                  <li>Delivery speed</li>
                </ul>
                <p className="text-sm text-[#666] bg-[#f5f5f5] p-3 rounded-lg">You'll receive a detailed quote within 24 hours</p>
              </div>

              <div className="bg-white rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.08)] p-6">
                <i className="fas fa-headset text-3xl text-primary-orange mb-4 inline-block"></i>
                <h4 className="text-xl text-[#2c3e50] mb-4 font-semibold">Need Help?</h4>
                <p className="text-[#555] mb-2">Contact our team:</p>
                <p className="text-[#555] mb-2"><strong>Email:</strong> support@robohatch.com</p>
                <p className="text-[#555]"><strong>Phone:</strong> +91 XXXXX XXXXX</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
