// src/models/pengiriman-model.js
export default class PengirimanModel {
    constructor() {
        this.pengirimanData = [
        {
            id: 'P001',
            nama: 'Budi Santoso',
            noHp: '081234567890',
            kategoriSampah: 'Plastik',
            jenisSampah: 'Botol Plastik',
            berat: 5,
            harga: 2000,
            totalHarga: 10000,
            alamat: 'Jl. Merdeka No. 10, Jakarta',
            tanggalPenjemputan: '2023-06-15 09:00',
            status: 'pending',
            catatan: 'Sampah sudah dipilah',
            foto: 'https://via.placeholder.com/150?text=Botol+Plastik'
        },
        {
            id: 'P002',
            nama: 'Ani Wijaya',
            noHp: '082345678901',
            kategoriSampah: 'Kertas',
            jenisSampah: 'Koran Bekas',
            berat: 8,
            harga: 1500,
            totalHarga: 12000,
            alamat: 'Jl. Sudirman No. 25, Bandung',
            tanggalPenjemputan: '2023-06-16 10:30',
            status: 'pending',
            catatan: 'Koran dalam kondisi baik',
            foto: 'https://via.placeholder.com/150?text=Koran+Bekas'
        },
        {
            id: 'P003',
            nama: 'Citra Dewi',
            noHp: '083456789012',
            kategoriSampah: 'Logam',
            jenisSampah: 'Kaleng Aluminium',
            berat: 3,
            harga: 3000,
            totalHarga: 9000,
            alamat: 'Jl. Gatot Subroto No. 5, Surabaya',
            tanggalPenjemputan: '2023-06-17 14:00',
            status: 'accepted',
            catatan: 'Sudah dicuci bersih',
            foto: 'https://via.placeholder.com/150?text=Kaleng+Aluminium'
        },
        {
            id: 'P004',
            nama: 'Dodi Pratama',
            noHp: '084567890123',
            kategoriSampah: 'Elektronik',
            jenisSampah: 'Baterai Bekas',
            berat: 2,
            harga: 5000,
            totalHarga: 10000,
            alamat: 'Jl. Pahlawan No. 15, Yogyakarta',
            tanggalPenjemputan: '2023-06-18 11:00',
            status: 'accepted',
            catatan: 'Harap ditangani dengan hati-hati',
            foto: 'https://via.placeholder.com/150?text=Baterai+Bekas'
        },
        {
            id: 'P005',
            nama: 'Eka Putri',
            noHp: '085678901234',
            kategoriSampah: 'Organik',
            jenisSampah: 'Sisa Makanan',
            berat: 10,
            harga: 1000,
            totalHarga: 10000,
            alamat: 'Jl. Asia Afrika No. 30, Bandung',
            tanggalPenjemputan: '2023-06-19 08:00',
            status: 'pending',
            catatan: 'Sudah dikemas dalam wadah tertutup',
            foto: 'https://via.placeholder.com/150?text=Sisa+Makanan'
        },
        {
            id: 'P006',
            nama: 'Fajar Nugraha',
            noHp: '086789012345',
            kategoriSampah: 'Plastik',
            jenisSampah: 'Kemasan Plastik',
            berat: 7,
            harga: 1800,
            totalHarga: 12600,
            alamat: 'Jl. Diponegoro No. 12, Semarang',
            tanggalPenjemputan: '2023-06-20 13:30',
            status: 'accepted',
            catatan: 'Plastik sudah dicuci',
            foto: 'https://via.placeholder.com/150?text=Kemasan+Plastik'
        },
        {
            id: 'P007',
            nama: 'Gita Maharani',
            noHp: '087890123456',
            kategoriSampah: 'Kaca',
            jenisSampah: 'Botol Kaca',
            berat: 4,
            harga: 2500,
            totalHarga: 10000,
            alamat: 'Jl. Ahmad Yani No. 8, Malang',
            tanggalPenjemputan: '2023-06-21 10:00',
            status: 'pending',
            catatan: 'Harap hati-hati, mudah pecah',
            foto: 'https://via.placeholder.com/150?text=Botol+Kaca'
        },
        {
            id: 'P008',
            nama: 'Hendra Setiawan',
            noHp: '088901234567',
            kategoriSampah: 'Logam',
            jenisSampah: 'Besi Tua',
            berat: 15,
            harga: 3500,
            totalHarga: 52500,
            alamat: 'Jl. Surya Sumantri No. 45, Bogor',
            tanggalPenjemputan: '2023-06-22 09:30',
            status: 'accepted',
            catatan: 'Berat, butuh alat bantu',
            foto: 'https://via.placeholder.com/150?text=Besi+Tua'
        },
        {
            id: 'P009',
            nama: 'Indah Permata',
            noHp: '089012345678',
            kategoriSampah: 'Tekstil',
            jenisSampah: 'Pakaian Bekas',
            berat: 6,
            harga: 1200,
            totalHarga: 7200,
            alamat: 'Jl. Cihampelas No. 20, Bandung',
            tanggalPenjemputan: '2023-06-23 14:00',
            status: 'pending',
            catatan: 'Masih layak pakai',
            foto: 'https://via.placeholder.com/150?text=Pakaian+Bekas'
        },
        {
            id: 'P010',
            nama: 'Joko Susilo',
            noHp: '081123456789',
            kategoriSampah: 'Elektronik',
            jenisSampah: 'Handphone Rusak',
            berat: 1,
            harga: 8000,
            totalHarga: 8000,
            alamat: 'Jl. Teuku Umar No. 33, Denpasar',
            tanggalPenjemputan: '2023-06-24 11:00',
            status: 'accepted',
            catatan: 'Tidak termasuk charger',
            foto: 'https://via.placeholder.com/150?text=Handphone+Rusak'
        }
        ];
    }

    getAllPengiriman() {
        return this.pengirimanData;
    }

    getApplications() {
        return this.getAllPengiriman();
    }

    getPengirimanByStatus(status) {
        if (status === 'all') {
        return this.pengirimanData;
        }
        return this.pengirimanData.filter(pengiriman => pengiriman.status === status);
    }

    getPengirimanById(id) {
        return this.pengirimanData.find(pengiriman => pengiriman.id === id);
    }

    updateStatusPengiriman(id, newStatus) {
        const pengiriman = this.getPengirimanById(id);
        if (pengiriman) {
        pengiriman.status = newStatus;
        return true;
        }
        return false;
    }

    getStatistics() {
        const total = this.pengirimanData.length;
        const pending = this.pengirimanData.filter(p => p.status === 'pending').length;
        const accepted = this.pengirimanData.filter(p => p.status === 'accepted').length;
        
        return {
        total,
        pending,
        accepted,
        totalPrice: this.pengirimanData.reduce((sum, p) => sum + p.totalHarga, 0)
        };
    }

    searchPengiriman(keyword) {
        const lowerKeyword = keyword.toLowerCase();
        return this.pengirimanData.filter(pengiriman => 
        pengiriman.nama.toLowerCase().includes(lowerKeyword) ||
        pengiriman.alamat.toLowerCase().includes(lowerKeyword) ||
        pengiriman.jenisSampah.toLowerCase().includes(lowerKeyword)
        );
    }

    validateData() {
        return this.pengirimanData.every(item => {
            return item.id && 
                item.nama && 
                item.status && 
                typeof item.totalHarga === 'number';
        });
    }

    getApplicationsWithErrorHandling() {
    try {
        if (!this.pengirimanData || !Array.isArray(this.pengirimanData)) {
            console.error('Pengiriman data is not properly initialized');
            return [];
        }
        
        if (!this.validateData()) {
            console.warn('Some data entries may be invalid');
        }
        
        // Normalize data before returning
        const normalizedData = this.normalizeApplicationData(this.pengirimanData);
        
        console.log('Returning normalized data:', normalizedData.length, 'items');
        
        return normalizedData;
    } catch (error) {
        console.error('Error getting applications:', error);
        return [];
    }
}

    initializeDefaultData() {
        if (!this.pengirimanData || this.pengirimanData.length === 0) {
            console.log('Initializing default pengiriman data');
            return this.pengirimanData.length > 0;
        }
        return true;
    }

     getSummaryStats() {
        const stats = this.getStatistics();
        return {
            ...stats,
            byCategory: this.pengirimanData.reduce((acc, item) => {
            const category = item.kategoriSampah || item.jenisSampah || 'Lainnya';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
            }, {}),
            totalWeight: this.pengirimanData.reduce((sum, item) => sum + (item.berat || 0), 0)
        };
    }

    debugPengirimanData() {
    console.log('=== PENGIRIMAN MODEL DEBUG ===');
    console.log('Total data:', this.pengirimanData.length);
    console.log('Status distribution:', this.pengirimanData.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
    }, {}));
    console.log('Sample data:', this.pengirimanData.slice(0, 2));
    console.log('==============================');
    return this.pengirimanData;
}

// Method untuk memastikan data format yang konsisten
normalizeApplicationData(applications) {
    return applications.map(app => ({
        ...app,
        // Pastikan semua field yang dibutuhkan ada
        id: app.id || `P${Date.now()}`,
        nama: app.nama || 'Unknown',
        kategoriSampah: app.kategoriSampah || app.jenisSampah || 'Unknown',
        jenisSampah: app.jenisSampah || app.kategoriSampah || 'Unknown',
        berat: parseFloat(app.berat) || 0,
        harga: parseFloat(app.harga) || 0,
        totalHarga: parseFloat(app.totalHarga) || 0,
        status: app.status || 'pending',
        tanggalPenjemputan: app.tanggalPenjemputan || new Date().toISOString().slice(0, 16),
        alamat: app.alamat || 'Alamat tidak tersedia'
    }));
}

}