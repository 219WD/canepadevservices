import { dataCombos } from "./dataCombos.js";

document.addEventListener("DOMContentLoaded", function () {
  const gallery = document.querySelector(".gallery");
  const blurryPrev = document.querySelector(".blurry-prev");
  const projectPreview = document.querySelector(".project-preview");
  const itemCount = dataCombos.length;

  let activeItemIndex = 0;
  let isAnimating = false;

  function createSplitText(element) {
    const container = document.createElement("div");
    container.className = "split-container";

    const splitText = new SplitType(element, { types: "lines" });

    splitText.lines.forEach((line) => {
      const lineDiv = document.createElement("div");
      lineDiv.className = "line";
      const lineSpan = document.createElement("span");
      lineSpan.textContent = line.textContent;
      lineDiv.appendChild(lineSpan);
      container.appendChild(lineDiv);
    });

    element.innerHTML = "";
    element.appendChild(container);
  }

  const initialInfoText = document.querySelector(".info p");
  if (initialInfoText) {
    createSplitText(initialInfoText);
  }

  const elementsToAnimate = document.querySelectorAll(
    ".title h1, .precio, .info p .line span, .caracteristicas p, .descripCombo p"
  );
  gsap.set(elementsToAnimate, {
    y: 0,
  });

  for (let i = 0; i < itemCount; i++) {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");
    if (i === 0) itemDiv.classList.add("active");

    const img = document.createElement("img");
    img.src = `./assets/img${i + 1}.jpg`;
    img.alt = dataCombos[i].title;

    itemDiv.appendChild(img);
    itemDiv.dataset.index = i;
    itemDiv.addEventListener("click", () => handleItemClick(i));
    gallery.appendChild(itemDiv);
  }

  function createElementWithClass(tag, className) {
    const element = document.createElement(tag);
    element.classList.add(className);
    return element;
  }

  function createProjectDetails(activeItem, index) {
    const newProjectDetails = createElementWithClass("div", "project-details");

    const detailsStructure = [
      { className: "title", tag: "h1", content: activeItem.title },
      { className: "precio", tag: "h2", content: ` ${activeItem.precio}` },
      { className: "info", tag: "p", content: activeItem.descripcion },
      { className: "caracteristicas", tag: "p", content: "Características" },
    ];

    detailsStructure.forEach(({ className, tag, content }) => {
      const div = createElementWithClass("div", className);
      const element = document.createElement(tag);
      element.textContent = content;
      div.appendChild(element);
      newProjectDetails.appendChild(div);
    });

    const servicesDiv = createElementWithClass("div", "decripCombo");
    const servicesList = document.createElement("ul");

    if (activeItem.servicios && Array.isArray(activeItem.servicios)) {
      activeItem.servicios.forEach((service) => {
        const li = document.createElement("li");
        li.textContent = service;
        servicesList.appendChild(li);
      });
    } else {
      console.warn("Servicios no definidos o no es un array.");
    }

    servicesDiv.appendChild(servicesList);
    newProjectDetails.appendChild(servicesDiv);

    const newProjectImg = createElementWithClass("div", "project-img");
    const newImg = document.createElement("img");
    newImg.src = `./assets/img${index + 1}.jpg`;
    newImg.alt = activeItem.title;
    newProjectImg.appendChild(newImg);

    return {
      newProjectDetails,
      newProjectImg,
      infoP: newProjectDetails.querySelector(".info p"),
    };
  }

  function handleItemClick(index) {
    if (index === activeItemIndex || isAnimating) return;

    isAnimating = true;

    const activeItem = dataCombos[index];

    gallery.children[activeItemIndex].classList.remove("active");
    gallery.children[index].classList.add("active");
    activeItemIndex = index;

    const elementsToAnimate = document.querySelectorAll(
      ".title h1, .precio, .info p .line span, .caracteristicas p, .descripCombo p"
    );

    const currentProjectImg = document.querySelector(".project-img");
    const currentProjectImgElem = currentProjectImg.querySelector("img");

    const newBlurryImg = document.createElement("img");
    newBlurryImg.src = `./assets/img${index + 1}.jpg`;
    newBlurryImg.alt = activeItem.title;
    gsap.set(newBlurryImg, {
      opacity: 0,
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
    });
    blurryPrev.insertBefore(newBlurryImg, blurryPrev.firstChild);

    const currentBlurryImg = blurryPrev.querySelector("img:nth-child(2)");
    if (currentBlurryImg) {
      gsap.to(currentBlurryImg, {
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "power2.inOut",
        onComplete: () => blurryPrev.removeChild(currentBlurryImg),
      });
    }

    gsap.to(newBlurryImg, {
      delay: 0.5,
      opacity: 1,
      duration: 1,
      ease: "power2.inOut",
    });

    gsap.to(elementsToAnimate, {
      y: -60,
      duration: 1,
      ease: "power4.in",
      stagger: 0.05,
    });

    gsap.to(currentProjectImg, {
      onStart: () => {
        gsap.to(currentProjectImgElem, {
          scale: 2,
          duration: 1,
          ease: "power4.in",
        });
      },
      scale: 0,
      bottom: "10em",
      duration: 1,
      ease: "power4.in",
      onComplete: function () {
        document.querySelector(".project-details")?.remove();
        currentProjectImg.remove();

        const { newProjectDetails, newProjectImg, infoP } =
          createProjectDetails(activeItem, index);

        projectPreview.appendChild(newProjectDetails);
        projectPreview.appendChild(newProjectImg);

        createSplitText(infoP);

        const newElementsToAnimate = newProjectDetails.querySelectorAll(
          ".title h1, .precio, .info p .line span, .caracteristicas p, .descripCombo p"
        );

        gsap.fromTo(
          newElementsToAnimate,
          { y: 40 },
          {
            y: 0,
            duration: 1,
            ease: "power4.out",
            stagger: 0.05,
          }
        );

        gsap.fromTo(
          newProjectImg,
          { scale: 0, bottom: "-10em" },
          {
            scale: 1,
            bottom: "1em",
            duration: 1,
            ease: "power4.out",
          }
        );

        gsap.fromTo(
          newProjectImg.querySelector("img"),
          { scale: 2 },
          {
            scale: 1,
            duration: 1,
            ease: "power4.out",
            onComplete: () => {
              isAnimating = false;
            },
          }
        );
      },
    });
  }
});
