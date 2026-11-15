/**
 * JAKIM prayer-time zones (e-solat codes), bundled so the widget can name a
 * zone without another request. Source: JAKIM via api.waktusolat.app/zones.
 */
export interface SolatZone {
  state: string;
  area: string;
}

export const SOLAT_ZONES: Record<string, SolatZone> = {
  JHR01: { state: 'Johor', area: 'Pulau Aur dan Pulau Pemanggil' },
  JHR02: { state: 'Johor', area: 'Johor Bahru, Kota Tinggi, Mersing, Kulai' },
  JHR03: { state: 'Johor', area: 'Kluang, Pontian' },
  JHR04: { state: 'Johor', area: 'Batu Pahat, Muar, Segamat, Gemas Johor, Tangkak' },
  KDH01: { state: 'Kedah', area: 'Kota Setar, Kubang Pasu, Pokok Sena (Daerah Kecil)' },
  KDH02: { state: 'Kedah', area: 'Kuala Muda, Yan, Pendang' },
  KDH03: { state: 'Kedah', area: 'Padang Terap, Sik' },
  KDH04: { state: 'Kedah', area: 'Baling' },
  KDH05: { state: 'Kedah', area: 'Bandar Baharu, Kulim' },
  KDH06: { state: 'Kedah', area: 'Langkawi' },
  KDH07: { state: 'Kedah', area: 'Puncak Gunung Jerai' },
  KTN01: {
    state: 'Kelantan',
    area: 'Bachok, Kota Bharu, Machang, Pasir Mas, Pasir Puteh, Tanah Merah, Tumpat, Kuala Krai, Mukim Chiku',
  },
  KTN02: {
    state: 'Kelantan',
    area: 'Gua Musang (Daerah Galas Dan Bertam), Jeli, Jajahan Kecil Lojing',
  },
  MLK01: { state: 'Melaka', area: 'SELURUH NEGERI MELAKA' },
  NGS01: { state: 'Negeri Sembilan', area: 'Tampin, Jempol' },
  NGS02: { state: 'Negeri Sembilan', area: 'Jelebu, Kuala Pilah, Rembau' },
  NGS03: { state: 'Negeri Sembilan', area: 'Port Dickson, Seremban' },
  PHG01: { state: 'Pahang', area: 'Pulau Tioman' },
  PHG02: { state: 'Pahang', area: 'Kuantan, Pekan, Muadzam Shah' },
  PHG03: { state: 'Pahang', area: 'Jerantut, Temerloh, Maran, Bera, Chenor, Jengka' },
  PHG04: { state: 'Pahang', area: 'Bentong, Lipis, Raub' },
  PHG05: { state: 'Pahang', area: 'Genting Sempah, Janda Baik, Bukit Tinggi' },
  PHG06: { state: 'Pahang', area: 'Cameron Highlands, Genting Higlands, Bukit Fraser' },
  PHG07: {
    state: 'Pahang',
    area: 'Zon Khas Daerah Rompin, (Mukim Rompin, Mukim Endau, Mukim Pontian)',
  },
  PRK01: { state: 'Perak', area: 'Tapah, Slim River, Tanjung Malim' },
  PRK02: { state: 'Perak', area: 'Kuala Kangsar, Sg. Siput , Ipoh, Batu Gajah, Kampar' },
  PRK03: { state: 'Perak', area: 'Lenggong, Pengkalan Hulu, Grik' },
  PRK04: { state: 'Perak', area: 'Temengor, Belum' },
  PRK05: {
    state: 'Perak',
    area: 'Kg Gajah, Teluk Intan, Bagan Datuk, Seri Iskandar, Beruas, Parit, Lumut, Sitiawan, Pulau Pangkor',
  },
  PRK06: { state: 'Perak', area: 'Selama, Taiping, Bagan Serai, Parit Buntar' },
  PRK07: { state: 'Perak', area: 'Bukit Larut' },
  PLS01: { state: 'Perlis', area: 'SELURUH NEGERI PERLIS' },
  PNG01: { state: 'Pulau Pinang', area: 'SELURUH NEGERI PULAU PINANG' },
  SBH01: {
    state: 'Sabah',
    area: 'Bahagian Sandakan (Timur), Bukit Garam, Semawang, Temanggong, Tambisan, Bandar Sandakan, Sukau',
  },
  SBH02: {
    state: 'Sabah',
    area: 'Beluran, Telupid, Pinangah, Terusan, Kuamut, Bahagian Sandakan (Barat)',
  },
  SBH03: {
    state: 'Sabah',
    area: 'Lahad Datu, Silabukan, Kunak, Sahabat, Semporna, Tungku, Bahagian Tawau (Timur)',
  },
  SBH04: {
    state: 'Sabah',
    area: 'Bandar Tawau, Balong, Merotai, Kalabakan, Bahagian Tawau (Barat)',
  },
  SBH05: { state: 'Sabah', area: 'Kudat, Kota Marudu, Pitas, Pulau Banggi, Bahagian Kudat' },
  SBH06: { state: 'Sabah', area: 'Gunung Kinabalu' },
  SBH07: {
    state: 'Sabah',
    area: 'Kota Kinabalu, Ranau, Kota Belud, Tuaran, Penampang, Papar, Putatan, Bahagian Pantai Barat',
  },
  SBH08: {
    state: 'Sabah',
    area: 'Pensiangan, Keningau, Tambunan, Nabawan, Bahagian Pendalaman (Atas)',
  },
  SBH09: {
    state: 'Sabah',
    area: 'Beaufort, Kuala Penyu, Sipitang, Tenom, Long Pasia, Membakut, Weston, Bahagian Pendalaman (Bawah)',
  },
  SWK01: { state: 'Sarawak', area: 'Limbang, Lawas, Sundar, Trusan' },
  SWK02: { state: 'Sarawak', area: 'Miri, Niah, Bekenu, Sibuti, Marudi' },
  SWK03: { state: 'Sarawak', area: 'Pandan, Belaga, Suai, Tatau, Sebauh, Bintulu' },
  SWK04: {
    state: 'Sarawak',
    area: 'Sibu, Mukah, Dalat, Song, Igan, Oya, Balingian, Kanowit, Kapit',
  },
  SWK05: { state: 'Sarawak', area: 'Sarikei, Matu, Julau, Rajang, Daro, Bintangor, Belawai' },
  SWK06: {
    state: 'Sarawak',
    area: 'Lubok Antu, Sri Aman, Roban, Debak, Kabong, Lingga, Engkelili, Betong, Spaoh, Pusa, Saratok',
  },
  SWK07: { state: 'Sarawak', area: 'Serian, Simunjan, Samarahan, Sebuyau, Meludam' },
  SWK08: { state: 'Sarawak', area: 'Kuching, Bau, Lundu, Sematan' },
  SWK09: { state: 'Sarawak', area: 'Zon Khas (Kampung Patarikan)' },
  SGR01: {
    state: 'Selangor',
    area: 'Gombak, Petaling, Sepang, Hulu Langat, Hulu Selangor, Shah Alam',
  },
  SGR02: { state: 'Selangor', area: 'Kuala Selangor, Sabak Bernam' },
  SGR03: { state: 'Selangor', area: 'Klang, Kuala Langat' },
  TRG01: { state: 'Terengganu', area: 'Kuala Terengganu, Marang, Kuala Nerus' },
  TRG02: { state: 'Terengganu', area: 'Besut, Setiu' },
  TRG03: { state: 'Terengganu', area: 'Hulu Terengganu' },
  TRG04: { state: 'Terengganu', area: 'Dungun, Kemaman' },
  WLY01: { state: 'Wilayah Persekutuan', area: 'Kuala Lumpur, Putrajaya' },
  WLY02: { state: 'Wilayah Persekutuan', area: 'Labuan' },
};

export const DEFAULT_SOLAT_ZONE = 'JHR02';
