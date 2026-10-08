// 產品資料（來源：FIH Product Catelog_Design File.docx）
// specs = 卡片上顯示的重點規格標籤（3~4 個最好看）
const CATEGORIES = {
  TCU: "Telematics",
  HPC: "Computing",
  ZCU: "Zonal Control",
  IVI: "Display",
  ADAS: "ADAS",
  Chassis: "Chassis & Body",
  Security: "Cybersecurity",
  Access: "Digital Access",
};

const PRODUCTS = [
  // --- TCU ---
  {
    name: "TCU with Shark Fin Antenna",
    cat: "TCU",
    img: "assets/products/p02.png?v=20261007q",
    specs: ["4G LTE", "EU eCall", "Wi-Fi", "GNSS + DR"],
    desc: "EU eCall-certified 4G shark-fin TCU integrating cellular, Wi-Fi, GNSS, and fusion/dead-reckoning positioning in an aerodynamic module. Enables cloud services, data exchange, and remote diagnostics.",
  },
  {
    name: "TCU with External Antenna",
    cat: "TCU",
    img: "assets/products/p03.png?v=20261007q",
    specs: ["4G LTE", "EU eCall", "Ethernet AVB", "GNSS + DR"],
    desc: "EU eCall-certified, compact 4G LTE TCU with external antenna design, combining cellular, Wi-Fi, GNSS, and fusion/dead-reckoning positioning, without compromising styling, with Ethernet (AVB) integration.",
  },
  {
    name: "TCU with Shark Fin Antenna",
    cat: "TCU",
    img: "assets/products/p04.png?v=20261007q",
    specs: ["5G", "EU eCall", "Wi-Fi", "GNSS + DR"],
    desc: "EU eCall-certified 5G shark-fin TCU integrating cellular, Wi-Fi, GNSS, and fusion/dead-reckoning positioning in an aerodynamic module. Enables cloud services, data exchange, and remote diagnostics.",
  },
  {
    name: "TCU with Conformal Antenna",
    cat: "TCU",
    img: "assets/products/p05.png?v=20261007q",
    specs: ["5G NR Sub-6", "Wi-Fi 6", "C-V2X", "EU eCall"],
    desc: "EU eCall-certified 5G TCU for conformal antenna designs, combining 5G NR Sub-6, 4G LTE, Wi-Fi 6, GNSS, C-V2X, eCall, radio tuner, and smart access.",
  },
  {
    name: "TCU Lite",
    cat: "TCU",
    img: "assets/products/p06.png?v=20261007q",
    specs: ["4G / 5G", "100Base-T1", "eCall", "OTA"],
    desc: "External-antenna TCU Lite with FIH NAD design, 4G/5G options, 100Base-T1, GNSS, eCall, cybersecurity, and OTA compliance.",
  },
  {
    name: "Modem-only TCU with Antenna",
    cat: "TCU",
    img: "assets/products/p07.png?v=20261007q",
    specs: ["5G RedCap", "GNSS L1+L5", "100Base-T1", "Passive Cooling"],
    desc: "Modem-only TCU delivering essential 5G RedCap or 4G LTE connectivity, GNSS L1+L5, 100Base-T1 Ethernet, and passive cooling.",
  },
  {
    name: "Multi-Modem TCU for L4",
    cat: "TCU",
    img: "assets/products/p08.png?v=20261007q",
    specs: ["Dual 5G", "L4 AD", "C-V2X", "GbE"],
    desc: "High-performance 5G TCU for advanced L4 autonomous driving function for instant safety reporting, with dual 5G redundancy, GNSS, C-V2X, and GbE ports.",
  },
  {
    name: "TCU for 2W",
    cat: "TCU",
    img: "assets/products/p09.png?v=20261007q",
    specs: ["4G / 5G NR", "IP69", "GNSS", "Ethernet"],
    desc: "Compact and rugged TCU for 2-wheeler applications, supporting 4G LTE or 5G NR, GNSS, Ethernet, passive cooling, and IP69 protection.",
  },

  // --- HPC ---
  {
    name: "High-Performance Computing Platform (IVI + ADAS)",
    cat: "HPC",
    img: "assets/products/p12.png?v=20261007q",
    specs: ["IVI + ADAS", "ASIL B/D", "Liquid Cooling", "GSR V2"],
    desc: "Combining IVI and ADAS with wireless Android Auto, Apple CarPlay, Wi-Fi, Bluetooth, radio tuner, and GNSS, while integrating cluster, BCM, security gateway, liquid cooling design, ASIL B/D and GSR V2 compliance.",
  },

  // --- ZCU ---
  {
    name: "Mobile Demo Kit with Dual Modem",
    cat: "ZCU",
    img: "assets/products/p01.png?v=20261007q",
    specs: ["Dual NAD", "ASIL-C/D", "FOTA", "Smart Power"],
    desc: "Portable dual modem and ZCU demo kit for ASIL-C/D redundant control, smart power distribution, secure networking, FOTA, and multistream data transmission via dual NAD.",
  },
  {
    name: "Premium I/O Aggregator (ZCU)",
    cat: "ZCU",
    img: "assets/products/p15.png?v=20261007q",
    specs: ["ASIL B", "CAN FD / LIN", "10Base-T1S", "Ethernet-to-HPC"],
    desc: "Premium ZCU for regional I/O aggregation and power distribution, supporting Ethernet-to-HPC, CAN FD, LIN, 10Base-T1S with RCP, and ASIL B.",
  },

  // --- IVI ---
  {
    name: '15" Tandem OLED Display',
    cat: "IVI",
    img: "assets/products/p10.png?v=20261007q",
    specs: ["2560 × 1600", "800 nit", "100% NTSC", "Tandem OLED"],
    desc: "15-inch dual-layer OLED architecture, 2560 x 1600 resolution, 800 nit, 100% NTSC and wide viewing angle (Contrast > 1000 at 80°).",
  },
  {
    name: '29.5" Tandem OLED Display',
    cat: "IVI",
    img: "assets/products/p11.png?v=20261007q",
    specs: ["5040 × 216", "1000 nit", "100% NTSC", "Tandem OLED"],
    desc: "29.5-inch dual-layer OLED architecture, 5040 x 216 resolution, 1000 nit, 100% NTSC and wide viewing angle (Contrast > 1000 at 80°).",
  },

  // --- ADAS ---
  {
    name: "Eagleye Smart Camera",
    cat: "ADAS",
    img: "assets/products/p14.png?v=20261007q",
    specs: ["8.3 MP", "L2 ADAS", "ASIL B", "HDR"],
    desc: "8.3MP smart camera for vision-only Level 2 ADAS, GSR V2/NCAP, ASIL B, and HDR imaging.",
  },

  // --- OTHER ---
  {
    name: "Active Damping Control Module",
    cat: "Chassis",
    img: "assets/products/p13.png?v=20261007q",
    specs: ["NXP S32K324", "AUTOSAR 4.3", "CAN", "PSI5"],
    desc: "Compact active damping ECU with NXP S32K324, AUTOSAR 4.3, CAN, and PSI5 support for responsive chassis-control applications.",
  },
  {
    name: "Cyber Security Gateway Module",
    cat: "Security",
    img: "assets/products/p16.png?v=20261007q",
    specs: ["Infineon TC377TX", "IDS", "Firewall", "AUTOSAR"],
    desc: "AUTOSAR security gateway with Infineon TC377TX, firewall routing, network mirroring, IDS, and cybersecurity protection.",
  },
  {
    name: "Smart Phone As Access Key",
    cat: "Access",
    img: "assets/products/p17.png?v=20261007q",
    specs: ["CCC", "UWB 802.15.4z/4ab", "BT 6.0 CS"],
    desc: "CCC-compliant digital key solution with UWB 802.15.4z/4ab, Bluetooth 6.0 Channel Sounding, and secure smartphone-based vehicle access.",
  },
  {
    name: "UWB Anchor",
    cat: "Access",
    img: "assets/products/p18.png?v=20261007q",
    specs: ["NXP", "6.5–8.0 GHz UWB", "BLE", "CAN"],
    desc: "Compact UWB anchor with NXP platform, 6.5–8.0GHz UWB, BLE 2.4GHz, CAN, and small-form-factor packaging.",
  },
];
