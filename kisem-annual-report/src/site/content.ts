// Fixed page content: scope, instruments, team and partners.

export const APPLY_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfeadTKCwRTvHE4xfaucn2SZ8SN00jFp-2lOI_qiD4C9Jfziw/viewform';
// Awareness workshops held under the programme (not in the master sheet). Shown as "58+".
export const WORKSHOPS_CONDUCTED = 58;
export const REPORT_PDF = '/KISEM-Annual-Report-2025-26.pdf';
export const CONTACT = {
  address: 'IIT Gandhinagar, Palaj, Gandhinagar, Gujarat 382055',
  mapUrl: 'https://maps.google.com/?q=IIT+Gandhinagar+Palaj+Gandhinagar+Gujarat+382055',
  email: 'iea@iitgn.ac.in',
  phone: '+91 90337 98820',
  tel: '+919033798820',
};

const SCOPE_ICONS = [
  'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3.3.3 2 1.5 3 2.5 3.3z',
  'M12 2v20M17 5l-5 5-5-5M17 19l-5-5-5 5M2 12h20M5 7l5 5-5 5M19 7l-5 5 5 5',
  'M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2M17.5 8a2.5 2.5 0 1 1 2 4H2',
  'M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z',
  'M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5S12.5 5.7 12 3c-.5 2.7-2 5-4 6.5S5 13 5 15a7 7 0 0 0 7 7z',
  'M4 4h16v6H4zM6 14h12v6H6zM10 10v4M14 10v4',
  'M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 3v3M12 12v9M3 12h3M18 12h3',
  'M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z',
  'M22 12h-4l-3 9L9 3l-3 9H2',
  'M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  'M17.7 7.7A2.5 2.5 0 1 1 19.5 12H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2',
  'M2 9h20M2 15h20M6 9v6M18 9v6',
  'M11 5L6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14',
  'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20',
  'M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6M12 2v2M12 14v8M5 21h14M19 4l-2.5 2.5M5 4l2.5 2.5',
  'M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5',
];

export const SCOPE = ([
  ['Electrical systems', 'Transformers, motors, power factor, DG sets'], ['Thermal systems', 'Boilers, thermic fluid heaters, furnaces'], ['Refrigeration', 'Ammonia and freon systems, chillers, cold storage'],
  ['Compressed air', 'Compressors, leakage, pressure optimisation'], ['Solar PV', 'Generation, performance ratio, shading'], ['Pumping systems', 'Pump efficiency, piping losses, flow'],
  ['Process heat', 'Steam systems, insulation, heat exchangers'], ['HVAC and ventilation', 'AHUs, cooling towers, fans'], ['Lighting', 'LED retrofit, daylight, controls'],
  ['Power quality', 'Harmonics, power factor, voltage stability'], ['Thermal imaging', 'Hot spots, insulation gaps, electrical faults'], ['Flue gas analysis', 'Combustion efficiency, excess air, stack losses'],
  ['Flow measurement', 'Air, water, steam and fuel flow'], ['Acoustic imaging', 'Compressed air leaks, ultrasonic detection'], ['GHG accounting', 'Scope 1, 2 and 3 emissions inventory'],
  ['Variable speed drives', 'Drive opportunities, motor sizing, load profiles'], ['Waste heat recovery', 'Heat exchangers, ORC, economisers'],
] as const).map(([name, what], i) => ({ n: String(i + 1).padStart(2, '0'), name, what, d: SCOPE_ICONS[i] }));

export const INSTRUMENTS = [
  { d: 'M2 12h4l3-8 4 16 3-8h6', img: '/instruments/Power Quality Study.png', webp: '/instruments/webp/Power Quality Study.webp', alt: 'Power quality analysers: Hioki, Krykard ALM and other Class A loggers', name: 'Power quality analyser', models: 'Hioki PQ3198 · Krykard ALM-45/36/31/20', what: 'Class A to IEC 61000-4-30. Harmonics, transients, dips and swells, inrush current and flicker.' },
  { d: 'M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0z', img: '/instruments/Thermal Imager.png', webp: '/instruments/webp/Thermal Imager.webp', alt: 'Thermal imaging cameras: Testo, Fluke and Raytek', name: 'Thermal imaging camera', models: 'Testo T-883/T-872 · Fluke TC01A · Raytek', what: '320 × 240 infrared, −30 °C to 650 °C, for panels, insulation and mechanical systems. Pyrometer for molten metal up to 2000 °C.' },
  { d: 'M8 21h8M12 21v-4M7 4h10l-1 9a4 4 0 0 1-8 0zM9 8h6', img: '/instruments/Flue Gas Analysis.png', webp: '/instruments/webp/Flue Gas Analysis.webp', alt: 'Kane flue gas analysers with high-temperature probe', name: 'Flue gas analyser', models: 'Kane K988 with 1250 °C probe · K958', what: 'O₂, CO, CO₂, NO, NO₂, SO₂, H₂S and hydrocarbons together, for combustion efficiency.' },
  { d: 'M11 5L6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14', img: '/instruments/Acoustic Leakage Detection.png', webp: '/instruments/webp/Acoustic Leakage Detection.webp', alt: 'Acoustic leak detector and compressed air flow meters', name: 'Acoustic leak and flow detection', models: 'Testo LD Pro · VP Flow PN16 · Lutron GS-5800 · Extech RD300', what: 'Finds compressed air and refrigerant leaks by ultrasound, and measures air flow, pressure and temperature on the network.' },
  { d: 'M3 10h18l-2 10H5zM12 10v10M4 15h16M12 2v3M5 5l1.5 1.5M19 5l-1.5 1.5', img: '/instruments/Detailed Solar PV Analysis.png', webp: '/instruments/webp/Detailed Solar PV Analysis.webp', alt: 'Solar DC power analyser, irradiance meter and temperature logger', name: 'Solar PV analysis', models: 'Solar DC power analyser · irradiance meter · temperature and humidity logger', what: 'Module and inverter efficiency, performance ratio, and the losses from heat, shading, soiling and cabling.' },
  { d: 'M2 9h20M2 15h20M7 9v6M17 9v6M10 12h4', img: '/instruments/Fluid Flow Measurment.png', webp: '/instruments/webp/Fluid Flow Measurment.webp', alt: 'Endress+Hauser clamp-on ultrasonic flow meter', name: 'Ultrasonic flow meter', models: 'Endress+Hauser', what: 'Clamp-on transit-time flow measurement, without cutting the pipe or stopping the process.' },
];

type Person = { role: string; name: string; title: string; email: string; photo: string };
const p = (role: string, name: string, title: string, email: string, photo: string): Person => ({ role, name, title, email, photo: '/team/' + photo });

export const TEAMS: { label: string; people: Person[] }[] = [
  { label: 'Associated faculty', people: [
    p('Project coordinator', 'Dr. Naran Pindoriya', 'Project Coordinator, IITGN-KISEM', 'naran@iitgn.ac.in', 'Dr. Naran Pindoriya.png'),
    p('Faculty', 'Dr. Chinmay Ghoroi', 'B. S. Gelot Chair Professor', 'chinmayg@iitgn.ac.in', 'Dr. Chinmay Ghoroi.png'),
    p('Faculty', 'Mr. S. Rajendran', 'Associate Teaching Professor', 'rajendran@iitgn.ac.in', 'Mr. S. Rajendran.png'),
    p('Faculty', 'Dr. Atul Bhargav', 'Professor', 'atul.bhargav@iitgn.ac.in', 'Dr. Atul Bhargav.png'),
  ] },
  { label: 'Field and audit team', people: [
    p('Lead energy auditor', 'Mr. Rahul Patel', 'Project Manager-II', 'rahuljayantibhai.p@iitgn.ac.in', 'Mr. Rahul Patel.png'),
    p('Energy manager', 'Mr. Abhay Singh Maurya', 'Project Fellow', 'abhay.maurya@iitgn.ac.in', 'Mr Abhay Singh Maurya (console).jpg'),
    p('Electrical expert', 'Mr. Md Faizan', 'Project Fellow', 'md.faizan@iitgn.ac.in', 'Md. Faizan.png'),
    p('Thermal expert', 'Mr. Sagar Loriya', 'Project Assistant-III', 'loriyasagar.b@iitgn.ac.in', 'Mr Sagar Loriya (console).jpg'),
    p('Solar expert', 'Mr. Dhruvit Patel', 'Project Assistant-I', 'dhruvit.patel@iitgn.ac.in', 'Mr Dhruvit Patel (console).jpg'),
    p('AI automation', 'Mr. Rishabh Dangi', 'Project Assistant-I', 'rishabh.dangi@iitgn.ac.in', 'Mr Rishabh Dangi (console).jpg'),
  ] },
];

export const PARTNERS = [
  { name: 'Kotak Mahindra Bank', role: 'CSR funder', logo: '/download.png' },
  { name: 'IIT Madras / IEAC', role: 'Knowledge partner', logo: '/kotak_iit_madras_save_energy_mission_logo.jpg' },
  { name: 'GEDA', role: 'Gujarat state partner', logo: '/geda logo.jpg' },
  { name: 'WRI India', role: 'Research partner', logo: '/WRI-India-Logo.png' },
  { name: 'Ministry of MSME', role: 'Programme alignment', logo: '' },
];

// "How we measure" photo collage. Placeholder photos from Wikimedia Commons (credited below the
// collage, as their licences ask); swap in the team's own field photos by replacing the files in
// public/field/ with the same names, and remove the credit then.
export const FIELD_PHOTOS = [
  { slug: 'thermal', title: "Thermal imaging", what: "Hot spots in panels, insulation and steam lines", credit: "Asurnipal, CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Flir_E8-Thermal_imaging_camera-Thermographic_camera-03ASD.jpg" },
  { slug: 'transformer', title: "Transformers and incomers", what: "Loading, losses and power quality at the supply", credit: "Antti Leppänen, CC BY 4.0", source: "https://commons.wikimedia.org/wiki/File:Muurame_electrical_substation_transformer.jpg" },
  { slug: 'cooling', title: "Cooling towers and chillers", what: "Approach, range and kW per ton of cooling", credit: "Cenk Endustri, CC BY-SA 3.0", source: "https://commons.wikimedia.org/wiki/File:Cenk_Endustri_Field_Erected_Industrial_Cooling_Tower.JPG" },
  { slug: 'machine-hall', title: "Machine halls", what: "Motor loading, belts and drive opportunities", credit: "Eebie, CC BY 4.0", source: "https://commons.wikimedia.org/wiki/File:Compressor_room_Coal_Mine_Winterslag_Genk_Belgium.jpg" },
  { slug: 'compressor', title: "Compressed air", what: "Free air delivery, load and unload, and leaks", credit: "Work With Sounds, CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Air_compressor_in_engine_room.JPG" },
  { slug: 'boiler-house', title: "Boiler house", what: "Combustion efficiency and heat lost from surfaces", credit: "Brylie Oxley, CC BY-SA 3.0", source: "https://commons.wikimedia.org/wiki/File:FI-Tampere-20131013_152957_HDR.JPG" },
  { slug: 'rooftop-solar', title: "Rooftop solar", what: "Performance ratio and where the energy is lost", credit: "HokuroN, CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Hatil_rooftop_solar_panels.jpg" },
  { slug: 'solar-array', title: "PV array inspection", what: "Soiling, shading and module health", credit: "Ayman Nakib Badhan, CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Powering_Progress.jpg" },
];
