import React, { useState, useEffect, useRef } from 'react';
import { Camera, Home, MapPin, CheckCircle, Layout, Upload, User, ChevronDown, ChevronUp, Download, Lock, Loader2, Globe, Car, Building, X, Compass, Calendar, ArrowUpDown, FileText, Edit3, PlusCircle, Trash2, Flame, Settings } from 'lucide-react';

// --- YARDIMCI BİLEŞENLER ---
const InputField = ({ label, name, value, onChange, onBlur, placeholder, highlight }) => (
  <div className={`mb-2 ${highlight ? 'bg-slate-200/80 p-2.5 rounded-lg border border-slate-300 shadow-sm' : ''}`}>
    <label className={`block text-xs ${highlight ? 'text-slate-700' : 'text-slate-500'} mb-1 font-bold`}>{label}</label>
    <input 
      type="text" 
      name={name} 
      value={value || ''} 
      onChange={onChange} 
      onBlur={onBlur}
      className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white focus:outline-none focus:border-orange-500 transition-colors" 
      placeholder={placeholder}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, highlight }) => (
  <div className={`mb-2 ${highlight ? 'bg-slate-200/80 p-2.5 rounded-lg border border-slate-300 shadow-sm' : ''}`}>
    <label className={`block text-xs ${highlight ? 'text-slate-700' : 'text-slate-500'} mb-1 font-bold`}>{label}</label>
    <select 
      name={name} 
      value={value || ''} 
      onChange={onChange} 
      className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white focus:outline-none focus:border-orange-500 transition-colors"
    >
      <option value="">Seçiniz</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const MultiSelectField = ({ label, field, value = [], onChange, options, themeColor, highlight }) => (
  <div className={`relative group mb-2 ${highlight ? 'bg-slate-200/80 p-2.5 rounded-lg border border-slate-300 shadow-sm' : ''}`}>
      <label className={`block text-xs ${highlight ? 'text-slate-700' : 'text-slate-500'} mb-1 font-bold`}>{label} (Çoklu)</label>
      <div className="w-full p-2 border rounded-lg text-sm h-24 overflow-y-auto cursor-pointer bg-white text-slate-800 focus-within:border-orange-500 transition-colors border-slate-200 custom-scrollbar">
          {options.map(op => (
          <div key={op} onClick={() => onChange(field, op)} className={`flex items-center p-1.5 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 ${(value || []).includes(op) ? 'font-bold' : ''}`} style={{color: (value || []).includes(op) ? themeColor : 'inherit', backgroundColor: (value || []).includes(op) ? `${themeColor}10` : 'transparent'}}>
              {(value || []).includes(op) ? <CheckCircle size={14} className="mr-2" style={{color: themeColor}}/> : <div className="w-3.5 h-3.5 border-2 rounded-full mr-2 border-slate-300"></div>}
              {op}
          </div>
      ))}</div>
  </div>
);

// --- SABİT VERİLER ---
const FIXED_LOGO_URL = "https://i.hizliresim.com/fa4ibjl.png"; 
const DEFAULT_PROFILE_PHOTO = "https://i.hizliresim.com/eqya4c4.png";
const placeholderImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80';

const officeDetails = {
  eregli: { name: 'Ereğli Şubesi', city: 'Konya', address: 'Yunuslu mh. uğur mumcu caddesi 35/A Ereğli/Konya', phone: '0533 638 7000', authNo: '4202207' },
  karaman: { name: 'Karaman Şubesi', city: 'Karaman', address: 'İmaret mahallesi 173. sokak No:3/A Karaman', phone: '0543 306 14 99', authNo: '7000161' },
  konya: { name: 'Konya Şubesi', city: 'Konya', address: 'Konya Merkez', phone: '0543 306 14 99', authNo: '7000161' },
  alanya: { name: 'Alanya Şubesi', city: 'Antalya', address: 'Alanya Merkez', phone: '0543 306 14 99', authNo: '0704618' },
  antalya: { name: 'Antalya Şubesi', city: 'Antalya', address: 'Antalya Merkez', phone: '0543 306 14 99', authNo: '0704618' },
  eskisehir: { name: 'Eskişehir Şubesi', city: 'Eskişehir', address: 'Eskişehir Merkez', phone: '0543 306 14 99', authNo: '0000000' }
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
  }
};

// --- SEÇENEK LİSTELERİ ---
const options = {
  rooms: ["1+0", "1+1", "2+0", "2+1", "3+0", "3+1", "4+0", "4+1", "5+1", "5+2", "6+1", "6+2", "6+3", "7+1", "7+2", "7+3", "7+4", "8+1", "8+2", "8+3", "8+4", "Diğer"],
  floors: ["Zemin Kat", "Yüksek Giriş", "Dükkan Üstü", "Bodrum Kat", ...Array.from({length: 25}, (_, i) => (i + 1).toString())],
  totalFloors: Array.from({length: 25}, (_, i) => (i + 1).toString()),
  flatCount: ["Müstakil", ...Array.from({length: 15}, (_, i) => (i + 2).toString())],
  age: ["Sıfır", "İnşaat Hali", "1", "2", "3", "4", "5", "6-10 arası", "11-15 arası", "16-20 arası", "21-25 arası", "26-30 arası", "30 üstü"],
  facade: ["Kuzey", "Güney", "Doğu", "Batı"],
  wcCount: ["1", "2", "3", "4", "5"],
  heating: ["Bireysel Kombi", "Merkezi (Pay ölçer)", "Yerden Isıtma", "Sobalı", "Elektrik", "Klima"],
  balcony: ["Yok", "1", "2", "3", "4", "5", "6"],
  glassBalcony: ["Var", "Yok", "1", "2", "3", "4", "5", "6"],
  insulation: ["Var", "Yok", "İçten", "Dıştan", "İçten ve Dıştan"],
  elevator: ["Var", "Yok", "Çift Asansör", "Yapım Aşamasında"],
  garage: ["Var", "Yok", "Bireysel Garaj", "Ortak Kullanım"],
  parking: ["Var", "Yok", "Açık", "Kapalı", "Açık ve Kapalı"],
  usage: ["Mülk Sahibi", "Boş", "Kiracılı", "Yapım Aşamasında"],
  swap: ["Var", "Yok", "Değerlendirilir", "Araç ile takas", "Daire ile Takas", "Gayrimenkul ile takas"],
  credit: ["Evet", "Hayır", "Bilinmiyor", "Kısmen"],
  deed: ["Kat Mülkiyeti", "Kat İrtifakı", "Arsa Tapulu"],
  hisse: ["Hisseli", "Müstakil"],
  iskan: ["Var", "Yok", "Alınacak"],
    
  konutTipi: ["Apart", "Daire", "Dublex", "Triplex", "Villa", "Müstakil Ev", "Devremülk", "Diğer"],
  katTipi: ["Ara Kat", "Çatı Katı", "Bahçe Katı", "Teras Kat", "Diğer"],
  banyoSayisi: ["1", "2", "3", "4", "5"],
  tuvaletTipi: ["Alaturka", "Alafranga"],
  icKapilar: ["Panel", "Lake", "Ahşap", "Pvc", "Metal", "Diğer"],
  pencereler: ["Pvc", "Ahşap", "Metal", "Diğer"],
  zeminler: ["Laminant", "Granit", "Ahşap Parke", "Fayans", "Beton", "Diğer"],
  mutfakDolabi: ["Sıfır", "Yeni", "İyi", "Orta", "Kötü", "Yok"],
  bahce: ["Var", "Yok", "Bireysel", "Ortak Kullanım", "Kış Bahçeli"],
  panjur: ["Var", "Yok", "Otomatik Panjur", "Manuel Panjur"],
  guvenlik: ["Var", "Yok", "Kamera Sistemi", "Güvenlik"],
  aktivite: ["Spa", "Sauna", "Hamam", "Açık Havuz", "Kapalı Havuz", "Spor Salonu", "Tenis Kortu", "Basketbol Sahası", "Futbol Sahası", "Toplantı salonu", "Kreş"],
  kiler: ["Var", "Yok", "Dairede", "Bodrumda", "Çatıda", "Balkonda", "Bahçede"],
    
  arsaTipi: ["Konut", "Ticari", "Konut + Ticari", "Otel", "Sanayi", "AVM", "Diğer"],
  imarDurumu: ["İmarlı", "İmarsız", "18. Madde kapsamında", "Diğer"],
  nizam: ["Ayrık", "Bitişik", "Blok", "İkiz", "Birlikte Yapılaşma", "Diğer"],
  altYapi: ["Elektrik", "Su", "Sanayi Elektriği", "Doğalgaz", "İnternet", "Telekom", "Fiber", "Kanalizasyon", "Yol"],
  tarlaTipi: ["Sulu", "Kıraç", "Verimli", "Taşlık", "Marjinal"],
  suDurumu: ["Var", "Yok", "Şebeke", "Kooperatif", "Sondaj Kuyu", "Kanaldan Sulama", "Dereden", "Diğer"],
  elektrikDurumu: ["Var", "Yok", "Alınabilir"],
  yolDurumu: ["Var", "Yok", "Patika yol", "Kadastro Yolu"],
  evDurumu: ["Var", "Yok", "1+1", "2+1", "3+1", "4+1", "Dublex", "Triplex"],
  havuzDurumu: ["Var", "Yok", "Sulama Havuzu", "Yüzme Havuzu", "Bilinmiyor"],
  bahceTipi: ["Elma Bahçesi", "Ceviz Bahçesi", "Zeytin Bahçesi", "Badem Bahçesi", "Erik Bahçesi", "Kiraz Bahçesi", "Üzüm Bağı", "Meyve Bahçesi (Karışık)", "Hobi bahçesi", "Diğer"],
    
  ticariTipi: ["Dükkan", "Ofis", "Depo", "Sanayi Dükkanı", "Otel", "Fabrika", "Diğer"],
  katSayisiTicari: ["Bodrum", "Zemin", "Asma Kat", "1", "2", "3", "4", "5", "6"],
  mevki: ["Çarşı", "İlkokul", "Lise", "Üniversite", "Hastane", "Sağlık Ocağı", "Pazar", "AVM", "Market", "Eczane", "Belediye", "Dolmuş Hattı", "Otobüs Durağı", "Ana Cadde", "Ara Sokak"]
};

const featureCategories = {
  "İç Özellikler": ["ADSL", "Ahşap Doğrama", "Akıllı Ev", "Alarm", "Alaturka Tuvalet", "Alüminyum Doğrama", "Amerikan Kapı", "Amerikan Mutfak", "Ankastre Fırın", "Barbükü", "Beyaz Eşya", "Boyalı", "Bulaşık Makinesi", "Buzdolabı", "Çamaşır Odası", "Çelik Kapı", "Duşakabin", "Duvar Kağıdı", "Fiber İnternet", "Fırın", "Giyinme Odası", "Gömme Dolap", "Görüntülü Diafon", "Hilton Banyo", "Isıcam", "Jakuzi", "Kartonpiyer", "Klima", "Laminat Zemin", "Marley", "Mobilyalı", "Panjur", "Parke Zemin", "PVC Doğrama", "Seramik Zemin", "Spot Aydınlatma", "Şömine", "Teras", "Vestiyer", "Wi-Fi", "Yüz Tanıma & Parmak İzi"],
  "Dış Özellikler": ["Araç Şarj İstasyonu", "24 Saat Güvenlik", "Apartman Görevlisi", "Buhar Odası", "Çocuk Oyun Parkı", "Hidrofor", "Jeneratör", "Kablo TV", "K Kamera Sistemi", "Kapalı Otopark", "Kreş", "Müstakil Havuzlu", "Oyun Parkı", "Sauna", "Ses Yalıtımı", "Siding", "Spor Alanı", "Su Deposu", "Tenis Kortu", "Uydu", "Yangın Merdiveni", "Yüzme Havuzu (Açık)", "Yüzme Havuzu (Kapalı)"],
  "Muhit / Konum": ["Alışveriş Merkezi", "Belediye", "Cami", "Cemevi", "Denize Sıfır", "Eczane", "Eğlence Merkezi", "Fuar Alanı", "Göl Manzaralı", "Hastane", "Havra", "İlkokul-Ortaokul", "İtfaiye", "Kilise", "Lise", "Market", "Merkezi", "Park", "Polis Merkezi", "Sağlık Ocağı", "Semt Pazarı", "Şehir Manzaralı", "Şehir Merkezi", "Üniversite"],
  "Ulaşım": ["Anayol", "Avrasya Tüneli", "Boğaz Köprüleri", "Cadde", "Dolmuş", "E-5", "Havaalanı", "İskele", "Marmaray", "Metro", "Metrobüs", "Minibüs", "Otobüs Durağı", "Sahil", "TEM", "Teleferik", "Tramvay", "Tren İstasyonu", "Troleybüs"]
};

const allCities = ["Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalva", "Karabük", "Kilis", "Osmaniye", "Düzce"].sort();

const INITIAL_FORM_DATA = {
    isOpportunity: false,
    customTitle: '',
    title: '', price: '', currency: 'TL',
    city: 'Konya', district: 'Ereğli', neighborhood: 'Yunuslu',
    type: 'Satılık Daire', adNumber: '', 
    rooms: '', size: '', netSize: '', totalFloors: '', floor: '', flatCountOnFloor: '', facade: [], age: '',
    masterBath: '', wcCount: '', heating: [], balconyCount: '', glassBalcony: '', insulation: '', elevator: '', pantry: [], garage: '',
    parking: '', usageStatus: '', deedStatus: '', creditSuitable: '', swapAvailable: '', hisseDurumu: '', iskan: '',
    konutTipi: '', katTipi: '', banyoSayisi: '', tuvaletTipi: [], kizartmaMutfagi: '', giyinmeOdasi: '', camasirOdasi: '',
    icKapilar: '', pencereler: '', asmaTavan: '', dusakabin: '', vestiyer: '', catiKaplama: '', zeminler: '', mutfakDolabi: '',
    celikKapi: '', bahce: [], esyali: '', panjur: [], ankastre: '', siteIci: '', oyunParki: '', kamelya: '', guvenlik: [], aktivite: [],
    aidat: '', kiraBedeli: '',
    arsaTipi: '', imarDurumu: '', adaParsel: '', taks: '', kaks: '', katAdedi: '', yukseklik: '', yolaTerk: '', nizam: '', yolaCephesi: '',
    altYapi: [], katKarsiligi: '',
    tarlaTipi: [], suDurumu: [], elektrikDurumu: '', yolDurumu: [], telOrgu: '', evDurumu: [], havuzDurumu: '', depoGaraj: '', sulamaTesisati: '', techizat: '', egim: '',
    bahceTipi: '', meyveCinsi: '', agacSayisi: '', agacYasi: '',
    gayrimenkulTipi: '', onCepheUzunluk: '', kiracilimi: '', mevki: [],
    katSayisiTicari: [],
    digerOzellikler: '',
    features: [], description: '',
    images: [], coverImageIndex: 0, logo: FIXED_LOGO_URL 
};

// TASARIM KONTROLLERİ İÇİN DEFAULT YAPILAR
const defaultTransform = { x: 0, y: 0, scale: 1, show: true };
const DEFAULT_DESIGN_CONFIG = {
  consultant: {
    topLogo: { ...defaultTransform },
    badge: { ...defaultTransform },
    title: { ...defaultTransform },
    price: { ...defaultTransform },
    icons: { ...defaultTransform },
    name: { ...defaultTransform },
    separator: { ...defaultTransform },
    phone: { ...defaultTransform },
    websites: { ...defaultTransform }
  },
  corporate: {
    topLogo: { ...defaultTransform },
    bottomLogo: { ...defaultTransform, scale: 3 },
    badge: { ...defaultTransform },
    title: { ...defaultTransform },
    price: { ...defaultTransform },
    icons: { ...defaultTransform },
    websites: { ...defaultTransform }
  }
};

export default function App({ userData = null, branchesData = null }) {
  const defaultUser = {
    name: 'Özcan AKTAŞ',
    phone: '0533 638 7000',
    photo: DEFAULT_PROFILE_PHOTO,
    role: 'admin',
    allowedBranches: ['eregli', 'karaman', 'konya', 'alanya', 'antalya', 'eskisehir'] 
  };
  
  const activeUser = userData || defaultUser;
  const availableBranches = branchesData || officeDetails;

  const [activeTab, setActiveTab] = useState('social');
  const [designMode, setDesignMode] = useState('single');
  const [previewDesignType, setPreviewDesignType] = useState('consultant');
  const [isManualLocation, setIsManualLocation] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [appState, setAppState] = useState('dashboard');
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [currentDraftId, setCurrentDraftId] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [draftToDelete, setDraftToDelete] = useState(null);
  
  const socialPreviewRef = useRef(null);
    
  const [isReady, setIsReady] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [customLogo, setCustomLogo] = useState(null); 
  const [themeColor, setThemeColor] = useState('#ea580c');
  const [showWebsiteOzcan, setShowWebsiteOzcan] = useState(true);
  const [showWebsiteEmlaknomi, setShowWebsiteEmlaknomi] = useState(true);
  
  const [activeConfigTab, setActiveConfigTab] = useState(null); 
  const [selectedConsultantElement, setSelectedConsultantElement] = useState('topLogo');
  const [selectedCorporateElement, setSelectedCorporateElement] = useState('topLogo');
  const [designConfig, setDesignConfig] = useState(DEFAULT_DESIGN_CONFIG);
  const [overlayData, setOverlayData] = useState({ show: false, photo: null, x: 0, y: 0, scale: 1 });

  const [consultant, setConsultant] = useState({
    name: activeUser.name,
    phone: activeUser.phone,
    photo: activeUser.photo || DEFAULT_PROFILE_PHOTO,
    showInfo: true,
    showPhoto: true
  });

  const initialOffice = (activeUser.allowedBranches && activeUser.allowedBranches.length > 0) 
        ? activeUser.allowedBranches[0] 
        : Object.keys(availableBranches)[0];

  const [selectedOffice, setSelectedOffice] = useState(initialOffice);
    
  const [formData, setFormData] = useState({...INITIAL_FORM_DATA});

  const [privateData, setPrivateData] = useState({
    customerName: '', contactInfo: '', finalPrice: '', commission: '', propertyNo: '', notes: '', 
    date: new Date().toISOString().split('T')[0],
    deedStatusPrivate: '', doorCode: '', swapPrivate: '', openAddress: ''
  });

  useEffect(() => {
    document.title = "Özcan AKTAŞ - Emlaknomi Pro";
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        const script = document.createElement('script'); script.src = src; 
        script.onload = resolve; script.onerror = reject; document.head.appendChild(script);
      });
    };

    Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'),
      loadScript('https://cdn.tailwindcss.com')
    ]).then(() => {
        const checkReady = setInterval(() => { 
            if (window.JSZip && window.htmlToImage && window.jspdf && window.tailwind) { 
                clearInterval(checkReady); 
                setIsReady(true); 
            } 
        }, 50);
        setTimeout(() => { clearInterval(checkReady); setIsReady(true); }, 2000);
    }).catch((e) => {
        console.error("Script loading error: ", e);
    });

    const savedLogo = localStorage.getItem('emlaknomi_custom_logo');
    if (savedLogo) { setCustomLogo(savedLogo); setShowLogo(true); }

    const savedOverlaySettings = localStorage.getItem('emlaknomi_overlay_settings');
    const savedOverlayPhoto = localStorage.getItem('emlaknomi_overlay_photo');
    if (savedOverlaySettings) {
        try {
            const parsed = JSON.parse(savedOverlaySettings);
            setOverlayData(prev => ({ ...prev, ...parsed, photo: savedOverlayPhoto || null }));
        } catch(e) {}
    } else if (savedOverlayPhoto) {
        setOverlayData(prev => ({ ...prev, photo: savedOverlayPhoto }));
    }
    
    const savedDesignConfig = localStorage.getItem('emlaknomi_design_config');
    if (savedDesignConfig) {
        try {
            const parsed = JSON.parse(savedDesignConfig);
            setDesignConfig({
                consultant: { ...DEFAULT_DESIGN_CONFIG.consultant, ...(parsed.consultant || {}) },
                corporate: { ...DEFAULT_DESIGN_CONFIG.corporate, ...(parsed.corporate || {}) }
            });
        } catch(e) {}
    }
    
    loadDrafts();
  }, []);

  useEffect(() => {
      if (appState === 'editor' && !formData.adNumber) {
          setSaveStatus('Kaydediliyor...');
          const timer = setTimeout(() => {
              saveDraft(true);
          }, 2000); 
          return () => clearTimeout(timer);
      }
  }, [formData, privateData, selectedOffice, isManualLocation, overlayData, appState]);

  const loadDrafts = () => {
      const draftsStr = localStorage.getItem('emlaknomi_drafts');
      if (draftsStr) {
          try {
              setSavedDrafts(JSON.parse(draftsStr));
          } catch(e) {}
      }
  };

  const saveDraft = (isAutoSave = false) => {
      const now = new Date();
      const draftName = getFileNameBase(false, true) + ` (${now.toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})})`;
      const draftId = currentDraftId || `draft_${now.getTime()}`;
      
      const draftObj = {
          id: draftId,
          name: draftName,
          date: now.toISOString(),
          formData: formData,
          privateData: privateData,
          selectedOffice: selectedOffice,
          isManualLocation: isManualLocation
      };
      
      setSavedDrafts(prev => {
          let newDrafts = [...prev];
          const existingIndex = newDrafts.findIndex(d => d.id === draftId);
          if(existingIndex >= 0) {
              newDrafts[existingIndex] = draftObj;
          } else {
              newDrafts.unshift(draftObj);
          }
          localStorage.setItem('emlaknomi_drafts', JSON.stringify(newDrafts));
          return newDrafts;
      });
      
      setCurrentDraftId(draftId);
      
      if (isAutoSave) {
          setSaveStatus('Taslak kaydedildi.');
          setTimeout(() => setSaveStatus(''), 3000);
      } else {
          alert("İlanınız taslak olarak başarıyla kaydedildi!");
      }
  };

  const loadDraft = (draft) => {
      setFormData(draft.formData);
      setPrivateData(draft.privateData);
      setSelectedOffice(draft.selectedOffice);
      setIsManualLocation(draft.isManualLocation);
      setCurrentDraftId(draft.id);
      setAppState('editor');
  };

  const confirmDeleteDraft = () => {
      if(draftToDelete) {
          const newDrafts = savedDrafts.filter(d => d.id !== draftToDelete);
          setSavedDrafts(newDrafts);
          localStorage.setItem('emlaknomi_drafts', JSON.stringify(newDrafts));
          if(currentDraftId === draftToDelete) setCurrentDraftId(null);
          setDraftToDelete(null);
      }
  };

  const startNewProject = () => {
      setFormData({...INITIAL_FORM_DATA});
      setPrivateData({
        customerName: '', contactInfo: '', finalPrice: '', commission: '', propertyNo: '', notes: '', 
        date: new Date().toISOString().split('T')[0],
        deedStatusPrivate: '', doorCode: '', swapPrivate: '', openAddress: ''
      });
      setCurrentDraftId(null);
      setAppState('editor');
  };

  const formatNumber = (value) => { if (!value) return ''; return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, "."); };
  
  const handleInputChange = (e) => { 
      const { name, value } = e.target; 
      if (['price', 'kiraBedeli'].includes(name)) { 
          setFormData(prev => ({ ...prev, [name]: formatNumber(value) })); 
      } else if (name === 'adNumber') {
          setFormData(prev => {
              let newDesc = prev.description || "";
              if (newDesc) {
                  if (/> İlan No: .*/.test(newDesc)) {
                      newDesc = newDesc.replace(/> İlan No: .*/, `> İlan No: ${value}`);
                  } else if (/İLAN NO: .*/i.test(newDesc)) {
                      newDesc = newDesc.replace(/İLAN NO: .*/i, `İLAN NO: ${value}`);
                  }
                  
                  const lines = newDesc.split('\n');
                  if (lines.length > 0 && lines[0].startsWith("EMLAKNOMİ'DEN")) {
                      let titleLine = lines[0];
                      titleLine = titleLine.replace(/ - \d+$/i, ''); 
                      if (value && value.trim() !== '') {
                          titleLine += ` - ${value}`;
                      }
                      lines[0] = titleLine;
                      newDesc = lines.join('\n');
                  }
              }
              return { ...prev, [name]: value, description: newDesc };
          });
      } else { 
          setFormData(prev => ({ ...prev, [name]: value })); 
      } 
  };
  
  const handleInputBlur = (e) => { const { name, value } = e.target; if (['size', 'netSize', 'yolaTerk', 'yolaCephesi'].includes(name) && value && !value.includes('m²')) { setFormData(prev => ({ ...prev, [name]: `${value} m²` })); } };
  const handleConsultantChange = (e) => { const { name, value, type, checked } = e.target; setConsultant(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value })); };
  
  const handleProfilePhotoChange = (e) => { 
      if (e.target.files && e.target.files[0]) { 
          const file = e.target.files[0]; 
          const reader = new FileReader(); 
          reader.onloadend = () => { 
              const img = new Image();
              img.onload = () => {
                  const canvas = document.createElement('canvas');
                  canvas.width = img.width;
                  canvas.height = img.height;
                  const ctx = canvas.getContext('2d');
                  ctx.drawImage(img, 0, 0);
                  setConsultant(prev => ({ ...prev, photo: canvas.toDataURL('image/png') }));
              };
              img.src = reader.result;
          }; 
          reader.readAsDataURL(file); 
      } 
  };

  const handleOverlayPhotoChange = (e) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
              const img = new Image();
              img.onload = () => {
                  const canvas = document.createElement('canvas');
                  canvas.width = img.width;
                  canvas.height = img.height;
                  const ctx = canvas.getContext('2d');
                  ctx.drawImage(img, 0, 0);
                  const dataUrl = canvas.toDataURL('image/png');
                  setOverlayData(prev => {
                      const next = { ...prev, photo: dataUrl, show: true };
                      localStorage.setItem('emlaknomi_overlay_photo', dataUrl);
                      localStorage.setItem('emlaknomi_overlay_settings', JSON.stringify({ show: next.show, x: next.x, y: next.y, scale: next.scale }));
                      return next;
                  });
              };
              img.src = reader.result;
          };
          reader.readAsDataURL(file);
      }
  };

  const updateOverlayConfig = (updates) => {
      setOverlayData(prev => {
          const next = { ...prev, ...updates };
          localStorage.setItem('emlaknomi_overlay_settings', JSON.stringify({ show: next.show, x: next.x, y: next.y, scale: next.scale }));
          return next;
      });
  };
  
  const updateDesignConfig = (type, elementKey, updates) => {
      setDesignConfig(prev => {
          const next = {
              ...prev,
              [type]: {
                  ...prev[type],
                  [elementKey]: { ...prev[type][elementKey], ...updates }
              }
          };
          localStorage.setItem('emlaknomi_design_config', JSON.stringify(next));
          return next;
      });
  };

  const resetDesignConfig = (type) => {
      if (window.confirm("Bu tasarımdaki tüm boyutlandırma ve konum ayarlarını varsayılana döndürmek istediğinize emin misiniz?")) {
          setDesignConfig(prev => {
              const next = {
                  ...prev,
                  [type]: { ...DEFAULT_DESIGN_CONFIG[type] }
              };
              localStorage.setItem('emlaknomi_design_config', JSON.stringify(next));
              return next;
          });
      }
  };

  const handlePrivateInputChange = (e) => { const { name, value } = e.target; if (['finalPrice', 'commission'].includes(name)) { setPrivateData(prev => ({ ...prev, [name]: formatNumber(value) })); } else { setPrivateData(prev => ({ ...prev, [name]: value })); } };
  const handleMultiSelect = (field, value) => { const current = Array.isArray(formData[field]) ? formData[field] : []; const updated = current.includes(value) ? current.filter(i => i !== value) : [...current, value]; setFormData(prev => ({ ...prev, [field]: updated })); };
  
  const handleOfficeChange = (e) => {
    const officeKey = e.target.value; setSelectedOffice(officeKey); setIsManualLocation(false);
    setConsultant(prev => ({ ...prev, phone: availableBranches[officeKey].phone }));
    if (officeKey === 'eregli') setFormData(prev => ({...prev, city: 'Konya', district: 'Ereğli', neighborhood: 'Yunuslu'}));
    else if (officeKey === 'karaman') setFormData(prev => ({...prev, city: 'Karaman', district: 'Merkez', neighborhood: locationData['Karaman']['Merkez'][0]}));
    else if (officeKey === 'alanya') setFormData(prev => ({...prev, city: 'Antalya', district: 'Alanya', neighborhood: locationData['Antalya']['Alanya'][0]}));
    else if (officeKey === 'konya') setFormData(prev => ({...prev, city: 'Konya', district: 'Selçuklu', neighborhood: locationData['Konya']['Selçuklu'][0]}));
  };

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    if (detailedCities.includes(newCity)) {
        setIsManualLocation(false); const districts = Object.keys(locationData[newCity] || {}); const firstDistrict = districts[0] || ''; const neighborhoods = locationData[newCity]?.[firstDistrict] || [];
        setFormData(prev => ({ ...prev, city: newCity, district: firstDistrict, neighborhood: neighborhoods[0] || '' }));
    } else { setIsManualLocation(true); setFormData(prev => ({ ...prev, city: newCity, district: '', neighborhood: '' })); }
  };
  const handleDistrictChange = (e) => { const newDistrict = e.target.value; const neighborhoods = locationData[formData.city]?.[newDistrict] || []; setFormData(prev => ({ ...prev, district: newDistrict, neighborhood: neighborhoods[0] || '' })); };
  
  const handleImageUpload = (e) => { 
    if (e.target.files) { 
      Array.from(e.target.files).forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => {
              const img = new Image();
              img.onload = () => {
                  const canvas = document.createElement('canvas');
                  canvas.width = img.width;
                  canvas.height = img.height;
                  const ctx = canvas.getContext('2d');
                  ctx.drawImage(img, 0, 0);
                  
                  setFormData(prev => ({ ...prev, images: [...(prev.images || []), canvas.toDataURL('image/jpeg', 0.9)] }));
              };
              img.src = reader.result;
          };
          reader.readAsDataURL(file);
      });
    } 
  };
  
  const removeImage = (index, e) => {
    e.stopPropagation();
    const newImages = formData.images.filter((_, i) => i !== index);
    let newCoverIndex = formData.coverImageIndex;
    if (index === formData.coverImageIndex) newCoverIndex = 0;
    else if (index < formData.coverImageIndex) newCoverIndex--;
    setFormData(prev => ({ ...prev, images: newImages, coverImageIndex: newCoverIndex }));
  };

  const handleLogoChange = (e) => { 
      if (e.target.files && e.target.files[0]) { 
          const file = e.target.files[0]; 
          const reader = new FileReader(); 
          reader.onloadend = () => { 
              const img = new Image();
              img.onload = () => {
                  const canvas = document.createElement('canvas');
                  canvas.width = img.width;
                  canvas.height = img.height;
                  const ctx = canvas.getContext('2d');
                  ctx.drawImage(img, 0, 0);
                  const dataUrl = canvas.toDataURL('image/png');
                  setCustomLogo(dataUrl); 
                  setShowLogo(true); 
                  try { localStorage.setItem('emlaknomi_custom_logo', dataUrl); } catch (err) {} 
              };
              img.src = reader.result;
          }; 
          reader.readAsDataURL(file); 
      } 
  };
  
  const getFloorDisplay = () => { const { floor, totalFloors } = formData; if (!floor) return null; if (isNaN(floor)) return floor; const fl = parseInt(floor); const tf = parseInt(totalFloors); if (!isNaN(tf)) { if (fl === tf) return "Son Kat"; if (fl > 0 && fl < tf) return "Ara Kat"; } return `${floor}. Kat`; };
  const getSubTypeLabel = () => { if (formData.konutTipi) return formData.konutTipi; if (formData.arsaTipi) return formData.arsaTipi; if (formData.gayrimenkulTipi) return formData.gayrimenkulTipi; if (formData.bahceTipi) return formData.bahceTipi; if (formData.tarlaTipi && formData.tarlaTipi.length > 0) return formData.tarlaTipi[0]; const split = formData.type.split(' '); if (split.length > 1) return split.slice(1).join(' '); return formData.type; };
  const getFullTypeLabel = () => { 
      const operation = formData.type.split(' ')[0]; 
      const subType = getSubTypeLabel(); 
      const baseStr = `${operation} ${subType}`.trim();
      return formData.isOpportunity ? `FIRSAT ${baseStr}` : baseStr;
  };
  const getGeneratedTitle = () => { 
      let base = formData.customTitle;
      if (!base) {
          let parts = []; 
          if (formData.neighborhood) parts.push(`${formData.neighborhood}'da`); 
          if (formData.rooms) parts.push(formData.rooms); 
          if (formData.type.includes('Daire') || formData.konutTipi) { 
              const fd = getFloorDisplay(); if (fd) parts.push(fd); 
          } 
          parts.push(getFullTypeLabel()); 
          base = parts.join(' ');
      }
      if (formData.adNumber && formData.adNumber.trim() !== '') {
          base += ` - ${formData.adNumber}`;
      }
      return base; 
  };

  const getFileNameBase = (includeConsultant = true, isDraft = false) => {
    let detail = "Ilan";
    if (formData.type.includes("Daire")) detail = formData.rooms || "Daire";
    else if (formData.type.includes("Arsa")) detail = "Arsa";
    else if (formData.type.includes("Ticari") || formData.type === "Devren Satılık") detail = formData.gayrimenkulTipi || "Dükkan";
    else if (formData.type.includes("Tarla")) detail = (formData.tarlaTipi && formData.tarlaTipi.length > 0) ? formData.tarlaTipi[0] : "Tarla";
    else if (formData.type.includes("Bahçe")) detail = formData.bahceTipi || "Bahçe";
    else detail = getSubTypeLabel() || formData.type;
    
    const safeAdNumber = formData.adNumber ? formData.adNumber.trim() : "00000";
    let safeNeighborhood = (formData.neighborhood || "Genel").trim();
    const formattedPrice = formData.price ? `${formData.price} TL` : "0 TL";
    
    let fileName = "";
    if (includeConsultant && !isDraft) {
        const safeConsultantName = consultant.name.trim();
        fileName = `${safeAdNumber} - ${safeConsultantName} - ${safeNeighborhood} - ${detail} - ${formattedPrice}`;
    } else {
        fileName = `${safeAdNumber} - ${safeNeighborhood} - ${detail} - ${formattedPrice}`;
    }
    
    if(isDraft) fileName = `TASLAK - ${fileName}`;
    
    const illegalCharsRegex = new RegExp('[\\\\/:*?"<>|]', 'g');
    return fileName.replace(illegalCharsRegex, '');
  };

  const generateDescription = () => {
    const office = availableBranches[selectedOffice]; 
    const generatedTitle = getGeneratedTitle();
    const addLine = (label, value, suffix = '') => { if (!value || value === '' || (Array.isArray(value) && value.length === 0)) return ''; const valStr = Array.isArray(value) ? value.join(', ') : value; return `> ${label}: ${valStr}${suffix}\n`; };
    
    let detailsText = "";
    detailsText += `\n> İlan No: ${formData.adNumber || ''}\n\n`;

    if (formData.type.includes("Daire")) {
        detailsText += addLine('Konut Tipi', formData.konutTipi); detailsText += addLine('Oda Sayısı', formData.rooms); detailsText += addLine('Brüt m²', formData.size); detailsText += addLine('Net m²', formData.netSize); detailsText += addLine('Bulunduğu Kat', formData.floor); detailsText += addLine('Binadaki Kat', formData.totalFloors); detailsText += addLine('Kattaki Daire', formData.flatCountOnFloor); detailsText += addLine('Kat Tipi', formData.katTipi); detailsText += addLine('Bina Yaşı', formData.age); detailsText += addLine('Banyo Sayısı', formData.banyoSayisi); detailsText += addLine('Ebeveyn Banyo', formData.masterBath); detailsText += addLine('Tuvalet Sayısı', formData.wcCount); detailsText += addLine('Tuvalet Tipi', formData.tuvaletTipi); detailsText += addLine('Isıtma Tipi', formData.heating); detailsText += addLine('Isı Yalıtım', formData.insulation); detailsText += addLine('Balkon', formData.balconyCount); detailsText += addLine('Cam Balkon', formData.glassBalcony); detailsText += addLine('Kızartma Mutfağı', formData.kizartmaMutfagi); detailsText += addLine('Giyinme Odası', formData.giyinmeOdasi); detailsText += addLine('Çamaşır Odası', formData.camasirOdasi); detailsText += addLine('Asansör', formData.elevator); detailsText += addLine('İç Kapılar', formData.icKapilar); detailsText += addLine('Pencereler', formData.pencereler); detailsText += addLine('Asma Tavan', formData.asmaTavan); detailsText += addLine('Duşakabin', formData.dusakabin); detailsText += addLine('Vestiyer', formData.vestiyer); detailsText += addLine('Çatı Kaplama', formData.catiKaplama); detailsText += addLine('Zeminler', formData.zeminler); detailsText += addLine('Mutfak Dolabı', formData.mutfakDolabi); detailsText += addLine('Çelik Kapı', formData.celikKapi); detailsText += addLine('Kiler', formData.pantry); detailsText += addLine('Garaj', formData.garage); detailsText += addLine('Bahçe', formData.bahce); detailsText += addLine('Eşyalı mı', formData.esyali); detailsText += addLine('Otopark', formData.parking); detailsText += addLine('Panjur', formData.panjur); detailsText += addLine('Ankastre', formData.ankastre); detailsText += addLine('Site İçi', formData.siteIci); detailsText += addLine('Oyun Parkı', formData.oyunParki); detailsText += addLine('Kamelya', formData.kamelya); detailsText += addLine('Güvenlik', formData.guvenlik); detailsText += addLine('Aktivite', formData.aktivite); detailsText += addLine('Muhit', formData.mevki); detailsText += addLine('Aidat', formData.aidat); detailsText += addLine('Tapu Durumu', formData.deedStatus); detailsText += addLine('İskan/Oturum', formData.iskan); detailsText += addLine('Kullanım Durumu', formData.usageStatus); detailsText += addLine('Hisse Durumu', formData.hisseDurumu); detailsText += addLine('Kira Bedeli', formData.kiraBedeli);
    } else if (formData.type === "Satılık Arsa") { 
        detailsText += addLine('Arsa Tipi', formData.arsaTipi); detailsText += addLine('İmar Durumu', formData.imarDurumu); detailsText += addLine('Ada/Parsel', formData.adaParsel); detailsText += addLine('Metresi', formData.size); detailsText += addLine('T.A.K.S.', formData.taks); detailsText += addLine('K.A.K.S.', formData.kaks); detailsText += addLine('Nizam', formData.nizam); detailsText += addLine('Alt Yapı', formData.altYapi);
    } else if (formData.type === "Satılık Tarla" || formData.type === "Satılık Bahçe") {
        detailsText += addLine('Tarla Tipi', formData.tarlaTipi); detailsText += addLine('Bahçe Tipi', formData.bahceTipi); detailsText += addLine('Ada/Parsel', formData.adaParsel); detailsText += addLine('Metresi', formData.size); detailsText += addLine('Su Durumu', formData.suDurumu); detailsText += addLine('Elektrik Durumu', formData.elektrikDurumu); detailsText += addLine('Yol Durumu', formData.yolDurumu); detailsText += addLine('Yola Cephesi', formData.yolaCephesi); detailsText += addLine('Tel Örgü', formData.telOrgu); detailsText += addLine('Ev Durumu', formData.evDurumu); detailsText += addLine('Havuz Durumu', formData.havuzDurumu); detailsText += addLine('Depo/Garaj', formData.depoGaraj); detailsText += addLine('Teçhizat', formData.techizat); detailsText += addLine('Eğim', formData.egim); detailsText += addLine('Meyve Cinsi', formData.meyveCinsi); detailsText += addLine('Ağaç Sayısı', formData.agacSayisi); detailsText += addLine('Ağaç Yaşı', formData.agacYasi); detailsText += addLine('Hisse Durumu', formData.hisseDurumu);
    } else if (formData.type.includes("Ticari") || formData.type === "Devren Satılık") { 
        detailsText += addLine('Gayrimenkul Tipi', formData.gayrimenkulTipi); detailsText += addLine('Metresi', formData.size); detailsText += addLine('Kat Sayısı', formData.katSayisiTicari); 
    }

    detailsText += addLine('Cephe', formData.facade);
    if (formData.type !== "Devren Satılık" && !formData.type.includes('Kiralık')) { detailsText += addLine('Krediye Uygun', formData.creditSuitable); detailsText += addLine('Takas', formData.swapAvailable); }
    if (['Bireysel Garaj', 'Ortak Kullanım', 'Var'].includes(formData.garage)) { const garageText = formData.garage === "Var" ? "Otopark İmkanı" : formData.garage; detailsText += `> ÖZELLİK: ${garageText} Mevcuttur\n`; }
    
    let featuresText = ""; Object.keys(featureCategories).forEach(cat => { const selectedInCat = featureCategories[cat].filter(f => formData.features.includes(f)); if (selectedInCat.length > 0) { featuresText += `\n\n> ${cat.toUpperCase()}:\n` + selectedInCat.join(', '); } });
    
    const safeAuthNo = office.authNo ? office.authNo : '7000161';
    
    let digerOzelliklerText = "";
    if (formData.digerOzellikler && formData.digerOzellikler.trim() !== '') {
        digerOzelliklerText = `DİĞER ÖZELLİKLER:\n${formData.digerOzellikler}\n\n`;
    }
    
    const desc = `EMLAKNOMİ'DEN ${generatedTitle.toUpperCase()}\n\n` + `Konum: ${formData.city} / ${formData.district} / ${formData.neighborhood}\n\n` + `GAYRİMENKUL DETAYLARI\n` + detailsText + `${featuresText}\n\n\n` + digerOzelliklerText + `FİYAT: ${formData.price} ${formData.currency}\n\n` + `--------------------------------\n` + `${consultant.showInfo ? `Gayrimenkul Uzmanı - ${consultant.name}\nİletişim: ${consultant.phone}\n` : ''}` + `www.ozcanaktas.com\n\n` + `Ofis Adres: ${office.address}\n\n` + `Taşınmaz Ticareti Yetki Belge No: ${safeAuthNo}\n` + `www.emlaknomi.com\n\n` + `\nŞubeler: Karaman - Konya - Ereğli - Eskişehir - Alanya - Balıkesir - Kıbrıs`;
    setFormData(prev => ({ ...prev, description: desc }));
  };

  const renderTransformControls = (type, elementKey, label) => {
      const config = designConfig[type]?.[elementKey];
      if (!config) return null;
      
      return (
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 mt-3">
               <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                   <span className="text-sm font-bold text-orange-400">{label} Ayarları</span>
                   <label className="flex items-center text-xs text-slate-300 cursor-pointer">
                       <input type="checkbox" checked={config.show} onChange={(e) => updateDesignConfig(type, elementKey, {show: e.target.checked})} className="mr-2 w-4 h-4"/>
                       Göster
                   </label>
               </div>
               {config.show && (
                   <div className="grid grid-cols-2 gap-6">
                       <div>
                           <span className="block text-xs font-bold text-slate-400 mb-2 text-center">KONUM (X/Y)</span>
                           <div className="grid grid-cols-3 gap-1 w-24 mx-auto">
                               <div/>
                               <button onClick={() => updateDesignConfig(type, elementKey, {y: config.y - 5})} className="bg-slate-700 p-2 rounded hover:bg-slate-600 text-white flex justify-center"><ChevronUp size={16}/></button>
                               <div/>
                               <button onClick={() => updateDesignConfig(type, elementKey, {x: config.x - 5})} className="bg-slate-700 p-2 rounded hover:bg-slate-600 text-white flex justify-center"><div className="rotate-90"><ChevronDown size={16}/></div></button>
                               <button onClick={() => updateDesignConfig(type, elementKey, {y: config.y + 5})} className="bg-slate-700 p-2 rounded hover:bg-slate-600 text-white flex justify-center"><ChevronDown size={16}/></button>
                               <button onClick={() => updateDesignConfig(type, elementKey, {x: config.x + 5})} className="bg-slate-700 p-2 rounded hover:bg-slate-600 text-white flex justify-center"><div className="-rotate-90"><ChevronDown size={16}/></div></button>
                           </div>
                       </div>
                       <div className="flex flex-col justify-center">
                           <span className="block text-xs font-bold text-slate-400 mb-2 text-center">BOYUT (ÖLÇEK)</span>
                           <div className="flex gap-2">
                               <button onClick={() => updateDesignConfig(type, elementKey, {scale: Math.max(0.1, config.scale - 0.05)})} className="bg-slate-700 text-white flex-1 py-3 text-lg rounded font-bold hover:bg-slate-600">-</button>
                               <button onClick={() => updateDesignConfig(type, elementKey, {scale: config.scale + 0.05})} className="bg-slate-700 text-white flex-1 py-3 text-lg rounded font-bold hover:bg-slate-600">+</button>
                           </div>
                       </div>
                   </div>
               )}
          </div>
      );
  };

  const renderDynamicFields = () => {
      const t = formData.type;
      const renderKonutFields = () => (
        <>
            <SelectField label="Konut Tipi" name="konutTipi" value={formData.konutTipi} onChange={handleInputChange} options={options.konutTipi} highlight />
            <SelectField label="Oda Sayısı" name="rooms" value={formData.rooms} onChange={handleInputChange} options={options.rooms} highlight />
            <InputField label="Brüt m²" name="size" value={formData.size} onChange={handleInputChange} onBlur={handleInputBlur} highlight />
            <InputField label="Net m²" name="netSize" value={formData.netSize} onChange={handleInputChange} onBlur={handleInputBlur} highlight />
            <SelectField label="Bulunduğu Kat" name="floor" value={formData.floor} onChange={handleInputChange} options={options.floors} highlight />
            <SelectField label="Kat Sayısı" name="totalFloors" value={formData.totalFloors} onChange={handleInputChange} options={options.totalFloors} highlight />
            <SelectField label="Kattaki Daire" name="flatCountOnFloor" value={formData.flatCountOnFloor} onChange={handleInputChange} options={options.flatCount} highlight />
            <SelectField label="Kat Tipi" name="katTipi" value={formData.katTipi} onChange={handleInputChange} options={options.katTipi} highlight />
            <SelectField label="Bina Yaşı" name="age" value={formData.age} onChange={handleInputChange} options={options.age} highlight />
            <SelectField label="Asansör" name="elevator" value={formData.elevator} onChange={handleInputChange} options={options.elevator} highlight />
            <MultiSelectField label="Cephe" field="facade" value={formData.facade} onChange={handleMultiSelect} options={options.facade} themeColor={themeColor} highlight />
            <MultiSelectField label="Isıtma Tipi" field="heating" value={formData.heating} onChange={handleMultiSelect} options={options.heating} themeColor={themeColor} highlight />
            
            {/* FIRSAT İLANI SEÇENEĞİ */}
            <div className="col-span-2 md:col-span-3 bg-orange-100/60 p-3 rounded-xl border border-orange-200 shadow-sm flex items-center cursor-pointer mt-2 mb-3 transition-colors hover:bg-orange-200/50" onClick={() => setFormData(prev => ({...prev, isOpportunity: !prev.isOpportunity}))}>
                <div className={`w-5 h-5 flex items-center justify-center border-[2px] rounded-md mr-3 transition-all ${formData.isOpportunity ? 'bg-orange-500 border-orange-500' : 'bg-white border-slate-400'}`}>
                    {formData.isOpportunity && <CheckCircle size={14} className="text-white" />}
                </div>
                <span className="text-sm font-black text-orange-700 uppercase select-none tracking-widest">Bu İlanı Fırsat Olarak İşaretle</span>
            </div>

            <SelectField label="Banyo Sayısı" name="banyoSayisi" value={formData.banyoSayisi} onChange={handleInputChange} options={options.banyoSayisi} />
            <SelectField label="Ebeveyn Banyo" name="masterBath" value={formData.masterBath} onChange={handleInputChange} options={["Var", "Yok"]} />
            <SelectField label="Tuvalet Sayısı" name="wcCount" value={formData.wcCount} onChange={handleInputChange} options={options.wcCount} />
            <MultiSelectField label="Tuvalet Tipi" field="tuvaletTipi" value={formData.tuvaletTipi} onChange={handleMultiSelect} options={options.tuvaletTipi} themeColor={themeColor} />
            <SelectField label="Isı Yalıtım" name="insulation" value={formData.insulation} onChange={handleInputChange} options={options.insulation} />
            <SelectField label="Balkon Sayısı" name="balconyCount" value={formData.balconyCount} onChange={handleInputChange} options={options.balcony} />
            <SelectField label="Cam Balkon" name="glassBalcony" value={formData.glassBalcony} onChange={handleInputChange} options={options.glassBalcony} />
            <SelectField label="Kızartma Mutfağı" name="kizartmaMutfagi" value={formData.kizartmaMutfagi} onChange={handleInputChange} options={["Var", "Yok"]} />
            <SelectField label="Giyinme Odası" name="giyinmeOdasi" value={formData.giyinmeOdasi} onChange={handleInputChange} options={["Var", "Yok"]} />
            <SelectField label="Çamaşır Odası" name="camasirOdasi" value={formData.camasirOdasi} onChange={handleInputChange} options={["Var", "Yok"]} />
            <SelectField label="İç Kapılar" name="icKapilar" value={formData.icKapilar} onChange={handleInputChange} options={options.icKapilar} />
            <SelectField label="Pencereler" name="pencereler" value={formData.pencereler} onChange={handleInputChange} options={options.pencereler} />
            <SelectField label="Asma Tavan" name="asmaTavan" value={formData.asmaTavan} onChange={handleInputChange} options={["Var", "Yok"]} />
            <SelectField label="Duşakabin" name="dusakabin" value={formData.dusakabin} onChange={handleInputChange} options={["Var", "Yok"]} />
            <SelectField label="Vestiyer" name="vestiyer" value={formData.vestiyer} onChange={handleInputChange} options={["Var", "Yok"]} />
            <SelectField label="Çatı Kaplama" name="catiKaplama" value={formData.catiKaplama} onChange={handleInputChange} options={["Var", "Yok"]} />
            <SelectField label="Zeminler" name="zeminler" value={formData.zeminler} onChange={handleInputChange} options={options.zeminler} />
            <SelectField label="Mutfak Dolabı" name="mutfakDolabi" value={formData.mutfakDolabi} onChange={handleInputChange} options={options.mutfakDolabi} />
            <SelectField label="Çelik Kapı" name="celikKapi" value={formData.celikKapi} onChange={handleInputChange} options={["Var", "Yok"]} />
            <MultiSelectField label="Kiler" field="pantry" value={formData.pantry} onChange={handleMultiSelect} options={options.kiler} themeColor={themeColor} />
            <SelectField label="Garaj" name="garage" value={formData.garage} onChange={handleInputChange} options={options.garage} />
            <MultiSelectField label="Bahçe" field="bahce" value={formData.bahce} onChange={handleMultiSelect} options={options.bahce} themeColor={themeColor} />
            <SelectField label="Eşyalı mı" name="esyali" value={formData.esyali} onChange={handleInputChange} options={["Evet", "Hayır"]} />
            <SelectField label="Otopark" name="parking" value={formData.parking} onChange={handleInputChange} options={options.parking} />
            <MultiSelectField label="Panjur" field="panjur" value={formData.panjur} onChange={handleMultiSelect} options={options.panjur} themeColor={themeColor} />
            <SelectField label="Ankastre" name="ankastre" value={formData.ankastre} onChange={handleInputChange} options={["Var", "Yok"]} />
            <SelectField label="Site İçi mi" name="siteIci" value={formData.siteIci} onChange={handleInputChange} options={["Evet", "Hayır"]} />
            <SelectField label="Oyun Parkı" name="oyunParki" value={formData.oyunParki} onChange={handleInputChange} options={["Var", "Yok"]} />
            <SelectField label="Kamelya" name="kamelya" value={formData.kamelya} onChange={handleInputChange} options={["Var", "Yok"]} />
            <MultiSelectField label="Güvenlik" field="guvenlik" value={formData.guvenlik} onChange={handleMultiSelect} options={options.guvenlik} themeColor={themeColor} />
            <MultiSelectField label="Aktivite" field="aktivite" value={formData.aktivite} onChange={handleMultiSelect} options={options.aktivite} themeColor={themeColor} />
            <MultiSelectField label="Muhit" field="mevki" value={formData.mevki} onChange={handleMultiSelect} options={options.mevki} themeColor={themeColor} />
            <InputField label="Aidat" name="aidat" value={formData.aidat} onChange={handleInputChange} placeholder="TL" />
            <SelectField label="Tapu Durumu" name="deedStatus" value={formData.deedStatus} onChange={handleInputChange} options={options.deed} />
            <SelectField label="İskan/Oturum" name="iskan" value={formData.iskan} onChange={handleInputChange} options={options.iskan} />
            <SelectField label="Kullanım Durumu" name="usageStatus" value={formData.usageStatus} onChange={handleInputChange} options={options.usage} />
            <SelectField label="Hisse Durumu" name="hisseDurumu" value={formData.hisseDurumu} onChange={handleInputChange} options={options.hisse} />
        </>
      );
      if (t === "Satılık Daire" || t === "Kiralık Daire") {
          return (
              <>
                {renderKonutFields()}
                {t === "Satılık Daire" && (
                    <>
                        <InputField label="Kira Bedeli" name="kiraBedeli" value={formData.kiraBedeli} onChange={handleInputChange} />
                        <SelectField label="Takas" name="swapAvailable" value={formData.swapAvailable} onChange={handleInputChange} options={options.swap} />
                        <SelectField label="Krediye Uygun" name="creditSuitable" value={formData.creditSuitable} onChange={handleInputChange} options={options.credit} />
                    </>
                )}
              </>
          );
      }
      if (t === "Satılık Arsa") {
          return (
              <>
                <SelectField label="Arsa Tipi" name="arsaTipi" value={formData.arsaTipi} onChange={handleInputChange} options={options.arsaTipi} />
                <SelectField label="İmar Durumu" name="imarDurumu" value={formData.imarDurumu} onChange={handleInputChange} options={options.imarDurumu} />
                <InputField label="Ada/Parsel" name="adaParsel" value={formData.adaParsel} onChange={handleInputChange} />
                <InputField label="Metresi (m²)" name="size" value={formData.size} onChange={handleInputChange} onBlur={handleInputBlur} />
                <InputField label="T.A.K.S." name="taks" value={formData.taks} onChange={handleInputChange} />
                <InputField label="K.A.K.S." name="kaks" value={formData.kaks} onChange={handleInputChange} />
                <InputField label="Kat Adedi" name="katAdedi" value={formData.katAdedi} onChange={handleInputChange} />
                <InputField label="Yükseklik" name="yukseklik" value={formData.yukseklik} onChange={handleInputChange} />
                <InputField label="Yola Terk (m²)" name="yolaTerk" value={formData.yolaTerk} onChange={handleInputChange} onBlur={handleInputBlur} />
                <SelectField label="Nizam" name="nizam" value={formData.nizam} onChange={handleInputChange} options={options.nizam} />
                <InputField label="Yola Cephesi" name="yola Cephesi" value={formData.yolaCephesi} onChange={handleInputChange} onBlur={handleInputBlur} />
                <MultiSelectField label="Alt Yapı" field="altYapi" value={formData.altYapi} onChange={handleMultiSelect} options={options.altYapi} themeColor={themeColor} />
                <SelectField label="Kat Karşılığı" name="katKarsiligi" value={formData.katKarsiligi} onChange={handleInputChange} options={["Evet", "Hayır", "Bilinmiyor"]} />
                <SelectField label="Takas" name="swapAvailable" value={formData.swapAvailable} onChange={handleInputChange} options={options.swap} />
                <SelectField label="Kredi" name="creditSuitable" value={formData.creditSuitable} onChange={handleInputChange} options={options.credit} />
                <SelectField label="Hisse Durumu" name="hisseDurumu" value={formData.hisseDurumu} onChange={handleInputChange} options={options.hisse} />
              </>
          );
      }
      if (t === "Satılık Tarla") {
          return (
              <>
                <MultiSelectField label="Tarla Tipi" field="tarlaTipi" value={formData.tarlaTipi} onChange={handleMultiSelect} options={options.tarlaTipi} themeColor={themeColor} />
                <InputField label="Ada/Parsel" name="adaParsel" value={formData.adaParsel} onChange={handleInputChange} />
                <InputField label="Metresi (m²)" name="size" value={formData.size} onChange={handleInputChange} onBlur={handleInputBlur} />
                <MultiSelectField label="Su Durumu" field="suDurumu" value={formData.suDurumu} onChange={handleMultiSelect} options={options.suDurumu} themeColor={themeColor} />
                <SelectField label="Elektrik Durumu" name="elektrikDurumu" value={formData.elektrikDurumu} onChange={handleInputChange} options={options.elektrikDurumu} />
                <MultiSelectField label="Yol Durumu" field="yolDurumu" value={formData.yolDurumu} onChange={handleMultiSelect} options={options.yolDurumu} themeColor={themeColor} />
                <InputField label="Yola Cephe (m²)" name="yolaCephesi" value={formData.yolaCephesi} onChange={handleInputChange} onBlur={handleInputBlur} />
                <SelectField label="Tel Örgü" name="telOrgu" value={formData.telOrgu} onChange={handleInputChange} options={["Var", "Yok"]} />
                <MultiSelectField label="Ev" field="evDurumu" value={formData.evDurumu} onChange={handleMultiSelect} options={options.evDurumu} themeColor={themeColor} />
                <MultiSelectField label="Havuz" field="havuzDurumu" value={formData.havuzDurumu} onChange={handleMultiSelect} options={options.havuzDurumu} themeColor={themeColor} />
                <SelectField label="Depo/Garaj" name="depoGaraj" value={formData.depoGaraj} onChange={handleInputChange} options={["Var", "Yok"]} />
                <InputField label="Teçhizat/Aletler" name="techizat" value={formData.techizat} onChange={handleInputChange} />
                <InputField label="Eğim (Derece)" name="egim" value={formData.egim} onChange={handleInputChange} />
                <SelectField label="Takas" name="swapAvailable" value={formData.swapAvailable} onChange={handleInputChange} options={options.swap} />
                <SelectField label="Kredi" name="creditSuitable" value={formData.creditSuitable} onChange={handleInputChange} options={options.credit} />
                <SelectField label="Hisse Durumu" name="hisseDurumu" value={formData.hisseDurumu} onChange={handleInputChange} options={options.hisse} />
              </>
          );
      }
      if (t === "Satılık Bahçe") {
          return (
              <>
                <SelectField label="Bahçe Tipi" name="bahceTipi" value={formData.bahceTipi} onChange={handleInputChange} options={options.bahceTipi} />
                <InputField label="Ada/Parsel" name="adaParsel" value={formData.adaParsel} onChange={handleInputChange} />
                <InputField label="Metresi (m²)" name="size" value={formData.size} onChange={handleInputChange} onBlur={handleInputBlur} />
                <InputField label="Meyve Cinsi" name="meyveCinsi" value={formData.meyveCinsi} onChange={handleInputChange} />
                <InputField label="Ağaç Sayısı" name="agacSayisi" value={formData.agacSayisi} onChange={handleInputChange} />
                <InputField label="Ağaç Yaşı" name="agacYasi" value={formData.agacYasi} onChange={handleInputChange} />
                <MultiSelectField label="Su Durumu" field="suDurumu" value={formData.suDurumu} onChange={handleMultiSelect} options={options.suDurumu} themeColor={themeColor} />
                <SelectField label="Elektrik" name="elektrikDurumu" value={formData.elektrikDurumu} onChange={handleInputChange} options={options.elektrikDurumu} />
                <MultiSelectField label="Yol" field="yolDurumu" value={formData.yolDurumu} onChange={handleMultiSelect} options={options.yolDurumu} themeColor={themeColor} />
                <InputField label="Yola Cephe" name="yolaCephesi" value={formData.yolaCephesi} onChange={handleInputChange} onBlur={handleInputBlur} />
                <SelectField label="Tel Örgü" name="telOrgu" value={formData.telOrgu} onChange={handleInputChange} options={["Var", "Yok"]} />
                <MultiSelectField label="Ev" field="evDurumu" value={formData.evDurumu} onChange={handleMultiSelect} options={options.evDurumu} themeColor={themeColor} />
                <MultiSelectField label="Havuz" field="havuzDurumu" value={formData.havuzDurumu} onChange={handleMultiSelect} options={options.havuzDurumu} themeColor={themeColor} />
                <SelectField label="Takas" name="swapAvailable" value={formData.swapAvailable} onChange={handleInputChange} options={options.swap} />
                <SelectField label="Kredi" name="creditSuitable" value={formData.creditSuitable} onChange={handleInputChange} options={options.credit} />
                <SelectField label="Hisse Durumu" name="hisseDurumu" value={formData.hisseDurumu} onChange={handleInputChange} options={options.hisse} />
              </>
          );
      }
      if (t === "Satılık Ticari" || t === "Devren Satılık" || t === "Kiralık Ticari") {
          return (
              <>
                <SelectField label="Gayrimenkul Tipi" name="gayrimenkulTipi" value={formData.gayrimenkulTipi} onChange={handleInputChange} options={options.ticariTipi} />
                <InputField label="Metresi (m²)" name="size" value={formData.size} onChange={handleInputChange} onBlur={handleInputBlur} />
                <MultiSelectField label="Kat Sayısı" field="katSayisiTicari" value={formData.katSayisiTicari} onChange={handleMultiSelect} options={options.katSayisiTicari} themeColor={themeColor} />
                <InputField label="Ön Cephe (m)" name="onCepheUzunluk" value={formData.onCepheUzunluk} onChange={handleInputChange} />
                <SelectField label="Bina Yaşı" name="age" value={formData.age} onChange={handleInputChange} options={options.age} />
                <MultiSelectField label="Cephe" field="facade" value={formData.facade} onChange={handleMultiSelect} options={options.facade} themeColor={themeColor} />
                <InputField label="Kira Bedeli" name="kiraBedeli" value={formData.kiraBedeli} onChange={handleInputChange} />
                <MultiSelectField label="Alt Yapı" field="altYapi" value={formData.altYapi} onChange={handleMultiSelect} options={options.altYapi} themeColor={themeColor} />
                <MultiSelectField label="Mevki" field="mevki" value={formData.mevki} onChange={handleMultiSelect} options={options.mevki} themeColor={themeColor} />
                <SelectField label="Takas" name="swapAvailable" value={formData.swapAvailable} onChange={handleInputChange} options={options.swap} />
                <SelectField label="Kredi" name="creditSuitable" value={formData.creditSuitable} onChange={handleInputChange} options={options.credit} />
                <SelectField label="Hisse Durumu" name="hisseDurumu" value={formData.hisseDurumu} onChange={handleInputChange} options={options.hisse} />
              </>
          );
      }
      return null;
  };

  const SocialDesign = ({ isCapture = false, designType = 'consultant', overlayData = {show: false}, designConfig }) => {
      const renderImages = () => {
          const imgs = formData.images || [];
          const count = imgs.length;
          const defaultImg = placeholderImage;
          if (designMode === 'single' || count === 0) {
              return <img src={imgs[formData.coverImageIndex] || defaultImg} className="w-full h-full object-cover" crossOrigin="anonymous"/>;
          }
          if (designMode === 'double') {
              return (
                  <div className="grid grid-cols-2 h-full w-full">
                      <div className="border-r-4 border-white h-full overflow-hidden"><img src={imgs[0] || defaultImg} className="w-full h-full object-cover" crossOrigin="anonymous"/></div>
                      <div className="h-full overflow-hidden"><img src={imgs[1] || defaultImg} className="w-full h-full object-cover" crossOrigin="anonymous"/></div>
                  </div>
              );
          }
          if (designMode === 'triple') {
              return (
                  <div className="grid grid-cols-2 h-full w-full">
                      <div className="border-r-4 border-white h-full overflow-hidden"><img src={imgs[0] || defaultImg} className="w-full h-full object-cover" crossOrigin="anonymous"/></div>
                      <div className="grid grid-rows-2 h-full">
                          <div className="border-b-4 border-white h-full overflow-hidden"><img src={imgs[1] || defaultImg} className="w-full h-full object-cover" crossOrigin="anonymous"/></div>
                          <div className="h-full overflow-hidden"><img src={imgs[2] || defaultImg} className="w-full h-full object-cover" crossOrigin="anonymous"/></div>
                      </div>
                  </div>
              );
          }
          if (designMode === 'quad') {
              return (
                  <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
                      <div className="border-r-4 border-b-4 border-white h-full overflow-hidden"><img src={imgs[0] || defaultImg} className="w-full h-full object-cover" crossOrigin="anonymous"/></div>
                      <div className="border-b-4 border-white h-full overflow-hidden"><img src={imgs[1] || defaultImg} className="w-full h-full object-cover" crossOrigin="anonymous"/></div>
                      <div className="border-r-4 border-white h-full overflow-hidden"><img src={imgs[2] || defaultImg} className="w-full h-full object-cover" crossOrigin="anonymous"/></div>
                      <div className="h-full overflow-hidden"><img src={imgs[3] || defaultImg} className="w-full h-full object-cover" crossOrigin="anonymous"/></div>
                  </div>
              );
          }
          return null;
      };

      const activeFeatures = [
          { icon: Home, label: 'Oda', value: formData.rooms },
          { icon: Layout, label: 'Metre', value: formData.size },
          { icon: Building, label: 'Kat', value: getFloorDisplay() },
          { icon: Compass, label: 'Cephe', value: formData.facade && formData.facade.length > 0 ? (Array.isArray(formData.facade) ? formData.facade[0] : formData.facade) : null },
      ];
      
      if (formData.age && formData.age !== '') {
          activeFeatures.push({ icon: Calendar, label: 'Yaş', value: formData.age });
      }
      if (formData.heating && formData.heating.length > 0) {
          activeFeatures.push({ icon: Flame, label: 'Isıtma', value: Array.isArray(formData.heating) ? formData.heating[0] : formData.heating });
      }
      if (formData.garage && formData.garage !== 'Yok' && formData.garage !== '') {
          activeFeatures.push({ icon: Car, label: 'Garaj', value: formData.garage === 'Bireysel Garaj' || formData.garage === 'Ortak Kullanım' || formData.garage === 'Var' ? 'Var' : formData.garage });
      }
      if (formData.elevator && formData.elevator !== 'Yok' && formData.elevator !== '') {
          activeFeatures.push({ icon: ArrowUpDown, label: 'Asansör', value: formData.elevator === 'Var' || formData.elevator === 'Çift Asansör' ? 'Var' : formData.elevator });
      }
      
      const displayFeatures = activeFeatures.filter(f => f.value && f.value !== '-' && f.value !== '');
      const limitedFeatures = displayFeatures.slice(0, 10); 
      const isLargeIcons = limitedFeatures.length <= 5;

      const isConsultant = designType === 'consultant';
      const configGroup = designConfig[designType] || DEFAULT_DESIGN_CONFIG[designType];
      
      const getStyle = (elementKey, extra = '', transformOrigin = 'center') => {
          const conf = configGroup[elementKey];
          if (!conf) return {};
          if (!conf.show) return { display: 'none' };
          return {
              transform: `translate(${conf.x}px, ${conf.y}px) scale(${conf.scale}) ${extra}`,
              transformOrigin: transformOrigin,
              display: conf.show ? '' : 'none'
          };
      };

      return (
        <div className="w-[1080px] h-[1080px] bg-slate-100 relative flex-shrink-0 font-sans text-left overflow-hidden">
            <div className="absolute inset-0 z-0">
                {renderImages()}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30 pointer-events-none"></div>
            </div>

            <div className="absolute top-12 left-0 flex flex-col items-start gap-1.5 z-20">
                <div className="text-white pl-8 pr-6 py-2 text-xl font-black shadow-lg rounded-r-2xl tracking-tight" style={{backgroundColor: themeColor}}>
                    {getFullTypeLabel().toLocaleUpperCase('tr-TR')}
                </div>
                <div className="bg-white text-slate-900 px-5 py-1.5 text-sm font-bold shadow-xl rounded-r-xl border-l-[5px] tracking-widest ml-1" style={{borderColor: themeColor}}>
                    {`${formData.neighborhood} Mh. • ${formData.district} / ${formData.city}`.toLocaleUpperCase('tr-TR')}
                </div>
                {configGroup.badge?.show && formData.isOpportunity && (
                    <div className="mt-4 ml-6 flex items-center justify-center w-[150px] h-[150px] bg-red-600 text-white font-black text-[30px] rounded-full shadow-[0_10px_30px_rgba(220,38,38,0.5)] border-[6px] border-white z-30 leading-none tracking-wider" style={getStyle('badge', 'rotate(-12deg)', 'center')}>
                        FIRSAT
                    </div>
                )}
                {formData.adNumber && (
                    <div className="bg-black/75 text-white px-5 py-1 text-sm font-bold shadow-md rounded-r-xl ml-2 border-l-4 border-white/50 mt-1">
                        İLAN NO: <span className="font-mono">{formData.adNumber}</span>
                    </div>
                )}
            </div>

            {configGroup.topLogo?.show && showLogo && (
                <div className="absolute top-0 right-8 z-20 flex items-start justify-end h-[204px] w-[680px] pointer-events-none" style={getStyle('topLogo', '', 'top right')}>
                    <img src={customLogo || FIXED_LOGO_URL} crossOrigin="anonymous" className="max-w-full max-h-full object-contain object-right-top drop-shadow-xl" />
                </div>
            )}
            
            {/* DANIŞMAN ŞEFFAF GÖRSELİ */}
            {isConsultant && overlayData.show && overlayData.photo && (
                <div className="absolute z-10 pointer-events-none"
                     style={{
                         right: '32px',
                         bottom: '380px',
                         transform: `translate(${overlayData.x}px, ${overlayData.y}px) scale(${overlayData.scale})`,
                         transformOrigin: 'bottom right'
                     }}>
                    <img src={overlayData.photo} alt="Danışman Şeffaf" className="max-h-[500px] w-auto drop-shadow-2xl" crossOrigin="anonymous" />
                </div>
            )}

            <div className="absolute bottom-8 left-8 right-8 bg-white/90 rounded-[1.5rem] p-5 shadow-2xl z-20 border border-white/60 flex flex-col gap-3">
                
                {configGroup.title?.show && (
                    <div className="h-[65px] overflow-hidden" style={getStyle('title', '', 'left center')}>
                        <h2 className="text-[1.75rem] font-extrabold leading-tight drop-shadow-sm" style={{color: themeColor}}>
                            {getGeneratedTitle()}
                        </h2>
                    </div>
                )}

                {configGroup.price?.show && (
                    <div className="text-[1.75rem] font-black text-slate-800 flex items-center gap-2" style={getStyle('price', '', 'left center')}>
                        <span className="text-sm text-slate-500 font-bold tracking-widest">FİYAT:</span>
                        {formData.price} {formData.currency}
                    </div>
                )}

                {configGroup.icons?.show && (
                    <div className={`bg-slate-100/80 border border-white/60 rounded-[1.25rem] ${isLargeIcons ? 'py-4 px-6' : 'py-3 px-4'} shadow-inner relative overflow-visible`}>
                        <div className={`flex flex-row flex-nowrap items-center justify-start ${isLargeIcons ? 'gap-8' : 'gap-3'} w-full`} style={getStyle('icons', '', 'left center')}>
                            {limitedFeatures.map((feat, idx) => (
                                <div key={idx} className={`flex flex-col items-center justify-center text-center flex-shrink-0 ${isLargeIcons ? 'w-[130px] gap-1' : 'w-[84px] gap-0.5'}`}>
                                    <feat.icon size={isLargeIcons ? 33 : 22} className={isLargeIcons ? 'mb-1' : 'mb-0.5'} style={{color: themeColor}} />
                                    <span className={`${isLargeIcons ? 'text-[12px]' : 'text-[9px]'} text-slate-500 font-bold tracking-widest leading-none`}>{feat.label.toLocaleUpperCase('tr-TR')}</span>
                                    <span className={`${isLargeIcons ? 'text-[21px]' : 'text-[14px]'} font-black text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis block w-full px-1 leading-tight ${isLargeIcons ? 'mt-1.5' : 'mt-1'}`}>
                                        {feat.value}
                                   </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {isConsultant ? (
                    consultant.showInfo && (
                        <div className="mt-1 pt-3 border-t border-slate-200/60 flex items-center justify-between h-[80px]">
                            <div className="flex items-center gap-4">
                                {consultant.showPhoto && (
                                    <div className="w-[80px] h-[80px] rounded-xl border-[2px] shadow-md overflow-hidden bg-slate-200" style={{borderColor: themeColor}}>
                                        <img src={consultant.photo} className="w-full h-full object-cover object-top" crossOrigin="anonymous"/>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    {configGroup.name?.show && <span className="text-2xl font-black text-slate-800" style={getStyle('name', '', 'left center')}>{consultant.name}</span>}
                                    {configGroup.separator?.show && configGroup.name?.show && configGroup.phone?.show && <span className="text-2xl font-black text-slate-800" style={getStyle('separator', '', 'center')}>-</span>}
                                    {configGroup.phone?.show && <span className="text-[2.25rem] font-extrabold" style={{color: themeColor, ...getStyle('phone', '', 'left center')}}>{consultant.phone}</span>}
                                </div>
                            </div>
                            
                            <div className="flex flex-row items-center justify-end gap-2" style={getStyle('websites', '', 'right center')}>
                                {showWebsiteOzcan && (
                                    <div className="bg-slate-800 text-white px-3 py-2 rounded-lg text-[13px] font-bold flex items-center shadow-md whitespace-nowrap">
                                        <Globe size={16} className="mr-1.5" style={{color: themeColor}}/> www.ozcanaktas.com
                                    </div>
                                )}
                                {showWebsiteEmlaknomi && (
                                    <div className="bg-slate-800 text-white px-3 py-2 rounded-lg text-[13px] font-bold flex items-center shadow-md whitespace-nowrap">
                                        <Globe size={16} className="mr-1.5" style={{color: themeColor}}/> www.emlaknomi.com
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                ) : (
                    <div className="mt-1 pt-3 border-t border-slate-200/60 flex items-center justify-between h-[80px] relative">
                        <div className="flex items-center h-[50px] w-auto max-w-[250px] relative z-10 flex-shrink-0" style={getStyle('bottomLogo', '', 'left center')}>
                            {showLogo && configGroup.bottomLogo?.show && <img src={customLogo || FIXED_LOGO_URL} className="max-h-[50px] w-auto object-contain object-left pointer-events-none" crossOrigin="anonymous"/>}
                        </div>
                        
                        <div className="flex flex-row items-center justify-end gap-3 text-white relative z-10" style={getStyle('websites', '', 'right center')}>
                            <div className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-[13px] font-bold flex items-center shadow-md whitespace-nowrap">
                                <Globe size={16} className="mr-1.5" style={{color: themeColor}}/> www.emlaknomi.com
                            </div>
                            {availableBranches[selectedOffice]?.address && (
                                <div className="px-3 py-1.5 rounded-lg text-[13px] font-bold flex items-center shadow-md whitespace-nowrap text-white" style={{backgroundColor: themeColor}}>
                                    <MapPin size={16} className="mr-1.5 text-white/80"/> Ofis Adres: {availableBranches[selectedOffice].address}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
      );
  };

  const PdfTemplate = ({ id, designType }) => {
      const isConsultant = designType === 'consultant';
      return (
          <div id={id} className="w-[794px] bg-white text-slate-800 flex flex-col font-sans relative overflow-hidden">
              {/* 1. Sayfa: Kapak Görseli (Sosyal Medya Tasarımı) */}
              <div className="w-[794px] h-[794px] relative overflow-hidden bg-slate-100 flex-shrink-0">
                 <div style={{transform: 'scale(0.73518)', transformOrigin: 'top left', width: '1080px', height: '1080px'}}>
                     <SocialDesign isCapture={true} designType={designType} overlayData={overlayData} designConfig={designConfig} />
                 </div>
              </div>
              
              {/* 2. Bölüm: Diğer Fotoğraflar (Kapağın Yarı Boyutu Grid) */}
              {(formData.images || []).length > 1 && (
                 <div className="px-8 pt-8 bg-white">
                     <h3 className="text-2xl font-black mb-4 border-b-4 pb-2 text-slate-800" style={{borderColor: themeColor}}>Diğer Görseller</h3>
                     <div className="grid grid-cols-2 gap-6">
                         {formData.images.filter((_, i) => i !== formData.coverImageIndex).slice(0, 6).map((img, i) => (
                             <div key={i} className="aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden shadow-md border border-slate-200">
                                 <img src={img} className="w-full h-full object-cover" crossOrigin="anonymous"/>
                             </div>
                         ))}
                     </div>
                 </div>
              )}
              
              {/* 3. Bölüm: İlan Metni / Şablonu */}
              <div className="p-8 flex-grow bg-white">
                 <h3 className="text-2xl font-black mb-4 border-b-4 pb-2 text-slate-800" style={{borderColor: themeColor}}>İlan Detayları</h3>
                 <div className="whitespace-pre-wrap font-mono text-[15px] leading-[1.8] text-slate-700 bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
                     {formData.description || 'İlan metni henüz oluşturulmadı. Lütfen sol taraftaki "Sihirli Metin Oluştur" butonunu kullanın.'}
                 </div>
              </div>
              
              {/* 4. Bölüm: Alt Bilgi Kartı */}
              <div className="px-8 pb-8 pt-4 mt-auto bg-white">
                  {isConsultant ? (
                      <div className="bg-slate-800 text-white rounded-[2rem] p-8 shadow-2xl flex items-center gap-8 relative overflow-hidden border-b-[8px]" style={{borderColor: themeColor}}>
                         <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                             <User size={250} />
                         </div>
                         {consultant.showPhoto && (
                             <div className="w-[160px] h-[160px] rounded-2xl border-4 shadow-xl overflow-hidden bg-slate-200 flex-shrink-0 relative z-10" style={{borderColor: themeColor}}>
                                 <img src={consultant.photo} className="w-full h-full object-cover object-top" crossOrigin="anonymous"/>
                             </div>
                         )}
                         <div className="flex flex-col justify-center relative z-10">
                             <span className="text-base font-bold text-slate-400 uppercase tracking-widest mb-1">Gayrimenkul Uzmanı</span>
                             <span className="text-[2.75rem] font-black text-white leading-none mb-3">{consultant.name}</span>
                             <span className="text-[2.25rem] font-extrabold" style={{color: themeColor}}>{consultant.phone}</span>
                             
                             <div className="flex flex-row items-center gap-4 mt-4">
                                {showWebsiteOzcan && (
                                    <div className="bg-white/10 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center border border-white/20">
                                        <Globe size={16} className="mr-2" style={{color: themeColor}}/> www.ozcanaktas.com
                                    </div>
                                )}
                                {showWebsiteEmlaknomi && (
                                    <div className="bg-white/10 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center border border-white/20">
                                        <Globe size={16} className="mr-2" style={{color: themeColor}}/> www.emlaknomi.com
                                    </div>
                                )}
                            </div>
                         </div>
                      </div>
                  ) : (
                      <div className="bg-slate-800 text-white rounded-[2rem] p-8 shadow-2xl flex items-center justify-between relative overflow-hidden border-b-[8px]" style={{borderColor: themeColor}}>
                           <div className="h-[120px] w-auto max-w-[350px] relative z-10 flex-shrink-0">
                                {showLogo && <img src={customLogo || FIXED_LOGO_URL} className="max-w-full max-h-full object-contain object-left" crossOrigin="anonymous"/>}
                           </div>
                           <div className="flex flex-col justify-center items-end relative z-10 text-right gap-3">
                                <div className="bg-white/10 px-4 py-2.5 rounded-xl text-lg font-bold flex items-center border border-white/20">
                                    <Globe size={24} className="mr-3" style={{color: themeColor}}/> www.emlaknomi.com
                                </div>
                                {availableBranches[selectedOffice]?.address && (
                                    <div className="px-4 py-2.5 rounded-xl text-[15px] font-bold flex items-center shadow-md text-white" style={{backgroundColor: themeColor}}>
                                        <MapPin size={24} className="mr-3 text-white/80"/> {availableBranches[selectedOffice].address}
                                    </div>
                                )}
                           </div>
                      </div>
                  )}
              </div>
              <div className="h-8 bg-white w-full"></div> {/* Footer Padding */}
          </div>
      );
  };

  const executeCapture = async (elementId, width = 1080, height = 1080) => {
    if (!window.htmlToImage) {
        alert("Görsel motoru henüz yüklenmedi, lütfen sayfayı yenileyip tekrar deneyin.");
        return null;
    }
    
    const targetElement = document.getElementById(elementId);
    if (!targetElement) return null;

    const images = Array.from(targetElement.getElementsByTagName('img'));
    
    const loadImg = (img) => {
        return new Promise((resolve) => {
            if (img.complete) {
                resolve();
            } else {
                img.onload = resolve;
                img.onerror = () => {
                   console.warn("Resim yüklenemedi: " + img.src);
                   resolve();
                };
            }
        });
    };

    await Promise.all(images.map(img => loadImg(img)));

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const dataUrl = await window.htmlToImage.toPng(targetElement, { 
          width: width, 
          height: height,
          pixelRatio: 1,
          style: {
              transform: 'none',
              margin: '0',
              padding: '0'
          },
          cacheBust: true
      });
      return await (await fetch(dataUrl)).blob();
    } catch (err) {
      console.error("Görsel yakalama hatası:", err);
      return null;
    }
  };
  
  const executePdfCapture = async (elementId) => {
    if (!window.jspdf || !window.htmlToImage) {
        alert("PDF kütüphaneleri yükleniyor, lütfen bekleyin.");
        return null;
    }
    
    const targetElement = document.getElementById(elementId);
    if (!targetElement) return null;

    const images = Array.from(targetElement.getElementsByTagName('img'));
    const loadImg = (img) => {
        return new Promise((resolve) => {
            if (img.complete) { resolve(); } 
            else { 
              img.onload = resolve; 
              img.onerror = () => {
                  console.warn("Resim yüklenemedi: " + img.src);
                  resolve();
              }; 
            }
        });
    };
    await Promise.all(images.map(img => loadImg(img)));

    await new Promise(resolve => setTimeout(resolve, 800));

    try {
        const dataUrl = await window.htmlToImage.toPng(targetElement, {
            width: 794,
            pixelRatio: 2, 
            style: { transform: 'none', margin: '0', padding: '0' },
            cacheBust: true
        });
        
        const img = new Image();
        img.src = dataUrl;
        await new Promise(resolve => { 
            img.onload = resolve; 
            img.onerror = resolve; 
        });
        
        const pdfWidth = 210;
        const pdfHeight = (img.height * pdfWidth) / img.width;
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: [pdfWidth, pdfHeight]
        });
        
        // Use JPEG format instead of PNG to prevent "Incomplete or corrupt PNG file" errors in jsPDF
        pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        return pdf.output('blob');
    } catch(e) {
        console.error("PDF yakalama hatası:", e);
        return null;
    }
  };

  const onDownloadImageOnly = async () => {
      setIsDownloading(true);
      try {
          const blob = await executeCapture(
              previewDesignType === 'consultant' ? 'social-capture-element-consultant' : 'social-capture-element-corporate', 
              1080, 1080
          );
          if (blob) { 
              window.saveAs(blob, `Emlak_Tasarim_${previewDesignType}.png`); 
          } else {
             alert("Görsel oluşturulamadı. Lütfen CORS ayarları olan yerel dosyalar kullanıldığından emin olun.");
          }
      } catch (err) {
          console.error(err);
      } finally {
          setIsDownloading(false);
      }
  };
  
  const onDownloadPdfOnly = async () => {
      setIsDownloading(true);
      try {
          const elementId = previewDesignType === 'consultant' ? 'pdf-capture-element-consultant' : 'pdf-capture-element-corporate';
          const blob = await executePdfCapture(elementId);
          if (blob) { 
              window.saveAs(blob, `${getFileNameBase(previewDesignType === 'consultant')}_${previewDesignType}.pdf`); 
          } else {
             alert("PDF oluşturulamadı.");
          }
      } catch (err) {
          console.error(err);
      } finally {
          setIsDownloading(false);
      }
  };

  const onDownloadProject = async () => {
    if (!window.JSZip) { alert("Kütüphaneler Yüklenmedi. Lütfen sayfayı yenileyin."); return; }
    setIsDownloading(true);
    try {
        const zip = new window.JSZip();
        
        let zipFolderName = getFileNameBase(true, false); 
        const pdfFileName = getFileNameBase(false, false);
        
        const rootFolder = zip.folder(zipFolderName);
        const hamFolder = rootFolder.folder("1_HAM_FOTOLAR");
        if ((formData.images || []).length > 0) {
          const imgPromises = formData.images.map(async (imgUrl, idx) => {
            try { const response = await fetch(imgUrl); const blob = await response.blob(); hamFolder.file(`resim_${idx + 1}.jpg`, blob); } catch (e) {}
          }); await Promise.all(imgPromises);
        }
        
        const tasarimFolder = rootFolder.folder("2_TASARIMLI");
        
        // 1. Danışman Şablonu
        const socialBlobDanisman = await executeCapture('social-capture-element-consultant', 1080, 1080); 
        if (socialBlobDanisman) { 
            tasarimFolder.file(`sosyal_tasarim_danisman.png`, socialBlobDanisman); 
        }

        // 2. Kurumsal Şablon
        const socialBlobKurumsal = await executeCapture('social-capture-element-corporate', 1080, 1080); 
        if (socialBlobKurumsal) { 
            tasarimFolder.file(`sosyal_tasarim_kurumsal.png`, socialBlobKurumsal); 
        }
        
        const pdfFolder = rootFolder.folder("3_PDF_SUNUM");
        
        const pdfBlobDanisman = await executePdfCapture('pdf-capture-element-consultant');
        if (pdfBlobDanisman) {
            pdfFolder.file(`${pdfFileName}_danisman.pdf`, pdfBlobDanisman);
        }
        
        const pdfBlobKurumsal = await executePdfCapture('pdf-capture-element-corporate');
        if (pdfBlobKurumsal) {
            pdfFolder.file(`${pdfFileName}_kurumsal.pdf`, pdfBlobKurumsal);
        }
        
        const metinFolder = rootFolder.folder("4_ILAN_METNI");
        metinFolder.file("ilan_metni.txt", formData.description || "Lütfen 'Sihirli Metin Oluştur' butonuna basınız.");
        
        const ozelFolder = rootFolder.folder("5_OZEL_BILGI");
        const ozelContent = `MÜŞTERİ BİLGİ FORMU\nTarih: ${privateData.date}\nMüşteri Adı: ${privateData.customerName}\nİletişim: ${privateData.contactInfo}\nAçık Adres: ${privateData.openAddress}\nTaşınmaz No: ${privateData.propertyNo}\nKapı Şifresi: ${privateData.doorCode}\nTapu Durumu: ${privateData.deedStatusPrivate}\nTakas: ${privateData.swapPrivate}\nBiter Fiyat: ${privateData.finalPrice}\nKomisyon: ${privateData.commission}\nNotlar: ${privateData.notes}`;
        ozelFolder.file("Ozel_Bilgiler.txt", ozelContent);
        
        const content = await zip.generateAsync({ type: "blob" });
        window.saveAs(content, `${zipFolderName}.zip`);
    } catch (error) { 
        console.error("ZIP Hatası:", error);
    } finally { 
        setIsDownloading(false); 
    }
  };

  // DASHBOARD EKRANI RENDER
  if (appState === 'dashboard') {
      return (
          <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 font-sans">
              <div className="max-w-4xl w-full">
                  <div className="text-center mb-12">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 text-orange-600 rounded-2xl mb-4 shadow-sm">
                          <Home size={40} />
                      </div>
                      <h1 className="text-4xl font-black text-slate-800 tracking-tight">Emlaknomi <span className="text-orange-500 font-light">İlan Hazırlama</span></h1>
                      <p className="text-slate-500 mt-2 text-lg">Özcan AKTAŞ Yazılım Teknolojileri</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                      <div onClick={startNewProject} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200 cursor-pointer hover:shadow-xl hover:border-orange-500 transition-all transform hover:-translate-y-1 flex flex-col items-center justify-center text-center group">
                          <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              <PlusCircle size={32} />
                          </div>
                          <h2 className="text-xl font-bold text-slate-800 mb-2">Yeni İlan Oluştur</h2>
                          <p className="text-sm text-slate-500">Sıfırdan yeni bir gayrimenkul ilanı ve tasarımı hazırlayın.</p>
                      </div>
                      
                      <div onClick={() => setAppState('drafts')} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200 cursor-pointer hover:shadow-xl hover:border-blue-500 transition-all transform hover:-translate-y-1 flex flex-col items-center justify-center text-center group">
                          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              <Edit3 size={32} />
                          </div>
                          <h2 className="text-xl font-bold text-slate-800 mb-2">Kayıtlı Taslaklarım</h2>
                          <p className="text-sm text-slate-500">Yarım kalan ilanlarınızı düzenleyin ve tamamlayın.</p>
                          <span className="mt-4 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">{savedDrafts.length} İlan Taslağı Bulunuyor</span>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // DETAYLI TASLAK LİSTESİ EKRANI
  if (appState === 'drafts') {
      return (
          <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
            <header className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-50">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button onClick={() => setAppState('dashboard')} className="flex flex-col items-center justify-center text-slate-400 hover:text-white transition-colors" title="Ana Ekrana Dön">
                        <Home size={24} />
                        <span className="text-[10px] mt-0.5">Ana Sayfa</span>
                    </button>
                    <div className="flex items-center space-x-2 border-l border-slate-700 pl-4">
                        <h1 className="text-xl font-bold">Emlaknomi <span className="text-orange-500 font-light">İlan Hazırlama</span></h1>
                    </div>
                </div>
              </div>
            </header>

            <main className="max-w-4xl mx-auto p-4 md:p-6 mt-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center"><FileText className="mr-3 text-blue-500" size={28}/> Kayıtlı Taslaklar</h2>
                        <span className="bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1 rounded-full">{savedDrafts.length} İlan</span>
                    </div>
                    
                    <div className="space-y-4">
                        {savedDrafts.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <FileText size={48} className="mx-auto mb-4 opacity-50"/>
                                <p className="text-lg">Henüz kaydedilmiş bir taslağınız bulunmuyor.</p>
                            </div>
                        ) : (
                            savedDrafts.map(draft => (
                                <div key={draft.id} className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex items-center justify-between hover:bg-slate-100 transition-colors group cursor-pointer" onClick={() => loadDraft(draft)}>
                                    <div className="flex-1 min-w-0 pr-4">
                                        <h4 className="text-lg font-bold text-slate-800 truncate mb-1">{draft.name}</h4>
                                        <div className="flex items-center text-xs text-slate-500 space-x-4">
                                            <span className="flex items-center"><Calendar size={14} className="mr-1"/> {new Date(draft.date).toLocaleString('tr-TR')}</span>
                                            <span className="flex items-center"><MapPin size={14} className="mr-1"/> {draft.formData.city} / {draft.formData.district}</span>
                                            <span className="flex items-center"><Layout size={14} className="mr-1"/> {draft.formData.type}</span>
                                            <span className="flex items-center font-bold text-orange-600">{draft.formData.price} {draft.formData.currency}</span>
                                        </div>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); setDraftToDelete(draft.id); }} className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Taslağı Sil">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            {/* Özel Silme Modalı (Iframe Güvenliği İçin) */}
            {draftToDelete && (
                <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                        <h3 className="text-xl font-black text-slate-800 mb-2">Taslağı Sil</h3>
                        <p className="text-slate-600 mb-6 text-sm">Bu taslağı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
                        <div className="flex space-x-3 justify-end">
                            <button onClick={() => setDraftToDelete(null)} className="px-4 py-2 text-slate-700 font-bold bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">İptal</button>
                            <button onClick={confirmDeleteDraft} className="px-4 py-2 text-white font-bold bg-red-600 hover:bg-red-700 rounded-lg transition-colors">Evet, Sil</button>
                        </div>
                    </div>
                </div>
            )}
          </div>
      );
  }

  // EDİTÖR EKRANI RENDER
  if (!isReady) return <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800"><Loader2 className="animate-spin text-orange-600 mb-4" size={48} /><h2 className="text-xl font-bold">Hazırlanıyor...</h2></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-orange-200 selection:text-orange-900 pb-20">
      <header className="bg-slate-900 text-white p-4 shadow-lg print:hidden sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
              <button onClick={() => setAppState('dashboard')} className="flex flex-col items-center justify-center text-slate-400 hover:text-white transition-colors" title="Ana Ekrana Dön">
                  <Home size={24} />
                  <span className="text-[10px] mt-0.5">Ana Sayfa</span>
              </button>
              <div className="flex items-center space-x-2 border-l border-slate-700 pl-4">
                  <h1 className="text-xl font-bold hidden md:block">Emlaknomi <span className="text-orange-500 font-light">İlan Hazırlama</span></h1>
                  <h1 className="text-sm font-bold md:hidden truncate max-w-[150px] text-slate-300">{currentDraftId ? savedDrafts.find(d => d.id === currentDraftId)?.name || 'Düzenleniyor...' : 'Yeni İlan'}</h1>
              </div>
          </div>
          <div className="flex items-center space-x-3">
             {/* SADECE İLAN NO YOKKEN KAYIT UYARISI GÖSTERİLİR */}
             {!formData.adNumber ? (
                 <div className="hidden md:flex items-center text-xs font-bold text-slate-400 mr-2 border border-slate-700 px-3 py-1.5 rounded-lg bg-slate-800">
                     {saveStatus || 'Değişiklikler otomatik kaydedilir'}
                 </div>
             ) : (
                 <div className="hidden md:flex items-center text-xs font-bold text-green-400 mr-2 border border-green-900 px-3 py-1.5 rounded-lg bg-green-900/30">
                     <CheckCircle size={14} className="mr-1"/> İlan Tamamlandı
                 </div>
             )}
             <button onClick={onDownloadProject} disabled={isDownloading} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center font-bold text-sm transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(22,163,74,0.4)]"><Download size={16} className="md:mr-2"/> <span className="hidden md:inline">{isDownloading ? 'Hazırlanıyor...' : 'İndir (ZIP)'}</span></button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        <div className="space-y-6 print:hidden">
          <div className="bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-700 text-white">
            <h2 className="text-lg font-semibold mb-4 flex items-center text-slate-100"><User className="mr-2 text-orange-500" size={20} /> Ayarlar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-slate-400 mb-1">Şube</label>
                 <select value={selectedOffice} onChange={handleOfficeChange} disabled={activeUser.allowedBranches && activeUser.allowedBranches.length === 1} className={`w-full p-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:border-orange-500 ${activeUser.allowedBranches && activeUser.allowedBranches.length === 1 ? 'opacity-75 cursor-not-allowed' : ''}`}>
                    {(activeUser.allowedBranches || Object.keys(availableBranches)).map(key => (availableBranches[key] ? <option key={key} value={key}>{availableBranches[key].name}</option> : null))}
                 </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Görünüm & Tema</label>
                  <div className="flex gap-2">
                    <button onClick={() => setShowLogo(!showLogo)} className="flex-1 border border-slate-600 p-2 rounded text-xs hover:bg-slate-700">{showLogo ? 'Logo Gizle' : 'Logo Göster'}</button>
                    <label className="cursor-pointer border border-slate-600 p-2 rounded text-xs bg-slate-700 flex items-center justify-center hover:bg-slate-600"><Upload size={14} className="mr-1"/> Logo<input type="file" className="hidden" onChange={handleLogoChange}/></label>
                  </div>
                  <div className="mt-2 flex items-center gap-2"><label className="text-xs text-slate-400">Tema Rengi:</label><input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="w-full h-8 rounded cursor-pointer"/></div>
               </div>
               <div className="md:col-span-2 border-t border-slate-700 pt-4 mt-2">
                   <h3 className="text-xs font-bold text-slate-400 mb-2">Danışman Bilgileri</h3>
                   <div className="grid grid-cols-2 gap-2">
                       <input name="name" value={consultant.name} onChange={handleConsultantChange} className="p-2 border border-slate-600 rounded text-xs bg-slate-700 text-white" placeholder="Ad Soyad"/>
                       <input name="phone" value={consultant.phone} onChange={handleConsultantChange} className="p-2 border border-slate-600 rounded text-xs bg-slate-700 text-white" placeholder="Telefon"/>
                       <label className="flex items-center text-xs gap-1 border border-slate-600 p-2 rounded cursor-pointer hover:bg-slate-700"><input type="checkbox" name="showInfo" checked={consultant.showInfo} onChange={handleConsultantChange}/> Bilgileri Göster</label>
                       <label className="flex items-center text-xs gap-1 border border-slate-600 p-2 rounded cursor-pointer hover:bg-slate-700"><input type="checkbox" name="showPhoto" checked={consultant.showPhoto} onChange={handleConsultantChange}/> Foto Göster</label>
                       <label className="col-span-2 cursor-pointer border border-slate-600 p-2 rounded text-xs bg-slate-700 flex items-center justify-center hover:bg-slate-600"><Upload size={14} className="mr-1"/> Profil Fotosu Değiştir<input type="file" className="hidden" onChange={handleProfilePhotoChange} accept="image/*"/></label>
                   </div>
               </div>
               <div className="md:col-span-2 space-y-2 border-t border-slate-700 pt-4">
                   <div className="flex items-center space-x-2 border border-slate-600 p-2 rounded hover:bg-slate-700"><input type="checkbox" checked={showWebsiteOzcan} onChange={e=>setShowWebsiteOzcan(e.target.checked)} /><span className="text-sm">ozcanaktas.com Göster</span></div>
                   <div className="flex items-center space-x-2 border border-slate-600 p-2 rounded hover:bg-slate-700"><input type="checkbox" checked={showWebsiteEmlaknomi} onChange={e=>setShowWebsiteEmlaknomi(e.target.checked)} /><span className="text-sm">emlaknomi.com Göster</span></div>
               </div>
               
               {/* ŞEFFAF GÖRSEL AYARLARI */}
               <div className="md:col-span-2 border-t border-slate-700 pt-4 mt-2">
                   <div className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white" onClick={() => setActiveConfigTab(activeConfigTab === 'overlay' ? null : 'overlay')}>
                       <h3 className="text-sm font-bold flex items-center"><User size={16} className="mr-2 text-orange-500"/> Şeffaf Danışman Tasarım Görseli</h3>
                       {activeConfigTab === 'overlay' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                   </div>
                   
                   {activeConfigTab === 'overlay' && (
                       <div className="mt-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700 space-y-4">
                           <div className="flex items-center justify-between gap-4">
                               <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center transition-colors">
                                   <Upload size={14} className="mr-2"/> Fotoğraf Ekle (PNG)
                                   <input type="file" className="hidden" accept="image/png" onChange={handleOverlayPhotoChange} />
                               </label>
                               <label className="flex items-center text-xs gap-2 text-slate-300 cursor-pointer">
                                   <input type="checkbox" checked={overlayData.show} onChange={(e) => updateOverlayConfig({show: e.target.checked})} className="w-4 h-4"/>
                                   Görseli Göster
                               </label>
                           </div>
                           
                           {overlayData.photo && (
                               <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-700/50">
                                   <div>
                                       <span className="block text-[10px] font-bold text-slate-400 mb-2 text-center">KONUMLANDIRMA</span>
                                       <div className="grid grid-cols-3 gap-1 w-24 mx-auto">
                                           <div></div>
                                           <button onClick={() => updateOverlayConfig({y: overlayData.y - 10})} className="bg-slate-700 p-1.5 rounded hover:bg-slate-600 flex justify-center text-white"><ChevronUp size={14}/></button>
                                           <div></div>
                                           <button onClick={() => updateOverlayConfig({x: overlayData.x - 10})} className="bg-slate-700 p-1.5 rounded hover:bg-slate-600 flex justify-center text-white"><div className="rotate-90"><ChevronDown size={14}/></div></button>
                                           <button onClick={() => updateOverlayConfig({y: overlayData.y + 10})} className="bg-slate-700 p-1.5 rounded hover:bg-slate-600 flex justify-center text-white"><ChevronDown size={14}/></button>
                                           <button onClick={() => updateOverlayConfig({x: overlayData.x + 10})} className="bg-slate-700 p-1.5 rounded hover:bg-slate-600 flex justify-center text-white"><div className="-rotate-90"><ChevronDown size={14}/></div></button>
                                       </div>
                                   </div>
                                   <div className="flex flex-col justify-center">
                                       <span className="block text-[10px] font-bold text-slate-400 mb-2 text-center">BOYUTLANDIRMA</span>
                                       <div className="flex gap-2">
                                           <button onClick={() => updateOverlayConfig({scale: Math.max(0.1, overlayData.scale - 0.05)})} className="bg-slate-700 text-white flex-1 py-1.5 text-xs rounded font-bold hover:bg-slate-600">-</button>
                                           <button onClick={() => updateOverlayConfig({scale: overlayData.scale + 0.05})} className="bg-slate-700 text-white flex-1 py-1.5 text-xs rounded font-bold hover:bg-slate-600">+</button>
                                       </div>
                                   </div>
                               </div>
                           )}
                       </div>
                   )}
               </div>

               {/* TASARIM VE LOGO BOYUTLANDIRMA (DANIŞMAN) */}
               <div className="md:col-span-2 border-t border-slate-700 pt-4 mt-2">
                   <div className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white" onClick={() => setActiveConfigTab(activeConfigTab === 'consultant' ? null : 'consultant')}>
                       <h3 className="text-sm font-bold flex items-center"><Settings size={16} className="mr-2 text-orange-500"/> Tasarım ve Logo Boyutlandırma (Danışman)</h3>
                       {activeConfigTab === 'consultant' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                   </div>
                   {activeConfigTab === 'consultant' && (
                       <div className="mt-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                           <div className="flex gap-2 mb-4">
                               <select className="flex-1 p-2 rounded bg-slate-700 text-white border border-slate-600 text-sm" value={selectedConsultantElement} onChange={e => setSelectedConsultantElement(e.target.value)}>
                                   <option value="topLogo">Sağ Üst Logo</option>
                                   <option value="badge">Fırsat Etiketi</option>
                                   <option value="title">İlan Başlığı</option>
                                   <option value="price">Fiyat</option>
                                   <option value="icons">Özellik İkonları</option>
                                   <option value="name">Danışman İsmi</option>
                                   <option value="separator">İsim-Telefon Çizgisi</option>
                                   <option value="phone">Danışman Telefonu</option>
                                   <option value="websites">Websiteler & Adres</option>
                               </select>
                               <button onClick={() => resetDesignConfig('consultant')} className="bg-red-600/80 hover:bg-red-600 text-white text-xs px-3 rounded font-bold transition-colors">Sıfırla</button>
                           </div>
                           {renderTransformControls('consultant', selectedConsultantElement, 'Seçili Öğe')}
                       </div>
                   )}
               </div>

               {/* KURUMSAL TASARIM AYARLARI */}
               <div className="md:col-span-2 border-t border-slate-700 pt-4 mt-2">
                   <div className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white" onClick={() => setActiveConfigTab(activeConfigTab === 'corporate' ? null : 'corporate')}>
                       <h3 className="text-sm font-bold flex items-center"><Layout size={16} className="mr-2 text-blue-500"/> Kurumsal Tasarım Ayarları</h3>
                       {activeConfigTab === 'corporate' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                   </div>
                   {activeConfigTab === 'corporate' && (
                       <div className="mt-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                           <div className="flex gap-2 mb-4">
                               <select className="flex-1 p-2 rounded bg-slate-700 text-white border border-slate-600 text-sm" value={selectedCorporateElement} onChange={e => setSelectedCorporateElement(e.target.value)}>
                                   <option value="topLogo">Sağ Üst Logo</option>
                                   <option value="bottomLogo">Sol Alt Logo (Kurumsal)</option>
                                   <option value="badge">Fırsat Etiketi</option>
                                   <option value="title">İlan Başlığı</option>
                                   <option value="price">Fiyat</option>
                                   <option value="icons">Özellik İkonları</option>
                                   <option value="websites">Websiteler & Adres</option>
                               </select>
                               <button onClick={() => resetDesignConfig('corporate')} className="bg-red-600/80 hover:bg-red-600 text-white text-xs px-3 rounded font-bold transition-colors">Sıfırla</button>
                           </div>
                           {renderTransformControls('corporate', selectedCorporateElement, 'Seçili Öğe')}
                       </div>
                   )}
               </div>

            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center text-slate-700"><Layout className="mr-2 text-blue-600" size={20} /> İlan Detayları</h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed p-4 rounded bg-slate-50">
                 <label className="cursor-pointer bg-blue-600 text-white px-3 py-1.5 rounded block text-center text-sm font-medium mb-2"><Camera size={16} className="inline mr-1" /> Fotoğraf Yükle<input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} /></label>
                 <div className="grid grid-cols-4 gap-2">
                    {formData.images.map((img, idx) => (
                        <div key={idx} className={`relative aspect-square border-2 cursor-pointer group ${formData.coverImageIndex === idx ? 'border-orange-500' : 'border-gray-200'}`} onClick={() => setFormData(prev => ({...prev, coverImageIndex: idx}))}>
                            <img src={img} className="w-full h-full object-cover"/>
                            {formData.coverImageIndex === idx && <div className="absolute bottom-0 w-full bg-orange-500 text-white text-[8px] text-center">KAPAK</div>}
                            <button onClick={(e) => removeImage(idx, e)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-700" title="Fotoğrafı Sil"><X size={12} /></button>
                        </div>
                    ))}
                 </div>
              </div>
              
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <label className="text-xs text-orange-800 font-bold mb-1 block">İlan Başlığı</label>
                  <div className="flex items-center gap-2"><span className="font-bold text-orange-700 whitespace-nowrap">Emlaknomi'den</span><input type="text" name="customTitle" value={formData.customTitle} onChange={handleInputChange} placeholder="Otomatik (Boş bırakınız)" className="w-full p-2 border border-orange-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"/></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="İlan Numarası (Sisteme Yüklendikten Sonra Eklenebilir)" name="adNumber" value={formData.adNumber} onChange={handleInputChange} placeholder="Örn: 12345678" highlight />
                  <div><label className="text-xs text-slate-500 font-bold mb-1 block">Emlak Tipi</label><select name="type" value={formData.type} onChange={handleInputChange} className="w-full p-2 border rounded bg-white text-slate-800 font-bold"><option>Satılık Daire</option><option>Kiralık Daire</option><option>Satılık Arsa</option><option>Satılık Tarla</option><option>Satılık Bahçe</option><option>Satılık Ticari</option><option>Kiralık Ticari</option><option>Devren Satılık</option></select></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4"><InputField label="Fiyat" name="price" value={formData.price} onChange={handleInputChange} /><div><label className="text-xs text-slate-500 font-bold mb-1 block">Birim</label><select name="currency" value={formData.currency} onChange={handleInputChange} className="w-full p-2 border rounded bg-white text-slate-800"><option>TL</option><option>USD</option><option>EUR</option></select></div></div>
              <div className="bg-slate-50 p-3 rounded border">
                  <div className="flex justify-between mb-2"><span className="text-sm font-bold">Konum</span><button onClick={()=>setIsManualLocation(!isManualLocation)} className="text-xs text-blue-600 underline">Manuel Gir</button></div>
                  {isManualLocation ? (<div className="grid grid-cols-3 gap-2"><select name="city" value={formData.city} onChange={handleCityChange} className="p-1 border rounded text-xs bg-white text-slate-800">{allCities.map(c=><option key={c}>{c}</option>)}</select><input name="district" value={formData.district} onChange={handleInputChange} placeholder="İlçe" className="p-1 border rounded text-xs" /><input name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} placeholder="Mahalle" className="p-1 border rounded text-xs" /></div>) : (<div className="grid grid-cols-3 gap-2"><select name="city" value={formData.city} onChange={handleCityChange} className="p-1 border rounded text-xs bg-white text-slate-800">{allCities.map(c=><option key={c}>{c}</option>)}</select><select name="district" value={formData.district} onChange={handleDistrictChange} className="p-1 border rounded text-xs bg-white text-slate-800">{detailedCities.includes(formData.city) ? Object.keys(locationData[formData.city]||{}).map(d=><option key={d}>{d}</option>) : <option>Yok</option>}</select><select name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} className="p-1 border rounded text-xs bg-white text-slate-800">{(locationData[formData.city]?.[formData.district]||[]).map(n=><option key={n}>{n}</option>)}</select></div>)}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{renderDynamicFields()}</div>
              
              <div className="col-span-2 md:col-span-3 mb-2 mt-4">
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Diğer Özellikler (Opsiyonel)</label>
                  <textarea name="digerOzellikler" value={formData.digerOzellikler} onChange={handleInputChange} rows={2} className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white focus:outline-none focus:border-orange-500 transition-colors" placeholder="Krediye uygun, güney cephe, köşe başı vb. ekstra detaylar..." />
              </div>
              
              <button onClick={generateDescription} className="w-full py-3 bg-slate-800 text-white rounded font-bold hover:bg-slate-700 transition-colors mt-2 mb-2">Sihirli Metin Oluştur (Yenile)</button>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={6} className="w-full p-2 border rounded text-xs font-mono" placeholder="Metin burada oluşacak..."/>
              
              <div className="bg-red-50 p-4 rounded border-dashed border-red-200 mt-4">
                  <div className="text-red-600 font-bold text-xs mb-2 flex items-center"><Lock size={12} className="mr-1"/> Gizli Bilgiler</div>
                  <div className="grid grid-cols-2 gap-2">
                      <div className="col-span-2"><label className="block text-xs text-slate-500 mb-1 font-bold">Tarih</label><input type="date" name="date" value={privateData.date} onChange={handlePrivateInputChange} className="w-full p-2 border rounded-lg text-xs bg-white"/></div>
                      <input name="customerName" value={privateData.customerName} onChange={handlePrivateInputChange} placeholder="Müşteri Adı" className="p-2 border rounded text-xs"/>
                      <input name="contactInfo" value={privateData.contactInfo} onChange={handlePrivateInputChange} placeholder="İletişim" className="p-2 border rounded text-xs"/>
                      <textarea name="openAddress" value={privateData.openAddress} onChange={handlePrivateInputChange} placeholder="Açık Adres" className="col-span-2 p-2 border rounded text-xs" rows={2}/>
                      <input name="propertyNo" value={privateData.propertyNo} onChange={handlePrivateInputChange} placeholder="Taşınmaz No" className="p-2 border rounded text-xs"/>
                      <input name="doorCode" value={privateData.doorCode} onChange={handlePrivateInputChange} placeholder="Kapı Şifresi" className="p-2 border rounded text-xs"/>
                      <input name="deedStatusPrivate" value={privateData.deedStatusPrivate} onChange={handlePrivateInputChange} placeholder="Tapu Durumu" className="p-2 border rounded text-xs"/>
                      <input name="swapPrivate" value={privateData.swapPrivate} onChange={handlePrivateInputChange} placeholder="Takas" className="p-2 border rounded text-xs"/>
                      <input name="finalPrice" value={privateData.finalPrice} onChange={handlePrivateInputChange} placeholder="Biter Fiyat" className="p-2 border rounded text-xs"/>
                      <input name="commission" value={privateData.commission} onChange={handlePrivateInputChange} placeholder="Komisyon" className="p-2 border rounded text-xs"/>
                      <textarea name="notes" value={privateData.notes} onChange={handlePrivateInputChange} placeholder="Notlar..." className="col-span-2 p-2 border rounded text-xs"/>
                  </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex bg-white p-1 rounded border">
            <button onClick={() => setActiveTab('social')} className={`flex-1 py-2 text-xs font-bold rounded ${activeTab === 'social' ? 'bg-orange-500 text-white' : 'text-slate-500'}`}>Sosyal Medya</button>
            <button onClick={() => setActiveTab('pdf')} className={`flex-1 py-2 text-xs font-bold rounded ${activeTab === 'pdf' ? 'bg-red-500 text-white' : 'text-slate-500'}`}>PDF Sunum</button>
          </div>

          {activeTab === 'social' && (
            <div className="bg-white p-4 rounded shadow border">
              <div className="flex justify-between mb-4 items-center">
                  <span className="text-xs font-bold text-slate-500">INSTAGRAM (1080x1080)</span>
                  <div className="flex bg-slate-100 p-1 rounded-lg w-max mx-auto">
                      <button onClick={() => setPreviewDesignType('consultant')} className={`px-4 py-1.5 text-[10px] font-bold rounded-md ${previewDesignType === 'consultant' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:bg-slate-200'}`}>Danışman</button>
                      <button onClick={() => setPreviewDesignType('corporate')} className={`px-4 py-1.5 text-[10px] font-bold rounded-md ${previewDesignType === 'corporate' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:bg-slate-200'}`}>Kurumsal</button>
                  </div>
                  <button onClick={onDownloadImageOnly} disabled={isDownloading} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded font-bold disabled:opacity-50">
                      {isDownloading ? 'Hazırlanıyor...' : 'Görsel İndir'}
                  </button>
              </div>
              <div className="flex gap-2 mb-4 justify-center">
                  {['single', 'double', 'triple', 'quad'].map(mode => (
                      <button key={mode} onClick={() => setDesignMode(mode)} className={`px-3 py-1 text-xs font-bold border rounded ${designMode === mode ? 'bg-slate-800 text-white' : 'bg-white text-slate-600'}`}>
                          {mode === 'single' ? 'Tekli' : mode === 'double' ? 'İkili' : mode === 'triple' ? 'Üçlü' : 'Dörtlü'}
                      </button>
                  ))}
              </div>
              <div className="w-full overflow-hidden flex justify-center bg-slate-900" style={{height: '380px'}}> 
                  <div style={{transform: 'scale(0.35)', transformOrigin: 'top center', width: '1080px', height: '1080px'}}>
                    <div className="shadow-2xl">
                         <SocialDesign isCapture={false} designType={previewDesignType} overlayData={overlayData} designConfig={designConfig} />
                    </div>
                  </div>
              </div>
            </div>
          )}

          {activeTab === 'pdf' && (
            <div className="bg-white p-4 rounded shadow border">
              <div className="flex justify-between mb-4">
                  <span className="text-xs font-bold text-slate-500">PDF SUNUM</span>
                  <button onClick={onDownloadPdfOnly} disabled={isDownloading} className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded font-bold disabled:opacity-50 hover:bg-red-200 transition-colors">
                      {isDownloading ? 'Hazırlanıyor...' : 'PDF İndir'}
                  </button>
              </div>
              <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 text-center flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-2">
                      <FileText size={32} />
                  </div>
                  <h4 className="font-bold text-slate-700 text-lg">PDF Sunum Dosyası</h4>
                  <p className="text-sm text-slate-500 max-w-sm">
                      Tasarımlı kapak resmi, diğer fotoğraflar, detaylı ilan metni ve danışman bilgilerinden oluşan profesyonel sunum dosyanızı anında indirebilirsiniz.
                  </p>
                  <div className="text-xs font-mono bg-slate-200 px-3 py-1.5 rounded mt-2 text-slate-600 font-bold border border-slate-300">
                      Dosya: {getFileNameBase(false, currentDraftId === null)}.pdf
                  </div>
              </div>
            </div>
          )}

          {/* İNDİRME İÇİN KULLANILAN GİZLİ (STABİL) KONTEYNERLER */}
          <div style={{ position: 'fixed', top: '0px', left: '0px', zIndex: -9999, opacity: 0, pointerEvents: 'none' }}>
             <div id="social-capture-element-consultant" className="w-[1080px] h-[1080px] bg-white relative overflow-hidden font-sans">
                <SocialDesign isCapture={true} designType="consultant" overlayData={overlayData} designConfig={designConfig} />
             </div>
             <div id="social-capture-element-corporate" className="w-[1080px] h-[1080px] bg-white relative overflow-hidden font-sans">
                <SocialDesign isCapture={true} designType="corporate" overlayData={overlayData} designConfig={designConfig} />
             </div>
             
             {/* PDF ÖZEL GİZLİ ŞABLONU (A4 Genişliği 794px baz alınarak tasarlandı) */}
             <PdfTemplate id="pdf-capture-element-consultant" designType="consultant" />
             <PdfTemplate id="pdf-capture-element-corporate" designType="corporate" />
          </div>
        </div>
      </main>
    </div>
  );
}
