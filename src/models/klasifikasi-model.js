import * as tf from "@tensorflow/tfjs";


function L2Regularizer(config) {
  this.l2 = config.l2 || 0.01;
}

L2Regularizer.prototype.apply = function (x) {
  return tf.mul(tf.scalar(this.l2), tf.sum(tf.square(x)));
};

L2Regularizer.prototype.getConfig = function () {
  return { l2: this.l2 };
};


L2Regularizer.className = "L2";


tf.serialization.registerClass(L2Regularizer);

class KlasifikasiModel {
  constructor() {
    this.modelUrl =
      "https://modelai14.s3.ap-southeast-2.amazonaws.com/model.json";
    this.model = null;
    this.labels = [
      "Cardboard",
      "Food_Organics",
      "Glass",
      "Metal",
      "Miscellaneous_Trash",
      "Paper",
      "Plastic",
      "Textile_Trash",
      "Vegetation",
    ];
    this.labelAliases = {
      Cardboard: "Kardus",
      Food_Organics: "Sisa Makanan",
      Glass: "Kaca",
      Metal: "Logam",
      Miscellaneous_Trash: "Sampah Campuran",
      Paper: "Kertas",
      Plastic: "Plastik",
      Textile_Trash: "Sampah Tekstil",
      Vegetation: "Tanaman/Sampah Organik",
    };
  }

  async loadModel() {
    this.model = await tf.loadLayersModel(this.modelUrl, {
      customObjects: { L2: L2Regularizer },
    });
    console.log("Model berhasil dimuat");
  }

  async preprocessImage(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const tensor = tf.browser
          .fromPixels(img)
          .resizeBilinear([224, 224])
          .toFloat()
          .div(tf.scalar(255))
          .sub(0.5)
          .mul(2)
          .expandDims();
        URL.revokeObjectURL(img.src);
        resolve(tensor);
      };
      img.onerror = () => reject(new Error("Gagal memuat gambar"));
    });
  }

  async predict(file) {
    if (!this.model) throw new Error("Model belum dimuat");

    const tensor = await this.preprocessImage(file);

    try {
      const prediction = this.model.predict(tensor);
      const probabilities = await prediction.data();

      const result = this.processClassificationResponse(probabilities);

      tf.dispose(tensor);
      tf.dispose(prediction);

      return result;
    } catch (error) {
      tf.dispose(tensor);
      throw error;
    }
  }

  processClassificationResponse(probabilities) {
    const predictedClassIndex = probabilities.indexOf(
      Math.max(...probabilities)
    );
    const predictedClass = this.labels[predictedClassIndex];
    const confidence = probabilities[predictedClassIndex] * 100;

    const topIndices = Array.from(probabilities)
      .map((val, idx) => ({ val, idx }))
      .sort((a, b) => b.val - a.val)
      .slice(0, 3)
      .map((item) => item.idx);

    const topPredictions = topIndices.map((index) => ({
      className: this.labels[index],
      alias: this.labelAliases[this.labels[index]],
      confidence: probabilities[index] * 100,
    }));

    return {
      predictedClass,
      alias: this.labelAliases[predictedClass],
      confidence,
      topPredictions,
    };
  }
}

export default KlasifikasiModel;
