const header = document.querySelector("[data-header]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxTitle = document.querySelector("[data-lightbox-title]");
const serviceMenu = document.querySelector("[data-service-menu]");
const techSelector = document.querySelector("[data-tech-selector]");
const calendarDays = document.querySelector("[data-calendar-days]");
const slotGrid = document.querySelector("[data-slot-grid]");
const bookingSummary = document.querySelector("[data-booking-summary]");
const whatsappLink = document.querySelector("[data-whatsapp-link]");

const phoneUrl = "https://wa.me/523310674369";

const services = [
  {
    id: "gel",
    name: "Manicura con gel",
    price: "$320 MXN",
    duration: "60 min",
    note: "Color limpio, brillo y acabado pulido."
  },
  {
    id: "french",
    name: "Francés / baby boomer",
    price: "$420 MXN",
    duration: "75 min",
    note: "Clásico, cromado o con líneas finas."
  },
  {
    id: "design",
    name: "Diseño personalizado",
    price: "$520 MXN",
    duration: "95 min",
    note: "Arte, corazones, flores, cristales o charms."
  },
  {
    id: "effects",
    name: "Efectos especiales",
    price: "$480 MXN",
    duration: "85 min",
    note: "Cat eye, glitter, encapsulado o metálico."
  }
];

const techs = [
  { id: "vale", name: "Valeria", hint: "Manicurista" }
];

const baseSlots = {
  vale: [
    ["10:00", "12:30", "16:00"],
    ["11:00", "13:30", "17:00"],
    ["10:30", "15:30"],
    ["12:00", "16:30", "18:00"],
    ["11:30", "14:30"],
    ["10:00", "13:00", "15:00"],
    []
  ]
};

const state = {
  serviceId: services[0].id,
  techId: "vale",
  dayIndex: 0,
  slot: ""
};

const formatDate = (date) =>
  new Intl.DateTimeFormat("es-MX", {
    weekday: "short",
    day: "numeric",
    month: "short"
  }).format(date);

const upcomingDays = Array.from({ length: 7 }, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() + index + 1);
  return {
    index,
    label: index === 0 ? "Mañana" : formatDate(date),
    value: date.toLocaleDateString("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "long"
    })
  };
});

const getService = () => services.find((service) => service.id === state.serviceId);

const getSlots = () => {
  return (baseSlots.vale[state.dayIndex] || []).map((time) => ({
    time,
    techs: ["vale"]
  }));
};

const makeWhatsAppMessage = () => {
  const service = getService();
  const day = upcomingDays[state.dayIndex];
  const slotText = state.slot || "un horario disponible";

  return `Hola Vale Nails, quiero reservar ${service.name} (${service.price}, ${service.duration}) para ${day.value} a las ${slotText} con Valeria.`;
};

const updateWhatsAppLink = () => {
  const message = encodeURIComponent(makeWhatsAppMessage());
  whatsappLink.href = `${phoneUrl}?text=${message}`;
};

const renderServices = () => {
  serviceMenu.innerHTML = services
    .map(
      (service) => `
        <button class="choice-card ${service.id === state.serviceId ? "is-selected" : ""}" type="button" data-service="${service.id}">
          <strong>${service.name}</strong>
          <span>${service.price} · ${service.duration}</span>
          <small>${service.note}</small>
        </button>
      `
    )
    .join("");
};

const renderTechs = () => {
  techSelector.innerHTML = techs
    .map(
      (tech) => `
        <button class="tech-option ${tech.id === state.techId ? "is-selected" : ""}" type="button" data-tech="${tech.id}">
          <strong>${tech.name}</strong>
          <span>${tech.hint}</span>
        </button>
      `
    )
    .join("");
};

const renderDays = () => {
  calendarDays.innerHTML = upcomingDays
    .map(
      (day) => `
        <button class="day-option ${day.index === state.dayIndex ? "is-selected" : ""}" type="button" data-day="${day.index}">
          <strong>${day.label}</strong>
          <span>${getSlotsForDay(day.index)} horarios</span>
        </button>
      `
    )
    .join("");
};

const getSlotsForDay = (dayIndex) => {
  const previousDay = state.dayIndex;
  state.dayIndex = dayIndex;
  const count = getSlots().length;
  state.dayIndex = previousDay;
  return count;
};

const renderSlots = () => {
  const slots = getSlots();

  if (!slots.length) {
    slotGrid.innerHTML = `<p class="empty-slots">Valeria no tiene horarios disponibles ese día. Prueba con otra fecha.</p>`;
    state.slot = "";
    return;
  }

  if (!slots.some((slot) => slot.time === state.slot)) {
    state.slot = slots[0].time;
  }

  slotGrid.innerHTML = slots
    .map((slot) => {
      return `
        <button class="slot-option ${slot.time === state.slot ? "is-selected" : ""}" type="button" data-slot="${slot.time}">
          <strong>${slot.time}</strong>
          <span>Valeria</span>
        </button>
      `;
    })
    .join("");
};

const renderSummary = () => {
  const service = getService();
  const day = upcomingDays[state.dayIndex];
  const slot = state.slot || "elige un horario";

  bookingSummary.innerHTML = `
    <strong>${service.name}</strong>
    <span>${service.price} · ${service.duration}</span>
    <span>${day.value} · ${slot} · Valeria</span>
  `;
  updateWhatsAppLink();
};

const renderBooking = () => {
  if (!serviceMenu || !techSelector || !calendarDays || !slotGrid) return;

  renderServices();
  renderTechs();
  renderDays();
  renderSlots();
  renderSummary();
};

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
});

serviceMenu?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-service]");
  if (!button) return;
  state.serviceId = button.dataset.service;
  renderBooking();
});

techSelector?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-tech]");
  if (!button) return;
  state.techId = button.dataset.tech;
  state.slot = "";
  renderBooking();
});

calendarDays?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-day]");
  if (!button) return;
  state.dayIndex = Number(button.dataset.day);
  state.slot = "";
  renderBooking();
});

slotGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-slot]");
  if (!button) return;
  state.slot = button.dataset.slot;
  renderBooking();
});

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = item.querySelector("img").alt;
    lightboxTitle.textContent = item.dataset.title;
    lightbox.showModal();
  });
});

document.querySelector("[data-close]")?.addEventListener("click", () => {
  lightbox.close();
});

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

renderBooking();
