(function () {
  "use strict";

  var isMobile = {
    any: function () {
      return /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
    },
  };

  var fullHeight = function () {
    if (!isMobile.any()) {
      $(".js-fullheight").css("height", $(window).height());
      $(window).resize(function () {
        $(".js-fullheight").css("height", $(window).height());
      });
    }
  };

  var counterWayPoint = function () {
    // Counter animations disabled
    if ($("#colorlib-counter").length > 0 && typeof counter === 'function') {
      counter();
    }
  };

  var contentWayPoint = function () {
    // Animation system disabled - content shows immediately
    $(".animate-box").css("opacity", "1");
  };

  var burgerMenu = function () {
    $(".js-colorlib-nav-toggle").on("click", function (event) {
      event.preventDefault();
      var $this = $(this);
      $("body").toggleClass("offcanvas");
      $this.toggleClass("active");
    });
  };

  var mobileMenuOutsideClick = function () {
    $(document).click(function (e) {
      var container = $("#colorlib-aside, .js-colorlib-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        $("body").removeClass("offcanvas");
        $(".js-colorlib-nav-toggle").removeClass("active");
      }
    });

    $(window).scroll(function () {
      if ($("body").hasClass("offcanvas")) {
        $("body").removeClass("offcanvas");
        $(".js-colorlib-nav-toggle").removeClass("active");
      }
    });
  };

  var clickMenu = function () {
    $('#navbar a:not([class="external"])').click(function (event) {
      var section = $(this).data("nav-section"),
        navbar = $("#navbar");

      if ($('[data-section="' + section + '"]').length) {
        $("html, body").animate(
          {
            scrollTop: $('[data-section="' + section + '"]').offset().top - 55,
          },
          500
        );
      }

      if (navbar.is(":visible")) {
        navbar.removeClass("in");
        navbar.attr("aria-expanded", "false");
        $(".js-colorlib-nav-toggle").removeClass("active");
      }

      event.preventDefault();
      return false;
    });
  };

  var navActive = function (section) {
    var $el = $("#navbar > ul");
    $el.find("li").removeClass("active");
    $el.each(function () {
      $(this)
        .find('a[data-nav-section="' + section + '"]')
        .closest("li")
        .addClass("active");
    });
  };

  var navigationSection = function () {
    var $section = $("section[data-section]");

    $section.waypoint(
      function (direction) {
        if (direction === "down") {
          navActive($(this.element).data("section"));
        }
      },
      {
        offset: "150px",
      }
    );

    $section.waypoint(
      function (direction) {
        if (direction === "up") {
          navActive($(this.element).data("section"));
        }
      },
      {
        offset: function () {
          return -$(this.element).height() + 155;
        },
      }
    );
  };

  $(function () {
    fullHeight();
    counterWayPoint();
    contentWayPoint();
    burgerMenu();
    clickMenu();
    navigationSection();
    mobileMenuOutsideClick();
  });
})();

var Accordion = function (el, multiple) {
  this.el = el || {};
  this.multiple = multiple || false;
  var links = this.el.find(".link");
  links.on("click", { el: this.el, multiple: this.multiple }, this.dropdown);
};

Accordion.prototype.dropdown = function (e) {
  var $el = e.data.el;
  var $this = $(this), $next = $this.next();

  $next.slideToggle();
  $this.parent().toggleClass("open");

  if (!e.data.multiple) {
    $el.find(".submenu").not($next).slideUp().parent().removeClass("open");
  }
};

var accordion = new Accordion($("#accordion"), false);

// Add this after DOMContentLoaded or in your main.js
function renderFeaturedProjects() {
  // Use the global window.projects if available
  const projects = window.projects || [];
  const container = document.getElementById('featured-projects');
  if (!container || !projects.length) return;
  // Show 1 or 2 projects from the top
  const count = Math.min(2, projects.length);
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const p = projects[i];
    const card = document.createElement('div');
    card.className = 'featured-project-card';
    card.style = 'background: var(--white); border-radius: var(--border-radius-lg); box-shadow: var(--shadow); padding: 1.2em; margin-bottom: 1em; min-width: 220px; max-width: 340px; flex: 1 1 0; display: flex; flex-direction: column; gap: 0.7em;';
    card.innerHTML = `
      <div style="font-size: var(--font-size-lg); font-weight: var(--font-bold); color: var(--primary-color); margin-bottom: 0.3em;">${p.title}</div>
      <div style="font-size: var(--font-size-base); color: var(--gray-700); margin-bottom: 0.5em;">${p.description}</div>
      <div style="display: flex; flex-wrap: wrap; gap: 0.3em; margin-bottom: 0.5em;">
        ${(p.tags || []).slice(0, 3).map(tag => `<span style='background: var(--blue-50); color: var(--primary-color); border-radius: 999px; font-size: var(--font-size-xs); padding: 0.2em 0.7em; font-weight: var(--font-medium); border: 1px solid var(--primary-color);'>${tag}</span>`).join('')}
      </div>
      <div style="display: flex; gap: 0.5em;">
        ${p.sourceCodeUrl ? `<a href="${p.sourceCodeUrl}" target="_blank" style="background: var(--primary-color); color: #fff; border-radius: var(--border-radius-sm); padding: 0.4em 1em; font-size: var(--font-size-sm); font-weight: var(--font-semibold); text-decoration: none;">Source</a>` : ''}
        ${p.playableURL ? `<a href="${p.playableURL}" target="_blank" style="background: var(--accent-color); color: #fff; border-radius: var(--border-radius-sm); padding: 0.4em 1em; font-size: var(--font-size-sm); font-weight: var(--font-semibold); text-decoration: none;">Play</a>` : ''}
        ${p.youtubeUrl ? `<a href="${p.youtubeUrl}" target="_blank" style="background: var(--color-3); color: #fff; border-radius: var(--border-radius-sm); padding: 0.4em 1em; font-size: var(--font-size-sm); font-weight: var(--font-semibold); text-decoration: none;">YouTube</a>` : ''}
      </div>
    `;
    container.appendChild(card);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('featured-projects')) {
    // If projects are loaded async, you may want to wait or re-call this
    renderFeaturedProjects();
  }
});

// Smooth scroll for 'Art and Projects' nav link to Explore More section
const artProjectsNav = document.querySelector('a[data-nav-section="explore-more"]');
if (artProjectsNav) {
    artProjectsNav.addEventListener('click', function(e) {
        e.preventDefault();
        const exploreSection = document.querySelector('.colorlib-projects[data-section="projects"]');
        if (exploreSection) {
            exploreSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}
