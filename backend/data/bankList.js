const banks = [
  {
    "nama": "BANK BRI",
    "kode": "002"
  },
  {
    "nama": "BANK BCA",
    "kode": "014"
  },
  {
    "nama": "BANK MANDIRI",
    "kode": "008"
  },
  {
    "nama": "BANK BNI",
    "kode": "009"
  },
  {
    "nama": "BANK BNI SYARIAH",
    "kode": "427"
  },
  {
    "nama": "BANK SYARIAH MANDIRI (BSM)",
    "kode": "451"
  },
  {
    "nama": "BANK CIMB NIAGA",
    "kode": "022"
  },
  {
    "nama": "BANK CIMB NIAGA SYARIAH",
    "kode": "022"
  },
  {
    "nama": "BANK MUAMALAT",
    "kode": "147"
  },
  {
    "nama": "BANK BTPN",
    "kode": "213"
  },
  {
    "nama": "BANK BTPN SYARIAH",
    "kode": "547"
  },
  {
    "nama": "JENIUS",
    "kode": "213"
  },
  {
    "nama": "BANK BRI SYARIAH",
    "kode": "422"
  },
  {
    "nama": "BANK BTN",
    "kode": "200"
  },
  {
    "nama": "BANK PERMATA",
    "kode": "013"
  },
  {
    "nama": "BANK DANAMON",
    "kode": "011"
  },
  {
    "nama": "BANK BII MAYBANK",
    "kode": "016"
  },
  {
    "nama": "BANK MEGA",
    "kode": "426"
  },
  {
    "nama": "BANK SINARMAS",
    "kode": "153"
  },
  {
    "nama": "BANK COMMONWEALTH",
    "kode": "950"
  },
  {
    "nama": "BANK OCBC NISP",
    "kode": "028"
  },
  {
    "nama": "BANK BUKOPIN",
    "kode": "441"
  },
  {
    "nama": "BANK BUKOPIN SYARIAH",
    "kode": "521"
  },
  {
    "nama": "BANK BCA SYARIAH",
    "kode": "536"
  },
  {
    "nama": "BANK LIPPO",
    "kode": "026"
  },
  {
    "nama": "CITIBANK",
    "kode": "031"
  },
  {
    "nama": "INDOSAT DOMPETKU",
    "kode": "789"
  },
  {
    "nama": "TELKOMSEL TCASH",
    "kode": "911"
  },
  {
    "nama": "LINKAJA",
    "kode": "911"
  },
  {
    "nama": "BANK JABAR",
    "kode": "110"
  },
  {
    "nama": "BANK DKI JAKARTA",
    "kode": "111"
  },
  {
    "nama": "BPD DIY (YOGYAKARTA)",
    "kode": "112"
  },
  {
    "nama": "BANK JATENG (JAWA TENGAH)",
    "kode": "113"
  },
  {
    "nama": "BANK JATIM (JAWA BARAT)",
    "kode": "114"
  },
  {
    "nama": "BPD JAMBI",
    "kode": "115"
  },
  {
    "nama": "BPD ACEH",
    "kode": "116"
  },
  {
    "nama": "BPD ACEH SYARIAH",
    "kode": "116"
  },
  {
    "nama": "BANK SUMUT",
    "kode": "117"
  },
  {
    "nama": "BANK NAGARI (BANK SUMBAR)",
    "kode": "118"
  },
  {
    "nama": "BANK RIAU KEPRI",
    "kode": "119"
  },
  {
    "nama": "BANK SUMSEL BABEL",
    "kode": "120"
  },
  {
    "nama": "BANK LAMPUNG",
    "kode": "121"
  },
  {
    "nama": "BANK KALSEL (BANK KALIMANTAN SELATAN)",
    "kode": "122"
  },
  {
    "nama": "BANK KALBAR (BANK KALIMANTAN BARAT)",
    "kode": "123"
  },
  {
    "nama": "BANK KALTIMTARA (BANK KALIMANTAN TIMUR DAN UTARA)",
    "kode": "124"
  },
  {
    "nama": "BANK KALTENG (BANK KALIMANTAN TENGAH)",
    "kode": "125"
  },
  {
    "nama": "BANK SULSELBAR (BANK SULAWESI SELATAN DAN BARAT)",
    "kode": "126"
  },
  {
    "nama": "BANK SULUTGO (BANK SULAWESI UTARA DAN GORONTALO)",
    "kode": "127"
  },
  {
    "nama": "BANK NTB",
    "kode": "128"
  },
  {
    "nama": "BANK NTB SYARIAH",
    "kode": "128"
  },
  {
    "nama": "BANK BPD BALI",
    "kode": "129"
  },
  {
    "nama": "BANK NTT",
    "kode": "130"
  },
  {
    "nama": "BANK MALUKU MALUT",
    "kode": "131"
  },
  {
    "nama": "BANK PAPUA",
    "kode": "132"
  },
  {
    "nama": "BANK BENGKULU",
    "kode": "133"
  },
  {
    "nama": "BANK SULTENG (BANK SULAWESI TENGAH)",
    "kode": "134"
  },
  {
    "nama": "BANK SULTRA",
    "kode": "135"
  },
  {
    "nama": "BANK BPD BANTEN",
    "kode": "137"
  },
  {
    "nama": "BANK EKSPOR INDONESIA",
    "kode": "003"
  },
  {
    "nama": "BANK PANIN",
    "kode": "019"
  },
  {
    "nama": "BANK PANIN DUBAI SYARIAH",
    "kode": "517"
  },
  {
    "nama": "BANK ARTA NIAGA KENCANA",
    "kode": "020"
  },
  {
    "nama": "BANK UOB INDONESIA (BANK BUANA INDONESIA)",
    "kode": "023"
  },
  {
    "nama": "AMERICAN EXPRESS BANK LTD",
    "kode": "030"
  },
  {
    "nama": "CITIBANK N.A.",
    "kode": "031"
  },
  {
    "nama": "JP. MORGAN CHASE BANK, N.A.",
    "kode": "032"
  },
  {
    "nama": "BANK OF AMERICA, N.A",
    "kode": "033"
  },
  {
    "nama": "ING INDONESIA BANK",
    "kode": "034"
  },
  {
    "nama": "BANK MULTICOR",
    "kode": "036"
  },
  {
    "nama": "BANK ARTHA GRAHA INTERNASIONAL",
    "kode": "037"
  },
  {
    "nama": "BANK CREDIT AGRICOLE INDOSUEZ",
    "kode": "039"
  },
  {
    "nama": "THE BANGKOK BANK COMP. LTD",
    "kode": "040"
  },
  {
    "nama": "BANK HSBC",
    "kode": "041"
  },
  {
    "nama": "THE BANK OF TOKYO MITSUBISHI UFJ LTD",
    "kode": "042"
  },
  {
    "nama": "BANK SUMITOMO MITSUI INDONESIA",
    "kode": "045"
  },
  {
    "nama": "BANK DBS INDONESIA",
    "kode": "046"
  },
  {
    "nama": "DIGIBANK",
    "kode": "046"
  },
  {
    "nama": "BANK RESONA PERDANIA",
    "kode": "047"
  },
  {
    "nama": "BANK MIZUHO INDONESIA",
    "kode": "048"
  },
  {
    "nama": "STANDARD CHARTERED BANK",
    "kode": "050"
  },
  {
    "nama": "BANK ABN AMRO",
    "kode": "052"
  },
  {
    "nama": "BANK KEPPEL TATLEE BUANA",
    "kode": "053"
  },
  {
    "nama": "BANK CAPITAL INDONESIA",
    "kode": "054"
  },
  {
    "nama": "BANK BNP PARIBAS INDONESIA",
    "kode": "057"
  },
  {
    "nama": "BANK UOB INDONESIA",
    "kode": "023"
  },
  {
    "nama": "KOREA EXCHANGE BANK DANAMON",
    "kode": "059"
  },
  {
    "nama": "RABOBANK INTERNASIONAL INDONESIA",
    "kode": "060"
  },
  {
    "nama": "BANK ANZ INDONESIA",
    "kode": "061"
  },
  {
    "nama": "BANK WOORI SAUDARA",
    "kode": "068"
  },
  {
    "nama": "BANK OF CHINA",
    "kode": "069"
  },
  {
    "nama": "BANK BUMI ARTA",
    "kode": "076"
  },
  {
    "nama": "BANK EKONOMI",
    "kode": "087"
  },
  {
    "nama": "BANK ANTARDAERAH",
    "kode": "088"
  },
  {
    "nama": "BANK HAGA",
    "kode": "089"
  },
  {
    "nama": "BANK IFI",
    "kode": "093"
  },
  {
    "nama": "BANK CENTURY",
    "kode": "095"
  },
  {
    "nama": "BANK MAYAPADA",
    "kode": "097"
  },
  {
    "nama": "BANK NUSANTARA PARAHYANGAN",
    "kode": "145"
  },
  {
    "nama": "BANK SWADESI (BANK OF INDIA INDONESIA)",
    "kode": "146"
  },
  {
    "nama": "BANK MESTIKA DHARMA",
    "kode": "151"
  },
  {
    "nama": "BANK SHINHAN INDONESIA (BANK METRO EXPRESS)",
    "kode": "152"
  },
  {
    "nama": "BANK MASPION INDONESIA",
    "kode": "157"
  },
  {
    "nama": "BANK HAGAKITA",
    "kode": "159"
  },
  {
    "nama": "BANK GANESHA",
    "kode": "161"
  },
  {
    "nama": "BANK WINDU KENTJANA",
    "kode": "162"
  },
  {
    "nama": "BANK ICBC INDONESIA (HALIM INDONESIA BANK)",
    "kode": "164"
  },
  {
    "nama": "BANK HARMONI INTERNATIONAL",
    "kode": "166"
  },
  {
    "nama": "BANK QNB KESAWAN (BANK QNB INDONESIA)",
    "kode": "167"
  },
  {
    "nama": "BANK HIMPUNAN SAUDARA 1906",
    "kode": "212"
  },
  {
    "nama": "BANK SWAGUNA",
    "kode": "405"
  },
  {
    "nama": "BANK BISNIS INTERNASIONAL",
    "kode": "459"
  },
  {
    "nama": "BANK SRI PARTHA",
    "kode": "466"
  },
  {
    "nama": "BANK JASA JAKARTA",
    "kode": "472"
  },
  {
    "nama": "BANK BINTANG MANUNGGAL",
    "kode": "484"
  },
  {
    "nama": "BANK MNC INTERNASIONAL (BANK BUMIPUTERA)",
    "kode": "485"
  },
  {
    "nama": "BANK YUDHA BHAKTI",
    "kode": "490"
  },
  {
    "nama": "BANK MITRANIAGA",
    "kode": "491"
  },
  {
    "nama": "BANK BRI AGRO NIAGA",
    "kode": "494"
  },
  {
    "nama": "BANK SBI INDONESIA (BANK INDOMONEX)",
    "kode": "498"
  },
  {
    "nama": "BANK ROYAL INDONESIA",
    "kode": "501"
  },
  {
    "nama": "BANK NATIONAL NOBU (BANK ALFINDO)",
    "kode": "503"
  },
  {
    "nama": "BANK MEGA SYARIAH",
    "kode": "506"
  },
  {
    "nama": "BANK INA PERDANA",
    "kode": "513"
  },
  {
    "nama": "BANK HARFA",
    "kode": "517"
  },
  {
    "nama": "PRIMA MASTER BANK",
    "kode": "520"
  },
  {
    "nama": "BANK PERSYARIKATAN INDONESIA",
    "kode": "521"
  },
  {
    "nama": "BANK AKITA",
    "kode": "525"
  },
  {
    "nama": "LIMAN INTERNATIONAL BANK",
    "kode": "526"
  },
  {
    "nama": "ANGLOMAS INTERNASIONAL BANK",
    "kode": "531"
  },
  {
    "nama": "BANK SAHABAT SAMPEORNA (BANK DIPO INTERNATIONAL)",
    "kode": "523"
  },
  {
    "nama": "BANK KESEJAHTERAAN EKONOMI",
    "kode": "535"
  },
  {
    "nama": "BANK ARTOS INDONESIA",
    "kode": "542"
  },
  {
    "nama": "BANK PURBA DANARTA",
    "kode": "547"
  },
  {
    "nama": "BANK MULTI ARTA SENTOSA",
    "kode": "548"
  },
  {
    "nama": "BANK MAYORA INDONESIA",
    "kode": "553"
  },
  {
    "nama": "BANK INDEX SELINDO",
    "kode": "555"
  },
  {
    "nama": "BANK VICTORIA INTERNATIONAL",
    "kode": "566"
  },
  {
    "nama": "BANK EKSEKUTIF",
    "kode": "558"
  },
  {
    "nama": "CENTRATAMA NASIONAL BANK",
    "kode": "559"
  },
  {
    "nama": "BANK FAMA INTERNASIONAL",
    "kode": "562"
  },
  {
    "nama": "BANK MANDIRI TASPEN POS (BANK SINAR HARAPAN BALI)",
    "kode": "564"
  },
  {
    "nama": "BANK HARDA",
    "kode": "567"
  },
  {
    "nama": "BANK AGRIS (BANK FINCONESIA)",
    "kode": "945"
  },
  {
    "nama": "BANK MERINCORP",
    "kode": "946"
  },
  {
    "nama": "BANK MAYBANK INDOCORP",
    "kode": "947"
  },
  {
    "nama": "BANK OCBC – INDONESIA",
    "kode": "948"
  },
  {
    "nama": "BANK CTBC (CHINA TRUST) INDONESIA",
    "kode": "949"
  },
  {
    "nama": "BANK BJB SYARIAH",
    "kode": "425"
  },
  {
    "nama": "BPR KS (KARYAJATNIKA SEDAYA)",
    "kode": "688"
  }
];
module.exports = banks;