// ============ LOCAL_DB (173 produits illustrés) ============
const LOCAL_DB = [
  {id:'sp1',images:['./img/sp1.jpg','./img/sp1b.jpg'],brand:'Samsung',model:'Galaxy S24 Ultra',year:2024,category:'Smartphones',price:{official:1469},specs:{Écran:'6.8" Dynamic AMOLED 2X 120Hz',Processeur:'Snapdragon 8 Gen 3',RAM:'12 Go',Stockage:'256 Go',Appareil:'200+50+12+10 MP',Batterie:'5000 mAh'},usage:['Photo pro','Vidéo 4K','Télétravail','Gaming','Productivité'],impact:{campaignId:'YOUR_IMPACT_CAMPAIGN_ID',subId:'galaxy-s24-ultra',url:'https://impact.com/go/YOUR_TRACKING_LINK'}},
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
  {id:'cp1',images:['./img/cp1.jpg'],brand:'Apple',model:'MacBook Pro 16 M3 Max',year:2023,category:'Computers',price:{official:3999},specs:{Écran:'16.2" Liquid Retina XDR',Processeur:'M3 Max 16 cœurs',RAM:'48 Go',Stockage:'1 To SSD',GPU:'40 cœurs',Autonomie:'22 h'},usage:['Montage vidéo','Développement','DA','Production audio'],impact:{campaignId:'YOUR_IMPACT_CAMPAIGN_ID',subId:'macbook-pro-m3-max',url:'https://impact.com/go/YOUR_TRACKING_LINK'}},
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
  {id:'vr1',images:['./img/vr1.jpg'],brand:'Apple',model:'Vision Pro',year:2024,category:'VR AR gadgets',price:{official:3999},specs:{Écran:'Micro-OLED 23M pixels/œil',Processeur:'M2 + R1',RAM:'16 Go',Stockage:'256 Go',Tracking:'Yeux/mains/voix',Autonomie:'2-2.5 h'},usage:['Productivité immersive','Divertissement 3D','Télétravail spatial','Design'],impact:{campaignId:'YOUR_IMPACT_CAMPAIGN_ID',subId:'vision-pro',url:'https://impact.com/go/YOUR_TRACKING_LINK'}},
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
  // ============ NOUVEAUX GADGETS POPULAIRES 2020-2026 (100) ============
  {id:'iphone-12',images:['./img/iphone-12.jpg'],brand:'Apple',model:'iPhone 12',year:2020,category:'Smartphones',price:{official:909},specs:{'Écran':'6,1" OLED 60 Hz','Puce':'A14 Bionic','Photo':'12+12 MP','Batterie':'2815 mAh'}},
  {id:'iphone-13-pro',images:['./img/iphone-13-pro.jpg'],brand:'Apple',model:'iPhone 13 Pro',year:2021,category:'Smartphones',price:{official:1159},specs:{'Écran':'6,1" ProMotion 120 Hz','Puce':'A15 Bionic','Photo':'12+12+12 MP','Batterie':'3095 mAh'}},
  {id:'iphone-14-pro',images:['./img/iphone-14-pro.jpg'],brand:'Apple',model:'iPhone 14 Pro',year:2022,category:'Smartphones',price:{official:1329},specs:{'Écran':'6,1" LTPO 120 Hz','Puce':'A16 Bionic','Photo':'48+12+12 MP'}},
  {id:'iphone-16-pro',images:['./img/iphone-16-pro.jpg'],brand:'Apple',model:'iPhone 16 Pro',year:2024,category:'Smartphones',price:{official:1229},specs:{'Écran':'6,3" LTPO 120 Hz','Puce':'A18 Pro','Photo':'48+48+12 MP'}},
  {id:'iphone-17',images:['./img/iphone-17.jpg'],brand:'Apple',model:'iPhone 17',year:2025,category:'Smartphones',price:{official:969},specs:{'Écran':'6,3" ProMotion 120 Hz','Puce':'A19','Photo':'48+48 MP','Batterie':'3600 mAh'}},
  {id:'galaxy-s21',images:['./img/galaxy-s21.jpg'],brand:'Samsung',model:'Galaxy S21',year:2021,category:'Smartphones',price:{official:859},specs:{'Écran':'6,2" AMOLED 120 Hz','Puce':'Snapdragon 888','Photo':'64+12+12 MP','Batterie':'4000 mAh'}},
  {id:'galaxy-s22-ultra',images:['./img/galaxy-s22-ultra.jpg'],brand:'Samsung',model:'Galaxy S22 Ultra',year:2022,category:'Smartphones',price:{official:1259},specs:{'Écran':'6,8" AMOLED 120 Hz','Puce':'Snapdragon 8 Gen 1','Photo':'108+12+10+10 MP'}},
  {id:'galaxy-s23-ultra',images:['./img/galaxy-s23-ultra.jpg'],brand:'Samsung',model:'Galaxy S23 Ultra',year:2023,category:'Smartphones',price:{official:1369},specs:{'Écran':'6,8" AMOLED 120 Hz','Puce':'Snapdragon 8 Gen 2','Photo':'200 MP'}},
  {id:'galaxy-s25-ultra',images:['./img/galaxy-s25-ultra.jpg'],brand:'Samsung',model:'Galaxy S25 Ultra',year:2025,category:'Smartphones',price:{official:1469},specs:{'Écran':'6,9" AMOLED 120 Hz','Puce':'Snapdragon 8 Elite','Photo':'200+50+50+10 MP'}},
  {id:'galaxy-z-fold-5',images:['./img/galaxy-z-fold-5.jpg'],brand:'Samsung',model:'Galaxy Z Fold 5',year:2023,category:'Smartphones',price:{official:1899},specs:{'Écran':'7,6" pliable 120 Hz','Puce':'Snapdragon 8 Gen 2','Photo':'50+12+10 MP','Batterie':'4400 mAh'}},
  {id:'galaxy-z-flip-5',images:['./img/galaxy-z-flip-5.jpg'],brand:'Samsung',model:'Galaxy Z Flip 5',year:2023,category:'Smartphones',price:{official:1199},specs:{'Écran':'6,7" pliable 120 Hz','Puce':'Snapdragon 8 Gen 2','Photo':'12+12 MP'}},
  {id:'pixel-6',images:['./img/pixel-6.jpg'],brand:'Google',model:'Pixel 6',year:2021,category:'Smartphones',price:{official:649},specs:{'Écran':'6,4" OLED 90 Hz','Puce':'Google Tensor','Photo':'50+12 MP','Batterie':'4614 mAh'}},
  {id:'oneplus-9-pro',images:['./img/oneplus-9-pro.jpg'],brand:'OnePlus',model:'9 Pro',year:2021,category:'Smartphones',price:{official:899},specs:{'Écran':'6,7" LTPO 120 Hz','Puce':'Snapdragon 888','Photo':'48+50+8+2 MP'}},
  {id:'oneplus-13',images:['./img/oneplus-13.jpg'],brand:'OnePlus',model:'13',year:2025,category:'Smartphones',price:{official:949},specs:{'Écran':'6,82" LTPO 120 Hz','Puce':'Snapdragon 8 Elite','Photo':'50+50+50 MP','Batterie':'6000 mAh'}},
  {id:'xperia-1-v',images:['./img/xperia-1-v.jpg'],brand:'Sony',model:'Xperia 1 V',year:2023,category:'Smartphones',price:{official:1399},specs:{'Écran':'6,5" 4K OLED 120 Hz','Puce':'Snapdragon 8 Gen 2','Photo':'52+12+12 MP'}},
  {id:'razr-40-ultra',images:['./img/razr-40-ultra.jpg'],brand:'Motorola',model:'Razr 40 Ultra',year:2023,category:'Smartphones',price:{official:1199},specs:{'Écran':'6,9" pliable 165 Hz','Puce':'Snapdragon 8+ Gen 1','Photo':'12+13 MP'}},
  {id:'huawei-p60-pro',images:['./img/huawei-p60-pro.jpg'],brand:'Huawei',model:'P60 Pro',year:2023,category:'Smartphones',price:{official:1199},specs:{'Écran':'6,67" LTPO 120 Hz','Puce':'Snapdragon 8+ Gen 1','Photo':'48+13+48 MP'}},
  {id:'macbook-air-m1',images:['./img/macbook-air-m1.jpg'],brand:'Apple',model:'MacBook Air M1',year:2020,category:'Computers',price:{official:1129},specs:{'Écran':'13,3" Retina','Puce':'Apple M1','RAM':'8 Go','Autonomie':'18 h'}},
  {id:'macbook-air-m2',images:['./img/macbook-air-m2.jpg'],brand:'Apple',model:'MacBook Air M2',year:2022,category:'Computers',price:{official:1499},specs:{'Écran':'13,6" Liquid Retina','Puce':'Apple M2','RAM':'8 Go'}},
  {id:'macbook-air-15-m4',images:['./img/macbook-air-15-m4.jpg'],brand:'Apple',model:'MacBook Air 15 M4',year:2025,category:'Computers',price:{official:1499},specs:{'Écran':'15,3" Liquid Retina','Puce':'Apple M4','RAM':'16 Go'}},
  {id:'macbook-pro-14-m3',images:['./img/macbook-pro-14-m3.jpg'],brand:'Apple',model:'MacBook Pro 14 M3',year:2023,category:'Computers',price:{official:1999},specs:{'Écran':'14,2" Liquid Retina XDR','Puce':'Apple M3','RAM':'8 Go'}},
  {id:'surface-laptop-7',images:['./img/surface-laptop-7.jpg'],brand:'Microsoft',model:'Surface Laptop 7',year:2024,category:'Computers',price:{official:1199},specs:{'Écran':'13,8" 120 Hz','Puce':'Snapdragon X Elite','RAM':'16 Go','Autonomie':'22 h'}},
  {id:'matebook-x-pro',images:['./img/matebook-x-pro.jpg'],brand:'Huawei',model:'MateBook X Pro',year:2023,category:'Computers',price:{official:1499},specs:{'Écran':'14,2" 3.1K 90 Hz','Puce':'Core i7-1360P','RAM':'16 Go','Poids':'1,26 kg'}},
  {id:'ipad-10',images:['./img/ipad-10.jpg'],brand:'Apple',model:'iPad 10',year:2022,category:'Tablets',price:{official:589},specs:{'Écran':'10,9" Liquid Retina','Puce':'A14 Bionic','Stockage':'64 Go'}},
  {id:'ipad-air-13-m2',images:['./img/ipad-air-13-m2.jpg'],brand:'Apple',model:'iPad Air 13 M2',year:2024,category:'Tablets',price:{official:949},specs:{'Écran':'13" Liquid Retina','Puce':'Apple M2','Stockage':'128 Go'}},
  {id:'ipad-pro-11-m4',images:['./img/ipad-pro-11-m4.jpg'],brand:'Apple',model:'iPad Pro 11 M4',year:2024,category:'Tablets',price:{official:1199},specs:{'Écran':'11" Ultra Retina XDR','Puce':'Apple M4','Stockage':'256 Go'}},
  {id:'ipad-mini-6',images:['./img/ipad-mini-6.jpg'],brand:'Apple',model:'iPad mini 6',year:2021,category:'Tablets',price:{official:649},specs:{'Écran':'8,3" Liquid Retina','Puce':'A15 Bionic','Stockage':'64 Go'}},
  {id:'galaxy-tab-s8',images:['./img/galaxy-tab-s8.jpg'],brand:'Samsung',model:'Galaxy Tab S8',year:2022,category:'Tablets',price:{official:749},specs:{'Écran':'11" LTPS 120 Hz','Puce':'Snapdragon 8 Gen 1','RAM':'8 Go'}},
  {id:'surface-pro-9',images:['./img/surface-pro-9.jpg'],brand:'Microsoft',model:'Surface Pro 9',year:2022,category:'Tablets',price:{official:1099},specs:{'Écran':'13" PixelSense 120 Hz','Puce':'Core i5-1235U','RAM':'8 Go'}},
  {id:'xiaomi-pad-6',images:['./img/xiaomi-pad-6.jpg'],brand:'Xiaomi',model:'Pad 6',year:2023,category:'Tablets',price:{official:399},specs:{'Écran':'11" 144 Hz','Puce':'Snapdragon 870','RAM':'8 Go','Batterie':'8840 mAh'}},
  {id:'airpods-3',images:['./img/airpods-3.jpg'],brand:'Apple',model:'AirPods 3',year:2021,category:'Audio & Wearables',price:{official:199},specs:{'Autonomie':'6 h','Charge':'MagSafe','Résistance':'IPX4'}},
  {id:'airpods-max',images:['./img/airpods-max.jpg'],brand:'Apple',model:'AirPods Max',year:2020,category:'Audio & Wearables',price:{official:629},specs:{'Autonomie':'20 h'}},
  {id:'galaxy-buds-2-pro',images:['./img/galaxy-buds-2-pro.jpg'],brand:'Samsung',model:'Galaxy Buds 2 Pro',year:2022,category:'Audio & Wearables',price:{official:229},specs:{'Autonomie':'5 h'}},
  {id:'nothing-ear-2',images:['./img/nothing-ear-2.jpg'],brand:'Nothing',model:'Ear (2)',year:2023,category:'Audio & Wearables',price:{official:149},specs:{'Autonomie':'6,3 h'}},
  {id:'watch-series-8',images:['./img/watch-series-8.jpg'],brand:'Apple',model:'Watch Series 8',year:2022,category:'Audio & Wearables',price:{official:499},specs:{'Écran':'1,9" OLED','Puce':'S8'}},
  {id:'watch-series-9',images:['./img/watch-series-9.jpg'],brand:'Apple',model:'Watch Series 9',year:2023,category:'Audio & Wearables',price:{official:449},specs:{'Écran':'2000 nits','Puce':'S9'}},
  {id:'watch-series-10',images:['./img/watch-series-10.jpg'],brand:'Apple',model:'Watch Series 10',year:2024,category:'Audio & Wearables',price:{official:449},specs:{'Écran':'1,96" OLED','Puce':'S10'}},
  {id:'galaxy-watch-6',images:['./img/galaxy-watch-6.jpg'],brand:'Samsung',model:'Galaxy Watch 6',year:2023,category:'Audio & Wearables',price:{official:319},specs:{'Écran':'1,5" AMOLED','Puce':'Exynos W930'}},
  {id:'garmin-forerunner-965',images:['./img/garmin-forerunner-965.jpg'],brand:'Garmin',model:'Forerunner 965',year:2023,category:'Audio & Wearables',price:{official:649},specs:{'Écran':'1,4" AMOLED','Autonomie':'23 j'}},
  {id:'quest-2',images:['./img/quest-2.jpg'],brand:'Meta',model:'Quest 2',year:2020,category:'VR AR gadgets',price:{official:349},specs:{'Écran':'LCD 1832×1920/œil','Puce':'Snapdragon XR2','RAM':'6 Go','Autonomie':'2-3 h'}},
  {id:'quest-3s',images:['./img/quest-3s.jpg'],brand:'Meta',model:'Quest 3S',year:2024,category:'VR AR gadgets',price:{official:329},specs:{'Écran':'1832×1920/œil','Puce':'Snapdragon XR2 Gen 2','RAM':'8 Go'}},
  {id:'psvr2',images:['./img/psvr2.jpg'],brand:'Sony',model:'PlayStation VR2',year:2023,category:'VR AR gadgets',price:{official:599},specs:{'Écran':'OLED 2000×2040/œil'}},
  {id:'ray-ban-meta',images:['./img/ray-ban-meta.jpg'],brand:'Ray-Ban',model:'Meta Smart Glasses',year:2023,category:'VR AR gadgets',price:{official:329},specs:{'Caméra':'12 MP','Audio':'5 micros','Autonomie':'4 h'}},
  {id:'ps5-pro',images:['./img/ps5-pro.jpg'],brand:'Sony',model:'PlayStation 5 Pro',year:2024,category:'Consoles & Videogames',price:{official:799},specs:{'GPU':'16,7 TFLOPS','SSD':'2 To'}},
  {id:'steam-deck',images:['./img/steam-deck.jpg'],brand:'Valve',model:'Steam Deck',year:2022,category:'Consoles & Videogames',price:{official:419},specs:{'Écran':'7" LCD 60 Hz','Puce':'AMD APU','RAM':'16 Go'}},
  {id:'legion-go',images:['./img/legion-go.jpg'],brand:'Lenovo',model:'Legion Go',year:2023,category:'Consoles & Videogames',price:{official:799},specs:{'Écran':'8,8" QHD+ 144 Hz','Puce':'Z1 Extreme','RAM':'16 Go'}},
  {id:'analogue-pocket',images:['./img/analogue-pocket.jpg'],brand:'Analogue',model:'Pocket',year:2021,category:'Consoles & Videogames',price:{official:219},specs:{'Écran':'3,5" LCD 1600×1440','Autonomie':'10 h'}},
  {id:'playdate',images:['./img/playdate.jpg'],brand:'Panic',model:'Playdate',year:2022,category:'Consoles & Videogames',price:{official:179},specs:{'Écran':'1,8" LCD'}},
  {id:'dji-mini-2',images:['./img/dji-mini-2.jpg'],brand:'DJI',model:'Mini 2',year:2020,category:'Drones & Caméras',price:{official:459},specs:{'Caméra':'4K 30 fps','Portée':'10 km','Autonomie':'31 min','Poids':'249 g'}},
  {id:'dji-mini-3-pro',images:['./img/dji-mini-3-pro.jpg'],brand:'DJI',model:'Mini 3 Pro',year:2022,category:'Drones & Caméras',price:{official:759},specs:{'Caméra':'4K 60 fps','Autonomie':'34 min'}},
  {id:'dji-mini-4-pro',images:['./img/dji-mini-4-pro.jpg'],brand:'DJI',model:'Mini 4 Pro',year:2023,category:'Drones & Caméras',price:{official:799},specs:{'Caméra':'4K 100 fps','Autonomie':'34 min'}},
  {id:'dji-air-3',images:['./img/dji-air-3.jpg'],brand:'DJI',model:'Air 3',year:2023,category:'Drones & Caméras',price:{official:1099},specs:{'Double caméra':'24+70 mm','Autonomie':'46 min','Portée':'20 km'}},
  {id:'dji-mavic-3',images:['./img/dji-mavic-3.jpg'],brand:'DJI',model:'Mavic 3',year:2021,category:'Drones & Caméras',price:{official:1999},specs:{'Caméra':'Hasselblad 4/3','Autonomie':'46 min','Portée':'15 km'}},
  {id:'osmo-pocket-3',images:['./img/osmo-pocket-3.jpg'],brand:'DJI',model:'Osmo Pocket 3',year:2023,category:'Drones & Caméras',price:{official:549},specs:{'Capteur':'1"','Vidéo':'4K 120 fps'}},
  {id:'gopro-hero-10',images:['./img/gopro-hero-10.jpg'],brand:'GoPro',model:'HERO10 Black',year:2021,category:'Drones & Caméras',price:{official:449},specs:{'Vidéo':'5,3K 60 fps','Photo':'23 MP'}},
  {id:'gopro-hero-13',images:['./img/gopro-hero-13.jpg'],brand:'GoPro',model:'HERO13 Black',year:2024,category:'Drones & Caméras',price:{official:449},specs:{'Vidéo':'5,3K 60 fps','Photo':'27 MP'}},
  {id:'sony-zv-1',images:['./img/sony-zv-1.jpg'],brand:'Sony',model:'ZV-1',year:2020,category:'Drones & Caméras',price:{official:799},specs:{'Capteur':'1"','Vidéo':'4K 30 fps','Objectif':'24-70 mm f/1.8-2.8'}},
  {id:'canon-eos-r5',images:['./img/canon-eos-r5.jpg'],brand:'Canon',model:'EOS R5',year:2020,category:'Drones & Caméras',price:{official:2999},specs:{'Capteur':'45 MP plein format','Vidéo':'8K 30 fps'}},
  {id:'nest-audio',images:['./img/nest-audio.jpg'],brand:'Google',model:'Nest Audio',year:2020,category:'Smart Home',price:{official:99},specs:{'Enceinte':'75 mm'}},
  {id:'homepod-mini',images:['./img/homepod-mini.jpg'],brand:'Apple',model:'HomePod mini',year:2020,category:'Smart Home',price:{official:99},specs:{}},
  {id:'sandisk-extreme-ssd',images:['./img/sandisk-extreme-ssd.jpg'],brand:'SanDisk',model:'Extreme Portable SSD',year:2020,category:'Accessories',price:{official:129},specs:{'SSD':'1 To'}},
  {id:'shure-mv7',images:['./img/shure-mv7.jpg'],brand:'Shure',model:'MV7',year:2020,category:'Accessories',price:{official:249},specs:{}},
  {id:'rtx-4090',images:['./img/rtx-4090.jpg'],brand:'NVIDIA',model:'GeForce RTX 4090',year:2022,category:'Composant electronic & informatic',price:{official:1599},specs:{'CUDA':'16384','VRAM':'24 Go GDDR6X','TDP':'450 W'}},
  {id:'rtx-5090',images:['./img/rtx-5090.jpg'],brand:'NVIDIA',model:'GeForce RTX 5090',year:2025,category:'Composant electronic & informatic',price:{official:2349},specs:{'CUDA':'21760','VRAM':'32 Go GDDR7','TDP':'575 W'}},
  {id:'ryzen-5800x3d',images:['./img/ryzen-5800x3d.jpg'],brand:'AMD',model:'Ryzen 7 5800X3D',year:2022,category:'Composant electronic & informatic',price:{official:449},specs:{'Cœurs':'8/16','Fréquence':'4,5 GHz','Cache 3D':'96 Mo'}},
  {id:'raspberry-pi-5',images:['./img/raspberry-pi-5.jpg'],brand:'Raspberry Pi',model:'5',year:2023,category:'Composant electronic & informatic',price:{official:79},specs:{'SoC':'BCM2712','CPU':'4× Cortex-A76 2,4 GHz','RAM':'8 Go'}},
  {id:'arduino-uno-r4',images:['./img/arduino-uno-r4.jpg'],brand:'Arduino',model:'Uno R4',year:2023,category:'Composant electronic & informatic',price:{official:27},specs:{'MCU':'RA4M1 48 MHz'}},
  {id:'iphone-14',images:['./img/iphone-14.jpg'],brand:'Apple',model:'iPhone 14',year:2022,category:'Smartphones',price:{official:1019},specs:{'Écran':'6,1" OLED 60 Hz','Puce':'A15 Bionic','Photo':'12+12 MP','Batterie':'3279 mAh'}},
  {id:'iphone-16',images:['./img/iphone-16.jpg'],brand:'Apple',model:'iPhone 16',year:2024,category:'Smartphones',price:{official:969},specs:{'Écran':'6,1" OLED 60 Hz','Puce':'A18','Photo':'48+12 MP'}},
  {id:'galaxy-s20',images:['./img/galaxy-s20.jpg'],brand:'Samsung',model:'Galaxy S20',year:2020,category:'Smartphones',price:{official:899},specs:{'Écran':'6,2" AMOLED 120 Hz','Puce':'Exynos 990','Photo':'64+12+12 MP','Batterie':'4000 mAh'}},
  {id:'galaxy-a54',images:['./img/galaxy-a54.jpg'],brand:'Samsung',model:'Galaxy A54',year:2023,category:'Smartphones',price:{official:499},specs:{'Écran':'6,4" AMOLED 120 Hz','Puce':'Exynos 1380','Photo':'50+8+5 MP','Batterie':'5000 mAh'}},
  {id:'pixel-5',images:['./img/pixel-5.jpg'],brand:'Google',model:'Pixel 5',year:2020,category:'Smartphones',price:{official:629},specs:{'Écran':'6" OLED 90 Hz','Puce':'Snapdragon 765G','Photo':'12,2+16 MP','Batterie':'4080 mAh'}},
  {id:'pixel-7',images:['./img/pixel-7.jpg'],brand:'Google',model:'Pixel 7',year:2022,category:'Smartphones',price:{official:649},specs:{'Écran':'6,3" OLED 90 Hz','Puce':'Google Tensor G2','Photo':'50+12 MP','Batterie':'4355 mAh'}},
  {id:'xiaomi-13',images:['./img/xiaomi-13.jpg'],brand:'Xiaomi',model:'13',year:2023,category:'Smartphones',price:{official:899},specs:{'Écran':'6,36" AMOLED 120 Hz','Puce':'Snapdragon 8 Gen 2','Photo':'50+10+12 MP'}},
  {id:'huawei-p40-pro',images:['./img/huawei-p40-pro.jpg'],brand:'Huawei',model:'P40 Pro',year:2020,category:'Smartphones',price:{official:1099},specs:{'Écran':'6,58" OLED 90 Hz','Puce':'Kirin 990 5G','Photo':'50+12+40 MP'}},
  {id:'oneplus-8-pro',images:['./img/oneplus-8-pro.jpg'],brand:'OnePlus',model:'8 Pro',year:2020,category:'Smartphones',price:{official:899},specs:{'Écran':'6,78" AMOLED 120 Hz','Puce':'Snapdragon 865','Photo':'48+48+8+5 MP'}},
  {id:'nothing-phone-1',images:['./img/nothing-phone-1.jpg'],brand:'Nothing',model:'Phone (1)',year:2022,category:'Smartphones',price:{official:499},specs:{'Écran':'6,55" OLED 120 Hz','Puce':'Snapdragon 778G+','Photo':'50+50 MP'}},
  {id:'macbook-pro-13-m1',images:['./img/macbook-pro-13-m1.jpg'],brand:'Apple',model:'MacBook Pro 13 M1',year:2020,category:'Computers',price:{official:1449},specs:{'Écran':'13,3" Retina','Puce':'Apple M1','RAM':'8 Go','Autonomie':'20 h'}},
  {id:'mac-mini-m1',images:['./img/mac-mini-m1.jpg'],brand:'Apple',model:'Mac mini M1',year:2020,category:'Computers',price:{official:799},specs:{'Puce':'Apple M1','RAM':'8 Go','SSD':'256 Go','Ports':'2× Thunderbolt'}},
  {id:'ipad-air-4',images:['./img/ipad-air-4.jpg'],brand:'Apple',model:'iPad Air 4',year:2020,category:'Tablets',price:{official:669},specs:{'Écran':'10,9" Liquid Retina','Puce':'A14 Bionic','Stockage':'64 Go'}},
  {id:'surface-go-3',images:['./img/surface-go-3.jpg'],brand:'Microsoft',model:'Surface Go 3',year:2021,category:'Tablets',price:{official:499},specs:{'Écran':'10,5" PixelSense','Puce':'Core i3-10100Y','RAM':'8 Go','Poids':'544 g'}},
  {id:'sony-wf-1000xm4',images:['./img/sony-wf-1000xm4.jpg'],brand:'Sony',model:'WF-1000XM4',year:2021,category:'Audio & Wearables',price:{official:279},specs:{'Autonomie':'8 h'}},
  {id:'beats-fit-pro',images:['./img/beats-fit-pro.jpg'],brand:'Beats',model:'Fit Pro',year:2021,category:'Audio & Wearables',price:{official:199},specs:{'Autonomie':'6 h'}},
  {id:'watch-series-7',images:['./img/watch-series-7.jpg'],brand:'Apple',model:'Watch Series 7',year:2021,category:'Audio & Wearables',price:{official:429},specs:{'Écran':'1,9" OLED','Puce':'S7'}},
  {id:'galaxy-watch-4',images:['./img/galaxy-watch-4.jpg'],brand:'Samsung',model:'Galaxy Watch 4',year:2021,category:'Audio & Wearables',price:{official:269},specs:{'Écran':'1,4" AMOLED','Puce':'Exynos W920'}},
  {id:'pico-4',images:['./img/pico-4.jpg'],brand:'PICO',model:'4',year:2022,category:'VR AR gadgets',price:{official:429},specs:{'Écran':'2160×2160/œil 90 Hz','Puce':'XR2','RAM':'8 Go'}},
  {id:'dji-air-2s',images:['./img/dji-air-2s.jpg'],brand:'DJI',model:'Air 2S',year:2021,category:'Drones & Caméras',price:{official:999},specs:{'Capteur':'1"','Vidéo':'5,4K 30 fps','Autonomie':'31 min','Portée':'12 km'}},
  {id:'gopro-hero-9',images:['./img/gopro-hero-9.jpg'],brand:'GoPro',model:'HERO9 Black',year:2020,category:'Drones & Caméras',price:{official:379},specs:{'Vidéo':'5K 30 fps','Photo':'20 MP'}},
  {id:'insta360-one-x2',images:['./img/insta360-one-x2.jpg'],brand:'Insta360',model:'ONE X2',year:2020,category:'Drones & Caméras',price:{official:429},specs:{'Vidéo':'5,7K 360°','Photo':'18 MP'}},
  {id:'sony-a7-iv',images:['./img/sony-a7-iv.jpg'],brand:'Sony',model:'A7 IV',year:2021,category:'Drones & Caméras',price:{official:2799},specs:{'Capteur':'33 MP plein format','Vidéo':'4K 60 fps'}},
  {id:'galaxy-watch-5',images:['./img/galaxy-watch-5.jpg'],brand:'Samsung',model:'Galaxy Watch 5',year:2022,category:'Audio & Wearables',price:{official:299},specs:{'Écran':'1,4" AMOLED','Puce':'Exynos W920','Capteur':'BioActive','Autonomie':'40 h'}},
  {id:'echo-show-5',images:['./img/echo-show-5.jpg'],brand:'Amazon',model:'Echo Show 5',year:2021,category:'Smart Home',price:{official:89},specs:{'Écran':'5,5"','Caméra':'1 MP'}},
  {id:'nanoleaf-shapes',images:['./img/nanoleaf-shapes.jpg'],brand:'Nanoleaf',model:'Shapes',year:2020,category:'Smart Home',price:{official:199},specs:{}},
  {id:'rx-6800-xt',images:['./img/rx-6800-xt.jpg'],brand:'AMD',model:'Radeon RX 6800 XT',year:2020,category:'Composant electronic & informatic',price:{official:649},specs:{'CUDA':'4608','VRAM':'16 Go GDDR6','TDP':'300 W'}},
  {id:'rx-7900-xtx',images:['./img/rx-7900-xtx.jpg'],brand:'AMD',model:'Radeon RX 7900 XTX',year:2022,category:'Composant electronic & informatic',price:{official:999},specs:{'CUDA':'6144','VRAM':'24 Go GDDR6','TDP':'355 W'}},
  {id:'ryzen-5600x',images:['./img/ryzen-5600x.jpg'],brand:'AMD',model:'Ryzen 5 5600X',year:2020,category:'Composant electronic & informatic',price:{official:299},specs:{'Cœurs':'6/12','Fréquence':'4,6 GHz','L3':'32 Mo'}},
  {id:'i7-12700k',images:['./img/i7-12700k.jpg'],brand:'Intel',model:'Core i7-12700K',year:2021,category:'Composant electronic & informatic',price:{official:409},specs:{'Cœurs':'12 (8P+4E)','Fréquence':'5,0 GHz','L3':'25 Mo'}},
  {id:'pi-zero-2-w',images:['./img/pi-zero-2-w.jpg'],brand:'Raspberry Pi',model:'Zero 2 W',year:2021,category:'Composant electronic & informatic',price:{official:15},specs:{'SoC':'BCM2710A1','CPU':'4× Cortex-A53 1 GHz','RAM':'512 Mo'}},
  {id:'apple-tv-4k',images:['./img/apple-tv-4k.jpg'],brand:'Apple',model:'TV 4K (2022)',year:2022,category:'Smart Home',price:{official:169},specs:{'Puce':'A15 Bionic','Vidéo':'4K HDR10+ Dolby Vision','Audio':'Dolby Atmos','Réseau':'Wi-Fi 6 + Thread'}},
  {id:'echo-dot-5-clock',images:['./img/echo-dot-5-clock.jpg'],brand:'Amazon',model:'Echo Dot 5 with Clock',year:2022,category:'Smart Home',price:{official:69},specs:{'Enceinte':'1,73"'}},
  {id:'iphone-17-pro-max',images:['./img/iphone-17-pro-max.jpg'],brand:'Apple',model:'iPhone 17 Pro Max',year:2025,category:'Smartphones',era:'modern',price:{official:1479},specs:{'Écran':'6,9" LTPO 120 Hz','Puce':'A19 Pro','Photo':'48+48+48 MP','Batterie':'5088 mAh'}},
  {id:'iphone-17-pro',images:['./img/iphone-17-pro.jpg'],brand:'Apple',model:'iPhone 17 Pro',year:2025,category:'Smartphones',era:'modern',price:{official:1329},specs:{'Écran':'6,3" LTPO 120 Hz','Puce':'A19 Pro','Photo':'48+48+48 MP','Batterie':'4252 mAh'}},
  {id:'iphone-air',images:['./img/iphone-air.jpg'],brand:'Apple',model:'iPhone Air',year:2025,category:'Smartphones',era:'modern',price:{official:1229},specs:{'Écran':'6,5" LTPO 120 Hz','Puce':'A19 Pro','Photo':'48 MP','Épaisseur':'5,6 mm'}},
  {id:'iphone-16e',images:['./img/iphone-16e.jpg'],brand:'Apple',model:'iPhone 16e',year:2025,category:'Smartphones',era:'modern',price:{official:719},specs:{'Écran':'6,1" OLED 60 Hz','Puce':'A18','Photo':'48 MP','Batterie':'4005 mAh'}},
  {id:'macbook-pro-14-m5',images:['./img/macbook-pro-14-m5.jpg'],brand:'Apple',model:'MacBook Pro 14 M5',year:2025,category:'Computers',era:'modern',price:{official:1849},specs:{'Écran':'14,2" Liquid Retina XDR','Puce':'M5 10 cœurs','RAM':'16 Go','Stockage':'512 Go'}},
  {id:'ipad-pro-11-m5',images:['./img/ipad-pro-11-m5.jpg'],brand:'Apple',model:'iPad Pro 11 M5',year:2025,category:'Tablets',era:'modern',price:{official:1199},specs:{'Écran':'11" Ultra Retina XDR','Puce':'M5','Stockage':'256 Go','Accessoire':'Apple Pencil Pro'}},
  {id:'mac-mini-m4',images:['./img/mac-mini-m4.jpg'],brand:'Apple',model:'Mac mini M4',year:2024,category:'Computers',era:'modern',price:{official:699},specs:{'Puce':'M4 10 cœurs','RAM':'16 Go','Stockage':'256 Go','Réseau':'Wi-Fi 6E'}},
  {id:'apple-watch-ultra-3',images:['./img/apple-watch-ultra-3.jpg'],brand:'Apple',model:'Watch Ultra 3',year:2025,category:'Audio & Wearables',era:'modern',price:{official:899},specs:{'Boîtier':'49 mm titane','Puce':'S10','Autonomie':'42 h','Fonction':'Satellite'}},
  {id:'airpods-pro-3',images:['./img/airpods-pro-3.jpg'],brand:'Apple',model:'AirPods Pro 3',year:2025,category:'Audio & Wearables',era:'modern',price:{official:249},specs:{'Réduction de bruit':'ANC','Capteur':'Cardiaque','Autonomie':'8 h','Étanchéité':'IP57'}},
  {id:'galaxy-s26-ultra',images:['./img/galaxy-s26-ultra.jpg'],brand:'Samsung',model:'Galaxy S26 Ultra',year:2026,category:'Smartphones',era:'modern',price:{official:1469},specs:{'Écran':'6,9" QHD+ 120 Hz','Puce':'Snapdragon 8 Elite Gen 5','Photo':'200 MP','Batterie':'5000 mAh'}},
  {id:'galaxy-z-fold-8',images:['./img/galaxy-z-fold-8.jpg'],brand:'Samsung',model:'Galaxy Z Fold 8',year:2026,category:'Smartphones',era:'modern',price:{official:2099},specs:{'Écran':'8,2" pliable 120 Hz','Puce':'Snapdragon 8 Elite Gen 5','Photo':'200 MP','Batterie':'4400 mAh'}},
  {id:'galaxy-s25-edge',images:['./img/galaxy-s25-edge.jpg'],brand:'Samsung',model:'Galaxy S25 Edge',year:2025,category:'Smartphones',era:'modern',price:{official:1269},specs:{'Écran':'6,7" 120 Hz','Puce':'Snapdragon 8 Elite','Photo':'200 MP','Épaisseur':'5,8 mm'}},
  {id:'galaxy-watch-ultra-3',images:['./img/galaxy-watch-ultra-3.jpg'],brand:'Samsung',model:'Galaxy Watch Ultra 3',year:2026,category:'Audio & Wearables',era:'modern',price:{official:699},specs:{'Écran':'1,52" AMOLED','Puce':'Snapdragon Wear Elite','Autonomie':'60 h','Étanchéité':'40 m'}},
  {id:'surface-pro-11',images:['./img/surface-pro-11.jpg'],brand:'Microsoft',model:'Surface Pro 11',year:2024,category:'Computers',era:'modern',price:{official:1199},specs:{'Écran':'13" OLED 120 Hz','Puce':'Snapdragon X Elite','RAM':'16 Go','Stockage':'512 Go'}},
  {id:'steam-machine',images:['./img/steam-machine.jpg'],brand:'Valve',model:'Steam Machine',year:2026,category:'Consoles & Videogames',era:'modern',price:{official:519},specs:{'OS':'SteamOS','CPU':'Zen 4 6 cœurs','GPU':'RDNA 3','Stockage':'512 Go'}},
  {id:'steam-frame',images:['./img/steam-frame.jpg'],brand:'Valve',model:'Steam Frame',year:2026,category:'VR AR gadgets',era:'modern',price:{official:899},specs:{'Type':'VR autonome','Puce':'Snapdragon 8 Gen 3','Stockage':'256 Go','Streaming':'Wi-Fi 6E'}},
  {id:'steam-controller',images:['./img/steam-controller.jpg'],brand:'Valve',model:'Steam Controller (2026)',year:2026,category:'Consoles & Videogames',era:'modern',price:{official:99},specs:{'Contrôles':'Trackpads','Retour':'Haptique','Connexion':'Bluetooth','OS':'SteamOS'}},
];

// ============ STATE ============
let products = [...LOCAL_DB];
let filteredProducts = [...LOCAL_DB];
let shopifyProducts = [];
let shopifyReady = false;
let shopifyCartId = null;
let activeCategory = 'all', activeYear = 'all', activeBrand = 'all', activeSort = 'relevance', activeEra = 'all', viewMode = 'all';
let requestedRayon = '';   // rayon demande via l'URL (?rayon=...) — applique apres chargement du catalogue
let activeSources = {official:true, social:true, reviews:true, community:true};
let searchQuery = '', isFetching = false;

let userContext = { isSubscriber: false, tenureDays: 0, cartItems: [], shopifyCartId: null, shopifyCheckoutUrl: null, get isPromoEligible() { return this.cartItems.reduce((n,i)=>n+(Number(i.qty)||1),0) >= 10; } };

// ============ UTILITIES ============
function $(sel, ctx=document){return ctx.querySelector(sel)}
function $$(sel, ctx=document){return Array.from(ctx.querySelectorAll(sel))}
function fmtPrice(price, currency){if(currency===undefined){currency=(window.ksI18n&&window.ksI18n.getCurrency?window.ksI18n.getCurrency():'EUR')}return new Intl.NumberFormat('fr-FR',{style:'currency',currency,minimumFractionDigits:0}).format(price)}
function fmtPriceCrossed(price, currency){if(currency===undefined){currency=(window.ksI18n&&window.ksI18n.getCurrency?window.ksI18n.getCurrency():'EUR')}return `<span class="price-crossed" data-currency="${price}">${fmtPrice(price,currency)}</span>`}
function toast(msg,type='info'){const t=$('#toast');t.textContent=msg;t.className='toast '+type+' visible';setTimeout(()=>t.classList.remove('visible'),3000)}
function hardRefreshVersion(){
  if('serviceWorker' in navigator){
    navigator.serviceWorker.getRegistrations().then(regs=>{
      regs.forEach(reg=>reg.unregister());
    });
  }
  if('caches' in window){
    caches.keys().then(names=>{names.forEach(n=>caches.delete(n));});
  }
  toast('Mise à jour version — rechargement…','info');
  setTimeout(()=>location.reload(true),600);
}
function clearKiffTechCache(){
  if('caches' in window){
    caches.keys().then(names=>{names.forEach(n=>caches.delete(n));});
  }
  toast('Cache vidé','success');
}
function calcKiffTechPrice(officialPrice, context={}){const {isSubscriber=false,cartItems=[],isPromoEligible=false,tenureDays=0,promoBase=20}=context;const articleCount=(cartItems||[]).reduce((n,i)=>n+(Number(i.qty)||1),0);const cartBonus=Math.min(Math.max(0,articleCount),7);let discount=promoBase,freeDelivery=true,reason=`Prix officiels −${promoBase}%`;if(isSubscriber){discount=Math.min(20+Math.floor(tenureDays/30),25);reason=`Abonne KiffTech (${discount}% + livraison offerte)`;}else{discount=Math.min(promoBase+cartBonus,27);if(cartBonus>0)reason=`Prix officiels −${promoBase}% + ${cartBonus}% caisse (${discount}% total)`;else if(articleCount>0)reason=`Prix officiels −${promoBase}%`;}const final=Math.round(officialPrice*(100-discount)/100);return{official:officialPrice,kifftech:final,discount,savings:officialPrice-final,freeDelivery:true,reason,currency:'EUR'};}
function refreshKiffTechPrices(){products.forEach(p=>{if(!p.partner)p.kifftech=calcKiffTechPrice(p.price.official,{isSubscriber:userContext.isSubscriber,cartItems:userContext.cartItems,tenureDays:userContext.tenureDays});});filteredProducts.forEach(p=>{const o=products.find(x=>x.id===p.id);if(o&&!p.partner)p.kifftech=o.kifftech;});}

// ============ CLICKWISE API ============

// ============ RENDER ============
function generateMedia(p){const m={badges:[]};if(p.partner)m.badges.push({class:'badge-official',label:'Partenaire'});if(p.videos?.length)m.badges.push({class:'badge-video',label:'Video'});if(p.images?.length)m.badges.push({class:'badge-official',label:'Photo CC'});else m.badges.push({class:'badge-official',label:'Aperçu généré'});return m;}
function hasOfficialPhoto(p){return !!(p.images&&p.images.length);}

const CAT_EMOJI = {'Smartphones':'📱','Computers':'💻','Tablets':'📲','Audio & Wearables':'🎧','VR AR gadgets':'🥽','Garden & furnitures smart devices':'🪴','Composant electronic & informatic':'🔌','Company & studying Robots':'🤖','Consoles & Videogames':'🎮','Drones & Caméras':'🚁','Smart Home':'🏠','Accessories':'🧰','Composant electronic':'⚡','Materiel electronique & outillage':'🧰'};

/* Marques populaires (grandes marques) et marques peu connues (populace à faire connaître) */
const POPULAR_BRANDS = ['Apple','Samsung','Sony','Microsoft','Google','Nintendo','Meta','Valve','DJI','GoPro','Canon','NVIDIA','AMD','Intel','LG','Huawei','OnePlus','Garmin','Bose','Beats','Shure','Xiaomi','OPPO','Honor'];
const POPULACE_BRANDS = ['Nothing','Framework','Analogue','Panic','Unitree','ANYbotics','Ghost Robotics','PICO','Steam','Raspberry Pi','Arduino','Logitech','SanDisk','Realme','Razer','MSI','Twelve South','Bellroy','Ugreen','Baseus','Satechi','Keychron','Nuphy','CalDigit','StarTech','Hyper','Angelbird','Lamicall','amFilm','Zagg','Cable Matters','Spigen','ESR','OtterBox','Mous','Pitaka'];

/* Détermine le rayon d'affichage d'un produit */
function getTier(p){
  const brand = p.brand || '';
  const year = p.year || 0;
  if (POPULAR_BRANDS.includes(brand) && year >= 2025) return 'popular';
  if (POPULACE_BRANDS.includes(brand)) return 'populace';
  return 'standard';
}

/* Bascule d'affichage : 'all' | 'popular' | 'populace' */
function setViewMode(mode){
  viewMode = mode;
  try { localStorage.setItem('kifftech.viewMode', mode); } catch(e){}
  renderViewModeButtons();
  applyFilters();
}
function getViewMode(){
  try { const s = localStorage.getItem('kifftech.viewMode'); if (s && ['all','popular','populace'].includes(s)) return s; } catch(e){}
  return 'all';
}

/* Boutons toggle Afficher Populaire / Afficher Populace */
function renderViewModeButtons(){
  let container = $('#view-mode-toggle');
  if (!container) {
    container = document.createElement('div');
    container.id = 'view-mode-toggle';
    container.className = 'view-mode-toggle';
    const target = $('#rayon-selector') || $('#filter-category') || document.body;
    target.parentNode.insertBefore(container, target.nextSibling);
  }
  const m = getViewMode();
  const active = c => c === m ? ' active' : '';
  container.innerHTML = `
    <div class="view-mode-label">Affichage :</div>
    <button type="button" class="view-btn vm-all${active('all')}" onclick="setViewMode('all')" aria-label="Tous les produits">Tous</button>
    <button type="button" class="view-btn vm-popular${active('popular')}" onclick="setViewMode('popular')" aria-label="Afficher populaire marques connues 2025-2026">Populaire</button>
    <button type="button" class="view-btn vm-populace${active('populace')}" onclick="setViewMode('populace')" aria-label="Afficher populace marques peu connues">Populace</button>
  `;
}
function escXml(s){return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');}
function brandHue(brand){let h = 0; for (const c of String(brand)) h = (h * 31 + c.charCodeAt(0)) % 360; return h;}
// Aperçu image garanti pour chaque produit : photo si dispo, sinon visuel généré (marque + catégorie).
// NOTE droits : les photos locales sont Wikimedia Commons CC BY-SA (voir img/CREDITS.txt).
// Les visuels constructeurs officiels ne sont PAS copiés (© fabricants) : on pointe vers la page officielle via officialUrl().
const BRAND_SITES={'Samsung':'https://www.samsung.com/fr/','Apple':'https://www.apple.com/fr/','Xiaomi':'https://www.mi.com/fr/','Google':'https://store.google.com/fr/','OnePlus':'https://www.oneplus.com/fr','Nothing':'https://nothing.tech/','Motorola':'https://www.motorola.com/','OPPO':'https://www.oppo.com/fr/','Realme':'https://www.realme.com/fr/','POCO':'https://www.po.co/','Honor':'https://www.honor.com/fr/','Dell':'https://www.dell.com/fr-fr','ASUS':'https://www.asus.com/fr/','Lenovo':'https://www.lenovo.com/fr/','HP':'https://www.hp.com/fr-fr/','Framework':'https://frame.work/','MSI':'https://www.msi.com/','Razer':'https://www.razer.com/','LG':'https://www.lg.com/fr/','Huawei':'https://consumer.huawei.com/fr/','Microsoft':'https://www.microsoft.com/fr-fr/','Anker':'https://www.anker.com/','Ugreen':'https://www.ugreen.com/','Belkin':'https://www.belkin.com/fr/','Zendure':'https://zendure.com/','Shargeek':'https://www.sharge.com/','Baseus':'https://www.baseus.com/','Satechi':'https://satechi.net/','Oppo':'https://www.oppo.com/fr/','Cable Matters':'https://www.cablematters.com/','Spigen':'https://www.spigen.com/','ESR':'https://www.esrtech.com/','OtterBox':'https://www.otterbox.com/','Mous':'https://www.mous.co/','Pitaka':'https://www.pitaka.com/','Bellroy':'https://bellroy.com/','amFilm':'https://www.amfilm.com/','Zagg':'https://www.zagg.com/','Logitech':'https://www.logitech.com/fr-fr','Keychron':'https://www.keychron.com/','Nuphy':'https://nuphy.com/','Royal Kludge':'https://rkgamingstore.com/','CalDigit':'https://www.caldigit.com/','StarTech':'https://www.startech.com/fr/','Hyper':'https://www.hypershop.com/','SanDisk':'https://www.sandisk.com/','Crucial':'https://www.crucial.com/','WD':'https://www.westerndigital.com/','Seagate':'https://www.seagate.com/','Angelbird':'https://www.angelbird.com/','Twelve South':'https://www.twelvesouth.com/','Lamicall':'https://www.lamicall.com/','Meta':'https://www.meta.com/','HTC':'https://www.htc.com/','PICO':'https://www.picoxr.com/fr','XREAL':'https://www.xreal.com/','Rokid':'https://www.rokid.com/','Viture':'https://www.viture.com/','RayNeo':'https://www.rayneo.com/','DPVR':'https://www.dpvr.com/','Gigabyte':'https://www.gigabyte.com/','ASRock':'https://www.asrock.com/','Corsair':'https://www.corsair.com/','Seasonic':'https://seasonic.com/','G.Skill':'https://www.gskill.com/','Unitree':'https://www.unitree.com/','Boston Dynamics':'https://bostondynamics.com/','Agility Robotics':'https://agilityrobotics.com/','Tesla':'https://www.tesla.com/','Figure':'https://www.figure.ai/','1X Technologies':'https://www.1x.tech/','Apptronik':'https://apptronik.com/','ANYbotics':'https://www.anybotics.com/','Ghost Robotics':'https://www.ghostrobotics.io/','Deep Robotics':'https://www.deeprobotics.cn/','Husqvarna':'https://www.husqvarna.com/fr/','Segway':'https://www.segway.com/','Ecovacs':'https://www.ecovacs.com/fr/','Dreame':'https://www.dreametech.com/fr/','Mammotion':'https://mammotion.com/','Philips Hue':'https://www.philips-hue.com/fr-fr','Govee':'https://www.govee.com/','Rachio':'https://rachio.com/','Moen':'https://www.moen.com/','IKEA':'https://www.ikea.com/fr/fr/','Sony':'https://www.sony.fr/','Bose':'https://www.bose.fr/','Sennheiser':'https://www.sennheiser.com/fr-fr','Technics':'https://www.technics.com/fr/','Garmin':'https://www.garmin.com/fr-FR/'};
function officialUrl(p){const base=BRAND_SITES[p.brand]||('https://www.google.com/search?q='+encodeURIComponent(p.brand+' '+p.model+' site officiel'));if(BRAND_SITES[p.brand])return base+'search?q='+encodeURIComponent(p.model);return base;}
// Review complet généré localement (original KiffTech, sans copie presse) : résumé + points + note issue des specs/prix.
function productReview(p){const specs=p.specs||{};const keys=Object.keys(specs);const top=keys.slice(0,3).map(k=>k+': '+specs[k]).join(' • ');const price=p.price?.official||0;const cat=p.category||'';let note=4.0;if(price>2000)note=4.2;else if(price<100)note=4.4;else note=4.3;if(hasOfficialPhoto(p))note=Math.min(5,note+0.2);note=Math.round(note*10)/10;const plus=keys.slice(0,2).map(k=>k+' '+specs[k]);const moins=[p.year&&p.year<2023?'Génération '+p.year+' (vérifier successeur)':'Prix officiel '+price+' € à comparer',cat.includes('Robot')||cat.includes('VR')?'Usage pro/étude : vérifier compatibilité ROS':'Vérifier compatibilité '+cat];const usage=p.usage||[];const impact=p.impact||null;return{summary:(p.brand+' '+p.model+' ('+p.year+', '+cat+'). '+top+'. Positionné à '+price+' € officiel, prix KiffTech recalculé -10 à -25% selon la caisse ou l abonnement.'),plus:plus.length?plus:['Fiche specs complète'],moins:moins,note:note,usage:usage,impact:impact};}
function previewImage(p){
  if (p.images && p.images[0]) return p.images[0];
  const brand = p.brand || '?', model = p.model || '';
  const initials = escXml(((brand[0] || '?') + model.split(' ').map(w => w[0]).join('').slice(0, 2)).toUpperCase());
  const h = brandHue(brand), emoji = CAT_EMOJI[p.category] || '📦';
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${h},70%,30%)'/><stop offset='1' stop-color='hsl(${(h + 60) % 360},70%,14%)'/></linearGradient></defs><rect width='400' height='400' fill='url(#g)'/><text x='200' y='175' font-size='110' text-anchor='middle'>${emoji}</text><text x='200' y='285' font-size='46' font-weight='bold' fill='#ffffff' text-anchor='middle' font-family='sans-serif'>${initials}</text><text x='200' y='325' font-size='24' fill='#ffd23f' text-anchor='middle' font-family='sans-serif'>${escXml(brand)}</text></svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg).replace(/'/g, '%27');
}

// Visuel de remplacement quand l'image produit est indisponible.
// Appele depuis le onerror des <img> : evite d'inliner un SVG dans chaque
// carte (plus de 1 Mo de HTML pour 473 produits).
function kfImgFallback(el, brand, model, category){
  try{
    if (el) el.onerror = null;
    var src = previewImage({ brand: brand, model: model, category: category });
    if (el) el.src = src;
  } catch(e){
    if (el) el.src = KF_PLACEHOLDER;
  }
}
window.kfImgFallback = kfImgFallback;

// Visuel de remplacement quand l'image produit est indisponible.
const KF_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23121316' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='%238f8c82' text-anchor='middle'%3E%3C/text%3E%3C/svg%3E";

// Échappement HTML pour les libellés affichés (noms de rayons, raisons, etc.)
function escHtml(s){return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

// Carte produit du lecteur horizontal : image, nom, marque, prix et actions (détails / caisse).
// Style "cartes à jouer dans une main" : rotation et superposition légère.
function readerCard(p, i = 0){
  if (!p.kifftech) p.kifftech = calcKiffTechPrice(p.price.official, {isSubscriber:userContext.isSubscriber,cartItems:userContext.cartItems,tenureDays:userContext.tenureDays});
  const kt = p.kifftech; const has = kt.discount > 0;
  const imgSrc = previewImage(p);
  const tier = getTier(p);
  const badges = [];
  if (p.videos?.length) badges.push(`<span class="badge badge-video">Video</span>`);
  if (p.images?.length) badges.push(`<span class="badge badge-official">Photo</span>`);
  else badges.push(`<span class="badge badge-official">Aperçu généré</span>`);
  // Source du produit : Boutique (Shopify) / Impact / KiffTech
  if (p.source === 'shopify') badges.push(`<span class="badge badge-source">Boutique</span>`);
  else if (p.source === 'impact') badges.push(`<span class="badge badge-source badge-impact">Impact</span>`);
  if (has) badges.push(`<span class="badge badge-promo">-${kt.discount}%</span>`);
  if (tier === 'popular') badges.push(`<span class="badge badge-tier badge-popular">Populaire</span>`);
  if (tier === 'populace') badges.push(`<span class="badge badge-tier badge-populace">Populace</span>`);
  badges.push(`<span class="badge badge-delivery">Livraison gratuite</span>`);
  const rot = (i % 7 - 3) * 2.2;
  return `<article class="reader-card" data-id="${escAttr(p.id)}" style="--rot:${rot}deg;">
    <div class="reader-media"><img src="${escAttr(imgSrc)}" alt="${escAttr(p.brand + ' ' + p.model)}" loading="lazy" decoding="async" onerror="kfImgFallback(this,'${escAttr(p.brand)}','${escAttr(p.model)}','${escAttr(p.category)}')"><div class="media-badge">${badges.join('')}</div></div>
    <div class="reader-info">
      <span class="reader-brand">${escAttr(p.brand)}</span>
      <h3 class="reader-name">${escAttr(p.model)}</h3>
      <div class="reader-meta"><span class="meta-item meta-year">${p.year || ''}</span><span class="meta-item meta-tier">${tier === 'popular' ? '2025-2026' : tier === 'populace' ? 'À découvrir' : ''}</span></div>
      <div class="reader-prices">${has ? fmtPriceCrossed(kt.official) : ''}<span class="reader-price-kifftech ${has ? 'has-discount' : ''}" data-currency="${kt.kifftech}">${fmtPrice(kt.kifftech)}</span></div>
      ${has ? `<div class="reader-promo">${escHtml(kt.reason)}</div>` : ''}
      <div class="reader-actions">
        <button class="btn-sm primary" type="button" onclick="openModal('${escAttr(p.id)}')" aria-label="Voir le détail de ${escAttr(p.brand + ' ' + p.model)}">Détails</button>
        <button class="btn-sm" type="button" onclick="event.stopPropagation();addToCart('${escAttr(p.id)}')" aria-label="Ajouter ${escAttr(p.brand + ' ' + p.model)} à la caisse">Ajouter</button>
      </div>
    </div>
  </article>`;
}

// Mise en avant éditoriale : produit réel du catalogue (Samsung Galaxy S24 Ultra).
// Prix et promotion calculés à partir de la configuration réelle de la boutique (pas d'invention).
function renderHero(){
  const root = $('#hero');
  if (!root) return;
  const p = products.find(x => x && x.id === 'sp1') || products.find(x => x && x.images && x.images.length);
  if (!p) { root.style.display = 'none'; return; }
  root.style.display = '';
  if (!p.kifftech) p.kifftech = calcKiffTechPrice(p.price.official, {isSubscriber:userContext.isSubscriber,cartItems:userContext.cartItems,tenureDays:userContext.tenureDays});
  const kt = p.kifftech; const has = kt.discount > 0;
  const img = $('#hero-img');
  if (img) { img.src = previewImage(p); img.alt = escAttr(p.brand + ' ' + p.model + ', mise en avant KiffTech'); }
  if ($('#hero-title')) $('#hero-title').textContent = p.model;
  if ($('#hero-kicker')) $('#hero-kicker').textContent = p.brand + ' • ' + p.category + (p.year ? ' • ' + p.year : '');
  if ($('#hero-price-official')) $('#hero-price-official').textContent = fmtPrice(kt.official);
  if ($('#hero-price-kifftech')) $('#hero-price-kifftech').textContent = fmtPrice(kt.kifftech);
  if ($('#hero-discount')) $('#hero-discount').textContent = has ? ('-' + kt.discount + '% • ' + kt.reason) : 'Prix KiffTech';
  if ($('#hero-promo')) $('#hero-promo').innerHTML = 'Prix officiels −20 % de base sur tous les produits • +1 % par article dans la caisse (jusqu\'à +7 %) • Livraison offerte aux abonnés KiffTech Club';
}

// Sélecteur vertical des rayons : catégories réelles du catalogue, chacune filtre le lecteur horizontal.
function renderRayons(){
  const sel = $('#rayon-selector');
  if (!sel) return;
  const counts = {};
  products.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
  const cats = ['all', ...new Set(products.map(p => p.category))];
  const pl = n => n > 1 ? ' articles' : ' article';
  let html = `<button type="button" class="rayon-btn ${activeCategory === 'all' ? 'active' : ''}" data-category="all" role="radio" aria-checked="${activeCategory === 'all'}">Tous les produits<span class="rayon-count">${products.length}${pl(products.length)}</span></button>`;
  const MIN_PAR_RAYON = 25;
  html += cats.filter(c => c !== 'all').map(c => {
    const n = counts[c] || 0;
    const warn = n < MIN_PAR_RAYON ? ' <span class="rayon-warn" title="Rayon incomplet" aria-label="Rayon incomplet">⚠️</span>' : '';
    return `<button type="button" class="rayon-btn ${activeCategory === c ? 'active' : ''}" data-category="${escAttr(c)}" role="radio" aria-checked="${activeCategory === c}">${CAT_EMOJI[c] || '📦'} ${escHtml(c)}${warn}<span class="rayon-count">${n}${pl(n)}</span></button>`;
  }).join('');
  sel.innerHTML = html;
  sel.querySelectorAll('.rayon-btn').forEach(b => {
    b.addEventListener('click', () => {
      activeCategory = b.dataset.category;
      sel.querySelectorAll('.rayon-btn').forEach(x => {
        x.classList.toggle('active', x === b);
        x.setAttribute('aria-checked', x === b);
      });
      applyFilters();
    });
  });
}

// Lecture au clavier du lecteur horizontal (flèches gauche/droite) et défilement d'une carte.
function scrollReader(step){
  const track = $('#reader-track');
  if (!track) return;
  const first = track.querySelector('.reader-card');
  if (!first) return;
  const gap = parseFloat(getComputedStyle(track).gap || '0') || 0;
  track.scrollBy({ left: step * (first.getBoundingClientRect().width + gap), behavior: 'smooth' });
}

// Pagination : on ne rend jamais 473 cartes d'un coup (sinon page lente / noire
// sur mobile). Le lecteur affiche un lot, puis charge la suite a la demande.
const READER_CHUNK = 48;
const GRID_PAGE_SIZE = 48;
let readerLimit = READER_CHUNK;
let gridPage = 1;

function showMoreProducts(){
  readerLimit += READER_CHUNK;
  renderProducts();
  const track = $('#reader-track');
  if (track && track.lastElementChild) track.lastElementChild.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'end' });
}
function nextPage(){ gridPage++; renderProducts(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
function prevPage(){ gridPage = Math.max(1, gridPage - 1); renderProducts(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
window.showMoreProducts = showMoreProducts;
window.nextPage = nextPage;
window.prevPage = prevPage;

function renderProducts(){
  const track = $('#reader-track');
  const grid = $('#products-grid');
  if (filteredProducts.length === 0) {
    if (track) {
      track.innerHTML = '<div class="reader-empty">Aucun produit dans ce rayon</div>';
    } else if (grid) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;padding:40px;text-align:center"><span style="font-size:48px">🔍</span><p>Aucun produit</p></div>';
    }
    $('#results-count').textContent = '0 produits';
    updateStats(); updateCartBadge();
    if ($('#hero')) renderHero();
    return;
  }
  if (track) {
    const shown = filteredProducts.slice(0, readerLimit);
    track.innerHTML = shown.map((p,i) => readerCard(p, i)).join('');
    const rest = filteredProducts.length - shown.length;
    const holder = $('#reader-more');
    if (holder) {
      holder.innerHTML = rest > 0
        ? `<button type="button" class="btn-sm primary" onclick="showMoreProducts()">Afficher ${Math.min(READER_CHUNK, rest)} produits de plus &middot; ${rest} restant(s)</button>`
        : (filteredProducts.length > READER_CHUNK ? `<span class="reader-end">Fin de la liste — ${filteredProducts.length} produits</span>` : '');
    }
  } else if (grid) {
    const pages = Math.max(1, Math.ceil(filteredProducts.length / GRID_PAGE_SIZE));
    if (gridPage > pages) gridPage = pages;
    const slice = filteredProducts.slice((gridPage - 1) * GRID_PAGE_SIZE, gridPage * GRID_PAGE_SIZE);
    grid.innerHTML = slice.map(p => {
      if (!p.kifftech) p.kifftech = calcKiffTechPrice(p.price.official);
      const kt = p.kifftech; const has = kt.discount > 0; const med = generateMedia(p);
      const imgSrc = previewImage(p);
      return `<article class="product-card" data-id="${p.id}"><div class="product-media"><img src="${imgSrc}" alt="${p.brand} ${p.model}" loading="lazy" decoding="async" onerror="kfImgFallback(this,'${escAttr(p.brand)}','${escAttr(p.model)}','${escAttr(p.category)}')"><div class="media-badge">${med.badges.map(b => `<span class="badge ${b.class}">${b.label}</span>`).join('')}${p.source === 'shopify' ? '<span class="badge badge-source">Boutique</span>' : p.source === 'impact' ? '<span class="badge badge-source badge-impact">Impact</span>' : ''}${has ? `<span class="badge badge-promo">-${kt.discount}%</span>` : ''}</div></div><div class="product-info"><span class="product-brand">${p.brand}</span><h3 class="product-name">${p.model}</h3><div class="product-meta"><span class="meta-item meta-year">${p.year || ''}</span><div class="meta-item meta-price-wrap">${has ? fmtPriceCrossed(kt.official) : ''}<span class="price-kifftech ${has ? 'has-discount' : ''}">${fmtPrice(kt.kifftech)}</span></div></div>${has ? `<div class="discount-badge">${kt.reason} • Economisez ${fmtPrice(kt.savings)}${kt.freeDelivery ? ' • Livraison offerte' : ''}</div>` : ''}<div class="product-specs">${Object.entries(p.specs || {}).slice(0, 3).map(([k, v]) => `<div class="spec-row"><span class="spec-label">${k}</span><span class="spec-value">${v}</span></div>`).join('')}</div><div class="product-actions"><button class="btn-sm primary" onclick="openModal('${p.id}')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Details</button><button class="btn-sm" onclick="event.stopPropagation();addToCart('${p.id}')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/></svg>Ajouter</button></div></div></article>`;
    }).join('');
    const pager = $('#grid-pager');
    if (pager) {
      pager.innerHTML = pages > 1
        ? `<button type="button" class="btn-sm" onclick="prevPage()" ${gridPage <= 1 ? 'disabled' : ''}>Pr&eacute;c&eacute;dent</button>` +
          `<span class="pager-info">Page ${gridPage} / ${pages}</span>` +
          `<button type="button" class="btn-sm" onclick="nextPage()" ${gridPage >= pages ? 'disabled' : ''}>Suivant</button>`
        : `<span class="pager-info">${filteredProducts.length} produit(s)</span>`;
    }
  } else {
    console.warn('products reader/grid not found');
    return;
  }
  $('#results-count').textContent = `${filteredProducts.length} produit${filteredProducts.length > 1 ? 's' : ''}`;
  updateStats(); updateCartBadge();
  if ($('#hero')) renderHero();
}

function updateStats(){$('#stat-products').textContent=products.length;$('#stat-sources').textContent='ClickWise+Local';const yrs=new Set(products.map(p=>p.year));$('#stat-coverage').textContent=`${yrs.size} ans`;$('#stat-updated').textContent=new Date().toLocaleDateString('fr-FR');}
function fmtPrice(price,c='EUR'){return new Intl.NumberFormat('fr-FR',{style:'currency',currency:c,minimumFractionDigits:0}).format(price)}
function fmtPriceCrossed(p,c='EUR'){return `<span class="price-crossed">${fmtPrice(p,c)}</span>`}
function toast(m,t='info'){const e=$('#toast');e.textContent=m;e.className='toast '+t+' visible';setTimeout(()=>e.classList.remove('visible'),3000)}

// ============ DATA LOADING ============
// Applique le prix réel d'un produit live (Shopify / Impact) : pas de remise
// KiffTech inventée sur un prix piloté par la source.
function applyLivePricing(list){
  (list||[]).forEach(p=>{
    if (!p || !p.live) return;          // les produits locaux gardent la remise KiffTech
    p.partner = true;
    const off = Number(p.price?.official||0);
    p.kifftech = { official: off, kifftech: off, discount: 0, savings: 0, freeDelivery: false, reason: 'Prix ' + (p.source==='impact'?'Impact':'Shopify'), currency: p.price?.currency || 'EUR' };
  });
}

// Affiche l'état des sources live connectées (Shopify / Impact).
function renderLiveStatus(meta){
  const el = $('#live-status');
  if (!el) return;
  const s = meta && meta.sources ? meta.sources : {};
  const shop = s.shopify || {};
  const imp = s.impact || {};
  const parts = [];
  if (shop.ok) parts.push('Shopify ' + (shop.domain||'') + ' (' + (shop.count||0) + ')');
  if (imp.ok) parts.push('Impact (' + (imp.count||0) + ')');
  if (!parts.length) {
    el.innerHTML = '<span class="live-off">Catalogue local — connectez Shopify et Impact via les secrets GitHub pour les prix live</span>';
    el.classList.remove('live-on');
    return;
  }
  const when = meta && meta.generatedAt ? new Date(meta.generatedAt).toLocaleString('fr-FR') : '';
  el.innerHTML = '<span class="live-on">Sources live actives : ' + parts.join(' • ') + (when ? ' — actualisé le ' + when : '') + '</span>';
  el.classList.add('live-on');
}

async function loadProducts(){
  try {
    toast('Chargement produits...','info');
    products = [...LOCAL_DB];
    products.forEach(p=>p.kifftech=calcKiffTechPrice(p.price.official));
    filteredProducts=[...products];
    applyFilters();

    // Catalogue étendu (JSON versionné) + catalogue live Shopify / Impact
    if (window.KiCatalogue && window.KiCatalogue.load) {
      try {
        const res = await window.KiCatalogue.load();
        // 1) catalogue local (fond), 2) flux live (source de verite des prix)
        const rawLocal = window.KiCatalogue.merge(products, res.local || [], { live: false });
        const rawLive  = window.KiCatalogue.merge(products, res.live  || [], { live: true });
        // compatibilite : une ancienne version de KiCatalogue renvoie un nombre
        const rLocal = (rawLocal && typeof rawLocal === 'object') ? rawLocal : { added: rawLocal || 0, updated: 0 };
        const rLive  = (rawLive  && typeof rawLive  === 'object') ? rawLive  : { added: rawLive  || 0, updated: 0 };
        applyLivePricing(products);
        const addedLocal = rLocal.added, addedLive = rLive.added;
        if (addedLocal || addedLive || rLive.updated) {
          products.forEach(p=>{ if(!p.kifftech) p.kifftech = calcKiffTechPrice(p.price.official); });
          filteredProducts=[...products];
          renderFilters();
          renderRayons();
          refreshKiffTechPrices();
          applyFilters();
          if (addedLive) toast(`${addedLive} produits live (Shopify / Impact) ajoutés`, 'success');
          else if (addedLocal) toast(`${addedLocal} produits du catalogue étendu ajoutés`, 'success');
        } else {
          toast(`${products.length} produits charges (local)`, `success`);
        }
        renderLiveStatus(res.meta);
      } catch(e){ console.warn('[KiffTech] catalogue etendu indisponible:', e.message); }

      // Rayon demande dans l'URL : applique maintenant que le catalogue est complet
      if (requestedRayon && products.some(p => p.category === requestedRayon)) {
        activeCategory = requestedRayon;
        renderRayons();
        applyFilters();
        const safeRayon = (window.CSS && CSS.escape) ? CSS.escape(requestedRayon) : requestedRayon;
        const btn = document.querySelector('#rayon-selector .rayon-btn[data-category="' + safeRayon + '"]');
        if (btn && btn.scrollIntoView) btn.scrollIntoView({ block: 'nearest' });
      }
    }

    // (plus d'appel ClickWise : source inexistante qui affichait un message
    //  "API indisponible" alors que la boutique fonctionnait)
  } catch(e) {
    console.error(e);
    products=[...LOCAL_DB];products.forEach(p=>p.kifftech=calcKiffTechPrice(p.price.official));
    filteredProducts=[...products];
    applyFilters();
    toast('Mode local active','warning');
  }
}

// ============ LA CAISSE (PANIER + CHECKOUT) ============
const CART_KEY='kifftech.cart.v1';
const SUB_ICON='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7l4 4 5-7 5 7 4-4-2 12H5L3 7z"/><path d="M5 19h14"/></svg>';
const TRASH_ICON='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';
let caisseDraft={country:'France'};
let caisseLastOrder=null;
let caisseOrderRef='';

function escAttr(v){return String(v ?? '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function cartCount(){return userContext.cartItems.reduce((n,i)=>n+(Number(i.qty)||1),0);}
function saveCart(){try{localStorage.setItem(CART_KEY,JSON.stringify(userContext.cartItems.map(i=>({id:i.id,qty:Number(i.qty)||1}))));}catch(e){}}
function restoreCart(){
  try{
    const raw=localStorage.getItem(CART_KEY);if(!raw)return false;
    const saved=JSON.parse(raw);if(!Array.isArray(saved))return false;
    userContext.cartItems=saved.map(s=>{const p=products.find(x=>x.id===s.id);if(!p)return null;return{...p,qty:Math.max(1,Math.min(99,Number(s.qty)||1))};}).filter(Boolean);
    return userContext.cartItems.length>0;
  }catch(e){return false;}
}
function addToCart(id,qty=1){
  const p=products.find(x=>x.id===id);if(!p)return;
  // Produit Shopify : caisse geree par Shopify Storefront API (checkoutUrl)
  if(p.shopify && window.KiShopify && window.KiShopify.isConfigured()){
    addToShopifyCart(p.id, qty);
    return;
  }
  const line=userContext.cartItems.find(i=>i.id===id);
  if(line)line.qty=Math.min(99,(Number(line.qty)||1)+qty);
  else userContext.cartItems.push({...p,qty:Math.max(1,Math.min(99,qty))});
  refreshKiffTechPrices();renderProducts();updateCartPanel();updateCartBadge();saveCart();
  toast(`${p.model} — ${line?'quantité mise à jour':'ajouté à la caisse'}`,'success');
}

async function addToShopifyCart(id,qty=1){
  const p=products.find(x=>x.id===id);if(!p)return;
  const v = p.defaultVariant || (p.variants && p.variants[0]);
  if(!v){ toast('Aucune variante disponible pour ce produit','warning'); return; }
  try {
    const line = { variantId: v.shopifyVariantId, quantity: Number(qty)||1, attributes: [{key:'source',value:'KiffTech'},{key:'boutique',value:'KiffTech'}] };
    let res;
    if(userContext.shopifyCartId){
      res = await window.KiShopify.addLinesToCart(userContext.shopifyCartId, [line]);
    } else {
      res = await window.KiShopify.createCart([line]);
      userContext.shopifyCartId = res.cartId;
    }
    userContext.shopifyCheckoutUrl = res.checkoutUrl;
    // Ne pas ajouter a la caisse locale KiffTech pour les produits Shopify (caisse separee)
    toast(`${p.model} ajouté a la caisse Shopify`,'success');
    updateCartBadge();
  } catch(e){
    console.warn('[Shopify] Echec ajout caisse:', e.message);
    toast('Impossible d\'ajouter a la caisse Shopify — reessayez','error');
  }
}
function removeFromCart(id){
  userContext.cartItems=userContext.cartItems.filter(i=>i.id!==id);
  refreshKiffTechPrices();renderProducts();updateCartPanel();updateCartBadge();saveCart();
}
function setCartQty(id,delta){
  const line=userContext.cartItems.find(i=>i.id===id);if(!line)return;
  const next=(Number(line.qty)||1)+delta;
  if(next<1){removeFromCart(id);return;}
  line.qty=Math.min(99,next);
  refreshKiffTechPrices();renderProducts();updateCartPanel();updateCartBadge();saveCart();
}
function clearCart(){
  caisseOrderRef='';
  userContext.cartItems=[];
  refreshKiffTechPrices();renderProducts();updateCartPanel();updateCartBadge();saveCart();
}
function cartTotals(){
  let official=0,kifftech=0;
  for(const i of userContext.cartItems){
    const kt=calcKiffTechPrice(i.price.official,{isSubscriber:userContext.isSubscriber,cartItems:userContext.cartItems,tenureDays:userContext.tenureDays});
    const q=Number(i.qty)||1;
    official+=kt.official*q;kifftech+=kt.kifftech*q;
  }
  return{official,kifftech,savings:official-kifftech,count:cartCount()};
}

// ============ HISTORIQUE DES COMMANDES PAYEES (localStorage) ============
const ORDERS_KEY='kifftech.commandes.payees.v1';
function getCommandesPayees(){
  try{
    const raw=localStorage.getItem(ORDERS_KEY);
    if(!raw)return [];
    const arr=JSON.parse(raw);
    return Array.isArray(arr)?arr:[];
  }catch(e){return [];}
}
function saveCommandePayee(order){
  try{
    const arr=getCommandesPayees();
    arr.unshift({...order,date:order.date||new Date().toISOString()});
    localStorage.setItem(ORDERS_KEY,JSON.stringify(arr));
  }catch(e){console.warn('[Caisse] Impossible de sauvegarder la commande',e);}
}
function clearCommandesPayees(){
  try{localStorage.removeItem(ORDERS_KEY);}catch(e){}
}
function supprimerCommandePayee(ref){
  try{
    const arr=getCommandesPayees().filter(o=>o.ref!==ref);
    localStorage.setItem(ORDERS_KEY,JSON.stringify(arr));
  }catch(e){}
}
function updateCartBadge(){
  const c=cartCount();
  const badge=$('#cart-count');if(badge){badge.textContent=c;badge.style.display=c?'flex':'none';}
  $$('.cart-panel-count').forEach(el=>{el.textContent=c;});
  updatePromoUI();
}
function updatePromoUI(){
  const el=$('#promo-indicator');if(!el)return;
  const n=cartCount();
  const base=calcKiffTechPrice(100,{promoBase:20});
  if(userContext.isSubscriber)el.innerHTML=`<span class="promo-active">Abonne • ${Math.min(20+Math.floor(userContext.tenureDays/30),25)}% + Livraison offerte</span>`;
  else if(n>0)el.innerHTML=`<span class="promo-active">Prix officiels −20% + ${Math.min(n,7)}% caisse (${Math.min(20+Math.min(n,7),27)}% total)</span>`;
  else el.innerHTML=`<span class="promo-pending">Prix officiels −20% sur tous les produits • Ajoutez des articles à la caisse pour +1% jusqu'à +7%</span>`;
}
function updateCartPanel(){
  const p=$('#cart-panel');if(!p)return;
  if(!userContext.cartItems.length){
    p.innerHTML='<p class="cart-empty">Caisse vide</p>';
    updateCaisseIfOpen();
    return;
  }
  const t=cartTotals();
  const items=userContext.cartItems.map(i=>{
    const kt=calcKiffTechPrice(i.price.official,{isSubscriber:userContext.isSubscriber,cartItems:userContext.cartItems});
    const q=Number(i.qty)||1;
    return `<div class="cart-item">
      <img class="cart-item-media" src="${previewImage(i)}" alt="${escAttr(i.brand+' '+i.model)}" decoding="async">
      <div class="cart-item-body">
        <div class="cart-item-name">${escAttr(i.model)}</div>
        <div class="cart-item-brand">${escAttr(i.brand)}</div>
        <div class="cart-qty" role="group" aria-label="Quantité ${escAttr(i.model)}">
          <button class="cart-qty-btn" type="button" onclick="setCartQty('${i.id}',-1)" aria-label="Diminuer la quantité">−</button>
          <span class="cart-qty-value">${q}</span>
          <button class="cart-qty-btn" type="button" onclick="setCartQty('${i.id}',1)" aria-label="Augmenter la quantité">+</button>
        </div>
      </div>
      <div class="cart-item-prices">
        <span class="cart-item-official" data-currency="${kt.official*q}">${fmtPrice(kt.official*q)}</span>
        <span class="cart-item-kifftech" data-currency="${kt.kifftech*q}">${fmtPrice(kt.kifftech*q)}</span>
        ${q>1?`<span class="cart-item-unit">${q} × ${fmtPrice(kt.kifftech)}</span>`:''}
      </div>
      <button class="cart-item-remove" type="button" onclick="removeFromCart('${i.id}')" aria-label="Retirer ${escAttr(i.model)}">×</button>
    </div>`;
  }).join('');
  p.innerHTML=`<div class="cart-list">${items}</div>
    <div class="cart-totals">
      <div class="cart-total">
        <span class="cart-total-label">Total officiel</span>
        <span class="cart-total-official">${fmtPrice(t.official)}</span>
      </div>
      <div class="cart-total is-accent">
        <span class="cart-total-label">Prix KiffTech</span>
        <span class="cart-total-kifftech">${fmtPrice(t.kifftech)}</span>
        <span class="cart-savings">Économie ${fmtPrice(t.savings)}</span>
      </div>
    </div>
    <button class="action-btn primary cart-checkout" type="button" onclick="openCaisse()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/></svg>
      Passer à la caisse
    </button>
    <button class="cart-clear" type="button" onclick="clearCart()" aria-label="Vider la caisse" title="Vider la caisse">${TRASH_ICON}<span class="sr-only">Vider la caisse</span></button>`;
  updateCaisseIfOpen();
}
function ensureCaisse(){
  let o=$('#caisse-overlay');
  if(o)return o;
  o=document.createElement('div');
  o.id='caisse-overlay';
  o.className='caisse-overlay';
  o.setAttribute('role','dialog');
  o.setAttribute('aria-modal','true');
  o.setAttribute('aria-labelledby','caisse-title');
  o.innerHTML=`<div class="caisse" role="document">
    <header class="caisse-header">
      <div>
        <div class="caisse-kicker">KiffTech — Commande sécurisée</div>
        <h2 class="caisse-title" id="caisse-title">La Caisse</h2>
      </div>
      <button class="caisse-close" id="caisse-close" type="button" aria-label="Fermer la caisse">×</button>
    </header>
    <div class="caisse-body" id="caisse-body"></div>
  </div>`;
  document.body.appendChild(o);
  o.addEventListener('click',e=>{if(e.target===o)closeCaisse();});
  const close=o.querySelector('#caisse-close');
  if(close)close.addEventListener('click',closeCaisse);
  return o;
}
function openCaisse(){
  const o=ensureCaisse();
  caisseLastOrder=null;caisseOrderRef='';
  o.classList.add('visible');
  document.body.style.overflow='hidden';
  renderCaisse();
  const close=o.querySelector('#caisse-close');
  if(close)close.focus();
}
function closeCaisse(){
  const o=$('#caisse-overlay');
  if(o)o.classList.remove('visible');
  document.body.style.overflow='';
}
function updateCaisseIfOpen(){
  const o=$('#caisse-overlay');
  if(o&&o.classList.contains('visible'))renderCaisse();
}
function newOrderRef(){
  const d=new Date(),p=n=>String(n).padStart(2,'0');
  return 'KT-'+d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
}
function caisseField(key,label,type='text',half=false,placeholder=''){
  return `<label class="caisse-field${half?' is-half':''}"><span>${label}</span><input class="caisse-input" type="${type}" data-caisse-field="${key}" value="${escAttr(caisseDraft[key]||'')}" placeholder="${escAttr(placeholder)}"></label>`;
}
function validateCaisse(){
  const required=[['name','nom complet'],['email','adresse email'],['phone','numéro de téléphone'],['address','adresse'],['zip','code postal'],['city','ville']];
  for(const [key,label] of required){
    if(!String(caisseDraft[key]||'').trim()){
      toast('Renseignez votre '+label+' avant de payer','warning');
      const el=document.querySelector(`[data-caisse-field="${key}"]`);
      if(el)el.focus();
      return false;
    }
  }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(caisseDraft.email).trim())){
    toast('Adresse email invalide','warning');
    const el=document.querySelector('[data-caisse-field="email"]');
    if(el)el.focus();
    return false;
  }
  return true;
}
function renderCaisse(){
  const body=$('#caisse-body');if(!body)return;
  if(caisseLastOrder){body.innerHTML=renderCaisseSuccess();body.scrollTop=0;return;}
  const t=cartTotals();
  if(!t.count){
    body.innerHTML=`<div class="caisse-empty">
      <div class="caisse-empty-mark">0</div>
      <h3 class="caisse-empty-title">Votre caisse est vide.</h3>
      <p class="caisse-empty-text">Ajoutez un objet depuis le catalogue pour ouvrir une commande.</p>
      <button class="action-btn primary" type="button" onclick="closeCaisse()">Retour au catalogue</button>
    </div>`;
    return;
  }
  const lines=userContext.cartItems.map(i=>{
    const kt=calcKiffTechPrice(i.price.official,{isSubscriber:userContext.isSubscriber,cartItems:userContext.cartItems});
    const q=Number(i.qty)||1;
    return `<div class="caisse-line">
      <img class="caisse-line-media" src="${previewImage(i)}" alt="${escAttr(i.brand+' '+i.model)}" decoding="async">
      <div class="caisse-line-body">
        <div class="caisse-line-name">${escAttr(i.model)}</div>
        <div class="caisse-line-brand">${escAttr(i.brand)}${i.year?' · '+i.year:''}</div>
        <div class="caisse-qty">
          <button class="caisse-qty-btn" type="button" onclick="setCartQty('${i.id}',-1)" aria-label="Diminuer la quantité">−</button>
          <span class="caisse-qty-value">${q}</span>
          <button class="caisse-qty-btn" type="button" onclick="setCartQty('${i.id}',1)" aria-label="Augmenter la quantité">+</button>
          <span class="caisse-line-unit">${fmtPrice(kt.kifftech)} / unité</span>
        </div>
      </div>
      <div class="caisse-line-prices">
        <span class="caisse-line-official">${fmtPrice(kt.official*q)}</span>
        <span class="caisse-line-price">${fmtPrice(kt.kifftech*q)}</span>
      </div>
    </div>`;
  }).join('');
  body.innerHTML=`<section class="caisse-lines">
    <div class="caisse-section-head"><span>01 — Sélection</span><span>${t.count} article${t.count>1?'s':''}</span></div>
    <div class="caisse-line-list">${lines}</div>
    <button class="caisse-clear" type="button" onclick="clearCart()" aria-label="Vider la caisse" title="Vider la caisse">${TRASH_ICON}<span class="sr-only">Vider la caisse</span></button>
  </section>
  <section class="caisse-checkout">
    <div class="caisse-section-head"><span>02 — Coordonnées</span><span>Livraison</span></div>
    <form class="caisse-form" id="caisse-form" onsubmit="return false">
      ${caisseField('name','Nom complet','text',false,'Prénom et nom')}
      ${caisseField('email','Email','email',false,'vous@exemple.fr')}
      ${caisseField('phone','Téléphone (requis)','tel',true,'06 00 00 00 00')}
      ${caisseField('address','Adresse','text',false,'Numéro et rue')}
      ${caisseField('zip','Code postal','text',true,'75000')}
      ${caisseField('city','Ville','text',true,'Paris')}
      ${caisseField('country','Pays','text',false,'France')}
      <label class="caisse-field"><span>Note de commande (facultatif)</span><textarea class="caisse-input" data-caisse-field="notes" rows="2" placeholder="Instructions de livraison, variante...">${escAttr(caisseDraft.notes||'')}</textarea></label>
    </form>
    <div class="caisse-summary">
      <div class="caisse-summary-row"><span>Total officiel</span><span>${fmtPrice(t.official)}</span></div>
      <div class="caisse-summary-row"><span>Remise KiffTech</span><span>− ${fmtPrice(t.savings)}</span></div>
      <div class="caisse-summary-row"><span>Livraison</span><span>Offerte</span></div>
      <div class="caisse-summary-row is-total"><span>Total à payer</span><span class="caisse-summary-total">${fmtPrice(t.kifftech)}</span></div>
      <div class="caisse-savings">Vous économisez ${fmtPrice(t.savings)}</div>
    </div>
    <div class="caisse-pay">
      <div class="caisse-pay-label">03 — Paiement</div>
      <div id="caisse-paypal-container" class="caisse-paypal-slot"></div>
      <div id="caisse-paypal-status" class="caisse-paypal-status"></div>
      <p class="caisse-secure">Paiement traité par PayPal. Aucune donnée bancaire ne transite par KiffTech.</p>
    </div>
  </section>`;
  body.querySelectorAll('[data-caisse-field]').forEach(el=>{
    el.addEventListener('input',()=>{caisseDraft[el.dataset.caisseField]=el.value;});
  });
  renderPayPalButton(t.kifftech,'#caisse-paypal-container','#caisse-paypal-status');
}
function renderCaisseSuccess(){
  const o=caisseLastOrder;
  return `<div class="caisse-success">
    <div class="caisse-success-mark">✓</div>
    <div class="caisse-kicker">Commande confirmée</div>
    <h3 class="caisse-success-title">Merci${o.name?', '+escAttr(o.name):''}.</h3>
    <p class="caisse-success-text">Votre commande <strong>${o.ref}</strong> est enregistrée. Un reçu PayPal a été envoyé à ${o.email?escAttr(o.email):'votre adresse email'}.</p>
    <div class="caisse-success-grid">
      <div><span>Référence</span><strong>${o.ref}</strong></div>
      <div><span>Articles</span><strong>${o.count}</strong></div>
      <div><span>Total payé</span><strong>${fmtPrice(o.total)}</strong></div>
      <div><span>Statut</span><strong>Payée</strong></div>
    </div>
    <button class="action-btn primary caisse-success-btn" type="button" onclick="closeCaisse()">Continuer</button>
  </div>`;
}
function checkout(){openCaisse();}

// ============ PAYPAL ============
// Le Client ID PayPal est PUBLIC et injecté au build (paypal-config.js).
// La clé secrète PayPal ne doit jamais être exposée côté navigateur.
let paypalSdkPromise=null;
function paypalClientId(){return String(window.KIFFTECH_PAYPAL_CLIENT_ID||'').trim();}
function loadPayPalSdk(){
  const id=paypalClientId();
  if(!id)return Promise.reject(new Error('Client ID PayPal absent'));
  if(window.paypal&&window.paypal.Buttons)return Promise.resolve(window.paypal);
  if(paypalSdkPromise)return paypalSdkPromise;
  paypalSdkPromise=new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src='https://www.paypal.com/sdk/js?client-id='+encodeURIComponent(id)+'&currency=EUR&intent=capture&components=buttons';
    s.async=true;
    s.onload=()=>window.paypal&&window.paypal.Buttons?resolve(window.paypal):reject(new Error('SDK PayPal incomplet'));
    s.onerror=()=>reject(new Error('SDK PayPal indisponible'));
    document.head.appendChild(s);
  });
  return paypalSdkPromise;
}
// Boutons PayPal personnalises : style, options de financement, message.
// Surchargeable via window.KIFFTECH_PAYPAL_BUTTONS (genere au deploiement).
function paypalButtonConfig(){
  const def={style:{shape:'rect',color:'gold',layout:'vertical',label:'paypal',height:44},funding:['paypal'],message:{color:'black',size:12},disableFunding:[]};
  const c=window.KIFFTECH_PAYPAL_BUTTONS||{};
  return {
    style:Object.assign({},def.style,c.style||{}),
    funding:Array.isArray(c.funding)&&c.funding.length?c.funding:def.funding,
    message:Object.assign({},def.message,c.message||{}),
    disableFunding:Array.isArray(c.disableFunding)?c.disableFunding:def.disableFunding,
  };
}
function paypalStatus(msg,color,sel='#paypal-status'){const el=$(sel);if(el){el.textContent=msg||'';el.style.color=color||'var(--kf-muted)';}}
function renderPayPalButton(total,slotSel='#paypal-button-container',statusSel='#paypal-status'){
  const box=$(slotSel);
  if(!box)return;
  const setStatus=(msg,color)=>paypalStatus(msg,color,statusSel);
  if(!paypalClientId()){
    setStatus('PayPal : Client ID public non configuré. Réessayez plus tard.');
    return;
  }
  box.innerHTML='<div class="paypal-loading">Chargement de PayPal…</div>';
  loadPayPalSdk().then(paypal=>{
    if(!document.body.contains(box))return;
    box.innerHTML='';
    const bcfg = paypalButtonConfig();
    paypal.Buttons({
      style: bcfg.style,
      funding: bcfg.funding,
      message: bcfg.message,
      disableFunding: bcfg.disableFunding,
      onClick:(data,actions)=>{if(!validateCaisse())return actions.reject();},
      createOrder:(data,actions)=>{
        caisseOrderRef=caisseOrderRef||newOrderRef();
        return actions.order.create({purchase_units:[{description:'KiffTech — '+cartCount()+' article(s) — '+caisseOrderRef,amount:{value:Number(total).toFixed(2),currency_code:'EUR'}}]});
      },
      onApprove:(data,actions)=>actions.order.capture().then(details=>{
        const payer=details&&details.payer&&details.payer.name?details.payer.name.given_name:'';
        const t=cartTotals();
        const ref=caisseOrderRef||newOrderRef();
        const items=userContext.cartItems.map(i=>{
          const kt=calcKiffTechPrice(i.price.official,{isSubscriber:userContext.isSubscriber,cartItems:userContext.cartItems,tenureDays:userContext.tenureDays});
          return{id:i.id,brand:i.brand,model:i.model,year:i.year,category:i.category,qty:Number(i.qty)||1,official:kt.official,kifftech:kt.kifftech};
        });
        const order={ref,total:t.kifftech,count:t.count,name:payer||caisseDraft.name||'',email:String(caisseDraft.email||'').trim(),phone:String(caisseDraft.phone||'').trim(),date:new Date().toISOString(),mode:'PayPal',statut:'payee',items};
        caisseLastOrder=order;
        saveCommandePayee(order);
        clearCart();
        toast('Paiement confirmé — commande '+order.ref,'success');
      }),
      onCancel:()=>toast('Paiement PayPal annulé','info'),
      onError:err=>{console.error('[PayPal]',err);toast('Erreur PayPal — réessayez','error');}
    }).render(box).catch(err=>{
      console.error('[PayPal] render',err);
      box.innerHTML='';
      setStatus('PayPal indisponible pour le moment. Réessayez plus tard.','#ff9b3d');
    });
  }).catch(err=>{
    console.warn('[PayPal]',err.message);
    box.innerHTML='';
    setStatus('PayPal indisponible hors ligne. Réessayez plus tard.','#ff9b3d');
  });
}
function toggleSub(){userContext.isSubscriber=!userContext.isSubscriber;userContext.tenureDays=userContext.isSubscriber?30:0;refreshKiffTechPrices();renderProducts();updateCartPanel();updateSubUI();toast(userContext.isSubscriber?'Abonnement active (1eur/jour)':'Desactive',userContext.isSubscriber?'success':'info');}
function updateSubUI(){
  const label=userContext.isSubscriber?'Gérer l’abonnement KiffTech Club':"S'abonner KiffTech Club (1 €/jour)";
  const html=SUB_ICON+'<span class="sr-only">'+label+'</span>';
  [$('#btn-subscribe'),$('#btn-subscribe-header')].forEach(el=>{
    if(!el)return;
    el.innerHTML=html;
    el.setAttribute('aria-label',label);
    el.title=label;
    const base=el.id==='btn-subscribe-header'?'sub-btn':'action-btn';
    el.className=base+' icon-only'+(userContext.isSubscriber?' primary':'');
  });
  updatePromoUI();
}

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
  const box=$('#agent-result');if(!box)return;
  const q=$('#agent-input')?$('#agent-input').value:'';
  const found=agentFind(q)||{match:null,suggestions:[]};
  if(found.match){
    const p=found.match;
    const kt=p.kifftech||calcKiffTechPrice(p.price.official,{isSubscriber:userContext.isSubscriber,cartItems:userContext.cartItems});
    const desc=p.description?String(p.description).slice(0,120):Object.entries(p.specs||{}).slice(0,3).map(([k,v])=>`${k}: ${v}`).join(' • ');
    box.innerHTML=`<div class="agent-hit">
      <img class="agent-hit-media" src="${previewImage(p)}" alt="${p.brand} ${p.model}" decoding="async">
      <div class="agent-hit-body">
        <div class="agent-hit-kicker">${p.brand} • ${p.category}${p.year?' • '+p.year:''}</div>
        <div class="agent-hit-name">${p.model}</div>
        <p class="agent-hit-desc">${desc}</p>
        <div class="agent-hit-prices">
          <span class="price-crossed">${fmtPrice(kt.official)}</span>
          <span class="price-kifftech has-discount">${fmtPrice(kt.kifftech)}</span>
          <span class="discount-badge">-${kt.discount}%</span>
        </div>
        <div class="agent-hit-actions">
          <button class="btn-sm primary" onclick="openModal('${p.id}')">Aperçu complet</button>
          <button class="btn-sm" onclick="addToCart('${p.id}')">Ajouter</button>
        </div>
      </div>
    </div>`;
  } else if(found.suggestions.length){
    box.innerHTML=`<p class="agent-hint">Pas d'exactitude — essayez :</p><div class="agent-suggestions">`+found.suggestions.map(p=>`<button class="btn-sm" data-agent-suggest="${p.brand} ${p.model}">${p.brand} ${p.model}</button>`).join('')+`</div>`;
    box.querySelectorAll('[data-agent-suggest]').forEach(b=>b.addEventListener('click',()=>{$('#agent-input').value=b.dataset.agentSuggest;agentRender();}));
  } else {
    box.innerHTML=`<p class="agent-hint">Aucun produit « ${String(q).slice(0,60)} ». Tapez marque + modèle exacts.</p>`;
  }
}

// ============ PARTENAIRE impact.com (affiliation) ============
// CONFIGURATION : remplacez YOUR_IMPACT_CAMPAIGN_ID et YOUR_TRACKING_LINK
// dans kifftech/app.v2.js (champs impact des produits) et dans
// kifftech/impact-products.json par vos vrais identifiants d'affiliation Impact.
// Chaque produit peut avoir un champ impact : { campaignId, subId, url }
// Le lien s'affiche dans la modal produit sous "Lien partenaire Impact".
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

// ============ SHOPIFY HEADLESS (Storefront API publique) ============
async function loadShopifyProducts() {
  if (!window.KiShopify || !window.KiShopify.isConfigured()) {
    if (window.KiShopify && window.KiShopify.domainValid && !window.KiShopify.domainValid()) {
      console.warn('[Shopify] Domaine de boutique non valide (' + (window.KiShopify.domain() || 'absent') + ') — il faut le sous-domaine .myshopify.com');
    } else {
      console.log('[Shopify] Non configuré — produits locaux uniquement');
    }
    return;
  }
  try {
    toast('Chargement des produits Shopify…', 'info');
    const nodes = await window.KiShopify.loadAllProducts();
    const existingIds = new Set(products.map(p => p.id));
    let added = 0;
    for (const node of nodes) {
      const kp = window.KiShopify.toKifftechProduct(node);
      if (existingIds.has(kp.id)) continue; // évite les doublons
      // Prix sous contrôle de Shopify : pas de remise KiffTech inventée ici
      kp.kifftech = { official: kp.price.official, kifftech: kp.price.official, discount: 0, savings: 0, freeDelivery: false, reason: 'Prix Shopify', currency: kp.price.currency || 'EUR' };
      products.push(kp);
      existingIds.add(kp.id);
      added++;
    }
    shopifyProducts = nodes;
    shopifyReady = true;
    filteredProducts = [...products];
    if (added) {
      renderFilters();
      applyFilters();
      toast(`${added} produits Shopify importés`, 'success');
    } else {
      toast('Shopify connecté — aucun nouveau produit', 'info');
    }
  } catch (e) {
    console.warn('[Shopify] Échec chargement produits:', e.message);
    toast('Shopify indisponible, produits locaux utilisés', 'warning');
  }
}

// ============ FILTERS ============
function applyFilters(){readerLimit=READER_CHUNK;gridPage=1;filteredProducts=products.filter(p=>{if(searchQuery&&!`${p.brand} ${p.model} ${p.category}`.toLowerCase().includes(searchQuery.toLowerCase()))return false;if(activeCategory!=='all'&&p.category!==activeCategory)return false;if(activeYear!=='all'&&p.year!==parseInt(activeYear))return false;if(activeBrand!=='all'&&p.brand!==activeBrand)return false;if(activeEra!=='all'&&p.era!==activeEra)return false;if(viewMode==='popular'&&getTier(p)!=='popular')return false;if(viewMode==='populace'&&getTier(p)!=='populace')return false;return true;});if(activeSort==='brand')filteredProducts.sort((a,b)=>`${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`));else if(activeSort==='price-asc')filteredProducts.sort((a,b)=>(a.kifftech?.kifftech??a.price.official)-(b.kifftech?.kifftech??b.price.official));else if(activeSort==='price-desc')filteredProducts.sort((a,b)=>(b.kifftech?.kifftech??b.price.official)-(a.kifftech?.kifftech??a.price.official));renderProducts();}
function renderFilters(){const cats=['all',...new Set(products.map(p=>p.category))];$('#filter-category').innerHTML=cats.map(c=>`<button class="filter-btn ${c===activeCategory?'active':''}" data-cat="${c}">${c==='all'?'Toutes':c}</button>`).join('');const ss=$('#sort-select');if(ss)ss.value=activeSort;const years=['all',...[...new Set(products.map(p=>p.year))].sort((a,b)=>b-a)];$('#filter-year').innerHTML=years.map(y=>`<button class="filter-btn ${y===activeYear?'active':''}" data-year="${y}">${y==='all'?'Toutes':y}</button>`).join('');const brands=['all',...[...new Set(products.map(p=>p.brand))].sort()];$('#filter-brand').innerHTML=brands.map(b=>`<button class="filter-btn ${b===activeBrand?'active':''}" data-brand="${b}">${b==='all'?'Toutes':b}</button>`).join('');const eras=[['all','Tous'],['retro','🕹️ Rétro'],['modern','🚀 Modernes']];const fe=$('#filter-era');if(fe)fe.innerHTML=eras.map(([v,l])=>`<button class="filter-btn ${v===activeEra?'active':''}" data-era="${v}">${l}</button>`).join('');renderViewModeButtons();}

// ============ PARTICLES ============
function initParticles(){const c=$('#particules')||document.body.appendChild(Object.assign(document.createElement('div'),{id:'particules',className:'particules'}));const cols=['#1e6bff','#ff3d9a','#ffd23f','#27d17f','#00d4ff','#ff6b00'];for(let i=0;i<15;i++){const p=document.createElement('div');p.className='particule';const sx=(Math.random()-.5)*innerWidth*.8,sy=(Math.random()-.5)*innerHeight*.8,ex=(Math.random()-.5)*innerWidth*.8,ey=(Math.random()-.5)*innerHeight*.8,del=Math.random()*12,dur=10+Math.random()*8,op=.1+Math.random()*.2,clr=cols[Math.floor(Math.random()*cols.length)];p.style.cssText=`left:50%;top:50%;--sx:${sx}px;--sy:${sy}px;--ex:${ex}px;--ey:${ey}px;--op:${op};background:${clr};animation-duration:${dur}s;animation-delay:${del}s`;c.appendChild(p);}}

// ============ MODAL ============
function openModal(id){const p=products.find(x=>x.id===id);if(!p)return;const kt=p.kifftech;const has=kt.discount>0;
$('#modal-brand').textContent=p.brand;$('#modal-name').textContent=p.model;
$('#modal-meta').innerHTML=`<span class="meta-year">${p.year || ''}</span><span>${p.category}</span>${kt.discount>0?`<span class="meta-promo">-${kt.discount}%</span>`:''}`;
$('#modal-desc').textContent = p.description || productReview(p).summary;
const r=productReview(p);$('#modal-specs').innerHTML=Object.entries(p.specs||{}).map(([k,v])=>`<div class="spec-item"><span class="spec-label">${k}</span><span class="spec-value">${v}</span></div>`).join('')+`<div class="spec-item"><span class="spec-label">Note KiffTech</span><span class="spec-value">★ ${r.note}/5</span></div><div class="spec-item"><span class="spec-label">Points +</span><span class="spec-value">${r.plus.join(' ; ')}</span></div><div class="spec-item"><span class="spec-label">À vérifier</span><span class="spec-value">${r.moins.join(' ; ')}</span></div><div class="spec-item"><span class="spec-label">Visuel</span><span class="spec-value">${hasOfficialPhoto(p)?'Photo CC BY-SA':'Aperçu généré — voir page officielle'}</span></div>${r.usage&&r.usage.length?`<div class="spec-item"><span class="spec-label">Occasions d'utilisation</span><span class="spec-value">${r.usage.join(' • ')}</span></div>`:''}${r.impact?`<div class="spec-item"><span class="spec-label">Lien partenaire Impact</span><span class="spec-value"><a href="${escAttr(r.impact.url)}" target="_blank" rel="noopener nofollow">Voir sur Impact (référence partenaire)</a></span></div>`:''}`;
$('#modal-prices').innerHTML=`<div class="price-card"><div class="price-source">Prix officiel</div><div class="price-value">${has?fmtPriceCrossed(kt.official):fmtPrice(kt.official)}</div><a class="price-link" href="${p.sources?.official||officialUrl(p)}" target="_blank" rel="noopener">Page officielle ${p.brand}</a></div>${has?`<div class="price-card primary"><div class="price-source">KiffTech <span class="discount-tag">-${kt.discount}%</span></div><div class="price-value">${fmtPrice(kt.kifftech)}</div><div style="color:#27d17f">Economisez ${fmtPrice(kt.savings)}</div><button class="price-link" style="margin-top:12px;background:linear-gradient(135deg,#27d17f,#1e6bff)" onclick="addToCart('${p.id}');closeModal()">Ajouter à la caisse</button></div>`:''}${(p.checkoutUrl||p.url)?`<div class="price-card"><div class="price-source">${p.source==='impact'?'Achat partenaire (Impact)':'Achat boutique Shopify'}</div><div class="price-value">${fmtPrice(kt.official)}</div><a class="price-link" href="${escAttr(p.checkoutUrl||p.url)}" target="_blank" rel="noopener sponsored">${p.source==='impact'?'Ouvrir le lien partenaire':'Voir sur la boutique Shopify'}</a></div>`:''}`;
const gallery = (p.images && p.images.length ? p.images : [previewImage(p)]);
const galleryVideos = (p.videos && p.videos.length ? p.videos : []);
const m=$('#modal-media');m.innerHTML='';gallery.forEach((img,i)=>{const e=document.createElement('img');e.src=img;e.decoding='async';e.alt=`${p.brand} ${p.model} - visuel ${i + 1}`;e.style.display=(i===0?'block':'none');m.appendChild(e);});galleryVideos.forEach((src,i)=>{const v=document.createElement('video');v.src=src;v.controls=true;v.preload='none';v.setAttribute('aria-label',`${p.brand} ${p.model} - vidéo ${i + 1}`);v.style.display='none';v.style.width='100%';m.appendChild(v);});
const nav=$('#modal-media')&&$('#media-nav');if(nav){nav.innerHTML='';const total=gallery.length+galleryVideos.length;if(total>1){for(let i=0;i<total;i++){const d=document.createElement('button');d.className='media-dot'+(i===0?' active':'');d.setAttribute('aria-label','Média '+(i+1));d.onclick=()=>showMedia(i);nav.appendChild(d);}}}
const mt=$('#modal-title');if(mt)mt.dataset.currentId=id;$('#modal-overlay').classList.add('visible');document.body.style.overflow='hidden';}
function showMedia(idx){$$('#modal-media img, #modal-media video').forEach((e,i)=>{e.style.display=i===idx?'block':'none';if(e.tagName==='VIDEO'&&i!==idx&&e.pause)e.pause();});$$('#media-nav button').forEach((d,i)=>{d.classList.toggle('active',i===idx)});}
function closeModal(){$('#modal-overlay').classList.remove('visible');document.body.style.overflow='';}
function showMedia(idx){$$('#modal-media img, #modal-media video').forEach((e,i)=>{e.style.display=i===idx?'block':'none';if(e.tagName==='VIDEO'&&i!==idx&&e.pause)e.pause();});$$('#media-nav button').forEach((d,i)=>{d.classList.toggle('active',i===idx)});}

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
  const rp = $('#reader-prev');
  if (rp) rp.addEventListener('click', () => scrollReader(-1));
  const rn = $('#reader-next');
  if (rn) rn.addEventListener('click', () => scrollReader(1));
  const track = $('#reader-track');
  if (track) {
    track.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); scrollReader(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); scrollReader(1); }
    });
  }
  on('#btn-fetch', 'click', async () => { toast('Rechargement...', 'info'); await loadProducts(); });
  on('#btn-clear', 'click', () => { products = [...LOCAL_DB]; products.forEach(p => p.kifftech = calcKiffTechPrice(p.price.official)); filteredProducts = [...products]; applyFilters(); toast('Base locale restauree', 'success'); });
  on('#btn-hard-refresh', 'click', hardRefreshVersion);
  on('#btn-cache-clear', 'click', clearKiffTechCache);
  const toggleSubHandler = () => { userContext.isSubscriber = !userContext.isSubscriber; userContext.tenureDays = userContext.isSubscriber ? 30 : 0; refreshKiffTechPrices(); renderProducts(); updateCartPanel(); updateSubUI(); toast(userContext.isSubscriber ? 'Abonnement active (1eur/jour)' : 'Desactive', userContext.isSubscriber ? 'success' : 'info'); };
  on('#btn-subscribe', 'click', toggleSubHandler);
  on('#btn-subscribe-header', 'click', toggleSubHandler);
  on('#btn-cart-header', 'click', () => openCaisse());
  on('#modal-close', 'click', closeModal);
  on('#modal-overlay', 'click', e => { if (e.target === e.currentTarget) closeModal(); });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){const c=$('#caisse-overlay');if(c&&c.classList.contains('visible'))closeCaisse();else closeModal();}});
}

/* Style des cartes à jouer dans une main + boutons d'affichage */
function injectCardStyle(){
  if (document.getElementById('kifftech-card-style')) return;
  const s = document.createElement('style');
  s.id = 'kifftech-card-style';
  s.textContent = `
    /* Style minimal : le theme (theme.css) definit deja les cartes, les
       badges et la mise en page. On n'ajoute QUE l'effet "deck de cartes"
       et les badges de niveau, sans ecraser le theme. */
    .view-mode-toggle { display:flex; align-items:center; gap:8px; padding:8px 0 12px 0; font-size:.85rem; color:var(--kf-acid); flex-wrap:wrap; }
    .view-mode-label { font-weight:800; text-transform:uppercase; letter-spacing:.1em; opacity:.8; }
    .view-btn { background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.2); color:var(--kf-bone); border-radius:10px; padding:6px 12px; cursor:pointer; font-size:.8rem; font-weight:700; }
    .view-btn.active { background:var(--kf-acid); color:var(--kf-void); border-color:var(--kf-acid); box-shadow:0 0 16px rgba(216,255,62,.4); }
    .view-btn:hover { background:rgba(255,255,255,.14); }

    /* Deck de cartes : les cartes se chevauchent legerement et sont legerement
       inclinees, comme des cartes a jouer dans une main. */
    .reader-card { margin-left:-16px; transform:rotate(var(--rot,0deg)); transform-origin:center bottom; z-index:1; }
    .reader-card:first-child { margin-left:0; }
    .reader-card:hover { transform:rotate(0deg) scale(1.04); z-index:10; margin-left:0; margin-right:-4px; }
    .reader-track::-webkit-scrollbar { height:6px; }
    .reader-track::-webkit-scrollbar-thumb { background:rgba(255,255,255,.18); border-radius:99px; }

    .badge-tier { color:var(--kf-void)!important; font-weight:800; }
    .badge-popular { background:var(--kf-acid)!important; color:var(--kf-void)!important; }
    .badge-populace { background:#27d17f!important; color:#001a1a!important; }
    .badge-delivery { background:#1e6bff!important; color:#fff!important; font-size:.58rem; }
  `;
  (document.head || document.documentElement).appendChild(s);
}

// ============ RESILIENCE ============
// Erreur bloquante : banniere discrete (le catalogue reste affiche),
// jamais d'overlay plein ecran qui masquerait la boutique.
function showFatalBanner(err){
  try{
    let b=document.getElementById('kf-error-banner');
    if(!b){
      b=document.createElement('div');
      b.id='kf-error-banner';
      b.style.cssText='position:fixed;left:8px;right:8px;bottom:8px;z-index:9999;background:rgba(20,8,8,.96);color:#ffd7d7;border:1px solid rgba(255,90,90,.5);border-radius:12px;padding:10px 12px;font:600 12px/1.45 system-ui,sans-serif;display:flex;gap:10px;align-items:center;justify-content:space-between;box-shadow:0 12px 40px rgba(0,0,0,.6)';
      var msg=document.createElement('span');
      msg.textContent='Chargement partiel — '+(err&&err.message?err.message:'erreur inconnue');
      var btn=document.createElement('button');
      btn.textContent='Recharger';
      btn.style.cssText='flex:0 0 auto;background:#ffd23f;color:#1a1400;border:0;border-radius:8px;padding:8px 12px;font-weight:800;cursor:pointer';
      btn.onclick=function(){ location.reload(); };
      b.appendChild(msg); b.appendChild(btn);
      document.body.appendChild(b);
    }
  }catch(e){ /* rien de plus a faire */ }
}

// Garde globale : une erreur non geree ne doit pas laisser la page noire.
window.addEventListener('error',function(ev){
  console.error('[KiffTech] erreur globale:',ev.message);
  showFatalBanner({message:ev.message});
});
window.addEventListener('unhandledrejection',function(ev){
  console.error('[KiffTech] promesse rejetee:',ev.reason);
});

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
      if (rayon) {
        requestedRayon = rayon;
        if (products.some(p => p.category === rayon)) activeCategory = rayon;
      }
      const sort = params.get('sort');
      if (sort && ['brand', 'price-asc', 'price-desc'].includes(sort)) activeSort = sort;
      const era = params.get('era');
      if (era && ['retro', 'modern'].includes(era)) activeEra = era;
    } catch (e) { console.warn('[KiffTech] rayon param ignoré:', e.message); }
    console.log('[KiffTech] products assigned, length:', products.length);
    products.forEach(p => { if (!p.kifftech) p.kifftech = calcKiffTechPrice(p.price.official); });
    viewMode = getViewMode();
    filteredProducts = [...products];
    const restoredCart = restoreCart();
    console.log('[KiffTech] filteredProducts assigned, length:', filteredProducts.length);

    injectCardStyle();
    renderFilters();
    console.log('[KiffTech] renderFilters done');
    renderRayons();
    console.log('[KiffTech] renderRayons done');
    refreshKiffTechPrices();
    console.log('[KiffTech] refreshKiffTechPrices done');
    renderHero();
    applyFilters();
    console.log('[KiffTech] applyFilters done');
    loadProducts();
    console.log('[KiffTech] loadProducts called');
    // Garde-fou : si le lecteur reste vide (cache ancien, JSON indisponible),
    // on le signale au lieu d'afficher une page noire.
    setTimeout(function(){
      const track=document.getElementById('reader-track');
      const grid=document.getElementById('products-grid');
      const empty=(track&&track.children&&!track.children.length)||(grid&&grid.children&&!grid.children.length);
      if(empty&&!document.getElementById('kf-empty-note')){
        const n=document.createElement('div');
        n.id='kf-empty-note';
        n.style.cssText='margin:10px 0;padding:12px 14px;border:1px solid rgba(255,210,63,.35);background:rgba(255,210,63,.08);color:#ffd23f;border-radius:12px;font:600 13px/1.5 system-ui,sans-serif';
        n.textContent='Catalogue en cours de rechargement… Si la liste reste vide, vide le cache du site (⚙︎ en bas à droite) puis recharge.';
        (track||grid||document.body).appendChild(n);
      }
    }, 6000);
    loadPartnerProducts();
    loadShopifyProducts();
    initEvents();
    console.log('[KiffTech] initEvents done');
    // Ouverture directe de la caisse via l'ancre #caisse (liens depuis les rayons)
    try {
      if ((window.location.hash || '').replace('#', '') === 'caisse') {
        setTimeout(() => { if (typeof openCaisse === 'function') openCaisse(); }, 350);
      }
    } catch (e) {}
    initParticles();
    console.log('[KiffTech] initParticles done');
    updateSubUI();
    updateCartPanel();
    updateCartBadge();
    if (restoredCart) toast('Caisse restaurée','info');
    console.log('[KiffTech] updateSubUI done');
    console.log('KiffTech initialized, products:', products.length);
    console.log('[KiffTech] init() completed successfully');
  } catch(e) {
    console.error('[KiffTech] init() ERROR:', e);
    showFatalBanner(e);
  }
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

window.KiffTech={products:()=>products,fetch:loadProducts,subscribe:()=>{userContext.isSubscriber=!userContext.isSubscriber;userContext.tenureDays=userContext.isSubscriber?30:0;refreshKiffTechPrices();renderProducts();updateSubUI();}};