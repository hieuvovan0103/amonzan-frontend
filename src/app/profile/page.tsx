'use client';

import { useState } from 'react';
import { ProfileTab } from '@/types/user-profile';
import AddressBookView from './components/AddressBookView';
import MyOrdersView from './components/MyOrdersView';
import NotificationsView from './components/NotificationsView';
import PaymentMethodsView from './components/PaymentMethodsView';
import ProfileInfoView from './components/ProfileInfoView';
import ProfileSidebar from './components/ProfileSidebar';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<ProfileTab>('profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'notifications':
                return <NotificationsView />;
            case 'my_orders':
                return <MyOrdersView />;
            case 'payments':
                return <PaymentMethodsView />;
            case 'addresses':
                return <AddressBookView />;
            case 'profile':
            default:
                return <ProfileInfoView />;
        }
    };

    return (
        <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8 items-start">

            <ProfileSidebar activeTab={activeTab} onChangeTab={setActiveTab} />

            <div className="flex-1 flex flex-col min-w-0 w-full">
                {renderContent()}
            </div>

        </main>
    );
}