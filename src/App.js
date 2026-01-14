import React, { useState, useEffect, useRef } from 'react';
import { Camera, Printer, Home, MapPin, CheckCircle, Layout, Upload, User, ChevronDown, ChevronUp, Download, Grid, Image as ImageIcon, Lock, Loader2, Globe, Car, Building, X } from 'lucide-react';

// --- YARDIMCI BİLEŞENLER ---
const InputField = ({ label, name, value, onChange, onBlur, placeholder }) => (
  <div className="mb-2">
    <label className="block text-xs text-slate-500 mb-1 font-bold">{label}</label>
    <input 
      type="text" 
      name={name} 
      value={value} 
      onChange={onChange} 
      onBlur={onBlur}
      className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white focus:outline-none focus:border-orange-500 transition-colors" 
      placeholder={placeholder}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="mb-2">
    <label className="block text-xs text-slate-500 mb-1 font-bold">{label}</label>
    <select 
      name={name} 
      value={value} 
      onChange={onChange} 
      className="w-full p-2 border rounded-lg text-sm text-slate-800 bg-white focus:outline-none focus:border-orange-500 transition-colors"
    >
      <option value="">Seçiniz</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const MultiSelectField = ({ label, field, value, onChange, options, themeColor }) => (
  <div className="relative group mb-2">
      <label className="block text-xs text-slate-500 mb-1 font-bold">{label} (Çoklu)</label>
      <div className="w-full p-2 border rounded-lg text-sm h-24 overflow-y-auto cursor-pointer bg-white text-slate-800 focus-within:border-orange-500 transition-colors border-slate-200">
          {options.map(op => (
          <div key={op} onClick={() => onChange(field, op)} className={`flex items-center p-1.5 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 ${value.includes(op) ? 'font-bold' : ''}`} style={{color: value.includes(op) ? themeColor : 'inherit', backgroundColor: value.includes(op) ? `${themeColor}10` : 'transparent'}}>
              {value.includes(op) ? <CheckCircle size={14} className="mr-2" style={{color: themeColor}}/> : <div className="w-3.5 h-3.5 border-2 rounded-full mr-2 border-slate-300"></div>}
              {op}
          </div>
      ))}</div>
  </div>
);

// --- SABİT VERİLER ---
const FIXED_LOGO_URL = "https://i.hizliresim.com/fa4ibjl.png"; 
const DEFAULT_PROFILE_PHOTO = "https://i.hizliresim.com/eqya4c4.png";

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
  "Dış Özellikler": ["Araç Şarj İstasyonu", "24 Saat Güvenlik", "Apartman Görevlisi", "Buhar Odası", "Çocuk Oyun Parkı", "Hidrofor", "Jeneratör", "Kablo TV", "Kamera Sistemi", "Kapalı Otopark", "Kreş", "Müstakil Havuzlu", "Oyun Parkı", "Sauna", "Ses Yalıtımı", "Siding", "Spor Alanı", "Su Deposu", "Tenis Kortu", "Uydu", "Yangın Merdiveni", "Yüzme Havuzu (Açık)", "Yüzme Havuzu (Kapalı)"],
  "Muhit / Konum": ["Alışveriş Merkezi", "Belediye", "Cami", "Cemevi", "Denize Sıfır", "Eczane", "Eğlence Merkezi", "Fuar Alanı", "Göl Manzaralı", "Hastane", "Havra", "İlkokul-Ortaokul", "İtfaiye", "Kilise", "Lise", "Market", "Merkezi", "Park", "Polis Merkezi", "Sağlık Ocağı", "Semt Pazarı", "Şehir Manzaralı", "Şehir Merkezi", "Üniversite"],
  "Ulaşım": ["Anayol", "Avrasya Tüneli", "Boğaz Köprüleri", "Cadde", "Dolmuş", "E-5", "Havaalanı", "İskele", "Marmaray", "Metro", "Metrobüs", "Minibüs", "Otobüs Durağı", "Sahil", "TEM", "Teleferik", "Tramvay", "Tren İstasyonu", "Troleybüs"]
};

const allCities = ["Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalva", "Karabük", "Kilis", "Osmaniye", "Düzce"].sort();

export default function RealEstateAssistant() {
  const [activeTab, setActiveTab] = useState('social');
  const [designMode, setDesignMode] = useState('single'); // 'single', 'double', 'triple', 'quad'
  const [isManualLocation, setIsManualLocation] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const socialPreviewRef = useRef(null);
  const vitrinPreviewRef = useRef(null); 
  const captureContainerRef = useRef(null); 
    
  const [isReady, setIsReady] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [customLogo, setCustomLogo] = useState(null); 
  const [themeColor, setThemeColor] = useState('#ea580c');
  const [showWebsiteOzcan, setShowWebsiteOzcan] = useState(true);
  const [showWebsiteEmlaknomi, setShowWebsiteEmlaknomi] = useState(true);

  const [consultant, setConsultant] = useState({
    name: 'Özcan AKTAŞ',
    phone: '0533 638 7000',
    photo: DEFAULT_PROFILE_PHOTO,
    showInfo: true,
    showPhoto: true
  });

  const [selectedOffice, setSelectedOffice] = useState('eregli');
    
  const [formData, setFormData] = useState({
    customTitle: '',
    title: '', price: '', currency: 'TL',
    city: 'Konya', district: 'Ereğli', neighborhood: 'Yunuslu',
    type: 'Satılık Daire', adNumber: '', 
    // ... (Diğer alanlar aynı)
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
  });

  const [privateData, setPrivateData] = useState({
    customerName: '', contactInfo: '', finalPrice: '', commission: '', propertyNo: '', notes: '', 
    date: new Date().toISOString().split('T')[0],
    deedStatusPrivate: '', doorCode: '', swapPrivate: '', openAddress: ''
  });

  // ... (useEffect ve helper fonksiyonlar aynı)
  useEffect(() => {
    document.title = "Özcan AKTAŞ - Emlaknomi Pro";
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) metaViewport.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";

    if (!document.querySelector('link[rel="manifest"]')) {
      const link = document.createElement('link'); link.rel = 'manifest';
      const manifest = { name: "Emlaknomi Pro", short_name: "EmlakAsistan", start_url: ".", display: "standalone", background_color: "#ffffff", theme_color: "#ea580c", icons: [{ src: FIXED_LOGO_URL, sizes: "192x192", type: "image/png" }] };
      link.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(manifest));
      document.head.appendChild(link);
    }

    const loadScript = (src) => {
      return new Promise((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        const script = document.createElement('script'); script.src = src; script.onload = resolve; script.onerror = () => console.warn(`Script yüklenemedi: ${src}`); document.head.appendChild(script);
      });
    };

    Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
      loadScript('https://cdn.tailwindcss.com')
    ]).then(() => {
        const checkTailwind = setInterval(() => { if (window.tailwind) { clearInterval(checkTailwind); setIsReady(true); } }, 50);
        setTimeout(() => { clearInterval(checkTailwind); setIsReady(true); }, 2000);
    });

    const savedLogo = localStorage.getItem('emlaknomi_custom_logo');
    if (savedLogo) { setCustomLogo(savedLogo); setShowLogo(true); }
  }, []);

  const [openCategories, setOpenCategories] = useState({ "İç Özellikler": true, "Dış Özellikler": true, "Muhit / Konum": false, "Ulaşım": false });
  const toggleCategory = (category) => setOpenCategories(prev => ({...prev, [category]: !prev[category]}));
  const placeholderImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80';

  const formatNumber = (value) => { if (!value) return ''; return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, "."); };
  const handleInputChange = (e) => { const { name, value } = e.target; if (['price', 'kiraBedeli'].includes(name)) { setFormData(prev => ({ ...prev, [name]: formatNumber(value) })); } else { setFormData(prev => ({ ...prev, [name]: value })); } };
  const handleInputBlur = (e) => { const { name, value } = e.target; if (['size', 'netSize', 'yolaTerk', 'yolaCephesi'].includes(name) && value && !value.includes('m²')) { setFormData(prev => ({ ...prev, [name]: `${value} m²` })); } };
  const handleConsultantChange = (e) => { const { name, value, type, checked } = e.target; setConsultant(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value })); };
  const handleProfilePhotoChange = (e) => { if (e.target.files && e.target.files[0]) { const file = e.target.files[0]; const reader = new FileReader(); reader.onloadend = () => { setConsultant(prev => ({ ...prev, photo: reader.result })); }; reader.readAsDataURL(file); } };
  const handlePrivateInputChange = (e) => { const { name, value } = e.target; if (['finalPrice', 'commission'].includes(name)) { setPrivateData(prev => ({ ...prev, [name]: formatNumber(value) })); } else { setPrivateData(prev => ({ ...prev, [name]: value })); } };
  const handleMultiSelect = (field, value) => { const current = Array.isArray(formData[field]) ? formData[field] : []; const updated = current.includes(value) ? current.filter(i => i !== value) : [...current, value]; setFormData(prev => ({ ...prev, [field]: updated })); };
  
  const handleOfficeChange = (e) => {
    const officeKey = e.target.value; setSelectedOffice(officeKey); setIsManualLocation(false);
    setConsultant(prev => ({ ...prev, phone: officeDetails[officeKey].phone }));
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
  const handleImageUpload = (e) => { if (e.target.files) { const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file)); setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] })); } };
  
  // --- FOTOĞRAF SİLME ---
  const removeImage = (index, e) => {
    e.stopPropagation();
    const newImages = formData.images.filter((_, i) => i !== index);
    let newCoverIndex = formData.coverImageIndex;
    if (index === formData.coverImageIndex) newCoverIndex = 0;
    else if (index < formData.coverImageIndex) newCoverIndex--;
    setFormData(prev => ({ ...prev, images: newImages, coverImageIndex: newCoverIndex }));
  };

  const handleLogoChange = (e) => { if (e.target.files && e.target.files[0]) { const file = e.target.files[0]; const reader = new FileReader(); reader.onloadend = () => { const base64Data = reader.result; setCustomLogo(base64Data); setShowLogo(true); try { localStorage.setItem('emlaknomi_custom_logo', base64Data); } catch (err) {} }; reader.readAsDataURL(file); } };
  const handleFeatureToggle = (feature) => { const newFeatures = formData.features.includes(feature) ? formData.features.filter(f => f !== feature) : [...formData.features, feature]; setFormData(prev => ({ ...prev, features: newFeatures })); };
  const copyToClipboard = (text) => navigator.clipboard.writeText(text);

  const getFloorDisplay = () => { const { floor, totalFloors } = formData; if (!floor) return null; if (isNaN(floor)) return floor; const fl = parseInt(floor); const tf = parseInt(totalFloors); if (!isNaN(tf)) { if (fl === tf) return "Son Kat"; if (fl > 0 && fl < tf) return "Ara Kat"; } return `${floor}. Kat`; };
  const getSubTypeLabel = () => { if (formData.konutTipi) return formData.konutTipi; if (formData.arsaTipi) return formData.arsaTipi; if (formData.gayrimenkulTipi) return formData.gayrimenkulTipi; if (formData.bahceTipi) return formData.bahceTipi; if (formData.tarlaTipi && formData.tarlaTipi.length > 0) return formData.tarlaTipi[0]; const split = formData.type.split(' '); if (split.length > 1) return split.slice(1).join(' '); return formData.type; };
  const getFullTypeLabel = () => { const operation = formData.type.split(' ')[0]; const subType = getSubTypeLabel(); return `${operation} ${subType}`.trim(); };
  const getGeneratedTitle = () => { if (formData.customTitle) return formData.customTitle; let parts = []; if (formData.neighborhood) parts.push(`${formData.neighborhood}'da`); if (formData.rooms) parts.push(formData.rooms); if (formData.type.includes('Daire') || formData.konutTipi) { const fd = getFloorDisplay(); if (fd) parts.push(fd); } parts.push(getFullTypeLabel()); return parts.join(' '); };

  const generateDescription = () => {
    const office = officeDetails[selectedOffice]; const generatedTitle = getGeneratedTitle();
    const addLine = (label, value, suffix = '') => { if (!value || value === '' || (Array.isArray(value) && value.length === 0)) return ''; const valStr = Array.isArray(value) ? value.join(', ') : value; return `> ${label}: ${valStr}${suffix}\n`; };
    
    // --- DÜZENLEME: İlan No Mantığı ---
    let detailsText = "";
    detailsText += `\n> İlan No: ${formData.adNumber || ''}\n\n`;

    if (formData.type.includes("Daire")) {
        detailsText += addLine('Konut Tipi', formData.konutTipi); detailsText += addLine('Oda Sayısı', formData.rooms); detailsText += addLine('Brüt m²', formData.size); detailsText += addLine('Net m²', formData.netSize); detailsText += addLine('Bulunduğu Kat', formData.floor); detailsText += addLine('Binadaki Kat', formData.totalFloors); detailsText += addLine('Kattaki Daire', formData.flatCountOnFloor); detailsText += addLine('Kat Tipi', formData.katTipi); detailsText += addLine('Bina Yaşı', formData.age); detailsText += addLine('Banyo Sayısı', formData.banyoSayisi); detailsText += addLine('Ebeveyn Banyo', formData.masterBath); detailsText += addLine('Tuvalet Sayısı', formData.wcCount); detailsText += addLine('Tuvalet Tipi', formData.tuvaletTipi); detailsText += addLine('Isıtma Tipi', formData.heating); detailsText += addLine('Isı Yalıtım', formData.insulation); detailsText += addLine('Balkon', formData.balconyCount); detailsText += addLine('Cam Balkon', formData.glassBalcony); detailsText += addLine('Kızartma Mutfağı', formData.kizartmaMutfagi); detailsText += addLine('Giyinme Odası', formData.giyinmeOdasi); detailsText += addLine('Çamaşır Odası', formData.camasirOdasi); detailsText += addLine('Asansör', formData.elevator); detailsText += addLine('İç Kapılar', formData.icKapilar); detailsText += addLine('Pencereler', formData.pencereler); detailsText += addLine('Asma Tavan', formData.asmaTavan); detailsText += addLine('Duşakabin', formData.dusakabin); detailsText += addLine('Vestiyer', formData.vestiyer); detailsText += addLine('Çatı Kaplama', formData.catiKaplama); detailsText += addLine('Zeminler', formData.zeminler); detailsText += addLine('Mutfak Dolabı', formData.mutfakDolabi); detailsText += addLine('Çelik Kapı', formData.celikKapi); detailsText += addLine('Kiler', formData.pantry); detailsText += addLine('Garaj', formData.garage); detailsText += addLine('Bahçe', formData.bahce); detailsText += addLine('Eşyalı mı', formData.esyali); detailsText += addLine('Otopark', formData.parking); detailsText += addLine('Panjur', formData.panjur); detailsText += addLine('Ankastre', formData.ankastre); detailsText += addLine('Site İçi', formData.siteIci); detailsText += addLine('Oyun Parkı', formData.oyunParki); detailsText += addLine('Kamelya', formData.kamelya); detailsText += addLine('Güvenlik', formData.guvenlik); detailsText += addLine('Aktivite', formData.aktivite); detailsText += addLine('Muhit', formData.mevki); detailsText += addLine('Aidat', formData.aidat); detailsText += addLine('Tapu Durumu', formData.deedStatus); detailsText += addLine('İskan/Oturum', formData.iskan); detailsText += addLine('Kullanım Durumu', formData.usageStatus); detailsText += addLine('Hisse Durumu', formData.hisseDurumu); detailsText += addLine('Kira Bedeli', formData.kiraBedeli);
    } else if (formData.type === "Satılık Arsa") { 
        detailsText += addLine('Arsa Tipi', formData.arsaTipi); detailsText += addLine('İmar Durumu', formData.imarDurumu); detailsText += addLine('Ada/Parsel', formData.adaParsel); detailsText += addLine('Metresi', formData.size); detailsText += addLine('T.A.K.S.', formData.taks); detailsText += addLine('K.A.K.S.', formData.kaks); detailsText += addLine('Nizam', formData.nizam); detailsText += addLine('Alt Yapı', formData.altYapi);
    } else if (formData.type === "Satılık Tarla" || formData.type === "Satılık Bahçe") {
        detailsText += addLine('Tarla Tipi', formData.tarlaTipi);
        detailsText += addLine('Bahçe Tipi', formData.bahceTipi);
        detailsText += addLine('Ada/Parsel', formData.adaParsel);
        detailsText += addLine('Metresi', formData.size);
        detailsText += addLine('Su Durumu', formData.suDurumu);
        detailsText += addLine('Elektrik Durumu', formData.elektrikDurumu);
        detailsText += addLine('Yol Durumu', formData.yolDurumu);
        detailsText += addLine('Yola Cephesi', formData.yolaCephesi);
        detailsText += addLine('Tel Örgü', formData.telOrgu);
        detailsText += addLine('Ev Durumu', formData.evDurumu);
        detailsText += addLine('Havuz Durumu', formData.havuzDurumu);
        detailsText += addLine('Depo/Garaj', formData.depoGaraj);
        detailsText += addLine('Teçhizat', formData.techizat);
        detailsText += addLine('Eğim', formData.egim);
        detailsText += addLine('Meyve Cinsi', formData.meyveCinsi);
        detailsText += addLine('Ağaç Sayısı', formData.agacSayisi);
        detailsText += addLine('Ağaç Yaşı', formData.agacYasi);
        detailsText += addLine('Hisse Durumu', formData.hisseDurumu);
    } else if (formData.type.includes("Ticari") || formData.type === "Devren Satılık") { 
        detailsText += addLine('Gayrimenkul Tipi', formData.gayrimenkulTipi); detailsText += addLine('Metresi', formData.size); detailsText += addLine('Kat Sayısı', formData.katSayisiTicari); 
    }

    detailsText += addLine('Cephe', formData.facade);
    if (formData.type !== "Devren Satılık" && !formData.type.includes('Kiralık')) { detailsText += addLine('Krediye Uygun', formData.creditSuitable); detailsText += addLine('Takas', formData.swapAvailable); }
    if (['Bireysel Garaj', 'Ortak Kullanım', 'Var'].includes(formData.garage)) { const garageText = formData.garage === "Var" ? "Otopark İmkanı" : formData.garage; detailsText += `> ÖZELLİK: ${garageText} Mevcuttur\n`; }
    detailsText += addLine('Diğer Özellikler', formData.digerOzellikler);
    let featuresText = ""; Object.keys(featureCategories).forEach(cat => { const selectedInCat = featureCategories[cat].filter(f => formData.features.includes(f)); if (selectedInCat.length > 0) { featuresText += `\n\n> ${cat.toUpperCase()}:\n` + selectedInCat.join(', '); } });
    const desc = `EMLAKNOMİ'DEN ${generatedTitle.toUpperCase()}\n\n` + `Konum: ${formData.city} / ${formData.district} / ${formData.neighborhood}\n\n` + `GAYRİMENKUL DETAYLARI\n` + detailsText + `${featuresText}\n\n\n` + `FİYAT: ${formData.price} ${formData.currency}\n\n` + `--------------------------------\n` + `${consultant.showInfo ? `Gayrimenkul Uzmanı - ${consultant.name}\nİletişim: ${consultant.phone}\n` : ''}` + `www.ozcanaktas.com\n\n` + `Ofis Adres: ${office.address}\n\n` + `Taşınmaz Ticareti Yetki Belge No: ${office.authNo}\n` + `www.emlaknomi.com\n\n` + `\nŞubeler: Karaman - Konya - Ereğli - Eskişehir - Alanya - Balıkesir - Kıbrıs`;
    setFormData(prev => ({ ...prev, description: desc }));
  };

  const captureElement = async (element, width = 1080, height = 1080) => {
    if (!window.html2canvas) return null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0'; 
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.zIndex = '-9999'; 
    container.style.overflow = 'hidden';
    container.style.backgroundColor = '#ffffff';
    
    const clone = element.cloneNode(true);
    clone.style.transform = 'none'; 
    clone.style.width = '100%';
    clone.style.height = '100%';
    clone.style.margin = '0';
    clone.style.padding = '0';
    
    container.appendChild(clone);
    document.body.appendChild(container);

    const images = clone.getElementsByTagName('img');
    await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
    }));

    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const canvas = await window.html2canvas(container, {
        useCORS: true,
        scale: 1, 
        width: width,
        height: height,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        backgroundColor: null
      });
      document.body.removeChild(container);
      document.body.style.overflow = originalOverflow;
      return canvas;
    } catch (err) {
      console.error("Capture error:", err);
      if (document.body.contains(container)) document.body.removeChild(container);
      document.body.style.overflow = originalOverflow;
      return null;
    }
  };

  const handleDownloadImageOnly = async () => {
      if (!captureContainerRef.current) return;
      const canvas = await captureElement(captureContainerRef.current, 1080, 1080);
      if (canvas) { canvas.toBlob((blob) => { window.saveAs(blob, `Emlak_Tasarim.png`); }); } else { alert("Hata oluştu."); }
  };

  const handleDownloadProject = async () => {
    if (!window.JSZip) { alert("Kütüphaneler Yüklenmedi. Lütfen sayfayı yenileyin."); return; }
    setIsDownloading(true);
    
    try {
        const zip = new window.JSZip();
        
        let safeNeighborhood = (formData.neighborhood || "Genel").trim();
        safeNeighborhood = safeNeighborhood.replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
                                           .replace(/Ğ/g, 'G').replace(/Ü/g, 'U').replace(/Ş/g, 'S').replace(/İ/g, 'I').replace(/Ö/g, 'O').replace(/Ç/g, 'C');

        let fileDetail = "Ilan";
        if (formData.konutTipi) fileDetail = formData.rooms || "Konut";
        else if (formData.arsaTipi) fileDetail = "Arsa";
        else if (formData.type.includes("Tarla")) {
            fileDetail = (formData.tarlaTipi && formData.tarlaTipi.length > 0) ? formData.tarlaTipi[0] : "Tarla";
        }
        else if (formData.bahceTipi) fileDetail = formData.bahceTipi;
        else fileDetail = getSubTypeLabel() || formData.type;
        
        fileDetail = fileDetail.replace(/[\/\\?%*:|"<>]/g, '').trim();
        const safePrice = (formData.price || "0").replace(/[^0-9]/g, '');
        const dateStamp = new Date().toISOString().slice(0,10).replace(/-/g, '');
        const folderName = `${dateStamp}_${safeNeighborhood}_${fileDetail}_${safePrice}TL`.replace(/\s+/g, '_');
        
        const rootFolder = zip.folder(folderName);
        const hamFolder = rootFolder.folder("1_HAM_FOTOLAR");
        
        if (formData.images.length > 0) {
          const imgPromises = formData.images.map(async (imgUrl, idx) => {
            try { const response = await fetch(imgUrl); const blob = await response.blob(); hamFolder.file(`resim_${idx + 1}.jpg`, blob); } catch (e) {}
          }); await Promise.all(imgPromises);
        }
        
        const tasarimFolder = rootFolder.folder("2_TASARIMLI");
        if (captureContainerRef.current) { const canvas = await captureElement(captureContainerRef.current, 1080, 1080); if (canvas) { const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png')); tasarimFolder.file(`sosyal_tasarim.png`, blob); } }
        
        const metinFolder = rootFolder.folder("3_ILAN_METNI");
        metinFolder.file("ilan_metni.txt", formData.description || "Lütfen 'Sihirli Metin Oluştur' butonuna basınız.");
        
        const ozelFolder = rootFolder.folder("4_OZEL_BILGI");
        const ozelContent = `MÜŞTERİ BİLGİ FORMU\nTarih: ${privateData.date}\nMüşteri Adı: ${privateData.customerName}\nİletişim: ${privateData.contactInfo}\nAçık Adres: ${privateData.openAddress}\nTaşınmaz No: ${privateData.propertyNo}\nKapı Şifresi: ${privateData.doorCode}\nTapu Durumu: ${privateData.deedStatusPrivate}\nTakas: ${privateData.swapPrivate}\nBiter Fiyat: ${privateData.finalPrice}\nKomisyon: ${privateData.commission}\nNotlar: ${privateData.notes}`;
        ozelFolder.file("Ozel_Bilgiler.txt", ozelContent);
        
        const vitrinFolder = rootFolder.folder("5_VITRIN");
        if (vitrinPreviewRef.current) { const canvas = await captureElement(vitrinPreviewRef.current, 794, 1123); if (canvas) { const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png')); vitrinFolder.file(`vitrin_tasarim.png`, blob); } }
        
        const content = await zip.generateAsync({ type: "blob" });
        window.saveAs(content, `${folderName}.zip`);

    } catch (error) {
        console.error("ZIP Oluşturma Hatası:", error);
        alert("İndirme sırasında bir hata oluştu: " + error.message);
    } finally {
        setIsDownloading(false);
    }
  };

  const renderDynamicFields = () => {
      const t = formData.type;
      
      const renderKonutFields = () => (
        <>
            <SelectField label="Konut Tipi" name="konutTipi" value={formData.konutTipi} onChange={handleInputChange} options={options.konutTipi} />
            <SelectField label="Oda Sayısı" name="rooms" value={formData.rooms} onChange={handleInputChange} options={options.rooms} />
            <InputField label="Brüt m²" name="size" value={formData.size} onChange={handleInputChange} onBlur={handleInputBlur} />
            <InputField label="Net m²" name="netSize" value={formData.netSize} onChange={handleInputChange} onBlur={handleInputBlur} />
            <SelectField label="Bulunduğu Kat" name="floor" value={formData.floor} onChange={handleInputChange} options={options.floors} />
            <SelectField label="Kat Sayısı" name="totalFloors" value={formData.totalFloors} onChange={handleInputChange} options={options.totalFloors} />
            <SelectField label="Kattaki Daire" name="flatCountOnFloor" value={formData.flatCountOnFloor} onChange={handleInputChange} options={options.flatCount} />
            <SelectField label="Kat Tipi" name="katTipi" value={formData.katTipi} onChange={handleInputChange} options={options.katTipi} />
            <MultiSelectField label="Cephe" field="facade" value={formData.facade} onChange={handleMultiSelect} options={options.facade} themeColor={themeColor} />
            <SelectField label="Bina Yaşı" name="age" value={formData.age} onChange={handleInputChange} options={options.age} />
            <SelectField label="Banyo Sayısı" name="banyoSayisi" value={formData.banyoSayisi} onChange={handleInputChange} options={options.banyoSayisi} />
            <SelectField label="Ebeveyn Banyo" name="masterBath" value={formData.masterBath} onChange={handleInputChange} options={["Var", "Yok"]} />
            <SelectField label="Tuvalet Sayısı" name="wcCount" value={formData.wcCount} onChange={handleInputChange} options={options.wcCount} />
            <MultiSelectField label="Tuvalet Tipi" field="tuvaletTipi" value={formData.tuvaletTipi} onChange={handleMultiSelect} options={options.tuvaletTipi} themeColor={themeColor} />
            <MultiSelectField label="Isıtma Tipi" field="heating" value={formData.heating} onChange={handleMultiSelect} options={options.heating} themeColor={themeColor} />
            <SelectField label="Isı Yalıtım" name="insulation" value={formData.insulation} onChange={handleInputChange} options={options.insulation} />
            <SelectField label="Balkon Sayısı" name="balconyCount" value={formData.balconyCount} onChange={handleInputChange} options={options.balcony} />
            <SelectField label="Cam Balkon" name="glassBalcony" value={formData.glassBalcony} onChange={handleInputChange} options={options.glassBalcony} />
            <SelectField label="Kızartma Mutfağı" name="kizartmaMutfagi" value={formData.kizartmaMutfagi} onChange={handleInputChange} options={["Var", "Yok"]} />
            <SelectField label="Giyinme Odası" name="giyinmeOdasi" value={formData.giyinmeOdasi} onChange={handleInputChange} options={["Var", "Yok"]} />
            <SelectField label="Çamaşır Odası" name="camasirOdasi" value={formData.camasirOdasi} onChange={handleInputChange} options={["Var", "Yok"]} />
            <SelectField label="Asansör" name="elevator" value={formData.elevator} onChange={handleInputChange} options={options.elevator} />
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
                <InputField label="Yola Cephesi" name="yolaCephesi" value={formData.yolaCephesi} onChange={handleInputChange} onBlur={handleInputBlur} />
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
                
                {t !== "Kiralık Ticari" && t !== "Devren Satılık" && (
                    <SelectField label="Kiracılı mı" name="kiracilimi" value={formData.kiracilimi} onChange={handleInputChange} options={["Evet", "Hayır"]} />
                )}
                
                <InputField label="Kira Bedeli" name="kiraBedeli" value={formData.kiraBedeli} onChange={handleInputChange} />
                <MultiSelectField label="Alt Yapı" field="altYapi" value={formData.altYapi} onChange={handleMultiSelect} options={options.altYapi} themeColor={themeColor} />
                <MultiSelectField label="Mevki" field="mevki" value={formData.mevki} onChange={handleMultiSelect} options={options.mevki} themeColor={themeColor} />
                
                {t !== "Kiralık Ticari" && t !== "Devren Satılık" && (
                    <>
                        <SelectField label="Takas" name="swapAvailable" value={formData.swapAvailable} onChange={handleInputChange} options={options.swap} />
                        <SelectField label="Kredi" name="creditSuitable" value={formData.creditSuitable} onChange={handleInputChange} options={options.credit} />
                        <SelectField label="Hisse Durumu" name="hisseDurumu" value={formData.hisseDurumu} onChange={handleInputChange} options={options.hisse} />
                    </>
                )}
                
                {t === "Devren Satılık" && (
                    <SelectField label="Takas" name="swapAvailable" value={formData.swapAvailable} onChange={handleInputChange} options={options.swap} />
                )}

                {t === "Kiralık Ticari" && (
                    <>
                    </>
                )}
              </>
          );
      }

      return null;
  };
  
  // --- VİTRİN DETAY RENDER ---
  const renderVitrinDetails = () => {
      const t = formData.type;
      
      // ARSA
      if (t === "Satılık Arsa") {
          return (
              <>
                <div className="bg-slate-50 p-2 rounded border flex justify-between items-center"><span>Fiyat:</span> <span className="font-bold text-base text-orange-600">{formData.price} {formData.currency}</span></div>
                <div className="bg-slate-50 p-2 rounded border flex justify-between items-center"><span>Metrekare:</span> <span className="font-bold">{formData.size}</span></div>
                <div className="bg-slate-50 p-2 rounded border flex justify-between items-center"><span>Ada/Parsel:</span> <span className="font-bold">{formData.adaParsel || '-'}</span></div>
                <div className="bg-slate-50 p-2 rounded border flex justify-between items-center"><span>Kat Adedi:</span> <span className="font-bold">{formData.katAdedi || '-'}</span></div>
                <div className="bg-slate-50 p-2 rounded border flex justify-between items-center"><span>T.A.K.S.:</span> <span className="font-bold">{formData.taks || '-'}</span></div>
                <div className="bg-slate-50 p-2 rounded border flex justify-between items-center"><span>K.A.K.S.:</span> <span className="font-bold">{formData.kaks || '-'}</span></div>
                <div className="bg-slate-50 p-2 rounded border flex justify-between items-center"><span>İmar:</span> <span className="font-bold">{formData.imarDurumu || '-'}</span></div>
              </>
          );
      }

      // TARLA / BAHÇE
      if (t === "Satılık Tarla" || t === "Satılık Bahçe") {
          return (
              <>
                <div className="bg-slate-50 p-2 rounded border flex justify-between items-center"><span>Fiyat:</span> <span className="font-bold text-base text-orange-600">{formData.price} {formData.currency}</span></div>
                <div className="bg-slate-50 p-2 rounded border flex justify-between items-center"><span>Metrekare:</span> <span className="font-bold">{formData.size}</span></div>
                <div className="bg-slate-50 p-2 rounded border flex justify-between items-center"><span>Ada/Parsel:</span> <span className="font-bold">{formData.adaParsel || '-'}</span></div>
                <div className="bg-slate-50 p-2 rounded border flex justify-between items-center"><span>Su Durumu:</span> <span className="font-bold">{formData.suDurumu.join(', ') || '-'}</span></div>
                {t === "Satılık Bahçe" && <div className="bg-slate-50 p-2 rounded border flex justify-between items-center"><span>Bahçe Tipi:</span> <span className="font-bold">{formData.bahceTipi || '-'}</span></div>}
              </>
          );
      }

      // DAİRE (Varsayılan)
      return (
          <>
            <div className="bg-slate-50 p-2 rounded border flex justify-between items-center"><span>Fiyat:</span> <span className="font-bold text-base text-orange-600">{formData.price} {formData.currency}</span></div>
            <div className="bg-slate-50 p-2 rounded border flex justify-between items-center"><span>Metrekare:</span> <span className="font-bold">{formData.size}</span></div>
            {formData.rooms && <div className="bg-slate-50 p-2 rounded border flex justify-between"><span>Oda:</span> <span className="font-bold">{formData.rooms}</span></div>}
            {formData.floor && <div className="bg-slate-50 p-2 rounded border flex justify-between"><span>Kat:</span> <span className="font-bold">{getFloorDisplay()}</span></div>}
            {formData.age && <div className="bg-slate-50 p-2 rounded border flex justify-between"><span>Bina Yaşı:</span> <span className="font-bold">{formData.age}</span></div>}
            
            <div className="bg-slate-50 p-2 rounded border flex justify-between">
                <span>{formData.facade && formData.facade.length > 0 ? 'Cephe:' : 'Asansör:'}</span>
                <span className="font-bold text-right">
                    {formData.facade && formData.facade.length > 0 
                        ? (Array.isArray(formData.facade) ? formData.facade.join(', ') : formData.facade) 
                        : (formData.elevator || '-')}
                </span>
            </div>

            {['Bireysel Garaj', 'Ortak Kullanım', 'Var'].includes(formData.garage) && (
                <div className="bg-slate-50 p-2 rounded border flex justify-between bg-orange-50 border-orange-200">
                    <span className="flex items-center text-orange-700 font-bold"><Car size={14} className="mr-1"/> Özellik:</span>
                    <span className="font-bold text-orange-700">{formData.garage === "Var" ? "Otopark" : formData.garage}</span>
                </div>
            )}
          </>
      );
  };

  // --- SOSYAL MEDYA TASARIM ---
  const SocialDesign = ({ isCapture = false }) => {
      // Çoklu Fotoğraf Grid Mantığı
      const renderImages = () => {
          const imgs = formData.images;
          const count = imgs.length;
          const defaultImg = placeholderImage;

          if (designMode === 'single' || count === 0) {
              return <img src={imgs[formData.coverImageIndex] || defaultImg} className="w-full h-full object-cover opacity-90" crossOrigin="anonymous"/>;
          }
          if (designMode === 'double') {
              return (
                  <div className="grid grid-cols-2 h-full w-full">
                      <div className="border-r border-white/20 h-full overflow-hidden"><img src={imgs[0] || defaultImg} className="w-full h-full object-cover" crossOrigin="anonymous"/></div>
                      <div className="h-full overflow-hidden"><img src={imgs[1] || defaultImg} className="w-full h-full object-cover" crossOrigin="anonymous"/></div>
                  </div>
              );
          }
          if (designMode === 'triple') {
              return (
                  <div className="grid grid-cols-2 h-full w-full">
                      <div className="border-r border-white/20 h-full overflow-hidden"><img src={imgs[0] || defaultImg} className="w-full h-full object-cover" crossOrigin="anonymous"/></div>
                      <div className="grid grid-rows-2 h-full">
                          <div className="border-b border-white/20 h-full overflow-hidden"><img src={imgs[1] || defaultImg} className="w-full h-full object-cover" crossOrigin="anonymous"/></div>
                          <div className="h-full overflow-hidden"><img src={imgs[2] || defaultImg} className="w-full h-full object-cover" crossOrigin="anonymous"/></div>
                      </div>
                  </div>
              );
          }
          if (designMode === 'quad') {
              return (
                  <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
                      <div className="border-r border-b border-white/20 h-full overflow-hidden"><img src={imgs[0] || defaultImg} className="w-full h-full object-cover" crossOrigin="anonymous"/></div>
                      <div className="border-b border-white/20 h-full overflow-hidden"><img src={imgs[1] || defaultImg} className="w-full h-full object-cover" crossOrigin="anonymous"/></div>
                      <div className="border-r border-white/20 h-full overflow-hidden"><img src={imgs[2] || defaultImg} className="w-full h-full object-cover" crossOrigin="anonymous"/></div>
                      <div className="h-full overflow-hidden"><img src={imgs[3] || defaultImg} className="w-full h-full object-cover" crossOrigin="anonymous"/></div>
                  </div>
              );
          }
          return null;
      };

      return (
        <div className="w-[1080px] h-[1080px] bg-slate-900 relative flex-shrink-0 font-sans text-left">
            {renderImages()}
            {showLogo && (
            <div className="absolute top-2 right-2 w-48 h-32 flex items-center justify-center z-20">
                <img src={customLogo || FIXED_LOGO_URL} crossOrigin="anonymous" className="max-w-full max-h-full object-contain drop-shadow-2xl" />
            </div>
            )}
            <div className="absolute top-8 left-0 flex flex-col items-start gap-2 z-20 max-w-[650px]">
                <div className="text-white px-6 py-2 text-3xl font-bold shadow-md rounded-r-xl tracking-wide" style={{backgroundColor: themeColor}}>{getFullTypeLabel().toLocaleUpperCase('tr-TR')}</div>
                {!(formData.type === "Devren Satılık" || formData.type === "Satılık Ticari" || formData.type === "Kiralık Ticari") && (
                    <div className="bg-slate-900 text-white px-5 py-2 text-xl font-medium shadow-md rounded-r-xl border-l-4" style={{borderColor: themeColor}}>{formData.neighborhood} Mh.</div>
                )}
                {formData.adNumber && (
                    <div className="bg-white text-slate-900 px-4 py-1 text-base font-bold shadow-md rounded-r-lg mt-1 border-l-4 border-slate-500">No: {formData.adNumber}</div>
                )}
            </div>
            <div className="absolute bottom-0 left-0 w-full p-12 bg-gradient-to-t from-black via-black/80 to-transparent text-white z-20">
            <h2 className="text-5xl font-bold leading-tight mb-5 drop-shadow-md">{getGeneratedTitle()}</h2>
            <div className="flex items-center text-3xl mb-8 text-slate-300 font-medium"><MapPin className="mr-2" style={{color: themeColor}} size={32} />{formData.district} / {formData.city}</div>
            <div className="flex justify-between items-center mb-6 border-t-2 border-white/30 pt-6 mt-2">
                <div className="flex space-x-8 text-3xl font-medium">
                    {formData.type.includes('Daire') ? (
                        <>
                            <span className="flex items-center"><Home className="mr-3 opacity-80" size={32}/>{formData.rooms}</span>
                            <span className="w-0.5 h-8 bg-white/40"></span>
                            {/* DÜZENLEME: Burada 'm²' kaldırıldı, çünkü formData.size içinde zaten var */}
                            <span className="flex items-center"><Layout className="mr-3 opacity-80" size={32}/>{formData.size}</span>
                            <span className="w-0.5 h-8 bg-white/40"></span>
                            <span className="flex items-center"><Building className="mr-2 opacity-80" size={32}/>{getFloorDisplay()}</span>
                        </>
                    ) : (
                        <>
                            {/* DÜZENLEME: Burada da 'm²' kaldırıldı */}
                            <span className="flex items-center"><Layout className="mr-3 opacity-80" size={32}/>{formData.size}</span>
                            <span className="w-0.5 h-8 bg-white/40"></span>
                            <span className="flex items-center">{getSubTypeLabel()}</span>
                        </>
                    )}
                    {['Bireysel Garaj', 'Ortak Kullanım', 'Var'].includes(formData.garage) && (
                        <>
                            <span className="w-0.5 h-8 bg-white/40"></span>
                            <span className="flex items-center text-orange-400 bg-white/10 px-3 py-1 rounded"><Car className="mr-2" size={32}/> {formData.garage === "Var" ? "Otopark" : formData.garage}</span>
                        </>
                    )}
                </div>
                <div className="text-5xl font-bold bg-white/10 px-8 py-3 rounded-lg text-orange-500 backdrop-blur-sm shadow-sm whitespace-nowrap">{formData.price} {formData.currency}</div>
            </div>
            {consultant.showInfo && (
                <div className="flex justify-between items-end">
                    <div className="flex items-center text-white bg-black/60 px-10 py-5 rounded-2xl border border-white/20"> 
                        {consultant.showPhoto && (
                            <div className="w-32 h-32 bg-slate-200 rounded-full mr-8 overflow-hidden border-4 border-orange-500 shadow-lg relative"><img src={consultant.photo} className="w-full h-full object-cover object-top" crossOrigin="anonymous"/></div>
                        )}
                        <div><div className="text-4xl font-bold leading-none mb-3" style={{color: themeColor}}>{consultant.name}</div><div className="text-3xl font-mono text-slate-200">{consultant.phone}</div></div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-3">
                        {showWebsiteOzcan && <div className="text-xl font-bold text-white px-6 py-2 rounded shadow-sm flex items-center" style={{backgroundColor: themeColor}}><Globe size={24} className="mr-2"/> www.ozcanaktas.com</div>}
                        {showWebsiteEmlaknomi && <div className="text-xl font-bold text-slate-900 bg-white px-6 py-2 rounded shadow-sm flex items-center"><Globe size={24} className="mr-2"/> www.emlaknomi.com</div>}
                    </div>
                </div>
            )}
            </div>
        </div>
      );
  };

  if (!isReady) return <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800"><Loader2 className="animate-spin text-orange-600 mb-4" size={48} /><h2 className="text-xl font-bold">Hazırlanıyor...</h2></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-orange-200 selection:text-orange-900">
      <header className="bg-slate-900 text-white p-4 shadow-lg print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2"><Home className="text-orange-500" size={28} /><h1 className="text-xl font-bold">Özcan AKTAŞ - Emlaknomi <span className="text-orange-500 font-light">Pro</span></h1></div>
          <div className="flex items-center space-x-4">
             <button onClick={handleDownloadProject} disabled={isDownloading} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center font-bold text-sm transition-colors disabled:opacity-50">{isDownloading ? 'Hazırlanıyor...' : <><Download size={18} className="mr-2"/> İndir (ZIP)</>}</button>
             <div className="h-8 w-8 bg-orange-500 rounded flex items-center justify-center font-bold border border-orange-600">ÖA</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 print:hidden">
          <div className="bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-700 text-white">
            <h2 className="text-lg font-semibold mb-4 flex items-center text-slate-100"><User className="mr-2 text-orange-500" size={20} /> Ayarlar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div><label className="block text-sm font-medium text-slate-400 mb-1">Şube</label><select value={selectedOffice} onChange={handleOfficeChange} className="w-full p-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:border-orange-500"><option value="eregli">Ereğli</option><option value="karaman">Karaman</option><option value="konya">Konya</option><option value="alanya">Alanya</option></select></div>
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
                            <button onClick={(e) => removeImage(idx, e)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-700" title="Fotoğrafı Sil">
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                 </div>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <label className="text-xs text-orange-800 font-bold mb-1 block">İlan Başlığı</label>
                  <div className="flex items-center gap-2"><span className="font-bold text-orange-700 whitespace-nowrap">Emlaknomi'den</span><input type="text" name="customTitle" value={formData.customTitle} onChange={handleInputChange} placeholder="Otomatik (Boş bırakınız)" className="w-full p-2 border border-orange-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"/></div>
                  <p className="text-[10px] text-orange-600 mt-1">* Boş bırakılırsa: Mahalle + Oda + Kat + Tip otomatik yazılır.</p>
              </div>
              <div><label className="text-xs text-slate-500 font-bold mb-1 block">Emlak Tipi</label><select name="type" value={formData.type} onChange={handleInputChange} className="w-full p-2 border rounded bg-white text-slate-800 font-bold"><option>Satılık Daire</option><option>Kiralık Daire</option><option>Satılık Arsa</option><option>Satılık Tarla</option><option>Satılık Bahçe</option><option>Satılık Ticari</option><option>Kiralık Ticari</option><option>Devren Satılık</option></select></div>
              <div className="grid grid-cols-2 gap-4"><InputField label="Fiyat" name="price" value={formData.price} onChange={handleInputChange} /><div><label className="text-xs text-slate-500 font-bold mb-1 block">Birim</label><select name="currency" value={formData.currency} onChange={handleInputChange} className="w-full p-2 border rounded bg-white text-slate-800"><option>TL</option><option>USD</option><option>EUR</option></select></div></div>
              <div className="bg-slate-50 p-3 rounded border">
                  <div className="flex justify-between mb-2"><span className="text-sm font-bold">Konum</span><button onClick={()=>setIsManualLocation(!isManualLocation)} className="text-xs text-blue-600 underline">Manuel Gir</button></div>
                  {isManualLocation ? (<div className="grid grid-cols-3 gap-2"><select name="city" value={formData.city} onChange={handleCityChange} className="p-1 border rounded text-xs bg-white text-slate-800">{allCities.map(c=><option key={c}>{c}</option>)}</select><input name="district" value={formData.district} onChange={handleInputChange} placeholder="İlçe" className="p-1 border rounded text-xs" /><input name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} placeholder="Mahalle" className="p-1 border rounded text-xs" /></div>) : (<div className="grid grid-cols-3 gap-2"><select name="city" value={formData.city} onChange={handleCityChange} className="p-1 border rounded text-xs bg-white text-slate-800">{allCities.map(c=><option key={c}>{c}</option>)}</select><select name="district" value={formData.district} onChange={handleDistrictChange} className="p-1 border rounded text-xs bg-white text-slate-800">{detailedCities.includes(formData.city) ? Object.keys(locationData[formData.city]||{}).map(d=><option key={d}>{d}</option>) : <option>Yok</option>}</select><select name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} className="p-1 border rounded text-xs bg-white text-slate-800">{(locationData[formData.city]?.[formData.district]||[]).map(n=><option key={n}>{n}</option>)}</select></div>)}
              </div>
              <InputField label="İlan No (Opsiyonel)" name="adNumber" value={formData.adNumber} onChange={handleInputChange} />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {renderDynamicFields()}
              </div>
              <div className="pt-2"><label className="text-xs text-slate-500 font-bold mb-1 block">Diğer Özellikler (Metin)</label><textarea name="digerOzellikler" value={formData.digerOzellikler} onChange={handleInputChange} className="w-full p-2 border rounded text-sm" rows={2}/></div>
              <div className="space-y-2">{Object.keys(featureCategories).map((cat) => (<div key={cat} className="border rounded overflow-hidden"><button onClick={()=>toggleCategory(cat)} className="w-full p-2 bg-slate-50 text-left text-xs font-bold flex justify-between">{cat} {openCategories[cat] ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}</button>{openCategories[cat] && <div className="p-2 flex flex-wrap gap-1">{featureCategories[cat].map(f=><button key={f} onClick={()=>handleFeatureToggle(f)} className={`px-2 py-1 border rounded text-[10px] ${formData.features.includes(f)?'bg-orange-500 text-white':''}`}>{f}</button>)}</div>}</div>))}</div>
              <button onClick={generateDescription} className="w-full py-3 bg-slate-800 text-white rounded font-bold hover:bg-slate-700 transition-colors">Sihirli Metin Oluştur (Yenile)</button>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={6} className="w-full p-2 border rounded text-xs font-mono" placeholder="Metin burada oluşacak..."/>
              <div className="bg-red-50 p-4 rounded border-dashed border-red-200">
                  <div className="text-red-600 font-bold text-xs mb-2 flex items-center"><Lock size={12} className="mr-1"/> Gizli Bilgiler</div>
                  <div className="grid grid-cols-2 gap-2">
                      <div className="col-span-2"><label className="block text-xs text-slate-500 mb-1 font-bold">Tarih</label><input type="date" name="date" value={privateData.date} onChange={handlePrivateInputChange} className="w-full p-2 border rounded-lg text-xs bg-white"/></div>
                      <input name="customerName" value={privateData.customerName} onChange={handlePrivateInputChange} placeholder="Müşteri Adı" className="p-2 border rounded text-xs"/><input name="contactInfo" value={privateData.contactInfo} onChange={handlePrivateInputChange} placeholder="İletişim" className="p-2 border rounded text-xs"/><textarea name="openAddress" value={privateData.openAddress} onChange={handlePrivateInputChange} placeholder="Açık Adres" className="col-span-2 p-2 border rounded text-xs" rows={2}/><input name="propertyNo" value={privateData.propertyNo} onChange={handlePrivateInputChange} placeholder="Taşınmaz No" className="p-2 border rounded text-xs"/><input name="doorCode" value={privateData.doorCode} onChange={handlePrivateInputChange} placeholder="Kapı Şifresi" className="p-2 border rounded text-xs"/><input name="deedStatusPrivate" value={privateData.deedStatusPrivate} onChange={handlePrivateInputChange} placeholder="Tapu Durumu" className="p-2 border rounded text-xs"/><input name="swapPrivate" value={privateData.swapPrivate} onChange={handlePrivateInputChange} placeholder="Takas" className="p-2 border rounded text-xs"/><input name="finalPrice" value={privateData.finalPrice} onChange={handlePrivateInputChange} placeholder="Biter Fiyat" className="p-2 border rounded text-xs"/><input name="commission" value={privateData.commission} onChange={handlePrivateInputChange} placeholder="Komisyon" className="p-2 border rounded text-xs"/><textarea name="notes" value={privateData.notes} onChange={handlePrivateInputChange} placeholder="Notlar..." className="col-span-2 p-2 border rounded text-xs"/>
                  </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex bg-white p-1 rounded border">
            <button onClick={() => setActiveTab('social')} className={`flex-1 py-2 text-xs font-bold rounded ${activeTab === 'social' ? 'bg-orange-500 text-white' : 'text-slate-500'}`}>Sosyal Medya</button>
            <button onClick={() => setActiveTab('whatsapp')} className={`flex-1 py-2 text-xs font-bold rounded ${activeTab === 'whatsapp' ? 'bg-green-500 text-white' : 'text-slate-500'}`}>WhatsApp</button>
            <button onClick={() => setActiveTab('print')} className={`flex-1 py-2 text-xs font-bold rounded ${activeTab === 'print' ? 'bg-blue-500 text-white' : 'text-slate-500'}`}>Vitrin</button>
          </div>

          {activeTab === 'social' && (
            <div className="bg-white p-4 rounded shadow border">
              <div className="flex justify-between mb-4">
                  <span className="text-xs font-bold text-slate-500">INSTAGRAM (1080x1080)</span>
                  <button onClick={handleDownloadImageOnly} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded font-bold">Görsel İndir</button>
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
                    <div ref={socialPreviewRef} className="shadow-2xl">
                         <SocialDesign isCapture={false} />
                    </div>
                  </div>
              </div>
            </div>
          )}

          {/* VİTRİN - Hem Görüntüleme Hem Capture İçin */}
          {/* Gizli Capture Container - Vitrin için */}
          <div style={{position: 'absolute', top: -9999, left: -9999, width: '794px', height: '1123px'}}>
             <div ref={vitrinPreviewRef} className="w-[794px] h-[1123px] bg-white p-8 flex flex-col relative text-slate-800">
                <div className="flex justify-between items-center border-b-4 border-orange-500 pb-4 mb-4 relative z-10">
                   {showLogo ? <img src={customLogo || FIXED_LOGO_URL} className="h-20 object-contain"/> : null}
                   <div className="text-right">
                       <div className="font-bold text-xl">{consultant.name}</div>
                       <div className="text-lg">{consultant.phone}</div>
                       {showWebsiteOzcan && <div className="text-sm text-slate-500">www.ozcanaktas.com</div>}
                   </div>
                </div>
                <div className="w-full h-[500px] bg-slate-100 mb-6 overflow-hidden rounded relative z-0">
                  <img src={formData.images.length > 0 ? formData.images[formData.coverImageIndex] : placeholderImage} className="w-full h-full object-cover" />
                  <div className="absolute top-0 right-0 bg-orange-600 text-white px-6 py-3 font-bold text-xl shadow">{getFullTypeLabel()}</div>
                </div>
                <h1 className="text-4xl font-bold mb-3 leading-tight relative z-10">
                    {getGeneratedTitle()}
                </h1>
                <div className="text-lg text-slate-500 mb-8 flex items-center relative z-10"><MapPin size={20} className="mr-2"/> {formData.neighborhood}, {formData.district} / {formData.city}</div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-8 relative z-10">
                   {renderVitrinDetails()}
                </div>
                <div className="mt-auto pt-6 border-t text-center text-sm text-slate-400 relative z-10">
                    {showWebsiteEmlaknomi && <span>www.emlaknomi.com &bull; </span>}
                    {officeDetails[selectedOffice].address}
                </div>
             </div>
          </div>
          
          {/* GİZLİ SOSYAL MEDYA CONTAINER - SADECE İNDİRME İÇİN */}
          <div style={{position: 'absolute', top: -9999, left: -9999, width: '1080px', height: '1080px'}}>
             <div ref={captureContainerRef}>
                <SocialDesign isCapture={true} />
             </div>
          </div>

          {activeTab === 'print' && (
            <div className="bg-white p-4 rounded shadow border">
              <h3 className="text-xs font-bold text-slate-500 mb-2">VİTRİN (A4)</h3>
              <div className="aspect-[1/1.414] w-full bg-white border shadow-lg p-6 flex flex-col relative overflow-hidden scale-90 origin-top text-slate-800">
                <div className="flex justify-between items-center border-b-4 border-orange-500 pb-4 mb-4 relative z-10">
                   {showLogo ? <img src={customLogo || FIXED_LOGO_URL} className="h-16 object-contain"/> : null}
                   <div className="text-right">
                       <div className="font-bold text-lg">{consultant.name}</div>
                       <div className="text-sm">{consultant.phone}</div>
                       {showWebsiteOzcan && <div className="text-xs text-slate-500">www.ozcanaktas.com</div>}
                   </div>
                </div>
                {/* VİTRİN RESMİ */}
                <div className="w-full h-96 bg-slate-100 mb-4 overflow-hidden rounded relative z-0">
                  <img src={formData.images.length > 0 ? formData.images[formData.coverImageIndex] : placeholderImage} className="w-full h-full object-cover" />
                  <div className="absolute top-0 right-0 bg-orange-600 text-white px-4 py-2 font-bold shadow">{getFullTypeLabel()}</div>
                </div>
                <h1 className="text-2xl font-bold mb-2 leading-tight relative z-10">
                    {getGeneratedTitle()}
                </h1>
                <div className="text-sm text-slate-500 mb-6 flex items-center relative z-10"><MapPin size={16} className="mr-1"/> {formData.neighborhood}, {formData.district} / {formData.city}</div>
                <div className="grid grid-cols-2 gap-3 text-xs mb-6 relative z-10">
                   {renderVitrinDetails()}
                </div>
                <div className="mt-auto pt-4 border-t text-center text-xs text-slate-400 relative z-10">
                    {showWebsiteEmlaknomi && <span>www.emlaknomi.com &bull; </span>}
                    {officeDetails[selectedOffice].address}
                </div>
              </div>
              <button onClick={() => window.print()} className="mt-4 w-full py-2 bg-slate-800 text-white rounded font-bold"><Printer size={16} className="inline mr-2"/> Yazdır</button>
            </div>
          )}
          
          {activeTab === 'whatsapp' && (
            <div className="bg-white p-4 rounded shadow border">
              <h3 className="text-xs font-bold text-slate-500 mb-2">WHATSAPP</h3>
              <div className="bg-green-50 p-3 rounded border border-green-200 text-xs font-mono whitespace-pre-wrap h-64 overflow-y-auto">{formData.description}</div>
              <button onClick={() => copyToClipboard(formData.description)} className="mt-2 w-full py-2 bg-green-600 text-white rounded font-bold">Kopyala</button>
            </div>
          )}
        </div>
      </main>
      <style>{`@media print {@page { margin: 0; size: A4; } body { -webkit-print-color-adjust: exact; }}`}</style>
    </div>
  );
}
