// src/models/diterima-model.js

export default class DiterimaModel {
    constructor() {
        // Data dummy untuk aplikasi yang diterima
        this.dummyData = [
            {
                id: 1,
                jenisSampah: "Plastik PET",
                tanggalPembelian: "2023-10-15",
                berat: 5.2,
                harga: 2000,
                total: 10400,
                gambar: "https://example.com/images/plastik-pet.jpg",
                status: "Diterima"
            },
            {
                id: 2,
                jenisSampah: "Kertas HVS",
                tanggalPembelian: "2023-10-14",
                berat: 8.5,
                harga: 1500,
                total: 12750,
                gambar: "https://example.com/images/kertas-hvs.jpg",
                status: "Diterima"
            },
            {
                id: 3,
                jenisSampah: "Kaleng Aluminium",
                tanggalPembelian: "2023-10-13",
                berat: 3.7,
                harga: 3000,
                total: 11100,
                gambar: "https://example.com/images/kaleng-aluminium.jpg",
                status: "Diterima"
            },
            {
                id: 4,
                jenisSampah: "Botol Kaca",
                tanggalPembelian: "2023-10-12",
                berat: 6.8,
                harga: 1800,
                total: 12240,
                gambar: "https://example.com/images/botol-kaca.jpg",
                status: "Diterima"
            },
            {
                id: 5,
                jenisSampah: "Kardus",
                tanggalPembelian: "2023-10-11",
                berat: 12.3,
                harga: 1200,
                total: 14760,
                gambar: "https://example.com/images/kardus.jpg",
                status: "Diterima"
            }
        ];
    }

    // Method untuk mendapatkan semua data yang diterima
    getAllAcceptedApplications() {
        return new Promise((resolve) => {
            // Simulasikan async operation dengan timeout kecil
            setTimeout(() => {
                resolve(this.dummyData);
            }, 300);
        });
    }

    // Method untuk mendapatkan data by ID
    getApplicationById(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const found = this.dummyData.find(app => app.id === id);
                if (found) {
                    resolve(found);
                } else {
                    reject(new Error("Data tidak ditemukan"));
                }
            }, 200);
        });
    }

    // Method untuk filter data
    getFilteredApplications(filter) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let filteredData = [...this.dummyData];
                
                if (filter.jenisSampah) {
                    filteredData = filteredData.filter(app => 
                        app.jenisSampah.toLowerCase().includes(filter.jenisSampah.toLowerCase())
                    );
                }
                
                if (filter.tanggal) {
                    filteredData = filteredData.filter(app => 
                        app.tanggalPembelian === filter.tanggal
                    );
                }
                
                resolve(filteredData);
            }, 300);
        });
    }
}