// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { calendarApi, taskApi, eventApi } from '../api/apiService';
import { useNotification } from '../context/NotificationContext';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import el from 'date-fns/locale/el'; // <-- Import Greek locale
import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import EventModal from '../components/EventModal';
import LanguageModal from '../components/LanguageModal';
import PaymentWidget from '../components/PaymentWidget';
import './CalendarDashboard.css';
import './DashboardTasks.css';

const locales = { 'en': enUS, 'el': el }; // Map our app's languages to date-fns locales

function DashboardPage() {
    const { currentUser, accessToken, loading: authLoading } = useAuth();
    const { showNotification } = useNotification();
    const { language, t } = useLanguage(); // Get current language
    const navigate = useNavigate();

    // Dynamically create the localizer based on the current language
    const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales: { [language]: locales[language] } });

    const [calendarEvents, setCalendarEvents] = useState([]);
    const [allMyTasks, setAllMyTasks] = useState([]);
    const [loadingContent, setLoadingContent] = useState(true);
    const [upcomingEvent, setUpcomingEvent] = useState(null);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
    const [currentView, setCurrentView] = useState('month');
    const [currentDate, setCurrentDate] = useState(new Date());

    const isAdmin = currentUser?.role === "admin";

    const fetchDashboardData = useCallback(async () => {
        if (!accessToken) return;
        setLoadingContent(true);
        try {
            const [calEvents, tasks] = await Promise.all([
                calendarApi.getCalendarEvents(accessToken),
                taskApi.getTasks(accessToken)
            ]);

            const formattedEvents = calEvents.map(ev => ({
                title: ev.title,
                start: new Date(ev.start),
                end: new Date(ev.end),
                allDay: ev.allDay,
                resource: ev
            }));
            setCalendarEvents(formattedEvents);
            setAllMyTasks(tasks);
        } catch (err) {
            showNotification(err.message || 'Failed to load dashboard content.', 'error');
        } finally {
            setLoadingContent(false);
        }
    }, [accessToken, showNotification]);

    useEffect(() => {
        const checkModals = async () => {
            const langPref = localStorage.getItem('languagePreference');
            if (!langPref) {
                setIsLanguageModalOpen(true);
                return;
            }
            if (!isAdmin && accessToken) {
                try {
                    const event = await eventApi.getUpcomingEvent(accessToken);
                    if (event) {
                        setUpcomingEvent(event);
                        setIsEventModalOpen(true);
                    }
                } catch {
                    // Silent fail for event modal
                }
            }
        };

        if (!authLoading && accessToken) {
            fetchDashboardData();
            checkModals();
        }
    }, [authLoading, accessToken, fetchDashboardData, isAdmin]);
    
    const handleCategoryClick = (category) => {
        navigate(`/tasks?filter=${category}`);
    };

    // Replace your categorizeTasks and categorizedTasks with this useMemo:
    const categorizedTasks = useMemo(() => {
        const categories = {
            new: allMyTasks.filter(task => task.status === 'new'),
            inProgress: allMyTasks.filter(task => ['received', 'on_process'].includes(task.status)),
            pending: allMyTasks.filter(task => task.status === 'pending'),
            completed: allMyTasks.filter(task => task.status === 'completed'),
            looseEnd: allMyTasks.filter(task => task.status === 'loose_end'),
            // Keep your existing priority-based categories as well
            urgentImportant: allMyTasks.filter(task => task.urgency && task.important && !task.completed),
            urgentOnly: allMyTasks.filter(task => task.urgency && !task.important && !task.completed),
            importantOnly: allMyTasks.filter(task => !task.urgency && task.important && !task.completed),
            normal: allMyTasks.filter(task => !task.urgency && !task.important && !task.completed),
            allDayDeadline: allMyTasks.filter(task => task.deadline_all_day && !task.completed),
        };
        return categories;
    }, [allMyTasks]);

    const renderTaskListCard = (tasks, titleKey, categoryClass) => (
        <div className={`task-category-card ${categoryClass}`}>
            <h3>{t(titleKey)} ({tasks.length})</h3>
            {tasks.length === 0 ? (
                <p>{t('no_tasks_in_category')}</p>
            ) : (
                <ul className="task-category-list">
                    {tasks.slice(0, 5).map(task => (
                        <li key={task.id} className="task-category-list-item">
                            <span className="task-category-title">{task.title}</span>
                            {task.deadline && <span className="task-category-deadline"> ({t('deadline')}: {format(new Date(task.deadline), 'PP', { locale: locales[language] })})</span>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    if (authLoading || loadingContent) {
        return <div className="loading-spinner">{t('loading')}</div>;
    }

    return (
        <div className="dashboard-container">
            <LanguageModal 
                isOpen={isLanguageModalOpen}
                onClose={() => setIsLanguageModalOpen(false)}
            />
            <EventModal 
                isOpen={isEventModalOpen && !isLanguageModalOpen}
                onClose={() => setIsEventModalOpen(false)}
                event={upcomingEvent}
            />

            <h1>{t('welcome_back')}, {currentUser?.first_name || "User"}!</h1>
            <p>{t('dashboard_overview')}</p>

            <div className="dashboard-grid-container">
                <div className="clickable-card" onClick={() => handleCategoryClick('urgentImportant')}>
                    {renderTaskListCard(categorizedTasks.urgentImportant, 'Urgent&Important', 'red-category')}
                </div>
                <div className="clickable-card" onClick={() => handleCategoryClick('urgentOnly')}>
                    {renderTaskListCard(categorizedTasks.urgentOnly, 'Urgent', 'blue-category')}
                </div>
                <div className="clickable-card" onClick={() => handleCategoryClick('importantOnly')}>
                    {renderTaskListCard(categorizedTasks.importantOnly, 'Important', 'green-category')}
                </div>
                <div className="clickable-card" onClick={() => handleCategoryClick('normal')}>
                    {renderTaskListCard(categorizedTasks.normal, 'Normal', 'yellow-category')}
                </div>
                <div className="clickable-card" onClick={() => handleCategoryClick('allDayDeadline')}>
                    {renderTaskListCard(categorizedTasks.allDayDeadline, 'All Day Deadline', 'orange-category')}
                </div>
                
                <div className="dashboard-calendar-wrapper">
                    <div className="custom-month-navigation">
                        <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="nav-arrow-button">&lt;</button>
                        <span className="current-month-display">{format(currentDate, 'MMMM yyyy', { locale: locales[language] })}</span>
                        <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="nav-arrow-button">&gt;</button>
                        <button onClick={() => setCurrentDate(new Date())} className="nav-today-button">{t('today')}</button>
                    </div>
                    <div className="custom-calendar-toolbar">
                        <button onClick={() => setCurrentView('month')} className={currentView === 'month' ? 'active' : ''}>{t('Month')}</button>
                        <button onClick={() => setCurrentView('week')} className={currentView === 'week' ? 'active' : ''}>{t('Week')}</button>
                        <button onClick={() => setCurrentView('day')} className={currentView === 'day' ? 'active' : ''}>{t('Day')}</button>
                        <button onClick={() => setCurrentView('agenda')} className={currentView === 'agenda' ? 'active' : ''}>{t('Agenda')}</button>
                    </div>
                    
                    <Calendar
                        localizer={localizer}
                        events={calendarEvents}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                        view={currentView}
                        date={currentDate}
                        onNavigate={setCurrentDate}
                        onView={setCurrentView}
                        messages={{
                            today: t('today'),
                            previous: t('previous'),
                            next: t('next'),
                            month: t('month'),
                            week: t('week'),
                            day: t('day'),
                            agenda: t('agenda'),
                        }}
                    />
                </div>
                
                {/* Payment Widget - Updated section without CarFinanceWidget */}
                {isAdmin && (
                    <div className="dashboard-payment-section">
                        <PaymentWidget />
                    </div>
                )}
            </div>
        </div>
    );
}

export default DashboardPage;