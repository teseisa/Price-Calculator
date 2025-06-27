document.addEventListener("DOMContentLoaded", function () {
  // Inizialize Choices.js for custom dropdown
  const illustrationTypeSelect = document.getElementById("illustration-type");
  const choices = new Choices(illustrationTypeSelect, {
    // Wraps the whole dropdown component
    searchEnabled: false,
    itemSelectText: "",
    shouldSort: false,
    classNames: {
      containerOuter: "choices",
      containerInner: "choices__inner", // The visible box you click to open the dropdown
      list: "choices__list", // Holds all dropdown options
      listDropdown: "choices__list--dropdown", // The actual dropdown options
      item: "choices__item", // Every scalable option in the dropdown
      itemSelectable: "choices__item--selectable", // Marks an option as selectable
      highlightedState: "is-highlighted", // Option currently hovered or focused
      selectedState: "is-selected", // Option that is currently selected
    },
  });
  const illustrationRenderSelect = document.getElementById(
    "illustration-render"
  );
  const renderChoices = new Choices(illustrationRenderSelect, {
    searchEnabled: false,
    itemSelectText: "",
    shouldSort: false,
    classNames: {
      containerOuter: "choices",
      containerInner: "choices__inner",
      list: "choices__list",
      listDropdown: "choices__list--dropdown",
      item: "choices__item",
      itemSelectable: "choices__item--selectable",
      highlightedState: "is-highlighted",
      selectedState: "is-selected",
    },
  });

  // Toggle switches styling
  document.querySelectorAll(".toggle-service").forEach((toggle) => {
    toggle.addEventListener("change", function () {
      const serviceId = this.id.replace("toggle-", "");
      const optionsDiv = document.getElementById(`${serviceId}-options`);
      const serviceCard = document.getElementById(`service-${serviceId}`);

      if (this.checked) {
        optionsDiv.classList.remove("hidden");
        serviceCard.classList.add("active");
      } else {
        optionsDiv.classList.add("hidden");
        serviceCard.classList.remove("active");
      }

      updateSummary();
    });
  });

  // Style the toggle switches
  document.querySelectorAll(".toggle-service").forEach((toggle) => {
    toggle.addEventListener("change", function () {
      const dot = this.parentElement.querySelector(".dot");
      const block = this.parentElement.querySelector(".block");

      if (dot) {
        if (this.checked) {
          dot.classList.add("transform", "translate-x-6", "bg-blue-500");
        } else {
          dot.classList.remove("transform", "translate-x-6", "bg-blue-500");
          dot.classList.add("bg-white");
        }
      }

      // Only try to update block if it exists
      if (block) {
        if (this.checked) {
          block.classList.add("bg-blue-50");
          block.classList.remove("bg-black-20");
        } else {
          block.classList.remove("bg-blue-50");
          block.classList.add("bg-black-20");
        }
      }
    });
  });

  // Initialize toggle states
  document.querySelectorAll(".toggle-service").forEach((toggle) => {
    const event = new Event("change");
    toggle.dispatchEvent(event);
  });

  document.querySelectorAll("#extras-options .extras").forEach((checkbox) => {
    checkbox.addEventListener("change", updateSummary);
  });

  // Add listener for variable-price extras (e.g., Commercial License)
  document
    .querySelectorAll(
      "#extras-options input[type=checkbox].variable-price-extra"
    )
    .forEach((checkbox) => {
      checkbox.addEventListener("change", updateSummary);
    });

  // Add listener for contact preferences
  const contactPrefCheckboxes = document.querySelectorAll(
    "#extras-options .contact-pref"
  );
  contactPrefCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      if (this.checked) {
        // Uncheck other contact preference checkboxes
        contactPrefCheckboxes.forEach((otherCheckbox) => {
          if (otherCheckbox !== this) otherCheckbox.checked = false;
        });
      }
      updateSummary();
    });
  });

  // Sliders
  const extraCharacterSlider = document.getElementById(
    "extra-character-slider"
  );
  const extraCharacterValue = document.getElementById("extra-character");

  extraCharacterSlider.addEventListener("input", function () {
    extraCharacterValue.textContent = this.value;
    updateSummary();
  });

  // Other form elements
  illustrationTypeSelect.addEventListener("change", updateSummary);
  document
    .getElementById("illustration-render")
    .addEventListener("change", updateSummary);

  // Calculate and update summary
  function updateSummary() {
    let subtotal = 0;
    let extrasCost = 0;
    const summaryItems = document.getElementById("summary-items");
    summaryItems.innerHTML = "";
    const summaryExtras = document.getElementById("summary-extras");
    summaryExtras.innerHTML = "";
    const summaryInfo = document.getElementById("summary-info");
    summaryInfo.innerHTML = "";

    // --- Illustration calculation ---
    if (document.getElementById("toggle-session").checked) {
      // Get values
      const illustrationTypeValue = choices.getValue(true); // true = return value, not object
      const renderStyle = document.getElementById("illustration-render").value;
      const backgroundEnabled =
        document.getElementById("toggle-background").checked;

      // Base prices for each type + render style
      const basePrices = {
        headshot: {
          sketch: 15,
          shaded: 25,
          lineart: 30,
          simple: 50,
          full: 80,
        },
        "bust-up": {
          sketch: 20,
          shaded: 30,
          lineart: 35,
          simple: 55,
          full: 85,
        },
        "half-body": {
          sketch: 30,
          shaded: 40,
          lineart: 45,
          simple: 65,
          full: 95,
        },
        "thighs-up": {
          sketch: 35,
          shaded: 45,
          lineart: 50,
          simple: 70,
          full: 100,
        },
        "full-body": {
          sketch: 45,
          shaded: 55,
          lineart: 60,
          simple: 80,
          full: 110,
        },
        "full-piece": {
          sketch: 65,
          shaded: 75,
          lineart: 80,
          simple: 100,
          full: 130,
        },
        icons: {
          sketch: 30,
          shaded: 40,
          lineart: 45,
          simple: 65,
          full: 95,
        },
        basic: {
          sketch: 75,
          shaded: 85,
          lineart: 90,
          simple: 110,
          full: 140,
        },
        sfull: {
          sketch: 120,
          shaded: 130,
          lineart: 135,
          simple: 155,
          full: 205,
        },
      };

      // Background price
      const backgroundPrice = 40;

      // Calculate base price
      if (
        basePrices.hasOwnProperty(illustrationTypeValue) &&
        basePrices[illustrationTypeValue].hasOwnProperty(renderStyle)
      ) {
        basePrice = basePrices[illustrationTypeValue][renderStyle]; // This `basePrice` is for the main illustration
      }

      // Add illustration price to subtotal
      // The `basePrice` variable is declared at the top of the function scope,
      // so it correctly holds the illustration's base price for subsequent calculations (e.g., extra characters).
      subtotal += basePrice;

      // Labels for display
      const typeLabels = {
        headshot: "Headshot",
        "bust-up": "Bust Up",
        "half-body": "Half Body",
        "thighs-up": "Thighs Up",
        "full-body": "Full Body",
        "full-piece": "Full Piece",
        icons: "Matching Icons (2)",
        basic: "Character Design – Simple",
        sfull: "Character Design – Full",
      };
      const renderLabels = {
        sketch: "Sketch",
        shaded: "Sketch Shaded",
        lineart: "Lineart",
        simple: "Simple Render",
        full: "Full Render",
      };

      // Summary item
      const illustrationItem = document.createElement("div");
      illustrationItem.className = "flex justify-between summary-item";
      illustrationItem.innerHTML = `
      <div>
        <div class="font-medium">${
          typeLabels[illustrationTypeValue] || illustrationTypeValue
        } (${renderLabels[renderStyle] || renderStyle})</div>
        <div class="text-xs text-gray-400 mt-1 main-summary-only">Based on your selected composition and rendering level</div>
      </div>
      <div class="font-medium">$${basePrice.toFixed(0)}</div>
    `;
      summaryItems.appendChild(illustrationItem);

      // Add a separate summary item for the background if enabled
      if (backgroundEnabled) {
        subtotal += backgroundPrice; // Add background price to subtotal
        const backgroundItem = document.createElement("div");
        backgroundItem.className = "flex justify-between summary-item";
        backgroundItem.innerHTML = `
          <div>
            <div class="font-medium">Background</div>
            <div class="text-sm text-gray-500">Simple or abstract</div>
          </div>
          <div class="font-medium">$${backgroundPrice.toFixed(0)}</div>
        `;
        summaryItems.appendChild(backgroundItem);
      }
    }

    // Extras
    if (document.getElementById("toggle-extras").checked) {
      // --- Extra Characters ---
      const extraCharacters = parseInt(
        document.getElementById("extra-character-slider").value
      );
      if (extraCharacters > 0) {
        const extraCharacterCost = basePrice * extraCharacters;
        extrasCost += extraCharacterCost;

        const extraCharItem = document.createElement("div");
        extraCharItem.className =
          "flex justify-between summary-item text-gray-400";
        extraCharItem.innerHTML = `
          <span>${extraCharacters} Extra Character${
          extraCharacters > 1 ? "s" : ""
        }</span>
          <span>+$${extraCharacterCost.toFixed(0)}</span>
        `;
        summaryExtras.appendChild(extraCharItem);
      }

      // Checkboxes for extras
      const checkedExtras = document.querySelectorAll(
        "#extras-options input[type=checkbox].extras:checked"
      );
      checkedExtras.forEach((extra) => {
        const price = parseFloat(extra.dataset.price || 0);
        extrasCost += price;

        const label = extra.closest("label").querySelector(".ml-2").textContent;

        const extraItem = document.createElement("div");
        extraItem.className = "flex justify-between summary-item text-gray-400";
        extraItem.innerHTML = `
          <span>${label}</span>
          <span>+$${price.toFixed(0)}</span>
        `;
        summaryExtras.appendChild(extraItem);
      });

      // --- Contact Preference ---
      const contactCheckboxes = document.querySelectorAll(
        "#extras-options .contact-pref:checked"
      );
      if (contactCheckboxes.length > 0) {
        const selectedPreferences = Array.from(contactCheckboxes)
          .map((cb) => {
            const label = cb.closest("label").querySelector(".ml-2");
            return label ? label.textContent : "";
          })
          .join(", ");

        // Create a wrapper div for the contact preference with divider styles
        const contactWrapper = document.createElement("div");
        contactWrapper.className = "mt-4 pt-4 border-t"; // Add divider styles here

        const contactDetails = document.createElement("div");
        contactDetails.className = "flex justify-between";
        contactDetails.innerHTML = `
          <span>Contact Preference</span>
          <span class="font-medium text-right">${selectedPreferences}</span>
        `;
        contactWrapper.appendChild(contactDetails);
        summaryInfo.appendChild(contactWrapper);
      }

      // --- Commercial License (Variable Price) ---
      const commercialLicenseCheckbox = document.querySelector(
        "#extras-options input[type=checkbox].variable-price-extra"
      );
      if (commercialLicenseCheckbox && commercialLicenseCheckbox.checked) {
        const commercialLicenseItem = document.createElement("div");
        commercialLicenseItem.className =
          "flex justify-between summary-item text-gray-400";
        commercialLicenseItem.innerHTML = `
          <span>Commercial License</span>
          <span class="font-medium text-right">Not included</span>
        `;
        summaryExtras.appendChild(commercialLicenseItem);
      }
    }

    // Update totals
    document.getElementById("subtotal").textContent = `$${subtotal.toFixed(0)}`;
    document.getElementById("total").textContent = `$${(
      subtotal + extrasCost
    ).toFixed(0)} USD`;
  }

  // --- Helper function to generate email-safe HTML summary ---
  function getHTMLSummary(userName, userContact) {
    // Basic styles for email clients
    const bodyStyle = `font-family: Arial, sans-serif; font-size: 14px; color: #333333; line-height: 1.6;`;
    const tableStyle = `width: 100%; border-collapse: collapse; margin: 20px 0;`;
    const thStyle = `padding: 12px; text-align: left; background-color: #f2f2f2; border-bottom: 2px solid #dddddd; font-weight: bold;`;
    const tdStyle = `padding: 12px; border-bottom: 1px solid #eeeeee;`;
    const tdRightStyle = `${tdStyle} text-align: right;`;
    const totalRowStyle = `font-size: 18px; font-weight: bold; color: #4275B4;`; // Using the app's blue color

    let summaryHTML = `<div style="${bodyStyle}">`;
    summaryHTML += `<p>Hello Teseisa,</p><p>I'd like to request a quote with the following details:</p>`;
    summaryHTML += `<table style="${tableStyle}">`;

    // Table Header
    summaryHTML += `<tr><th style="${thStyle}">Item</th><th style="${thStyle} text-align: right;">Price</th></tr>`;

    // Main Items
    document
      .querySelectorAll("#summary-items .summary-item")
      .forEach((item) => {
        const mainTitle =
          item
            .querySelector("div:first-child > .font-medium")
            ?.textContent.trim() || "N/A";
        const price =
          item.querySelector("div:last-child")?.textContent.trim() || "$0";
        summaryHTML += `<tr><td style="${tdStyle}">${mainTitle}</td><td style="${tdRightStyle} font-weight: bold;">${price}</td></tr>`;
      });

    // Subtotal
    summaryHTML += `<tr><td style="${tdRightStyle}">Subtotal</td><td style="${tdRightStyle}">${
      document.getElementById("subtotal").textContent
    }</td></tr>`;

    // Extras
    document
      .querySelectorAll("#summary-extras .summary-item")
      .forEach((item) => {
        const label =
          item.querySelector("span:first-child")?.textContent.trim() || "N/A";
        const value =
          item.querySelector("span:last-child")?.textContent.trim() || "";
        summaryHTML += `<tr><td style="${tdRightStyle} color: #666666;">${label}</td><td style="${tdRightStyle} color: #666666;">${value}</td></tr>`;
      });

    // Total
    summaryHTML += `<tr><td style="${tdRightStyle} ${totalRowStyle}">Total</td><td style="${tdRightStyle} ${totalRowStyle}">${
      document.getElementById("total").textContent
    }</td></tr>`;
    summaryHTML += `</table>`;

    // Other Info
    const contactPrefDiv = document.querySelector("#summary-info > div");
    if (contactPrefDiv) {
      const prefLabel =
        contactPrefDiv
          .querySelector("div > span:first-child")
          ?.textContent.trim() || "";
      const prefValue =
        contactPrefDiv.querySelector("span:last-child")?.textContent.trim() ||
        "";
      if (prefLabel && prefValue) {
        summaryHTML += `<div style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #dddddd;">`;
        summaryHTML += `<p><strong>${prefLabel}:</strong> ${prefValue}</p>`;
        summaryHTML += `</div>`;
      }
    }

    // User Details
    summaryHTML += `<div style="margin-top: 20px;"><p><strong>From:</strong> ${userName}</p><p><strong>Contact:</strong> ${userContact}</p></div>`;
    summaryHTML += `<p>Thank you!</p>`;
    summaryHTML += `</div>`;

    return summaryHTML;
  }

  // Initial summary update
  updateSummary();

  // Modal functionality
  const quoteModal = document.getElementById("quote-modal");
  const requestQuoteBtn = document.getElementById("request-quote");
  const closeModalBtn = document.getElementById("close-modal");
  const quoteForm = document.getElementById("quote-form");
  const thankYouModal = document.getElementById("thank-you-modal");
  const closeThankYouModalBtn = document.getElementById(
    "close-thank-you-modal"
  );

  requestQuoteBtn.addEventListener("click", function () {
    // Populate modal summary
    const modalSummaryContent = document.getElementById(
      "modal-summary-content"
    );
    const mainSummaryContainer = document.getElementById("summary-container");

    // Clone the entire summary block's content and place it in the modal
    if (mainSummaryContainer && modalSummaryContent) {
      modalSummaryContent.innerHTML = mainSummaryContainer.innerHTML;

      // Find and remove the element that should only be in the main summary
      const elementToRemove =
        modalSummaryContent.querySelector(".main-summary-only");
      if (elementToRemove) {
        elementToRemove.remove();
      }
    }

    // Show modal
    quoteModal.classList.remove("hidden");
    quoteModal.classList.add("blur-overlay"); // Add blur to the modal's backdrop
    document.body.style.overflow = "hidden";
  });

  function closeModal() {
    quoteModal.classList.add("hidden");
    quoteModal.classList.remove("blur-overlay"); // Remove blur from the modal's backdrop
    // Hide validation error on close
    document.getElementById("modal-validation-error").classList.add("hidden");
    document.body.style.overflow = "auto";
  }

  closeModalBtn.addEventListener("click", closeModal);

  quoteForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

    const userNameInput = document.getElementById("user-name");
    const userContactInput = document.getElementById("user-contact");
    const validationError = document.getElementById("modal-validation-error");
    const sendBtn = document.getElementById("send-quote-btn");

    const userName = userNameInput.value.trim();
    const userContact = userContactInput.value.trim();

    // Basic validation
    if (!userName || !userContact) {
      validationError.classList.remove("hidden");
      return;
    }
    validationError.classList.add("hidden");

    // Generate and set the HTML summary for submission
    document.getElementById("modal-summary-text").value = getHTMLSummary(
      userName,
      userContact
    );

    // Set the custom subject for Formspree
    document.getElementById(
      "form-subject"
    ).value = `Quote Request from ${userName}`;

    const formData = new FormData(quoteForm);
    const formAction = quoteForm.action;
    const originalBtnText = sendBtn.textContent;
    sendBtn.textContent = "Sending...";
    sendBtn.disabled = true;

    fetch(formAction, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          quoteModal.classList.add("hidden");
          thankYouModal.classList.remove("hidden");
          quoteForm.reset(); // Clear the form for next time
        } else {
          alert(
            "Oops! There was a problem submitting your form. Please try again."
          );
        }
      })
      .catch((error) => {
        alert(
          "Oops! There was a network error. Please check your connection and try again."
        );
      })
      .finally(() => {
        // Restore button state
        sendBtn.textContent = originalBtnText;
        sendBtn.disabled = false;
      });
  });

  // Close modal when clicking outside
  quoteModal.addEventListener("click", function (e) {
    if (e.target === quoteModal) {
      closeModal();
    }
  });

  // --- Thank You Modal Logic ---
  function closeThankYouModal() {
    thankYouModal.classList.add("hidden");
    document.body.style.overflow = "auto";
  }

  closeThankYouModalBtn.addEventListener("click", closeThankYouModal);
  thankYouModal.addEventListener("click", function (e) {
    if (e.target === thankYouModal) {
      closeThankYouModal();
    }
  });
});
