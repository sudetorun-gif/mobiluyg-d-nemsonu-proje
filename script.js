document.addEventListener("DOMContentLoaded", function () {
    const coffeeContainer = document.getElementById("coffee-container");
    const searchInput = document.getElementById("search-input");
    const categorySelect = document.getElementById("category-select");
    const roastRadios = document.querySelectorAll('input[name="roast-level"]');
    const noResultAlert = document.getElementById("no-result-alert");
    const resetBtn = document.getElementById("reset-btn");

    // BACKEND VERİ TABANI SİMÜLASYONU (Mock Veri)
    // Gerçek bir backend API'den dönecek JSON formatındaki veri yapısı
    const mockBackendData = [
        {
            id: 1,
            title: "Espresso",
            category: "espresso",
            roast: "Sert",
            badgeCategory: "Espresso Bazlı",
            badgeBg: "bg-danger",
            img: "https://mocacocoffee.com/cdn/shop/articles/espresso-kahve-yaninda-portafilter_1200x679.jpg?v=1717670070",
            shortDesc: "İnce çekilmiş kahve çekirdeklerinin basınçlı sıcak suyla demlenmesiyle elde edilen yoğun kahve.",
            longDesc: "İtalya kökenli, sert ve yoğun bir kahve deneyimi sunar. Diğer tüm sütlü kahvelerin (Latte, Cappuccino) temelidir."
        },
        {
            id: 2,
            title: "Caffe Latte",
            category: "espresso",
            roast: "Yumuşak",
            badgeCategory: "Espresso Bazlı",
            badgeBg: "bg-success",
            img: "https://kahhve.com/blog/wp-content/uploads/2025/10/What_is_a_latte-1024x569.jpeg",
            shortDesc: "Tek veya çift shot espressonun buharla ısıtılmış sıcak süt ve süt köpüğüyle buluşması.",
            longDesc: "Bol sütlü ve hafif içimli kahve severlerin bir numaralı tercihidir. Üzerine yapılan süt sanatları (Latte Art) ile bilinir."
        },
        {
            id: 3,
            title: "Filtre Kahve",
            category: "filtre",
            roast: "Yumuşak",
            badgeCategory: "Demleme",
            badgeBg: "bg-warning text-dark",
            img: "https://kahhve.com/blog/wp-content/uploads/2020/08/Untitled-design-4.jpg",
            shortDesc: "Öğütülmüş kahve çekirdeklerinin kağıt veya metal filtreden süzülerek demlenmesi yöntemi.",
            longDesc: "Günün her saati tüketilebilen, çekirdeğin yetiştiği bölgenin (Etiyopya, Kolombiya vb.) aromalarını en temiz şekilde sunan yöntemdir."
        },
        {
            id: 4,
            title: "Türk Kahvesi",
            category: "geleneksel",
            roast: "Sert",
            badgeCategory: "Geleneksel",
            badgeBg: "bg-info text-dark",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUlsVHnh6Gcfhmgm2ZZmkrm4QNO446lhwmjA&s",
            shortDesc: "Çok ince çekilmiş kahvenin cezve veya özel makinede su ve (isteğe bağlı) şekerle kaynatılması.",
            longDesc: "Geleneksel pişirme tekniği, telvesiyle ikram edilmesi ve yanında lokum/su sunumuyla kültürel bir mirasımızdır."
        }
    ];

    // 1. BACKEND SİMÜLASYONUNDAN VERİLERİ ASENKRON ÇEKEN FONKSİYON
    function loadCoffees() {
        // Gerçek bir API isteği (fetch) gibi Promise yapısıyla veriyi asenkron yüklüyoruz
        Promise.resolve(mockBackendData)
            .then(data => {
                renderCoffees(data);
            })
            .catch(error => console.error("Veri yüklenirken hata oluştu:", error));
    }

    // 2. GELEN VERİLERİ KARTLARA DÖNÜŞTÜRÜP EKRANA BASAN FONKSİYON
    function renderCoffees(coffees) {
        if (!coffeeContainer) return;
        coffeeContainer.innerHTML = ""; 
        
        coffees.forEach(coffee => {
            const cardHTML = `
                <div class="col coffee-item" data-category="${coffee.category}" data-roast="${coffee.roast}">
                    <div class="card h-100 shadow-sm">
                        <img src="${coffee.img}" class="card-img-top" alt="${coffee.title}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${coffee.title}</h5>
                            <span class="badge ${coffee.badgeBg} mb-2">${coffee.badgeCategory}</span>
                            <span class="badge bg-dark mb-2">${coffee.roast}</span>
                            <p class="card-text text-muted small">${coffee.shortDesc}</p>
                            <button class="btn btn-sm btn-primary w-100" data-bs-toggle="modal" data-bs-target="#coffeeModal" data-title="${coffee.title}" data-desc="${coffee.longDesc}">Detayları Gör</button>
                        </div>
                    </div>
                </div>
            `;
            coffeeContainer.innerHTML += cardHTML;
        });
    }

    // 3. FİLTRELEME FONKSİYONU
    function filterCoffees() {
        const coffeeItems = document.querySelectorAll(".coffee-item");
        const searchText = searchInput.value.toLowerCase().trim();
        const selectedCategory = categorySelect.value;
        
        let selectedRoast = "all";
        roastRadios.forEach(radio => {
            if (radio.checked) selectedRoast = radio.value;
        });

        let visibleCount = 0;

        coffeeItems.forEach(item => {
            const cardTitle = item.querySelector(".card-title").textContent.toLowerCase();
            const itemCategory = item.getAttribute("data-category");
            const itemRoast = item.getAttribute("data-roast");

            const matchesSearch = cardTitle.includes(searchText);
            const matchesCategory = (selectedCategory === "all" || itemCategory === selectedCategory);
            const matchesRoast = (selectedRoast === "all" || itemRoast === selectedRoast);

            if (matchesSearch && matchesCategory && matchesRoast) {
                item.classList.remove("d-none");
                visibleCount++;
            } else {
                item.classList.add("d-none");
            }
        });

        if (visibleCount === 0) {
            noResultAlert.classList.remove("d-none");
        } else {
            noResultAlert.classList.add("d-none");
        }
    }

    // Olay Dinleyicileri
    searchInput.addEventListener("input", filterCoffees);
    categorySelect.addEventListener("change", filterCoffees);
    roastRadios.forEach(radio => radio.addEventListener("change", filterCoffees));

    resetBtn.addEventListener("click", function () {
        searchInput.value = "";
        categorySelect.value = "all";
        document.getElementById("roast-all").checked = true;
        filterCoffees();
    });

    // Modal Yönetimi
    const coffeeModal = document.getElementById('coffeeModal');
    if (coffeeModal) {
        coffeeModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const title = button.getAttribute('data-title');
            const desc = button.getAttribute('data-desc');
            
            const modalTitle = coffeeModal.querySelector('.modal-title');
            const modalBodyText = coffeeModal.querySelector('#modal-body-text');

            modalTitle.textContent = title;
            modalBodyText.textContent = desc;
        });
    }

    // Başlangıçta verileri yükle
    loadCoffees();
});