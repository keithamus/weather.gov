// Mock file for fetching example alert data
const ALERT_DATA = {
  "@id":
    "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.5581b39effaba4888f4ad6fb1473ef4eb0aec059.001.2",
  "@type": "wx:Alert",
  affectedZones: [
    "https://api.weather.gov/zones/forecast/AKZ317",
    "https://api.weather.gov/zones/forecast/AKZ318",
    "https://api.weather.gov/zones/forecast/AKZ319",
    "https://api.weather.gov/zones/forecast/AKZ320",
    "https://api.weather.gov/zones/forecast/AKZ321",
    "https://api.weather.gov/zones/forecast/AKZ322",
    "https://api.weather.gov/zones/forecast/AKZ323",
    "https://api.weather.gov/zones/forecast/AKZ324",
    "https://api.weather.gov/zones/forecast/AKZ325",
    "https://api.weather.gov/zones/forecast/AKZ326",
    "https://api.weather.gov/zones/forecast/AKZ327",
    "https://api.weather.gov/zones/forecast/AKZ328",
    "https://api.weather.gov/zones/forecast/AKZ329",
    "https://api.weather.gov/zones/forecast/AKZ330",
    "https://api.weather.gov/zones/forecast/AKZ331",
    "https://api.weather.gov/zones/forecast/AKZ332",
  ],
  areaDesc:
    "Grand Portage to Grand Marais MN; Grand Marais to Taconite Harbor MN; Taconite Harbor to Silver Bay Harbor MN",
  category: "Met",
  certainty: "Likely",
  description:
    "* WHAT...For the Small Craft Advisory, northwest winds 15 to 20 kt\nwith local gusts up to 35 kt and waves 2 to 4 ft. For the Gale\nWarning, northwest winds 15 to 20 kt with gusts up to 35 kt and\nwaves 2 to 5 ft expected.\n\n* WHERE...Grand Portage to Grand Marais MN, Grand Marais to\nTaconite Harbor MN and Taconite Harbor to Silver Bay Harbor MN.\n\n* WHEN...For the Small Craft Advisory, until 8 PM CST this\nevening. For the Gale Warning, from 8 PM this evening to 4 AM\nCST Saturday.\n\n* IMPACTS...Strong winds will cause hazardous waves which could\ncapsize or damage vessels and reduce visibility.",
  effective: "2024-11-29T09:36:00-06:00",
  ends: "2024-11-30T04:00:00-06:00",
  event: "Gale Warning",
  expires: "2024-11-29T21:45:00-06:00",
  geocode: {
    SAME: ["091140", "091141", "091142"],
    UGC: ["LSZ140", "LSZ141", "LSZ142"],
  },
  headline:
    "Gale Warning issued November 29 at 9:36AM CST until November 30 at 4:00AM CST by NWS Duluth MN",
  id: "urn:oid:2.49.0.1.840.0.5581b39effaba4888f4ad6fb1473ef4eb0aec059.001.2",
  instruction:
    "Mariners should alter plans to avoid these hazardous conditions.\nRemain in port, seek safe harbor, alter course, and/or secure the\nvessel for hazardous conditions.",
  messageType: "Alert",
  onset: "2024-11-29T20:00:00-06:00",
  parameters: {
    AWIPSidentifier: ["MWWDLH"],
    BLOCKCHANNEL: ["EAS", "NWEM", "CMAS"],
    NWSheadline: [
      "SMALL CRAFT ADVISORY NOW IN EFFECT UNTIL 8 PM CST THIS EVENING... ...GALE WARNING IN EFFECT FROM 8 PM THIS EVENING TO 4 AM CST SATURDAY",
    ],
    VTEC: ["/O.NEW.KDLH.GL.W.0029.241130T0200Z-241130T1000Z/"],
    WMOidentifier: ["WHUS73 KDLH 291536"],
    eventEndingTime: ["2024-11-30T10:00:00+00:00"],
  },
  references: [],
  response: "Avoid",
  sender: "w-nws.webmaster@noaa.gov",
  senderName: "NWS Duluth MN",
  sent: "2024-11-29T09:36:00-06:00",
  severity: "Moderate",
  status: "Actual",
  urgency: "Expected",
};

const wait = async (mils) => {
  return new Promise(resolve => {
    setTimeout(resolve, mils);
  });
};

export default async function fetchData(){
  await wait(600);
  const response = await fetch("/output.json");
  const data = await response.json();
  const centroid = turf.centroid(data);
  return Object.assign({}, ALERT_DATA, { geometry: data, centroid });
};
