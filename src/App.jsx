import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import SettingView from './components/SettingView';
import RequestForm from './components/RequestForm';
import AssignmentCenter from './components/AssignmentCenter';


const App = () => {
  const [view, setView] = useState('dashboard');
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS);
  const [assignments, setAssignments] = useState([]); 
  const [requestData, setRequestData] = useState(null);
  
  const updateTeacherCount = (teacherId, increment) => {
    setTeachers(prev => prev.map(t => 
      t.id === teacherId ? { ...t, count: t.count + increment } : t
    ));
    setAssignments(prev => [...prev, { date: new Date().toISOString(), teacherId }]);
    setView('dashboard');
  };

  return (
    <div className="flex h-screen bg-[#f8f9fc] font-sans">
      <Sidebar currentView={view} setView={setView} />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {view === 'dashboard' && '종합 현황판'}
              {view === 'request' && '보결 신청서'}
              {view === 'assignment' && '배당 센터 (AI)'}
              {view === 'settings' && '시스템 설정'}
            </h2>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
            </p>
          </div>
        </header>

        {view === 'dashboard' && <Dashboard teachers={teachers} assignments={assignments} />}
        {view === 'request' && <RequestForm setRequestData={setRequestData} setView={setView} />}
        {view === 'assignment' && <AssignmentCenter requestData={requestData} teachers={teachers} updateTeacherCount={updateTeacherCount} />}
        {view === 'settings' && <SettingsView teachers={teachers} setTeachers={setTeachers} setAssignments={setAssignments} />}
      </main>
    </div>
  );
};

export default App;