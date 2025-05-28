const CATEGORY_MAPPING = {
  // Lowercase mappings for normalized input
  cardboard: "Kardus",
  organic: "Organik",
  glass: "Kaca",
  metal: "Logam",
  miscellaneous: "Lainnya",
  paper: "Kertas",
  plastic: "Plastik",
  textile: "Kain",
  vegetation: "Vegetasi",

  // Direct mappings from classification results
  Cardboard: "Kardus",
  Food_Organics: "Bahan Organik Makanan",
  Glass: "Kaca",
  Metal: "Logam",
  Miscellaneous_Trash: "Sampah Lainnya",
  Paper: "Kertas",
  Plastic: "Plastik",
  Textile_Trash: "Sampah Tekstil",
  Vegetation: "Vegetasi",
};

export default class RekomendasiModel {
  constructor() {
    this.apiUrl =
      "https://modelai14.s3.ap-southeast-2.amazonaws.com/dataset.json";
    this.dataset = null;
    this.isLoading = false;
  }

  async loadDataset() {
    if (this.dataset || this.isLoading) return;

    this.isLoading = true;
    try {
      console.log("Loading recommendation dataset...");
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to load dataset: ${response.status} ${response.statusText}`
        );
      }
      this.dataset = await response.json();
      console.log(
        "Dataset loaded successfully:",
        this.dataset.length,
        "entries"
      );
    } catch (error) {
      console.error("Error loading dataset:", error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  normalizeWasteType(wasteType) {
    // First check direct mapping
    if (CATEGORY_MAPPING[wasteType]) {
      return CATEGORY_MAPPING[wasteType];
    }

    // Then check lowercase mapping
    const lowerType = wasteType.toLowerCase();
    if (CATEGORY_MAPPING[lowerType]) {
      return CATEGORY_MAPPING[lowerType];
    }

    // Fallback to original
    return wasteType;
  }

  async getRecommendation(inputKategori, inputBeratKg) {
    try {
      // Ensure dataset is loaded
      await this.loadDataset();

      if (!this.dataset || !Array.isArray(this.dataset)) {
        throw new Error("Dataset not available or invalid format");
      }

      // Normalize the category
      const mappedCategory = this.normalizeWasteType(inputKategori);
      const weightKg = parseFloat(inputBeratKg);

      if (isNaN(weightKg) || weightKg <= 0) {
        throw new Error("Invalid weight value");
      }

      console.log(
        `Processing recommendation for category: ${mappedCategory}, weight: ${weightKg} kg`
      );
      console.log(`Available categories in dataset:`, [
        ...new Set(this.dataset.map((item) => item.kategori)),
      ]);

      // Find exact match within weight range
      const exactMatch = this.dataset.find((item) => {
        return (
          item.kategori === mappedCategory &&
          weightKg >= item.berat_min_kg &&
          weightKg <= item.berat_max_kg
        );
      });

      if (exactMatch) {
        return {
          kategori: mappedCategory,
          berat_input_kg: weightKg,
          berat_min_kg: exactMatch.berat_min_kg,
          berat_max_kg: exactMatch.berat_max_kg,
          rekomendasi: exactMatch.rekomendasi,
          message: `Rekomendasi untuk ${mappedCategory} dengan berat ${weightKg} kg`,
        };
      }

      // Find any entry for this category (fallback)
      const fallbackEntry = this.dataset.find(
        (item) => item.kategori === mappedCategory
      );

      if (fallbackEntry) {
        return {
          kategori: mappedCategory,
          berat_input_kg: weightKg,
          berat_min_kg: fallbackEntry.berat_min_kg,
          berat_max_kg: fallbackEntry.berat_max_kg,
          rekomendasi: fallbackEntry.rekomendasi,
          message: `Berat sampah Anda (${weightKg} kg) tidak sesuai dengan rentang rekomendasi umum (${fallbackEntry.berat_min_kg} - ${fallbackEntry.berat_max_kg} kg), namun berikut adalah rekomendasi umum untuk kategori ${mappedCategory}.`,
        };
      }

      // No match found - provide generic recommendation
      const availableCategories = [
        ...new Set(this.dataset.map((item) => item.kategori)),
      ];
      throw new Error(
        `No recommendation found for category "${mappedCategory}". Available categories: ${availableCategories.join(
          ", "
        )}`
      );
    } catch (error) {
      console.error("Recommendation error:", error);
      throw new Error(`Failed to generate recommendation: ${error.message}`);
    }
  }
}
