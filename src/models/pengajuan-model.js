const dummyApplicationsData = [
    {
        id: 1,
        name: "Ahmad Rizki",
        phone: "08123456789",
        category: "Plastik",
        image: "https://images.unsplash.com/photo-1572879443656-6ad30358e8c8?w=100&h=100&fit=crop&crop=center",
        weight: "2.5",
        status: "pending"
    },
    {
        id: 2,
        name: "Siti Nurhaliza",
        phone: "08234567890",
        category: "Kertas", 
        image: "https://images.unsplash.com/photo-1594736797933-d0c18c2e5d9c?w=100&h=100&fit=crop&crop=center",
        weight: "1.8",
        status: "pending"
    },
    {
        id: 3,
        name: "Budi Santoso",
        phone: "08345678901",
        category: "Logam",
        image: "https://images.unsplash.com/photo-1558618666-fbcd85c25e02?w=100&h=100&fit=crop&crop=center", 
        weight: "5.2",
        status: "pending"
    },
    {
        id: 4,
        name: "Maya Sari",
        phone: "08456789012",
        category: "Elektronik",
        image: "https://images.unsplash.com/photo-1586323392860-b0669593e398?w=100&h=100&fit=crop&crop=center",
        weight: "3.7", 
        status: "accepted"
    },
    {
        id: 5,
        name: "Dedi Kurniawan", 
        phone: "08567890123",
        category: "Kaca",
        image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop&crop=center",
        weight: "4.1",
        status: "rejected"
    }
];

export default class PengajuanModel {
    constructor() {
        // PENTING: Inisialisasi dengan data dummy
        this.applications = dummyApplicationsData;
        console.log("PengajuanModel initialized with", this.applications.length, "applications");
    }

    getApplications() {
        console.log("Getting applications:", this.applications);
        return this.applications || [];
    }

    getApplicationById(id) {
        const app = this.applications.find(app => app.id === parseInt(id));
        console.log("Getting application by ID", id, ":", app);
        return app;
    }

    updateApplicationStatus(id, status) {
        const index = this.applications.findIndex(app => app.id === parseInt(id));
        if (index !== -1) {
        this.applications[index].status = status;
        console.log("Updated application status:", this.applications[index]);
        return this.applications[index];
        }
        console.warn("Application not found for ID:", id);
        return null;
    }
}