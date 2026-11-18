export type MemberCategory = 'regular' | 'special' | 'homeroom_teacher';

export interface ClassMember {
  id: number;
  memberKey: string;
  attendanceNumber: number | null; // 1..25 for students, null for homeroom teacher
  badgeLabel: string;
  category: MemberCategory;
  name: string;
  nickname: string;
  role: string;
  minat: string;
  quote: string;
  futureGoal: string;
  favoriteMemory: string;
  instagram?: string;
  subject?: string;
  thanksMessage?: string;
  photoUrl: string;
  x: number;
  y: number;
  rotate: number;
}

export const DESK_WIDTH = 2600;
export const DESK_HEIGHT = 1700;

interface BaseMemberInput {
  id: number;
  memberKey: string;
  attendanceNumber: number | null;
  badgeLabel: string;
  category: MemberCategory;
  name: string;
  nickname: string;
  role: string;
  minat: string;
  quote: string;
  futureGoal: string;
  favoriteMemory: string;
  instagram?: string;
  subject?: string;
  thanksMessage?: string;
  photoUrl?: string;
}

const RAW_MEMBERS: BaseMemberInput[] = [
  // ==========================================
  // 22 MURID REGULER (#01 - #22)
  // ==========================================
  {
    id: 1,
    memberKey: 'member-01',
    attendanceNumber: 1,
    badgeLabel: '#01',
    category: 'regular',
    name: 'Afni Damayanti',
    nickname: 'Afni',
    role: 'Anggota · Frontend Enthusiast',
    minat: 'Frontend Developer',
    quote: 'Setiap baris CSS yang berantakan selalu punya jalan menuju tampilan yang rapi, sama seperti cerita kita di kelas.',
    futureGoal: 'UI/Frontend Engineer & Pengusaha Kreatif',
    favoriteMemory: 'Begadang menyusun layout proyek web sambil berbagi camilan di lab komputer.',
    instagram: '@afni.damayanti',
  },
  {
    id: 2,
    memberKey: 'member-02',
    attendanceNumber: 2,
    badgeLabel: '#02',
    category: 'regular',
    name: 'Akbar Karim Adang',
    nickname: 'Akbar',
    role: 'Anggota · Backend Explorer',
    minat: 'Backend Developer',
    quote: 'Server bisa down kapan saja, tapi solidaritas XII PPLG 3 selalu online 24 jam.',
    futureGoal: 'Backend Architect & Cloud Specialist',
    favoriteMemory: 'Diskusi seru mencari bug API menjelang jam pulang praktikum.',
    instagram: '@akbarkarim.dev',
  },
  {
    id: 3,
    memberKey: 'member-03',
    attendanceNumber: 3,
    badgeLabel: '#03',
    category: 'regular',
    name: 'Ali Abdillah Mutawab',
    nickname: 'Ali',
    role: 'Anggota · Full-Stack Builder',
    minat: 'Full-Stack Web',
    quote: 'Jangan takut error di baris pertama; justru dari sanalah kita belajar memahami cara kerja sistem.',
    futureGoal: 'Software Engineer & Tech Founder',
    favoriteMemory: 'Kemah pramuka malam hari dan tawa bersama di lapangan madrasah.',
    instagram: '@ali.mutawab',
  },
  {
    id: 4,
    memberKey: 'member-04',
    attendanceNumber: 4,
    badgeLabel: '#04',
    category: 'regular',
    name: 'Alif Firmansyah Prenje',
    nickname: 'Alif',
    role: 'Anggota · Game Crafter',
    minat: 'Game Development',
    quote: 'Hidup ini seperti level game: makin tinggi tantangannya, makin berharga pencapaiannya.',
    futureGoal: 'Indie Game Developer',
    favoriteMemory: 'Uji coba prototipe gim kelas di lab komputer bersama teman-teman.',
    instagram: '@alif.prenje',
  },
  {
    id: 5,
    memberKey: 'member-05',
    attendanceNumber: 5,
    badgeLabel: '#05',
    category: 'regular',
    name: 'Aziza Ony Badu',
    nickname: 'Aziza',
    role: 'Anggota · Visual Designer',
    minat: 'UI/UX Design',
    quote: 'Desain terbaik bukan hanya soal warna yang cantik, tapi rasa nyaman yang tertinggal di ingatan.',
    futureGoal: 'Product Designer',
    favoriteMemory: 'Merancang poster classmeet dan berfoto bersama sepulang praktikum PWPB.',
    instagram: '@aziza.ony',
  },
  {
    id: 6,
    memberKey: 'member-06',
    attendanceNumber: 6,
    badgeLabel: '#06',
    category: 'regular',
    name: 'Bani Wahdiani',
    nickname: 'Bani',
    role: 'Anggota · Data Steward',
    minat: 'Database Administration',
    quote: 'Relasi tabel boleh kompleks, asal relasi pertemanan kita tetap terhubung tanpa broken link.',
    futureGoal: 'Database & Data Engineer',
    favoriteMemory: 'Belajar relasi SQL bersama sambil bercanda di barisan tengah kelas.',
    instagram: '@baniwahdiani',
  },
  {
    id: 7,
    memberKey: 'member-07',
    attendanceNumber: 7,
    badgeLabel: '#07',
    category: 'regular',
    name: 'Babby Aulia Maharani',
    nickname: 'Babby',
    role: 'Bendahara Kelas',
    minat: 'Frontend Developer',
    quote: 'Mengurus uang kas kelas mengajarkan ketelitian; bersamamu di PPLG 3 mengajarkan kehangatan.',
    futureGoal: 'Web Developer & FinTech Specialist',
    favoriteMemory: 'Menagih uang kas sambil tertawa lalu langsung membeli kejutan balon kelas.',
    instagram: '@babby.maharani',
  },
  {
    id: 8,
    memberKey: 'member-08',
    attendanceNumber: 8,
    badgeLabel: '#08',
    category: 'regular',
    name: 'Dian Safitri Syarif',
    nickname: 'Dian',
    role: 'Anggota · Systems Analyst',
    minat: 'Financial IT & Systems',
    quote: 'Ketekunan kecil setiap hari jauh lebih kuat daripada semangat yang hanya menyala sesaat.',
    futureGoal: 'IT Auditor & Business Analyst',
    favoriteMemory: 'Momen Idul Adha kelas 10 dan kerja bakti membersihkan kelas bersama.',
    instagram: '@diansyafitri.s',
  },
  {
    id: 9,
    memberKey: 'member-09',
    attendanceNumber: 9,
    badgeLabel: '#09',
    category: 'regular',
    name: 'Farisul Fahmi',
    nickname: 'Fahmi',
    role: 'Anggota · Cloud & DevOps',
    minat: 'DevOps & Cloud',
    quote: 'Deploy sukses di percobaan pertama itu langka, sama langkanya dengan kekompakan kelas kita.',
    futureGoal: 'Site Reliability & Cloud Engineer',
    favoriteMemory: 'Mengatur kabel jaringan lab dan foto bersama memakai seragam wearpack.',
    instagram: '@farisul.fahmi',
  },
  {
    id: 10,
    memberKey: 'member-10',
    attendanceNumber: 10,
    badgeLabel: '#10',
    category: 'regular',
    name: 'Hafiza Aulia Ibrahim',
    nickname: 'Hafiza',
    role: 'Anggota · System Thinker',
    minat: 'System Analyst & Web',
    quote: 'Waktu kelas XII berlalu begitu cepat, tapi setiap tawa di pojok kelas akan selalu punya tempat.',
    futureGoal: 'Software Project Manager',
    favoriteMemory: 'Persiapan lomba antar kelas dan diskusi santai sebelum ujian praktik.',
    instagram: '@hafiza.aulia',
  },
  {
    id: 11,
    memberKey: 'member-11',
    attendanceNumber: 11,
    badgeLabel: '#11',
    category: 'regular',
    name: 'Hania Latif',
    nickname: 'Hania',
    role: 'Anggota · Mobile Creator',
    minat: 'Mobile App Developer',
    quote: 'Dari layar kecil ponsel hingga layar besar proyeksi kelas, semua berawal dari berani mencoba.',
    futureGoal: 'Android & Flutter Engineer',
    favoriteMemory: 'Foto kelas di koridor sekolah saat Hari Pahlawan dan Hari Guru.',
    instagram: '@hania.latif',
  },
  {
    id: 12,
    memberKey: 'member-12',
    attendanceNumber: 12,
    badgeLabel: '#12',
    category: 'regular',
    name: 'Inayah',
    nickname: 'Inayah',
    role: 'Anggota · Quality Guardian',
    minat: 'Quality Assurance & Web',
    quote: 'Menemukan detail kecil yang luput membuat karya kita lebih berarti—begitu pula perhatian ke sahabat.',
    futureGoal: 'QA Lead & Web Specialist',
    favoriteMemory: 'Saling membantu menguji tugas web kelompok sebelum dikumpulkan.',
    instagram: '@inayah.pplg',
  },
  {
    id: 13,
    memberKey: 'member-13',
    attendanceNumber: 13,
    badgeLabel: '#13',
    category: 'regular',
    name: 'Kholid Usman Abdul salam',
    nickname: 'Kholid',
    role: 'Anggota · Cyber Defender',
    minat: 'Cyber Security & Networks',
    quote: 'Jaga password-mu tetap kuat, dan jaga persahabatan kita tetap erat sampai kapan pun.',
    futureGoal: 'Cyber Security Analyst',
    favoriteMemory: 'Praktikum konfigurasi server dan suasana santai bersama teman sebangku.',
    instagram: '@kholid.sec',
  },
  {
    id: 14,
    memberKey: 'member-14',
    attendanceNumber: 14,
    badgeLabel: '#14',
    category: 'regular',
    name: 'Laila Mulyani',
    nickname: 'Laila',
    role: 'Anggota · Web Stylist',
    minat: 'Web Design',
    quote: 'Kenangan tidak menunggu kita siap; ia tercipta di sela-sela tugas, hujan, dan obrolan sederhana.',
    futureGoal: 'Creative Technologist & Web Designer',
    favoriteMemory: 'Malam api unggun pramuka bersama mama angkat dan jalan santai di pantai.',
    instagram: '@lailamulyani_',
  },
  {
    id: 15,
    memberKey: 'member-15',
    attendanceNumber: 15,
    badgeLabel: '#15',
    category: 'regular',
    name: 'Muhammad Rafsyan',
    nickname: 'Rafsyan',
    role: 'Anggota · Logic Craftsman',
    minat: 'Backend Developer',
    quote: 'Sedikit bicara, banyak commit. Terima kasih XII PPLG 3 untuk tiga tahun yang luar biasa.',
    futureGoal: 'Systems & Backend Software Engineer',
    favoriteMemory: 'Duel logika algoritma di papan tulis dan sorak sorai kemenangan classmeet.',
    instagram: '@rafsyan.code',
  },
  {
    id: 16,
    memberKey: 'member-16',
    attendanceNumber: 16,
    badgeLabel: '#16',
    category: 'regular',
    name: 'Mufidah Abdi Rasti',
    nickname: 'Mufidah',
    role: 'Anggota · 3D & Art Designer',
    minat: '3D Game Asset & Art',
    quote: 'Setiap sketsa yang penuh coretan adalah bukti bahwa kita terus bertumbuh menjadi lebih baik.',
    futureGoal: '3D Technical Artist & Animator',
    favoriteMemory: 'Menggambar karakter gim saat jam kosong bersama barisan belakang.',
    instagram: '@mufidah.art',
  },
  {
    id: 17,
    memberKey: 'member-17',
    attendanceNumber: 17,
    badgeLabel: '#17',
    category: 'regular',
    name: 'Muhammad Raihaan Humris',
    nickname: 'Raihaan',
    role: 'Ketua Kelas XII PPLG 3',
    minat: 'Full-Stack & Software Eng.',
    quote: 'Memimpin kelas ini adalah kehormatan terbesar di masa MAKN Ende. Mari bertemu lagi sebagai versi terbaik diri kita.',
    futureGoal: 'Full-Stack Software Engineer & Tech Lead',
    favoriteMemory: 'Menyatukan suara seluruh kelas saat lomba, acara guru, hingga merakit web kenangan ini.',
    instagram: '@raihaanhumris',
  },
  {
    id: 18,
    memberKey: 'member-18',
    attendanceNumber: 18,
    badgeLabel: '#18',
    category: 'regular',
    name: 'Nurmasita Ina Tena',
    nickname: 'Sita',
    role: 'Anggota · Interface Builder',
    minat: 'Frontend Developer',
    quote: 'Bukan seberapa sering kita bertemu nanti, tapi seberapa hangat ingatan saat menyebut nama PPLG 3.',
    futureGoal: 'Frontend Developer & Digital Educator',
    favoriteMemory: 'Momen kebersamaan di ruangan kelas saat merayakan kejutan untuk guru.',
    instagram: '@nurmasita.ina',
  },
  {
    id: 19,
    memberKey: 'member-19',
    attendanceNumber: 19,
    badgeLabel: '#19',
    category: 'regular',
    name: 'Putri Sazqiah',
    nickname: 'Putri',
    role: 'Anggota · UX Researcher',
    minat: 'UI/UX Research',
    quote: 'Mendengarkan cerita teman sekelas adalah riset paling tulus tentang arti kebersamaan.',
    futureGoal: 'UX Researcher & Product Strategist',
    favoriteMemory: 'Bercerita panjang lebar seusai praktikum PWPB bersama Ustadzah Ismi.',
    instagram: '@putrisaqiah',
  },
  {
    id: 20,
    memberKey: 'member-20',
    attendanceNumber: 20,
    badgeLabel: '#20',
    category: 'regular',
    name: 'Salsabila',
    nickname: 'Salsa',
    role: 'Anggota · Gameplay Coder',
    minat: 'Game Programmer',
    quote: 'Meski kelulusan menandai akhir babak sekolah, persaudaraan kita baru saja memulai babak barunya.',
    futureGoal: 'Gameplay & Interactive Simulation Programmer',
    favoriteMemory: 'Tertawa lepas di tepi pantai Ende saat sesi foto kenangan angkatan.',
    instagram: '@salsabila.dev',
  },
  {
    id: 21,
    memberKey: 'member-21',
    attendanceNumber: 21,
    badgeLabel: '#21',
    category: 'regular',
    name: 'Yunitha Olivia Putri',
    nickname: 'Yunitha',
    role: 'Sekretaris Kelas',
    minat: 'Database & Backend',
    quote: 'Semua absen, notulen, dan jadwal piket pernah kucatat; tapi kenangan bersama kalian tercatat di hati.',
    futureGoal: 'Data Systems Engineer',
    favoriteMemory: 'Mengabsen satu per satu nama teman saat pagi sebelum upacara dan kegiatan kelas.',
    instagram: '@yunitha.olivia',
  },
  {
    id: 22,
    memberKey: 'member-22',
    attendanceNumber: 22,
    badgeLabel: '#22',
    category: 'regular',
    name: 'Yusuf',
    nickname: 'Yusuf',
    role: 'Wakil Ketua Kelas',
    minat: 'Mobile & Web Developer',
    quote: 'Dari barisan depan hingga belakang, terima kasih sudah selalu kompak saat senang maupun lelah.',
    futureGoal: 'Mobile Software Engineer',
    favoriteMemory: 'Gotong royong menyiapkan peralatan kelas dan memimpin barisan saat classmeet.',
    instagram: '@yusuf.pplg3',
  },

  // ==========================================
  // 3 MURID SPESIAL TAK TERLUPAKAN (#23 - #25)
  // ==========================================
  {
    id: 23,
    memberKey: 'member-23',
    attendanceNumber: 23,
    badgeLabel: '#23',
    category: 'special',
    name: 'Anshari Ramadan',
    nickname: 'Anshari',
    role: 'Murid Spesial · Sahabat Seperjuangan',
    minat: 'Masa Awal XII PPLG 3',
    quote: 'Walau langkah sekolah berlanjut di tempat berbeda, namaku dan tawa awal kita tetap milik PPLG 3.',
    futureGoal: 'Sukses di Bidang Teknologi & Karir Impian',
    favoriteMemory: 'Belajar dasar pemrograman bersama di kelas X dan canda tawa penuh keakraban.',
    instagram: '@anshari.rmdn',
  },
  {
    id: 24,
    memberKey: 'member-24',
    attendanceNumber: 24,
    badgeLabel: '#24',
    category: 'special',
    name: 'Muhammad Akbar Lafitriansyah',
    nickname: 'Akbar L.',
    role: 'Murid Spesial · Sahabat Seperjuangan',
    minat: 'Masa Awal XII PPLG 3',
    quote: 'Jarak antar sekolah tidak pernah mengurangi arti persahabatan yang pernah kita bangun bersama.',
    futureGoal: 'Teknisi & Profesional IT Handal',
    favoriteMemory: 'Kebersamaan di sela jam praktikum lab komputer dan obrolan hangat waktu istirahat.',
    instagram: '@akbar.lafitriansyah',
  },
  {
    id: 25,
    memberKey: 'member-25',
    attendanceNumber: 25,
    badgeLabel: '#25',
    category: 'special',
    name: 'Yuyun Anggaraini Adelia Hasti',
    nickname: 'Yuyun',
    role: 'Murid Spesial · Sahabat Seperjuangan',
    minat: 'Masa Awal XII PPLG 3',
    quote: 'Terima kasih telah menjaga kursiku di album kenangan ini—kalian selalu menjadi keluarga pertamaku di MAKN Ende.',
    futureGoal: 'Desainer & Kreator Digital Masa Depan',
    favoriteMemory: 'Momen kebersamaan awal angkatan dan cerita hangat bersama teman-teman sekelas.',
    instagram: '@yuyun.adelia',
  },

  // ==========================================
  // 1 WALI KELAS (CENTERPIECE)
  // ==========================================
  {
    id: 26,
    memberKey: 'member-wali',
    attendanceNumber: null,
    badgeLabel: 'WALI KELAS',
    category: 'homeroom_teacher',
    name: 'Ustadzah Dzakirah, S.Pd.',
    nickname: 'Ustadzah Dzakirah',
    role: 'Wali Kelas XII PPLG 3 · Pembimbing Angkatan',
    minat: 'Pendidikan & Pembinaan Karakter',
    quote:
      'Kelas ini bukan hanya ruang mengetik baris kode, melainkan rumah tempat 25 kisah tumbuh bersama. Semoga doa dan ilmu yang kalian bawa selalu menerangi langkah masa depan.',
    futureGoal: 'Melihat Seluruh Anak Didik XII PPLG 3 Sukses & Berakhlak Mulia',
    favoriteMemory:
      'Mendampingi tawa di laboratorium komputer, kebersamaan kemah pramuka, dan doa bersama menuju kelulusan.',
    subject: 'Pembinaan Kelas & Pendampingan Akademik XII PPLG 3',
    thanksMessage:
      'Terima kasih Ustadzah atas kesabaran, nasihat lembut, doa di setiap ujian, dan kasih sayang seperti orang tua kedua bagi kami ber-25 di MAKN Ende.',
  },
];

/**
 * Hash deterministik ringan untuk variasi rotasi (-6deg..+6deg) dan offset meja alami
 * tanpa memicu overlap antarkartu.
 */
function seededUnit(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

/**
 * Generator koordinat meja kerja 2600px x 1700px bebas tumpuk untuk seluruh 26 profil.
 * - Wali Kelas: tengah atas (centerpiece)
 * - 3 Murid Spesial (#23 - #25): zona kehormatan atas-tengah berbentuk lengkungan lembut
 * - 22 Murid Reguler (#01 - #22): tersebar rapi dalam 3 baris grid organik tanpa bertumpukan
 */
export function generateDeskCoordinates(members: BaseMemberInput[]): ClassMember[] {
  const regularMembers = members.filter((m) => m.category === 'regular');
  const specialMembers = members.filter((m) => m.category === 'special');
  const teacherMember = members.find((m) => m.category === 'homeroom_teacher');

  const positioned: ClassMember[] = [];

  // 1. Centerpiece Wali Kelas (tengah atas meja)
  if (teacherMember) {
    positioned.push({
      ...teacherMember,
      photoUrl: teacherMember.photoUrl || '',
      x: 1300,
      y: 205,
      rotate: 0,
    });
  }

  // 2. Tiga Murid Spesial (#23, #24, #25) di area kehormatan atas-tengah
  const specialSlots = [
    { x: 810, y: 525, rotate: -4.2 },
    { x: 1300, y: 580, rotate: 1.4 },
    { x: 1790, y: 525, rotate: 4.1 },
  ];
  specialMembers.forEach((member, idx) => {
    const slot = specialSlots[idx] || { x: 810 + idx * 490, y: 545, rotate: 0 };
    positioned.push({
      ...member,
      photoUrl: member.photoUrl || '',
      x: slot.x,
      y: slot.y,
      rotate: slot.rotate,
    });
  });

  // 3. Dua puluh dua Murid Reguler (#01 - #22) di area utama bawah (3 baris non-overlapping)
  // Baris 1: 8 kartu (#01 - #08), Baris 2: 8 kartu (#09 - #16), Baris 3: 6 kartu (#17 - #22)
  const rowConfigs = [
    { startIndex: 0, count: 8, baseY: 905, startX: 250, stepX: 300 },
    { startIndex: 8, count: 8, baseY: 1215, startX: 250, stepX: 300 },
    { startIndex: 16, count: 6, baseY: 1525, startX: 550, stepX: 300 },
  ];

  rowConfigs.forEach((row) => {
    for (let i = 0; i < row.count; i++) {
      const member = regularMembers[row.startIndex + i];
      if (!member) continue;
      const seedA = seededUnit(member.id * 17 + 3);
      const seedB = seededUnit(member.id * 31 + 7);
      const seedC = seededUnit(member.id * 43 + 11);

      const jitterX = Math.round((seedA - 0.5) * 28); // +/- 14px
      const jitterY = Math.round((seedB - 0.5) * 20); // +/- 10px
      const rawRotate = (seedC - 0.5) * 11.6; // -5.8deg .. +5.8deg
      const rotate = Math.round(rawRotate * 10) / 10;

      positioned.push({
        ...member,
        photoUrl: member.photoUrl || '',
        x: row.startX + i * row.stepX + jitterX,
        y: row.baseY + jitterY,
        rotate,
      });
    }
  });

  return positioned;
}

export const classMembers: ClassMember[] = generateDeskCoordinates(RAW_MEMBERS);

/**
 * Urutan tur sekuensial resmi di meja kenangan:
 * #01 - #22 (Murid Reguler) -> #23 - #25 (Murid Spesial) -> Wali Kelas
 */
export const sequentialMemberOrder: ClassMember[] = [
  ...classMembers
    .filter((m) => m.category === 'regular')
    .sort((a, b) => (a.attendanceNumber || 0) - (b.attendanceNumber || 0)),
  ...classMembers
    .filter((m) => m.category === 'special')
    .sort((a, b) => (a.attendanceNumber || 0) - (b.attendanceNumber || 0)),
  ...classMembers.filter((m) => m.category === 'homeroom_teacher'),
];
