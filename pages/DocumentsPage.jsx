import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { documentApi } from '../api/apiService';
import DocumentCard from '../components/DocumentCard';
import DocumentUploadForm from '../components/DocumentUploadForm';
import './Documents.css';

function DocumentsPage() {
  const { currentUser, accessToken } = useAuth();
  const { showNotification } = useNotification();
  
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  
  const isAdmin = currentUser?.role === 'admin';
  
  const fetchDocuments = useCallback(async () => {
    if (!accessToken) return;
    
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory !== 'all') params.category = selectedCategory;
      
      const data = await documentApi.getAll(accessToken, params);
      setDocuments(data);
    } catch (error) {
      showNotification(error.message || 'Failed to fetch documents', 'error');
    } finally {
      setLoading(false);
    }
  }, [accessToken, searchTerm, selectedCategory, showNotification]);
  
  const fetchCategories = useCallback(async () => {
    if (!accessToken) return;
    
    try {
      const data = await documentApi.getCategories(accessToken);
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, [accessToken]);
  
  useEffect(() => {
    fetchDocuments();
    fetchCategories();
  }, [fetchDocuments, fetchCategories]);
  
  const handleUploadSuccess = () => {
    setShowUploadForm(false);
    fetchDocuments();
    fetchCategories();
    showNotification('Document uploaded successfully!', 'success');
  };
  
  const handleDelete = async (documentId, documentTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${documentTitle}"?`)) return;
    
    try {
      await documentApi.delete(documentId, accessToken);
      showNotification('Document deleted successfully!', 'success');
      fetchDocuments();
    } catch (error) {
      showNotification(error.message || 'Failed to delete document', 'error');
    }
  };
  
  const handleDownload = async (documentId, filename) => {
    try {
      const blob = await documentApi.download(documentId, accessToken);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showNotification(error.message || 'Failed to download document', 'error');
    }
  };
  
  const filteredDocuments = documents;
  
  return (
    <div className="documents-container">
      <div className="documents-header">
        <div>
          <h1>Useful Documents</h1>
          <p>Access and download important documents and resources</p>
        </div>
        {isAdmin && (
          <button 
            className="btn-primary"
            onClick={() => setShowUploadForm(true)}
          >
            <span className="icon">📤</span> Upload Document
          </button>
        )}
      </div>
      
      <div className="documents-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      
      {loading ? (
        <div className="loading-spinner">Loading documents...</div>
      ) : filteredDocuments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>No documents found</h3>
          <p>
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your filters'
              : isAdmin 
                ? 'Upload your first document to get started'
                : 'No documents have been uploaded yet'}
          </p>
        </div>
      ) : (
        <div className="documents-grid">
          {filteredDocuments.map(document => (
            <DocumentCard
              key={document.id}
              document={document}
              isAdmin={isAdmin}
              onDelete={handleDelete}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
      
      {showUploadForm && (
        <DocumentUploadForm
          onClose={() => setShowUploadForm(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}

export default DocumentsPage;


