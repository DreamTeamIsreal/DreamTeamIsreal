import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Users, MapPin, HelpCircle, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import PlatformHeader from '../components/platform/PlatformHeader';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('districts');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newItem, setNewItem] = useState<any>({});

  // Mock data - in real app this would come from API
  const [districts, setDistricts] = useState([
    { id: 1, name: 'מחוז הגליל העליון והגולן', description: 'צפון, כפרי-מעורב', isLarge: false },
    { id: 2, name: 'מחוז גוש דן והמטרופולין', description: 'מרכז, אורבני', isLarge: true },
  ]);

  const [settlements, setSettlements] = useState([
    { id: 1, name: 'תל אביב-יפו', districtId: 2, type: 'city' },
    { id: 2, name: 'קריית שמונה', districtId: 1, type: 'city' },
  ]);

  const [voterQuestions, setVoterQuestions] = useState([
    { id: 1, questionNumber: 1, category: 'ביטחון', text: 'ישראל צריכה לשאוף להסדרים מדיניים אזוריים רחבים' },
    { id: 2, questionNumber: 2, category: 'כלכלה', text: 'יש להוריד את נטל המס על המעמד הבינוני' },
  ]);

  const [candidateQuestions, setCandidateQuestions] = useState([
    { id: 1, questionNumber: 1, category: 'ביטחון', text: 'מהו האיום הביטחוני החמור ביותר על ישראל?' },
    { id: 2, questionNumber: 2, category: 'כלכלה', text: 'כיצד תתמודד עם אתגר יוקר המחיה?' },
  ]);

  const tabs = [
    { id: 'districts', label: 'ניהול מחוזות', icon: MapPin },
    { id: 'settlements', label: 'ניהול יישובים', icon: Users },
    { id: 'voter-questions', label: 'שאלות לבוחרים', icon: HelpCircle },
    { id: 'candidate-questions', label: 'שאלות למועמדים', icon: HelpCircle },
  ];

  const handleSave = (type: string, item: any) => {
    if (type === 'districts') {
      if (editingItem) {
        setDistricts(prev => prev.map(d => d.id === item.id ? item : d));
      } else {
        setDistricts(prev => [...prev, { ...item, id: Date.now() }]);
      }
    } else if (type === 'settlements') {
      if (editingItem) {
        setSettlements(prev => prev.map(s => s.id === item.id ? item : s));
      } else {
        setSettlements(prev => [...prev, { ...item, id: Date.now() }]);
      }
    } else if (type === 'voter-questions') {
      if (editingItem) {
        setVoterQuestions(prev => prev.map(q => q.id === item.id ? item : q));
      } else {
        setVoterQuestions(prev => [...prev, { ...item, id: Date.now() }]);
      }
    } else if (type === 'candidate-questions') {
      if (editingItem) {
        setCandidateQuestions(prev => prev.map(q => q.id === item.id ? item : q));
      } else {
        setCandidateQuestions(prev => [...prev, { ...item, id: Date.now() }]);
      }
    }
    setEditingItem(null);
    setNewItem({});
  };

  const handleDelete = (type: string, id: number) => {
    if (confirm('האם אתה בטוח שברצונך למחוק פריט זה?')) {
      if (type === 'districts') {
        setDistricts(prev => prev.filter(d => d.id !== id));
      } else if (type === 'settlements') {
        setSettlements(prev => prev.filter(s => s.id !== id));
      } else if (type === 'voter-questions') {
        setVoterQuestions(prev => prev.filter(q => q.id !== id));
      } else if (type === 'candidate-questions') {
        setCandidateQuestions(prev => prev.filter(q => q.id !== id));
      }
    }
  };

  const renderDistrictsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">ניהול מחוזות</h3>
        <button
          onClick={() => setNewItem({ name: '', description: '', isLarge: false })}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          הוסף מחוז
        </button>
      </div>

      {newItem.name !== undefined && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold mb-4">מחוז חדש</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="שם המחוז"
              value={newItem.name || ''}
              onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="תיאור"
              value={newItem.description || ''}
              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mt-4 flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newItem.isLarge || false}
                onChange={(e) => setNewItem(prev => ({ ...prev, isLarge: e.target.checked }))}
              />
              <span>מחוז גדול (2 נציגים לוועדה)</span>
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => handleSave('districts', newItem)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              שמור
            </button>
            <button
              onClick={() => setNewItem({})}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              ביטול
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {districts.map((district) => (
          <div key={district.id} className="bg-white border border-gray-200 rounded-lg p-4">
            {editingItem?.id === district.id ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={editingItem.description}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, description: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingItem.isLarge}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, isLarge: e.target.checked }))}
                  />
                  <span>מחוז גדול</span>
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave('districts', editingItem)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    שמור
                  </button>
                  <button
                    onClick={() => setEditingItem(null)}
                    className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    ביטול
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{district.name}</h4>
                  <p className="text-gray-600">{district.description}</p>
                  {district.isLarge && <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">מחוז גדול</span>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingItem(district)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('districts', district.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettlementsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">ניהול יישובים</h3>
        <button
          onClick={() => setNewItem({ name: '', districtId: '', type: 'city' })}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          הוסף יישוב
        </button>
      </div>

      {newItem.name !== undefined && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold mb-4">יישוב חדש</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="שם היישוב"
              value={newItem.name || ''}
              onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <select
              value={newItem.districtId || ''}
              onChange={(e) => setNewItem(prev => ({ ...prev, districtId: parseInt(e.target.value) }))}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">בחר מחוז</option>
              {districts.map(district => (
                <option key={district.id} value={district.id}>{district.name}</option>
              ))}
            </select>
            <select
              value={newItem.type || 'city'}
              onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="city">עיר</option>
              <option value="town">עיירה</option>
              <option value="village">כפר</option>
              <option value="kibbutz">קיבוץ</option>
              <option value="moshav">מושב</option>
            </select>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => handleSave('settlements', newItem)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              שמור
            </button>
            <button
              onClick={() => setNewItem({})}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              ביטול
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {settlements.map((settlement) => (
          <div key={settlement.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">{settlement.name}</h4>
                <p className="text-gray-600">
                  {districts.find(d => d.id === settlement.districtId)?.name} • {settlement.type}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingItem(settlement)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete('settlements', settlement.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuestionsTab = (type: 'voter' | 'candidate') => {
    const questions = type === 'voter' ? voterQuestions : candidateQuestions;
    const setQuestions = type === 'voter' ? setVoterQuestions : setCandidateQuestions;
    const questionType = type === 'voter' ? 'voter-questions' : 'candidate-questions';

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">
            {type === 'voter' ? 'שאלות לבוחרים' : 'שאלות למועמדים'}
          </h3>
          <button
            onClick={() => setNewItem({ questionNumber: questions.length + 1, category: '', text: '' })}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            הוסף שאלה
          </button>
        </div>

        {newItem.questionNumber !== undefined && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold mb-4">שאלה חדשה</h4>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="מספר שאלה"
                  value={newItem.questionNumber || ''}
                  onChange={(e) => setNewItem(prev => ({ ...prev, questionNumber: parseInt(e.target.value) }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="קטגוריה"
                  value={newItem.category || ''}
                  onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <textarea
                placeholder="טקסט השאלה"
                value={newItem.text || ''}
                onChange={(e) => setNewItem(prev => ({ ...prev, text: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleSave(questionType, newItem)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                שמור
              </button>
              <button
                onClick={() => setNewItem({})}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                ביטול
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      שאלה {question.questionNumber}
                    </span>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                      {question.category}
                    </span>
                  </div>
                  <p className="text-gray-900">{question.text}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingItem(question)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(questionType, question.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PlatformHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full px-6 py-3 shadow-lg mb-4">
            <Settings className="w-6 h-6" />
            <span className="font-bold text-lg">ממשק ניהול</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ניהול פלטפורמת נבחרת החלומות
          </h1>
          <p className="text-lg text-gray-600">
            נהל מחוזות, יישובים ושאלות הפלטפורמה
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 space-x-reverse px-6">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'districts' && renderDistrictsTab()}
            {activeTab === 'settlements' && renderSettlementsTab()}
            {activeTab === 'voter-questions' && renderQuestionsTab('voter')}
            {activeTab === 'candidate-questions' && renderQuestionsTab('candidate')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;