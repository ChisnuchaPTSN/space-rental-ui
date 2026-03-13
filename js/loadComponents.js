function loadComponent(id, file, callback) {
  fetch(file)
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
      if (callback) callback();
    });
}

// Navbar
// Navbar
loadComponent('navbar', 'components/navbar.html', () => {
  setActiveLink();
  initNavIndicator(); // ✅ เพิ่ม

  initNavbarScrollEffect();
});

// Footer
loadComponent('footer', 'components/footer.html');

function setActiveLink() {
  const links = document.querySelectorAll('#navbar nav a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(link => {
    const linkPage = link.getAttribute('href');

    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNavIndicator();
});

function initNavIndicator() {
  // 1. แก้ Selector จาก #navbar เป็น .navbar หรือเลือก .nav-menu โดยตรง
  const menu = document.querySelector('.nav-menu');
  if (!menu) return;

  const indicator = menu.querySelector('.nav-indicator');
  const items = menu.querySelectorAll('a');

  function moveIndicator(el) {
    // 2. คำนวณตำแหน่งเทียบกับ Menu แม่
    const rect = el.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const extraPadding = 20;

    // 3. ตั้งค่า CSS ให้ Indicator วิ่งไปหา
    indicator.style.width = (rect.width + (extraPadding * 2)) + 'px';
    // ต้องลบ menuRect.left ออก เพื่อหาตำแหน่ง relative ภายในกล่อง menu
    indicator.style.left = (rect.left - menuRect.left - extraPadding) + 'px';
  }

  // --- Initial State ---
  // --- Initial State (แก้ไขส่วนนี้) ---

  // 1. ลองหาตัวที่มี class="active" ก่อน
  let currentActive = menu.querySelector('.active');

  // 2. ถ้าไม่มีตัวไหน active เลย ให้บังคับเลือกตัว Home
  if (!currentActive) {
    // หาจาก attribute data-page="home"
    currentActive = menu.querySelector('a[data-page="home"]');

    // ถ้าเจอ Home ให้เติม class active เข้าไป
    if (currentActive) {
      currentActive.classList.add('active');
    }
  }

  // 3. สั่งให้ Indicator วิ่งไปหาตำแหน่งนั้น
  if (currentActive) {
    // กรณีนี้จะใช้ฟังก์ชัน moveIndicator ตัวล่าสุดที่คุณแก้ (แบบขยายข้าง) ได้เลย
    moveIndicator(currentActive);
  }

  // --- Click Event ---
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      // ถ้าเป็นลิงก์ภายในหน้า (SPA) ให้กัน default
      if (item.getAttribute('href').startsWith('#')) {
        e.preventDefault();
      }

      // สลับ class active
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // สั่งเลื่อน Indicator
      moveIndicator(item);

      // ส่วนของการโหลดหน้า (ถ้ามีฟังก์ชัน loadPage)
      const page = item.dataset.page;
      if (typeof loadPage === 'function') {
        loadPage(page);
      }

      // Update URL (Optional)
      // history.pushState({ page }, '', `#${page}`);
    });
  });

  // --- 4. เพิ่ม Resize Listener ---
  // สำคัญ: เมื่อย่อขยายจอ ตำแหน่ง px จะเปลี่ยน ต้องคำนวณใหม่
  window.addEventListener('resize', () => {
    const activeItem = menu.querySelector('.active');
    if (activeItem) {
      // ปิด transition ชั่วคราวเพื่อให้มันขยับตามจอทันที ไม่หน่วง (Optional)
      indicator.style.transition = 'none';
      moveIndicator(activeItem);

      // คืนค่า transition กลับมา
      setTimeout(() => {
        indicator.style.transition = 'all 0.35s ease';
      }, 50);
    }
  });
}

window.addEventListener('popstate', () => {
  const page = location.hash.replace('#', '') || 'home';
  loadPage(page);

  const active = document.querySelector(
    `.nav-menu a[data-page="${page}"]`
  );

  if (active) {
    document.querySelectorAll('.nav-menu a')
      .forEach(a => a.classList.remove('active'));
    active.classList.add('active');
  }
});

function loadDetail(id) {
  const data = {
    3: {
      title: "ร้านค้าเชิงพาณิชย์ย่านสุขุมวิท",
      price: "45,000 บาท / เดือน"
    }
  };

  const titleEl = document.querySelector('.title');
  const priceEl = document.querySelector('.price');

  if (data[id]) {
    titleEl.innerText = data[id].title;
    priceEl.innerText = data[id].price;
  }
}



function loadPage(page, id = null) {
  document.body.className = '';
  document.body.classList.add(`page-${page}`);

  const navbar = document.getElementById('navbar');
  const footer = document.getElementById('footer');

  // ✅ เพิ่มการเช็กว่ามี navbar และ footer อยู่ในหน้าเว็บหรือไม่
  if (page === 'login' || page === 'register') {
    if (navbar) navbar.style.display = 'none';
    if (footer) footer.style.display = 'none';
  } else {
    if (navbar) navbar.style.display = 'block';
    if (footer) footer.style.display = 'block';
  }

  fetch(`pages/${page}.html`)
    .then(res => {
       if (!res.ok) throw new Error("ไม่พบไฟล์หน้าที่ต้องการโหลด");
       return res.text();
    })
    .then(html => {
      document.getElementById('content').innerHTML = html;
      window.scrollTo(0, 0);
      
      if (page === 'home') {
        initHomeSlider();
        initDetailButtons(); 
      }
      if (page === 'detail' && id) {
        loadDetail(id);
      }
      if (page === 'login' || page === 'register') {
        initPasswordToggle();
      }
    })
    .catch(err => console.error("โหลดหน้าไม่สำเร็จ:", err));
}



const initialPage = location.hash.replace('#', '') || 'home';
loadPage(initialPage);

function initDetailButtons() {
  const buttons = document.querySelectorAll('[data-page="detail"]');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      loadPage('detail', id);
    });
  });
}

function initNavbarScrollEffect() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

document.addEventListener("click", function (e) {
  const btn = e.target.closest("[data-page]");
  if (!btn) return;

  const page = btn.dataset.page;
  if (page && typeof loadPage === "function") {
    loadPage(page);
  }
});
