// ============ LOCAL_DB (80 produits, 8 catégories × 10) ============
console.log('[KiffTech] SCRIPT START - Loading app.js');
document.title = '[KiffTech] Script loaded - ' + document.title;
const banner = document.createElement('div');
banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#27d17f;color:#070816;padding:10px;text-align:center;z-index:9999;font-weight:bold;font-size:14px';
banner.textContent = '✅ KiffTech script executing - LOCAL_DB: 80 products';
document.body.appendChild(banner);
console.log('[KiffTech] Module loaded, LOCAL_DB length:', 80);
const LOCAL_DB = [
  // --- Smartphones (10) ---
  {id:'sp1',images:['./img/sp1.jpg','./img/sp1b.jpg'],brand:'Samsung',model:'Galaxy S24 Ultra',year:2024,category:'Smartphones',price:{official:1469},specs:{Écran:'6.8" Dynamic AMOLED 2X 120Hz',Processeur:'Snapdragon 8 Gen 3',RAM:'12 Go',Stockage:'256 Go',Appareil:'200+50+12+10 MP',Batterie:'5000 mAh'}},  
  {id:'sp2',images:['./img/sp2.png'],brand:'Apple',model:'iPhone 15 Pro Max',year:2023,category:'Smartphones',price:{official:1479},specs:{Écran:'6.7" Super Retina XDR 120Hz',Processeur:'A17 Pro',RAM:'8 Go',Stockage:'256 Go',Appareil:'48+12+12 MP',Batterie:'4441 mAh'}},  
  {id:'sp3',brand:'Xiaomi',model:'14 Ultra',year:2024,category:'Smartphones',price:{official:1499},specs:{Écran:'6.73" LTPO AMOLED 120Hz',Processeur:'Snapdragon 8 Gen 3',RAM:'16 Go',Stockage:'512 Go',Appareil:'50+50+50+50 MP Leica',Batterie:'5300 mAh'}},  
  {id:'sp4',images:['./img/sp4.png'],brand:'Google',model:'Pixel 8 Pro',year:2023,category:'Smartphones',price:{official:1099},specs:{Écran:'6.7" LTPO OLED 120Hz',Processeur:'Tensor G3',RAM:'12 Go',Stockage:'128 Go',Appareil:'50+48+48 MP',Batterie:'5050 mAh'}},  
  {id:'sp5',brand:'OnePlus',model:'12',year:2024,category:'Smartphones',price:{official:969},specs:{Écran:'6.82" LTPO AMOLED 120Hz',Processeur:'Snapdragon 8 Gen 3',RAM:'16 Go',Stockage:'512 Go',Appareil:'50+64+48 MP',Batterie:'5400 mAh'}},  
  {id:'sp6',images:['./img/sp6.jpg'],brand:'Nothing',model:'Phone 2a',year:2024,category:'Smartphones',price:{official:349},specs:{Écran:'6.7" AMOLED 120Hz',Processeur:'MediaTek Dimensity 7200 Pro',RAM:'12 Go',Stockage:'256 Go',Appareil:'50+50 MP',Batterie:'5000 mAh'}},  
  {id:'sp7',brand:'Motorola',model:'Edge 50 Ultra',year:2024,category:'Smartphones',price:{official:999},specs:{Écran:'6.7" pOLED 144Hz',Processeur:'Snapdragon 8s Gen 3',RAM:'12 Go',Stockage:'512 Go',Appareil:'50+64+50 MP',Batterie:'4500 mAh'}},  
  {id:'sp8',images:['./img/sp8.jpg'],brand:'OPPO',model:'Find X7 Ultra',year:2024,category:'Smartphones',price:{official:1299},specs:{Écran:'6.82" LTPO AMOLED 120Hz',Processeur:'Snapdragon 8 Gen 3',RAM:'16 Go',Stockage:'512 Go',Appareil:'50+50+50+50 MP',Batterie:'5000 mAh'}},  
  {id:'sp9',brand:'Realme',model:'GT 6',year:2024,category:'Smartphones',price:{official:699},specs:{Écran:'6.78" LTPO AMOLED 120Hz',Processeur:'Snapdragon 8s Gen 3',RAM:'16 Go',Stockage:'256 Go',Appareil:'50+50+8 MP',Batterie:'5500 mAh'}},  
  {id:'sp10',brand:'POCO',model:'F6 Pro',year:2024,category:'Smartphones',price:{official:579},specs:{Écran:'6.67" Flow AMOLED 120Hz',Processeur:'Snapdragon 8 Gen 2',RAM:'12 Go',Stockage:'256 Go',Appareil:'50+8+2 MP',Batterie:'5000 mAh'}},
  {id:'sp11',images:['./img/sp11.png'],brand:'Apple',model:'iPhone 15',year:2023,category:'Smartphones',price:{official:869},specs:{Écran:'6.1" Super Retina XDR',Processeur:'A16 Bionic',RAM:'6 Go',Stockage:'128 Go',Appareil:'48+12 MP',Batterie:'3349 mAh'}},
  {id:'sp12',images:['./img/sp12.jpg'],brand:'Samsung',model:'Galaxy S24+',year:2024,category:'Smartphones',price:{official:1169},specs:{Écran:'6.7" QHD+ AMOLED 120Hz',Processeur:'Exynos 2400',RAM:'12 Go',Stockage:'256 Go',Appareil:'50+12+10 MP',Batterie:'4900 mAh'}},
  {id:'sp13',images:['./img/sp13.jpg'],brand:'Google',model:'Pixel 8a',year:2024,category:'Smartphones',price:{official:549},specs:{Écran:'6.1" OLED 120Hz',Processeur:'Tensor G3',RAM:'8 Go',Stockage:'128 Go',Appareil:'64+13 MP',Batterie:'4492 mAh'}},
  {id:'sp14',images:['./img/sp14.jpg'],brand:'Xiaomi',model:'Redmi Note 13 Pro',year:2024,category:'Smartphones',price:{official:349},specs:{Écran:'6.67" AMOLED 120Hz',Processeur:'Snapdragon 7s Gen 2',RAM:'8 Go',Stockage:'256 Go',Appareil:'200+8+2 MP',Batterie:'5100 mAh'}},
  {id:'sp15',images:['./img/sp15.jpg'],brand:'Samsung',model:'Galaxy Z Flip 6',year:2024,category:'Smartphones',price:{official:1209},specs:{Écran:'6.7" Pliable AMOLED 120Hz + 3.4" externe',Processeur:'Snapdragon 8 Gen 3',RAM:'12 Go',Stockage:'256 Go',Appareil:'50+12 MP',Batterie:'4000 mAh'}},
  {id:'sp16',images:['./img/sp16.jpg'],brand:'OnePlus',model:'Nord 4',year:2024,category:'Smartphones',price:{official:499},specs:{Écran:'6.74" AMOLED 120Hz',Processeur:'Snapdragon 7+ Gen 3',RAM:'12 Go',Stockage:'256 Go',Appareil:'50+8 MP',Batterie:'5500 mAh'}},
  {id:'sp17',images:['./img/sp17.png'],brand:'Nothing',model:'Phone (2)',year:2023,category:'Smartphones',price:{official:679},specs:{Écran:'6.7" LTPO OLED 120Hz',Processeur:'Snapdragon 8+ Gen 1',RAM:'12 Go',Stockage:'256 Go',Appareil:'50+50 MP',Batterie:'4700 mAh'}},
  {id:'sp18',images:['./img/sp18.jpg'],brand:'Honor',model:'Magic 6 Pro',year:2024,category:'Smartphones',price:{official:1299},specs:{Écran:'6.8" LTPO OLED 120Hz',Processeur:'Snapdragon 8 Gen 3',RAM:'12 Go',Stockage:'512 Go',Appareil:'50+180+50 MP',Batterie:'5600 mAh'}},
  {id:'sp19',brand:'Motorola',model:'Moto G85',year:2024,category:'Smartphones',price:{official:349},specs:{Écran:'6.67" pOLED 144Hz',Processeur:'Snapdragon 6s Gen 3',RAM:'12 Go',Stockage:'256 Go',Appareil:'50+8 MP',Batterie:'5000 mAh'}},
  {id:'sp20',brand:'Xiaomi',model:'Redmi Note 13 Pro+ 5G',year:2024,category:'Smartphones',price:{official:449},specs:{Écran:'6.67" AMOLED 120Hz incurvé',Processeur:'Dimensity 7200 Ultra',RAM:'12 Go',Stockage:'512 Go',Appareil:'200+8+2 MP',Batterie:'5000 mAh 120W'}},

  // --- Computers (10) ---
  {id:'cp1',images:['./img/cp1.jpg'],brand:'Apple',model:'MacBook Pro 16 M3 Max',year:2023,category:'Computers',price:{official:3999},specs:{Écran:'16.2" Liquid Retina XDR',Processeur:'M3 Max 16 cœurs',RAM:'48 Go',Stockage:'1 To SSD',GPU:'40 cœurs',Autonomie:'22 h'}},  
  {id:'cp2',images:['./img/cp2.jpg'],brand:'Dell',model:'XPS 15 9530',year:2023,category:'Computers',price:{official:2499},specs:{Écran:'15.6" 3.5K OLED Touch',Processeur:'i9-13900H',RAM:'32 Go',Stockage:'1 To SSD',GPU:'RTX 4070 8 Go',Autonomie:'10 h'}},  
  {id:'cp3',images:['./img/cp3.jpg'],brand:'ASUS',model:'ROG Zephyrus G14',year:2024,category:'Computers',price:{official:1999},specs:{Écran:'14" 3K OLED 120Hz',Processeur:'Ryzen 9 8945HS',RAM:'32 Go',Stockage:'1 To SSD',GPU:'RTX 4070 8 Go',Autonomie:'10 h'}},  
  {id:'cp4',brand:'Lenovo',model:'ThinkPad X1 Carbon Gen 12',year:2024,category:'Computers',price:{official:2299},specs:{Écran:'14" 2.8K OLED 120Hz',Processeur:'Core Ultra 7 155H',RAM:'32 Go',Stockage:'1 To SSD',GPU:'Arc Graphics',Autonomie:'15 h'}},  
  {id:'cp5',brand:'HP',model:'Spectre x360 14',year:2024,category:'Computers',price:{official:1799},specs:{Écran:'13.5" 2.8K OLED 120Hz',Processeur:'Core Ultra 7 155H',RAM:'16 Go',Stockage:'1 To SSD',GPU:'Arc Graphics',Autonomie:'13 h'}},  
  {id:'cp6',images:['./img/cp6.jpg'],brand:'Framework',model:'Laptop 13 AMD',year:2024,category:'Computers',price:{official:1049},specs:{Écran:'13.5" 2256x1504 3:2',Processeur:'Ryzen 5 7640U',RAM:'16 Go',Stockage:'512 Go SSD',GPU:'Radeon 760M',Autonomie:'10 h'}},  
  {id:'cp7',brand:'MSI',model:'Stealth 16 AI Studio',year:2024,category:'Computers',price:{official:2699},specs:{Écran:'16" 4K Mini LED 120Hz',Processeur:'Core Ultra 9 185H',RAM:'32 Go',Stockage:'2 To SSD',GPU:'RTX 4080 12 Go',Autonomie:'8 h'}},  
  {id:'cp8',brand:'Razer',model:'Blade 16',year:2024,category:'Computers',price:{official:3299},specs:{Écran:'16" Dual Mode Mini LED',Processeur:'i9-14900HX',RAM:'32 Go',Stockage:'2 To SSD',GPU:'RTX 4090 16 Go',Autonomie:'6 h'}},  
  {id:'cp9',images:['./img/cp9.jpg'],brand:'LG',model:'Gram 17',year:2024,category:'Computers',price:{official:1699},specs:{Écran:'17" WQXGA IPS 144Hz',Processeur:'Core Ultra 7 155H',RAM:'16 Go',Stockage:'1 To SSD',GPU:'Arc Graphics',Autonomie:'18 h'}},  
  {id:'cp10',brand:'Samsung',model:'Galaxy Book4 Ultra',year:2024,category:'Computers',price:{official:2799},specs:{Écran:'16" 3K AMOLED 120Hz',Processeur:'Core Ultra 9 185H',RAM:'32 Go',Stockage:'1 To SSD',GPU:'RTX 4070 8 Go',Autonomie:'14 h'}},  

  // --- Tablets (10) ---
  {id:'tb1',images:['./img/tb1.jpg'],brand:'Apple',model:'iPad Pro 13 M4',year:2024,category:'Tablets',price:{official:1599},specs:{Écran:'13" Ultra Retina XDR 120Hz',Processeur:'M4 10 cœurs',RAM:'16 Go',Stockage:'512 Go',Caméra:'12 MP + 10 MP',Autonomie:'10 h'}},  
  {id:'tb2',images:['./img/tb2.jpg'],brand:'Samsung',model:'Galaxy Tab S9 Ultra',year:2023,category:'Tablets',price:{official:1399},specs:{Écran:'14.6" Dynamic AMOLED 2X 120Hz',Processeur:'Snapdragon 8 Gen 2',RAM:'12 Go',Stockage:'256 Go',Caméra:'13+8 MP',Autonomie:'12 h'}},  
  {id:'tb3',images:['./img/tb3.jpg'],brand:'Xiaomi',model:'Pad 6S Pro 12.4',year:2024,category:'Tablets',price:{official:599},specs:{Écran:'12.4" 3K 144Hz',Processeur:'Snapdragon 8 Gen 2',RAM:'12 Go',Stockage:'256 Go',Caméra:'50 MP',Autonomie:'14 h'}},  
  {id:'tb4',brand:'Lenovo',model:'Tab Extreme',year:2023,category:'Tablets',price:{official:699},specs:{Écran:'14.5" 3K OLED 120Hz',Processeur:'Dimensity 9000',RAM:'12 Go',Stockage:'256 Go',Caméra:'13 MP',Autonomie:'10 h'}},  
  {id:'tb5',brand:'OnePlus',model:'Pad 2',year:2024,category:'Tablets',price:{official:549},specs:{Écran:'12.1" 3K 144Hz',Processeur:'Snapdragon 8 Gen 3',RAM:'12 Go',Stockage:'256 Go',Caméra:'13 MP',Autonomie:'13 h'}},  
  {id:'tb6',images:['./img/tb6.png'],brand:'Google',model:'Pixel Tablet',year:2023,category:'Tablets',price:{official:599},specs:{Écran:'10.95" 2560x1600 60Hz',Processeur:'Tensor G2',RAM:'8 Go',Stockage:'128 Go',Caméra:'8 MP',Autonomie:'12 h'}},  
  {id:'tb7',brand:'Microsoft',model:'Surface Pro 10',year:2024,category:'Tablets',price:{official:1199},specs:{Écran:'13" 2880x1920 120Hz',Processeur:'Core Ultra 7 165H',RAM:'16 Go',Stockage:'256 Go',Caméra:'10 MP',Autonomie:'11 h'}},  
  {id:'tb8',images:['./img/tb8.jpg'],brand:'Huawei',model:'MatePad Pro 13.2',year:2023,category:'Tablets',price:{official:799},specs:{Écran:'13.2" 2.8K OLED 144Hz',Processeur:'Kirin 9000S',RAM:'12 Go',Stockage:'256 Go',Caméra:'13 MP',Autonomie:'12 h'}},  
  {id:'tb9',brand:'OPPO',model:'Pad 3 Pro',year:2024,category:'Tablets',price:{official:499},specs:{Écran:'11.61" 2.8K 144Hz',Processeur:'Snapdragon 8 Gen 3',RAM:'12 Go',Stockage:'256 Go',Caméra:'13 MP',Autonomie:'13 h'}},  
  {id:'tb10',brand:'Nothing',model:'Tablet (rumored)',year:2024,category:'Tablets',price:{official:399},specs:{Écran:'11" 2K 120Hz',Processeur:'Dimensity 8200',RAM:'8 Go',Stockage:'128 Go',Caméra:'8 MP',Autonomie:'10 h'}},
  {id:'tb11',brand:'Apple',model:'iPad Air 13 M3',year:2025,category:'Tablets',price:{official:949},specs:{Écran:'13" Liquid Retina',Processeur:'Apple M3',Stockage:'128 Go',Appareil:'12 MP',Autonomie:'10 h'}},
  {id:'tb12',brand:'Samsung',model:'Galaxy Tab S10+',year:2024,category:'Tablets',price:{official:1119},specs:{Écran:'12.4" AMOLED 120Hz',Processeur:'Dimensity 9300+',RAM:'12 Go',Stockage:'256 Go',Appareil:'13+8 MP',Batterie:'10090 mAh'}},
  {id:'tb13',images:['./img/tb13.jpg'],brand:'Xiaomi',model:'Pad 7',year:2024,category:'Tablets',price:{official:399},specs:{Écran:'11.2" 3.2K 144Hz',Processeur:'Snapdragon 7+ Gen 3',RAM:'8 Go',Stockage:'128 Go',Appareil:'13 MP',Batterie:'8850 mAh'}},
  {id:'tb14',brand:'Lenovo',model:'Tab P12',year:2023,category:'Tablets',price:{official:399},specs:{Écran:'12.7" LCD 3K',Processeur:'Dimensity 7050',RAM:'8 Go',Stockage:'128 Go',Appareil:'13 MP',Batterie:'10200 mAh'}},
  {id:'tb15',brand:'OnePlus',model:'Pad Go',year:2023,category:'Tablets',price:{official:299},specs:{Écran:'11.35" 2.4K',Processeur:'Helio G99',RAM:'8 Go',Stockage:'128 Go',Appareil:'8 MP',Batterie:'8000 mAh'}},
  {id:'tb16',brand:'Microsoft',model:'Surface Pro 11',year:2024,category:'Tablets',price:{official:1199},specs:{Écran:'13" OLED tactile',Processeur:'Snapdragon X Elite',RAM:'16 Go',Stockage:'512 Go',Appareil:'10 MP',Autonomie:'14 h'}},
  {id:'tb17',brand:'Samsung',model:'Galaxy Tab S9 FE',year:2023,category:'Tablets',price:{official:529},specs:{Écran:'10.9" LCD 90Hz',Processeur:'Exynos 1380',RAM:'6 Go',Stockage:'128 Go',Appareil:'8 MP',Batterie:'8000 mAh'}},
  {id:'tb18',brand:'Honor',model:'Pad 9',year:2024,category:'Tablets',price:{official:349},specs:{Écran:'12.1" 2.5K 120Hz',Processeur:'Snapdragon 6 Gen 1',RAM:'8 Go',Stockage:'256 Go',Appareil:'13 MP',Batterie:'8300 mAh'}},
  {id:'tb19',brand:'Samsung',model:'Galaxy Tab A9+',year:2023,category:'Tablets',price:{official:299},specs:{Écran:'11" LCD 90Hz',Processeur:'Snapdragon 695',RAM:'8 Go',Stockage:'128 Go',Appareil:'8 MP',Batterie:'7040 mAh'}},
  {id:'tb20',brand:'Apple',model:'iPad 10',year:2022,category:'Tablets',price:{official:409},specs:{Écran:'10.9" Liquid Retina',Processeur:'A14 Bionic',Stockage:'64 Go',Appareil:'12 MP',Autonomie:'10 h'}},
  {id:'ac1',brand:'Anker',model:'737 Power Bank 120W 24000mAh',year:2023,category:'Accessories',price:{official:99},specs:{Type:'Batterie externe',Capacité:'24000 mAh',Puissance:'120W',Ports:'2x USB-C + USB-A'}},
  {id:'ac2',brand:'Anker',model:'733 Power Bank 65W 10000mAh',year:2022,category:'Accessories',price:{official:99},specs:{Type:'Batterie + chargeur 2-en-1',Capacité:'10000 mAh',Puissance:'65W GaN',Ports:'2x USB-C + USB-A'}},
  {id:'ac3',brand:'Xiaomi',model:'Power Bank 20000mAh 33W',year:2023,category:'Accessories',price:{official:39},specs:{Type:'Batterie externe',Capacité:'20000 mAh',Puissance:'33W',Ports:'USB-C + 2x USB-A'}},
  {id:'ac4',brand:'Samsung',model:'Battery Pack 25W 10000mAh',year:2023,category:'Accessories',price:{official:49},specs:{Type:'Batterie externe',Capacité:'10000 mAh',Puissance:'25W',Ports:'USB-C'}},
  {id:'ac5',brand:'Apple',model:'MagSafe Battery Pack',year:2021,category:'Accessories',price:{official:109},specs:{Type:'Batterie magnétique iPhone',Capacité:'1460 mAh',Puissance:'15W MagSafe',Ports:'Lightning'}},
  {id:'ac6',brand:'Ugreen',model:'Nexode Power Bank 20000mAh 130W',year:2023,category:'Accessories',price:{official:79},specs:{Type:'Batterie externe',Capacité:'20000 mAh',Puissance:'130W',Ports:'2x USB-C + USB-A'}},
  {id:'ac7',brand:'Belkin',model:'BoostCharge 10K USB-C',year:2023,category:'Accessories',price:{official:35},specs:{Type:'Batterie externe',Capacité:'10000 mAh',Puissance:'20W',Ports:'USB-C + USB-A'}},
  {id:'ac8',brand:'Zendure',model:'SuperTank Pro 26800mAh 100W',year:2022,category:'Accessories',price:{official:249},specs:{Type:'Batterie externe',Capacité:'26800 mAh',Puissance:'100W',Ports:'2x USB-C + 2x USB-A'}},
  {id:'ac9',brand:'Shargeek',model:'Storm 2 100W 25600mAh',year:2022,category:'Accessories',price:{official:229},specs:{Type:'Batterie externe transparente',Capacité:'25600 mAh',Puissance:'100W',Ports:'USB-C + USB-A + DC'}},
  {id:'ac10',brand:'Baseus',model:'Blade 100W 20000mAh',year:2022,category:'Accessories',price:{official:69},specs:{Type:'Batterie externe fine',Capacité:'20000 mAh',Puissance:'100W',Ports:'2x USB-C + 2x USB-A'}},
  {id:'ac11',brand:'Anker',model:'735 Charger GaNPrime 65W',year:2022,category:'Accessories',price:{official:59},specs:{Type:'Chargeur mural GaN',Puissance:'65W',Ports:'2x USB-C + USB-A',Technologie:'GaNPrime'}},
  {id:'ac12',brand:'Ugreen',model:'Nexode 65W GaN',year:2023,category:'Accessories',price:{official:49},specs:{Type:'Chargeur mural GaN',Puissance:'65W',Ports:'2x USB-C + USB-A',Technologie:'GaN'}},
  {id:'ac13',brand:'Samsung',model:'Chargeur 45W USB-C',year:2023,category:'Accessories',price:{official:49},specs:{Type:'Chargeur mural',Puissance:'45W',Ports:'USB-C',Protocole:'PD + PPS'}},
  {id:'ac14',brand:'Apple',model:'Adaptateur 70W USB-C',year:2023,category:'Accessories',price:{official:65},specs:{Type:'Chargeur mural',Puissance:'70W',Ports:'USB-C',Compatibilité:'MacBook Air/Pro'}},
  {id:'ac15',brand:'Xiaomi',model:'Chargeur GaN 67W',year:2023,category:'Accessories',price:{official:39},specs:{Type:'Chargeur mural GaN',Puissance:'67W',Ports:'USB-A + USB-C',Protocole:'Turbo Charge'}},
  {id:'ac16',brand:'Belkin',model:'Chargeur 65W Dual USB-C',year:2023,category:'Accessories',price:{official:45},specs:{Type:'Chargeur mural GaN',Puissance:'65W',Ports:'2x USB-C',Technologie:'GaN'}},
  {id:'ac17',brand:'Baseus',model:'GaN5 Pro 65W',year:2023,category:'Accessories',price:{official:49},specs:{Type:'Chargeur mural GaN',Puissance:'65W',Ports:'2x USB-C + USB-A',Technologie:'GaN5'}},
  {id:'ac18',brand:'Ugreen',model:'Nexode 100W GaN',year:2023,category:'Accessories',price:{official:79},specs:{Type:'Chargeur mural GaN',Puissance:'100W',Ports:'3x USB-C + USB-A',Technologie:'GaN'}},
  {id:'ac19',brand:'Anker',model:'737 Charger 120W GaNPrime',year:2022,category:'Accessories',price:{official:94},specs:{Type:'Chargeur mural GaN',Puissance:'120W',Ports:'2x USB-C + USB-A',Technologie:'GaNPrime'}},
  {id:'ac20',brand:'Apple',model:'Adaptateur 140W USB-C',year:2023,category:'Accessories',price:{official:105},specs:{Type:'Chargeur mural GaN',Puissance:'140W',Ports:'USB-C',Compatibilité:'MacBook Pro 16'}},
  {id:'ac21',brand:'Google',model:'Chargeur 45W USB-C',year:2024,category:'Accessories',price:{official:29},specs:{Type:'Chargeur mural',Puissance:'45W',Ports:'USB-C',Compatibilité:'Pixel'}},
  {id:'ac22',brand:'OnePlus',model:'SuperVOOC 100W',year:2023,category:'Accessories',price:{official:59},specs:{Type:'Chargeur mural',Puissance:'100W',Ports:'USB-A + USB-C',Protocole:'SuperVOOC'}},
  {id:'ac23',brand:'Nothing',model:'Power 45W',year:2023,category:'Accessories',price:{official:19},specs:{Type:'Chargeur mural',Puissance:'45W',Ports:'2x USB-C',Protocole:'PD'}},
  {id:'ac24',brand:'Satechi',model:'165W USB-C 4-Port GaN',year:2023,category:'Accessories',price:{official:129},specs:{Type:'Chargeur bureau GaN',Puissance:'165W',Ports:'4x USB-C',Technologie:'GaN'}},
  {id:'ac25',brand:'Oppo',model:'SuperVOOC 80W',year:2022,category:'Accessories',price:{official:39},specs:{Type:'Chargeur mural',Puissance:'80W',Ports:'USB-A + USB-C',Protocole:'SuperVOOC'}},
  {id:'ac26',brand:'Anker',model:'765 Câble USB-C 140W 1.8m',year:2023,category:'Accessories',price:{official:25},specs:{Type:'Câble USB-C vers USB-C',Puissance:'140W PD 3.1',Longueur:'1.8 m',Technologie:'Nylon tressé'}},
  {id:'ac27',brand:'Apple',model:'Câble Thunderbolt 4 Pro 1.8m',year:2021,category:'Accessories',price:{official:149},specs:{Type:'Câble Thunderbolt 4',Débit:'40 Gb/s',Longueur:'1.8 m',Puissance:'100W'}},
  {id:'ac28',brand:'Belkin',model:'BoostCharge Câble USB-C 60W 2m',year:2023,category:'Accessories',price:{official:19},specs:{Type:'Câble USB-C vers USB-C',Puissance:'60W',Longueur:'2 m',Technologie:'Nylon tressé'}},
  {id:'ac29',brand:'Ugreen',model:'Câble USB-C 100W 2m',year:2023,category:'Accessories',price:{official:15},specs:{Type:'Câble USB-C vers USB-C',Puissance:'100W',Longueur:'2 m',Technologie:'Nylon tressé'}},
  {id:'ac30',brand:'Anker',model:'643 Câble 240W 1.8m',year:2023,category:'Accessories',price:{official:19},specs:{Type:'Câble USB-C vers USB-C',Puissance:'240W PD 3.1',Longueur:'1.8 m',Technologie:'Bio-nylon'}},
  {id:'ac31',brand:'Samsung',model:'Câble USB-C 25W 1m',year:2023,category:'Accessories',price:{official:15},specs:{Type:'Câble USB-C vers USB-C',Puissance:'25W',Longueur:'1 m',Protocole:'PD + PPS'}},
  {id:'ac32',brand:'Baseus',model:'Câble 100W USB-C 1m',year:2023,category:'Accessories',price:{official:12},specs:{Type:'Câble USB-C vers USB-C',Puissance:'100W',Longueur:'1 m',Affichage:'Écran tension'}},
  {id:'ac33',brand:'Apple',model:'Câble USB-C 2m',year:2023,category:'Accessories',price:{official:25},specs:{Type:'Câble USB-C vers USB-C',Puissance:'60W',Longueur:'2 m',Technologie:'Tressé'}},
  {id:'ac34',brand:'Anker',model:'333 Câble USB-C 1.8m',year:2022,category:'Accessories',price:{official:18},specs:{Type:'Câble USB-A vers USB-C',Puissance:'15W',Longueur:'1.8 m',Technologie:'Nylon tressé'}},
  {id:'ac35',brand:'Cable Matters',model:'Thunderbolt 4 2m',year:2023,category:'Accessories',price:{official:55},specs:{Type:'Câble Thunderbolt 4',Débit:'40 Gb/s',Longueur:'2 m',Puissance:'100W'}},
  {id:'ac36',brand:'Apple',model:'Coque Silicone iPhone 15 Pro',year:2023,category:'Accessories',price:{official:59},specs:{Type:'Coque MagSafe',Compatibilité:'iPhone 15 Pro',Matière:'Silicone',Protection:'Antimicrobienne'}},
  {id:'ac37',brand:'Apple',model:'Coque Transparente MagSafe iPhone 15',year:2023,category:'Accessories',price:{official:59},specs:{Type:'Coque MagSafe',Compatibilité:'iPhone 15',Matière:'Polycarbonate',Protection:'Antichoc'}},
  {id:'ac38',brand:'Samsung',model:'Rugged Gadget S24 Ultra',year:2024,category:'Accessories',price:{official:49},specs:{Type:'Coque renforcée',Compatibilité:'Galaxy S24 Ultra',Protection:'Militaire',Matière:'TPU + PC'}},
  {id:'ac39',brand:'Spigen',model:'Tough Armor Galaxy S24 Ultra',year:2024,category:'Accessories',price:{official:19},specs:{Type:'Coque renforcée',Compatibilité:'Galaxy S24 Ultra',Protection:'Air Cushion',Matière:'TPU + PC'}},
  {id:'ac40',brand:'Spigen',model:'Ultra Hybrid iPhone 15',year:2023,category:'Accessories',price:{official:17},specs:{Type:'Coque transparente MagSafe',Compatibilité:'iPhone 15',Protection:'Antichoc',Matière:'TPU + PC'}},
  {id:'ac41',brand:'ESR',model:'HaloLock iPhone 15',year:2023,category:'Accessories',price:{official:22},specs:{Type:'Coque magnétique',Compatibilité:'iPhone 15',Protection:'Militaire',Matière:'TPU + PC'}},
  {id:'ac42',brand:'OtterBox',model:'Defender Galaxy S24',year:2024,category:'Accessories',price:{official:69},specs:{Type:'Coque renforcée',Compatibilité:'Galaxy S24',Protection:'DROP+ 5x',Matière:'Polycarbonate'}},
  {id:'ac43',brand:'Mous',model:'Limitless 5.0 iPhone 15 Pro',year:2023,category:'Accessories',price:{official:65},specs:{Type:'Coque premium MagSafe',Compatibilité:'iPhone 15 Pro',Protection:'AiroShock',Matière:'Aramide'}},
  {id:'ac44',brand:'Pitaka',model:'MagEZ Case 4 S24 Ultra',year:2024,category:'Accessories',price:{official:69},specs:{Type:'Coque fine MagSafe',Compatibilité:'Galaxy S24 Ultra',Matière:'Fibre aramide',Épaisseur:'0.95 mm'}},
  {id:'ac45',brand:'Bellroy',model:'Étui Cuir iPhone 15',year:2023,category:'Accessories',price:{official:65},specs:{Type:'Coque cuir MagSafe',Compatibilité:'iPhone 15',Matière:'Cuir tanné',Protection:'Microfibre'}},
  {id:'ac46',brand:'Apple',model:'Smart Folio iPad 10',year:2022,category:'Accessories',price:{official:99},specs:{Type:'Housse iPad',Compatibilité:'iPad 10',Fonction:'Veille auto',Matière:'Polyuréthane'}},
  {id:'ac47',brand:'ESR',model:'Rebound iPad 10',year:2022,category:'Accessories',price:{official:35},specs:{Type:'Housse iPad magnétique',Compatibilité:'iPad 10',Fonction:'Trifold + crayon',Matière:'PU'}},
  {id:'ac48',brand:'Spigen',model:'GlasTR Galaxy S24 Ultra x2',year:2024,category:'Accessories',price:{official:17},specs:{Type:'Verre trempé (lot de 2)',Compatibilité:'Galaxy S24 Ultra',Dureté:'9H',Pose:'Cadre alignement'}},
  {id:'ac49',brand:'ESR',model:'Armorite iPhone 15 Pro',year:2023,category:'Accessories',price:{official:15},specs:{Type:'Verre trempé',Compatibilité:'iPhone 15 Pro',Dureté:'9H',Protection:'Anti-traces'}},
  {id:'ac50',brand:'Belkin',model:'InvisiGlass iPhone 15',year:2023,category:'Accessories',price:{official:29},specs:{Type:'Verre trempé',Compatibilité:'iPhone 15',Dureté:'9H',Traitement:'Antireflet'}},
  {id:'ac51',brand:'amFilm',model:'Verre trempé iPad 10',year:2022,category:'Accessories',price:{official:13},specs:{Type:'Verre trempé',Compatibilité:'iPad 10',Dureté:'9H',Pose:'Cadre alignement'}},
  {id:'ac52',brand:'Zagg',model:'InvisibleShield S24',year:2024,category:'Accessories',price:{official:49},specs:{Type:'Protection écran',Compatibilité:'Galaxy S24',Technologie:'D3O',Garantie:'À vie'}},
  {id:'ac53',brand:'Apple',model:'Portefeuille FineWoven MagSafe',year:2023,category:'Accessories',price:{official:69},specs:{Type:'Portefeuille magnétique',Compatibilité:'MagSafe',Matière:'FineWoven',Capacité:'3 cartes'}},
  {id:'ac54',brand:'ESR',model:'Geo Wallet MagSafe',year:2023,category:'Accessories',price:{official:35},specs:{Type:'Portefeuille magnétique',Compatibilité:'MagSafe',Suivi:'Find My',Capacité:'3 cartes'}},
  {id:'ac55',brand:'Bellroy',model:'Mod Wallet MagSafe',year:2023,category:'Accessories',price:{official:79},specs:{Type:'Portefeuille magnétique',Compatibilité:'MagSafe',Matière:'Cuir',Capacité:'4 cartes'}},
  {id:'ac56',brand:'Apple',model:'Pencil Pro',year:2024,category:'Accessories',price:{official:149},specs:{Type:'Stylet',Compatibilité:'iPad Pro M4 / Air M3',Fonctions:'Pression + rotation',Recharge:'Magnétique'}},
  {id:'ac57',brand:'Apple',model:'Pencil USB-C',year:2023,category:'Accessories',price:{official:95},specs:{Type:'Stylet',Compatibilité:'iPad USB-C',Fonctions:'Pression',Recharge:'USB-C'}},
  {id:'ac58',images:['./img/ac58.jpg'],brand:'Apple',model:'Magic Keyboard 2',year:2021,category:'Accessories',price:{official:119},specs:{Type:'Clavier sans fil',Connexion:'Bluetooth + Lightning',Autonomie:'1 mois',Layout:'AZERTY'}},
  {id:'ac59',brand:'Apple',model:'Magic Keyboard Touch ID',year:2021,category:'Accessories',price:{official:199},specs:{Type:'Clavier sans fil',Sécurité:'Touch ID',Connexion:'Bluetooth + Lightning',Layout:'AZERTY'}},
  {id:'ac60',images:['./img/ac60.jpg'],brand:'Logitech',model:'MX Keys S',year:2023,category:'Accessories',price:{official:119},specs:{Type:'Clavier sans fil',Rétroéclairage:'Intelligent',Connexion:'Bolt + BT + USB',Autonomie:'5 mois'}},
  {id:'ac61',brand:'Logitech',model:'K380 Multi-Device',year:2021,category:'Accessories',price:{official:39},specs:{Type:'Clavier compact',Connexion:'3x Bluetooth',Autonomie:'2 ans',Layout:'AZERTY'}},
  {id:'ac62',brand:'Keychron',model:'K2 V2',year:2022,category:'Accessories',price:{official:99},specs:{Type:'Clavier mécanique 75%',Switches:'Hot-swap',Connexion:'BT + USB-C',Rétroéclairage:'RGB'}},
  {id:'ac63',brand:'Keychron',model:'K8 Pro',year:2022,category:'Accessories',price:{official:119},specs:{Type:'Clavier mécanique TKL',Switches:'Hot-swap',Connexion:'BT + USB-C',Firmware:'QMK/VIA'}},
  {id:'ac64',brand:'Nuphy',model:'Air75 V2',year:2023,category:'Accessories',price:{official:129},specs:{Type:'Clavier mécanique fin',Switches:'Low-profile',Connexion:'BT + 2.4G + USB',Autonomie:'3000 mAh'}},
  {id:'ac65',brand:'Royal Kludge',model:'RK61',year:2021,category:'Accessories',price:{official:59},specs:{Type:'Clavier mécanique 60%',Switches:'Hot-swap',Connexion:'BT + USB-C',Rétroéclairage:'RGB'}},
  {id:'ac66',images:['./img/ac66.jpg'],brand:'Apple',model:'Magic Mouse',year:2021,category:'Accessories',price:{official:85},specs:{Type:'Souris sans fil',Surface:'Multi-Touch',Connexion:'Bluetooth + Lightning',Autonomie:'1 mois'}},
  {id:'ac67',images:['./img/ac67.jpg'],brand:'Logitech',model:'MX Master 3S',year:2022,category:'Accessories',price:{official:119},specs:{Type:'Souris bureautique',Capteur:'8000 DPI',Connexion:'Bolt + BT + USB',Boutons:'7'}},
  {id:'ac68',brand:'Logitech',model:'MX Anywhere 3S',year:2023,category:'Accessories',price:{official:89},specs:{Type:'Souris compacte',Capteur:'8000 DPI verre',Connexion:'Bolt + BT + USB',Autonomie:'70 jours'}},
  {id:'ac69',brand:'Apple',model:'Magic Trackpad',year:2021,category:'Accessories',price:{official:149},specs:{Type:'Pavé tactile',Surface:'Verre Multi-Touch',Connexion:'Bluetooth + Lightning',Autonomie:'1 mois'}},
  {id:'ac70',brand:'Razer',model:'Viper V3 Pro',year:2024,category:'Accessories',price:{official:179},specs:{Type:'Souris gaming',Capteur:'35000 DPI',Polling:'8000 Hz',Poids:'54 g'}},
  {id:'ac71',images:['./img/ac71.jpg'],brand:'Logitech',model:'G Pro X Superlight 2',year:2023,category:'Accessories',price:{official:159},specs:{Type:'Souris gaming',Capteur:'32000 DPI',Polling:'2000 Hz',Poids:'60 g'}},
  {id:'ac72',brand:'Dell',model:'Premier MS7421W',year:2022,category:'Accessories',price:{official:99},specs:{Type:'Souris rechargeable',Capteur:'4000 DPI',Connexion:'BT + 2.4G + USB-C',Autonomie:'6 mois'}},
  {id:'ac73',brand:'Lenovo',model:'Go Wireless',year:2022,category:'Accessories',price:{official:69},specs:{Type:'Souris sans fil',Capteur:'2400 DPI',Connexion:'BT + 2.4G',Recharge:'USB-C'}},
  {id:'ac74',brand:'Apple',model:'USB-C Digital AV Multiport',year:2021,category:'Accessories',price:{official:79},specs:{Type:'Hub USB-C',Ports:'HDMI + USB-A + USB-C',Vidéo:'4K 60Hz',Charge:'Pass-through'}},
  {id:'ac75',brand:'Satechi',model:'Hub USB-C 6-en-1',year:2023,category:'Accessories',price:{official:69},specs:{Type:'Hub USB-C',Ports:'HDMI + 2x USB-A + USB-C + SD',Vidéo:'4K 60Hz',Débit:'5 Gb/s'}},
  {id:'ac76',brand:'Anker',model:'555 Hub 8-en-1',year:2022,category:'Accessories',price:{official:99},specs:{Type:'Hub USB-C',Ports:'HDMI + Ethernet + 3x USB + SD',Vidéo:'4K 60Hz',Puissance:'85W'}},
  {id:'ac77',brand:'CalDigit',model:'TS4 Thunderbolt 4',year:2022,category:'Accessories',price:{official:499},specs:{Type:'Station Thunderbolt 4',Ports:'18 ports',Vidéo:'8K / double 6K',Puissance:'98W'}},
  {id:'ac78',brand:'Dell',model:'WD22TB4',year:2022,category:'Accessories',price:{official:349},specs:{Type:'Station Thunderbolt 4',Ports:'12 ports',Vidéo:'Double 4K',Puissance:'130W'}},
  {id:'ac79',brand:'Lenovo',model:'ThinkPad Universal USB-C Dock',year:2022,category:'Accessories',price:{official:299},specs:{Type:'Station USB-C',Ports:'11 ports',Vidéo:'Double 4K',Puissance:'90W'}},
  {id:'ac80',brand:'Ugreen',model:'Revodok 9-en-1',year:2023,category:'Accessories',price:{official:129},specs:{Type:'Station USB-C',Ports:'HDMI + DP + Ethernet + 4x USB',Vidéo:'8K',Puissance:'100W'}},
  {id:'ac81',brand:'Baseus',model:'Station 17-en-1',year:2023,category:'Accessories',price:{official:199},specs:{Type:'Station USB-C',Ports:'17 ports',Vidéo:'Triple 4K',Puissance:'100W'}},
  {id:'ac82',brand:'Hyper',model:'HyperDrive Duo 7-en-2',year:2021,category:'Accessories',price:{official:119},specs:{Type:'Hub MacBook',Ports:'HDMI + 2x USB-C + SD + USB-A',Vidéo:'4K 60Hz',Fixation:'Magnétique'}},
  {id:'ac83',brand:'StarTech',model:'TB3DK2DPPU Thunderbolt 3',year:2021,category:'Accessories',price:{official:329},specs:{Type:'Station Thunderbolt 3',Ports:'11 ports',Vidéo:'Double 4K DisplayPort',Puissance:'85W'}},
  {id:'ac84',images:['./img/ac84.jpg'],brand:'Samsung',model:'T7 Shield 1To',year:2022,category:'Accessories',price:{official:129},specs:{Type:'SSD externe',Capacité:'1 To',Débit:'1050 Mo/s',Protection:'IP65 antichoc'}},
  {id:'ac85',brand:'Samsung',model:'T9 1To',year:2023,category:'Accessories',price:{official:159},specs:{Type:'SSD externe',Capacité:'1 To',Débit:'2000 Mo/s',Interface:'USB 3.2 Gen 2x2'}},
  {id:'ac86',brand:'SanDisk',model:'Extreme Pro 1To',year:2023,category:'Accessories',price:{official:179},specs:{Type:'SSD externe',Capacité:'1 To',Débit:'2000 Mo/s',Protection:'IP65'}},
  {id:'ac87',brand:'Crucial',model:'X9 Pro 1To',year:2023,category:'Accessories',price:{official:119},specs:{Type:'SSD externe',Capacité:'1 To',Débit:'1050 Mo/s',Interface:'USB-C'}},
  {id:'ac88',brand:'WD',model:'My Passport 2To',year:2022,category:'Accessories',price:{official:89},specs:{Type:'Disque dur externe',Capacité:'2 To',Interface:'USB 3.2',Chiffrement:'AES 256'}},
  {id:'ac89',brand:'Seagate',model:'One Touch 2To',year:2022,category:'Accessories',price:{official:99},specs:{Type:'Disque dur externe',Capacité:'2 To',Interface:'USB 3.2',Services:'Rescue 3 ans'}},
  {id:'ac90',brand:'Angelbird',model:'SSD2GO PKT 1To',year:2023,category:'Accessories',price:{official:249},specs:{Type:'SSD externe pro',Capacité:'1 To',Débit:'1640 Mo/s',Usage:'Vidéo 8K'}},
  {id:'ac91',brand:'Belkin',model:'MagSafe 3-en-1 BoostCharge Pro',year:2022,category:'Accessories',price:{official:149},specs:{Type:'Station MagSafe',Charge:'iPhone 15W + Watch + AirPods',Puissance:'40W',Design:'Aluminium'}},
  {id:'ac92',brand:'Anker',model:'637 Magnetic Charging Station',year:2022,category:'Accessories',price:{official:99},specs:{Type:'Station magnétique 8-en-1',Charge:'MagSafe 7.5W',Ports:'3x USB + HDMI + Ethernet',Puissance:'65W'}},
  {id:'ac93',brand:'Twelve South',model:'HiRise 3 Deluxe',year:2022,category:'Accessories',price:{official:99},specs:{Type:'Station MagSafe 3-en-1',Charge:'iPhone + Watch + AirPods',Matière:'Cuir + métal',Angle:'Réglable'}},
  {id:'ac94',brand:'Apple',model:'Chargeur MagSafe',year:2021,category:'Accessories',price:{official:45},specs:{Type:'Galet magnétique',Puissance:'15W MagSafe',Câble:'USB-C 1m',Compatibilité:'iPhone 12+'}},
  {id:'ac95',brand:'Apple',model:'MagSafe Duo',year:2020,category:'Accessories',price:{official:149},specs:{Type:'Chargeur double pliable',Charge:'iPhone 14W + Watch',Câble:'Lightning',Voyage:'Pliable'}},
  {id:'ac96',brand:'ESR',model:'HaloLock Shift Stand',year:2023,category:'Accessories',price:{official:35},specs:{Type:'Support magnétique',Compatibilité:'MagSafe',Angle:'Réglable 360°',Usage:'Bureau + voyage'}},
  {id:'ac97',brand:'Ugreen',model:'Support MagSafe pliable',year:2023,category:'Accessories',price:{official:25},specs:{Type:'Support magnétique',Compatibilité:'MagSafe',Angle:'Réglable',Matière:'Aluminium'}},
  {id:'ac98',brand:'Belkin',model:'BoostCharge Pro 2-en-1',year:2023,category:'Accessories',price:{official:129},specs:{Type:'Station MagSafe',Charge:'iPhone 15W + AirPods',Puissance:'30W',Design:'Compact'}},
  {id:'ac99',brand:'Lamicall',model:'Support téléphone bureau',year:2022,category:'Accessories',price:{official:15},specs:{Type:'Support universel',Compatibilité:'4.7-7"',Angle:'Réglable',Matière:'Aluminium'}},
  {id:'ac100',brand:'Satechi',model:'Support Aluminium réglable',year:2023,category:'Accessories',price:{official:45},specs:{Type:'Support universel',Compatibilité:'Tablettes + téléphones',Angle:'Réglable',Matière:'Aluminium'}},

  // --- VR AR gadgets (10) ---
  {id:'vr1',images:['./img/vr1.jpg'],brand:'Apple',model:'Vision Pro',year:2024,category:'VR AR gadgets',price:{official:3999},specs:{Écran:'Micro-OLED 23M pixels/œil',Processeur:'M2 + R1',RAM:'16 Go',Stockage:'256 Go',Tracking:'Yeux/mains/voix',Autonomie:'2-2.5 h'}},  
  {id:'vr2',images:['./img/vr2.jpg'],brand:'Meta',model:'Quest 3',year:2023,category:'VR AR gadgets',price:{official:549},specs:{Écran:'LCD 2064x2208/œil 120Hz',Processeur:'Snapdragon XR2 Gen 2',RAM:'8 Go',Stockage:'128 Go',Tracking:'Inside-out + mains',Autonomie:'2-3 h'}},  
  {id:'vr3',brand:'Meta',model:'Quest Pro',year:2022,category:'VR AR gadgets',price:{official:1099},specs:{Écran:'Mini LED 1800x1920/œil 90Hz',Processeur:'Snapdragon XR2+',RAM:'12 Go',Stockage:'256 Go',Tracking:'Yeux/visage/mains',Autonomie:'1-2 h'}},  
  {id:'vr4',brand:'HTC',model:'Vive XR Elite',year:2023,category:'VR AR gadgets',price:{official:1099},specs:{Écran:'LCD 1920x1920/œil 90Hz',Processeur:'Snapdragon XR2',RAM:'12 Go',Stockage:'128 Go',Tracking:'Inside-out + mains',Autonomie:'2 h'}},  
  {id:'vr5',images:['./img/vr5.jpg'],brand:'PICO',model:'PICO 4 Ultra',year:2024,category:'VR AR gadgets',price:{official:599},specs:{Écran:'LCD 2160x2160/œil 90Hz',Processeur:'Snapdragon XR2 Gen 2',RAM:'8 Go',Stockage:'256 Go',Tracking:'Inside-out + mains',Autonomie:'2-3 h'}},  
  {id:'vr6',brand:'XREAL',model:'Air 2 Ultra',year:2024,category:'VR AR gadgets',price:{official:699},specs:{Écran:'Micro-OLED 1080p/œil 120Hz',Processeur:'Snapdragon XR2',RAM:'6 Go',Stockage:'128 Go',Tracking:'6DoF + mains',Autonomie:'3 h (ext.)'}},  
  {id:'vr7',brand:'Rokid',model:'Max Pro',year:2024,category:'VR AR gadgets',price:{official:599},specs:{Écran:'Micro-OLED 1080p/œil 120Hz',Processeur:'Intégré',RAM:'4 Go',Stockage:'32 Go',Tracking:'3DoF',Autonomie:'2 h (ext.)'}},  
  {id:'vr8',brand:'Viture',model:'Pro XR',year:2024,category:'VR AR gadgets',price:{official:499},specs:{Écran:'Micro-OLED 1080p/œil 120Hz',Processeur:'Aucun (téléphone)',RAM:'-',Stockage:'-',Tracking:'3DoF',Autonomie:'N/A'}},  
  {id:'vr9',brand:'RayNeo',model:'X2',year:2024,category:'VR AR gadgets',price:{official:799},specs:{Écran:'Micro-LED 1080p/œil',Processeur:'Snapdragon XR2',RAM:'6 Go',Stockage:'32 Go',Tracking:'6DoF + SLAM',Autonomie:'2 h'}},  
  {id:'vr10',brand:'DPVR',model:'P2',year:2024,category:'VR AR gadgets',price:{official:399},specs:{Écran:'LCD 2160x2160/œil 90Hz',Processeur:'XR2 Gen 1',RAM:'8 Go',Stockage:'128 Go',Tracking:'Inside-out',Autonomie:'2.5 h'}},  

  // --- Consoles & Videogames — Rétro (8) ---
  {id:'co1',brand:'Nintendo',model:'NES',year:1985,category:'Consoles & Videogames',era:'retro',price:{official:179},specs:{CPU:'Ricoh 2A03 8-bit',Mémoire:'2 Ko RAM',Affichage:'256x240, 64 couleurs',Support:'Cartouches',Manettes:'2 ports'}},
  {id:'co2',images:['./img/co2.jpg'],brand:'Nintendo',model:'Super Nintendo',year:1992,category:'Consoles & Videogames',era:'retro',price:{official:199},specs:{CPU:'Ricoh 5A22 16-bit',Mémoire:'128 Ko RAM',Affichage:'512x448, Mode 7',Support:'Cartouches',Audio:'Sony SPC700 8 canaux'}},
  {id:'co3',images:['./img/co3.jpg'],brand:'Sega',model:'Mega Drive',year:1990,category:'Consoles & Videogames',era:'retro',price:{official:189},specs:{CPU:'Motorola 68000 16-bit',Mémoire:'64 Ko RAM',Affichage:'320x224, 512 couleurs',Support:'Cartouches',Audio:'Yamaha YM2612'}},
  {id:'co4',images:['./img/co4.jpg'],brand:'Nintendo',model:'Game Boy',year:1990,category:'Consoles & Videogames',era:'retro',price:{official:89},specs:{CPU:'Sharp LR35902 8-bit',Écran:'2.6" NB 160x144',Autonomie:'30 h (4 piles AA)',Support:'Cartouches',Liaison:'Câble Link'}},
  {id:'co5',images:['./img/co5.png'],brand:'Sony',model:'PlayStation',year:1995,category:'Consoles & Videogames',era:'retro',price:{official:299},specs:{CPU:'MIPS R3000 32-bit',Mémoire:'2 Mo RAM',Affichage:'640x480 3D',Support:'CD-ROM',Manettes:'2 ports + cartes mémoire'}},
  {id:'co6',images:['./img/co6.jpg'],brand:'Nintendo',model:'Nintendo 64',year:1997,category:'Consoles & Videogames',era:'retro',price:{official:249},specs:{CPU:'MIPS R4300i 64-bit',Mémoire:'4 Mo RDRAM',Affichage:'640x480 anti-aliasing',Support:'Cartouches',Manettes:'4 ports'}},
  {id:'co7',images:['./img/co7.png'],brand:'Sega',model:'Dreamcast',year:1999,category:'Consoles & Videogames',era:'retro',price:{official:299},specs:{CPU:'Hitachi SH-4 128-bit',Mémoire:'16 Mo RAM',Affichage:'640x480 VGA',Support:'GD-ROM',Réseau:'Modem 56k + VMU'}},
  {id:'co8',images:['./img/co8.jpg'],brand:'Nintendo',model:'GameCube',year:2002,category:'Consoles & Videogames',era:'retro',price:{official:249},specs:{CPU:'IBM Gekko 485 MHz',Mémoire:'24 Mo RAM',Affichage:'480p',Support:'mini-DVD 1.5 Go',Manettes:'4 ports'}},
  // --- Composant electronic & informatic (10) ---
  // --- Consoles & Videogames — Modernes (8, dont Linux/SteamOS) ---
  {id:'co9',images:['./img/co9.png'],brand:'Nintendo',model:'Switch OLED',year:2021,category:'Consoles & Videogames',era:'modern',price:{official:349},specs:{Écran:'7" OLED 720p',Stockage:'64 Go',Autonomie:'4.5-9 h',Mode:'Salon + portable + table',Réseau:'WiFi + LAN (dock)'}},
  {id:'co10',images:['./img/co10.jpg'],brand:'Nintendo',model:'Switch 2',year:2025,category:'Consoles & Videogames',era:'modern',price:{official:469},specs:{Écran:'7.9" LCD 1080p 120Hz',Stockage:'256 Go',Rétrocompatibilité:'Switch (physique + démat)',Manettes:'Joy-Con 2 magnétiques',Réseau:'WiFi 6'}},
  {id:'co11',images:['./img/co11.png'],brand:'Sony',model:'PS5 Slim',year:2023,category:'Consoles & Videogames',era:'modern',price:{official:549},specs:{CPU:'Zen 2 8 cœurs',GPU:'RDNA 2, 10.3 TFLOPS',Stockage:'1 To SSD',Affichage:'4K 120Hz',Lecteur:'Blu-ray 4K amovible'}},
  {id:'co12',brand:'Sony',model:'PS5 Pro',year:2024,category:'Consoles & Videogames',era:'modern',price:{official:799},specs:{CPU:'Zen 2 8 cœurs',GPU:'RDNA 3, 16.7 TFLOPS + PSSR',Stockage:'2 To SSD',Affichage:'4K 120Hz + 8K',WiFi:'WiFi 7'}},
  {id:'co13',images:['./img/co13.jpg'],brand:'Microsoft',model:'Xbox Series X',year:2020,category:'Consoles & Videogames',era:'modern',price:{official:549},specs:{CPU:'Zen 2 8 cœurs',GPU:'RDNA 2, 12 TFLOPS',Stockage:'1 To SSD',Affichage:'4K 120Hz + 8K',Service:'Game Pass'}},
  {id:'co14',brand:'Microsoft',model:'Xbox Series S',year:2020,category:'Consoles & Videogames',era:'modern',price:{official:299},specs:{CPU:'Zen 2 8 cœurs',GPU:'RDNA 2, 4 TFLOPS',Stockage:'512 Go SSD',Affichage:'1440p 120Hz',Support:'100% dématérialisé'}},
  {id:'co15',images:['./img/co15.png'],brand:'Valve',model:'Steam Deck OLED 512Go',year:2023,category:'Consoles & Videogames',era:'modern',price:{official:569},specs:{OS:'SteamOS (Linux)',Écran:'7.4" OLED 90Hz',CPU:'Zen 2 4c/8t + RDNA 2',Stockage:'512 Go NVMe',Autonomie:'3-12 h'}},
  {id:'co16',images:['./img/co16.png'],brand:'ASUS',model:'ROG Ally',year:2023,category:'Consoles & Videogames',era:'modern',price:{official:699},specs:{OS:'Windows 11',Écran:'7" 1080p 120Hz',CPU:'Ryzen Z1 Extreme',Stockage:'512 Go NVMe',Batterie:'40 Wh'}},
  {id:'ce1',brand:'ASUS',model:'ROG Maximus Z790 Hero',year:2023,category:'Composant electronic & informatic',price:{official:799},specs:{Socket:'LGA1700',Chipset:'Z790',RAM:'DDR5 192 Go max',PCIe:'5.0 x16',Réseau:'10GbE + WiFi 7',Audio:'ESS ES9218'}},  
  {id:'ce2',brand:'MSI',model:'MPG Z790 Carbon WiFi',year:2023,category:'Composant electronic & informatic',price:{official:499},specs:{Socket:'LGA1700',Chipset:'Z790',RAM:'DDR5 128 Go max',PCIe:'5.0 x16',Réseau:'2.5GbE + WiFi 6E',Audio:'ALC4080'}},  
  {id:'ce3',brand:'Gigabyte',model:'X670E AORUS Master',year:2022,category:'Composant electronic & informatic',price:{official:599},specs:{Socket:'AM5',Chipset:'X670E',RAM:'DDR5 128 Go max',PCIe:'5.0 x16 + 5.0 x4',Réseau:'10GbE + WiFi 6E',Audio:'ALC4080'}},  
  {id:'ce4',brand:'ASRock',model:'X670E Taichi',year:2022,category:'Composant electronic & informatic',price:{official:549},specs:{Socket:'AM5',Chipset:'X670E',RAM:'DDR5 128 Go max',PCIe:'5.0 x16 + 5.0 x4',Réseau:'10GbE + WiFi 6E',Audio:'ALC4082'}},  
  {id:'ce5',brand:'Corsair',model:'HX1500i',year:2023,category:'Composant electronic & informatic',price:{official:449},specs:{Puissance:'1500W',Certif:'80+ Platinum',Modulaire:'Full',Ventilateur:'140mm ML',Garantie:'10 ans',Connectique:'ATX 3.0'}},  
  {id:'ce6',brand:'Seasonic',model:'Prime TX-1000',year:2022,category:'Composant electronic & informatic',price:{official:399},specs:{Puissance:'1000W',Certif:'80+ Titanium',Modulaire:'Full',Ventilateur:'135mm FDB',Garantie:'12 ans',Connectique:'ATX 3.0'}},  
  {id:'ce7',images:['./img/ce7.jpg'],brand:'Samsung',model:'990 Pro 2To',year:2023,category:'Composant electronic & informatic',price:{official:179},specs:{Interface:'PCIe 4.0 x4',Lecture:'7450 Mo/s',Écriture:'6900 Mo/s',Format:'M.2 2280',Contrôleur:'Pascal',Cache:'2 Go LPDDR4'}},  
  {id:'ce8',brand:'WD',model:'Black SN850X 2To',year:2023,category:'Composant electronic & informatic',price:{official:159},specs:{Interface:'PCIe 4.0 x4',Lecture:'7300 Mo/s',Écriture:'6600 Mo/s',Format:'M.2 2280',Contrôleur:'Proprio',Cache:'2 Go DDR4'}},  
  {id:'ce9',brand:'G.Skill',model:'Trident Z5 RGB 64Go (2x32) 6400',year:2023,category:'Composant electronic & informatic',price:{official:299},specs:{Type:'DDR5',Fréquence:'6400 MHz',Latence:'CL32',Capacité:'64 Go (2x32)',Voltage:'1.4V',RGB:'Oui'}},  
  {id:'ce10',brand:'Corsair',model:'Dominator Titanium 64Go (2x32) 7200',year:2024,category:'Composant electronic & informatic',price:{official:399},specs:{Type:'DDR5',Fréquence:'7200 MHz',Latence:'CL34',Capacité:'64 Go (2x32)',Voltage:'1.45V',RGB:'Oui (Capellix)'}},  

  // --- Company & studying Robots (10) ---
  {id:'rb1',images:['./img/rb1.jpg'],brand:'Unitree',model:'Go2',year:2024,category:'Company & studying Robots',price:{official:2499},specs:{Type:'Quadrupède',Poids:'15 kg',Autonomie:'2-4 h',Vitesse:'5 m/s',Capteurs:'LiDAR 360° + caméras',API:'ROS 2 + SDK Python/C++'}},  
  {id:'rb2',images:['./img/rb2.jpg'],brand:'Boston Dynamics',model:'Spot',year:2020,category:'Company & studying Robots',price:{official:74500},specs:{Type:'Quadrupède',Poids:'32 kg',Autonomie:'1.5 h',Vitesse:'1.6 m/s',Capteurs:'5 caméras stéréo + LiDAR',API:'SDK Python + ROS'}},  
  {id:'rb3',brand:'Agility Robotics',model:'Digit',year:2023,category:'Company & studying Robots',price:{official:150000},specs:{Type:'Bipède',Poids:'65 kg',Autonomie:'3 h',Charge:'16 kg',Capteurs:'LiDAR + caméras depth',API:'ROS 2'}},  
  {id:'rb4',images:['./img/rb4.jpg'],brand:'Tesla',model:'Optimus Gen 2',year:2024,category:'Company & studying Robots',price:{official:25000},specs:{Type:'Humanoïde',Poids:'73 kg',Autonomie:'8 h',Charge:'20 kg',Capteurs:'Caméras + FSD',API:'Propriétaire'}},  
  {id:'rb5',brand:'Figure',model:'Figure 01',year:2024,category:'Company & studying Robots',price:{official:30000},specs:{Type:'Humanoïde',Poids:'60 kg',Autonomie:'5 h',Charge:'20 kg',Capteurs:'6 caméras RGB + depth',API:'ROS 2 + OpenAI'}},  
  {id:'rb6',brand:'1X Technologies',model:'EVE',year:2023,category:'Company & studying Robots',price:{official:35000},specs:{Type:'Humanoïde (roues)',Poids:'86 kg',Autonomie:'6 h',Charge:'15 kg',Capteurs:'Caméras 360°',API:'ROS 2'}},  
  {id:'rb7',brand:'Apptronik',model:'Apollo',year:2024,category:'Company & studying Robots',price:{official:50000},specs:{Type:'Humanoïde',Poids:'72 kg',Autonomie:'4 h',Charge:'25 kg',Capteurs:'Force/torque + vision',API:'ROS 2'}},  
  {id:'rb8',images:['./img/rb8.jpg'],brand:'ANYbotics',model:'ANYmal D',year:2023,category:'Company & studying Robots',price:{official:120000},specs:{Type:'Quadrupède',Poids:'50 kg',Autonomie:'2.5 h',Vitesse:'2.5 m/s',Capteurs:'LiDAR + 5 caméras',API:'ROS 2 + SDK'}},  
  {id:'rb9',images:['./img/rb9.jpg'],brand:'Ghost Robotics',model:'Vision 60',year:2022,category:'Company & studying Robots',price:{official:150000},specs:{Type:'Quadrupède militaire',Poids:'51 kg',Autonomie:'3 h',Vitesse:'3 m/s',Capteurs:'LiDAR 360 + thermiques',API:'ROS + SDK'}},  
  {id:'rb10',brand:'Deep Robotics',model:'Jueying X20',year:2023,category:'Company & studying Robots',price:{official:45000},specs:{Type:'Quadrupède',Poids:'38 kg',Autonomie:'2 h',Vitesse:'3 m/s',Capteurs:'LiDAR + caméras',API:'ROS 2 + Python'}},  

  // --- Garden & furnitures smart devices (10) ---
  {id:'gf1',brand:'Husqvarna',model:'Automower 450X',year:2023,category:'Garden & furnitures smart devices',price:{official:3499},specs:{Type:'Robot tondeuse',Surface:'5000 m²',Autonomie:'270 min',Navigation:'GPS + fil guide',App:'Automower Connect',Pente:'45%'}},  
  {id:'gf2',brand:'Segway',model:'Navimow i110N',year:2024,category:'Garden & furnitures smart devices',price:{official:1299},specs:{Type:'Robot tondeuse sans fil',Surface:'1000 m²',Autonomie:'60 min',Navigation:'RTK + vision',App:'Navimow',Pente:'30%'}},  
  {id:'gf3',brand:'Ecovacs',model:'Goat G1',year:2024,category:'Garden & furnitures smart devices',price:{official:1599},specs:{Type:'Robot tondeuse',Surface:'1600 m²',Autonomie:'120 min',Navigation:'RTK + AIVI 3D',App:'Ecovacs Home',Pente:'35%'}},  
  {id:'gf4',brand:'Dreame',model:'A1',year:2024,category:'Garden & furnitures smart devices',price:{official:1999},specs:{Type:'Robot tondeuse',Surface:'2000 m²',Autonomie:'150 min',Navigation:'LiDAR 3D + RTK',App:'Dreamehome',Pente:'40%'}},  
  {id:'gf5',brand:'Mammotion',model:'Luba 2 AWD 5000',year:2024,category:'Garden & furnitures smart devices',price:{official:2799},specs:{Type:'Robot tondeuse 4 roues motrices',Surface:'5000 m²',Autonomie:'240 min',Navigation:'RTK + vision',App:'Mammotion',Pente:'80%'}},  
  {id:'gf6',brand:'Philips Hue',model:'Outdoor Lily XL',year:2023,category:'Garden & furnitures smart devices',price:{official:199},specs:{Type:'Éclairage extérieur',Flux:'1600 lm',Couleur:'16M + blanc',Alimentation:'Secteur',Contrôle:'Hue Bridge + Matter',IP:'IP65'}},  
  {id:'gf7',brand:'Govee',model:'Permanent Outdoor Lights Pro',year:2024,category:'Garden & furnitures smart devices',price:{official:299},specs:{Type:'Guirlande permanente',Longueur:'15 m (60 LED)',Couleur:'RGBIC',Contrôle:'App + Matter + Alexa',IP:'IP67',Installation:'Clips'}},  
  {id:'gf8',brand:'Rachio',model:'Smart Sprinkler 3e gen 16 zones',year:2023,category:'Garden & furnitures smart devices',price:{official:249},specs:{Type:'Arrosage connecté',Zones:'16',Météo:'Weather Intelligence+',Contrôle:'App + Alexa/Google',Homologation:'WaterSense',Install:'DIY'}},  
  {id:'gf9',brand:'Moen',model:'Smart Faucet',year:2023,category:'Garden & furnitures smart devices',price:{official:499},specs:{Type:'Robinet cuisine intelligent',Contrôle:'Voix + app + capteur',Température:'Préréglages',Débit:'1.5 GPM',Alimentation:'Batterie 6V',Finition:'Chrome/Noir'}},  
  {id:'gf10',brand:'IKEA',model:'VALLHORN + DIRIGERA',year:2023,category:'Garden & furnitures smart devices',price:{official:89},specs:{Type:'Capteur mouvement + hub',Détection:'12m / 100°',Autonomie:'2 ans (pile)',Hub:'Dirigera (Matter/Thread)',App:'IKEA Home Smart',Usage:'Int/Ext (IP44)'}},  

  // --- Audio & Wearables (10) ---
  {id:'aw1',brand:'Sony',model:'WH-1000XM5',year:2022,category:'Audio & Wearables',price:{official:399},specs:{Type:'Casque ANC',Transducteur:'30 mm',ANC:'Processeur V1 + QN1',Codec:'LDAC + LC3',Autonomie:'30 h (ANC)',Poids:'250 g'}},  
  {id:'aw2',brand:'Bose',model:'QuietComfort Ultra',year:2023,category:'Audio & Wearables',price:{official:449},specs:{Type:'Casque ANC',Transducteur:'40 mm',ANC:'CustomTune',Codec:'aptX Adaptive',Autonomie:'24 h (ANC)',Poids:'254 g'}},  
  {id:'aw3',images:['./img/aw3.jpg'],brand:'Apple',model:'AirPods Pro 2 (USB-C)',year:2023,category:'Audio & Wearables',price:{official:279},specs:{Type:'TWS ANC',Puce:'H2',ANC:'Adaptatif 2x',Codec:'AAC + LC3',Autonomie:'6 h (ANC) + 24 h étui',Audio:'Spatial + Suivi tête'}},  
  {id:'aw4',brand:'Sennheiser',model:'Momentum 4 Wireless',year:2022,category:'Audio & Wearables',price:{official:349},specs:{Type:'Casque ANC',Transducteur:'42 mm',ANC:'Adaptatif',Codec:'aptX Adaptive + LDAC',Autonomie:'60 h (ANC)',Poids:'293 g'}},  
  {id:'aw5',brand:'Technics',model:'EAH-AZ80',year:2023,category:'Audio & Wearables',price:{official:299},specs:{Type:'TWS ANC',Transducteur:'10 mm',ANC:'Hybride',Codec:'LDAC + LC3',Autonomie:'7 h (ANC) + 17.5 h étui',Multipoint:'3 appareils'}},  
  {id:'aw6',images:['./img/aw6.jpg'],brand:'Samsung',model:'Galaxy Buds 3 Pro',year:2024,category:'Audio & Wearables',price:{official:249},specs:{Type:'TWS ANC',Transducteur:'11 mm + 6.5 mm',ANC:'Adaptatif IA',Codec:'SSC + LDAC',Autonomie:'6 h (ANC) + 18 h étui',Audio:'360° + Suivi tête'}},  
  {id:'aw7',brand:'Xiaomi',model:'Redmi Buds 6 Pro',year:2024,category:'Audio & Wearables',price:{official:99},specs:{Type:'TWS ANC',Transducteur:'11 mm',ANC:'55 dB hybride',Codec:'LDAC',Autonomie:'9 h (ANC) + 27 h étui',Audio:'Spatial'}},  
  {id:'aw8',brand:'Garmin',model:'Fenix 8 Solar',year:2024,category:'Audio & Wearables',price:{official:1099},specs:{Type:'Montre GPS multisport',Écran:'1.4" AMOLED Solar',Autonomie:'29 j (solaire)',GPS:'Multi-bande + SatIQ',Capteurs:'Cardio + SpO2 + ECG',Cartes:'TopoActive Mond'}},  
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
function applyFilters(){filteredProducts=products.filter(p=>{if(searchQuery&&!`${p.brand} ${p.model} ${p.category}`.toLowerCase().includes(searchQuery.toLowerCase()))return false;if(activeCategory!=='all'&&p.category!==activeCategory)return false;if(activeYear!=='all'&&p.year!==parseInt(activeYear))return false;if(activeBrand!=='all'&&p.brand!==activeBrand)return false;if(activeEra!=='all'&&p.era!==activeEra)return false;return true;});if(activeSort==='brand')filteredProducts.sort((a,b)=>`${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`));else if(activeSort==='price-asc')filteredProducts.sort((a,b)=>(a.kifftech?.kifftech??a.price.official)-(b.kifftech?.kifftech??b.price.official));else if(activeSort==='price-desc')filteredProducts.sort((a,b)=>(b.kifftech?.kifftech??b.price.official)-(a.kifftech?.kifftech??a.price.official));renderProducts();}
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