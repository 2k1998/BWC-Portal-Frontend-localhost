// src/pages/ProjectsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { projectApi, companyApi, authApi } from '../api/apiService';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import './Projects.css';

const PROJECT_TYPES = {
  new_store: 'New Store',
  renovation: 'Renovation',
  maintenance: 'Maintenance',
  expansion: 'Expansion',
  other: 'Other'
};

const PROJECT_STATUSES = {
  planning: 'Planning',
  in_progress: 'In Progress',
  completed: 'Completed',
  on_hold: 'On Hold',
  cancelled: 'Cancelled'
};

function ProjectsPage() {
  const { currentUser, accessToken } = useAuth();
  const { showNotification } = useNotification();

  const [projects, setProjects] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Filters and sorting
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const canManageProjects = ['admin', 'Manager', 'Head'].includes(currentUser?.role);

  const fetchProjects = useCallback(async () => {
    if (!accessToken) return;
    
    setLoading(true);
    try {
      const params = {
        skip: 0,
        limit: 100,
        sort_by: sortBy,
        sort_order: sortOrder
      };

      if (statusFilter !== 'all') params.status_filter = statusFilter;
      if (typeFilter !== 'all') params.project_type_filter = typeFilter;
      if (companyFilter !== 'all') params.company_id = companyFilter;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const [projectsData, statsData] = await Promise.all([
        projectApi.getAll(accessToken, params),
        projectApi.getStats(accessToken)
      ]);

      setProjects(projectsData);
      setStats(statsData);
    } catch (error) {
      showNotification(error.message || 'Failed to fetch projects', 'error');
    } finally {
      setLoading(false);
    }
  }, [accessToken, statusFilter, typeFilter, companyFilter, searchTerm, sortBy, sortOrder, showNotification]);

  const fetchCompaniesAndUsers = useCallback(async () => {
    if (!accessToken) return;
    
    try {
      const [companiesData, usersData] = await Promise.all([
        companyApi.getAll(accessToken),
        authApi.listAllUsers(accessToken)
      ]);
      
      setCompanies(companiesData);
      setUsers(usersData);
    } catch (error) {
      showNotification(error.message || 'Failed to fetch companies and users', 'error');
    }
  }, [accessToken, showNotification]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchCompaniesAndUsers();
  }, [fetchCompaniesAndUsers]);

  const handleCreateProject = async (projectData) => {
    try {
      await projectApi.create(projectData, accessToken);
      showNotification('Project created successfully!', 'success');
      setShowCreateForm(false);
      fetchProjects();
    } catch (error) {
      showNotification(error.message || 'Failed to create project', 'error');
    }
  };

  const handleUpdateProject = async (projectData) => {
    try {
      await projectApi.update(editingProject.id, projectData, accessToken);
      showNotification('Project updated successfully!', 'success');
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      showNotification(error.message || 'Failed to update project', 'error');
    }
  };

  const handleDeleteProject = async (projectId, projectName) => {
    if (!window.confirm(`Are you sure you want to delete "${projectName}"?`)) return;
    
    try {
      await projectApi.delete(projectId, accessToken);
      showNotification('Project deleted successfully!', 'success');
      fetchProjects();
    } catch (error) {
      showNotification(error.message || 'Failed to delete project', 'error');
    }
  };

  const handleStatusUpdate = async (projectId, statusData) => {
    try {
      await projectApi.updateStatus(projectId, statusData, accessToken);
      showNotification('Project status updated successfully!', 'success');
      fetchProjects();
    } catch (error) {
      showNotification(error.message || 'Failed to update project status', 'error');
    }
  };

  const resetFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setCompanyFilter('all');
    setSearchTerm('');
    setSortBy('created_at');
    setSortOrder('desc');
  };

  if (loading && projects.length === 0) {
    return <div className="loading-spinner">Loading projects...</div>;
  }

  return (
    <div className="projects-container">
      {/* Header */}
      <div className="projects-header">
        <div className="header-left">
          <h1>Projects</h1>
          {stats && (
            <div className="projects-stats">
              <div className="stat-item">
                <span className="stat-number">{stats.total_projects}</span>
                <span className="stat-label">Total</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.active_projects}</span>
                <span className="stat-label">Active</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.completion_rate}%</span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
          )}
        </div>
        
        {canManageProjects && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateForm(true)}
          >
            <span className="btn-icon">+</span>
            New Project
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="projects-filters">
        <div className="filters-row">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              {Object.entries(PROJECT_STATUSES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              {Object.entries(PROJECT_TYPES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select 
              value={companyFilter} 
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Companies</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select 
              value={`${sortBy}-${sortOrder}`} 
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="filter-select"
            >
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="expected_completion_date-asc">Due Date</option>
              <option value="progress_percentage-desc">Progress</option>
            </select>
          </div>

          <button onClick={resetFilters} className="btn btn-outline">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-content">
        {projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No projects found</h3>
            <p>
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || companyFilter !== 'all'
                ? 'Try adjusting your filters to see more projects.'
                : canManageProjects 
                  ? 'Get started by creating your first project.'
                  : 'No projects have been created yet.'
              }
            </p>
            {canManageProjects && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreateForm(true)}
              >
                Create First Project
              </button>
            )}
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                companies={companies}
                users={users}
                canManage={canManageProjects}
                onEdit={(project) => setEditingProject(project)}
                onDelete={handleDeleteProject}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingProject) && (
        <ProjectForm
          project={editingProject}
          companies={companies}
          users={users}
          onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
          onCancel={() => {
            setShowCreateForm(false);
            setEditingProject(null);
          }}
        />
      )}
    </div>
  );
}

export default ProjectsPage;