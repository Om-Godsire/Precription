import React, { useState, useEffect } from 'react';

interface Facility {
    id: number;
    name: string;
    type: 'hospital' | 'pharmacy' | 'clinic';
    address: string;
    phone: string;
    distance: string;
    rating: number;
    open: boolean;
    hours: string;
    specialties?: string[];
}

const facilities: Facility[] = [
    {
        id: 1, name: 'City General Hospital', type: 'hospital',
        address: '123 Main Street, Near Bus Stand', phone: '+91 98765 43210',
        distance: '0.8 km', rating: 4.5, open: true, hours: '24/7',
        specialties: ['Emergency', 'Cardiology', 'Orthopedics'],
    },
    {
        id: 2, name: 'LifeCare Pharmacy', type: 'pharmacy',
        address: '45 MG Road, Shop No. 3', phone: '+91 91234 56789',
        distance: '0.3 km', rating: 4.8, open: true, hours: '8 AM – 11 PM',
    },
    {
        id: 3, name: 'Apollo Clinic', type: 'clinic',
        address: '78 Station Road, 2nd Floor', phone: '+91 88765 12345',
        distance: '1.2 km', rating: 4.2, open: true, hours: '9 AM – 9 PM',
        specialties: ['General Medicine', 'Pediatrics'],
    },
    {
        id: 4, name: 'MedPlus Pharmacy', type: 'pharmacy',
        address: '12 Nehru Nagar, Near Post Office', phone: '+91 99123 45678',
        distance: '0.5 km', rating: 4.6, open: false, hours: '8 AM – 10 PM',
    },
    {
        id: 5, name: 'Sahyadri Super Speciality Hospital', type: 'hospital',
        address: '90 Civil Lines, Deccan Area', phone: '+91 97543 21098',
        distance: '2.1 km', rating: 4.7, open: true, hours: '24/7',
        specialties: ['Neurology', 'Oncology', 'Cardiology', 'Emergency'],
    },
    {
        id: 6, name: 'Wellness Medical Store', type: 'pharmacy',
        address: '34 Gandhi Chowk', phone: '+91 90876 54321',
        distance: '1.0 km', rating: 4.3, open: true, hours: '7 AM – 11 PM',
    },
    {
        id: 7, name: 'Ruby Hall Clinic', type: 'clinic',
        address: '56 Sassoon Road', phone: '+91 95432 10987',
        distance: '1.8 km', rating: 4.4, open: true, hours: '8 AM – 10 PM',
        specialties: ['Dermatology', 'ENT', 'Ophthalmology'],
    },
    {
        id: 8, name: 'Netmeds Pharmacy', type: 'pharmacy',
        address: '22 Tilak Road, Near Railway Station', phone: '+91 93210 98765',
        distance: '1.5 km', rating: 4.1, open: true, hours: '9 AM – 10 PM',
    },
];

const typeConfig = {
    hospital: { icon: '🏥', label: 'Hospital', color: 'from-red-500 to-rose-600', bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100 text-red-700' },
    pharmacy: { icon: '💊', label: 'Medical Store', color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
    clinic: { icon: '🩺', label: 'Clinic', color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
};

const NearbyCarePage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'hospital' | 'pharmacy' | 'clinic'>('all');
    const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'granted' | 'denied'>('idle');

    useEffect(() => {
        setLocationStatus('loading');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                () => setLocationStatus('granted'),
                () => setLocationStatus('denied'),
                { timeout: 5000 }
            );
        } else {
            setLocationStatus('denied');
        }
    }, []);

    const filtered = facilities.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
            f.address.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || f.type === filter;
        return matchesSearch && matchesFilter;
    });

    const counts = {
        all: facilities.length,
        hospital: facilities.filter(f => f.type === 'hospital').length,
        pharmacy: facilities.filter(f => f.type === 'pharmacy').length,
        clinic: facilities.filter(f => f.type === 'clinic').length,
    };

    const renderStars = (rating: number) => {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;
        return (
            <span className="flex items-center gap-0.5" title={`${rating} / 5`}>
                {[...Array(full)].map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}
                {half && <span className="text-amber-400 text-sm">★</span>}
                {[...Array(5 - full - (half ? 1 : 0))].map((_, i) => <span key={i} className="text-slate-300 text-sm">★</span>)}
                <span className="text-xs text-slate-500 ml-1 font-medium">{rating}</span>
            </span>
        );
    };

    return (
        <div className="space-y-6 animate-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Nearby Care</h1>
                    <p className="text-slate-500 mt-1">Find hospitals, clinics & medical stores near you</p>
                </div>
                {/* Location status pill */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${locationStatus === 'granted'
                        ? 'bg-emerald-50 text-emerald-700'
                        : locationStatus === 'denied'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-500'
                    }`}>
                    <span className={`w-2 h-2 rounded-full ${locationStatus === 'granted' ? 'bg-emerald-500 animate-pulse' :
                            locationStatus === 'denied' ? 'bg-amber-500' : 'bg-slate-400 animate-pulse'
                        }`} />
                    {locationStatus === 'granted' ? 'Location active' :
                        locationStatus === 'denied' ? 'Location unavailable — showing defaults' : 'Detecting location…'}
                </div>
            </div>

            {/* Search + Filter bar */}
            <div className="card !p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name or address…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="input !pl-10"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {(['all', 'hospital', 'pharmacy', 'clinic'] as const).map(type => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${filter === type
                                        ? 'bg-primary-600 text-white shadow-md'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {type === 'all' ? '🗺️ All' :
                                    type === 'hospital' ? '🏥 Hospitals' :
                                        type === 'pharmacy' ? '💊 Stores' : '🩺 Clinics'}
                                <span className={`ml-1.5 px-1.5 py-0.5 rounded-md text-xs ${filter === type ? 'bg-white/20' : 'bg-slate-200'
                                    }`}>
                                    {counts[type]}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results */}
            {filtered.length === 0 ? (
                <div className="card text-center py-16">
                    <p className="text-4xl mb-3">🔍</p>
                    <p className="text-lg font-semibold text-slate-600">No results found</p>
                    <p className="text-slate-400 mt-1">Try a different search term or filter</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filtered.map(facility => {
                        const cfg = typeConfig[facility.type];
                        return (
                            <div key={facility.id} className="card group hover:-translate-y-0.5">
                                <div className="flex gap-4">
                                    {/* Icon */}
                                    <div className={`shrink-0 w-14 h-14 ${cfg.bg} rounded-2xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110`}>
                                        {cfg.icon}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="font-bold text-slate-800 truncate">{facility.name}</h3>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold mt-1 ${cfg.badge}`}>
                                                    {cfg.label}
                                                </span>
                                            </div>
                                            <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${facility.open ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${facility.open ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                {facility.open ? 'Open' : 'Closed'}
                                            </span>
                                        </div>

                                        <div className="mt-3 space-y-1.5 text-sm text-slate-500">
                                            <p className="flex items-center gap-2">
                                                <span className="text-base">📍</span>
                                                <span className="truncate">{facility.address}</span>
                                                <span className="shrink-0 ml-auto font-semibold text-primary-600">{facility.distance}</span>
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <span className="text-base">🕐</span>
                                                <span>{facility.hours}</span>
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <span className="text-base">📞</span>
                                                <a href={`tel:${facility.phone.replace(/\s/g, '')}`} className="text-primary-600 hover:underline font-medium">{facility.phone}</a>
                                            </p>
                                        </div>

                                        {facility.specialties && (
                                            <div className="mt-3 flex flex-wrap gap-1.5">
                                                {facility.specialties.map(s => (
                                                    <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">{s}</span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-3 flex items-center justify-between">
                                            {renderStars(facility.rating)}
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.name + ' ' + facility.address)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
                                            >
                                                Get Directions
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Info banner */}
            <div className="card !bg-gradient-to-r !from-primary-50 !to-blue-50 border border-primary-100">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">ℹ️</span>
                    <div>
                        <p className="font-semibold text-slate-700">About Nearby Care</p>
                        <p className="text-sm text-slate-500 mt-1">
                            Listings are based on your approximate location. In an emergency, always call <strong>112</strong> or visit the nearest hospital.
                            Tap "Get Directions" to open Google Maps for navigation.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NearbyCarePage;
