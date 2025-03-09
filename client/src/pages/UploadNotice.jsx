import React, { useState } from 'react';
import { FileText, Upload, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function UploadNotice() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pdf: null
  });
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ success: false, error: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setFormData({
          ...formData,
          pdf: file
        });
        setFileName(file.name);
        setFileSelected(true);
        setUploadStatus({ success: false, error: '' });
      } else {
        setUploadStatus({ success: false, error: 'Please upload a PDF file only' });
        setFileSelected(false);
        setFileName('');
      }
    }
  };

  const removeFile = () => {
    setFormData({
      ...formData,
      pdf: null
    });
    setFileSelected(false);
    setFileName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadStatus({ success: false, error: '' });
    
    try {
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      
      if (formData.pdf) {
        uploadData.append('pdf', formData.pdf);
      }
      
      const res = await fetch('/api/manager/upload_notice', {
        method: 'POST',
        body: uploadData,
      });
      
      const data = await res.json();
      
      if (data.success === false) {
        setUploadStatus({ success: false, error: data.message || 'Failed to upload notice' });
      } else {
        setUploadStatus({ success: true, error: '' });
        
        // Reset form after successful upload
        setTimeout(() => {
          setFormData({
            title: '',
            description: '',
            pdf: null
          });
          setFileSelected(false);
          setFileName('');
        }, 2000);
      }
    } catch (error) {
      setUploadStatus({ success: false, error: 'Failed to upload notice. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-12">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Create Notice
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Publish important announcements and information for students
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              {/* Notice Title Input */}
              <div className="relative">
                <label htmlFor="title" className="text-sm font-medium text-gray-700 block mb-2">
                  Notice Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter notice title"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>
              </div>

              {/* Notice Description Input */}
              <div className="relative">
                <label htmlFor="description" className="text-sm font-medium text-gray-700 block mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Enter notice details"
                  rows="6"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                ></textarea>
              </div>

              {/* File Upload Section */}
              <div className="relative">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Attachment (PDF)
                </label>
                {!fileSelected ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:bg-blue-50/30 transition duration-200">
                    <input
                      type="file"
                      id="pdf"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="pdf" className="cursor-pointer">
                      <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                        <Upload className="h-8 w-8 text-blue-500" />
                      </div>
                      <p className="text-gray-700 font-medium">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500 mt-1">PDF files only (up to 10MB)</p>
                    </label>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-3 rounded-xl bg-red-100 mr-3">
                          <FileText className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">{fileName}</p>
                          <p className="text-sm text-gray-500">
                            {formData.pdf && formData.pdf.size
                              ? (formData.pdf.size / (1024 * 1024)).toFixed(2) + ' MB'
                              : ''}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="bg-red-100 text-red-500 p-2 rounded-full hover:bg-red-200 transition duration-200"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Error/Success Messages */}
            {uploadStatus.error && (
              <div className="bg-red-100 text-red-600 px-6 py-4 rounded-2xl text-base flex items-center shadow-md border border-red-200">
                <AlertCircle className="h-6 w-6 mr-3 flex-shrink-0" />
                <span>{uploadStatus.error}</span>
              </div>
            )}
            
            {uploadStatus.success && (
              <div className="bg-green-100 text-green-600 px-6 py-4 rounded-2xl text-base flex items-center shadow-md border border-green-200">
                <CheckCircle className="h-6 w-6 mr-3 flex-shrink-0" />
                <span>Notice uploaded successfully!</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-2 ${
                uploading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <span>Publish Notice</span>
                  <Upload className="h-5 w-5 ml-2" />
                </>
              )}
            </button>

            {/* Additional Info */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
              <p className="text-sm text-blue-600">
                Only administrators can create and publish notices.
                <br />All notices will be visible to students immediately after publishing.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}