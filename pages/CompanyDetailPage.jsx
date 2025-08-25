// src/pages/CompanyDetailPage.jsx
import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { companyApi, carApi, rentalApi } from "../api/apiService";
import { carData } from '../api/carData'; // Import the local car data
import { useLanguage } from '../context/LanguageContext';
import { useNotification } from "../context/NotificationContext";
import DatePicker from 'react-datepicker';
import RentalReturnModal from '../components/RentalReturnModal';
import EditCarModal from '../components/EditCarModal';
import { format } from 'date-fns';
import "./CompanyDetailPage.css";

// --- Custom Searchable Dropdown Component with Logos ---
const CustomCarDropdown = ({ options, value, onChange, placeholder, disabled, showLogo = false }) => {
    const [filter, setFilter] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // This ensures the input shows the selected value, but allows typing to filter
    const displayValue = isOpen ? filter : value || '';

    const filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(filter.toLowerCase())
    );

    const handleSelect = (option) => {
        onChange(option.name);
        setIsOpen(false);
    };
    
    // Use an effect to clear the filter when the dropdown closes
    React.useEffect(() => {
        if (!isOpen) {
            setFilter('');
        }
    }, [isOpen]);

    return (
        <div className="searchable-dropdown" onMouseLeave={() => setIsOpen(false)}>
            <input
                type="text"
                value={displayValue}
                onChange={(e) => {
                    setFilter(e.target.value);
                    if (value) onChange(''); // Clear final selection when user starts typing
                }}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete="off"
            />
            {isOpen && (
                <div className="dropdown-options">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <div key={index} className="dropdown-option" onMouseDown={() => handleSelect(option)}>
                                {showLogo && <img src={option.logo} alt={option.name} className="dropdown-logo" />}
                                <span>{option.name}</span>
                            </div>
                        ))
                    ) : (
                        <div className="dropdown-option disabled">No results found</div>
                    )}
                </div>
            )}
        </div>
    );
};


function CompanyDetailPage() {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const { accessToken, currentUser } = useAuth();
    const { showNotification } = useNotification();
    const { t } = useLanguage();

    const [company, setCompany] = useState(null);
    const [companyTasks, setCompanyTasks] = useState([]);
    const [cars, setCars] = useState([]);
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form states for adding a new car
    const [manufacturer, setManufacturer] = useState('');
    const [model, setModel] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [vin, setVin] = useState('');
    
    // State for car data dropdowns
    const [modelsForMake, setModelsForMake] = useState([]);

    // Form states for creating a new rental
    const [customerName, setCustomerName] = useState('');
    const [customerSurname, setCustomerSurname] = useState('');
    const [selectedCarId, setSelectedCarId] = useState('');
    const [rentalDays, setRentalDays] = useState(1);
    const [returnDateTime, setReturnDateTime] = useState(null);
    const [startKilometers, setStartKilometers] = useState('');
    const [gasTankStart, setGasTankStart] = useState('Full');

    // State for modals
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [selectedRental, setSelectedRental] = useState(null);
    const [isEditCarModalOpen, setIsEditCarModalOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);

    const isAdmin = currentUser?.role === "admin";

    const fetchCompanyData = useCallback(async () => {
        if (!accessToken || !companyId) return;
        setLoading(true);
        try {
            const [fetchedCompany, fetchedTasks] = await Promise.all([
                companyApi.getById(parseInt(companyId), accessToken),
                companyApi.getCompanyTasks(parseInt(companyId), accessToken)
            ]);
            setCompany(fetchedCompany);
            setCompanyTasks(fetchedTasks);

            if (fetchedCompany.name === 'Best Solution Cars') {
                const [fetchedCars, fetchedRentals] = await Promise.all([
                    carApi.getCarsForCompany(parseInt(companyId), accessToken),
                    rentalApi.getRentalsForCompany(parseInt(companyId), accessToken)
                ]);
                setCars(fetchedCars);
                setRentals(fetchedRentals);
            }
        } catch (err) {
            showNotification(err.message || 'Failed to fetch company details.', 'error');
        } finally {
            setLoading(false);
        }
    }, [accessToken, companyId, showNotification]);

    React.useEffect(() => {
        fetchCompanyData();
    }, [fetchCompanyData]);
    
    React.useEffect(() => {
        if (manufacturer) {
            const selectedMake = carData.find(make => make.name === manufacturer);
            setModelsForMake(selectedMake ? selectedMake.models.map(m => ({ name: m })) : []);
            setModel(''); // Reset model when manufacturer changes
        } else {
            setModelsForMake([]);
        }
    }, [manufacturer]);

    const handleAddCar = async (e) => {
        e.preventDefault();
        const carDataObj = { manufacturer, model, license_plate: licensePlate, vin };
        try {
            await carApi.createCar(company.id, carDataObj, accessToken);
            showNotification('Car added successfully!', 'success');
            setManufacturer(''); setModel(''); setLicensePlate(''); setVin('');
            fetchCompanyData();
        } catch (err) {
            showNotification(err.message || 'Failed to add car.', 'error');
        }
    };
    
    // --- Other handlers (unchanged) ---
    const handleCreateRental = async (e) => {
        e.preventDefault();
        const rentalData = {
            customer_name: customerName, customer_surname: customerSurname, car_id: parseInt(selectedCarId),
            rental_days: parseInt(rentalDays), return_datetime: returnDateTime.toISOString(),
            start_kilometers: parseInt(startKilometers), gas_tank_start: gasTankStart,
        };
        try {
            await rentalApi.createRental(company.id, rentalData, accessToken);
            showNotification('Rental created successfully!', 'success');
            setCustomerName(''); setCustomerSurname(''); setSelectedCarId(''); setRentalDays(1);
            setReturnDateTime(null); setStartKilometers(''); setGasTankStart('Full');
            fetchCompanyData();
        } catch (err) {
            showNotification(err.message || 'Failed to create rental.', 'error');
        }
    };

    const openEditCarModal = (car) => {
        setSelectedCar(car);
        setIsEditCarModalOpen(true);
    };

    const handleUpdateCar = async (updateData) => {
        try {
            await carApi.updateCar(selectedCar.id, updateData, accessToken);
            showNotification('Car updated successfully!', 'success');
            setIsEditCarModalOpen(false);
            setSelectedCar(null);
            fetchCompanyData();
        } catch (err) {
            showNotification(err.message || 'Failed to update car.', 'error');
        }
    };

    const handleDeleteCar = async (carId, carName) => {
        if (!window.confirm(`Are you sure you want to delete the car: ${carName}?`)) return;
        try {
            await carApi.deleteCar(carId, accessToken);
            showNotification('Car deleted successfully!', 'success');
            fetchCompanyData();
        } catch (err) {
            showNotification(err.message || 'Failed to delete car.', 'error');
        }
    };
    
    const handleOpenReturnModal = (rental) => {
        setSelectedRental(rental);
        setIsReturnModalOpen(true);
    };

    const handleFinalizeReturn = async (returnData) => {
        try {
            await rentalApi.updateRentalOnReturn(selectedRental.id, returnData, accessToken);
            showNotification('Rental finalized successfully!', 'success');
            setIsReturnModalOpen(false);
            setSelectedRental(null);
            fetchCompanyData();
        } catch (err) {
            showNotification(err.message || 'Failed to finalize rental.', 'error');
        }
    };


    if (loading) return <div className="loading-spinner">{t('loading')}</div>;
    if (!company) return <div className="error-message">Company not found.</div>;

    const gasOptions = ["Empty", "1/4", "1/2", "3/4", "Full"];

    return (
        <div className="company-detail-container">
            <EditCarModal isOpen={isEditCarModalOpen} onClose={() => setIsEditCarModalOpen(false)} onConfirm={handleUpdateCar} car={selectedCar} />
            <RentalReturnModal isOpen={isReturnModalOpen} onClose={() => setIsReturnModalOpen(false)} onConfirm={handleFinalizeReturn} rental={selectedRental} />
            
            <div className="company-header">
                <button onClick={() => navigate(-1)} className="back-button">← {t('back')}</button>
                <h1>{company.name}</h1>
            </div>

            {company.name === 'Best Solution Cars' && (
                <>
                    <div className="section-card">
                        <h2>{t('car_management')}</h2>
                        <form onSubmit={handleAddCar} className="add-car-form">
                            <h3>{t('add_new_car')}</h3>
                            <div className="form-row">
                                <CustomCarDropdown
                                    options={carData}
                                    value={manufacturer}
                                    onChange={setManufacturer}
                                    placeholder={t('manufacturer')}
                                    showLogo={true}
                                />
                                <CustomCarDropdown
                                    options={modelsForMake}
                                    value={model}
                                    onChange={setModel}
                                    placeholder={t('model')}
                                    disabled={!manufacturer}
                                />
                            </div>
                            <div className="form-row">
                                <input type="text" placeholder={t('license_plate')} value={licensePlate} onChange={e => setLicensePlate(e.target.value)} required />
                                <input type="text" placeholder={t('vin')} value={vin} onChange={e => setVin(e.target.value)} required />
                            </div>
                            <button type="submit">{t('add_car')}</button>
                        </form>
                        <div className="car-list-wrapper">
                            <h3>{t('available_cars')} ({cars.length})</h3>
                            {cars.length === 0 ? <p>{t('no_cars_added')}</p> : (
                                <ul className="car-list">
                                    {cars.map(car => (
                                        <li key={car.id} className="car-item">
                                            <div className="car-item-info">
                                                <span><strong>{car.manufacturer} {car.model}</strong></span>
                                                <span>{t('license_plate')}: {car.license_plate}</span>
                                                <span>{t('vin')}: {car.vin}</span>
                                            </div>
                                            {isAdmin && (
                                                <div className="car-item-actions">
                                                    <button className="edit-button-small" onClick={() => openEditCarModal(car)}>{t('edit')}</button>
                                                    <button className="delete-button-small" onClick={() => handleDeleteCar(car.id, `${car.manufacturer} ${car.model}`)}>{t('delete')}</button>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="section-card">
                        <h2>{t('rental_management')}</h2>
                        <form onSubmit={handleCreateRental} className="rental-form">
                            <h3>{t('create_new_rental')}</h3>
                            <div className="form-grid">
                                <input type="text" placeholder={t('customer_name')} value={customerName} onChange={e => setCustomerName(e.target.value)} required />
                                <input type="text" placeholder={t('customer_surname')} value={customerSurname} onChange={e => setCustomerSurname(e.target.value)} required />
                                <select value={selectedCarId} onChange={e => setSelectedCarId(e.target.value)} required>
                                    <option value="" disabled>{t('select_a_car')}</option>
                                    {cars.map(car => <option key={car.id} value={car.id}>{car.manufacturer} {car.model} ({car.license_plate})</option>)}
                                </select>
                                <input type="number" placeholder={t('rental_days')} value={rentalDays} onChange={e => setRentalDays(e.target.value)} min="1" required />
                                <DatePicker
                                    selected={returnDateTime}
                                    onChange={date => setReturnDateTime(date)}
                                    showTimeInput
                                    timeInputLabel="Time:"
                                    dateFormat="dd/MM/yyyy HH:mm"
                                    placeholderText={t('return_date_time')}
                                    className="custom-datepicker-input"
                                    required
                                />
                                <input type="number" placeholder={t('start_kilometers')} value={startKilometers} onChange={e => setStartKilometers(e.target.value)} min="0" required />
                                <select value={gasTankStart} onChange={e => setGasTankStart(e.target.value)} required>
                                    <option value="" disabled>{t('gas_tank_level_start')}</option>
                                    {gasOptions.map(level => <option key={level} value={level}>{level}</option>)}
                                </select>
                            </div>
                            <button type="submit">{t('create_rental')}</button>
                        </form>
                        <div className="rental-list-wrapper">
                            <h3>{t('rental_records')} ({rentals.length})</h3>
                            {rentals.length === 0 ? <p>{t('no_rental_records')}</p> : rentals.map(rental => (
                                <div key={rental.id} className={`rental-item ${rental.is_locked ? 'locked' : 'active'}`}>
                                    <div className="rental-details">
                                        <strong>{rental.customer_name} {rental.customer_surname}</strong>
                                        <span>{t('car')}: {cars.find(c => c.id === rental.car_id)?.model || 'N/A'}</span>
                                        <span>{t('return_by')}: {format(new Date(rental.return_datetime), 'Pp')}</span>
                                        <span>{t('km_start')}: {rental.start_kilometers}</span>
                                        <span>{t('gas_start')}: {rental.gas_tank_start}</span>
                                        {rental.is_locked && (
                                            <>
                                                <span>{t('km_end')}: {rental.end_kilometers}</span>
                                                <span>{t('gas_end')}: {rental.gas_tank_end}</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="rental-actions">
                                        {rental.is_locked ? <span className="status-locked">{t('locked')}</span> : <button onClick={() => handleOpenReturnModal(rental)}>{t('finalize_return')}</button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            <div className="section-card">
                <h2>{t('tasks_heading')} ({companyTasks.length})</h2>
                <div className="task-list">
                    {companyTasks.length === 0 ? (
                        <p className="no-tasks">{t('no_tasks_for_company')}</p>
                    ) : (
                        companyTasks.map(task => (
                            <div key={task.id} className="task-item">
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default CompanyDetailPage;
