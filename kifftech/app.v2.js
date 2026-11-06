// ============ LOCAL_DB (56 produits illustrés) ============
const LOCAL_DB = [
  {id:'sp1',images:['./img/sp1.jpg','./img/sp1b.jpg'],brand:'Samsung',model:'Galaxy S24 Ultra',year:2024,category:'Smartphones',price:{official:1469},specs:{Écran:'6.8" Dynamic AMOLED 2X 120Hz',Processeur:'Snapdragon 8 Gen 3',RAM:'12 Go',Stockage:'256 Go',Appareil:'200+50+12+10 MP',Batterie:'5000 mAh'}},
  {id:'sp2',images:['./img/sp2.png'],brand:'Apple',model:'iPhone 15 Pro Max',year:2023,category:'Smartphones',price:{official:1479},specs:{Écran:'6.7" Super Retina XDR 120Hz',Processeur:'A17 Pro',RAM:'8 Go',Stockage:'256 Go',Appareil:'48+12+12 MP',Batterie:'4441 mAh'}},
  {id:'sp4',images:['./img/sp4.png'],brand:'Google',model:'Pixel 8 Pro',year:2023,category:'Smartphones',price:{official:1099},specs:{Écran:'6.7" LTPO OLED 120Hz',Processeur:'Tensor G3',RAM:'12 Go',Stockage:'128 Go',Appareil:'50+48+48 MP',Batterie:'5050 mAh'}},
  {id:'sp6',images:['./img/sp6.jpg'],brand:'Nothing',model:'Phone 2a',year:2024,category:'Smartphones',price:{official:349},specs:{Écran:'6.7" AMOLED 120Hz',Processeur:'MediaTek Dimensity 7200 Pro',RAM:'12 Go',Stockage:'256 Go',Appareil:'50+50 MP',Batterie:'5000 mAh'}},
  {id:'sp8',images:['./img/sp8.jpg'],brand:'OPPO',model:'Find X7 Ultra',year:2024,category:'Smartphones',price:{official:1299},specs:{Écran:'6.82" LTPO AMOLED 120Hz',Processeur:'Snapdragon 8 Gen 3',RAM:'16 Go',Stockage:'512 Go',Appareil:'50+50+50+50 MP',Batterie:'5000 mAh'}},
  {id:'sp11',images:['./img/sp11.png'],brand:'Apple',model:'iPhone 15',year:2023,category:'Smartphones',price:{official:869},specs:{Écran:'6.1" Super Retina XDR',Processeur:'A16 Bionic',RAM:'6 Go',Stockage:'128 Go',Appareil:'48+12 MP',Batterie:'3349 mAh'}},
  {id:'sp12',images:['./img/sp12.jpg'],brand:'Samsung',model:'Galaxy S24+',year:2024,category:'Smartphones',price:{official:1169},specs:{Écran:'6.7" QHD+ AMOLED 120Hz',Processeur:'Exynos 2400',RAM:'12 Go',Stockage:'256 Go',Appareil:'50+12+10 MP',Batterie:'4900 mAh'}},
  {id:'sp13',images:['./img/sp13.jpg'],brand:'Google',model:'Pixel 8a',year:2024,category:'Smartphones',price:{official:549},specs:{Écran:'6.1" OLED 120Hz',Processeur:'Tensor G3',RAM:'8 Go',Stockage:'128 Go',Appareil:'64+13 MP',Batterie:'4492 mAh'}},
  {id:'sp14',images:['./img/sp14.jpg'],brand:'Xiaomi',model:'Redmi Note 13 Pro',year:2024,category:'Smartphones',price:{official:349},specs:{Écran:'6.67" AMOLED 120Hz',Processeur:'Snapdragon 7s Gen 2',RAM:'8 Go',Stockage:'256 Go',Appareil:'200+8+2 MP',Batterie:'5100 mAh'}},
  {id:'sp15',images:['./img/sp15.jpg'],brand:'Samsung',model:'Galaxy Z Flip 6',year:2024,category:'Smartphones',price:{official:1209},specs:{Écran:'6.7" Pliable AMOLED 120Hz + 3.4" externe',Processeur:'Snapdragon 8 Gen 3',RAM:'12 Go',Stockage:'256 Go',Appareil:'50+12 MP',Batterie:'4000 mAh'}},
  {id:'sp16',images:['./img/sp16.jpg'],brand:'OnePlus',model:'Nord 4',year:2024,category:'Smartphones',price:{official:499},specs:{Écran:'6.74" AMOLED 120Hz',Processeur:'Snapdragon 7+ Gen 3',RAM:'12 Go',Stockage:'256 Go',Appareil:'50+8 MP',Batterie:'5500 mAh'}},
  {id:'sp17',images:['./img/sp17.png'],brand:'Nothing',model:'Phone (2)',year:2023,category:'Smartphones',price:{official:679},specs:{Écran:'6.7" LTPO OLED 120Hz',Processeur:'Snapdragon 8+ Gen 1',RAM:'12 Go',Stockage:'256 Go',Appareil:'50+50 MP',Batterie:'4700 mAh'}},
  {id:'sp18',images:['./img/sp18.jpg'],brand:'Honor',model:'Magic 6 Pro',year:2024,category:'Smartphones',price:{official:1299},specs:{Écran:'6.8" LTPO OLED 120Hz',Processeur:'Snapdragon 8 Gen 3',RAM:'12 Go',Stockage:'512 Go',Appareil:'50+180+50 MP',Batterie:'5600 mAh'}},
  {id:'cp1',images:['./img/cp1.jpg'],brand:'Apple',model:'MacBook Pro 16 M3 Max',year:2023,category:'Computers',price:{official:3999},specs:{Écran:'16.2" Liquid Retina XDR',Processeur:'M3 Max 16 cœurs',RAM:'48 Go',Stockage:'1 To SSD',GPU:'40 cœurs',Autonomie:'22 h'}},
  {id:'cp2',images:['./img/cp2.jpg'],brand:'Dell',model:'XPS 15 9530',year:2023,category:'Computers',price:{official:2499},specs:{Écran:'15.6" 3.5K OLED Touch',Processeur:'i9-13900H',RAM:'32 Go',Stockage:'1 To SSD',GPU:'RTX 4070 8 Go',Autonomie:'10 h'}},
  {id:'cp3',images:['./img/cp3.jpg'],brand:'ASUS',model:'ROG Zephyrus G14',year:2024,category:'Computers',price:{official:1999},specs:{Écran:'14" 3K OLED 120Hz',Processeur:'Ryzen 9 8945HS',RAM:'32 Go',Stockage:'1 To SSD',GPU:'RTX 4070 8 Go',Autonomie:'10 h'}},
  {id:'cp6',images:['./img/cp6.jpg'],brand:'Framework',model:'Laptop 13 AMD',year:2024,category:'Computers',price:{official:1049},specs:{Écran:'13.5" 2256x1504 3:2',Processeur:'Ryzen 5 7640U',RAM:'16 Go',Stockage:'512 Go SSD',GPU:'Radeon 760M',Autonomie:'10 h'}},
  {id:'cp9',images:['./img/cp9.jpg'],brand:'LG',model:'Gram 17',year:2024,category:'Computers',price:{official:1699},specs:{Écran:'17" WQXGA IPS 144Hz',Processeur:'Core Ultra 7 155H',RAM:'16 Go',Stockage:'1 To SSD',GPU:'Arc Graphics',Autonomie:'18 h'}},
  {id:'tb1',images:['./img/tb1.jpg'],brand:'Apple',model:'iPad Pro 13 M4',year:2024,category:'Tablets',price:{official:1599},specs:{Écran:'13" Ultra Retina XDR 120Hz',Processeur:'M4 10 cœurs',RAM:'16 Go',Stockage:'512 Go',Caméra:'12 MP + 10 MP',Autonomie:'10 h'}},
  {id:'tb2',images:['./img/tb2.jpg'],brand:'Samsung',model:'Galaxy Tab S9 Ultra',year:2023,category:'Tablets',price:{official:1399},specs:{Écran:'14.6" Dynamic AMOLED 2X 120Hz',Processeur:'Snapdragon 8 Gen 2',RAM:'12 Go',Stockage:'256 Go',Caméra:'13+8 MP',Autonomie:'12 h'}},
  {id:'tb3',images:['./img/tb3.jpg'],brand:'Xiaomi',model:'Pad 6S Pro 12.4',year:2024,category:'Tablets',price:{official:599},specs:{Écran:'12.4" 3K 144Hz',Processeur:'Snapdragon 8 Gen 2',RAM:'12 Go',Stockage:'256 Go',Caméra:'50 MP',Autonomie:'14 h'}},
  {id:'tb6',images:['./img/tb6.png'],brand:'Google',model:'Pixel Tablet',year:2023,category:'Tablets',price:{official:599},specs:{Écran:'10.95" 2560x1600 60Hz',Processeur:'Tensor G2',RAM:'8 Go',Stockage:'128 Go',Caméra:'8 MP',Autonomie:'12 h'}},
  {id:'tb8',images:['./img/tb8.jpg'],brand:'Huawei',model:'MatePad Pro 13.2',year:2023,category:'Tablets',price:{official:799},specs:{Écran:'13.2" 2.8K OLED 144Hz',Processeur:'Kirin 9000S',RAM:'12 Go',Stockage:'256 Go',Caméra:'13 MP',Autonomie:'12 h'}},
  {id:'tb13',images:['./img/tb13.jpg'],brand:'Xiaomi',model:'Pad 7',year:2024,category:'Tablets',price:{official:399},specs:{Écran:'11.2" 3.2K 144Hz',Processeur:'Snapdragon 7+ Gen 3',RAM:'8 Go',Stockage:'128 Go',Appareil:'13 MP',Batterie:'8850 mAh'}},
  {id:'ac58',images:['./img/ac58.jpg'],brand:'Apple',model:'Magic Keyboard 2',year:2021,category:'Accessories',price:{official:119},specs:{Type:'Clavier sans fil',Connexion:'Bluetooth + Lightning',Autonomie:'1 mois',Layout:'AZERTY'}},
  {id:'ac60',images:['./img/ac60.jpg'],brand:'Logitech',model:'MX Keys S',year:2023,category:'Accessories',price:{official:119},specs:{Type:'Clavier sans fil',Rétroéclairage:'Intelligent',Connexion:'Bolt + BT + USB',Autonomie:'5 mois'}},
  {id:'ac66',images:['./img/ac66.jpg'],brand:'Apple',model:'Magic Mouse',year:2021,category:'Accessories',price:{official:85},specs:{Type:'Souris sans fil',Surface:'Multi-Touch',Connexion:'Bluetooth + Lightning',Autonomie:'1 mois'}},
  {id:'ac67',images:['./img/ac67.jpg'],brand:'Logitech',model:'MX Master 3S',year:2022,category:'Accessories',price:{official:119},specs:{Type:'Souris bureautique',Capteur:'8000 DPI',Connexion:'Bolt + BT + USB',Boutons:'7'}},
  {id:'ac71',images:['./img/ac71.jpg'],brand:'Logitech',model:'G Pro X Superlight 2',year:2023,category:'Accessories',price:{official:159},specs:{Type:'Souris gaming',Capteur:'32000 DPI',Polling:'2000 Hz',Poids:'60 g'}},
  {id:'ac84',images:['./img/ac84.jpg'],brand:'Samsung',model:'T7 Shield 1To',year:2022,category:'Accessories',price:{official:129},specs:{Type:'SSD externe',Capacité:'1 To',Débit:'1050 Mo/s',Protection:'IP65 antichoc'}},
  {id:'vr1',images:['./img/vr1.jpg'],brand:'Apple',model:'Vision Pro',year:2024,category:'VR AR gadgets',price:{official:3999},specs:{Écran:'Micro-OLED 23M pixels/œil',Processeur:'M2 + R1',RAM:'16 Go',Stockage:'256 Go',Tracking:'Yeux/mains/voix',Autonomie:'2-2.5 h'}},
  {id:'vr2',images:['./img/vr2.jpg'],brand:'Meta',model:'Quest 3',year:2023,category:'VR AR gadgets',price:{official:549},specs:{Écran:'LCD 2064x2208/œil 120Hz',Processeur:'Snapdragon XR2 Gen 2',RAM:'8 Go',Stockage:'128 Go',Tracking:'Inside-out + mains',Autonomie:'2-3 h'}},
  {id:'vr5',images:['./img/vr5.jpg'],brand:'PICO',model:'PICO 4 Ultra',year:2024,category:'VR AR gadgets',price:{official:599},specs:{Écran:'LCD 2160x2160/œil 90Hz',Processeur:'Snapdragon XR2 Gen 2',RAM:'8 Go',Stockage:'256 Go',Tracking:'Inside-out + mains',Autonomie:'2-3 h'}},
  {id:'co2',images:['./img/co2.jpg'],brand:'Nintendo',model:'Super Nintendo',year:1992,category:'Consoles & Videogames',era:'retro',price:{official:199},specs:{CPU:'Ricoh 5A22 16-bit',Mémoire:'128 Ko RAM',Affichage:'512x448, Mode 7',Support:'Cartouches',Audio:'Sony SPC700 8 canaux'}},
  {id:'co3',images:['./img/co3.jpg'],brand:'Sega',model:'Mega Drive',year:1990,category:'Consoles & Videogames',era:'retro',price:{official:189},specs:{CPU:'Motorola 68000 16-bit',Mémoire:'64 Ko RAM',Affichage:'320x224, 512 couleurs',Support:'Cartouches',Audio:'Yamaha YM2612'}},
  {id:'co4',images:['./img/co4.jpg'],brand:'Nintendo',model:'Game Boy',year:1990,category:'Consoles & Videogames',era:'retro',price:{official:89},specs:{CPU:'Sharp LR35902 8-bit',Écran:'2.6" NB 160x144',Autonomie:'30 h (4 piles AA)',Support:'Cartouches',Liaison:'Câble Link'}},
  {id:'co5',images:['./img/co5.png'],brand:'Sony',model:'PlayStation',year:1995,category:'Consoles & Videogames',era:'retro',price:{official:299},specs:{CPU:'MIPS R3000 32-bit',Mémoire:'2 Mo RAM',Affichage:'640x480 3D',Support:'CD-ROM',Manettes:'2 ports + cartes mémoire'}},
  {id:'co6',images:['./img/co6.jpg'],brand:'Nintendo',model:'Nintendo 64',year:1997,category:'Consoles & Videogames',era:'retro',price:{official:249},specs:{CPU:'MIPS R4300i 64-bit',Mémoire:'4 Mo RDRAM',Affichage:'640x480 anti-aliasing',Support:'Cartouches',Manettes:'4 ports'}},
  {id:'co7',images:['./img/co7.png'],brand:'Sega',model:'Dreamcast',year:1999,category:'Consoles & Videogames',era:'retro',price:{official:299},specs:{CPU:'Hitachi SH-4 128-bit',Mémoire:'16 Mo RAM',Affichage:'640x480 VGA',Support:'GD-ROM',Réseau:'Modem 56k + VMU'}},
  {id:'co8',images:['./img/co8.jpg'],brand:'Nintendo',model:'GameCube',year:2002,category:'Consoles & Videogames',era:'retro',price:{official:249},specs:{CPU:'IBM Gekko 485 MHz',Mémoire:'24 Mo RAM',Affichage:'480p',Support:'mini-DVD 1.5 Go',Manettes:'4 ports'}},
  {id:'co9',images:['./img/co9.png'],brand:'Nintendo',model:'Switch OLED',year:2021,category:'Consoles & Videogames',era:'modern',price:{official:349},specs:{Écran:'7" OLED 720p',Stockage:'64 Go',Autonomie:'4.5-9 h',Mode:'Salon + portable + table',Réseau:'WiFi + LAN (dock)'}},
  {id:'co10',images:['./img/co10.jpg'],brand:'Nintendo',model:'Switch 2',year:2025,category:'Consoles & Videogames',era:'modern',price:{official:469},specs:{Écran:'7.9" LCD 1080p 120Hz',Stockage:'256 Go',Rétrocompatibilité:'Switch (physique + démat)',Manettes:'Joy-Con 2 magnétiques',Réseau:'WiFi 6'}},
  {id:'co11',images:['./img/co11.png'],brand:'Sony',model:'PS5 Slim',year:2023,category:'Consoles & Videogames',era:'modern',price:{official:549},specs:{CPU:'Zen 2 8 cœurs',GPU:'RDNA 2, 10.3 TFLOPS',Stockage:'1 To SSD',Affichage:'4K 120Hz',Lecteur:'Blu-ray 4K amovible'}},
  {id:'co13',images:['./img/co13.jpg'],brand:'Microsoft',model:'Xbox Series X',year:2020,category:'Consoles & Videogames',era:'modern',price:{official:549},specs:{CPU:'Zen 2 8 cœurs',GPU:'RDNA 2, 12 TFLOPS',Stockage:'1 To SSD',Affichage:'4K 120Hz + 8K',Service:'Game Pass'}},
  {id:'co15',images:['./img/co15.png'],brand:'Valve',model:'Steam Deck OLED 512Go',year:2023,category:'Consoles & Videogames',era:'modern',price:{official:569},specs:{OS:'SteamOS (Linux)',Écran:'7.4" OLED 90Hz',CPU:'Zen 2 4c/8t + RDNA 2',Stockage:'512 Go NVMe',Autonomie:'3-12 h'}},
  {id:'co16',images:['./img/co16.png'],brand:'ASUS',model:'ROG Ally',year:2023,category:'Consoles & Videogames',era:'modern',price:{official:699},specs:{OS:'Windows 11',Écran:'7" 1080p 120Hz',CPU:'Ryzen Z1 Extreme',Stockage:'512 Go NVMe',Batterie:'40 Wh'}},
  {id:'ce7',images:['./img/ce7.jpg'],brand:'Samsung',model:'990 Pro 2To',year:2023,category:'Composant electronic & informatic',price:{official:179},specs:{Interface:'PCIe 4.0 x4',Lecture:'7450 Mo/s',Écriture:'6900 Mo/s',Format:'M.2 2280',Contrôleur:'Pascal',Cache:'2 Go LPDDR4'}},
  {id:'rb1',images:['./img/rb1.jpg'],brand:'Unitree',model:'Go2',year:2024,category:'Company & studying Robots',price:{official:2499},specs:{Type:'Quadrupède',Poids:'15 kg',Autonomie:'2-4 h',Vitesse:'5 m/s',Capteurs:'LiDAR 360° + caméras',API:'ROS 2 + SDK Python/C++'}},
  {id:'rb2',images:['./img/rb2.jpg'],brand:'Boston Dynamics',model:'Spot',year:2020,category:'Company & studying Robots',price:{official:74500},specs:{Type:'Quadrupède',Poids:'32 kg',Autonomie:'1.5 h',Vitesse:'1.6 m/s',Capteurs:'5 caméras stéréo + LiDAR',API:'SDK Python + ROS'}},
  {id:'rb4',images:['./img/rb4.jpg'],brand:'Tesla',model:'Optimus Gen 2',year:2024,category:'Company & studying Robots',price:{official:25000},specs:{Type:'Humanoïde',Poids:'73 kg',Autonomie:'8 h',Charge:'20 kg',Capteurs:'Caméras + FSD',API:'Propriétaire'}},
  {id:'rb8',images:['./img/rb8.jpg'],brand:'ANYbotics',model:'ANYmal D',year:2023,category:'Company & studying Robots',price:{official:120000},specs:{Type:'Quadrupède',Poids:'50 kg',Autonomie:'2.5 h',Vitesse:'2.5 m/s',Capteurs:'LiDAR + 5 caméras',API:'ROS 2 + SDK'}},
  {id:'rb9',images:['./img/rb9.jpg'],brand:'Ghost Robotics',model:'Vision 60',year:2022,category:'Company & studying Robots',price:{official:150000},specs:{Type:'Quadrupède militaire',Poids:'51 kg',Autonomie:'3 h',Vitesse:'3 m/s',Capteurs:'LiDAR 360 + thermiques',API:'ROS + SDK'}},
  {id:'aw3',images:['./img/aw3.jpg'],brand:'Apple',model:'AirPods Pro 2 (USB-C)',year:2023,category:'Audio & Wearables',price:{official:279},specs:{Type:'TWS ANC',Puce:'H2',ANC:'Adaptatif 2x',Codec:'AAC + LC3',Autonomie:'6 h (ANC) + 24 h étui',Audio:'Spatial + Suivi tête'}},
  {id:'aw6',images:['./img/aw6.jpg'],brand:'Samsung',model:'Galaxy Buds 3 Pro',year:2024,category:'Audio & Wearables',price:{official:249},specs:{Type:'TWS ANC',Transducteur:'11 mm + 6.5 mm',ANC:'Adaptatif IA',Codec:'SSC + LDAC',Autonomie:'6 h (ANC) + 18 h étui',Audio:'360° + Suivi tête'}},
  {id:'aw9',images:['./img/aw9.jpg','./img/aw9b.png'],brand:'Apple',model:'Apple Watch Ultra 2',year:2023,category:'Audio & Wearables',price:{official:899},specs:{Type:'Montre connectée',Écran:'1.92" Retina 3000 nits',Autonomie:'36 h (72 h éco)',GPS:'Double fréquence',Capteurs:'Température + ECG + SpO2',Action:'Bouton Action'}},
  {id:'aw10',images:['./img/aw10.jpg'],brand:'Samsung',model:'Galaxy Watch 7 44mm',year:2024,category:'Audio & Wearables',price:{official:329},specs:{Type:'Montre connectée',Écran:'1.47" Super AMOLED',Autonomie:'40 h',GPS:'Double fréquence',Capteurs:'BioActive 2.0 (ECG/TA)',OS:'Wear OS 5'}},
];

// ============ STATE ============
let products = [...LOCAL_DB];
let filteredProducts = [...LOCAL_DB];
let activeCategory = 'all', activeYear = 'all', activeBrand = 'all', activeSort = 'relevance', activeEra = 'all';
let activeSources = {official:true, social:true, reviews:true, community:true};
let searchQuery = '', isFetching = false;

let userContext = { isSubscriber: false, tenureDays: 0, cartItems: [], get isPromoEligible() { return this.cartItems.length >= 10; } };

// ============ UTILITIES ============
function $(sel, ctx=document){return ctx.querySelector(sel)}
function $$(sel, ctx=document){return Array.from(ctx.querySelectorAll(sel))}
function fmtPrice(price, currency='EUR'){return new Intl.NumberFormat('fr-FR',{style:'currency',currency,minimumFractionDigits:0}).format(price)}
function fmtPriceCrossed(price, currency='EUR'){return `<span class="price-crossed">${fmtPrice(price,currency)}</span>`}
function toast(msg,type='info'){const t=$('#toast');t.textContent=msg;t.className='toast '+type+' visible';setTimeout(()=>t.classList.remove('visible'),3000)}
function calcKiffTechPrice(officialPrice, context={}){const {isSubscriber=false,cartItems=[],isPromoEligible=false,tenureDays=0}=context;let discount=10,freeDelivery=false,reason='Prix KiffTech (-10%)';if(isSubscriber){discount=Math.min(10+Math.floor(tenureDays/30),21);freeDelivery=true;reason=`Abonne KiffTech (${discount}% + livraison offerte)`;}else if(isPromoEligible||cartItems.length>=10){discount=20;reason=`Promo 20% (10+ articles)`;}const final=Math.round(officialPrice*(100-discount)/100);return{official:officialPrice,kifftech:final,discount,savings:officialPrice-final,freeDelivery,reason,currency:'EUR'};}
function refreshKiffTechPrices(){products.forEach(p=>{if(!p.partner)p.kifftech=calcKiffTechPrice(p.price.official,{isSubscriber:userContext.isSubscriber,cartItems:userContext.cartItems,tenureDays:userContext.tenureDays});});filteredProducts.forEach(p=>{const o=products.find(x=>x.id===p.id);if(o&&!p.partner)p.kifftech=o.kifftech;});}

// ============ CLICKWISE API ============
async function fetchFromClickwise() {
  try {
    toast('Connexion a ClickWise API...','info');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${CLICKWISE_API_BASE}/products`, {
      headers: { 'Authorization': `Bearer ${CLICKWISE_API_KEY}`, 'Content-Type': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`API ${res.status}`);
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) throw new Error('Non-JSON response');
    const data = await res.json();
    if (!data || (!Array.isArray(data) && !data.products)) throw new Error('Invalid data format');
    return data.products || data;
  } catch (e) {
    console.warn('ClickWise API failed, using local DB:', e.message);
    toast('API indisponible, base locale utilisee','warning');
    return LOCAL_DB;
  }
}

// ============ RENDER ============
function generateMedia(p){const m={badges:[]};if(p.partner)m.badges.push({class:'badge-official',label:'Partenaire'});if(p.videos?.length)m.badges.push({class:'badge-video',label:'Video'});if(p.images?.length)m.badges.push({class:'badge-official',label:'Photo CC'});else m.badges.push({class:'badge-official',label:'Aperçu généré'});return m;}
function hasOfficialPhoto(p){return !!(p.images&&p.images.length);}

const CAT_EMOJI = {'Smartphones':'📱','Computers':'💻','Tablets':'📲','Audio & Wearables':'🎧','VR AR gadgets':'🥽','Garden & furnitures smart devices':'🪴','Composant electronic & informatic':'🔌','Company & studying Robots':'🤖','Consoles & Videogames':'🎮'};
function escXml(s){return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');}
function brandHue(brand){let h = 0; for (const c of String(brand)) h = (h * 31 + c.charCodeAt(0)) % 360; return h;}
// Aperçu image garanti pour chaque produit : photo si dispo, sinon visuel généré (marque + catégorie).
// NOTE droits : les photos locales sont Wikimedia Commons CC BY-SA (voir img/CREDITS.txt).
// Les visuels constructeurs officiels ne sont PAS copiés (© fabricants) : on pointe vers la page officielle via officialUrl().
const BRAND_SITES={'Samsung':'https://www.samsung.com/fr/','Apple':'https://www.apple.com/fr/','Xiaomi':'https://www.mi.com/fr/','Google':'https://store.google.com/fr/','OnePlus':'https://www.oneplus.com/fr','Nothing':'https://nothing.tech/','Motorola':'https://www.motorola.com/','OPPO':'https://www.oppo.com/fr/','Realme':'https://www.realme.com/fr/','POCO':'https://www.po.co/','Honor':'https://www.honor.com/fr/','Dell':'https://www.dell.com/fr-fr','ASUS':'https://www.asus.com/fr/','Lenovo':'https://www.lenovo.com/fr/','HP':'https://www.hp.com/fr-fr/','Framework':'https://frame.work/','MSI':'https://www.msi.com/','Razer':'https://www.razer.com/','LG':'https://www.lg.com/fr/','Huawei':'https://consumer.huawei.com/fr/','Microsoft':'https://www.microsoft.com/fr-fr/','Anker':'https://www.anker.com/','Ugreen':'https://www.ugreen.com/','Belkin':'https://www.belkin.com/fr/','Zendure':'https://zendure.com/','Shargeek':'https://www.sharge.com/','Baseus':'https://www.baseus.com/','Satechi':'https://satechi.net/','Oppo':'https://www.oppo.com/fr/','Cable Matters':'https://www.cablematters.com/','Spigen':'https://www.spigen.com/','ESR':'https://www.esrtech.com/','OtterBox':'https://www.otterbox.com/','Mous':'https://www.mous.co/','Pitaka':'https://www.pitaka.com/','Bellroy':'https://bellroy.com/','amFilm':'https://www.amfilm.com/','Zagg':'https://www.zagg.com/','Logitech':'https://www.logitech.com/fr-fr','Keychron':'https://www.keychron.com/','Nuphy':'https://nuphy.com/','Royal Kludge':'https://rkgamingstore.com/','CalDigit':'https://www.caldigit.com/','StarTech':'https://www.startech.com/fr/','Hyper':'https://www.hypershop.com/','SanDisk':'https://www.sandisk.com/','Crucial':'https://www.crucial.com/','WD':'https://www.westerndigital.com/','Seagate':'https://www.seagate.com/','Angelbird':'https://www.angelbird.com/','Twelve South':'https://www.twelvesouth.com/','Lamicall':'https://www.lamicall.com/','Meta':'https://www.meta.com/','HTC':'https://www.htc.com/','PICO':'https://www.picoxr.com/fr','XREAL':'https://www.xreal.com/','Rokid':'https://www.rokid.com/','Viture':'https://www.viture.com/','RayNeo':'https://www.rayneo.com/','DPVR':'https://www.dpvr.com/','Gigabyte':'https://www.gigabyte.com/','ASRock':'https://www.asrock.com/','Corsair':'https://www.corsair.com/','Seasonic':'https://seasonic.com/','G.Skill':'https://www.gskill.com/','Unitree':'https://www.unitree.com/','Boston Dynamics':'https://bostondynamics.com/','Agility Robotics':'https://agilityrobotics.com/','Tesla':'https://www.tesla.com/','Figure':'https://www.figure.ai/','1X Technologies':'https://www.1x.tech/','Apptronik':'https://apptronik.com/','ANYbotics':'https://www.anybotics.com/','Ghost Robotics':'https://www.ghostrobotics.io/','Deep Robotics':'https://www.deeprobotics.cn/','Husqvarna':'https://www.husqvarna.com/fr/','Segway':'https://www.segway.com/','Ecovacs':'https://www.ecovacs.com/fr/','Dreame':'https://www.dreametech.com/fr/','Mammotion':'https://mammotion.com/','Philips Hue':'https://www.philips-hue.com/fr-fr','Govee':'https://www.govee.com/','Rachio':'https://rachio.com/','Moen':'https://www.moen.com/','IKEA':'https://www.ikea.com/fr/fr/','Sony':'https://www.sony.fr/','Bose':'https://www.bose.fr/','Sennheiser':'https://www.sennheiser.com/fr-fr','Technics':'https://www.technics.com/fr/','Garmin':'https://www.garmin.com/fr-FR/'};
function officialUrl(p){const base=BRAND_SITES[p.brand]||('https://www.google.com/search?q='+encodeURIComponent(p.brand+' '+p.model+' site officiel'));if(BRAND_SITES[p.brand])return base+'search?q='+encodeURIComponent(p.model);return base;}
// Review complet généré localement (original KiffTech, sans copie presse) : résumé + points + note issue des specs/prix.
function productReview(p){const specs=p.specs||{};const keys=Object.keys(specs);const top=keys.slice(0,3).map(k=>k+': '+specs[k]).join(' • ');const price=p.price?.official||0;const cat=p.category||'';let note=4.0;if(price>2000)note=4.2;else if(price<100)note=4.4;else note=4.3;if(hasOfficialPhoto(p))note=Math.min(5,note+0.2);note=Math.round(note*10)/10;const plus=keys.slice(0,2).map(k=>k+' '+specs[k]);const moins=[p.year&&p.year<2023?'Génération '+p.year+' (vérifier successeur)':'Prix officiel '+price+' € à comparer',cat.includes('Robot')||cat.includes('VR')?'Usage pro/étude : vérifier compatibilité ROS':'Vérifier compatibilité '+cat];return{summary:(p.brand+' '+p.model+' ('+p.year+', '+cat+'). '+top+'. Positionné à '+price+' € officiel, prix KiffTech recalculé -10 à -21% selon panier/abonnement.'),plus:plus.length?plus:['Fiche specs complète'],moins:moins,note:note};}
function previewImage(p){
  if (p.images && p.images[0]) return p.images[0];
  const brand = p.brand || '?', model = p.model || '';
  const initials = escXml(((brand[0] || '?') + model.split(' ').map(w => w[0]).join('').slice(0, 2)).toUpperCase());
  const h = brandHue(brand), emoji = CAT_EMOJI[p.category] || '📦';
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${h},70%,30%)'/><stop offset='1' stop-color='hsl(${(h + 60) % 360},70%,14%)'/></linearGradient></defs><rect width='400' height='400' fill='url(#g)'/><text x='200' y='175' font-size='110' text-anchor='middle'>${emoji}</text><text x='200' y='285' font-size='46' font-weight='bold' fill='#ffffff' text-anchor='middle' font-family='sans-serif'>${initials}</text><text x='200' y='325' font-size='24' fill='#ffd23f' text-anchor='middle' font-family='sans-serif'>${escXml(brand)}</text></svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg).replace(/'/g, '%27');
}

function renderProducts(){
  const grid=$('#products-grid');
  if(!grid){console.warn('products-grid not found');return;}
  if(filteredProducts.length===0){grid.innerHTML=`<div class="empty-state" style="grid-column:1/-1;padding:40px;text-align:center"><span style="font-size:48px">🔍</span><p>Aucun produit</p></div>`;return;}
  const placeholderImg = "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 400%22%3E%3Crect fill=%22%231a1d3a%22 width=%22400%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23444%22 text-anchor=%22middle%22%3E%3C/text%3E%3C/svg%3E";
  grid.innerHTML=filteredProducts.map(p=>{
    if (!p.kifftech) p.kifftech = calcKiffTechPrice(p.price.official);
    const kt=p.kifftech;const has=kt.discount>0;const med=generateMedia(p);
    const imgSrc = previewImage(p);
    return `<article class="product-card" data-id="${p.id}"><div class="product-media"><img src="${imgSrc}" alt="${p.brand} ${p.model}" loading="lazy" decoding="async" onerror="this.src='${placeholderImg}'"><div class="media-badge">${med.badges.map(b=>`<span class="badge ${b.class}">${b.label}</span>`).join('')}${has?`<span class="badge badge-promo">-${kt.discount}%</span>`:''}</div></div><div class="product-info"><span class="product-brand">${p.brand}</span><h3 class="product-name">${p.model}</h3><div class="product-meta"><span class="meta-item meta-year">${p.year}</span><div class="meta-item meta-price-wrap">${has?fmtPriceCrossed(kt.official):''}<span class="price-kifftech ${has?'has-discount':''}">${fmtPrice(kt.kifftech)}</span></div></div>${has?`<div class="discount-badge">${kt.reason} • Economisez ${fmtPrice(kt.savings)}${kt.freeDelivery?' • Livraison offerte':''}</div>`:''}<div class="product-specs">${Object.entries(p.specs||{}).slice(0,3).map(([k,v])=>`<div class="spec-row"><span class="spec-label">${k}</span><span class="spec-value">${v}</span></div>`).join('')}</div><div class="product-actions"><button class="btn-sm primary" onclick="openModal('${p.id}')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Details</button><button class="btn-sm" onclick="event.stopPropagation();addToCart('${p.id}')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/></svg>Ajouter</button></div></div></article>`;
  }).join('');
  $('#results-count').textContent=`${filteredProducts.length} produit${filteredProducts.length>1?'s':''}`;
  updateStats();updateCartBadge();
}

function updateStats(){$('#stat-products').textContent=products.length;$('#stat-sources').textContent='ClickWise+Local';const yrs=new Set(products.map(p=>p.year));$('#stat-coverage').textContent=`${yrs.size} ans`;$('#stat-updated').textContent=new Date().toLocaleDateString('fr-FR');}
function fmtPrice(price,c='EUR'){return new Intl.NumberFormat('fr-FR',{style:'currency',currency:c,minimumFractionDigits:0}).format(price)}
function fmtPriceCrossed(p,c='EUR'){return `<span class="price-crossed">${fmtPrice(p,c)}</span>`}
function toast(m,t='info'){const e=$('#toast');e.textContent=m;e.className='toast '+t+' visible';setTimeout(()=>e.classList.remove('visible'),3000)}

// ============ DATA LOADING ============
async function loadProducts(){
  try {
    toast('Chargement produits...','info');
    products = [...LOCAL_DB];
    products.forEach(p=>p.kifftech=calcKiffTechPrice(p.price.official));
    filteredProducts=[...products];
    applyFilters();
    toast(`${products.length} produits charges (local)`,`success`);

    try {
      const apiProducts = await fetchFromClickwise();
      if (apiProducts && apiProducts.length) {
        const apiMapped = apiProducts.map((p,i)=>({...p,id:p.id||`cw-${i}`,kifftech:calcKiffTechPrice(p.price?.official||p.price||0)}));
        const existingIds = new Set(products.map(p=>p.id));
        const newProducts = apiMapped.filter(p=>!existingIds.has(p.id));
        if (newProducts.length) {
          products = [...newProducts, ...products];
          filteredProducts = [...products];
          applyFilters();
          toast(`${newProducts.length} nouveaux produits via ClickWise`,`success`);
        }
      }
    } catch(e) { console.log('ClickWise background fetch skipped'); }
  } catch(e) {
    console.error(e);
    products=[...LOCAL_DB];products.forEach(p=>p.kifftech=calcKiffTechPrice(p.price.official));
    filteredProducts=[...products];
    applyFilters();
    toast('Mode local active','warning');
  }
}

// ============ CART / SUB ============
function addToCart(id){const p=products.find(x=>x.id===id);if(!p||userContext.cartItems.some(i=>i.id===id))return;userContext.cartItems.push({...p,qty:1});refreshKiffTechPrices();renderProducts();updateCartPanel();toast(`${p.model} ajoute`,`success`);}
function removeFromCart(id){userContext.cartItems=userContext.cartItems.filter(i=>i.id!==id);refreshKiffTechPrices();renderProducts();updateCartPanel();}
function updateCartBadge(){const c=userContext.cartItems.length;$('#cart-count').textContent=c;$('#cart-count').style.display=c?'flex':'none';updatePromoUI();}
function updatePromoUI(){const el=$('#promo-indicator');if(!el)return;if(userContext.isSubscriber)el.innerHTML=`<span class="promo-active">Abonne • ${calcKiffTechPrice(100,{isSubscriber:true}).discount}% + Livraison</span>`;else if(userContext.cartItems.length>=10)el.innerHTML=`<span class="promo-active">Promo -20% activee</span>`;else el.innerHTML=`<span class="promo-pending">Ajoutez ${10-userContext.cartItems.length} articles pour -20%</span>`;}
function updateCartPanel(){const p=$('#cart-panel');if(!p)return;if(!userContext.cartItems.length){p.innerHTML=`<p style="color:#8a92b8;text-align:center;padding:20px">Selection vide</p>`;return;}let to=0,tk=0;const placeholderImg = "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 400%22%3E%3Crect fill=%22%231a1d3a%22 width=%22400%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23444%22 text-anchor=%22middle%22%3E%3C/text%3E%3C/svg%3E";p.innerHTML=userContext.cartItems.map(i=>{const kt=calcKiffTechPrice(i.price.official,{isSubscriber:userContext.isSubscriber,cartItems:userContext.cartItems});to+=kt.official;tk+=kt.kifftech;const imgSrc = previewImage(i);return `<div style="display:flex;gap:12px;padding:12px;background:rgba(255,255,255,.03);border-radius:10px;border:1px solid rgba(255,255,255,.06)"><img src="${imgSrc}" decoding="async" style="width:50px;height:50px;object-fit:cover;border-radius:8px"><div style="flex:1"><div style="font-weight:600">${i.model}</div><div style="font-size:.8rem;color:#8a92b8">${i.brand}</div></div><div style="text-align:right"><div style="font-size:.75rem;color:#8a92b8;text-decoration:line-through">${fmtPrice(kt.official)}</div><div style="font-weight:700;color:#27d17f">${fmtPrice(kt.kifftech)}</div></div><button onclick="removeFromCart('${i.id}')" style="width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,61,154,.3);background:rgba(255,61,154,.1);color:#ff3d9a;cursor:pointer">x</button></div>`;}).join('')+`<div style="margin-top:16px;padding-top:16px;border-top:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between"><div><div style="font-size:.8rem;color:#8a92b8">Total officiel</div><div style="text-decoration:line-through;color:#b9c0e6">${fmtPrice(to)}</div></div><div style="text-align:right"><div style="font-size:.8rem;color:#8a92b8">Prix KiffTech</div><div style="font-weight:800;color:#27d17f;font-size:1.2rem">${fmtPrice(tk)}</div><div style="font-size:.7rem;color:#27d17f">Economie ${fmtPrice(to-tk)}</div></div></div><button class="action-btn primary" style="margin-top:12px;width:100%" onclick="checkout()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/></svg>Commander</button>`;}
function checkout(){toast('Redirection paiement...','info');}
function toggleSub(){userContext.isSubscriber=!userContext.isSubscriber;userContext.tenureDays=userContext.isSubscriber?30:0;refreshKiffTechPrices();renderProducts();updateCartPanel();updateSubUI();toast(userContext.isSubscriber?'Abonnement active (1eur/jour)':'Desactive',userContext.isSubscriber?'success':'info');}
function updateSubUI(){const html=userContext.isSubscriber?'Gerer':'S\'abonner 1eur/jour';[$('#btn-subscribe'),$('#btn-subscribe-header')].forEach(el=>{if(el){el.innerHTML=html;el.className='action-btn '+(userContext.isSubscriber?'primary':'');}});updatePromoUI();}
function updatePromoUI(){const el=$('#promo-indicator');if(!el)return;if(userContext.isSubscriber)el.innerHTML=`<span class="promo-active">Abonne ${calcKiffTechPrice(100,{isSubscriber:true}).discount}%</span>`;else if(userContext.cartItems.length>=10)el.innerHTML=`<span class="promo-active">Promo -20%</span>`;else el.innerHTML=`<span class="promo-pending">${10-userContext.cartItems.length} pour -20%</span>`;}

// ============ AGENT IA : référence exacte marque + modèle ============
function normRef(s){return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');}
function agentFind(query){
  const q = normRef(query);
  if (!q) return { match: null, suggestions: [] };
  const exact = products.find(p => normRef(p.brand + ' ' + p.model) === q || normRef(p.model) === q);
  if (exact) return { match: exact, suggestions: [] };
  const suggestions = products.filter(p => normRef(p.brand + ' ' + p.model).includes(q) || normRef(p.model).includes(q)).slice(0, 3);
  return { match: null, suggestions };
}
function agentRender(){
  const box = $('#agent-result'); if (!box) return;
  const q = $('#agent-input') ? $('#agent-input').value : '';
  const found = agentFind(q) || { match: null, suggestions: [] };
  if (found.match) {
    const p = found.match;
    const kt = p.kifftech || calcKiffTechPrice(p.price.official, { isSubscriber: userContext.isSubscriber, cartItems: userContext.cartItems });
    box.innerHTML = `<div style="display:flex;gap:12px;padding:12px;background:rgba(30,107,255,.08);border:1px solid rgba(30,107,255,.35);border-radius:12px"><img src="${previewImage(p)}" alt="${p.brand} ${p.model}" decoding="async" style="width:72px;height:72px;object-fit:cover;border-radius:10px;flex-shrink:0"><div style="flex:1;min-width:0"><div style="font-size:.7rem;color:#1e6bff;text-transform:uppercase;letter-spacing:.06em;font-weight:700">${p.brand} • ${p.category}${p.year ? ' • ' + p.year : ''}</div><div style="font-weight:800">${p.model}</div><div style="font-size:.78rem;color:#b9c0e6;margin:2px 0">${p.description ? String(p.description).slice(0, 120) : Object.entries(p.specs || {}).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(' • ')}</div><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:4px 0"><span class="price-crossed">${fmtPrice(kt.official)}</span><span class="price-kifftech has-discount">${fmtPrice(kt.kifftech)}</span><span class="discount-badge">-${kt.discount}%</span></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn-sm primary" onclick="openModal('${p.id}')">Aperçu complet</button><button class="btn-sm" onclick="addToCart('${p.id}')">Ajouter</button></div></div></div>`;
  } else if (found.suggestions.length) {
    box.innerHTML = `<p style="font-size:.8rem;color:#b9c0e6">Pas d'exactitude — essayez :</p>` + found.suggestions.map(p => `<button class="btn-sm" data-agent-suggest="${p.brand} ${p.model}">${p.brand} ${p.model}</button>`).join('');
    box.querySelectorAll('[data-agent-suggest]').forEach(b => b.addEventListener('click', () => { $('#agent-input').value = b.dataset.agentSuggest; agentRender(); }));
  } else {
    box.innerHTML = `<p style="font-size:.8rem;color:#b9c0e6">Aucun produit « ${String(q).slice(0, 60)} ». Tapez marque + modèle exacts.</p>`;
  }
}

// ============ PARTENAIRE impact.com (JSON public, fusion sans altération des prix) ============
async function loadPartnerProducts(){
  try {
    const res = await fetch('./impact-products.json');
    if (!res.ok) return;
    const data = await res.json();
    const list = Array.isArray(data.products) ? data.products : [];
    const ids = new Set(products.map(p => p.id));
    let added = 0;
    for (const it of list) {
      const id = 'imp-' + (it.catalogId || 'x') + '-' + it.id;
      if (ids.has(id) || !it.model) continue;
      const raw = it.originalPrice ?? it.price;
      const o = Number(raw);
      if (!Number.isFinite(o)) continue;
      products.push({ id, brand: it.brand || 'Partenaire', model: it.model, year: null, category: 'Partenaires', price: { official: o }, specs: {}, images: it.images || [], sources: { official: it.url || '#' }, description: it.description, partner: true, kifftech: { official: o, kifftech: o, discount: 0, savings: 0, freeDelivery: false, reason: 'Prix partenaire', currency: it.currency || 'EUR' } });
      ids.add(id); added++;
    }
    if (added) { filteredProducts = [...products]; renderFilters(); applyFilters(); toast(`${added} produits partenaires`, 'success'); }
  } catch (e) { console.log('Catalogue partenaire indisponible, local uniquement'); }
}

// ============ FILTERS ============
function applyFilters(){filteredProducts=products.filter(p=>{if(!(p.images&&p.images.length))return false;if(searchQuery&&!`${p.brand} ${p.model} ${p.category}`.toLowerCase().includes(searchQuery.toLowerCase()))return false;if(activeCategory!=='all'&&p.category!==activeCategory)return false;if(activeYear!=='all'&&p.year!==parseInt(activeYear))return false;if(activeBrand!=='all'&&p.brand!==activeBrand)return false;if(activeEra!=='all'&&p.era!==activeEra)return false;return true;});if(activeSort==='brand')filteredProducts.sort((a,b)=>`${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`));else if(activeSort==='price-asc')filteredProducts.sort((a,b)=>(a.kifftech?.kifftech??a.price.official)-(b.kifftech?.kifftech??b.price.official));else if(activeSort==='price-desc')filteredProducts.sort((a,b)=>(b.kifftech?.kifftech??b.price.official)-(a.kifftech?.kifftech??a.price.official));renderProducts();}
function renderFilters(){const cats=['all',...new Set(products.map(p=>p.category))];$('#filter-category').innerHTML=cats.map(c=>`<button class="filter-btn ${c===activeCategory?'active':''}" data-cat="${c}">${c==='all'?'Toutes':c}</button>`).join('');const ss=$('#sort-select');if(ss)ss.value=activeSort;const years=['all',...[...new Set(products.map(p=>p.year))].sort((a,b)=>b-a)];$('#filter-year').innerHTML=years.map(y=>`<button class="filter-btn ${y===activeYear?'active':''}" data-year="${y}">${y==='all'?'Toutes':y}</button>`).join('');const brands=['all',...[...new Set(products.map(p=>p.brand))].sort()];$('#filter-brand').innerHTML=brands.map(b=>`<button class="filter-btn ${b===activeBrand?'active':''}" data-brand="${b}">${b==='all'?'Toutes':b}</button>`).join('');const eras=[['all','Tous'],['retro','🕹️ Rétro'],['modern','🚀 Modernes']];const fe=$('#filter-era');if(fe)fe.innerHTML=eras.map(([v,l])=>`<button class="filter-btn ${v===activeEra?'active':''}" data-era="${v}">${l}</button>`).join('');}

// ============ PARTICLES ============
function initParticles(){const c=$('#particules')||document.body.appendChild(Object.assign(document.createElement('div'),{id:'particules',className:'particules'}));const cols=['#1e6bff','#ff3d9a','#ffd23f','#27d17f','#00d4ff','#ff6b00'];for(let i=0;i<15;i++){const p=document.createElement('div');p.className='particule';const sx=(Math.random()-.5)*innerWidth*.8,sy=(Math.random()-.5)*innerHeight*.8,ex=(Math.random()-.5)*innerWidth*.8,ey=(Math.random()-.5)*innerHeight*.8,del=Math.random()*12,dur=10+Math.random()*8,op=.1+Math.random()*.2,clr=cols[Math.floor(Math.random()*cols.length)];p.style.cssText=`left:50%;top:50%;--sx:${sx}px;--sy:${sy}px;--ex:${ex}px;--ey:${ey}px;--op:${op};background:${clr};animation-duration:${dur}s;animation-delay:${del}s`;c.appendChild(p);}}

// ============ MODAL ============
function openModal(id){const p=products.find(x=>x.id===id);if(!p)return;const kt=p.kifftech;const has=kt.discount>0;
$('#modal-brand').textContent=p.brand;$('#modal-name').textContent=p.model;
$('#modal-meta').innerHTML=`<span class="meta-year">${p.year}</span><span>${p.category}</span>${kt.discount>0?`<span class="meta-promo">-${kt.discount}%</span>`:''}`;
$('#modal-desc').textContent = p.description || productReview(p).summary;
$('#modal-specs').innerHTML=Object.entries(p.specs||{}).map(([k,v])=>`<div class="spec-item"><span class="spec-label">${k}</span><span class="spec-value">${v}</span></div>`).join('')+(()=>{const r=productReview(p);return `<div class="spec-item"><span class="spec-label">Note KiffTech</span><span class="spec-value">★ ${r.note}/5</span></div><div class="spec-item"><span class="spec-label">Points +</span><span class="spec-value">${r.plus.join(' ; ')}</span></div><div class="spec-item"><span class="spec-label">À vérifier</span><span class="spec-value">${r.moins.join(' ; ')}</span></div><div class="spec-item"><span class="spec-label">Visuel</span><span class="spec-value">${hasOfficialPhoto(p)?'Photo CC BY-SA':'Aperçu généré — voir page officielle'}</span></div>`;})();
$('#modal-prices').innerHTML=`<div class="price-card"><div class="price-source">Officiel ${hasOfficialPhoto(p)?'• photo CC':''}</div><div class="price-value">${has?fmtPriceCrossed(kt.official):fmtPrice(kt.official)}</div><a class="price-link" href="${p.sources?.official||officialUrl(p)}" target="_blank" rel="noopener">Page officielle ${p.brand}</a></div>${has?`<div class="price-card primary"><div class="price-source">KiffTech <span class="discount-tag">-${kt.discount}%</span></div><div class="price-value">${fmtPrice(kt.kifftech)}</div><div style="color:#27d17f">Economisez ${fmtPrice(kt.savings)}</div><button class="price-link" style="margin-top:12px;background:linear-gradient(135deg,#27d17f,#1e6bff)" onclick="addToCart('${p.id}');closeModal()">Ajouter</button></div>`:''}`;
const gallery = (p.images && p.images.length ? p.images : [previewImage(p)]);
const galleryVideos = (p.videos && p.videos.length ? p.videos : []);
const m=$('#modal-media');m.innerHTML='';gallery.forEach((img,i)=>{const e=document.createElement('img');e.src=img;e.decoding='async';e.alt=`${p.brand} ${p.model} - visuel ${i + 1}`;e.style.display=(i===0?'block':'none');m.appendChild(e);});galleryVideos.forEach((src,i)=>{const v=document.createElement('video');v.src=src;v.controls=true;v.preload='none';v.setAttribute('aria-label',`${p.brand} ${p.model} - vidéo ${i + 1}`);v.style.display='none';v.style.width='100%';m.appendChild(v);});
const nav=$('#modal-media')&&$('#media-nav');if(nav){nav.innerHTML='';const total=gallery.length+galleryVideos.length;if(total>1){for(let i=0;i<total;i++){const d=document.createElement('button');d.className='media-dot'+(i===0?' active':'');d.setAttribute('aria-label','Média '+(i+1));d.onclick=()=>showMedia(i);nav.appendChild(d);}}}
const mt=$('#modal-title');if(mt)mt.dataset.currentId=id;$('#modal-overlay').classList.add('visible');document.body.style.overflow='hidden';}
function showMedia(idx){$$('#modal-media img, #modal-media video').forEach((e,i)=>{e.style.display=i===idx?'block':'none';if(e.tagName==='VIDEO'&&i!==idx&&e.pause)e.pause();});$$('#media-nav button').forEach((d,i)=>{d.classList.toggle('active',i===idx)});}
function closeModal(){$('#modal-overlay').classList.remove('visible');document.body.style.overflow='';}
function showMedia(idx){$$('#modal-media img, #modal-media video').forEach((e,i)=>{e.style.display=i===idx?'block':'none';if(e.tagName==='VIDEO'&&i!==idx&&e.pause)e.pause();});$$('#media-nav button').forEach((d,i)=>{d.classList.toggle('active',i===idx)});}

// ============ SUB ============
function toggleSub(){userContext.isSubscriber=!userContext.isSubscriber;userContext.tenureDays=userContext.isSubscriber?30:0;refreshKiffTechPrices();renderProducts();updateCartPanel();updateSubUI();toast(userContext.isSubscriber?'Abonnement active (1eur/jour)':'Desactive',userContext.isSubscriber?'success':'info');}
function updateSubUI(){const html=userContext.isSubscriber?'Gerer':`S'abonner 1eur/jour`;[$('#btn-subscribe'),$('#btn-subscribe-header')].forEach(el=>{if(el){el.innerHTML=html;el.className='action-btn '+(userContext.isSubscriber?'primary':'');}});updatePromoUI();}
function updatePromoUI(){const el=$('#promo-indicator');if(!el)return;if(userContext.isSubscriber)el.innerHTML=`<span class="promo-active">Abonne ${calcKiffTechPrice(100,{isSubscriber:true}).discount}%</span>`;else if(userContext.cartItems.length>=10)el.innerHTML=`<span class="promo-active">Promo -20%</span>`;else el.innerHTML=`<span class="promo-pending">${10-userContext.cartItems.length} pour -20%</span>`;}

// ============ EVENTS ============
function initEvents(){
  const on = (sel, ev, fn) => { const el = $(sel); if (el) el.addEventListener(ev, fn); };
  on('#search-input', 'input', e => { searchQuery = e.target.value; applyFilters(); });
  $$('.filter-btn[data-cat]').forEach(b=>b.addEventListener('click',()=>{activeCategory=b.dataset.cat;$$('.filter-btn[data-cat]').forEach(x=>x.classList.toggle('active',x===b));applyFilters();}));
  $$('.filter-btn[data-year]').forEach(b=>b.addEventListener('click',()=>{activeYear=b.dataset.year;$$('.filter-btn[data-year]').forEach(x=>x.classList.toggle('active',x===b));applyFilters();}));
  $$('.filter-btn[data-brand]').forEach(b=>b.addEventListener('click',()=>{activeBrand=b.dataset.brand;$$('.filter-btn[data-brand]').forEach(x=>x.classList.toggle('active',x===b));applyFilters();}));
  $$('.filter-btn[data-era]').forEach(b=>b.addEventListener('click',()=>{activeEra=b.dataset.era;$$('.filter-btn[data-era]').forEach(x=>x.classList.toggle('active',x===b));applyFilters();}));
  on('#agent-btn', 'click', agentRender);
  on('#agent-input', 'keydown', e => { if (e.key === 'Enter') agentRender(); });
  on('#sort-select', 'change', e => { activeSort = e.target.value; applyFilters(); });
  on('#btn-fetch', 'click', async () => { toast('Rechargement...', 'info'); await loadProducts(); });
  on('#btn-clear', 'click', () => { products = [...LOCAL_DB]; products.forEach(p => p.kifftech = calcKiffTechPrice(p.price.official)); filteredProducts = [...products]; applyFilters(); toast('Base locale restauree', 'success'); });
  const toggleSubHandler = () => { userContext.isSubscriber = !userContext.isSubscriber; userContext.tenureDays = userContext.isSubscriber ? 30 : 0; refreshKiffTechPrices(); renderProducts(); updateCartPanel(); updateSubUI(); toast(userContext.isSubscriber ? 'Abonnement active (1eur/jour)' : 'Desactive', userContext.isSubscriber ? 'success' : 'info'); };
  on('#btn-subscribe', 'click', toggleSubHandler);
  on('#btn-subscribe-header', 'click', toggleSubHandler);
  on('#btn-cart-header', 'click', () => { const p = document.getElementById('cart-panel'); if (p) p.scrollIntoView({ behavior: 'smooth' }); });
  on('#modal-close', 'click', closeModal);
  on('#modal-overlay', 'click', e => { if (e.target === e.currentTarget) closeModal(); });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
}

// ============ INIT ============
function init(){
  console.log('[KiffTech] init() called');
  console.log('[KiffTech] document.readyState:', document.readyState);
  console.log('KiffTech init, LOCAL_DB:', LOCAL_DB?.length);
  try {
    if (!products?.length) products = [...LOCAL_DB];
    try {
      const params = new URLSearchParams(window.location.search);
      const rayon = params.get('rayon');
      if (rayon && products.some(p => p.category === rayon)) activeCategory = rayon;
      const sort = params.get('sort');
      if (sort && ['brand', 'price-asc', 'price-desc'].includes(sort)) activeSort = sort;
      const era = params.get('era');
      if (era && ['retro', 'modern'].includes(era)) activeEra = era;
    } catch (e) { console.warn('[KiffTech] rayon param ignoré:', e.message); }
    console.log('[KiffTech] products assigned, length:', products.length);
    products.forEach(p => { if (!p.kifftech) p.kifftech = calcKiffTechPrice(p.price.official); });
    filteredProducts = [...products];
    console.log('[KiffTech] filteredProducts assigned, length:', filteredProducts.length);
    
    renderFilters();
    console.log('[KiffTech] renderFilters done');
    refreshKiffTechPrices();
    console.log('[KiffTech] refreshKiffTechPrices done');
    applyFilters();
    console.log('[KiffTech] applyFilters done');
    loadProducts();
    console.log('[KiffTech] loadProducts called');
    loadPartnerProducts();
    initEvents();
    console.log('[KiffTech] initEvents done');
    initParticles();
    console.log('[KiffTech] initParticles done');
    updateSubUI();
    console.log('[KiffTech] updateSubUI done');
    console.log('KiffTech initialized, products:', products.length);
    console.log('[KiffTech] init() completed successfully');
  } catch(e) {
    console.error('[KiffTech] init() ERROR:', e);
    document.body.innerHTML += '<pre style="color:red;padding:20px;background:#1a1d3a;position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;overflow:auto">INIT ERROR: ' + e.message + '\n' + e.stack + '</pre>';
  }
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

window.KiffTech={products:()=>products,fetch:loadProducts,subscribe:()=>{userContext.isSubscriber=!userContext.isSubscriber;userContext.tenureDays=userContext.isSubscriber?30:0;refreshKiffTechPrices();renderProducts();updateSubUI();}};