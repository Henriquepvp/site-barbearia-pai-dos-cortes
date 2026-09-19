(() => {
  "use strict";

  // Número do WhatsApp da barbearia (formato internacional, sem + ou espaços).
  const whatsappNumber = "5561981055589";

  const body = document.body;
  const menuToggle = document.querySelector(".menu-toggle");
  const mainMenu = document.querySelector(".main-nav");
  const bookingForm = document.querySelector("#booking-form");
  const dateInput = document.querySelector("#date");
  const timeSelect = document.querySelector("#time");
  const feedback = document.querySelector("#form-feedback");
  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector("#lightbox-image");
  const lightboxTitle = document.querySelector("#lightbox-title");

  /* ------------------------------------------------------------------
   * Datas e horários
   * ------------------------------------------------------------------ */

  // Data de hoje no formato AAAA-MM-DD, usando o horário local do visitante.
  const getTodayISO = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Converte textos como "09:00", "9:30" ou "9h" em minutos desde 00:00.
  // Retorna null quando o texto não é um horário (ex.: opção "Selecione").
  const parseTimeToMinutes = (value) => {
    const match = String(value || "").match(/(\d{1,2})\s*(?::|h)\s*(\d{2})?/i);
    if (!match) return null;
    return Number(match[1]) * 60 + Number(match[2] || 0);
  };

  const getNowMinutes = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  };

  const isPastDate = (dateValue) => {
    if (!dateValue) return true;
    const selectedDate = new Date(`${dateValue}T12:00:00`);
    const today = new Date(`${getTodayISO()}T12:00:00`);
    return selectedDate < today;
  };

  // Verdadeiro quando a data é hoje e o horário escolhido já passou.
  const isPastTimeToday = (dateValue, timeValue) => {
    if (dateValue !== getTodayISO()) return false;
    const minutes = parseTimeToMinutes(timeValue);
    return minutes !== null && minutes <= getNowMinutes();
  };

  /* ------------------------------------------------------------------
   * Menu mobile
   * ------------------------------------------------------------------ */

  const closeMenu = () => {
    if (!menuToggle || !mainMenu) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    mainMenu.classList.remove("is-open");
    body.classList.remove("menu-open");
  };

  if (menuToggle && mainMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Abrir menu" : "Fechar menu",
      );
      mainMenu.classList.toggle("is-open", !isOpen);
      body.classList.toggle("menu-open", !isOpen);
    });

    mainMenu
      .querySelectorAll("a")
      .forEach((link) => link.addEventListener("click", closeMenu));
  }

  /* ------------------------------------------------------------------
   * Formulário de agendamento
   * ------------------------------------------------------------------ */

  if (dateInput) {
    dateInput.min = getTodayISO();
  }

  const showFeedback = (message, type = "success") => {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.classList.toggle("error", type === "error");
  };

  // Desabilita os horários que já passaram quando a data escolhida é hoje.
  const updateTimeOptions = () => {
    if (!timeSelect || !dateInput) return;

    const isToday = dateInput.value === getTodayISO();
    const nowMinutes = getNowMinutes();
    let availableCount = 0;

    Array.from(timeSelect.options).forEach((option) => {
      const minutes = parseTimeToMinutes(option.value);
      if (minutes === null) return; // ignora a opção "Selecione"
      option.disabled = isToday && minutes <= nowMinutes;
      if (!option.disabled) availableCount += 1;
    });

    // Se o horário que estava selecionado ficou indisponível, limpa a escolha.
    if (timeSelect.selectedOptions[0]?.disabled) {
      timeSelect.value = "";
    }

    if (isToday && availableCount === 0) {
      showFeedback(
        "Não há mais horários disponíveis hoje. Escolha outro dia.",
        "error",
      );
    } else {
      showFeedback("");
    }
  };

  dateInput?.addEventListener("change", updateTimeOptions);
  updateTimeOptions();

  if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();
      showFeedback("");

      if (!bookingForm.checkValidity()) {
        bookingForm.reportValidity();
        showFeedback(
          "Confira os campos obrigatórios antes de continuar.",
          "error",
        );
        return;
      }

      const formData = new FormData(bookingForm);
      const name = String(formData.get("name") || "").trim();
      const serviceValue = String(formData.get("service") || "");
      const dateValue = String(formData.get("date") || "");
      const time = String(formData.get("time") || "");
      const serviceOption = document.querySelector(
        `#service option[value="${CSS.escape(serviceValue)}"]`,
      );
      const serviceLabel = serviceOption
        ? serviceOption.textContent.split(" —")[0]
        : serviceValue;

      if (isPastDate(dateValue)) {
        showFeedback("Escolha uma data de hoje ou futura.", "error");
        dateInput?.focus();
        return;
      }

      // Segunda barreira: mesmo que a opção seja reabilitada pelo navegador,
      // o envio é bloqueado se o horário de hoje já passou.
      if (isPastTimeToday(dateValue, time)) {
        showFeedback(
          "Esse horário já passou. Escolha um horário mais tarde ou outro dia.",
          "error",
        );
        timeSelect?.focus();
        return;
      }

      const formattedDate = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(`${dateValue}T12:00:00`));

      const message = `Olá! Gostaria de agendar ${serviceLabel} no dia ${formattedDate} às ${time}. Meu nome é ${name}.`;
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      showFeedback("Mensagem pronta. O WhatsApp será aberto em uma nova aba.");
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    });
  }

  /* ------------------------------------------------------------------
   * Galeria e lightbox
   * ------------------------------------------------------------------ */

  const openLightbox = (image, label) => {
    if (!lightbox || !lightboxImage || !lightboxTitle) return;
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxTitle.textContent = label;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    body.classList.add("lightbox-open");
    lightbox.querySelector(".lightbox-close")?.focus();
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImage) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    // removeAttribute evita uma requisição desnecessária que um src vazio pode causar.
    lightboxImage.removeAttribute("src");
    body.classList.remove("lightbox-open");
  };

  document.querySelectorAll(".gallery-item").forEach((item) => {
    const image = item.querySelector("img");
    const label =
      item.querySelector(".gallery-label")?.textContent || "Foto do corte";
    if (!image) return;

    image.addEventListener("load", () => item.classList.add("has-image"));
    image.addEventListener("error", () => item.classList.add("is-placeholder"));

    // Cobre o caso em que a imagem já terminou de carregar (ou falhar)
    // antes de os listeners acima serem registrados.
    if (image.complete) {
      item.classList.add(
        image.naturalWidth > 0 ? "has-image" : "is-placeholder",
      );
    }

    item.addEventListener("click", () => {
      if (!item.classList.contains("has-image")) return;
      openLightbox(image, label);
    });
  });

  lightbox?.querySelectorAll("[data-lightbox-close]").forEach((element) => {
    element.addEventListener("click", closeLightbox);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      closeLightbox();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) closeMenu();
  });
})();
