function initHomeSlider() {
  const slider = document.querySelector('.slider');
  if (!slider) return; // ✅ กัน error

  const nextBtn = slider.querySelector('.next');
  const prevBtn = slider.querySelector('.prev');

  const sliderList = slider.querySelector('.list');
  const thumbnail = slider.querySelector('.thumbnail');
  const thumbnailItems = thumbnail.querySelectorAll('.item');

  thumbnail.appendChild(thumbnailItems[0]);

  nextBtn.onclick = () => moveSlider('next');
  prevBtn.onclick = () => moveSlider('prev');

  function moveSlider(direction) {
    const sliderItems = sliderList.querySelectorAll('.item');
    const thumbItems = thumbnail.querySelectorAll('.item');

    if (direction === 'next') {
      sliderList.appendChild(sliderItems[0]);
      thumbnail.appendChild(thumbItems[0]);
      slider.classList.add('next');
    } else {
      sliderList.prepend(sliderItems[sliderItems.length - 1]);
      thumbnail.prepend(thumbItems[thumbItems.length - 1]);
      slider.classList.add('prev');
    }

    slider.addEventListener(
      'animationend',
      () => slider.classList.remove('next', 'prev'),
      { once: true }
    );
  }
}

// ================= MOBILE MENU OVERLAY =================
document.addEventListener("click", function (e) {
  const mobileMenu = document.querySelector("#mobileMenu");
  
  // 1. กดปุ่ม Hamburger เพื่อเปิดเมนู
  if (e.target.closest("#hamburger")) {
    if (mobileMenu) {
      mobileMenu.classList.add("show");
      document.body.style.overflow = "hidden"; // ล็อกไม่ให้หน้าเว็บเลื่อน
    }
  }

  // 2. กดปุ่ม X (กากบาท) เพื่อปิดเมนู
  if (e.target.closest("#closeMenu")) {
    if (mobileMenu) {
      mobileMenu.classList.remove("show");
      document.body.style.overflow = ""; // ปลดล็อกหน้าเว็บ
    }
  }

  // 3. ถ้ากดลิงก์ หรือปุ่มด้านใน Mobile Menu ให้ปิดเมนูอัตโนมัติ
  if (e.target.closest(".mobile-menu-links a") || e.target.closest(".logout-btn")) {
    if (mobileMenu && mobileMenu.classList.contains("show")) {
      mobileMenu.classList.remove("show");
      document.body.style.overflow = ""; // ปลดล็อกหน้าเว็บ
    }
  }
});

const toggle = document.getElementById("toggle");
const password = document.getElementById("password");

// เพิ่ม if ครอบไว้ เพื่อเช็กว่ามี element นี้อยู่บนหน้าเว็บจริงๆ ค่อยให้ทำงาน
if (toggle && password) {
  toggle.addEventListener("click", () => {
    if (password.type === "password") {
      password.type = "text";
      toggle.textContent = "🙈";
    } else {
      password.type = "password";
      toggle.textContent = "👁";
    }
  });
}

window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

function goSeller() {
  window.location.href = "seller.html";
}

document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.getElementById("sidebar-container");

  if (sidebar) {
    fetch("components/sidebar.html")
      .then(res => {
        // เช็กว่าการ fetch สำเร็จหรือไม่ (Status 200-299)
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.text();
      })
      .then(data => {
        // นำ HTML ที่ดึงมาได้ ไปแทรกใน div
        sidebar.innerHTML = data;
      })
      .catch(error => {
        // หากมี Error เช่น ติด CORS หรือหาไฟล์ไม่เจอ จะแสดงตรงนี้
        console.error("Error loading the sidebar:", error);
        sidebar.innerHTML = "<p style='color:red;'>Failed to load sidebar.</p>";
      });
  }
});


document.addEventListener("click", function (e) {
  
  // --- โค้ดส่วนที่ 1: ของเดิมที่คุณมี (ยุบ/ขยาย Sidebar) ---
  const brandBtn = e.target.closest(".brand");
  if (brandBtn) {
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main");
    if (sidebar) sidebar.classList.toggle("collapsed");
    if (mainContent) mainContent.classList.toggle("expanded");
  }

  // --- โค้ดส่วนที่ 2: เพิ่มใหม่ (Dropdown เมนูย่อย) ---
  const menuTitle = e.target.closest(".menu-title");
  if (menuTitle) {
    // หาตัว .submenu ที่อยู่ถัดจาก .menu-title ที่เรากด
    const submenu = menuTitle.nextElementSibling;
    
    // ถ้าหาเจอ ให้สลับคลาสเพื่อซ่อน/โชว์ และหมุนลูกศร
    if (submenu && submenu.classList.contains("submenu")) {
      submenu.classList.toggle("hidden");         // ซ่อน/โชว์ ลิงก์
      menuTitle.classList.toggle("collapsed-menu"); // หมุนลูกศร
    }
  }

});

// ==========================================
// ระบบ Slider สำหรับพื้นที่เด่นแนะนำ (รองรับการโหลดแบบ Component)
// ==========================================

// 1. ดักจับการคลิกปุ่ม Next / Prev
document.addEventListener('click', function(e) {
  const nextBtn = e.target.closest('.recommend-wrapper .nav-btn.next');
  const prevBtn = e.target.closest('.recommend-wrapper .nav-btn.prev');

  // ถ้าสิ่งที่คลิกคือปุ่มสไลด์
  if (nextBtn || prevBtn) {
    const wrapper = e.target.closest('.recommend-wrapper');
    const list = wrapper.querySelector('.recommend-list1');
    
    // ระยะเลื่อน (กว้าง 280 + ช่องว่าง 24 = 304px)
    const scrollAmount = 304; 

    if (nextBtn) {
      list.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    } else if (prevBtn) {
      list.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  }
});

// 2. ดักจับการเลื่อน (Scroll) เพื่อขยับแถบ Progress Bar
document.addEventListener('scroll', function(e) {
  // ตรวจสอบว่าสิ่งที่กำลังโดน scroll คือ .recommend-list1 หรือไม่
  if (e.target && e.target.classList && e.target.classList.contains('recommend-list1')) {
    const list = e.target;
    const wrapper = list.closest('.recommend-section1'); // หา container หลัก
    const progressBar = wrapper.querySelector('.progress');
    
    if (progressBar) {
      const maxScrollLeft = list.scrollWidth - list.clientWidth;
      if (maxScrollLeft > 0) {
        const scrollPercentage = (list.scrollLeft / maxScrollLeft) * 100;
        progressBar.style.width = `${scrollPercentage}%`;
      }
    }
  }
}, true); // ต้องมี true เพื่อดักจับ event scroll จาก element ลูกที่ถูกสร้างมาทีหลัง

// ==========================================
// ระบบ Modal ลงประกาศพื้นที่ (รองรับ SPA / Component)
// ==========================================

// ใช้ Event Delegation ดักจับการคลิกทั้งหน้าเว็บ
document.addEventListener('click', function(e) {
  
  // 1. กดปุ่มที่มีคลาส "announce-btn" เพื่อเปิด Modal
  if (e.target.closest('.announce-btn')) {
    e.preventDefault(); // กันปุ่ม submit ฟอร์ม
    
    // ย้ายการหา Element มาไว้ตรงนี้! (หาตอนที่กด)
    const modal = document.getElementById('announceModal');
    if (modal) {
      modal.classList.add('show');
    } else {
      console.log("หา Modal ไม่เจอ! ตรวจสอบว่า Component ที่มี id='announceModal' ถูกโหลดมาหรือยัง");
    }
  }
  
  // 2. กดปุ่ม X เพื่อปิด Modal
  if (e.target.closest('#btnCloseAnnounce')) {
    const modal = document.getElementById('announceModal');
    if (modal) modal.classList.remove('show');
  }

  // 3. กดพื้นที่สีดำด้านนอก Modal เพื่อปิด
  // เช็กว่าสิ่งที่คลิกคือตัว overlay สีดำโดยตรงหรือไม่
  if (e.target.classList && e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('show');
  }
  
});