$(document).ready(function ($) {
    "use strict";


    var book_table = new Swiper(".book-table-img-slider", {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        speed: 2000,
        effect: "coverflow",
        coverflowEffect: {
            rotate: 3,
            stretch: 2,
            depth: 100,
            modifier: 5,
            slideShadows: false,
        },
        loopAdditionSlides: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });

    var team_slider = new Swiper(".team-slider", {
        slidesPerView: 3,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        speed: 2000,

        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            0: {
                slidesPerView: 1.2,
            },
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 3,
            },
        },
    });

    jQuery(".filters").on("click", function () {
        jQuery("#menu-dish").removeClass("bydefault_show");
    });
    $(function () {
        var filterList = {
            init: function () {
                $("#menu-dish").mixItUp({
                    selectors: {
                        target: ".dish-box-wp",
                        filter: ".filter",
                    },
                    animation: {
                        effects: "fade",
                        easing: "ease-in-out",
                    },
                    load: {
                        filter: ".all, .breakfast, .lunch, .dinner",
                    },
                });
            },
        };
        filterList.init();
    });

    jQuery(".menu-toggle").click(function () {
        jQuery(".main-navigation").toggleClass("toggled");
    });

    jQuery(".header-menu ul li a").click(function () {
        jQuery(".main-navigation").removeClass("toggled");
    });

    gsap.registerPlugin(ScrollTrigger);

    var elementFirst = document.querySelector('.site-header');
    ScrollTrigger.create({
        trigger: "body",
        start: "30px top",
        end: "bottom bottom",

        onEnter: () => myFunction(),
        onLeaveBack: () => myFunction(),
    });

    function myFunction() {
        elementFirst.classList.toggle('sticky_head');
    }

    var scene = $(".js-parallax-scene").get(0);
    var parallaxInstance = new Parallax(scene);


});


jQuery(window).on('load', function () {
    $('body').removeClass('body-fixed');

    //activating tab of filter
    let targets = document.querySelectorAll(".filter");
    let activeTab = 0;
    let old = 0;
    let dur = 0.4;
    let animation;

    for (let i = 0; i < targets.length; i++) {
        targets[i].index = i;
        targets[i].addEventListener("click", moveBar);
    }

    // initial position on first === All 
    gsap.set(".filter-active", {
        x: targets[0].offsetLeft,
        width: targets[0].offsetWidth
    });

    function moveBar() {
        if (this.index != activeTab) {
            if (animation && animation.isActive()) {
                animation.progress(1);
            }
            animation = gsap.timeline({
                defaults: {
                    duration: 0.4
                }
            });
            old = activeTab;
            activeTab = this.index;
            animation.to(".filter-active", {
                x: targets[activeTab].offsetLeft,
                width: targets[activeTab].offsetWidth
            });

            animation.to(targets[old], {
                color: "#0d0d25",
                ease: "none"
            }, 0);
            animation.to(targets[activeTab], {
                color: "#fff",
                ease: "none"
            }, 0);

        }

    }
});
/* ===== Master Chef Shopping Cart ===== */

(() => {
    "use strict";

    const cart = {};
    const WHATSAPP_PHONE = "201025072161";

    function getProduct(card) {
        const name = card.querySelector(".dish-title h3")?.textContent.trim();
        const priceText = card.querySelector(".dist-bottom-row b")?.textContent || "";
        const price = Number(priceText.replace(/[^\d.]/g, ""));

        if (!name || !Number.isFinite(price) || price <= 0) {
            alert("مش قادر أقرأ اسم الأكلة أو سعرها. راجع كود الأكلة في HTML.");
            return null;
        }

        return { name, price };
    }

    function getTotal() {
        return Object.values(cart).reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );
    }

    function getCount() {
        return Object.values(cart).reduce(
            (sum, item) => sum + item.quantity, 0
        );
    }

    function createCartUI() {
        if (!document.getElementById("master-chef-cart-status")) {
            const status = document.createElement("button");
            status.id = "master-chef-cart-status";
            status.type = "button";
            status.style.cssText =
                "position:fixed;bottom:20px;right:20px;z-index:99999;" +
                "background:#ff8243;color:white;padding:13px 18px;" +
                "border:0;border-radius:12px;box-shadow:0 4px 15px #0002;" +
                "font-weight:bold;cursor:pointer;direction:rtl;display:none;";
            status.addEventListener("click", openCart);
            document.body.appendChild(status);
        }

        if (!document.getElementById("master-chef-cart-modal")) {
            const modal = document.createElement("div");
            modal.id = "master-chef-cart-modal";
            modal.style.cssText =
                "position:fixed;inset:0;z-index:100000;" +
                "background:rgba(0,0,0,.6);display:none;" +
                "align-items:center;justify-content:center;padding:15px;";

            modal.innerHTML = `
                <div style="background:white;color:#222;width:100%;max-width:500px;
                    max-height:85vh;overflow:auto;padding:22px;border-radius:18px;
                    direction:rtl;font-family:Arial,sans-serif">
                    <div style="display:flex;justify-content:space-between;align-items:center">
                        <h2 style="margin:0">🛒 سلة مشترياتك</h2>
                        <button type="button" id="master-chef-close"
                            style="border:0;background:#eee;padding:8px 12px;
                            border-radius:8px;cursor:pointer">✕</button>
                    </div>
                    <div id="master-chef-cart-items" style="margin-top:20px"></div>
                    <hr>
                    <h3 id="master-chef-cart-total">الإجمالي: 0 جنيه</h3>
                    <button type="button" id="master-chef-checkout"
                        style="width:100%;padding:14px;background:#25D366;color:white;
                        border:0;border-radius:10px;font-size:17px;cursor:pointer">
                        إتمام الطلب عبر واتساب
                    </button>
                </div>`;

            document.body.appendChild(modal);

            modal.addEventListener("click", event => {
                if (event.target === modal ||
                    event.target.closest("#master-chef-close")) {
                    modal.style.display = "none";
                }
            });

            modal.querySelector("#master-chef-cart-items")
                .addEventListener("click", event => {
                    const button = event.target.closest("button[data-action]");
                    if (!button) return;

                    const item = cart[button.dataset.name];
                    if (!item) return;

                    if (button.dataset.action === "plus") item.quantity++;
                    if (button.dataset.action === "minus") item.quantity--;
                    if (button.dataset.action === "remove" || item.quantity <= 0) {
                        delete cart[button.dataset.name];
                    }

                    renderCart();
                });

            modal.querySelector("#master-chef-checkout")
                .addEventListener("click", checkout);
        }
    }

    function updateStatus() {
        const status = document.getElementById("master-chef-cart-status");
        const count = getCount();

        status.style.display = count ? "block" : "none";
        status.textContent = `🛒 السلة: ${count} قطعة | الإجمالي: ${getTotal().toFixed(2)} جنيه`;
    }

    function renderCart() {
        const modal = document.getElementById("master-chef-cart-modal");
        const container = modal.querySelector("#master-chef-cart-items");
        const totalElement = modal.querySelector("#master-chef-cart-total");

        container.replaceChildren();
        const entries = Object.entries(cart);

        if (!entries.length) {
            container.textContent = "السلة فارغة، اختار أكلة من المنيو.";
        }

        entries.forEach(([name, item]) => {
            const row = document.createElement("div");
            row.style.cssText = "padding:12px 0;border-bottom:1px solid #eee";

            const title = document.createElement("strong");
            title.textContent = name;

            const details = document.createElement("p");
            details.textContent =
                `${item.price.toFixed(2)} جنيه × ${item.quantity} = ` +
                `${(item.price * item.quantity).toFixed(2)} جنيه`;

            row.append(title, details);

            [
                ["minus", "−"],
                ["plus", "+"],
                ["remove", "حذف"]
            ].forEach(([action, label]) => {
                const button = document.createElement("button");
                button.type = "button";
                button.textContent = label;
                button.dataset.action = action;
                button.dataset.name = name;
                button.style.cssText =
                    "margin-left:8px;padding:7px 12px;border:0;" +
                    "border-radius:7px;background:#f1f1f1;cursor:pointer";
                row.appendChild(button);
            });

            container.appendChild(row);
        });

        totalElement.textContent = `الإجمالي: ${getTotal().toFixed(2)} جنيه`;
        updateStatus();
    }

    function openCart() {
        createCartUI();
        renderCart();
        document.getElementById("master-chef-cart-modal").style.display = "flex";
    }

    function checkout() {
        const entries = Object.entries(cart);

        if (!entries.length) {
            alert("السلة فاضية! اختار أكلة الأول.");
            return;
        }

        let message = "السلام عليكم، عاوز أطلب من المطعم:\n\n";

        entries.forEach(([name, item]) => {
            message += `${name} × ${item.quantity} = ` +
                `${(item.price * item.quantity).toFixed(2)} جنيه\n`;
        });

        message += `\nالإجمالي: ${getTotal().toFixed(2)} جنيه`;

        const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    }

    document.addEventListener("click", event => {
        const button = event.target.closest(
            "#menu-dish .dish-add-btn, #menu-dish [data-cart-add]"
        );

        if (!button) return;

        event.preventDefault();

        const card = button.closest(".dish-box-wp");
        if (!card) return;

        const product = getProduct(card);
        if (!product) return;

        if (cart[product.name]) {
            cart[product.name].quantity++;
        } else {
            cart[product.name] = { ...product, quantity: 1 };
        }

        createCartUI();
        renderCart();
        openCart();
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", createCartUI);
    } else {
        createCartUI();
    }
})();