/* eslint-disable react-refresh/only-export-components */
// src/context/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};

const translations = {
    en: {
        // Navigation & Menu
        dashboard: 'Dashboard',
        tasks: 'Tasks',
        projects: 'Projects',
        companies: 'Companies',
        contacts: 'Contacts',
        daily_calls: 'Daily Calls',
        groups: 'Groups',
        events: 'Events',
        documents: 'Documents',
        users: 'Users',
        reports: 'Reports',
        admin_panel: 'Admin Panel',
        payments: 'Payments',
        commissions: 'Commissions',
        car_finance: 'Car Finance',
        profile: 'Profile',
        logout: 'Logout',
        login: 'Login',
        register: 'Register',
        
        // Dashboard Page
        welcome: 'Welcome',
        welcome_back: 'Welcome Back',
        dashboard_overview: 'Dashboard Overview',
        recent_activity: 'Recent Activity',
        quick_stats: 'Quick Statistics',
        tasks_summary: 'Tasks Summary',
        pending_tasks: 'Pending Tasks',
        completed_tasks: 'Completed Tasks',
        in_progress_tasks: 'In Progress Tasks',
        upcoming_events: 'Upcoming Events',
        recent_companies: 'Recent Companies',
        total_revenue: 'Total Revenue',
        monthly_target: 'Monthly Target',
        
        // Task Management
        task_management: 'Task Management',
        new_task: 'New Task',
        edit_task: 'Edit Task',
        delete_task: 'Delete Task',
        task_title: 'Task Title',
        task_description: 'Task Description',
        task_status: 'Task Status',
        task_priority: 'Task Priority',
        task_assignee: 'Assignee',
        due_date: 'Due Date',
        start_date: 'Start Date',
        completed_date: 'Completed Date',
        my_tasks: 'My Tasks',
        all_tasks: 'All Tasks',
        assigned_tasks: 'Assigned Tasks',
        task_details: 'Task Details',
        mark_complete: 'Mark as Complete',
        reopen_task: 'Reopen Task',
        high_priority: 'High Priority',
        medium_priority: 'Medium Priority',
        low_priority: 'Low Priority',
        
        // Company Management
        company_management: 'Company Management',
        new_company: 'New Company',
        edit_company: 'Edit Company',
        company_details: 'Company Details',
        company_name: 'Company Name',
        company_email: 'Company Email',
        company_phone: 'Company Phone',
        company_address: 'Company Address',
        company_website: 'Website',
        company_tax_number: 'Tax Number',
        company_registration: 'Registration Number',
        company_type: 'Company Type',
        company_status: 'Company Status',
        contact_person: 'Contact Person',
        
        // Contact Management
        contact_management: 'Contact Management',
        new_contact: 'New Contact',
        edit_contact: 'Edit Contact',
        contact_name: 'Contact Name',
        contact_email: 'Email',
        contact_phone: 'Phone',
        contact_mobile: 'Mobile',
        contact_position: 'Position',
        contact_department: 'Department',
        contact_notes: 'Notes',
        import_contacts: 'Import Contacts',
        export_contacts: 'Export Contacts',
        
        // Daily Calls
        scheduled_calls: 'Scheduled Calls',
        call_history: 'Call History',
        new_call: 'New Call',
        call_date: 'Call Date',
        call_time: 'Call Time',
        call_duration: 'Duration',
        call_notes: 'Call Notes',
        call_outcome: 'Outcome',
        follow_up_required: 'Follow-up Required',
        next_call_date: 'Next Call Date',
        
        // User Management
        user_management: 'User Management',
        new_user: 'New User',
        edit_user: 'Edit User',
        username: 'Username',
        email: 'Email',
        password: 'Password',
        confirm_password: 'Confirm Password',
        role: 'Role',
        permissions: 'Permissions',
        user_status: 'Status',
        last_login: 'Last Login',
        created_at: 'Created At',
        activate_user: 'Activate User',
        deactivate_user: 'Deactivate User',
        reset_password: 'Reset Password',
        
        // Events
        event_management: 'Event Management',
        new_event: 'New Event',
        edit_event: 'Edit Event',
        event_title: 'Event Title',
        event_description: 'Event Description',
        event_date: 'Event Date',
        event_time: 'Event Time',
        event_location: 'Location',
        event_type: 'Event Type',
        attendees: 'Attendees',
        
        // Projects
        project_management: 'Project Management',
        new_project: 'New Project',
        edit_project: 'Edit Project',
        project_name: 'Project Name',
        project_description: 'Project Description',
        project_status: 'Project Status',
        project_budget: 'Budget',
        project_deadline: 'Deadline',
        project_manager: 'Project Manager',
        team_members: 'Team Members',
        
        // Documents
        document_management: 'Document Management',
        upload_document: 'Upload Document',
        document_name: 'Document Name',
        document_type: 'Document Type',
        file_size: 'File Size',
        uploaded_by: 'Uploaded By',
        upload_date: 'Upload Date',
        download: 'Download',
        preview: 'Preview',
        
        // Payments
        payment_management: 'Payment Management',
        new_payment: 'New Payment',
        payment_amount: 'Amount',
        payment_date: 'Payment Date',
        payment_method: 'Payment Method',
        payment_status: 'Payment Status',
        invoice_number: 'Invoice Number',
        
        // Reports
        generate_report: 'Generate Report',
        report_type: 'Report Type',
        date_range: 'Date Range',
        from_date: 'From Date',
        to_date: 'To Date',
        export_pdf: 'Export PDF',
        export_excel: 'Export Excel',
        
        // Common Actions
        add: 'Add',
        edit: 'Edit',
        delete: 'Delete',
        save: 'Save',
        cancel: 'Cancel',
        submit: 'Submit',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        refresh: 'Refresh',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        view: 'View',
        select: 'Select',
        upload: 'Upload',
        clear: 'Clear',
        reset: 'Reset',
        apply: 'Apply',
        confirm: 'Confirm',
        
        // Status
        status: 'Status',
        active: 'Active',
        inactive: 'Inactive',
        pending: 'Pending',
        completed: 'Completed',
        in_progress: 'In Progress',
        approved: 'Approved',
        rejected: 'Rejected',
        draft: 'Draft',
        published: 'Published',
        archived: 'Archived',
        
        // Messages
        loading: 'Loading...',
        no_data: 'No data available',
        no_results: 'No results found',
        error: 'Error',
        success: 'Success',
        warning: 'Warning',
        info: 'Information',
        confirm_delete: 'Are you sure you want to delete this item?',
        confirm_action: 'Are you sure you want to proceed?',
        saved_successfully: 'Saved successfully',
        updated_successfully: 'Updated successfully',
        deleted_successfully: 'Deleted successfully',
        operation_failed: 'Operation failed',
        please_wait: 'Please wait...',
        required_field: 'This field is required',
        invalid_email: 'Invalid email address',
        invalid_phone: 'Invalid phone number',
        
        // Table Headers
        name: 'Name',
        phone: 'Phone',
        address: 'Address',
        date: 'Date',
        time: 'Time',
        description: 'Description',
        actions: 'Actions',
        created_by: 'Created By',
        updated_by: 'Updated By',
        
        // Time
        today: 'Today',
        yesterday: 'Yesterday',
        tomorrow: 'Tomorrow',
        this_week: 'This Week',
        last_week: 'Last Week',
        this_month: 'This Month',
        last_month: 'Last Month',
        this_year: 'This Year',
        
        // Login/Auth
        sign_in: 'Sign In',
        sign_up: 'Sign Up',
        forgot_password: 'Forgot Password?',
        remember_me: 'Remember Me',
        dont_have_account: "Don't have an account?",
        already_have_account: 'Already have an account?',
        
        // Roles
        admin: 'Administrator',
        manager: 'Manager',
        employee: 'Employee',
        client: 'Client',
        
        // Additional missing translations
        title: 'Title',
        phone_number: 'Phone Number',
        company: 'Company',
        job_title: 'Job Title',
        notes: 'Notes',
        add_new_contact: 'Add New Contact',
        save_changes: 'Save Changes',
        add_contact: 'Add Contact',
        task_history: 'Task History',
        added_comment: 'added comment',
        changed_status_from_to: 'changed status from {{from}} to {{to}}',
        all_day: 'All Day',
        urgent_and_important: 'Urgent & Important',
        not_urgent_not_important: 'Not Urgent, Not Important',
        no_completed_tasks_yet: 'No completed tasks yet.',
        mark_incomplete: 'Mark as Incomplete',
        all_statuses: 'All Statuses',
        new: 'New',
        received: 'Received',
        on_process: 'On Process',
        loose_end: 'Loose End',
        failed_to_fetch_tasks: 'Failed to fetch tasks',
        task_created_success: 'Task created successfully',
        failed_to_create_task: 'Failed to create task',
        task_marked_completed: 'Task marked as completed',
        task_marked_incomplete: 'Task marked as incomplete',
        failed_to_update_task_status: 'Failed to update task status',
        task_deleted_success: 'Task deleted successfully',
        failed_to_delete_task: 'Failed to delete task',
        event_required_fields: 'Please fill in all required fields',
        event_created_success: 'Event created successfully',
        failed_to_create_event: 'Failed to create event',
        create_new_event_title: 'Create New Event',
        creating_event: 'Creating...',
        description_optional: 'Description (Optional)',
        select_event_date_time: 'Select event date and time',
        cannot_change_own_role: 'Cannot change your own role',
        role_updated: 'Role updated successfully',
        cannot_delete_own_account: 'Cannot delete your own account',
        user_deleted: 'User deleted successfully',
        search_users_placeholder: 'Search users...',
        Month: 'Month',
        Week: 'Week',
        Day: 'Day',
        Agenda: 'Agenda',
        
        // Additional task-related translations
        All_Statuses: 'All Statuses',
        starts: 'Starts',
        hide_create_task_form: 'Hide Create Task Form',
        create_new_task: 'Create New Task',
        add_task: 'Add Task',
        company_required: 'Company',
        select_a_company: 'Select a company...',
        department: 'Department',
        select_a_department: 'Select a department...',
        assign_to_user: 'Assign to User (Optional)',
        assign_to_self: 'Assign to Myself (Default)',
        all_day_deadline: 'All Day Deadline',
        urgent_checkbox: 'Urgent',
        important_checkbox: 'Important',
        select_date_time: 'Select date and time',
        no_companies_found: 'No companies found',
        
        // Additional missing translations
        confirm_delete_task: 'Are you sure you want to delete this task?',
        urgent_only: 'Urgent Only',
        important_only: 'Important Only'
    },
    
    el: {
        // Navigation & Menu
        dashboard: 'Πίνακας Ελέγχου',
        tasks: 'Εργασίες',
        projects: 'Έργα',
        companies: 'Εταιρείες',
        contacts: 'Επαφές',
        daily_calls: 'Καθημερινές Κλήσεις',
        groups: 'Ομάδες',
        events: 'Εκδηλώσεις',
        documents: 'Έγγραφα',
        users: 'Χρήστες',
        reports: 'Αναφορές',
        admin_panel: 'Πίνακας Διαχειριστή',
        payments: 'Πληρωμές',
        commissions: 'Προμήθειες',
        car_finance: 'Χρηματοδότηση Αυτοκινήτου',
        profile: 'Προφίλ',
        logout: 'Αποσύνδεση',
        login: 'Σύνδεση',
        register: 'Εγγραφή',
        
        // Dashboard Page
        welcome: 'Καλώς ήρθες',
        welcome_back: 'Καλώς ήρθες πίσω',
        dashboard_overview: 'Επισκόπηση Πίνακα',
        recent_activity: 'Πρόσφατη Δραστηριότητα',
        quick_stats: 'Γρήγορα Στατιστικά',
        tasks_summary: 'Σύνοψη Εργασιών',
        pending_tasks: 'Εκκρεμείς Εργασίες',
        completed_tasks: 'Ολοκληρωμένες Εργασίες',
        in_progress_tasks: 'Εργασίες σε Εξέλιξη',
        upcoming_events: 'Επερχόμενες Εκδηλώσεις',
        recent_companies: 'Πρόσφατες Εταιρείες',
        total_revenue: 'Συνολικά Έσοδα',
        monthly_target: 'Μηνιαίος Στόχος',
        
        // Task Management
        task_management: 'Διαχείριση Εργασιών',
        new_task: 'Νέα Εργασία',
        edit_task: 'Επεξεργασία Εργασίας',
        delete_task: 'Διαγραφή Εργασίας',
        task_title: 'Τίτλος Εργασίας',
        task_description: 'Περιγραφή Εργασίας',
        task_status: 'Κατάσταση Εργασίας',
        task_priority: 'Προτεραιότητα Εργασίας',
        task_assignee: 'Ανατέθηκε σε',
        due_date: 'Ημερομηνία Λήξης',
        start_date: 'Ημερομηνία Έναρξης',
        completed_date: 'Ημερομηνία Ολοκλήρωσης',
        my_tasks: 'Οι Εργασίες μου',
        all_tasks: 'Όλες οι Εργασίες',
        assigned_tasks: 'Ανατεθειμένες Εργασίες',
        task_details: 'Λεπτομέρειες Εργασίας',
        mark_complete: 'Σήμανση ως Ολοκληρωμένη',
        reopen_task: 'Επαναφορά Εργασίας',
        high_priority: 'Υψηλή Προτεραιότητα',
        medium_priority: 'Μεσαία Προτεραιότητα',
        low_priority: 'Χαμηλή Προτεραιότητα',
        
        // Company Management
        company_management: 'Διαχείριση Εταιρειών',
        new_company: 'Νέα Εταιρεία',
        edit_company: 'Επεξεργασία Εταιρείας',
        company_details: 'Στοιχεία Εταιρείας',
        company_name: 'Όνομα Εταιρείας',
        company_email: 'Email Εταιρείας',
        company_phone: 'Τηλέφωνο Εταιρείας',
        company_address: 'Διεύθυνση Εταιρείας',
        company_website: 'Ιστοσελίδα',
        company_tax_number: 'ΑΦΜ',
        company_registration: 'Αριθμός Μητρώου',
        company_type: 'Τύπος Εταιρείας',
        company_status: 'Κατάσταση Εταιρείας',
        contact_person: 'Υπεύθυνος Επικοινωνίας',
        
        // Contact Management
        contact_management: 'Διαχείριση Επαφών',
        new_contact: 'Νέα Επαφή',
        edit_contact: 'Επεξεργασία Επαφής',
        contact_name: 'Όνομα Επαφής',
        contact_email: 'Email',
        contact_phone: 'Τηλέφωνο',
        contact_mobile: 'Κινητό',
        contact_position: 'Θέση',
        contact_department: 'Τμήμα',
        contact_notes: 'Σημειώσεις',
        import_contacts: 'Εισαγωγή Επαφών',
        export_contacts: 'Εξαγωγή Επαφών',
        
        // Daily Calls
        scheduled_calls: 'Προγραμματισμένες Κλήσεις',
        call_history: 'Ιστορικό Κλήσεων',
        new_call: 'Νέα Κλήση',
        call_date: 'Ημερομηνία Κλήσης',
        call_time: 'Ώρα Κλήσης',
        call_duration: 'Διάρκεια',
        call_notes: 'Σημειώσεις Κλήσης',
        call_outcome: 'Αποτέλεσμα',
        follow_up_required: 'Απαιτείται Συνέχεια',
        next_call_date: 'Επόμενη Κλήση',
        
        // User Management
        user_management: 'Διαχείριση Χρηστών',
        new_user: 'Νέος Χρήστης',
        edit_user: 'Επεξεργασία Χρήστη',
        username: 'Όνομα Χρήστη',
        email: 'Email',
        password: 'Κωδικός',
        confirm_password: 'Επιβεβαίωση Κωδικού',
        role: 'Ρόλος',
        permissions: 'Δικαιώματα',
        user_status: 'Κατάσταση',
        last_login: 'Τελευταία Σύνδεση',
        created_at: 'Δημιουργήθηκε',
        activate_user: 'Ενεργοποίηση Χρήστη',
        deactivate_user: 'Απενεργοποίηση Χρήστη',
        reset_password: 'Επαναφορά Κωδικού',
        
        // Events
        event_management: 'Διαχείριση Εκδηλώσεων',
        new_event: 'Νέα Εκδήλωση',
        edit_event: 'Επεξεργασία Εκδήλωσης',
        event_title: 'Τίτλος Εκδήλωσης',
        event_description: 'Περιγραφή Εκδήλωσης',
        event_date: 'Ημερομηνία Εκδήλωσης',
        event_time: 'Ώρα Εκδήλωσης',
        event_location: 'Τοποθεσία',
        event_type: 'Τύπος Εκδήλωσης',
        attendees: 'Συμμετέχοντες',
        
        // Projects
        project_management: 'Διαχείριση Έργων',
        new_project: 'Νέο Έργο',
        edit_project: 'Επεξεργασία Έργου',
        project_name: 'Όνομα Έργου',
        project_description: 'Περιγραφή Έργου',
        project_status: 'Κατάσταση Έργου',
        project_budget: 'Προϋπολογισμός',
        project_deadline: 'Προθεσμία',
        project_manager: 'Υπεύθυνος Έργου',
        team_members: 'Μέλη Ομάδας',
        
        // Documents
        document_management: 'Διαχείριση Εγγράφων',
        upload_document: 'Μεταφόρτωση Εγγράφου',
        document_name: 'Όνομα Εγγράφου',
        document_type: 'Τύπος Εγγράφου',
        file_size: 'Μέγεθος Αρχείου',
        uploaded_by: 'Μεταφορτώθηκε από',
        upload_date: 'Ημερομηνία Μεταφόρτωσης',
        download: 'Λήψη',
        preview: 'Προεπισκόπηση',
        
        // Payments
        payment_management: 'Διαχείριση Πληρωμών',
        new_payment: 'Νέα Πληρωμή',
        payment_amount: 'Ποσό',
        payment_date: 'Ημερομηνία Πληρωμής',
        payment_method: 'Τρόπος Πληρωμής',
        payment_status: 'Κατάσταση Πληρωμής',
        invoice_number: 'Αριθμός Τιμολογίου',
        
        // Reports
        generate_report: 'Δημιουργία Αναφοράς',
        report_type: 'Τύπος Αναφοράς',
        date_range: 'Εύρος Ημερομηνιών',
        from_date: 'Από Ημερομηνία',
        to_date: 'Έως Ημερομηνία',
        export_pdf: 'Εξαγωγή PDF',
        export_excel: 'Εξαγωγή Excel',
        
        // Common Actions
        add: 'Προσθήκη',
        edit: 'Επεξεργασία',
        delete: 'Διαγραφή',
        save: 'Αποθήκευση',
        cancel: 'Ακύρωση',
        submit: 'Υποβολή',
        search: 'Αναζήτηση',
        filter: 'Φίλτρο',
        sort: 'Ταξινόμηση',
        refresh: 'Ανανέωση',
        close: 'Κλείσιμο',
        back: 'Πίσω',
        next: 'Επόμενο',
        previous: 'Προηγούμενο',
        view: 'Προβολή',
        select: 'Επιλογή',
        upload: 'Μεταφόρτωση',
        clear: 'Καθαρισμός',
        reset: 'Επαναφορά',
        apply: 'Εφαρμογή',
        confirm: 'Επιβεβαίωση',
        
        // Status
        status: 'Κατάσταση',
        active: 'Ενεργό',
        inactive: 'Ανενεργό',
        pending: 'Εκκρεμεί',
        completed: 'Ολοκληρωμένο',
        in_progress: 'Σε Εξέλιξη',
        approved: 'Εγκεκριμένο',
        rejected: 'Απορριφθέν',
        draft: 'Πρόχειρο',
        published: 'Δημοσιευμένο',
        archived: 'Αρχειοθετημένο',
        
        // Messages
        loading: 'Φόρτωση...',
        no_data: 'Δεν υπάρχουν διαθέσιμα δεδομένα',
        no_results: 'Δεν βρέθηκαν αποτελέσματα',
        error: 'Σφάλμα',
        success: 'Επιτυχία',
        warning: 'Προειδοποίηση',
        info: 'Πληροφορία',
        confirm_delete: 'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το στοιχείο;',
        confirm_action: 'Είστε σίγουροι ότι θέλετε να συνεχίσετε;',
        saved_successfully: 'Αποθηκεύτηκε επιτυχώς',
        updated_successfully: 'Ενημερώθηκε επιτυχώς',
        deleted_successfully: 'Διαγράφηκε επιτυχώς',
        operation_failed: 'Η λειτουργία απέτυχε',
        please_wait: 'Παρακαλώ περιμένετε...',
        required_field: 'Αυτό το πεδίο είναι υποχρεωτικό',
        invalid_email: 'Μη έγκυρη διεύθυνση email',
        invalid_phone: 'Μη έγκυρος αριθμός τηλεφώνου',
        
        // Table Headers
        name: 'Όνομα',
        phone: 'Τηλέφωνο',
        address: 'Διεύθυνση',
        date: 'Ημερομηνία',
        time: 'Ώρα',
        description: 'Περιγραφή',
        actions: 'Ενέργειες',
        created_by: 'Δημιουργήθηκε από',
        updated_by: 'Ενημερώθηκε από',
        
        // Time
        today: 'Σήμερα',
        yesterday: 'Χθες',
        tomorrow: 'Αύριο',
        this_week: 'Αυτή την Εβδομάδα',
        last_week: 'Προηγούμενη Εβδομάδα',
        this_month: 'Αυτόν τον Μήνα',
        last_month: 'Προηγούμενος Μήνας',
        this_year: 'Φέτος',
        
        // Login/Auth
        sign_in: 'Σύνδεση',
        sign_up: 'Εγγραφή',
        forgot_password: 'Ξεχάσατε τον κωδικό;',
        remember_me: 'Να με θυμάσαι',
        dont_have_account: 'Δεν έχετε λογαριασμό;',
        already_have_account: 'Έχετε ήδη λογαριασμό;',
        
        // Roles
        admin: 'Διαχειριστής',
        manager: 'Διευθυντής',
        employee: 'Υπάλληλος',
        client: 'Πελάτης',
        
        // Additional missing translations
        title: 'Τίτλος',
        phone_number: 'Τηλέφωνο',
        company: 'Εταιρεία',
        job_title: 'Θέση Εργασίας',
        notes: 'Σημειώσεις',
        add_new_contact: 'Προσθήκη Νέας Επαφής',
        save_changes: 'Αποθήκευση Αλλαγών',
        add_contact: 'Προσθήκη Επαφής',
        task_history: 'Ιστορικό Εργασίας',
        added_comment: 'προσέθεσε σχόλιο',
        changed_status_from_to: 'άλλαξε την κατάσταση από {{from}} σε {{to}}',
        all_day: 'Ολόκληρη ημέρα',
        urgent_and_important: 'Επείγον & Σημαντικό',
        not_urgent_not_important: 'Ούτε Επείγον, Ούτε Σημαντικό',
        no_completed_tasks_yet: 'Δεν υπάρχουν ολοκληρωμένες εργασίες ακόμη.',
        mark_incomplete: 'Σήμανση ως Μη Ολοκληρωμένη',
        all_statuses: 'Όλες οι Καταστάσεις',
        new: 'Νέο',
        received: 'Λήφθηκε',
        on_process: 'Σε Εξέλιξη',
        loose_end: 'Ανολοκλήρωτο',
        failed_to_fetch_tasks: 'Αποτυχία ανάκτησης εργασιών',
        task_created_success: 'Η εργασία δημιουργήθηκε επιτυχώς',
        failed_to_create_task: 'Αποτυχία δημιουργίας εργασίας',
        task_marked_completed: 'Η εργασία σημάνθηκε ως ολοκληρωμένη',
        task_marked_incomplete: 'Η εργασία σημάνθηκε ως μη ολοκληρωμένη',
        failed_to_update_task_status: 'Αποτυχία ενημέρωσης κατάστασης εργασίας',
        task_deleted_success: 'Η εργασία διαγράφηκε επιτυχώς',
        failed_to_delete_task: 'Αποτυχία διαγραφής εργασίας',
        event_required_fields: 'Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία',
        event_created_success: 'Η εκδήλωση δημιουργήθηκε επιτυχώς',
        failed_to_create_event: 'Αποτυχία δημιουργίας εκδήλωσης',
        create_new_event_title: 'Δημιουργία Νέας Εκδήλωσης',
        creating_event: 'Δημιουργείται...',
        description_optional: 'Περιγραφή (Προαιρετικό)',
        select_event_date_time: 'Επιλέξτε ημερομηνία και ώρα εκδήλωσης',
        cannot_change_own_role: 'Δεν μπορείτε να αλλάξετε τον δικό σας ρόλο',
        role_updated: 'Ο ρόλος ενημερώθηκε επιτυχώς',
        cannot_delete_own_account: 'Δεν μπορείτε να διαγράψετε τον δικό σας λογαριασμό',
        user_deleted: 'Ο χρήστης διαγράφηκε επιτυχώς',
        search_users_placeholder: 'Αναζήτηση χρηστών...',
        Month: 'Μήνας',
        Week: 'Εβδομάδα',
        Day: 'Ημέρα',
        Agenda: 'Ατζέντα',
        
        // Additional task-related translations
        All_Statuses: 'Όλες οι Καταστάσεις',
        starts: 'Ξεκινά',
        hide_create_task_form: 'Απόκρυψη Φόρμας Δημιουργίας',
        create_new_task: 'Δημιουργία Νέας Εργασίας',
        add_task: 'Προσθήκη Εργασίας',
        company_required: 'Εταιρεία',
        select_a_company: 'Επιλέξτε μια εταιρεία...',
        department: 'Τμήμα',
        select_a_department: 'Επιλέξτε τμήμα...',
        assign_to_user: 'Ανάθεση σε Χρήστη (Προαιρετικό)',
        assign_to_self: 'Ανάθεση σε Εμένα (Προεπιλογή)',
        all_day_deadline: 'Ολοήμερη Προθεσμία',
        urgent_checkbox: 'Επείγον',
        important_checkbox: 'Σημαντικό',
        select_date_time: 'Επιλέξτε ημερομηνία και ώρα',
        no_companies_found: 'Δεν βρέθηκαν εταιρείες',
        
        // Additional missing translations
        confirm_delete_task: 'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την εργασία;',
        urgent_only: 'Μόνο Επείγον',
        important_only: 'Μόνο Σημαντικό'
    }
};

// Normalize legacy or alternate language codes to the ones we support
const normalizeLanguage = (lang) => {
    if (!lang) return 'en';
    if (lang === 'gr') return 'el'; // legacy saved value
    return lang;
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('appLanguage');
        return normalizeLanguage(saved) || 'en';
    });

    useEffect(() => {
        const normalized = normalizeLanguage(language);
        localStorage.setItem('appLanguage', normalized);
        if (normalized !== language) {
            setLanguage(normalized);
        }
    }, [language]);

    const t = (key) => {
        const langKey = normalizeLanguage(language);
        const dict = translations[langKey] || translations['en'] || {};
        return (dict && dict[key]) || translations['en'][key] || key;
    };

    const setAppLanguage = (lang) => setLanguage(normalizeLanguage(lang));

    const value = {
        language: normalizeLanguage(language),
        setLanguage: setAppLanguage,
        t
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageContext;