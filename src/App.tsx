import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { OfflineBanner } from './components/OfflineBanner';
import { DashboardPage } from './pages/DashboardPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { InventoryPage } from './pages/InventoryPage';
import { ChemicalDatabasePage } from './pages/ChemicalDatabasePage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { EducationPage } from './pages/EducationPage';
import { HistoryPage } from './pages/HistoryPage';
import { UnitConverterPage } from './pages/UnitConverterPage';
import { VerificationPage } from './pages/VerificationPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { AuthPage } from './pages/AuthPage';
import {
  UserProfile,
  CalculationHistoryItem,
  InventoryItem,
  UsageLog,
  UserRole
} from './types';
import {
  getStoredUser,
  saveStoredUser,
  getStoredHistory,
  saveCalculationHistory,
  deleteHistoryItem,
  clearAllHistory,
  getStoredInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getStoredUsageLogs,
  recordUsage,
  INITIAL_INVENTORY
} from './utils/storage';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('reagenlab_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // Apply dark mode class to html document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('reagenlab_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('reagenlab_theme', 'light');
    }
  }, [darkMode]);

  // User state
  const [user, setUser] = useState<UserProfile>(() => getStoredUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Data states
  const [history, setHistory] = useState<CalculationHistoryItem[]>(() => getStoredHistory());
  const [inventory, setInventory] = useState<InventoryItem[]>(() => getStoredInventory());
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>(() => getStoredUsageLogs());

  // Navigation state
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Calculator interaction states
  const [presetItem, setPresetItem] = useState<CalculationHistoryItem | null>(null);
  const [selectedChemicalId, setSelectedChemicalId] = useState<string | null>(null);

  // User updates
  const handleUpdateUser = (updated: UserProfile) => {
    setUser(updated);
    saveStoredUser(updated);
  };

  const handleSetUserRole = (newRole: UserRole) => {
    const updated: UserProfile = { ...user, role: newRole };
    setUser(updated);
    saveStoredUser(updated);
  };

  // History Handlers
  const handleSaveHistory = (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => {
    const saved = saveCalculationHistory(item);
    setHistory(prev => [saved, ...prev]);
  };

  const handleDeleteHistory = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistory(updated);
  };

  const handleClearHistory = () => {
    clearAllHistory();
    setHistory([]);
  };

  const handleRepeatCalculation = (item: CalculationHistoryItem) => {
    setPresetItem(item);
    setActivePage('calculator');
  };

  // Inventory Handlers
  const handleAddInventory = (item: Omit<InventoryItem, 'id'>) => {
    const created = addInventoryItem(item);
    setInventory(prev => [created, ...prev]);
  };

  const handleUpdateInventory = (item: InventoryItem) => {
    updateInventoryItem(item);
    setInventory(prev => prev.map(i => i.id === item.id ? item : i));
  };

  const handleDeleteInventory = (id: string) => {
    deleteInventoryItem(id);
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  const handleRecordUsage = (itemId: string, amount: number, analyst: string, purpose: string) => {
    recordUsage(itemId, amount, analyst, purpose);
    setInventory(getStoredInventory());
    setUsageLogs(getStoredUsageLogs());
  };

  const handleResetAllData = () => {
    localStorage.clear();
    setInventory(INITIAL_INVENTORY);
    setHistory([]);
    setUsageLogs([]);
    const defaultUser = getStoredUser();
    setUser(defaultUser);
    alert('Data inventaris dan riwayat telah diatur ulang ke kondisi awal.');
  };

  const handleChemicalForCalc = (chemicalId: string) => {
    setSelectedChemicalId(chemicalId);
    setActivePage('calculator');
  };

  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    saveStoredUser(loggedInUser);
    setIsAuthOpen(false);
  };

  if (isAuthOpen) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors`}>
      {/* Offline Status Indicator Banner */}
      <OfflineBanner />

      {/* Persistent / Responsive Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        user={user}
        setUserRole={handleSetUserRole}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Top Navbar */}
        <Header
          user={user}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          setActivePage={setActivePage}
          onSelectChemicalForCalc={handleChemicalForCalc}
        />

        {/* Dynamic Page Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activePage === 'dashboard' && (
            <DashboardPage
              user={user}
              history={history}
              inventory={inventory}
              setActivePage={setActivePage}
              onRepeatCalculation={handleRepeatCalculation}
            />
          )}

          {activePage === 'calculator' && (
            <CalculatorPage
              user={user}
              onSaveHistory={handleSaveHistory}
              presetItem={presetItem}
              selectedChemicalId={selectedChemicalId}
            />
          )}

          {activePage === 'inventory' && (
            <InventoryPage
              user={user}
              inventory={inventory}
              usageLogs={usageLogs}
              onAddItem={handleAddInventory}
              onUpdateItem={handleUpdateInventory}
              onDeleteItem={handleDeleteInventory}
              onRecordUsage={handleRecordUsage}
            />
          )}

          {activePage === 'chemicals' && (
            <ChemicalDatabasePage
              onSelectChemicalForCalc={handleChemicalForCalc}
              setActivePage={setActivePage}
            />
          )}

          {activePage === 'ai' && (
            <AIAssistantPage user={user} />
          )}

          {activePage === 'education' && (
            <EducationPage />
          )}

          {activePage === 'history' && (
            <HistoryPage
              user={user}
              history={history}
              onDeleteHistoryItem={handleDeleteHistory}
              onClearAllHistory={handleClearHistory}
              onRepeatCalculation={handleRepeatCalculation}
            />
          )}

          {activePage === 'converter' && (
            <UnitConverterPage />
          )}

          {activePage === 'verification' && (
            <VerificationPage />
          )}

          {activePage === 'profile' && (
            <ProfileSettingsPage
              user={user}
              onUpdateUser={handleUpdateUser}
              onResetAllData={handleResetAllData}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activePage={activePage}
        setActivePage={setActivePage}
      />
    </div>
  );
}
