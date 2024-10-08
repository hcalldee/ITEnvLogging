# ITEnvLogging
API ini dirancang untuk memonitor dan menyimpan data temperatur dan kelembapan dari perangkat IoT yang terpasang di ruangan server. Data yang dikumpulkan dapat diakses dan dikelola melalui berbagai endpoint, memungkinkan pengguna untuk melihat data dalam bentuk grafik atau tabel dengan rentang waktu yang ditentukan.

# Instalasi

Ikuti langkah-langkah berikut untuk menginstal dan menjalankan proyek ini:

1. Clone repositori ini:
   ```bash
   git clone https://github.com/hcalldee/ITEnvLogging.git
   bash cd ITEnvLogging
   ```

2. Install Dependency Dan Env
   ```bash
     npm install
   ```

3. Isi .env sesuai dengan env yang anda gunakan
   ```bash
    HOST=api_host
    PORT=api_port
    DB_HOST=db_host
    DB_USER=db_user
    DB_PASSWORD=db_password
    DB_NAME=db_name
    DB_PORT=db_port  
    ``` 
    <br> 

# Katalog Fitur & Katalog API

### 1. `/submit`
- **Metode:** POST
- **Deskripsi:** Menyimpan data dari perangkat IoT ke dalam database.
- **Fungsi:** `submitData`
- **API:**  
    ```bash 
    curl -X POST http://HOST:PORT/submit \
     -H "Content-Type: application/json" \
     -d '{
           "id": "1",
           "temperature": 28.0,
           "humidity": 40
         }'
### 2. `/getRuangan`
- **Metode:** GET
- **Deskripsi:** Mengambil data seluruh ruangan yang tersedia.
- **Fungsi:** `getRuangan`
- **API:**  
    ```bash 
    curl -X GET http://HOST:PORT/getRuangan
### 3. `/getAllHistory`
- **Metode:** GET
- **Deskripsi:** Mengambil seluruh data monitoring dari database.
- **Fungsi:** `fetchAllTransacts`
- **API:**  
    ```bash 
    curl -X GET http://HOST:PORT/getAllHistory \
    -H "Accept: application/json"
### 4. `/getRuanganSpec`
- **Metode:** POST
- **Deskripsi:** Mengambil data ruangan spesifik berdasarkan parameter yang diberikan. jika type id gunakan id_alat, jika type name gunakan nama ruangan
- **Fungsi:** `getRuanganSpec`
- **API:**  
    ```bash 
    curl -X POST http://HOST:PORT/getRuanganSpec \
        -H "Content-Type: application/json" \
        -d '{
            "type": "exampleType", 
            "data": "exampleData"
            }'
### 5. `/getHistorySpec`
- **Metode:** POST
- **Deskripsi:** Mengambil data monitoring spesifik berdasarkan ID item yang diberikan.
- **Fungsi:** `fetchTransactByItemId`
- **API:**  
    ```bash 
    curl -X POST http://HOST:PORT/getHistorySpec \
        -H "Content-Type: application/json" \
        -d '{
            "id_item": "yourItemId"
            }'
### 6. `/filterByDate`
- **Metode:** POST
- **Deskripsi:** Mengambil data monitoring spesifik berdasarkan tanggal yang diberikan.
- **Fungsi:** `filterByDate`
- **API:**  
    ```bash 
    curl -X POST http://HOST:PORT/filterByDate \
        -H "Content-Type: application/json" \
        -d '{
            "startDate": "YYYY-MM-DD",
            "endDate": "YYYY-MM-DD"
            }'
### 7. `/update-monit-ruangan`
- **Metode:** POST
- **Deskripsi:** Memperbarui bobot sensor IoT untuk ruangan tertentu.
- **Fungsi:** `updateWeight` 
- **API:**  
    ```bash 
    curl -X POST http://HOST:PORT/update-monit-ruangan \
        -H "Content-Type: application/json" \
        -d '{
            "id_ruangan": "123",
                "data": {
                    "nm_ruangan": "Room A",
                    "wt": 25.0,
                    "wh": 30.0
                }
            }'
### 8. `/getTempNow`
- **Metode:** GET
- **Deskripsi:** Mengambil Data Live Dari Sensor.
- **Fungsi:** `getTempNow` 
- **API:**  
    ```bash 
    curl -X GET "http://HOST:PORT/getTempNow/:id" 
- **Output Example:**  
    ```bash 
    {
        "actual_temperature": "18.2℃",
        "actual_humidity": "67%",
        "weighted_temperature": "18.70℃",
        "weighted_humidity": "57.00%"
    }
    ```
### 9. `/getJadwalMonitoring`
- **Metode:** GET
- **Deskripsi:** Mengambil Jadwal Sampling.
- **Fungsi:** `getJadwalMonitoring` 
- **API:**  
    ```bash 
    curl -X GET "http://HOST:PORT/getJadwalMonitoring/:id" 
- **Output Example:**  
    ```bash 
    {
        "id_jadwal": 1,
        "id_item": "1",
        "waktu_sampling": "16:00:00",
        "wt": 0.5,
        "wh": -11
    },
### 10. `/updateJadwal`
- **Metode:** POST
- **Deskripsi:** Update Jadwal Sampling.
- **Fungsi:** `updateJadwal` 
- **API:**  
    ```bash 
    curl -X POST http://HOST:PORT/updateJadwal \
     -H "Content-Type: application/json" \
     -d '{
            "id_jadwal": "12345", 
            "waktu": "2024-09-01 10:00:00
        "}'
### 11. `/addJadwal`
- **Metode:** POST
- **Deskripsi:** Add Jadwal Sampling.
- **Fungsi:** `addJadwal` 
- **API:**  
    ```bash 
    curl -X POST http://HOST:PORT/addJadwal \
     -H "Content-Type: application/json" \
     -d '{
            "id_item": "12345", 
            "waktu": "2024-09-01 10:00:00
        "}'
### 12. `/deleteJadwal`
- **Metode:** POST
- **Deskripsi:** delete Jadwal Sampling.
- **Fungsi:** `deleteJadwal` 
- **API:**  
    ```bash 
    curl -X POST http://HOST:PORT/deleteJadwal \
     -H "Content-Type: application/json" \
     -d '{
            "id_jadwal": "12345"
        "}'
### 13. `/addRuangan`
- **Metode:** POST
- **Deskripsi:** add Ruangan Monitoring.
- **Fungsi:** `addRuangan` 
- **API:**  
    ```bash 
    curl -X POST http://HOST:PORT/addRuangan \
     -H "Content-Type: application/json" \
     -d '{
           "nm_ruangan": "Room A", // nama ruangan
           "IPAddr": "192.168.1.1" // ip alat
         }'
### 14. `/deleteRuangan`
- **Metode:** POST
- **Deskripsi:** delete ruangan monitoring.
- **Fungsi:** `deleteRuangan` 
- **API:**  
    ```bash 
    curl -X POST http://HOST:PORT/deleteRuangan \
     -H "Content-Type: application/json" \
     -d '{
           "id": "12345" // id ruangan
         }'
.