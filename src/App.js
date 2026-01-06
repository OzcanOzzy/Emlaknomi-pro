import React, { useState, useEffect, useRef } from 'react';
import { Camera, Copy, Printer, Home, MapPin, CheckCircle, Layout, Instagram, MessageCircle, FileText, Upload, X, User, ChevronDown, ChevronUp, Download, Grid, Image as ImageIcon, Eye, EyeOff, Lock, Loader2 } from 'lucide-react';

// --- SABİT VERİLER ---
const FIXED_LOGO_URL = "https://i.hizliresim.com/fa4ibjl.png"; 

const officeDetails = {
  eregli: { name: 'Ereğli Şubesi', city: 'Konya', address: 'Yunuslu mh. uğur mumcu caddesi 35/A Ereğli/Konya', phone: '0533 638 7000', authNo: '4202207' },
  karaman: { name: 'Karaman Şubesi', city: 'Karaman', address: 'İmaret mahallesi 173. sokak No:3/A Karaman', phone: '0543 306 14 99', authNo: '7000161' },
  konya: { name: 'Konya Şubesi', city: 'Konya', address: 'Konya Merkez', phone: '0543 306 14 99', authNo: '7000161' },
  alanya: { name: 'Alanya Şubesi', city: 'Antalya', address: 'Alanya Merkez', phone: '0543 306 14 99', authNo: '0704618' }
};

const detailedCities = ["Konya", "Karaman", "Antalya", "Mersin", "Eskişehir"];
const locationData = {
  "Konya": {
    "Ereğli": ["500 Evler", "Acıkuyu", "Acıpınar", "Adabağ", "Akhüyük", "Alhan", "Alpaslan", "Aşağı Göndelen", "Aşıklar", "Atakent", "Aydınlar", "Aziziye", "Bahçeli", "Barbaros", "Batı Alagözlü", "Batı Elagözlü", "Belceağaç", "Belkaya", "Beyköy", "Beyören", "Boyacıali", "Bulgurluk", "Burhaniye", "Büyükdede", "Cahı", "Camikebir", "Cinler", "Cumhuriyet", "Çakmak", "Çayhan", "Çiller", "Çimencik", "Çömlekçi", "Dalmaz", "Doğu Alagözlü", "Doğu Elagözlü", "Eti", "Fatih", "Gaybi", "Gökçeyazı", "Göktöme", "Gülbahçe", "Hacı Memiş", "Hacımustafa", "Hacımutahir", "Hamidiye", "Hıdırlı", "Hortu", "Kamışlıkuyu", "Karaburun", "Kargacı", "Kazancı", "Kızılgedik", "Kuskuncuk", "Kutören", "Kuzukuyu", "Mehmet Akif", "Melicek", "Mimar Sinan", "Namık Kemal", "Orhangazi", "Orhaniye", "Özgürler", "Pınarözü", "Pirömer", "Sarıca", "Sarıtopallı", "Selçuklu", "Servili", "Sümer", "Şinasi", "Talatpaşa", "Taşağıl", "Taşbudak", "Tatlıkuyu", "Toros", "Türbe", "Türkmen", "Ulumeşe", "Üçgöz", "Yazlık", "Yellice", "Yenibağlar", "Yeniköy", "Yıldırım Beyazıt", "Yıldızlı", "Yukarı Göndelen", "Yunuslu", "Zengen", "Ziya Gökalp"],
    "Karatay": ["Akabe", "Fetih", "Fevzi Çakmak", "İstiklal", "Karaaslan", "Keçeciler", "Mengene", "Nakipoğlu", "Saraçoğlu", "Selimsultan", "Yediler", "Kumköprü", "Şeyh Ulema Recep Ağa", "Akifpaşa", "Bozkır", "Karkent", "Ulubatlıhasan"],
    "Meram": ["Alavardı", "Aybahçe", "Dere", "Gödene", "Havzan", "Konevi", "Kovanağzı", "Lalebahçe", "Melikşah", "Uluırmak", "Yaka", "Zafer", "Aşkan", "Kürden", "Ladikli", "Mamuriye", "Muradiye", "Pirebi", "Turgutreis", "Yorgancı"],
    "Selçuklu": ["Aydınlıkevler", "Bosna Hersek", "Cumhuriyet", "Fatih", "Feritpaşa", "Hocacihan", "Işıklar", "Nişantaşı", "Parsana", "Sancak", "Şeker", "Yazır", "Binkonutlar", "Dumlupınar", "Esenler", "Ferhuniye", "Hacıkaymak", "Hanaybaşı", "Hüsamettin Çelebi", "İhsaniye", "Kılınçarslan", "Kosova", "Malazgirt", "Mehmet Akif", "Musalla Bağları", "Sakarya", "Selahaddin Eyyubi", "Şeyh Şamil"]
  },
  "Karaman": {
    "Merkez": ["Abbas", "Ahiosman", "Ahmet Yesevi", "Alacasuluk", "Alişahane", "Atatürk", "Bahçelievler", "Başakşehir", "Beyazkent", "Cedit", "Cumhuriyet", "Çeltek", "Elmaşehir", "Fatih", "Fenari", "Gazidükkan", "Gazi", "Gevher Hatun", "Hacıcelal", "Hamidiye", "Hisar", "Hürriyet", "İbrahim Hakkı Konyalı", "İmaret", "Karamanoğlu Mehmet Bey", "Kazım Karabekir Paşa", "Ketenci", "Kırbağı", "Kirişçi", "Koçakdede", "Külhan", "Larende", "Mahmudiye", "Mansurdede", "Mehmet Akif Ersoy", "Mümine Hatun", "Nefise Sultan", "Organize Sanayi", "Osmangazi", "Piri Reis", "Rauf Denktaş", "Sakabaşı", "Sekiçeşme", "Siyahser", "Sümer", "Şeyh Edebali", "Şeyh Şamil", "Tabduk Emre", "Tahsin Ünal", "Topucak", "Urgan", "Üniversite", "Valide Sultan", "Yeni", "Yenimahalle", "Yenişehir", "Yeşilada", "Yunus Emre", "Yunuskent", "Zembilli Ali Efendi", "Ziya Gökalp", "Akçaşehir", "Sudurağı", "Kılbasan", "Yeşildere", "Taşkale"],
    "Ermenek": ["Taşbaşı", "Seyran", "Meydan", "Susaklı", "Orta", "Değirmenlik", "Sandıklı", "Güllük", "Keşillik"]
  },
  "Antalya": {
    "Alanya": ["Avsallar", "Bektaş", "Büyükhasbahçe", "Cikcilli", "Cumhuriyet", "Çarşı", "Çıplaklı", "Demirtaş", "Dinek", "Fığla", "Güller Pınarı", "Hacet", "Hisariçi", "İncekum", "Kadıpaşa", "Kargıcak", "Kestel", "Kızlar Pınarı", "Konaklı", "Küçükhasbahçe", "Mahmutlar", "Oba", "Okurcalar", "Payallar", "Saray", "Sugözü", "Şekerhane", "Tepe", "Tosmur", "Türkler", "Yaylalı"],
    "Muratpaşa": ["Bahçelievler", "Çağlayan", "Dutlubahçe", "Fener", "Güzeloba", "Kızıltoprak", "Lara", "Meltem", "Şirinyalı", "Yenigün"]
  },
  "Mersin": { "Yenişehir": ["50. Yıl", "Afetevler", "Akkent", "Bahçelievler", "Barbaros", "Batıkent"], "Mezitli": ["Akdeniz", "Davultepe", "Fatih", "Kuyuluk", "Menderes"] },
  "Eskişehir": { "Odunpazarı": ["71 Evler", "Akarbaşı", "Akcami", "Alanönü"], "Tepebaşı": ["Aşağı Söğütönü", "Batıkent", "Çamlıca"] }
};

const options = {
  rooms: ["1+0", "1+1", "2+0", "2+1", "3+0", "3+1", "4+0", "4+1", "5+1", "5+2", "5+3", "6+1", "6+2", "6+3", "7+1", "7+2", "7+3", "8+1", "8+2", "8+3"],
  floors: ["Zemin Kat", "Yüksek Giriş", "Dükkan Üstü", ...Array.from({length: 25}, (_, i) => (i + 1).toString()), "Bodrum Kat"],
  totalFloors: Array.from({length: 25}, (_, i) => (i + 1).toString()),
  flatCount: ["Müstakil", ...Array.from({length: 15}, (_, i) => (i + 2).toString())],
  age: ["Sıfır", "İnşaat Hali", "1", "2", "3", "4", "5", "6-10 arası", "11-15 arası", "16-20 arası", "21-25 arası", "26-30 arası", "30 üstü"],
  facade: ["Kuzey", "Güney", "Doğu", "Batı"],
  wcCount: ["1", "2", "3", "4", "5"],
  heating: ["Bireysel Kombi", "Merkezi (Pay ölçer)", "Yerden Isıtma", "Sobalı", "Elektrik", "Klima"],
  balcony: ["Yok", "1", "2", "3", "4", "5", "6"],
  glassBalcony: ["Var", "Yok", "1", "2", "3", "4", "5", "6"],
  insulation: ["var", "yok", "içten", "dıştan", "içten ve dıştan"],
  elevator: ["Var", "Yok", "Çift Asansör", "Yapım Aşamasında"],
  pantry: ["Var", "Yok", "Dairede", "Bodrumda", "Çatıda", "Balkonda", "Bahçede"],
  garage: ["Var", "Yok", "Bireysel Garaj", "Ortak Kullanım"],
  parking: ["Yok", "Açık", "Kapalı", "Açık ve Kapalı"],
  usage: ["Mülk Sahibi", "Boş", "Kiracılı", "Yapım Aşamasında"],
  swap: ["Var", "Yok", "Değerlendirilir", "araç ile takas", "daire ile takas", "arsa ile takas", "gayrimenkul ile takas"],
  credit: ["Evet", "Hayır", "Kısmen"],
  deed: ["Kat Mülkiyeti", "Kat İrtifakı", "Arsa Tapulu", "Hisseli", "diğer", "Bilinmiyor"]
};

const featureCategories = {
  "İç Özellikler": ["ADSL", "Ahşap Doğrama", "Akıllı Ev", "Alarm", "Alaturka Tuvalet", "Alüminyum Doğrama", "Amerikan Kapı", "Amerikan Mutfak", "Ankastre Fırın", "Barbükü", "Beyaz Eşya", "Boyalı", "Bulaşık Makinesi", "Buzdolabı", "Çamaşır Odası", "Çelik Kapı", "Duşakabin", "Duvar Kağıdı", "Fiber İnternet", "Fırın", "Giyinme Odası", "Gömme Dolap", "Görüntülü Diafon", "Hilton Banyo", "Isıcam", "Jakuzi", "Kartonpiyer", "Klima", "Laminat Zemin", "Marley", "Mobilyalı", "Panjur", "Parke Zemin", "PVC Doğrama", "Seramik Zemin", "Spot Aydınlatma", "Şömine", "Teras", "Vestiyer", "Wi-Fi", "Yüz Tanıma & Parmak İzi"],
  "Dış Özellikler": ["Araç Şarj İstasyonu", "24 Saat Güvenlik", "Apartman Görevlisi", "Buhar Odası", "Çocuk Oyun Parkı", "Hidrofor", "Jeneratör", "Kablo TV", "Kamera Sistemi", "Kapalı Otopark", "Kreş", "Müstakil Havuzlu", "Oyun Parkı", "Sauna", "Ses Yalıtımı", "Siding", "Spor Alanı", "Su Deposu", "Tenis Kortu", "Uydu", "Yangın Merdiveni", "Yüzme Havuzu (Açık)", "Yüzme Havuzu (Kapalı)"],
  "Muhit / Konum": ["Alışveriş Merkezi", "Belediye", "Cami", "Cemevi", "Denize Sıfır", "Eczane", "Eğlence Merkezi", "Fuar Alanı", "Göl Manzaralı", "Hastane", "Havra", "İlkokul-Ortaokul", "İtfaiye", "Kilise", "Lise", "Market", "Merkezi", "Park", "Polis Merkezi", "Sağlık Ocağı", "Semt Pazarı", "Şehir Manzaralı", "Şehir Merkezi", "Üniversite"],
  "Ulaşım": ["Anayol", "Avrasya Tüneli", "Boğaz Köprüleri", "Cadde", "Dolmuş", "E-5", "Havaalanı", "İskele", "Marmaray", "Metro", "Metrobüs", "Minibüs", "Otobüs Durağı", "Sahil", "TEM", "Teleferik", "Tramvay", "Tren İstasyonu", "Troleybüs"]
};

const allCities = ["Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalva", "Karabük", "Kilis", "Osmaniye", "Düzce"].sort();

export default function RealEstateAssistant() {
  const [activeTab, setActiveTab] = useState('social');
  const [designMode, setDesignMode] = useState('single');
  const [isManualLocation, setIsManualLocation] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const socialPreviewRef = useRef(null);
  
  // YENİ: Yükleme Kontrolü (Tema bozukluğunu engeller)
  const [isReady, setIsReady] = useState(false);

  const [showLogo, setShowLogo] = useState(true);
  const [customLogo, setCustomLogo] = useState(null); 
  const [themeColor, setThemeColor] = useState('#ea580c');

  // --- SİSTEM KURULUMU ---
  useEffect(() => {
    document.title = "Özcan AKTAŞ - Emlaknomi Pro";
    
    // Mobil Viewport Fix
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement('meta');
      meta.name = "viewport";
      meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
      document.head.appendChild(meta);
    }

    // PWA Manifest
    if (!document.querySelector('link[rel="manifest"]')) {
      const link = document.createElement('link');
      link.rel = 'manifest';
      const manifest = {
        name: "Emlaknomi Pro",
        short_name: "EmlakAsistan",
        start_url: ".",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ea580c",
        icons: [{ src: FIXED_LOGO_URL, sizes: "192x192", type: "image/png" }]
      };
      link.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(manifest));
      document.head.appendChild(link);
    }

    // Kütüphaneler
    const loadScript = (src) => {
      return new Promise((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => console.warn(`Script yüklenemedi: ${src}`); // Hata yönetimi
        document.head.appendChild(script);
      });
    };

    Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
      loadScript('https://cdn.tailwindcss.com')
    ]).then(() => {
        console.log('Kütüphaneler yüklendi, stil kontrolü yapılıyor...');
        // Tailwind'in yüklenmesini bekle (Tema bozuk görünmesin diye)
        const checkTailwind = setInterval(() => {
            if (window.tailwind) {
                clearInterval(checkTailwind);
                setTimeout(() => setIsReady(true), 500); // Küçük bir gecikme ile pürüzsüz geçiş
            }
        }, 100);
        
        // 5 saniye içinde yüklenmezse yine de aç (Yedek plan)
        setTimeout(() => { clearInterval(checkTailwind); setIsReady(true); }, 5000);
    });

    const savedLogo = localStorage.getItem('emlaknomi_custom_logo');
    if (savedLogo) {
      setCustomLogo(savedLogo);
      setShowLogo(true);
    }
  }, []);
  
  const [selectedOffice, setSelectedOffice] = useState('eregli');
  
  const [formData, setFormData] = useState({
    title: '', price: '', currency: 'TL',
    city: 'Konya', district: 'Ereğli', neighborhood: 'Yunuslu',
    type: 'Satılık Daire', adNumber: '', 
    rooms: '', size: '', netSize: '', totalFloors: '', floor: '', flatCountOnFloor: '', facade: [], age: '',
    masterBath: '', wcCount: '', heating: [], balconyCount: '', glassBalcony: '', insulation: '', elevator: '', pantry: [], garage: '',
    parking: '', usageStatus: '', deedStatus: '', creditSuitable: '', swapAvailable: '', 
    features: [], description: '',
    images: [], coverImageIndex: 0, logo: FIXED_LOGO_URL 
  });

  const [privateData, setPrivateData] = useState({
    customerName: '', contactInfo: '', finalPrice: '', commission: '', propertyNo: '', notes: '', date: new Date().toISOString().split('T')[0]
  });

  const [openCategories, setOpenCategories] = useState({ "İç Özellikler": true, "Dış Özellikler": true, "Muhit / Konum": false, "Ulaşım": false });
  const toggleCategory = (category) => setOpenCategories(prev => ({...prev, [category]: !prev[category]}));
  const placeholderImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80';

  // Formatlar ve İşleyiciler
  const formatNumber = (value) => {
    if (!value) return '';
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (['price'].includes(name)) {
      setFormData({ ...formData, [name]: formatNumber(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePrivateInputChange = (e) => {
    const { name, value } = e.target;
    if (['finalPrice', 'commission'].includes(name)) {
      setPrivateData({ ...privateData, [name]: formatNumber(value) });
    } else {
      setPrivateData({ ...privateData, [name]: value });
    }
  };

  const handleMultiSelect = (field, value) => {
    const current = Array.isArray(formData[field]) ? formData[field] : [];
    const updated = current.includes(value) ? current.filter(i => i !== value) : [...current, value];
    setFormData({ ...formData, [field]: updated });
  };

  const handleOfficeChange = (e) => {
    const officeKey = e.target.value;
    setSelectedOffice(officeKey);
    setIsManualLocation(false);
    
    // Ofise göre varsayılan konum ve boş başlangıç
    const resetData = { rooms: '', size: '', netSize: '', totalFloors: '', floor: '', flatCountOnFloor: '', facade: [], age: '', masterBath: '', wcCount: '', heating: [], balconyCount: '', glassBalcony: '', insulation: '', elevator: '', pantry: [], garage: '', parking: '', usageStatus: '', deedStatus: '', creditSuitable: '', swapAvailable: '' };

    if (officeKey === 'eregli') {
        setFormData(prev => ({...prev, city: 'Konya', district: 'Ereğli', neighborhood: 'Yunuslu', ...resetData}));
    } else if (officeKey === 'karaman') {
        const firstNeighborhood = locationData['Karaman']['Merkez'][0] || '';
        setFormData(prev => ({...prev, city: 'Karaman', district: 'Merkez', neighborhood: firstNeighborhood, ...resetData}));
    } else if (officeKey === 'alanya') {
        const firstNeighborhood = locationData['Antalya']['Alanya'][0] || '';
        setFormData(prev => ({...prev, city: 'Antalya', district: 'Alanya', neighborhood: firstNeighborhood, ...resetData}));
    } else if (officeKey === 'konya') {
        const firstNeighborhood = locationData['Konya']['Selçuklu'][0] || '';
        setFormData(prev => ({...prev, city: 'Konya', district: 'Selçuklu', neighborhood: firstNeighborhood, ...resetData}));
    }
  };

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    if (detailedCities.includes(newCity)) {
        setIsManualLocation(false);
        const districts = Object.keys(locationData[newCity] || {});
        const firstDistrict = districts.length > 0 ? districts[0] : '';
        const neighborhoods = locationData[newCity]?.[firstDistrict] || [];
        setFormData({ ...formData, city: newCity, district: firstDistrict, neighborhood: neighborhoods.length > 0 ? neighborhoods[0] : '' });
    } else {
        setIsManualLocation(true);
        setFormData({ ...formData, city: newCity, district: '', neighborhood: '' });
    }
  };

  const handleDistrictChange = (e) => {
    const newDistrict = e.target.value;
    const neighborhoods = locationData[formData.city]?.[newDistrict] || [];
    setFormData({ ...formData, district: newDistrict, neighborhood: neighborhoods.length > 0 ? neighborhoods[0] : '' });
  };

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    }
  };

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setCustomLogo(base64Data);
        setShowLogo(true);
        try { localStorage.setItem('emlaknomi_custom_logo', base64Data); } catch (err) {}
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages, coverImageIndex: 0 });
  };

  const handleFeatureToggle = (feature) => {
    const newFeatures = formData.features.includes(feature)
      ? formData.features.filter(f => f !== feature)
      : [...formData.features, feature];
    setFormData({ ...formData, features: newFeatures });
  };

  const copyToClipboard = (text) => navigator.clipboard.writeText(text);

  // --- SİHİRLİ METİN VE BAŞLIK MANTIĞI ---
  const generateDescription = () => {
    const office = officeDetails[selectedOffice];
    
    // Otomatik Başlık Algoritması
    let generatedTitle = formData.title;
    if (!generatedTitle) {
      let floorType = "";
      const fl = formData.floor.toString();
      const flLower = fl.toLowerCase();
      const tf = parseInt(formData.totalFloors);
      const cf = parseInt(formData.floor);

      if (flLower.includes("zemin") || flLower.includes("giriş") || flLower.includes("dükkan") || flLower.includes("bodrum")) {
        floorType = fl;
      } else if (!isNaN(cf) && !isNaN(tf)) {
        if (cf === tf) {
          floorType = "Son Kat";
        } else if (cf < tf && cf >= 1) {
          floorType = "Ara Kat";
        } else {
          floorType = fl + ". Kat";
        }
      } else {
        floorType = fl;
      }

      // Tipin başındaki "Satılık/Kiralık" ifadesini başlığa yedir
      generatedTitle = `${formData.neighborhood}'da ${formData.rooms || ''} ${floorType} ${formData.type}`;
    }

    // Seçilmeyen alanları atla
    const addLine = (label, value, suffix = '') => {
        if (!value || value === '' || (Array.isArray(value) && value.length === 0)) return '';
        const valStr = Array.isArray(value) ? value.join(', ') : value;
        return `> ${label}: ${valStr}${suffix}\n`;
    };

    let featuresText = "";
    Object.keys(featureCategories).forEach(cat => {
      const selectedInCat = featureCategories[cat].filter(f => formData.features.includes(f));
      if (selectedInCat.length > 0) {
        featuresText += `\n\n> ${cat.toUpperCase()}:\n` + selectedInCat.join(', ');
      }
    });

    const desc = `EMLAKNOMİ'DEN ${generatedTitle.toUpperCase()}\n\n` +
      `Konum: ${formData.city} / ${formData.district} / ${formData.neighborhood}\n\n` +
      `DAİRE ÖZELLİKLERİ\n` +
      addLine('İlan no', formData.adNumber) +
      addLine('Oda Sayısı', formData.rooms) +
      addLine('Brüt m²', formData.size) +
      addLine('Net m²', formData.netSize) +
      addLine('Binadaki Kat Sayısı', formData.totalFloors) +
      addLine('Bulunduğu Kat', formData.floor) +
      addLine('Kattaki Daire Sayısı', formData.flatCountOnFloor) +
      addLine('Cephe', formData.facade) +
      addLine('Bina Yaşı', formData.age) +
      addLine('Ebeveyn Banyosu', formData.masterBath) +
      addLine('Tuvalet Sayısı', formData.wcCount) +
      addLine('Isıtma', formData.heating) +
      addLine('Balkon Sayısı', formData.balconyCount) +
      addLine('Cam Balkon', formData.glassBalcony) +
      addLine('Isı Yalıtım', formData.insulation) +
      addLine('Asansör', formData.elevator) +
      addLine('Kiler', formData.pantry) +
      addLine('Garaj', formData.garage) +
      addLine('Otopark', formData.parking) +
      addLine('Kullanım Durumu', formData.usageStatus) +
      addLine('Takas', formData.swapAvailable) +
      addLine('Krediye uygunmu', formData.creditSuitable) +
      addLine('Tapu Durumu', formData.deedStatus) +
      `${featuresText}\n\n\n` +
      `FİYAT: ${formData.price} ${formData.currency}\n\n` +
      `--------------------------------\n` +
      `Gayrimenkul Uzmanı - Özcan AKTAŞ\n` +
      `İletişim: ${office.phone}\n` +
      `Ofis Adres: ${office.address}\n` +
      `Taşınmaz Ticareti Yetki Belge No: ${office.authNo}`;
    
    setFormData({ ...formData, title: generatedTitle, description: desc });
  };

  // --- GÖRÜNTÜ YAKALAMA (1080p Kare Fix - MOBILE SAFE) ---
  const captureElement = async (element) => {
    if (!element || !window.html2canvas) return null;

    const originalWidth = element.offsetWidth;
    const originalHeight = element.offsetHeight;
    
    // Güvenlik kontrolü: Eğer eleman görünmüyorsa işlem yapma
    if (originalWidth === 0 || originalHeight === 0) return null;

    // 2. Klon oluştur ama GİZLEME
    const clone = element.cloneNode(true);
    
    // 3. Görünmez bir konteyner oluştur
    const container = document.createElement('div');
    container.style.position = 'fixed'; 
    container.style.top = '-10000px'; 
    container.style.left = '-10000px'; 
    container.style.width = `${originalWidth}px`; 
    container.style.height = `${originalHeight}px`; 
    container.style.zIndex = '-9999';
    container.style.overflow = 'hidden';
    
    clone.style.width = '100%';
    clone.style.height = '100%';
    clone.style.transform = 'none'; 
    clone.style.borderRadius = '0'; 
    clone.classList.remove('max-w-md', 'mx-auto');
    
    container.appendChild(clone);
    document.body.appendChild(container);

    // Resimlerin yüklenmesi için bekle
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const targetSize = 1080;
      // Mobilde sonsuz (infinity) scale oluşursa diye güvenlik
      const scaleFactor = originalWidth > 0 ? targetSize / originalWidth : 1;

      const canvas = await window.html2canvas(clone, {
        useCORS: true,
        scale: scaleFactor, 
        backgroundColor: null,
        logging: false,
        width: originalWidth,
        height: originalHeight,
        scrollX: 0,
        scrollY: 0,
        allowTaint: true
      });
      
      if (document.body.contains(container)) document.body.removeChild(container);
      return canvas;
    } catch (err) {
      console.error("Capture error:", err);
      if (document.body.contains(container)) document.body.removeChild(container);
      return null;
    }
  };

  // Görsel İndir Butonu
  const handleDownloadImageOnly = async () => {
      if (!socialPreviewRef.current) return;
      const canvas = await captureElement(socialPreviewRef.current);
      if (canvas) {
          canvas.toBlob((blob) => {
              window.saveAs(blob, `Emlak_Tasarim_${formData.title ? formData.title.substring(0,10) : 'Taslak'}.png`);
          });
      } else {
        alert("Görsel oluşturulamadı. Lütfen tekrar deneyin.");
      }
  };

  // ZIP İndir
  const handleDownloadProject = async () => {
    if (!window.JSZip || !window.saveAs || !window.html2canvas) {
      alert("İndirme kütüphaneleri henüz yüklenmedi, lütfen sayfayı yenileyin.");
      return;
    }

    setIsDownloading(true);
    const zip = new window.JSZip();
    const safeTitle = formData.title.replace(/[^a-z0-9]/gi, '_').substring(0, 20) || 'Emlak_Projesi';
    const rootFolder = zip.folder(`Emlak_Projesi_${safeTitle}`);

    const hamFolder = rootFolder.folder("1_HAM_FOTOLAR");
    if (formData.images.length > 0) {
      const imgPromises = formData.images.map(async (imgUrl, idx) => {
        try {
          const response = await fetch(imgUrl);
          const blob = await response.blob();
          hamFolder.file(`resim_${idx + 1}.jpg`, blob);
        } catch (e) {
          console.warn("Resim indirilemedi:", imgUrl);
        }
      });
      await Promise.all(imgPromises);
    }

    const tasarimFolder = rootFolder.folder("2_TASARIMLI");
    if (socialPreviewRef.current) {
        const canvas = await captureElement(socialPreviewRef.current);
        if (canvas) {
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            tasarimFolder.file(`sosyal_tasarim.png`, blob);
        } else {
             tasarimFolder.file("hata.txt", "Tasarım oluşturulamadı.");
        }
    }

    const metinFolder = rootFolder.folder("3_ILAN_METNI");
    metinFolder.file("ilan_metni.txt", formData.description || "Metin oluşturulmadı.");

    const ozelFolder = rootFolder.folder("4_OZEL_BILGI");
    const ozelContent = 
`MÜŞTERİ BİLGİ VE TAKİP FORMU
-------------------------------------------
Tarih              : ${privateData.date}
Müşteri Adı Soyadı : ${privateData.customerName}
İletişim Bilgisi   : ${privateData.contactInfo}
Biter Fiyatı       : ${privateData.finalPrice}
Komisyon Oranı     : ${privateData.commission}
Gayrimenkul Taşınmaz No: ${privateData.propertyNo}
Krediye Uygun mu?  : ${formData.creditSuitable}
Tapu Durumu        : ${formData.deedStatus}
Takas Durumu       : ${formData.swapAvailable}
Notlar             : ${privateData.notes}
`;
    ozelFolder.file("Ozel_Bilgiler.txt", ozelContent);

    const content = await zip.generateAsync({ type: "blob" });
    window.saveAs(content, `Emlak_Projesi_${safeTitle}.zip`);
    setIsDownloading(false);
  };

  const currentCoverImage = formData.images.length > 0 ? formData.images[formData.coverImageIndex] : placeholderImage;
  const currentOffice = officeDetails[selectedOffice];
  const availableDistricts = detailedCities.includes(formData.city) ? Object.keys(locationData[formData.city] || {}) : [];
  const availableNeighborhoods = detailedCities.includes(formData.city) ? (locationData[formData.city]?.[formData.district] || []) : [];
  const displayLogo = customLogo || FIXED_LOGO_URL;
  
  const getFeatureValue = (category, featureName) => {
      if (category === 'Cephe') { return Array.isArray(formData.facade) ? formData.facade.join(', ') : formData.facade; }
      if (category === 'Asansör') { return formData.elevator; }
      if (featureName) { return formData.features.includes(featureName) ? 'Var' : '-'; }
      return '-';
  };

  // --- YÜKLEME EKRANI ---
  if (!isReady) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800">
              <Loader2 className="animate-spin text-orange-600 mb-4" size={48} />
              <h2 className="text-xl font-bold">Emlak Asistanı Hazırlanıyor...</h2>
              <p className="text-sm text-slate-500 mt-2">Tasarımlar yükleniyor, lütfen bekleyin.</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-orange-200 selection:text-orange-900">
      <header className="bg-slate-900 text-white p-4 shadow-lg print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Home className="text-orange-500" size={28} />
            <h1 className="text-xl font-bold">Özcan AKTAŞ - Emlaknomi <span className="text-orange-500 font-light">Pro</span></h1>
          </div>
          <div className="flex items-center space-x-4">
             <button onClick={handleDownloadProject} disabled={isDownloading} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center font-bold text-sm transition-colors disabled:opacity-50">
                {isDownloading ? 'Hazırlanıyor...' : <><Download size={18} className="mr-2"/> Projeyi İndir (ZIP)</>}
             </button>
             <div className="text-right hidden md:block">
                <div className="text-sm font-bold text-orange-400">Özcan AKTAŞ</div>
                <div className="text-xs text-slate-400">Gayrimenkul Uzmanı</div>
                <div className="text-[10px] text-slate-500 mt-0.5">TTYB No: {currentOffice.authNo}</div>
             </div>
             <div className="h-8 w-8 bg-orange-500 rounded flex items-center justify-center font-bold border border-orange-600">ÖA</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN: EDITOR */}
        <div className="space-y-6 print:hidden">
          {/* Office Selection */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center text-slate-700"><User className="mr-2 text-blue-600" size={20} /> Ofis ve Marka Ayarları</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Çalışılan Şube/Bölge</label>
                  <select value={selectedOffice} onChange={handleOfficeChange} className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800">
                    <option value="eregli">Ereğli (Konya)</option>
                    <option value="karaman">Karaman</option>
                    <option value="konya">Konya Merkez</option>
                    <option value="alanya">Alanya</option>
                  </select>
                  <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded">
                    <p><strong>Tel:</strong> {currentOffice.phone}</p>
                    <p><strong>Yetki No:</strong> {currentOffice.authNo}</p>
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Logo Görünürlüğü</label>
                  <div className="flex items-center space-x-2 p-2 border rounded bg-slate-50">
                    <button onClick={() => setShowLogo(!showLogo)} className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-xs font-medium transition-all ${showLogo ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      {showLogo ? <><Eye size={14} className="mr-1"/> Gizle</> : <><EyeOff size={14} className="mr-1"/> Göster</>}
                    </button>
                    <label className="cursor-pointer bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-200 transition-colors flex items-center ml-2">
                      <Upload size={14} className="mr-1"/> Değiştir
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                    </label>
                  </div>
               </div>
               <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-slate-700 mb-1">Tasarım Rengi</label>
                 <div className="flex items-center space-x-2 p-2 border rounded bg-slate-50">
                   <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-none bg-transparent" />
                   <span className="text-xs text-slate-500 font-mono">{themeColor}</span>
                   <button onClick={() => setThemeColor('#ea580c')} className="ml-auto text-xs text-blue-600 underline">Varsayılana Dön</button>
                 </div>
               </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center text-slate-700"><Layout className="mr-2 text-blue-600" size={20} /> İlan Detayları</h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50">
                 <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-700">Fotoğraflar ({formData.images.length}/50)</label>
                    <label className="cursor-pointer bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center shadow-sm">
                      <Camera size={16} className="mr-1" /> Fotoğraf Ekle
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                 </div>
                 {formData.images.length > 0 ? (
                   <div className="grid grid-cols-4 gap-2 mt-2 max-h-40 overflow-y-auto p-1">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer group ${formData.coverImageIndex === idx ? 'border-orange-500 ring-2 ring-orange-200' : 'border-slate-200'}`} onClick={() => setFormData({...formData, coverImageIndex: idx})}>
                          <img src={img} alt={`Img ${idx}`} className="w-full h-full object-cover" />
                          <button onClick={(e) => {e.stopPropagation(); removeImage(idx);}} className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                          {formData.coverImageIndex === idx && <div className="absolute bottom-0 left-0 w-full text-white text-[9px] text-center font-bold" style={{backgroundColor: themeColor}}>KAPAK</div>}
                        </div>
                      ))}
                   </div>
                 ) : <div className="text-center py-4 text-slate-400 text-sm">Henüz fotoğraf yüklenmedi.</div>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">İlan Başlığı</label>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 bg-slate-100 p-2 rounded-l border border-r-0 whitespace-nowrap">Emlaknomi'den</span>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-r text-slate-800 bg-white" placeholder="Otomatik için boş bırakın..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fiyat</label>
                  <input type="text" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Para Birimi</label>
                  <select name="currency" value={formData.currency} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 bg-white">
                    <option>TL</option><option>USD</option><option>EUR</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-700 flex items-center"><MapPin size={16} className="mr-1 text-orange-500"/> Konum Seçimi</label>
                    {detailedCities.includes(formData.city) && (
                        <button onClick={() => setIsManualLocation(!isManualLocation)} className="text-xs text-blue-600 underline flex items-center hover:text-blue-800">{isManualLocation ? "Listeye Dön" : "Listede Yok / Manuel Gir"}</button>
                    )}
                </div>
                {isManualLocation ? (
                    <div className="grid grid-cols-3 gap-2 animate-in fade-in">
                        <div><label className="block text-xs text-slate-500 mb-1">İl (Manuel)</label><select name="city" value={formData.city} onChange={handleCityChange} className="w-full p-2 border rounded-md text-sm text-slate-800 bg-white">{allCities.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                        <div><label className="block text-xs text-slate-500 mb-1">İlçe</label><input type="text" name="district" value={formData.district} onChange={handleInputChange} className="w-full p-2 border rounded-md text-sm text-slate-800 bg-white" placeholder="İlçe"/></div>
                        <div><label className="block text-xs text-slate-500 mb-1">Mahalle</label><input type="text" name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} className="w-full p-2 border rounded-md text-sm text-slate-800 bg-white" placeholder="Mahalle"/></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                      <div><label className="block text-xs text-slate-500 mb-1">İl</label><select name="city" value={formData.city} onChange={handleCityChange} className="w-full p-2 border rounded-md text-sm text-slate-800 bg-white">{allCities.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                      <div><label className="block text-xs text-slate-500 mb-1">İlçe</label><select name="district" value={formData.district} onChange={handleDistrictChange} className="w-full p-2 border rounded-md text-sm text-slate-800 bg-white">{availableDistricts.length > 0 ? availableDistricts.map(d => <option key={d} value={d}>{d}</option>) : <option disabled>İlçe Yok</option>}</select></div>
                      <div><label className="block text-xs text-slate-500 mb-1">Mahalle</label>{availableNeighborhoods.length > 0 ? <select name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} className="w-full p-2 border rounded-md text-sm text-slate-800 bg-white">{availableNeighborhoods.map(n => <option key={n} value={n}>{n}</option>)}</select> : <input type="text" disabled value="Manuel Giriş" className="w-full p-2 border bg-slate-100 rounded-md text-sm text-slate-800"/>}</div>
                    </div>
                )}
              </div>

              {/* DETAILED INPUT GRID - REQUESTED ORDER */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div><label className="block text-xs text-slate-500 mb-1">Emlak Tipi</label><select name="type" value={formData.type} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white"><option>Satılık Daire</option><option>Kiralık Daire</option><option>Satılık Ofis</option><option>Kiralık Ofis</option><option>Kiralık İşyeri</option><option>Satılık Arsa</option><option>Satılık Tarla</option><option>Satılık Bahçe</option><option>Satılık Villa</option><option>Satılık Müstakil Ev</option></select></div>
                <div><label className="block text-xs text-slate-500 mb-1 font-bold text-red-500">İlan No</label><input type="text" name="adNumber" value={formData.adNumber} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white" placeholder="Boş bırakılabilir"/></div>
                <div><label className="block text-xs text-slate-500 mb-1">Oda Sayısı</label><select name="rooms" value={formData.rooms} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white"><option value="">Seçiniz</option>{options.rooms.map(r=><option key={r}>{r}</option>)}</select></div>
                
                <div><label className="block text-xs text-slate-500 mb-1">Brüt m²</label><input type="text" name="size" value={formData.size} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white" /></div>
                <div><label className="block text-xs text-slate-500 mb-1">Net m²</label><input type="text" name="netSize" value={formData.netSize} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white" /></div>
                {/* Kat Sayısı ve Bulunduğu Kat YER DEĞİŞTİRDİ */}
                <div><label className="block text-xs text-slate-500 mb-1 font-bold text-blue-600">Bulunduğu Kat</label><select name="floor" value={formData.floor} onChange={handleInputChange} className="w-full p-2 border-2 border-blue-100 rounded-lg text-sm text-slate-800 bg-white"><option value="">Seçiniz</option>{options.floors.map(f=><option key={f}>{f}</option>)}</select></div>
                <div><label className="block text-xs text-slate-500 mb-1">Binadaki Kat</label><select name="totalFloors" value={formData.totalFloors} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white"><option value="">Seçiniz</option>{options.totalFloors.map(f=><option key={f}>{f}</option>)}</select></div>
                <div><label className="block text-xs text-slate-500 mb-1">Kattaki Daire</label><select name="flatCountOnFloor" value={formData.flatCountOnFloor} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white"><option value="">Seçiniz</option>{options.flatCount.map(f=><option key={f}>{f}</option>)}</select></div>
                
                {/* Çoklu Seçim: Cephe */}
                <div className="relative group">
                    <label className="block text-xs text-slate-500 mb-1">Cephe (Çoklu)</label>
                    <div className="w-full p-2 border rounded-lg text-sm h-10 overflow-hidden cursor-pointer bg-white group-hover:h-auto absolute z-10 shadow-sm">{options.facade.map(f => (
                        <div key={f} onClick={() => handleMultiSelect('facade', f)} className={`flex items-center p-1 hover:bg-slate-100 text-slate-800 ${formData.facade.includes(f) ? 'font-bold' : ''}`} style={{color: formData.facade.includes(f) ? themeColor : 'inherit'}}>
                            {formData.facade.includes(f) && <CheckCircle size={10} className="mr-1"/>} {f}
                        </div>
                    ))}</div>
                    <div className="h-10"></div> {/* Spacer */}
                </div>
                
                <div><label className="block text-xs text-slate-500 mb-1">Bina Yaşı</label><select name="age" value={formData.age} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white"><option value="">Seçiniz</option>{options.age.map(a=><option key={a}>{a}</option>)}</select></div>
                <div><label className="block text-xs text-slate-500 mb-1">Ebeveyn Banyo</label><select name="masterBath" value={formData.masterBath} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white"><option value="">Seçiniz</option><option>Var</option><option>Yok</option></select></div>
                <div><label className="block text-xs text-slate-500 mb-1">Tuvalet Sayısı</label><select name="wcCount" value={formData.wcCount} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white"><option value="">Seçiniz</option>{options.wcCount.map(c=><option key={c}>{c}</option>)}</select></div>
                
                {/* Çoklu Seçim: Isıtma */}
                <div className="relative group">
                    <label className="block text-xs text-slate-500 mb-1">Isıtma (Çoklu)</label>
                    <div className="w-full p-2 border rounded-lg text-sm h-10 overflow-hidden cursor-pointer bg-white group-hover:h-auto absolute z-10 shadow-sm">{options.heating.map(h => (
                        <div key={h} onClick={() => handleMultiSelect('heating', h)} className={`flex items-center p-1 hover:bg-slate-100 text-slate-800 ${formData.heating.includes(h) ? 'font-bold' : ''}`} style={{color: formData.heating.includes(h) ? themeColor : 'inherit'}}>
                            {formData.heating.includes(h) && <CheckCircle size={10} className="mr-1"/>} {h}
                        </div>
                    ))}</div>
                    <div className="h-10"></div>
                </div>

                <div><label className="block text-xs text-slate-500 mb-1">Balkon Sayısı</label><select name="balconyCount" value={formData.balconyCount} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white"><option value="">Seçiniz</option>{options.balcony.map(b=><option key={b}>{b}</option>)}</select></div>
                <div><label className="block text-xs text-slate-500 mb-1">Cam Balkon</label><select name="glassBalcony" value={formData.glassBalcony} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white"><option value="">Seçiniz</option>{options.glassBalcony.map(g=><option key={g}>{g}</option>)}</select></div>
                
                <div><label className="block text-xs text-slate-500 mb-1">Isı Yalıtım</label><select name="insulation" value={formData.insulation} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white"><option value="">Seçiniz</option>{options.insulation.map(i=><option key={i}>{i}</option>)}</select></div>
                <div><label className="block text-xs text-slate-500 mb-1">Asansör</label><select name="elevator" value={formData.elevator} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white"><option value="">Seçiniz</option>{options.elevator.map(e=><option key={e}>{e}</option>)}</select></div>
                
                {/* Çoklu Seçim: Kiler */}
                <div className="relative group">
                    <label className="block text-xs text-slate-500 mb-1">Kiler (Çoklu)</label>
                    <div className="w-full p-2 border rounded-lg text-sm h-10 overflow-hidden cursor-pointer bg-white group-hover:h-auto absolute z-10 shadow-sm">{options.pantry.map(p => (
                        <div key={p} onClick={() => handleMultiSelect('pantry', p)} className={`flex items-center p-1 hover:bg-slate-100 text-slate-800 ${formData.pantry.includes(p) ? 'font-bold' : ''}`} style={{color: formData.pantry.includes(p) ? themeColor : 'inherit'}}>
                            {formData.pantry.includes(p) && <CheckCircle size={10} className="mr-1"/>} {p}
                        </div>
                    ))}</div>
                    <div className="h-10"></div>
                </div>
                
                <div><label className="block text-xs text-slate-500 mb-1">Garaj</label><select name="garage" value={formData.garage} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white"><option value="">Seçiniz</option>{options.garage.map(g=><option key={g}>{g}</option>)}</select></div>
                <div><label className="block text-xs text-slate-500 mb-1">Otopark</label><select name="parking" value={formData.parking} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white"><option value="">Seçiniz</option>{options.parking.map(p=><option key={p}>{p}</option>)}</select></div>
                <div><label className="block text-xs text-slate-500 mb-1">Kullanım Durumu</label><select name="usageStatus" value={formData.usageStatus} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white"><option value="">Seçiniz</option>{options.usage.map(u=><option key={u}>{u}</option>)}</select></div>
                
                <div><label className="block text-xs text-slate-500 mb-1">Takas</label><select name="swapAvailable" value={formData.swapAvailable} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white"><option value="">Seçiniz</option>{options.swap.map(s=><option key={s}>{s}</option>)}</select></div>
                <div><label className="block text-xs text-slate-500 mb-1">Kredi</label><select name="creditSuitable" value={formData.creditSuitable} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white"><option value="">Seçiniz</option>{options.credit.map(c=><option key={c}>{c}</option>)}</select></div>
                <div><label className="block text-xs text-slate-500 mb-1">Tapu</label><select name="deedStatus" value={formData.deedStatus} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white"><option value="">Seçiniz</option>{options.deed.map(d=><option key={d}>{d}</option>)}</select></div>
              </div>

              {/* Extra Features Accordion */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Diğer Özellikler</label>
                <div className="space-y-3">
                  {Object.keys(featureCategories).map((category) => (
                    <div key={category} className="border rounded-lg overflow-hidden bg-white">
                      <button onClick={() => toggleCategory(category)} className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"><span className="font-semibold text-sm text-slate-700">{category}</span>{openCategories[category] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
                      {openCategories[category] && (
                        <div className="p-3 flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                          {featureCategories[category].map(feature => (
                            <button key={feature} onClick={() => handleFeatureToggle(feature)} className={`px-3 py-1.5 rounded text-xs font-medium border transition-all text-left ${formData.features.includes(feature) ? 'text-white border-transparent shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`} style={formData.features.includes(feature) ? {backgroundColor: themeColor, borderColor: themeColor} : {}}>{formData.features.includes(feature) && <CheckCircle size={10} className="inline mr-1" />}{feature}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button onClick={generateDescription} className="w-full py-3 text-white rounded-lg hover:opacity-90 transition-all font-bold flex justify-center items-center shadow-md" style={{ background: `linear-gradient(to right, ${themeColor}, #000)` }}><FileText size={18} className="mr-2" /> Sihirli Metin Oluştur</button>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama Metni</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={8} className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:outline-none font-mono text-slate-600 bg-white whitespace-pre-line" style={{focusRingColor: themeColor}} placeholder="Yapay zeka metni buraya gelecek..." />
              </div>

              <div className="mt-6 border-t-2 border-slate-200 pt-4 bg-red-50 p-4 rounded-xl border-dashed border-red-200">
                <div className="flex items-center text-red-600 font-bold mb-2"><Lock size={18} className="mr-2" /> Gizli / Özel Bilgiler (Sadece Klasöre Kaydedilir)</div>
                <div className="text-xs text-red-400 mb-4">Bu alana girdiğiniz bilgiler ilan metninde veya görsellerde <u>ASLA</u> görünmez. Sadece indirilen ZIP dosyasının içindeki özel metin belgesinde yer alır.</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-xs text-slate-500 mb-1">Tarih</label><input type="date" name="date" value={privateData.date} onChange={handlePrivateInputChange} className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white" /></div>
                  <div><label className="block text-xs text-slate-500 mb-1">Müşteri Adı Soyadı</label><input type="text" name="customerName" value={privateData.customerName} onChange={handlePrivateInputChange} className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white" placeholder="Örn: Ahmet Yılmaz" /></div>
                  <div><label className="block text-xs text-slate-500 mb-1">İletişim Bilgisi</label><input type="text" name="contactInfo" value={privateData.contactInfo} onChange={handlePrivateInputChange} className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white" placeholder="Örn: 05xx xxx xx xx" /></div>
                  <div><label className="block text-xs text-slate-500 mb-1">Biter Fiyatı</label><input type="text" name="finalPrice" value={privateData.finalPrice} onChange={handlePrivateInputChange} className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white" placeholder="Pazarlıksız son fiyat" /></div>
                  <div><label className="block text-xs text-slate-500 mb-1">Komisyon Oranı</label><input type="text" name="commission" value={privateData.commission} onChange={handlePrivateInputChange} className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white" placeholder="%2 veya Net Rakam" /></div>
                  <div><label className="block text-xs text-slate-500 mb-1">Gayrimenkul Taşınmaz No</label><input type="text" name="propertyNo" value={privateData.propertyNo} onChange={handlePrivateInputChange} className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white" placeholder="Tapu / Parsel No" /></div>
                  <div className="md:col-span-2"><label className="block text-xs text-slate-500 mb-1">Özel Notlar</label><textarea name="notes" value={privateData.notes} onChange={handlePrivateInputChange} rows={3} className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white" placeholder="Sadece size özel notlar..." /></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex w-full print:hidden">
            <button onClick={() => setActiveTab('social')} className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${activeTab === 'social' ? 'text-white' : 'text-slate-500'}`} style={activeTab === 'social' ? {backgroundColor: themeColor} : {}}><Instagram size={18} className="mr-2" /> Sosyal Medya</button>
            <button onClick={() => setActiveTab('whatsapp')} className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${activeTab === 'whatsapp' ? 'text-white' : 'text-slate-500'}`} style={activeTab === 'whatsapp' ? {backgroundColor: '#25D366'} : {}}><MessageCircle size={18} className="mr-2" /> WhatsApp</button>
            <button onClick={() => setActiveTab('print')} className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${activeTab === 'print' ? 'text-white' : 'text-slate-500'}`} style={activeTab === 'print' ? {backgroundColor: themeColor} : {}}><Printer size={18} className="mr-2" /> Vitrin</button>
          </div>

          {activeTab === 'social' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-in fade-in duration-300 print:hidden">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Instagram Tasarımı</h3>
                  <div className="flex space-x-2">
                      <button onClick={handleDownloadImageOnly} className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs px-3 py-1 rounded-full border border-blue-300 transition-colors flex items-center mr-2 font-bold"><Download size={14} className="mr-1"/> Görseli İndir</button>
                      <button onClick={() => setDesignMode('single')} className={`text-xs px-3 py-1 rounded-full border transition-colors flex items-center ${designMode === 'single' ? 'text-white' : 'bg-white text-slate-600'}`} style={designMode === 'single' ? {backgroundColor: themeColor} : {}}><ImageIcon size={14} className="mr-1"/> Tekli</button>
                      <button onClick={() => setDesignMode('multi')} className={`text-xs px-3 py-1 rounded-full border transition-colors flex items-center ${designMode === 'multi' ? 'text-white' : 'bg-white text-slate-600'}`} style={designMode === 'multi' ? {backgroundColor: themeColor} : {}}><Grid size={14} className="mr-1"/> Çoklu</button>
                  </div>
              </div>
              <div ref={socialPreviewRef} className="aspect-square w-full max-w-md mx-auto bg-slate-900 overflow-hidden relative shadow-2xl">
                {designMode === 'single' ? (
                    <img src={formData.images.length > 0 ? formData.images[formData.coverImageIndex] : placeholderImage} alt="House" className="w-full h-full object-cover opacity-90" crossOrigin="anonymous"/>
                ) : (
                    <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                        {[0, 1, 2, 3].map(i => {
                            const img = formData.images[i] || placeholderImage;
                            return (
                                <div key={i} className="w-full h-full border-[0.5px] border-white/10 relative overflow-hidden">
                                    <img src={img} className="w-full h-full object-cover" alt={`Grid ${i}`} crossOrigin="anonymous"/>
                                    {i === 0 && <div className="absolute inset-0 bg-black/20"></div>}
                                </div>
                            )
                        })}
                    </div>
                )}
                {showLogo && (
                  <div className="absolute top-4 right-4 w-28 h-20 flex items-center justify-center z-20">
                    <img src={customLogo || FIXED_LOGO_URL} crossOrigin="anonymous" alt="Logo" className="max-w-full max-h-full object-contain drop-shadow-xl" />
                  </div>
                )}
                <div className="absolute top-6 left-0 flex flex-col items-start gap-1 z-20">
                    <div className="text-white px-4 py-1 text-sm font-bold shadow-md rounded-r-lg tracking-wide" style={{backgroundColor: themeColor}}>{formData.type.toLocaleUpperCase('tr-TR')}</div>
                    <div className="bg-slate-900/80 text-white px-3 py-1 text-xs font-medium shadow-md rounded-r-lg backdrop-blur-sm border-l-2" style={{borderColor: themeColor}}>{formData.neighborhood} Mh.</div>
                    {formData.adNumber && (
                        <div className="bg-white/90 text-slate-800 px-3 py-1 text-[10px] font-bold shadow-md rounded-r-lg mt-1 border-l-2 border-slate-500">
                          İlan No: {formData.adNumber}
                        </div>
                    )}
                </div>
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent text-white z-20">
                  <h2 className="text-2xl font-bold leading-tight mb-2">Emlaknomi'den {formData.title} {formData.rooms}</h2>
                  <div className="flex items-center text-sm mb-4 text-slate-300"><MapPin size={14} className="mr-1" style={{color: themeColor}} />{formData.district} / {formData.city}</div>
                  <div className="flex justify-between items-center mb-3 border-t border-white/20 pt-3">
                    <div className="flex space-x-3 text-sm font-medium">
                      <span className="flex items-center"><Home size={12} className="mr-1 opacity-70"/>{formData.rooms}</span>
                      <span className="w-px h-3 bg-white/30"></span>
                      <span className="flex items-center"><Layout size={12} className="mr-1 opacity-70"/>{formData.size} m²</span>
                      <span className="w-px h-3 bg-white/30"></span>
                      <span className="flex items-center">{formData.floor}. Kat</span>
                    </div>
                    {/* Fiyat rengini her zaman turuncu (orange-600) olacak şekilde sabitledim */}
                    <div className="text-base font-bold bg-white/20 px-2 py-1 rounded whitespace-nowrap text-orange-600">{formData.price} {formData.currency}</div>
                  </div>
                  <div className="text-white text-sm font-bold py-1.5 px-3 rounded w-full text-center whitespace-nowrap shadow-lg flex items-center justify-center" style={{ background: `linear-gradient(to right, ${themeColor}, #000)` }}><User size={14} className="mr-2"/> Özcan AKTAŞ - {currentOffice.phone}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-in fade-in duration-300 print:hidden">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">WhatsApp Hazır Mesajı</h3>
              <div className="bg-[#e7fce3] p-4 rounded-lg border border-[#d1eecf] text-slate-800 font-mono text-sm whitespace-pre-wrap relative max-h-[500px] overflow-y-auto">{formData.description ? formData.description : "Önce sol taraftan 'Sihirli Metin Oluştur' butonuna basınız."}</div>
              <button onClick={() => copyToClipboard(formData.description)} className="mt-4 w-full py-3 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] transition-colors flex justify-center items-center shadow-md font-bold"><Copy size={18} className="mr-2" /> Mesajı Kopyala</button>
            </div>
          )}

          {activeTab === 'print' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-in fade-in duration-300 print:hidden">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Vitrin İlanı (A4)</h3>
              <div className="aspect-[1/1.414] w-full bg-white border border-slate-200 shadow-lg p-4 flex flex-col relative overflow-hidden scale-95 origin-top">
                <div className="flex justify-between items-center border-b-2 pb-2 mb-2" style={{borderColor: themeColor}}>
                   {showLogo ? (<div className="h-10 w-20 flex items-center justify-start"><img src={customLogo || FIXED_LOGO_URL} className="max-h-full max-w-full object-contain" alt="Logo"/></div>) : <div className="font-bold text-slate-700">EMLAKNOMİ</div>}
                   <div className="text-[10px] text-right"><div className="font-bold">Özcan AKTAŞ</div><div>{currentOffice.phone}</div></div>
                </div>
                <div className="w-full h-48 bg-slate-100 mb-2 overflow-hidden rounded-sm relative">
                  <img src={formData.images.length > 0 ? formData.images[formData.coverImageIndex] : placeholderImage} className="w-full h-full object-cover" alt="Vitrin" />
                  <div className="absolute top-0 right-0 text-white text-xs px-2 py-1 font-bold" style={{backgroundColor: themeColor}}>{formData.type}</div>
                </div>
                <h1 className="text-lg font-bold text-slate-800 mb-1 leading-tight">Emlaknomi'den {formData.title} {formData.rooms}</h1>
                <div className="text-xs text-slate-500 mb-2">{formData.neighborhood}, {formData.district} / {formData.city}</div>
                <div className="grid grid-cols-4 gap-2 text-[9px] mb-2">
                   <div className="bg-slate-50 p-1 border rounded text-center text-slate-800"><span className="block text-slate-400 text-[8px]">ODA</span><strong>{formData.rooms}</strong></div>
                   <div className="bg-slate-50 p-1 border rounded text-center text-slate-800"><span className="block text-slate-400 text-[8px]">KAT</span><strong>{formData.floor}</strong></div>
                   <div className="bg-slate-50 p-1 border rounded text-center text-slate-800"><span className="block text-slate-400 text-[8px]">M²</span><strong>{formData.size}</strong></div>
                   <div className="bg-slate-50 p-1 border rounded text-center text-slate-800"><span className="block text-slate-400 text-[8px]">YAŞ</span><strong>{formData.age}</strong></div>
                   <div className="bg-slate-50 p-1 border rounded text-center text-slate-800"><span className="block text-slate-400 text-[8px]">CEPHE</span><strong>{Array.isArray(formData.facade) ? formData.facade.join(', ') : formData.facade}</strong></div>
                   <div className="bg-slate-50 p-1 border rounded text-center text-slate-800"><span className="block text-slate-400 text-[8px]">ASANSÖR</span><strong>{formData.elevator}</strong></div>
                   <div className="bg-slate-50 p-1 border rounded text-center text-slate-800"><span className="block text-slate-400 text-[8px]">TAKAS</span><strong>{formData.swapAvailable}</strong></div>
                   <div className="bg-slate-50 p-1 border rounded text-center text-slate-800"><span className="block text-slate-400 text-[8px]">KREDİ</span><strong>{formData.creditSuitable}</strong></div>
                </div>
                <div className="mt-auto bg-slate-900 text-white text-center py-2 rounded"><div className="text-xl font-bold">{formData.price} {formData.currency}</div></div>
              </div>
              <button onClick={() => window.print()} className="mt-4 w-full py-3 text-white rounded-lg hover:opacity-90 transition-colors flex justify-center items-center shadow-md font-bold" style={{backgroundColor: themeColor}}><Printer size={18} className="mr-2" /> Yazdır (A4)</button>
            </div>
          )}
        </div>
      </main>

      <style>{`@media print {@page { margin: 0; size: A4; } body { -webkit-print-color-adjust: exact; }}`}</style>
    </div>
  );
}
