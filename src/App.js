import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Send, Plus, Trash2, Download, Settings, Upload,
  X, User, Phone, Pencil, Smartphone, Menu, CheckSquare, Briefcase, Map, Home,
  Calendar, Bell, BellOff, Clock, Tag, Filter, ArrowUpDown, Banknote, FileText,
  Sprout, Flower, MapPin, Key, Store, Wallet, Volume2, LogOut, Loader2, CalendarDays, ChevronLeft, ChevronRight, Lock, AlertTriangle, RefreshCcw, FolderInput, List, Building2, Users, FileDown, ArrowRightLeft
} from 'lucide-react';

// --- HATA KALKANI ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Uygulama Hatası:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen p-6 bg-red-50 text-red-900 text-center">
          <AlertTriangle size={64} className="mb-4 text-red-600"/>
          <h1 className="text-2xl font-bold mb-2">Bir Hata Oluştu</h1>
          <p className="text-sm mb-4 bg-white p-4 rounded border border-red-200 font-mono text-left w-full overflow-auto">
            {this.state.error?.toString()}
          </p>
          <button onClick={() => window.location.reload()} className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-red-700 transition-all flex items-center gap-2">
             <RefreshCcw size={20}/> Sayfayı Yenile
          </button>
        </div>
      );
    }
    return this.props.children; 
  }
}

const LOCAL_STORAGE_KEY = 'emlaknomi_app_data';

// --- ANA İÇERİK ---
function MainApp() {
  // Website tarafından iletilecek olan Kullanıcı Bilgisi
  const [emlaknomiUser, setEmlaknomiUser] = useState({
     name: 'Kullanıcı',
     branch: 'Ereğli', 
     phone: '',
     role: 'admin' // admin veya firma_sahibi değilse normal kullanıcı sayılır
  });

  const [activeBranch, setActiveBranch] = useState(emlaknomiUser.branch);

  const defaultCategories = [
    { id: 'cat_randevu', title: 'Randevular', keywords: 'randevu,görüşme,buluşma,toplantı,yarın,saat,gösterilecek,gösterim,sunum,bakılacak', items: [], icon: 'calendar' },
    { id: 'cat_todo', title: 'Yapılacaklar', keywords: 'yapılacak,hatırlat,alınacak,git,gel,ara,sor,gönder,hazırla,not', items: [], icon: 'check' },
    { id: 'cat_konut', title: 'Konut', keywords: 'ev,daire,konut,villa,yalı,rezidans,bina,site,kat,apartman,stüdyo,1+1,2+1,3+1,4+1', items: [], icon: 'home' },
    { id: 'cat_ticari', title: 'Ticari', keywords: 'ofis,dükkan,depo,işyeri,plaza,mağaza,fabrika,imalathane,büro', items: [], icon: 'store' },
    { id: 'cat_devren', title: 'Devren', keywords: 'devren,devir,devredilecek,isim hakkı', items: [], icon: 'key' },
    { id: 'cat_arsa', title: 'Arsa', keywords: 'arsa,arazi,parsel,imarlı,yatırım,metrekare,tek tapu,hisseli,ifrazlı', items: [], icon: 'map' },
    { id: 'cat_tarla', title: 'Tarla', keywords: 'tarla,ekim,biçim,sulak,kuru,dönüm,tarım', items: [], icon: 'sprout' },
    { id: 'cat_bahce', title: 'Bahçe', keywords: 'bahçe,meyve,ağaç,fidan,hobi bahçesi,bağ', items: [], icon: 'flower' },
    { id: 'cat_trash', title: 'Çöp Kutusu', keywords: '', items: [], icon: 'trash' }
  ];

  const defaultCities = [
    { id: 'city_eregli', title: 'Ereğli', keywords: 'ereğli,toros,toros mahallesi,toki,organize' },
    { id: 'city_konya', title: 'Konya', keywords: 'konya,meram,selçuklu,karatay,bosna' },
    { id: 'city_karaman', title: 'Karaman', keywords: 'karaman,ermenek' },
    { id: 'city_alanya', title: 'Alanya', keywords: 'alanya,mahmutlar,kestel' },
    { id: 'city_eskisehir', title: 'Eskişehir', keywords: 'eskişehir,odunpazarı,tepebaşı' }
  ];

  const defaultTags = ["1+1", "2+1", "3+1", "4+1", "Müstakil", "Eşyalı", "Yatırımlık", "Garajlı", "Site İçinde", "Ara Kat", "Zemin Kat", "Güney Cephe", "Kuzey Cephe", "Sıfır"];
  const defaultBranches = ['Ereğli', 'Konya', 'Karaman', 'Alanya', 'Eskişehir'];

  const [categories, setCategories] = useState(defaultCategories);
  const [cities, setCities] = useState(defaultCities);
  const [availableTags, setAvailableTags] = useState(defaultTags);
  const [branches, setBranches] = useState(defaultBranches);
  const [lastAdNumber, setLastAdNumber] = useState(1000);

  const [activeTabId, setActiveTabId] = useState('cat_randevu');
  const [activeCityFilter, setActiveCityFilter] = useState('all'); 
  const [activeDealType, setActiveDealType] = useState('all'); 
  const [ownershipFilter, setOwnershipFilter] = useState('all'); // 'all', 'me', 'others'

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortOption, setSortOption] = useState('date_desc');
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
   
  const [isCalendarView, setIsCalendarView] = useState(false);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  
  const [calendarSelectedDate, setCalendarSelectedDate] = useState(null); 
  const [calendarInputText, setCalendarInputText] = useState('');
  const [calendarInputTime, setCalendarInputTime] = useState('09:00'); // Takvim yeni saat inputu
  const [viewingDayDate, setViewingDayDate] = useState(null); 

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showTagManagerModal, setShowTagManagerModal] = useState(false);
  const [showCityManagerModal, setShowCityManagerModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCustomersModal, setShowCustomersModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false); 
  const [showAddBranchModal, setShowAddBranchModal] = useState(false); // Yeni Şube Ekle Modalı
  
  const [editingItem, setEditingItem] = useState(null);
  const [transferringItem, setTransferringItem] = useState(null); 

  const [editingCategoryData, setEditingCategoryData] = useState({ id: '', title: '', keywords: '' });
  const [newCatTitle, setNewCatTitle] = useState('');
  const [newCatKeywords, setNewCatKeywords] = useState('');
  const [newCityTitle, setNewCityTitle] = useState('');
  const [newCityKeywords, setNewCityKeywords] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [importTarget, setImportTarget] = useState('auto');

  const [selectedInputCat, setSelectedInputCat] = useState('auto');
  const [showInputCatMenu, setShowInputCatMenu] = useState(false);
  
  const [customDialog, setCustomDialog] = useState({ isOpen: false, type: 'alert', message: '', onConfirm: null });
  
  const showDialog = (type, message, onConfirm = null) => {
      setCustomDialog({ isOpen: true, type, message, onConfirm });
  };
  const closeDialog = () => {
      setCustomDialog({ isOpen: false, type: 'alert', message: '', onConfirm: null });
  };

  const [customerFilter, setCustomerFilter] = useState('Tümü');
  const [customerBranchFilter, setCustomerBranchFilter] = useState('Tümü');
  const [customerConsultantFilter, setCustomerConsultantFilter] = useState('Tümü');
  const [expandedCustomer, setExpandedCustomer] = useState(null);

  const alarmSound = useRef(null);

  const activeProfile = window.EMLAKNOMI_USER || emlaknomiUser;
  const isAdmin = activeProfile.role === 'admin' || activeProfile.role === 'firma_sahibi';

  useEffect(() => {
    document.body.style.backgroundColor = '#f8fafc';
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.height = ''; 

    if (window.EMLAKNOMI_USER) {
       setEmlaknomiUser(window.EMLAKNOMI_USER);
       if (!localStorage.getItem('emlaknomi_active_branch')) {
           setActiveBranch(window.EMLAKNOMI_USER.branch);
       }
    }

    const savedBranch = localStorage.getItem('emlaknomi_active_branch');
    if (savedBranch) {
        setActiveBranch(savedBranch);
    }

    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        
        const dbCategories = data.categories || [];
        const mergedDefaults = defaultCategories.map(defCat => {
           const foundInDb = dbCategories.find(c => c.id === defCat.id);
           return foundInDb ? { ...defCat, items: foundInDb.items } : defCat;
        });
        const customCategories = dbCategories.filter(dbCat => 
           !defaultCategories.some(defCat => defCat.id === dbCat.id)
        );
        setCategories([...mergedDefaults, ...customCategories]);

        const dbCities = data.cities || [];
        const mergedCities = defaultCities.map(defCity => {
           const foundInDb = dbCities.find(c => c.id === defCity.id);
           return foundInDb || defCity;
        });
        const customCities = dbCities.filter(dbCity => 
           !defaultCities.some(defCity => defCity.id === dbCity.id)
        );
        setCities([...mergedCities, ...customCities]);

        const dbTags = data.tags || [];
        const mergedTags = Array.from(new Set([...defaultTags, ...dbTags]));
        setAvailableTags(mergedTags);

        const dbBranches = data.branches || defaultBranches;
        setBranches(dbBranches);

        if(data.lastAdNumber) setLastAdNumber(data.lastAdNumber);

        if(!window.EMLAKNOMI_USER && data.emlaknomiProfile) {
           setEmlaknomiUser(prev => ({ ...prev, ...data.emlaknomiProfile }));
           if (!savedBranch) setActiveBranch(data.emlaknomiProfile.branch);
        }
      } catch (error) {
         console.error("Veri okuma hatası:", error);
      }
    }

    try {
      alarmSound.current = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    } catch(e) {}
    
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const saveToLocal = (newCats, newCities, newTags, newAdNum, newBranches = branches) => {
    try {
      const currentProfile = window.EMLAKNOMI_USER || emlaknomiUser;
      const dataToSave = {
        categories: newCats,
        cities: newCities,
        tags: newTags,
        branches: newBranches,
        lastAdNumber: newAdNum,
        emlaknomiProfile: currentProfile,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error("Kayıt Hatası:", e);
      setFeedbackMsg("⚠️ Kayıt Başarısız!");
    }
  };

  const getUniqueBranches = () => {
      let branchSet = new Set(branches);
      if (activeProfile.branch) branchSet.add(activeProfile.branch);
      if (activeBranch) branchSet.add(activeBranch);

      categories.forEach(cat => {
          if (cat.id === 'cat_trash') return;
          cat.items.forEach(item => {
              if (item.branchName) branchSet.add(item.branchName);
          });
      });
      return Array.from(branchSet).sort();
  };

  const getUniqueConsultants = () => {
      let s = new Set();
      categories.forEach(cat => cat.items.forEach(i => {
          if(i.consultantName) s.add(i.consultantName);
      }));
      return Array.from(s).sort();
  };

  const handleBranchChange = (newBranch) => {
      setActiveBranch(newBranch);
      localStorage.setItem('emlaknomi_active_branch', newBranch);
      setShowBranchModal(false);
      setFeedbackMsg(`📍 Aktif Şube "${newBranch}" olarak değiştirildi.`);
      setTimeout(() => setFeedbackMsg(''), 3000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      categories.forEach(cat => {
        if(cat.id === 'cat_trash') return; 
        cat.items.forEach(item => {
          if (item.alarmActive && item.alarmTime) {
            const diff = now - new Date(item.alarmTime);
            if (diff >= 0 && diff < 60000) triggerNotification(item.text);
          }
        });
      });
    }, 30000); 
    return () => clearInterval(interval);
  }, [categories]);

  const triggerNotification = (text) => {
    if(alarmSound.current) alarmSound.current.play().catch(e=>console.log(e));
    if (Notification.permission === "granted") {
      if (navigator.serviceWorker && navigator.serviceWorker.ready) {
          navigator.serviceWorker.ready.then(reg => reg.showNotification("Emlak Asistanı", { body: text, icon: 'https://i.hizliresim.com/arpast7.jpeg', vibrate: [200, 100, 200] }));
      } else {
        new Notification("Emlak Asistanı", { body: text, icon: 'https://i.hizliresim.com/arpast7.jpeg' });
      }
    }
  };

  const addToNativeCalendar = (item) => {
    let startDate;
    if (item.alarmTime) {
      startDate = new Date(item.alarmTime);
    } else {
      startDate = new Date();
      startDate.setHours(startDate.getHours() + 1);
      startDate.setMinutes(0);
    }
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); 

    const formatDate = (date) => {
        return date.toISOString().replace(/-|:|\.\d+/g, ''); 
    };

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Emlaknomi//TR',
        'BEGIN:VEVENT',
        `UID:${item.id}@emlaknomi.com`,
        `DTSTAMP:${formatDate(new Date())}`,
        `DTSTART:${formatDate(startDate)}`,
        `DTEND:${formatDate(endDate)}`,
        `SUMMARY:Randevu: ${item.contactName || 'Müşteri'}`,
        `DESCRIPTION:${item.text.replace(/\n/g, '\\n')} \\nTel: ${item.phone || '-'}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Randevu_${item.adNo || item.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay(); 
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    const days = [];
    for (let i = 0; i < adjustedFirstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const extractInfo = (text) => {
    const phoneRegex = /(0?5\d{2})[\s-]?(\d{3})[\s-]?(\d{2})[\s-]?(\d{2})|(\d{10,11})/;
    const phoneMatch = text.match(phoneRegex);
    let phone = ''; if (phoneMatch) phone = phoneMatch[0];
    let price = 0;
    const lowerText = text.toLocaleLowerCase('tr-TR');
    const millionMatch = lowerText.match(/(\d+([.,]\d+)?)\s*milyon/);
    if (millionMatch) price = parseFloat(millionMatch[1].replace(',', '.')) * 1000000;
    else {
      const thousandMatch = lowerText.match(/(\d+([.,]\d+)?)\s*bin/);
      if (thousandMatch) price = parseFloat(thousandMatch[1].replace(',', '.')) * 1000;
      else {
        const rawMoneyMatch = lowerText.match(/(\d{1,3}(?:[.,]\d{3})*)\s*(tl|lira)/);
        if (rawMoneyMatch) price = parseFloat(rawMoneyMatch[1].replace(/\./g, '').replace(/,/g, '.'));
      }
    }
    return { phone, text, price };
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target.result;
      const lines = content.split(/\r?\n/);
      let importedCount = 0;
      let currentAdNo = lastAdNumber;
      let tempCategories = [...categories];

      lines.forEach(line => {
        if (!line.trim()) return;
        let cleanText = line.replace(/^[\d-]+\.?\s*/, '').trim();
        if(!cleanText) return;
        let { phone, text, price } = extractInfo(cleanText);
        const now = new Date();
        const fullDate = `${now.toLocaleDateString('tr-TR')} ${now.toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'})}`;
        const detectedTags = availableTags.filter(tag => cleanText.toLocaleLowerCase('tr-TR').includes(tag.toLocaleLowerCase('tr-TR')));
        
        let itemBranch = activeBranch;
        const branchMatch = cleanText.toLocaleLowerCase('tr-TR').match(/([a-zğüşöçı]+)\s+şube/i);
        if (branchMatch) itemBranch = branchMatch[1].charAt(0).toUpperCase() + branchMatch[1].slice(1);

        let detectedCityId = null; let detectedCityName = '';
        for (const city of cities) { 
           const cityKeys = city.keywords.split(',').map(k=>k.trim().toLocaleLowerCase('tr-TR')).filter(k=>k!=='');
           if (cityKeys.some(k=>cleanText.toLocaleLowerCase('tr-TR').includes(k))) { 
               detectedCityId = city.id; 
               detectedCityName = city.title; 
               break; 
           } 
        }

        if (!detectedCityId) {
            const matchedCity = cities.find(c => c.title.toLocaleLowerCase('tr-TR') === itemBranch.toLocaleLowerCase('tr-TR'));
            if (matchedCity) {
                detectedCityId = matchedCity.id;
                detectedCityName = matchedCity.title;
            } else {
                const defaultCity = cities.find(c => c.title === activeBranch);
                if(defaultCity) {
                    detectedCityId = defaultCity.id;
                    detectedCityName = defaultCity.title;
                }
            }
        }

        let dealType = 'sale'; if (cleanText.toLowerCase().includes('kira')) dealType = 'rent';
        
        let targetCatId = 'cat_todo';
        if (importTarget !== 'auto') targetCatId = importTarget;
        else {
             const priorityOrder = ['cat_devren', 'cat_ticari', 'cat_tarla', 'cat_bahce', 'cat_arsa', 'cat_konut', 'cat_randevu'];
             for (const catId of priorityOrder) {
               const cat = tempCategories.find(c => c.id === catId);
               if (cat && cat.keywords.split(',').some(k=>cleanText.toLowerCase().includes(k.trim()))) { targetCatId = cat.id; break; }
             }
        }
        currentAdNo++;
        const newItem = { 
            id: Date.now() + Math.random(), adNo: currentAdNo, text: cleanText, phone, contactName: '', 
            date: fullDate, price, alarmTime: '', alarmActive: false, tags: detectedTags, 
            cityId: detectedCityId, cityName: detectedCityName, dealType, branchName: itemBranch,
            consultantName: activeProfile.name
        };
        tempCategories = tempCategories.map(c => { if (c.id === targetCatId) { return { ...c, items: [newItem, ...c.items] }; } return c; });
        importedCount++;
      });
      setCategories(tempCategories);
      setLastAdNumber(currentAdNo);
      saveToLocal(tempCategories, cities, availableTags, currentAdNo);
      setFeedbackMsg(`${importedCount} kayıt yüklendi!`);
      setShowImportModal(false);
    };
    reader.readAsText(file, "UTF-8");
  };

  const parseDateFromText = (text) => {
    const now = new Date();
    const lower = text.toLocaleLowerCase('tr-TR');
    let targetDate = new Date();
    let found = false;

    const days = ['pazar', 'pazartesi', 'salı', 'çarşamba', 'perşembe', 'cuma', 'cumartesi'];
    const currentDayIndex = now.getDay();
    let targetDayIndex = -1;

    for (let i = 0; i < days.length; i++) {
        if (lower.includes(days[i])) {
            targetDayIndex = i;
            found = true;
            break;
        }
    }

    let addWeeks = 0;
    if (lower.includes('haftaya') || lower.includes('gelecek') || lower.includes('önümüzdeki')) {
        addWeeks = 1;
        found = true;
    }

    if (lower.includes('yarın')) {
        targetDate.setDate(targetDate.getDate() + 1);
        found = true;
    } else if (targetDayIndex !== -1) {
        let diff = targetDayIndex - currentDayIndex;
        if (diff <= 0) diff += 7; 
        targetDate.setDate(targetDate.getDate() + diff + (addWeeks * 7));
    } else if (addWeeks > 0) {
        targetDate.setDate(targetDate.getDate() + 7);
    }

    let hours = 9; 
    let minutes = 0;
    let timeFound = false;

    const explicitTime = lower.match(/(\d{1,2})[.:](\d{2})/);
    if (explicitTime) {
        hours = parseInt(explicitTime[1]);
        minutes = parseInt(explicitTime[2]);
        timeFound = true;
    } 
    else {
        const suffixTime = lower.match(/(\d{1,2})\s*(?:'|’)?\s*(?:de|da|te|ta)\b/);
        const saatWordTime = lower.match(/saat\s*(\d{1,2})/);

        if (suffixTime) {
             hours = parseInt(suffixTime[1]);
             timeFound = true;
        } else if (saatWordTime) {
             hours = parseInt(saatWordTime[1]);
             timeFound = true;
        }
    }

    if (timeFound) {
        if (hours < 8 && !lower.includes('sabah') && !lower.includes('gece')) {
            hours += 12;
        }
        targetDate.setHours(hours, minutes, 0, 0);
        found = true;
    } else {
        targetDate.setHours(9, 0, 0, 0);
    }

    if (found) {
        const y = targetDate.getFullYear();
        const m = String(targetDate.getMonth() + 1).padStart(2, '0');
        const d = String(targetDate.getDate()).padStart(2, '0');
        const h = String(targetDate.getHours()).padStart(2, '0');
        const min = String(targetDate.getMinutes()).padStart(2, '0');
        return `${y}-${m}-${d}T${h}:${min}`;
    }
    return null;
  };

  const processCommand = (rawText, specificContact = null, forcedDateString = null) => {
    if (!rawText.trim() && !specificContact) return;
    
    let textToProcess = rawText.replace(/(\d)\s*\+\s*(\d)/g, '$1+$2'); 
    const now = new Date();
    const fullDate = `${now.toLocaleDateString('tr-TR')} ${now.toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'})}`;
    const timestamp = Date.now();
    const lowerText = textToProcess.toLocaleLowerCase('tr-TR');
    
    let { phone, text, price } = extractInfo(textToProcess);
    let contactName = '';
    
    if (!phone && activeProfile.phone) phone = activeProfile.phone;

    if (specificContact) { 
        contactName = specificContact.name; 
        if (specificContact.tel) phone = specificContact.tel; 
    } 
    
    let itemBranch = activeBranch || 'Ereğli';
    let isBranchExtractedFromText = false;
    const branchMatch = lowerText.match(/([a-zğüşöçı]+)\s+şube/i);
    if (branchMatch) {
        itemBranch = branchMatch[1].charAt(0).toUpperCase() + branchMatch[1].slice(1);
        isBranchExtractedFromText = true;
    }

    let detectedCityId = null; let detectedCityName = '';
    for (const city of cities) {
      const cityKeys = city.keywords.split(',').map(k => k.trim().toLocaleLowerCase('tr-TR')).filter(k => k !== '');
      if (cityKeys.some(key => lowerText.includes(key))) { detectedCityId = city.id; detectedCityName = city.title; break; }
    }
    
    if (!detectedCityId) {
        const matchedCity = cities.find(c => c.title.toLocaleLowerCase('tr-TR') === itemBranch.toLocaleLowerCase('tr-TR'));
        if (matchedCity) {
            detectedCityId = matchedCity.id;
            detectedCityName = matchedCity.title;
        } else {
            const defaultCity = cities.find(c => c.title === activeBranch);
            if(defaultCity) {
                detectedCityId = defaultCity.id;
                detectedCityName = defaultCity.title;
            }
        }
    }

    let dealType = 'sale'; 
    if (lowerText.includes('kiralık') || lowerText.includes('kira')) dealType = 'rent'; 
    else if (lowerText.includes('satılık')) dealType = 'sale';
    const detectedTags = availableTags.filter(tag => lowerText.includes(tag.toLocaleLowerCase('tr-TR')));
    const newAdNo = lastAdNumber + 1;
    
    let alarmTime = '';
    let alarmActive = false;

    if (forcedDateString) {
        const d = new Date(forcedDateString); 
        const year = d.getFullYear(); const month = String(d.getMonth() + 1).padStart(2, '0'); const day = String(d.getDate()).padStart(2, '0');
        const hrs = String(d.getHours()).padStart(2, '0');
        const mins = String(d.getMinutes()).padStart(2, '0');
        alarmTime = `${year}-${month}-${day}T${hrs}:${mins}`;
        alarmActive = true;
    } else {
        const detectedDate = parseDateFromText(textToProcess);
        if (detectedDate) {
            alarmTime = detectedDate;
            alarmActive = true;
        }
    }

    const newItem = { 
       id: timestamp, 
       adNo: newAdNo, 
       text: text, 
       phone, 
       contactName, 
       date: fullDate, 
       price, 
       alarmTime: alarmTime, 
       alarmActive: alarmActive, 
       tags: detectedTags, 
       cityId: detectedCityId, 
       cityName: detectedCityName, 
       dealType: dealType,
       branchName: itemBranch,
       consultantName: activeProfile.name
    };
    
    let targetCategoryId = 'cat_todo';
    
    if (selectedInputCat !== 'auto') {
        targetCategoryId = selectedInputCat;
    } else {
        const appointmentTriggers = ['randevu', 'gösterim', 'gösterilecek', 'sunum', 'yer gösterme', 'bakılacak', 'yarın', 'saat', 'toplantı', 'haftaya', 'gün'];
        const isAppointment = appointmentTriggers.some(trigger => lowerText.includes(trigger));
        
        if (alarmActive || isAppointment) { targetCategoryId = 'cat_randevu'; } 
        else if (lowerText.includes('devren')) { targetCategoryId = 'cat_devren'; } 
        else {
            const priorityOrder = ['cat_ticari', 'cat_tarla', 'cat_bahce', 'cat_arsa', 'cat_konut'];
            for (const catId of priorityOrder) {
              const cat = categories.find(c => c.id === catId);
              if (cat) {
                const keys = cat.keywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k !== '');
                if (keys.some(key => lowerText.includes(key))) { targetCategoryId = cat.id; break; }
              }
            }
        }
    }

    const commitSave = () => {
        const newCategories = categories.map(c => { if (c.id === targetCategoryId) { return { ...c, items: [newItem, ...c.items] }; } return c; });
        setCategories(newCategories);
        setLastAdNumber(newAdNo);
        saveToLocal(newCategories, cities, availableTags, newAdNo); 
        const targetCategory = categories.find(c => c.id === targetCategoryId);
        setFeedbackMsg(`✅ #${newAdNo} - "${targetCategory?.title}" eklendi.`);
        setActiveTabId(targetCategoryId);
        if(detectedCityId) setActiveCityFilter(detectedCityId);
        setInputText('');
        setTimeout(() => setFeedbackMsg(''), 3000);

        if (targetCategoryId === 'cat_randevu') {
           addToNativeCalendar(newItem);
        }
    };

    if (isBranchExtractedFromText && itemBranch !== activeBranch) {
        showDialog('confirm', `Bu kayıt "${itemBranch}" şubesine eklenecek. Onaylıyor musunuz?`, commitSave);
    } else {
        commitSave();
    }
  };

  const executeDelete = (catId, itemId) => {
    if (catId === 'cat_trash') {
        const newCategories = categories.map(c => { if (c.id === catId) return {...c, items: c.items.filter(i => i.id !== itemId)}; return c; });
        setCategories(newCategories);
        saveToLocal(newCategories, cities, availableTags, lastAdNumber);
    } else {
        let itemToMove = null;
        let newCategories = categories.map(c => {
            if (c.id === catId) {
                itemToMove = c.items.find(i => i.id === itemId);
                return {...c, items: c.items.filter(i => i.id !== itemId)};
            }
            return c;
        });
        if (itemToMove) {
            newCategories = newCategories.map(c => {
                if (c.id === 'cat_trash') return {...c, items: [itemToMove, ...c.items]};
                return c;
            });
        }
        setCategories(newCategories);
        saveToLocal(newCategories, cities, availableTags, lastAdNumber);
        setFeedbackMsg(`🗑️ Öğe çöp kutusuna taşındı.`);
        setTimeout(() => setFeedbackMsg(''), 3000);
    }
  };

  const requestDelete = (catId, itemId) => {
    if (catId === 'cat_trash') {
        showDialog('confirm', "Bu öğeyi kalıcı olarak silmek istediğinize emin misiniz?", () => executeDelete(catId, itemId));
    } else {
        showDialog('confirm', "Bu öğe çöp kutusuna taşınacak. Emin misiniz?", () => executeDelete(catId, itemId));
    }
  };

  const executeEmptyTrash = () => {
    const newCategories = categories.map(c => {
        if (c.id === 'cat_trash') return {...c, items: []};
        return c;
    });
    setCategories(newCategories);
    saveToLocal(newCategories, cities, availableTags, lastAdNumber);
    setFeedbackMsg(`✨ Çöp kutusu boşaltıldı.`);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const requestEmptyTrash = () => {
      showDialog('confirm', "Çöp kutusundaki tüm öğeler KALICI olarak silinecektir. Emin misiniz?", executeEmptyTrash);
  };

  const saveItemChanges = () => {
    if (!editingItem) return;
    
    let newCategories = [...categories];
    const { originalCatId, targetCatId, item } = editingItem;

    if (originalCatId === targetCatId) {
      newCategories = newCategories.map(c => {
        if (c.id === originalCatId) return { ...c, items: c.items.map(i => i.id === item.id ? item : i) };
        return c;
      });
    } else {
      newCategories = newCategories.map(c => { if (c.id === originalCatId) return { ...c, items: c.items.filter(i => i.id !== item.id) }; return c; });
      newCategories = newCategories.map(c => { if (c.id === targetCatId) return { ...c, items: [item, ...c.items] }; return c; });
    }

    setCategories(newCategories);
    saveToLocal(newCategories, cities, availableTags, lastAdNumber);
    setEditingItem(null);
  };

  const executeTransfer = () => {
     if(!transferringItem) return;
     let newCategories = [...categories];
     const { originalCatId, targetCatId, targetBranchName, item } = transferringItem;
     
     const updatedItem = { ...item, branchName: targetBranchName };

     newCategories = newCategories.map(c => { if (c.id === originalCatId) return { ...c, items: c.items.filter(i => i.id !== item.id) }; return c; });
     newCategories = newCategories.map(c => { if (c.id === targetCatId) return { ...c, items: [updatedItem, ...c.items] }; return c; });

     setCategories(newCategories);
     saveToLocal(newCategories, cities, availableTags, lastAdNumber);
     setTransferringItem(null);
     setFeedbackMsg(`🔄 Öğe başarıyla transfer edildi.`);
     setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleCalendarAdd = () => { 
      if(!calendarInputText) return; 
      const [hours, minutes] = calendarInputTime.split(':');
      const d = new Date(calendarSelectedDate);
      d.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      processCommand(calendarInputText, null, d.toISOString()); 
      setCalendarSelectedDate(null); 
      setCalendarInputText(''); 
  };
  
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return showDialog('alert', "Ses algılama tarayıcınız tarafından desteklenmiyor.");
    const recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInputText(transcript);
      processCommand(transcript);
    };
    recognition.start();
  };

  const startListeningCalendar = () => { 
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; 
      if (!SpeechRecognition) return showDialog('alert', "Ses algılama tarayıcınız tarafından desteklenmiyor."); 
      const recognition = new SpeechRecognition(); 
      recognition.lang = 'tr-TR'; 
      recognition.onstart = () => setIsListening(true); 
      recognition.onend = () => setIsListening(false); 
      recognition.onresult = (e) => setCalendarInputText(e.results[0][0].transcript); 
      recognition.start(); 
  };
   
  const getProcessedItems = (items) => {
    let result = [...items];
    if (activeCityFilter !== 'all') { result = result.filter(item => item.cityId === activeCityFilter); }
    if (activeDealType !== 'all' && activeTabId !== 'cat_todo' && activeTabId !== 'cat_randevu') { result = result.filter(item => item.dealType === activeDealType); }
    if (activeFilters.length > 0) { result = result.filter(item => activeFilters.every(filterTag => item.tags && item.tags.includes(filterTag))); }
    if (priceFilter.min !== '') { result = result.filter(item => item.price >= parseFloat(priceFilter.min)); }
    if (priceFilter.max !== '') { result = result.filter(item => item.price <= parseFloat(priceFilter.max)); }
    
    if (activeTabId !== 'cat_trash') {
         result = result.filter(item => (item.branchName || 'Ereğli') === activeBranch);
    }

    if (!isAdmin && (activeTabId === 'cat_randevu' || activeTabId === 'cat_todo')) {
         result = result.filter(item => item.consultantName === activeProfile.name);
    } else if (activeTabId !== 'cat_randevu' && activeTabId !== 'cat_todo' && activeTabId !== 'cat_trash') {
         if (ownershipFilter === 'me') {
             result = result.filter(item => item.consultantName === activeProfile.name);
         } else if (ownershipFilter === 'others') {
             result = result.filter(item => item.consultantName !== activeProfile.name);
         }
    }

    result.sort((a, b) => {
      switch (sortOption) {
        case 'date_asc': return a.id - b.id;
        case 'date_desc': return b.id - a.id;
        case 'price_asc': if (!a.price) return 1; if (!b.price) return -1; return a.price - b.price;
        case 'price_desc': if (!a.price) return 1; if (!b.price) return -1; return b.price - a.price;
        default: return b.id - a.id;
      }
    });
    return result;
  };

  const getEventsForDate = (targetDate) => {
      if (!targetDate) return [];
      let events = [];
      categories.forEach(c => {
          if (c.id === 'cat_trash') return; 
          c.items.forEach(item => {
              if (item.alarmTime && (item.branchName || 'Ereğli') === activeBranch) {
                  if (!isAdmin && item.consultantName !== activeProfile.name) return;
                  
                  const itemDate = new Date(item.alarmTime);
                  if (itemDate.getDate() === targetDate.getDate() && 
                      itemDate.getMonth() === targetDate.getMonth() && 
                      itemDate.getFullYear() === targetDate.getFullYear()) {
                      events.push({ ...item, originalCatId: c.id });
                  }
              }
          });
      });
      return events;
  };

  const branchList = getUniqueBranches();

  const getCustomerList = (selectedCat = 'Tümü', selectedBranch = 'Tümü') => {
    let customers = [];
    categories.forEach(cat => {
        if (cat.id === 'cat_trash') return; 
        
        let group = 'Diğer';
        const titleLower = cat.title.toLowerCase();
        if(titleLower.includes('konut') || titleLower.includes('ev')) group = 'Konut';
        else if(titleLower.includes('arsa')) group = 'Arsa';
        else if(titleLower.includes('tarla')) group = 'Tarla';
        else if(titleLower.includes('ticari') || titleLower.includes('dükkan') || titleLower.includes('ofis')) group = 'Ticari';
        else if(titleLower.includes('bahçe')) group = 'Bahçe';

        if (selectedCat !== 'Tümü' && group !== selectedCat) return;

        cat.items.forEach(item => {
            const itemBranch = item.branchName || 'Ereğli';
            if (selectedBranch !== 'Tümü' && itemBranch !== selectedBranch) return;
            
            if (!isAdmin && item.consultantName !== activeProfile.name) return;
            if (isAdmin && customerConsultantFilter !== 'Tümü' && item.consultantName !== customerConsultantFilter) return;

            if (item.contactName || item.phone) {
                customers.push({
                    ...item,
                    groupName: group,
                    originalCategoryTitle: cat.title
                });
            }
        });
    });
    
    return customers.sort((a, b) => b.id - a.id);
  }

  const formatCurrency = (amount) => { if (!amount) return ''; return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(amount); };
  const toggleFilter = (tag) => { if (activeFilters.includes(tag)) setActiveFilters(activeFilters.filter(t => t !== tag)); else setActiveFilters([...activeFilters, tag]); };
   
  const downloadAllData = () => {
    let allItems = [];
    categories.forEach(cat => { 
        if(cat.items.length > 0 && cat.id !== 'cat_trash') {
            const branchItems = cat.items.filter(i => (i.branchName || 'Ereğli') === activeBranch && (isAdmin || i.consultantName === activeProfile.name));
            allItems = [...allItems, ...branchItems]; 
        }
    });
    allItems.sort((a, b) => (b.adNo || 0) - (a.adNo || 0));
    
    if (allItems.length === 0) {
        showDialog('alert', "Aktif şubenizde indirilecek kayıt bulunamadı.");
        return;
    }

    let fullContent = `${activeBranch.toUpperCase()} ŞUBESİ TÜM VERİLER - ${new Date().toLocaleString('tr-TR')}\r\n\r\n`;
    categories.forEach(cat => {
      if(cat.items.length > 0 && cat.id !== 'cat_trash') {
        const branchItems = cat.items.filter(i => (i.branchName || 'Ereğli') === activeBranch && (isAdmin || i.consultantName === activeProfile.name));
        if(branchItems.length > 0) {
            fullContent += `>>> ${cat.title.toUpperCase()} <<<\r\n`;
            const sortedItems = branchItems.sort((a, b) => (b.adNo || 0) - (a.adNo || 0));
            sortedItems.forEach(item => {
               fullContent += `#${item.adNo || '-'} | ${item.date} | ${item.cityName || ''} | Danışman: ${item.consultantName || '-'}\r\n${item.text}\r\nKişi: ${item.contactName || '-'} (${item.phone || '-'})\r\nFiyat: ${formatCurrency(item.price)}\r\n---\r\n`;
            });
        }
      }
    });
    downloadFile(fullContent, `${activeBranch}_Tum_Kayitlar.txt`);
    setShowMenu(false);
  };

  const downloadFilteredData = () => {
    const activeCategory = categories.find(c => c.id === activeTabId) || categories[0];
    if(activeCategory.id === 'cat_trash') return showDialog('alert', "Çöp kutusunu indiremezsiniz.");
    
    const filteredItems = getProcessedItems(activeCategory.items);
    if (filteredItems.length === 0) return showDialog('alert', "Mevcut listede indirilecek veri bulunamadı.");
    
    filteredItems.sort((a, b) => (b.adNo || 0) - (a.adNo || 0));
    let content = `${activeCategory.title.toUpperCase()} RAPORU (${activeBranch} Şubesi) - ${new Date().toLocaleString('tr-TR')}\r\n\r\n`;
    filteredItems.forEach((item) => {
        content += `#${item.adNo || '-'} | ${item.cityName || ''} | ${item.dealType === 'rent' ? 'KİRA' : 'SATILIK'} | Danışman: ${item.consultantName || '-'}\r\n${item.text}\r\nFiyat: ${formatCurrency(item.price)}\r\n---\r\n`;
    });
    downloadFile(content, `${activeBranch}_${activeCategory.title}_Raporu.txt`);
    setShowMenu(false);
  };

  const downloadCustomerList = () => {
    const list = getCustomerList(customerFilter, customerBranchFilter);
    if(list.length === 0) return showDialog('alert', "Bu filtreyle eşleşen müşteri bulunamadı.");
    
    let content = `MÜŞTERİ LİSTESİ (${customerFilter} - ${customerBranchFilter} Şubesi) - ${new Date().toLocaleString('tr-TR')}\r\n\r\n`;
    list.forEach(c => {
       content += `Müşteri: ${c.contactName || 'İsimsiz'} | Tel: ${c.phone || '-'}\r\n`;
       content += `Grup: ${c.groupName} | Kategori: ${c.originalCategoryTitle} | Şube: ${c.branchName || '-'} | Danışman: ${c.consultantName || '-'}\r\n`;
       content += `Talep: ${c.text}\r\n`;
       content += `Fiyat: ${formatCurrency(c.price)}\r\n`;
       content += `-------------------------------------------\r\n`;
    });
    downloadFile(content, `Musteri_Listesi.txt`);
  };

  const downloadFile = (content, filename) => {
    const blob = new Blob(["\uFEFF" + content], { type: 'text/plain;charset=utf-8' });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(blob);
    element.download = filename;
    document.body.appendChild(element); element.click(); document.body.removeChild(element);
  };

  const getIcon = (icon) => {
    if(icon==='home') return <Home size={16}/>;
    if(icon==='map') return <Map size={16}/>;
    if(icon==='calendar') return <Calendar size={16}/>;
    if(icon==='check') return <CheckSquare size={16}/>;
    if(icon==='sprout') return <Sprout size={16}/>;
    if(icon==='flower') return <Flower size={16}/>;
    if(icon==='store') return <Store size={16}/>;
    if(icon==='key') return <Key size={16}/>;
    if(icon==='trash') return <Trash2 size={16}/>;
    return <Briefcase size={16}/>;
  }

  const addNewCity = () => { if (!newCityTitle) return; setCities([...cities, { id: `city_${Date.now()}`, title: newCityTitle, keywords: newCityKeywords }]); setNewCityTitle(''); setNewCityKeywords(''); };
  
  const requestRemoveCity = (cityId) => {
      showDialog('confirm', "Bu şehri silmek istediğinize emin misiniz?", () => setCities(cities.filter(c => c.id !== cityId)));
  };

  const activeCategory = categories.find(c => c.id === activeTabId) || categories[0];
  const displayItems = getProcessedItems(activeCategory.items);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 relative pb-28">
      
      {/* Özel Uyarı/Onay Penceresi */}
      {customDialog.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-2xl text-center border border-slate-100 animate-in zoom-in-95">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${customDialog.type === 'confirm' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                    <AlertTriangle size={24}/>
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-800">{customDialog.type === 'confirm' ? 'Emin misiniz?' : 'Bilgilendirme'}</h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">{customDialog.message}</p>
                <div className="flex gap-3 justify-center">
                    {customDialog.type === 'confirm' && (
                        <button onClick={closeDialog} className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all">İptal</button>
                    )}
                    <button onClick={() => {
                        if (customDialog.onConfirm) customDialog.onConfirm();
                        closeDialog();
                    }} className={`flex-1 py-3 rounded-xl font-bold text-white transition-all shadow-md ${customDialog.type === 'confirm' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : 'bg-slate-800 hover:bg-slate-900'}`}>
                        Tamam
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Şube Değiştirme Modalı */}
      {showBranchModal && (
         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[5000]">
            <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-2xl animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><Building2 size={18} className="text-indigo-600"/> Şube Değiştir</h3>
                    <button onClick={() => setShowBranchModal(false)} className="text-slate-400 hover:bg-slate-100 p-1 rounded"><X size={18}/></button>
                </div>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Çalışmak istediğiniz şubeyi seçin.</p>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {branchList.map(b => (
                        <button key={b} onClick={() => handleBranchChange(b)} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${activeBranch === b ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'}`}>
                            {b} {activeBranch === b && <CheckSquare size={16}/>}
                        </button>
                    ))}
                </div>
            </div>
         </div>
      )}

      {/* Transfer Modalı */}
      {transferringItem && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[6000]">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95">
                 <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><ArrowRightLeft size={18} className="text-orange-500"/> Kayıt Transferi</h3>
                    <button onClick={() => setTransferringItem(null)} className="text-slate-400 hover:bg-slate-100 p-1 rounded"><X size={18}/></button>
                </div>
                <p className="text-xs text-slate-500 mb-4">Bu kaydı başka bir şubeye veya bölüme taşıyın.</p>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Hedef Şube</label>
                        <select 
                            value={transferringItem.targetBranchName}
                            onChange={(e) => setTransferringItem({...transferringItem, targetBranchName: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            {branchList.map(b => <option key={b} value={b}>{b} Şubesi</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Hedef Bölüm</label>
                        <select 
                            value={transferringItem.targetCatId}
                            onChange={(e) => setTransferringItem({...transferringItem, targetCatId: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            {categories.filter(c => c.id !== 'cat_trash').map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button onClick={() => setTransferringItem(null)} className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all">İptal</button>
                    <button onClick={executeTransfer} className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-md shadow-orange-500/20">Taşı</button>
                </div>
            </div>
          </div>
      )}

      {/* Şube Ekle Modalı (Sadece Admin) */}
      {showAddBranchModal && isAdmin && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-[5000]">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Building2 size={18}/> Yeni Şube Ekle</h3>
                <button onClick={() => setShowAddBranchModal(false)} className="text-slate-400 hover:bg-slate-100 p-1 rounded"><X size={18}/></button>
            </div>
            <input 
                placeholder="Örn: Ankara" 
                value={newBranchName} 
                onChange={(e) => setNewBranchName(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button onClick={() => { 
                if(!newBranchName.trim()) return; 
                if(!branches.includes(newBranchName.trim())) {
                    const updated = [...branches, newBranchName.trim()];
                    setBranches(updated);
                    saveToLocal(categories, cities, availableTags, lastAdNumber, updated);
                    setFeedbackMsg(`🏢 Yeni şube eklendi: ${newBranchName}`);
                    setTimeout(() => setFeedbackMsg(''), 3000);
                } else {
                    showDialog('alert', "Bu şube zaten mevcut.");
                }
                setShowAddBranchModal(false); 
                setNewBranchName(''); 
            }} className="w-full bg-slate-800 text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-900 transition-all">EKLE</button>
            <button onClick={() => setShowAddBranchModal(false)} className="w-full mt-2 text-slate-500 text-xs py-2 font-medium hover:bg-slate-50 rounded-lg">İptal</button>
          </div>
        </div>
      )}

      <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-200">
        <div className="bg-slate-900 text-white p-2 flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <img src="https://emlaknomi.com/wp-content/uploads/2023/12/Emlaknomi-Simgesi.png" alt="Logo" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x50/transparent/white?text=E"}} className="w-10 h-10 object-contain rounded-md bg-white/10 p-1"/>
            <div className="flex flex-col justify-center h-full pt-1 cursor-pointer group" onClick={() => setShowBranchModal(true)}>
              <h1 className="font-bold text-sm text-orange-400 leading-tight group-hover:text-orange-300 transition-colors">Emlaknomi Talepler ve Randevular</h1>
              <div className="flex items-center gap-2 mt-0.5">
                 <div className="flex flex-col">
                    <p className="text-[0.6rem] text-slate-300 flex items-center gap-1"><User size={10}/> {activeProfile.name}</p>
                    <p className="text-[0.6rem] text-blue-300 font-bold flex items-center gap-1 bg-blue-900/50 px-1 rounded"><Building2 size={10}/> {activeBranch} Şubesi <span className="text-[8px] opacity-70">(Değiştir)</span></p>
                 </div>
              </div>
            </div>
          </div>
          <div className="flex gap-1 items-center">
             <button onClick={() => setShowFilters(!showFilters)} className="p-1.5 rounded-md hover:bg-slate-700"><Filter size={18} color="white"/></button>
             {isAdmin && <button onClick={() => setShowAddModal(true)} className="p-1.5 rounded-md hover:bg-slate-700"><Plus size={18} color="white"/></button>}
             <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 rounded-md hover:bg-slate-700">
               {showMenu ? <X size={18} color="white"/> : <Menu size={18} color="white"/>}
             </button>
          </div>
        </div>

        <div className="overflow-x-auto z-10 scrollbar-hide bg-slate-900">
          <div className="flex p-2 gap-2 w-max">
            {categories.map(cat => {
              const isActive = activeTabId === cat.id;
              const isTrash = cat.id === 'cat_trash';
              return (
                  <button key={cat.id} onClick={() => {setActiveTabId(cat.id); setIsCalendarView(false);}} 
                    className={`px-4 py-2 rounded-lg text-sm border transition-all flex items-center gap-2 
                      ${isActive 
                        ? (isTrash ? 'bg-red-600 text-white border-red-600 shadow-md font-bold' : 'bg-orange-500 text-slate-900 border-orange-500 shadow-md font-bold') 
                        : (isTrash ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 font-medium' : 'bg-slate-800 text-slate-300 font-medium border-slate-700 hover:bg-slate-700')}`}>
                    <span className={isActive ? (isTrash ? 'text-white' : 'text-slate-900') : (isTrash ? 'text-red-400' : 'text-orange-400')}>{getIcon(cat.icon)}</span> {cat.title}
                  </button>
              );
            })}
          </div>
        </div>

        {activeTabId === 'cat_randevu' && (
          <div className="px-4 py-2 flex justify-end border-b border-slate-200 bg-slate-50">
            <button onClick={() => setIsCalendarView(!isCalendarView)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isCalendarView ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-200'}`}>
              {isCalendarView ? <><CheckSquare size={14}/> Liste Görünümü</> : <><CalendarDays size={14}/> Takvim Görünümü</>}
            </button>
          </div>
        )}

        {!isCalendarView && activeTabId !== 'cat_trash' && (
          <div className="border-b border-slate-200 overflow-x-auto z-10 scrollbar-hide py-2 bg-slate-50">
            <div className="flex px-2 gap-2 w-max items-center">
              <MapPin size={14} className="text-slate-400"/>
              <button onClick={() => setActiveCityFilter('all')} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${activeCityFilter === 'all' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-600 border-slate-300'}`}>Tümü</button>
              {cities.map(city => (
                <button key={city.id} onClick={() => setActiveCityFilter(city.id)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${activeCityFilter === city.id ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-600 border-slate-300'}`}>
                  {city.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ortak Alanlar için Sahiplik (Danışman) Filtresi ve Tip Filtresi */}
        {!isCalendarView && activeTabId !== 'cat_todo' && activeTabId !== 'cat_randevu' && activeTabId !== 'cat_trash' && (
          <div className="border-b border-slate-200 overflow-x-auto z-10 scrollbar-hide py-2 px-2 bg-slate-100 flex flex-col gap-2">
            <div className="flex gap-2 w-max items-center">
              <Wallet size={14} className="text-slate-400 mr-1"/>
              <button onClick={() => setActiveDealType('all')} className={`text-xs px-4 py-1 rounded-md border font-bold transition-all ${activeDealType === 'all' ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-slate-500 border-slate-200'}`}>Tümü</button>
              <button onClick={() => setActiveDealType('sale')} className={`text-xs px-4 py-1 rounded-md border font-bold transition-all ${activeDealType === 'sale' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-600 border-slate-200'}`}>Satılık</button>
              <button onClick={() => setActiveDealType('rent')} className={`text-xs px-4 py-1 rounded-md border font-bold transition-all ${activeDealType === 'rent' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-purple-600 border-slate-200'}`}>Kiralık</button>
            </div>
            <div className="flex gap-2 w-max items-center">
              <Users size={14} className="text-slate-400 mr-1"/>
              <button onClick={() => setOwnershipFilter('all')} className={`text-xs px-4 py-1 rounded-md border font-bold transition-all ${ownershipFilter === 'all' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'}`}>Tümü</button>
              <button onClick={() => setOwnershipFilter('me')} className={`text-xs px-4 py-1 rounded-md border font-bold transition-all ${ownershipFilter === 'me' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'}`}>Taleplerim</button>
              <button onClick={() => setOwnershipFilter('others')} className={`text-xs px-4 py-1 rounded-md border font-bold transition-all ${ownershipFilter === 'others' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'}`}>Diğer Danışmanlar</button>
            </div>
          </div>
        )}

        {!isCalendarView && showFilters && (
          <div className="border-b border-slate-200 p-3 z-10 bg-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-slate-500 text-xs font-bold flex gap-1"><ArrowUpDown size={14}/> Sırala:</div>
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="bg-white border border-slate-300 text-slate-700 text-xs rounded-lg p-2 flex-1 outline-none">
                <option value="date_desc">En Yeni</option>
                <option value="date_asc">En Eski</option>
                <option value="price_asc">Fiyat (Artan)</option>
                <option value="price_desc">Fiyat (Azalan)</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="text-slate-500 text-xs font-bold flex gap-1"><Banknote size={14}/> Fiyat:</div>
              <input type="number" placeholder="Min" value={priceFilter.min} onChange={(e)=>setPriceFilter({...priceFilter, min: e.target.value})} className="w-1/3 bg-white border border-slate-300 rounded-lg p-1.5 text-xs"/>
              <input type="number" placeholder="Max" value={priceFilter.max} onChange={(e)=>setPriceFilter({...priceFilter, max: e.target.value})} className="w-1/3 bg-white border border-slate-300 rounded-lg p-1.5 text-xs"/>
            </div>
            <div className="flex gap-2 w-full overflow-x-auto pb-1">
              {availableTags.map(tag => (
                <button key={tag} onClick={() => toggleFilter(tag)} className={`text-xs px-3 py-1.5 rounded-full border whitespace-nowrap ${activeFilters.includes(tag) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300'}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4"> 
        {activeTabId === 'cat_trash' && displayItems.length > 0 && (
            <div className="flex justify-end mb-4">
                <button onClick={requestEmptyTrash} className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-100 transition-all">
                    <Trash2 size={16}/> Çöp Kutusunu Boşalt
                </button>
            </div>
        )}

        {isCalendarView && activeTabId === 'cat_randevu' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 max-w-sm mx-auto mt-2">
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1))} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><ChevronLeft size={18}/></button>
              <h3 className="font-bold text-base text-slate-800">{currentCalendarDate.toLocaleString('tr-TR', { month: 'long', year: 'numeric' })}</h3>
              <button onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1))} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><ChevronRight size={18}/></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa'].map(d => <div key={d} className="text-[10px] font-bold text-slate-400 uppercase">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentCalendarDate).map((date, i) => {
                if (!date) return <div key={i} className="h-10"></div>;
                
                const dayEvents = getEventsForDate(date);
                const isToday = date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();

                return (
                  <div key={i} className={`h-10 w-full rounded-xl border text-sm flex flex-col items-center justify-center relative cursor-pointer transition-all ${dayEvents.length > 0 ? 'bg-indigo-50 border-indigo-200 font-bold text-indigo-700 hover:bg-indigo-100 shadow-sm' : 'bg-white border-transparent text-slate-600 hover:bg-slate-50'} ${isToday ? 'ring-2 ring-orange-500 bg-orange-50 text-orange-700 font-bold' : ''}`}
                    onClick={() => setViewingDayDate(date)} 
                  >
                    {date.getDate()}
                    {dayEvents.length > 0 && <div className="absolute bottom-1.5 flex gap-0.5">{dayEvents.slice(0,3).map((_, idx) => <div key={idx} className="w-1 h-1 bg-indigo-500 rounded-full"></div>)}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          displayItems.length === 0 ? <div className="text-center py-12 opacity-40 font-medium">Bu bölümde kayıt bulunmuyor.</div> : (
            <div className="space-y-3">
              {displayItems.map((item) => {
                const isMyItem = item.consultantName === activeProfile.name;
                const canEdit = isAdmin || isMyItem;

                return (
                <div key={item.id} className={`p-4 rounded-xl border shadow-lg relative group ${activeTabId === 'cat_trash' ? 'bg-slate-900 border-red-900/50 opacity-70 grayscale-[30%]' : 'bg-slate-800 border-slate-700'}`}>
                  <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                         <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-lg border border-orange-500/20">#{item.adNo || '---'}</span>
                         {item.cityName && <span className="text-[10px] font-bold text-slate-300 flex items-center gap-0.5"><MapPin size={10}/>{item.cityName}</span>}
                         {item.branchName && <span className="text-[10px] font-bold text-blue-400 bg-blue-900/40 px-2 py-0.5 rounded border border-blue-800 flex items-center gap-1"><Building2 size={10}/>{item.branchName}</span>}
                      </div>
                      {item.price > 0 && (
                        <div className="bg-green-500/10 text-green-400 px-2 py-1 rounded-lg border border-green-500/20 text-xs font-bold flex items-center gap-1">
                          <Banknote size={12}/>{formatCurrency(item.price)}
                        </div>
                      )}
                  </div>
                  
                  {(item.phone || item.contactName) && (
                    <div className="flex items-center gap-2 mb-2 text-xs text-slate-300">
                      <User size={14} className="text-slate-400"/>
                      <span className="font-bold text-slate-100">{item.contactName || 'İsimsiz'}</span>
                      <span className="text-slate-500">|</span>
                      <Phone size={14} className="text-slate-400"/>
                      <a href={`tel:${item.phone}`} className="text-blue-400 font-mono hover:underline">{item.phone}</a>
                    </div>
                  )}

                  <div className="flex gap-2 mb-2">
                    {item.dealType === 'rent' && <span className="inline-flex items-center gap-1 bg-purple-900/40 text-purple-400 border border-purple-800 text-[10px] px-2 py-0.5 rounded-full font-bold">KİRALIK</span>}
                    {item.dealType === 'sale' && <span className="inline-flex items-center gap-1 bg-green-900/30 text-green-400 border border-green-800/50 text-[10px] px-2 py-0.5 rounded-full font-bold">SATILIK</span>}
                    {item.consultantName && <span className="inline-flex items-center gap-1 bg-slate-700/50 text-slate-300 border border-slate-600 text-[10px] px-2 py-0.5 rounded-full font-medium"><Users size={10}/> {item.consultantName}</span>}
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed mb-3 whitespace-pre-wrap">{item.text}</p>
                  
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.map(tag => (
                        <span key={tag} className="text-[10px] bg-blue-900/40 text-blue-400 px-2 py-0.5 rounded border border-blue-800 font-medium">{tag}</span>
                      ))}
                    </div>
                  )}

                  {item.alarmActive && item.alarmTime && (
                    <div className="mb-2 flex items-center gap-2 bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded text-xs border border-yellow-700/50 w-fit">
                      <Clock size={12}/> {new Date(item.alarmTime).toLocaleString('tr-TR')}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t border-slate-700">
                    <span className="text-[10px] text-slate-500">{item.date}</span>
                    <div className="flex gap-2">
                      {item.alarmTime && activeTabId !== 'cat_trash' && (
                        <button onClick={() => addToNativeCalendar(item)} className="p-1.5 rounded-full text-blue-400 bg-blue-900/40 hover:bg-blue-800/60" title="Telefona Kaydet"><Calendar size={16}/></button>
                      )}
                      
                      {activeTabId !== 'cat_trash' && canEdit && (
                          <>
                             <button onClick={() => setTransferringItem({originalCatId: activeCategory.id, targetCatId: activeCategory.id, targetBranchName: item.branchName || activeBranch, item: {...item}})} className="p-1.5 rounded-full text-orange-400 hover:bg-orange-500/20 hover:text-orange-300" title="Taşı / Transfer Et"><ArrowRightLeft size={16}/></button>
                             <button onClick={() => setEditingItem({originalCatId: activeCategory.id, targetCatId: activeCategory.id, item: {...item}})} className="p-1.5 rounded-full text-slate-400 hover:bg-slate-700 hover:text-blue-400" title="Düzenle"><Pencil size={16}/></button>
                          </>
                      )}
                      {canEdit && (
                          <button onClick={() => requestDelete(activeCategory.id, item.id)} className={`p-1.5 rounded-full ${activeTabId === 'cat_trash' ? 'text-red-500 hover:bg-red-900/30' : 'text-slate-400 hover:bg-slate-700 hover:text-red-400'}`} title={activeTabId === 'cat_trash' ? 'Kalıcı Sil' : 'Çöp Kutusuna Taşı'}><Trash2 size={16}/></button>
                      )}
                    </div>
                  </div>
                </div>
              )})}
            </div>
          )
        )}
      </div>

      {!isCalendarView && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 pb-6 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-40">
          {feedbackMsg && <div className="absolute -top-10 left-0 right-0 text-center text-xs font-bold text-white bg-green-600 py-2 shadow-lg animate-bounce">{feedbackMsg}</div>}
          <div className="flex gap-2 items-end relative">
            
            <div className="relative flex-shrink-0">
               <button onClick={() => setShowInputCatMenu(!showInputCatMenu)} className="p-3 rounded-xl mb-1 bg-slate-200 text-slate-700 hover:bg-slate-300 transition-all shadow-sm flex items-center justify-center">
                  <Plus size={24}/>
               </button>
               
               {showInputCatMenu && (
                  <div className="absolute bottom-16 left-0 bg-white shadow-2xl border border-slate-200 rounded-xl w-48 p-2 z-[60] animate-in slide-in-from-bottom-2">
                     <div className="text-xs font-bold text-slate-400 mb-2 px-2">Kayıt Yeri Seçin</div>
                     <button onClick={() => {setSelectedInputCat('auto'); setShowInputCatMenu(false);}} className={`w-full text-left px-3 py-2 text-sm rounded-lg font-bold ${selectedInputCat==='auto'?'bg-indigo-100 text-indigo-700':'hover:bg-slate-50'}`}>✨ Otomatik</button>
                     <div className="h-px bg-slate-100 my-1"></div>
                     {categories.filter(c=>c.id!=='cat_trash').map(c => (
                         <button key={c.id} onClick={() => {setSelectedInputCat(c.id); setShowInputCatMenu(false);}} className={`w-full text-left px-3 py-2 text-sm rounded-lg mt-1 ${selectedInputCat===c.id?'bg-orange-100 text-orange-700 font-bold':'hover:bg-slate-50'}`}>
                             {c.title}
                         </button>
                     ))}
                  </div>
               )}
            </div>

            <div className="flex-1 relative">
              <textarea 
                value={inputText} 
                onChange={(e) => setInputText(e.target.value)} 
                onKeyDown={(e) => { 
                  if(e.key === 'Enter' && !e.shiftKey) { 
                    e.preventDefault(); 
                    processCommand(inputText); 
                  } 
                }}
                placeholder={selectedInputCat === 'auto' ? 'Yeni kayıt için yazın veya konuşun...' : `${categories.find(c=>c.id===selectedInputCat)?.title} bölümüne kaydedilecek...`} 
                className={`w-full rounded-xl p-3 pr-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none h-14 border ${selectedInputCat !== 'auto' ? 'bg-orange-50 border-orange-200 font-medium' : 'bg-slate-100 border-slate-200'}`}
              />
              {inputText && <button onClick={() => processCommand(inputText)} className="absolute right-2 top-2 text-blue-600 bg-white p-1.5 rounded-lg shadow-sm"><Send size={16}/></button>}
            </div>
            <button onClick={startListening} className={`p-4 rounded-xl mb-1 flex-shrink-0 transition-all shadow-lg ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-white hover:bg-slate-700 active:scale-95'}`}><Mic size={24}/></button>
          </div>
        </div>
      )}

      {showMenu && (
        <div className="absolute top-16 right-2 bg-white rounded-xl shadow-2xl border border-slate-300 z-[100] w-64 p-2 animate-in slide-in-from-top-2">
          <div className="px-3 py-2 border-b border-slate-100 mb-2">
            <p className="text-xs font-bold text-slate-800">{activeProfile.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{activeProfile.branch} Şubesi (Profil)</p>
            {isAdmin && <span className="inline-block bg-indigo-100 text-indigo-700 text-[9px] px-1.5 py-0.5 rounded font-bold mt-1">YÖNETİCİ</span>}
          </div>
          
          <button onClick={() => {setShowBranchModal(true); setShowMenu(false);}} className="w-full text-left px-3 py-2 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg flex gap-2 font-bold mb-1 border border-blue-200 transition-colors">
            <Building2 size={16}/> Aktif Şubeyi Değiştir
          </button>

          {isAdmin && (
             <button onClick={() => {setShowAddBranchModal(true); setShowMenu(false);}} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded-lg flex gap-2 transition-colors">
                <Building2 size={16}/> Şube Ekle
             </button>
          )}
          
          <div className="h-px bg-slate-100 my-1"></div>
          
          <button onClick={() => {setShowCustomersModal(true); setShowMenu(false);}} className="w-full text-left px-3 py-2 text-sm text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex gap-2 font-bold mb-1 border border-indigo-200 transition-colors"><Users size={16}/> Müşteri Bilgileri</button>

          <button onClick={downloadAllData} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg flex gap-2 transition-colors"><Download size={16}/> Tüm Verileri İndir ({activeBranch})</button>
          <button onClick={downloadFilteredData} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg flex gap-2 transition-colors"><FileText size={16}/> Şu Anki Listeyi İndir</button>
          
          {isAdmin && (
             <>
               <div className="h-px bg-slate-100 my-1"></div>
               <button onClick={() => {setShowCityManagerModal(true); setShowMenu(false);}} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded-lg flex gap-2 transition-colors"><MapPin size={16}/> Şehirleri Düzenle</button>
               <button onClick={() => {
                   if(activeCategory.id === 'cat_trash') {
                       showDialog('alert', "Çöp kutusu düzenlenemez.");
                   } else {
                       setEditingCategoryData({...activeCategory}); 
                       setShowEditCategoryModal(true); 
                   }
                   setShowMenu(false);
               }} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded-lg flex gap-2 transition-colors"><Pencil size={16}/> Bölümü Düzenle</button>
               <button onClick={() => {setShowTagManagerModal(true); setShowMenu(false);}} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded-lg flex gap-2 transition-colors"><Tag size={16}/> Etiketleri Düzenle</button>
               <button onClick={() => {setShowImportModal(true); setShowMenu(false);}} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded-lg flex gap-2 transition-colors"><Upload size={16}/> Veri Yükle (.txt)</button>
             </>
          )}
        </div>
      )}

      {/* --- MÜŞTERİ BİLGİLERİ MODALI --- */}
      {showCustomersModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-[110]">
          <div className="bg-white rounded-2xl w-full max-w-lg h-[85vh] flex flex-col shadow-2xl overflow-hidden">
             
             {/* Header */}
             <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
                 <div>
                    <h3 className="font-bold text-lg flex items-center gap-2"><Users size={20}/> Müşteri Bilgileri Havuzu</h3>
                    <p className="text-indigo-200 text-xs">Müşteri iletişim verileri listesi.</p>
                 </div>
                 <button onClick={() => setShowCustomersModal(false)} className="bg-indigo-700 p-2 rounded-lg hover:bg-indigo-800"><X size={20}/></button>
             </div>

             {/* Filtre ve İndir Butonu */}
             <div className="p-3 border-b border-slate-200 bg-slate-50 space-y-3">
                 <div className="flex justify-between items-center">
                     <span className="text-sm font-bold text-slate-700">Filtreler</span>
                     <button onClick={downloadCustomerList} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-green-700 shadow-sm"><FileDown size={14}/> Listeyi İndir</button>
                 </div>
                 
                 {/* Kategori Filtresi */}
                 <div className="flex gap-2 w-full overflow-x-auto pb-1 scrollbar-hide items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Kategori:</span>
                    {['Tümü', 'Konut', 'Arsa', 'Tarla', 'Ticari', 'Bahçe', 'Diğer'].map(g => (
                        <button key={g} onClick={() => setCustomerFilter(g)} className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap transition-all ${customerFilter === g ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'}`}>
                           {g}
                        </button>
                    ))}
                 </div>

                 {/* Şube Filtresi */}
                 <div className="flex gap-2 w-full overflow-x-auto pb-1 scrollbar-hide items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Şube:</span>
                    {branchList.map(b => (
                        <button key={b} onClick={() => setCustomerBranchFilter(b)} className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap transition-all flex items-center gap-1 ${customerBranchFilter === b ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'}`}>
                           {b !== 'Tümü' && <Building2 size={10}/>} {b}
                        </button>
                    ))}
                 </div>

                 {/* Danışman Filtresi (Sadece Admin Görebilir) */}
                 {isAdmin && (
                    <div className="flex gap-2 w-full overflow-x-auto pb-1 scrollbar-hide items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Danışman:</span>
                        {['Tümü', ...getUniqueConsultants()].map(cName => (
                            <button key={cName} onClick={() => setCustomerConsultantFilter(cName)} className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap transition-all flex items-center gap-1 ${customerConsultantFilter === cName ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'}`}>
                                {cName}
                            </button>
                        ))}
                    </div>
                 )}
             </div>

             {/* Liste */}
             <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-100">
                 {(() => {
                     const customers = getCustomerList(customerFilter, customerBranchFilter);
                     if(customers.length === 0) return <div className="text-center py-10 text-slate-400 text-sm font-medium">Müşteri kaydı bulunamadı.</div>;
                     
                     return customers.map(c => (
                         <div key={c.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all">
                             <div className="p-3 flex justify-between items-center">
                                 <div className="flex flex-col">
                                     <span className="font-bold text-slate-800 flex items-center gap-1.5"><User size={14} className="text-slate-400"/> {c.contactName || 'İsim Belirtilmemiş'}</span>
                                     <span className="text-xs text-blue-600 font-mono font-medium flex items-center gap-1.5 mt-0.5"><Phone size={12} className="text-slate-400"/> {c.phone || '- Yok -'}</span>
                                     <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                         <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">{c.groupName}</span>
                                         <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 flex items-center gap-0.5"><Building2 size={8}/> {c.branchName || 'Ereğli'}</span>
                                         <span className="text-[10px] text-slate-500">Danışman: <span className="font-bold">{c.consultantName || 'Belirsiz'}</span></span>
                                     </div>
                                 </div>
                                 <button onClick={() => setExpandedCustomer(expandedCustomer === c.id ? null : c.id)} className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${expandedCustomer === c.id ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}>
                                     {expandedCustomer === c.id ? 'Gizle' : 'Detay'}
                                 </button>
                             </div>
                             
                             {/* Detay Paneli */}
                             {expandedCustomer === c.id && (
                                 <div className="bg-indigo-50/50 border-t border-indigo-100 p-3 text-sm animate-in slide-in-from-top-2">
                                     <p className="text-slate-700 leading-relaxed mb-2"><span className="font-bold text-indigo-900">Talep/Not:</span> {c.text}</p>
                                     <div className="flex justify-between items-center text-xs border-t border-indigo-100/50 pt-2 mt-2">
                                         <span className="text-slate-500">{c.date}</span>
                                         {c.price > 0 && <span className="font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">{formatCurrency(c.price)}</span>}
                                     </div>
                                 </div>
                             )}
                         </div>
                     ));
                 })()}
             </div>
          </div>
        </div>
      )}

      {/* --- GÜN DETAYI (TAKVİM İÇİN) --- */}
      {viewingDayDate && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] overflow-y-auto">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm relative shadow-2xl">
            <button onClick={() => setViewingDayDate(null)} className="absolute top-4 right-4 text-slate-400 hover:bg-slate-100 p-1 rounded-lg transition-colors"><X size={20}/></button>
            <h3 className="font-bold text-lg mb-4 text-slate-800 border-b border-slate-100 pb-3">{viewingDayDate.toLocaleDateString('tr-TR')} <span className="text-sm font-medium text-slate-500 block">Planlanan Kayıtlar</span></h3>
            
            <div className="space-y-3 mb-6 max-h-72 overflow-y-auto pr-1">
              {(() => {
                const dayEvents = getEventsForDate(viewingDayDate);
                
                if(dayEvents.length === 0) return <div className="text-center text-sm text-slate-400 py-8 font-medium bg-slate-50 rounded-xl border border-slate-100">Bu güne ait kayıt yok.</div>;

                return dayEvents.map(event => {
                  const isMyItem = event.consultantName === activeProfile.name;
                  const canEdit = isAdmin || isMyItem;

                  return (
                  <div key={event.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm text-sm group">
                     <div className="flex justify-between items-start mb-2 border-b border-slate-700 pb-2">
                        <span className="font-bold text-orange-400 flex items-center gap-1.5"><Clock size={14}/> {new Date(event.alarmTime).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</span>
                        <div className="flex gap-1.5">
                           <button onClick={() => {addToNativeCalendar(event)}} className="p-1.5 bg-slate-700 rounded-lg text-blue-400 shadow-sm hover:bg-slate-600 transition-colors" title="Takvime Aktar"><Calendar size={14}/></button>
                           {canEdit && (
                               <button onClick={() => {setEditingItem({originalCatId: event.originalCatId, targetCatId: event.originalCatId, item: {...event}}); setViewingDayDate(null);}} className="p-1.5 bg-slate-700 rounded-lg text-slate-300 shadow-sm hover:text-white hover:bg-slate-600 transition-colors"><Pencil size={14}/></button>
                           )}
                        </div>
                     </div>
                     <p className="text-slate-300 leading-relaxed">{event.text}</p>
                     
                     {(event.contactName || event.phone) && (
                         <div className="mt-3 pt-2 border-t border-slate-700/50 flex flex-col gap-1">
                            {event.contactName && <span className="text-xs text-slate-200 font-bold flex items-center gap-1"><User size={12}/> {event.contactName}</span>}
                            {event.phone && <a href={`tel:${event.phone}`} className="text-xs text-blue-400 font-mono hover:underline flex items-center gap-1"><Phone size={12}/> {event.phone}</a>}
                         </div>
                     )}
                     
                     <div className="flex items-center gap-2 mt-3 pt-2">
                        <span className="inline-flex items-center bg-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-600 font-medium">{categories.find(c => c.id === event.originalCatId)?.title || 'Bilinmiyor'}</span>
                        <span className="inline-flex items-center gap-1 bg-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-600 font-medium"><Users size={10}/> {event.consultantName || 'Belirsiz'}</span>
                     </div>
                  </div>
                )});
              })()}
            </div>

            <button onClick={() => { setCalendarSelectedDate(viewingDayDate); setViewingDayDate(null); }} className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
               <Plus size={18}/> Bu Güne Kayıt Ekle
            </button>
          </div>
        </div>
      )}

      {calendarSelectedDate && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative shadow-2xl animate-in zoom-in-95">
            <button onClick={() => setCalendarSelectedDate(null)} className="absolute top-4 right-4 text-slate-400 hover:bg-slate-100 p-1 rounded-lg"><X size={20}/></button>
            <h3 className="font-bold text-lg mb-1 text-slate-800">{calendarSelectedDate.toLocaleDateString('tr-TR')}</h3>
            <p className="text-xs text-slate-500 mb-4">Bu tarihe randevu ekleyin</p>
            
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-600 flex items-center gap-2"><Clock size={16}/> Saat Seçin:</span>
                <input 
                    type="time" 
                    value={calendarInputTime} 
                    onChange={(e) => setCalendarInputTime(e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg p-2 text-sm font-bold text-slate-800 outline-none focus:border-indigo-500"
                />
            </div>

            <textarea value={calendarInputText} onChange={(e) => setCalendarInputText(e.target.value)} placeholder="Randevu notu ve iletişim bilgileri..." className="w-full bg-slate-50 rounded-xl p-3 text-sm h-24 mb-4 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"/>
            
            <div className="flex gap-2">
              <button onClick={startListeningCalendar} className={`p-3.5 rounded-xl flex-shrink-0 transition-all shadow-md ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-white hover:bg-slate-900'}`}><Mic size={20}/></button>
              <button onClick={handleCalendarAdd} className="flex-1 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20">KAYDET</button>
            </div>
          </div>
        </div>
      )}
      
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2"><Upload className="text-purple-600"/> Dosya Yükle</h3>
              <button onClick={()=>setShowImportModal(false)}><X/></button>
            </div>
            <p className="text-xs text-slate-500 mb-4">Metin (.txt) dosyanızı seçin.</p>
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">Hedef Bölüm</label>
              <select value={importTarget} onChange={(e) => setImportTarget(e.target.value)} className="w-full bg-slate-50 border rounded-lg p-2 text-sm">
                <option value="auto">✨ Otomatik (Genel)</option>
                {categories.filter(c => c.id !== 'cat_trash').map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <input type="file" accept=".txt" onChange={handleFileUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"/>
          </div>
        </div>
      )}

      {showCityManagerModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm h-3/4 flex flex-col shadow-2xl animate-in zoom-in-95">
            <h3 className="font-bold mb-4 flex items-center gap-2"><MapPin size={18} className="text-orange-500"/> Şehir Yönetimi</h3>
            <div className="mb-4 space-y-2">
              <input value={newCityTitle} onChange={(e)=>setNewCityTitle(e.target.value)} placeholder="Şehir Adı" className="w-full bg-slate-50 border rounded-lg p-2 text-sm"/>
              <textarea value={newCityKeywords} onChange={(e)=>setNewCityKeywords(e.target.value)} placeholder="Mahalleler / Anahtar Kelimeler (Virgülle)" className="w-full bg-slate-50 border rounded-lg p-2 text-sm h-16"/>
              <button onClick={addNewCity} className="w-full bg-slate-800 text-white py-2 rounded-lg text-sm font-bold">EKLE</button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 border-t pt-2">
              {cities.map(city => (
                <div key={city.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm">{city.title}</span>
                    <button onClick={()=>requestRemoveCity(city.id)} className="text-red-400 hover:bg-red-50 p-1 rounded"><Trash2 size={14}/></button>
                  </div>
                  <p className="text-[10px] text-slate-500">{city.keywords}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowCityManagerModal(false)} className="mt-4 bg-slate-200 text-slate-700 py-2 rounded-lg text-sm">Kapat</button>
          </div>
        </div>
      )}

      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] overflow-y-auto">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm my-4 shadow-2xl animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Pencil size={18} className="text-blue-500"/> Kaydı Düzenle
                </h3>
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-200">#{editingItem.item.adNo || '---'}</span>
             </div>
             
             <div className="flex items-center border rounded-lg bg-indigo-50 border-indigo-100 mb-2 p-2 gap-2">
               <span className="text-indigo-800 text-xs font-bold w-12">Bölüm:</span>
               <select 
                 value={editingItem.targetCatId} 
                 onChange={(e) => setEditingItem({ ...editingItem, targetCatId: e.target.value })}
                 className="bg-transparent w-full text-sm outline-none text-indigo-900 font-medium"
               >
                 {categories.filter(c => c.id !== 'cat_trash').map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
               </select>
               <FolderInput size={16} className="text-indigo-400"/>
             </div>

             <div className="flex items-center border rounded-lg bg-slate-50 mb-2 p-2 gap-2">
               <span className="text-slate-400 text-xs font-bold w-12">Şehir:</span>
               <select 
                 value={editingItem.item.cityId || ''} 
                 onChange={(e) => {
                   const selectedCity = cities.find(c => c.id === e.target.value);
                   setEditingItem({ ...editingItem, item: { ...editingItem.item, cityId: e.target.value, cityName: selectedCity ? selectedCity.title : '' } })
                 }}
                 className="bg-transparent w-full text-sm outline-none"
               >
                 <option value="">Seçilmedi</option>
                 {cities.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
               </select>
               <MapPin size={16} className="text-slate-400"/>
             </div>

             <div className="flex items-center border rounded-lg bg-slate-50 mb-2 p-2 gap-2">
               <span className="text-slate-400 text-xs font-bold">Fiyat:</span>
               <input type="number" value={editingItem.item.price || ''} onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, price: e.target.value } })} className="bg-transparent w-full text-sm outline-none" placeholder="0"/>
             </div>

             <div className="flex items-center border rounded-lg bg-slate-50 mb-2 p-2 gap-2">
               <span className="text-slate-400 text-xs font-bold">Tip:</span>
               <select 
                 value={editingItem.item.dealType || 'sale'} 
                 onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, dealType: e.target.value } })}
                 className="bg-transparent w-full text-sm outline-none"
               >
                 <option value="sale">Satılık</option>
                 <option value="rent">Kiralık</option>
               </select>
             </div>

             <div className="flex items-center border rounded-lg bg-slate-50 mb-2 p-2 gap-2">
               <span className="text-slate-400 text-xs font-bold w-12">Şube:</span>
               <select 
                   value={editingItem.item.branchName || ''} 
                   onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, branchName: e.target.value } })} 
                   className="bg-transparent w-full text-sm outline-none"
               >
                   {branchList.map(b => <option key={b} value={b}>{b}</option>)}
               </select>
             </div>

             <input value={editingItem.item.contactName || ''} onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, contactName: e.target.value } })} className="w-full bg-slate-50 border rounded-lg p-2 mb-2 text-sm" placeholder="İsim"/>
             <input value={editingItem.item.phone || ''} onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, phone: e.target.value } })} className="w-full bg-slate-50 border rounded-lg p-2 mb-2 text-sm" placeholder="Tel"/>
             <textarea value={editingItem.item.text || ''} onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, text: e.target.value } })} className="w-full bg-slate-50 border rounded-lg p-2 mb-3 text-sm h-20"/>
             
             <div className="bg-yellow-50 p-3 rounded-xl border-2 border-yellow-200 mb-4 shadow-sm">
               <div className="flex justify-between items-center mb-2">
                 <label className="text-sm font-bold text-yellow-800 flex items-center gap-1"><Clock size={16}/> Alarm Kur</label>
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={editingItem.item.alarmActive} onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, alarmActive: e.target.checked } })} className="sr-only peer"/>
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-yellow-500"></div>
                 </label>
               </div>
               <input type="datetime-local" value={editingItem.item.alarmTime || ''} onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, alarmTime: e.target.value, alarmActive: true } })} className="w-full bg-white border border-yellow-300 rounded p-2 text-sm font-medium"/>
             </div>

             <div className="flex gap-2">
               <button onClick={() => setEditingItem(null)} className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-xl text-sm font-bold hover:bg-slate-200">İptal</button>
               <button onClick={saveItemChanges} className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-700">Kaydet</button>
             </div>
          </div>
        </div>
      )}

      {showTagManagerModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm h-3/4 flex flex-col shadow-2xl animate-in zoom-in-95">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Tag size={18}/> Etiketleri Düzenle</h3>
            <div className="flex gap-2 mb-4">
              <input value={newTagName} onChange={(e)=>setNewTagName(e.target.value)} placeholder="Yeni etiket" className="flex-1 bg-slate-50 border rounded-lg p-2 text-sm"/>
              <button onClick={()=>{if(newTagName && !availableTags.includes(newTagName)){setAvailableTags([...availableTags,newTagName]);setNewTagName('');}}} className="bg-blue-600 text-white px-3 rounded-lg"><Plus size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 border-t pt-2">
              {availableTags.map(tag => (
                <div key={tag} className="flex justify-between items-center p-2 bg-slate-50 rounded text-sm">
                  <span>{tag}</span>
                  <button onClick={()=>setAvailableTags(availableTags.filter(t=>t!==tag))} className="text-red-400 hover:bg-red-50 p-1 rounded"><Trash2 size={14}/></button>
                </div>
              ))}
            </div>
            <button onClick={() => setShowTagManagerModal(false)} className="mt-4 bg-slate-800 text-white py-2 rounded-lg text-sm font-bold hover:bg-slate-900">Tamam</button>
          </div>
        </div>
      )}
      
       {showEditCategoryModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl animate-in zoom-in-95">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Pencil size={18}/> Bölümü Düzenle</h3>
            <input value={editingCategoryData.title} onChange={(e) => setEditingCategoryData({...editingCategoryData, title: e.target.value})} className="w-full bg-slate-50 border rounded-lg p-2 mb-3 text-sm"/>
            <textarea value={editingCategoryData.keywords} onChange={(e) => setEditingCategoryData({...editingCategoryData, keywords: e.target.value})} className="w-full bg-slate-50 border rounded-lg p-2 mb-4 text-sm h-20"/>
            <div className="flex gap-2">
               <button onClick={() => {
                   if(categories.length<=2) return showDialog('alert', "Son kalan sekmeyi silemezsiniz."); 
                   showDialog('confirm', "Bu bölümü silmek istediğinize emin misiniz?", () => {
                       setCategories(categories.filter(c=>c.id!==editingCategoryData.id)); 
                       setShowEditCategoryModal(false);
                   });
               }} className="flex-1 bg-red-50 text-red-500 py-2 rounded-lg text-sm font-bold hover:bg-red-100">SİL</button>
               <button onClick={() => {setCategories(categories.map(c=>c.id===editingCategoryData.id?editingCategoryData:c)); setShowEditCategoryModal(false);}} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700">KAYDET</button>
            </div>
            <button onClick={() => setShowEditCategoryModal(false)} className="w-full mt-2 text-slate-500 text-xs py-2 font-medium hover:bg-slate-50 rounded-lg">İptal</button>
          </div>
        </div>
      )}
       {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl animate-in zoom-in-95">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Plus size={18}/> Yeni Bölüm</h3>
            <input placeholder="Bölüm Adı" value={newCatTitle} onChange={(e) => setNewCatTitle(e.target.value)} className="w-full bg-slate-50 border rounded-lg p-2 mb-3 text-sm"/>
            <textarea placeholder="Anahtar kelimeler" value={newCatKeywords} onChange={(e) => setNewCatKeywords(e.target.value)} className="w-full bg-slate-50 border rounded-lg p-2 mb-4 text-sm h-20"/>
            <button onClick={() => { if(!newCatTitle) return; setCategories([{id: `cat_${Date.now()}`, title: newCatTitle, keywords: newCatKeywords, items: [], icon: 'briefcase'}, ...categories]); setShowAddModal(false); setNewCatTitle(''); setNewCatKeywords(''); }} className="w-full bg-slate-800 text-white py-2 rounded-lg text-sm font-bold hover:bg-slate-900">OLUŞTUR</button>
            <button onClick={() => setShowAddModal(false)} className="w-full mt-2 text-slate-500 text-xs py-2 font-medium hover:bg-slate-50 rounded-lg">İptal</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
