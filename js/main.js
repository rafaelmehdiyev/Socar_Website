"use strict";

(function ($) {
  var $body = $("body");
  var $window = $(window);

  
  
  function menuHideExtraElements() {
    
    $(".sf-more-li, .sf-logo-li").remove();
    var windowWidth = $("body").innerWidth();

    $(".sf-menu").each(function () {
      var $thisMenu = $(this);
      var $menuWraper = $thisMenu.closest(".top-nav");
      $menuWraper.attr("style", "");
      if (windowWidth > 1199) {
        
        var $menuLis = $menuWraper.find(".sf-menu > li");
        $menuLis.removeClass("sf-xl-hidden");

        var $headerLogoCenter = $thisMenu.closest(".header_logo_center");
        var logoWidth = 0;
        var summaryLiWidth = 0;

        if ($headerLogoCenter.length) {
          var $logo = $headerLogoCenter.find(".logo");
          
          logoWidth = $logo.outerWidth(true) + 70;
        }

        
        var wrapperWidth = $menuWraper.outerWidth(true);
        $menuLis.each(function (index) {
          
          var elementWidth = $(this).outerWidth() + 4;
          summaryLiWidth += elementWidth;
          if (summaryLiWidth >= wrapperWidth - logoWidth) {
            var $newLi = $('<li class="sf-more-li"><a>...</a><ul></ul></li>');
            $($menuLis[index - 1]).before($newLi);
            var newLiWidth = $($newLi).outerWidth(true);
            var $extraLiElements = $menuLis.filter(":gt(" + (index - 2) + ")");
            $extraLiElements.clone().appendTo($newLi.find("ul"));
            $extraLiElements.addClass("sf-xl-hidden");
            return false;
          }
        });

        
        if ($headerLogoCenter.length) {
          var $menuLisVisible = $headerLogoCenter.find(
            ".sf-menu > li:not(.sf-xl-hidden)"
          );
          var menuLength = $menuLisVisible.length;
          var summaryLiVisibleWidth = 0;
          $menuLisVisible.each(function () {
            summaryLiVisibleWidth += $(this).outerWidth();
          });

          var centerLi = Math.floor(menuLength / 2);
          if (menuLength % 2 === 0) {
            centerLi--;
          }
          var $liLeftFromLogo = $menuLisVisible.eq(centerLi);
          $liLeftFromLogo.after(
            '<li class="sf-logo-li"><a href="#">&nbsp;</a></li>'
          );
          $headerLogoCenter.find(".sf-logo-li").width(logoWidth);
          var liLeftRightDotX =
            $liLeftFromLogo.offset().left + $liLeftFromLogo.outerWidth();
          var logoLeftDotX = windowWidth / 2 - logoWidth / 2;
          var menuLeftOffset = liLeftRightDotX - logoLeftDotX;
          $menuWraper.css({ left: -menuLeftOffset });
        }
      } 
    }); 
  } 

  function initMegaMenu(timeOut) {
    var $megaMenu = $(".top-nav .mega-menu");
    if ($megaMenu.length) {
      setTimeout(function () {
        var windowWidth = $("body").innerWidth();
        if (windowWidth > 991) {
          $megaMenu.each(function () {
            var $thisMegaMenu = $(this);
            
            $thisMegaMenu.css({ display: "block", left: "auto" });

            
            var stickedSideHeaderWidth = 0;
            var $stickedSideHeader = $(".header_side_sticked");
            if (
              $stickedSideHeader.length &&
              $stickedSideHeader.hasClass("active-slide-side-header")
            ) {
              stickedSideHeaderWidth = $stickedSideHeader.outerWidth(true);
              if ($stickedSideHeader.hasClass("header_side_right")) {
                stickedSideHeaderWidth = -stickedSideHeaderWidth;
              }
              windowWidth = windowWidth - stickedSideHeaderWidth;
            }
            var thisWidth = $thisMegaMenu.outerWidth();
            var thisOffset =
              $thisMegaMenu.offset().left - stickedSideHeaderWidth;
            var thisLeft = thisOffset + thisWidth / 2 - windowWidth / 2;
            $thisMegaMenu.css({ left: -thisLeft, display: "none" });
            if (!$thisMegaMenu.closest("ul").hasClass("nav")) {
              $thisMegaMenu.css("left", "");
            }
          });
        }
      }, timeOut);
    }
  }

  
  function initAffixSidebar() {
    var $affixAside = $(".affix-aside");
    if ($affixAside.length) {
      $window = $(window);

      
      $affixAside
        .on("affix.bs.affix", function (e) {
          var affixWidth = $affixAside.width() - 1;
          var affixLeft = $affixAside.offset().left;
          $affixAside.width(affixWidth).css("left", affixLeft);
        })
        .on("affix-bottom.bs.affix", function (e) {
          var affixWidth = $affixAside.width() - 1;
          
          var stickedSideHeaderWidth = 0;
          var $stickedSideHeader = $(".header_side_sticked");
          if (
            $stickedSideHeader.length &&
            $stickedSideHeader.hasClass("active-slide-side-header") &&
            !$stickedSideHeader.hasClass("header_side_right")
          ) {
            stickedSideHeaderWidth = $stickedSideHeader.outerWidth(true);
          }
          var affixLeft =
            $affixAside.offset().left -
            stickedSideHeaderWidth -
            $("#box_wrapper").offset().left;
          $affixAside.width(affixWidth).css("left", affixLeft);
        })
        .on("affix-top.bs.affix", function (e) {
          $affixAside.css({ width: "", left: "" });
        });

      
      var offsetTopAdd = 10;
      var offsetBottomAdd = 150;
      var offsetTop = $affixAside.offset().top - $(".page_header").height();
      
      var offsetBottom =
        $(".page_footer").outerHeight(true) +
        $(".page_copyright").outerHeight(true);

      $affixAside.affix({
        offset: {
          top: offsetTop - offsetTopAdd,
          bottom: offsetBottom + offsetBottomAdd,
        },
      });

      $window.on("resize", function () {
        
        $affixAside
          .removeClass("affix affix-bottom")
          .addClass("affix-top")
          .trigger("affix-top.bs.affix");

        var offsetTopSectionsArray = [
          ".page_topline",
          ".page_toplogo",
          ".page_header",
          ".page_title",
          ".blog_slider",
          ".blog-featured-posts",
        ];
        var offsetTop = 0;

        offsetTopSectionsArray.map(function (val) {
          offsetTop += $(val).outerHeight(true) || 0;
        });
        
        var offsetBottom =
          $(".page_footer").outerHeight(true) +
          $(".page_copyright").outerHeight(true);

        $affixAside.data("bs.affix").options.offset.top =
          offsetTop - offsetTopAdd;
        $affixAside.data("bs.affix").options.offset.bottom =
          offsetBottom + offsetBottomAdd;

        $affixAside.affix("checkPosition");
      });

      $affixAside.affix("checkPosition");
    } 
  }

  
  function initPhotoSwipe() {
    if (typeof PhotoSwipe !== "undefined") {
      
      
      var gallerySelectors =
        '.photoswipe-link, a[data-gal^="prettyPhoto"], [data-thumb] a';
      var $galleryLinks = $(gallerySelectors);
      if ($galleryLinks.length) {
        
        if (!$(".pswp").length) {
          $body.append(
            '<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><div class="pswp__counter"></div><a class="pswp__button pswp__button--close" title="Close (Esc)"></a><a class="pswp__button pswp__button--share" title="Share"></a><a class="pswp__button pswp__button--fs" title="Toggle fullscreen"></a><a class="pswp__button pswp__button--zoom" title="Zoom in/out"></a><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div> </div><a class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></a><a class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></a><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div>'
          );
          
        } else {
          return;
        }
        
        $("body").on("click", gallerySelectors, function (e) {
          e.preventDefault();

          var $link = $(this);
          var $linksParentContainer = $link.closest(
            ".photoswipe-container, .isotope-wrapper, .owl-carousel, .flickr_ul, .images"
          );
          var $links = $linksParentContainer.find(gallerySelectors);
          
          
          
          
          
          
          
          
          if (!$links.length) {
            $links.push($link);
          }
          var items = [];
          var options = {
            bgOpacity: 0.7,
            showHideOpacity: true,
            history: false,
            shareEl: false,
            
            index: $link.data("index") ? $link.data("index") : 0,
          };
          var gallery = $(".pswp")[0];
          
          $links.each(function (i) {
            var $this = $(this);
            
            if ($this.closest(".clone, .cloned").length) {
              return;
            }
            
            
            
            
            var item = {};
            
            if ($link[0] === $this[0] && !$link.data("index")) {
              
              if (
                $linksParentContainer.hasClass("owl-carousel") ||
                $linksParentContainer.hasClass("images")
              ) {
                options.index = i - 1;
              } else {
                options.index = i;
              }
            }
            
            if ($this.data("iframe")) {
              
              
              
              
              var autoplay = $links.length > 1 ? "" : "&autoplay=1";
              item.html =
                '<div class="embed-responsive embed-responsive-16by9">';
              
              item.html +=
                '<iframe class="embed-responsive-item" src="' +
                $(this).data("iframe") +
                "?rel=0" +
                autoplay +
                '&enablejsapi=1&api=1"></iframe>';
              item.html += "</div>";
            } else {
              item.src = $this.attr("href");
              
              var width = 1200;
              var height = 780;
              
              var data = $this.data();
              
              var dataImage = $this.find("img").first().data();
              if (data.width) {
                width = data.width;
              }
              if (data.height) {
                height = data.height;
              }
              if (typeof dataImage !== "undefined") {
                if (dataImage.large_image_width) {
                  width = dataImage.large_image_width;
                }
                if (dataImage.large_image_height) {
                  height = dataImage.large_image_height;
                }
              }
              item.w = width;
              item.h = height;
            }
            items.push(item);
          });

          var pswpGallery = new PhotoSwipe(
            gallery,
            PhotoSwipeUI_Default,
            items,
            options
          );
          pswpGallery.init();

          
          pswpGallery.listen("afterChange", function () {
            $(pswpGallery.container)
              .find("iframe")
              .each(function () {
                
                $(this)[0].contentWindow.postMessage(
                  '{"method":"pause","event":"command","func":"pauseVideo","args":""}',
                  "*"
                );
              });
          });
          pswpGallery.listen("close", function () {
            $(pswpGallery.container)
              .find("iframe")
              .each(function () {
                
                $(this)[0].contentWindow.postMessage(
                  '{"method":"pause","event":"command","func":"pauseVideo","args":""}',
                  "*"
                );
              });
          });
        });
      }
    }
  }

  
  function initAnimateElement(self, index) {
    var animationClass = !self.data("animation")
      ? "fadeInUp"
      : self.data("animation");
    var animationDelay = !self.data("delay") ? 150 : self.data("delay");
    setTimeout(function () {
      self.addClass("animated " + animationClass);
    }, index * animationDelay);
  }

  function initCounter(self) {
    if (self.hasClass("counted")) {
      return;
    } else {
      self.countTo().addClass("counted");
    }
  }

  function initProgressbar(el) {
    el.progressbar({
      transition_delay: 300,
    });
  }

  function initChart(el) {
    var data = el.data();
    var size = data.size ? data.size : 270;
    var line = data.line ? data.line : 20;
    var bgcolor = data.bgcolor ? data.bgcolor : "#ffffff";
    var trackcolor = data.trackcolor ? data.trackcolor : "#c14240";
    var speed = data.speed ? data.speed : 3000;

    el.easyPieChart({
      barColor: trackcolor,
      trackColor: bgcolor,
      scaleColor: false,
      scaleLength: false,
      lineCap: "butt",
      lineWidth: line,
      size: size,
      rotate: 0,
      animate: speed,
      onStep: function (from, to, percent) {
        $(this.el).find(".percent").text(Math.round(percent));
      },
    });
  }

  function initGoogleMap() {
    
    var $googleMaps = $("#map, .page_map");
    if ($googleMaps.length) {
      $googleMaps.each(function () {
        var $map = $(this);

        var lat;
        var lng;
        var map;

        

        
        var styles = [
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#ffffff",
              },
            ],
          },
          {
            featureType: "all",
            elementType: "labels.text.stroke",
            stylers: [
              {
                color: "#000000",
              },
              {
                lightness: 13,
              },
            ],
          },
          {
            featureType: "all",
            elementType: "labels.icon",
            stylers: [
              {
                visibility: "off",
              },
            ],
          },
          {
            featureType: "administrative",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#000000",
              },
            ],
          },
          {
            featureType: "administrative",
            elementType: "geometry.stroke",
            stylers: [
              {
                color: "#144b53",
              },
              {
                lightness: 14,
              },
              {
                weight: 1.4,
              },
            ],
          },
          {
            featureType: "landscape",
            elementType: "all",
            stylers: [
              {
                color: "#08304b",
              },
            ],
          },
          {
            featureType: "poi",
            elementType: "geometry",
            stylers: [
              {
                color: "#0c4152",
              },
              {
                lightness: 5,
              },
            ],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#000000",
              },
            ],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [
              {
                color: "#0b434f",
              },
              {
                lightness: 25,
              },
            ],
          },
          {
            featureType: "road.arterial",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#000000",
              },
            ],
          },
          {
            featureType: "road.arterial",
            elementType: "geometry.stroke",
            stylers: [
              {
                color: "#0b3d51",
              },
              {
                lightness: 16,
              },
            ],
          },
          {
            featureType: "road.local",
            elementType: "geometry",
            stylers: [
              {
                color: "#000000",
              },
            ],
          },
          {
            featureType: "transit",
            elementType: "all",
            stylers: [
              {
                color: "#146474",
              },
            ],
          },
          {
            featureType: "water",
            elementType: "all",
            stylers: [
              {
                color: "#021019",
              },
            ],
          },
        ];

        
        

        
        var $markers = $map.find(".marker");

        
        var address = $markers.first().find(".marker-address").text()
          ? $markers.first().find(".marker-address").text()
          : "london, baker street, 221b";
        var geocoder = new google.maps.Geocoder();

        var draggable = $map.data("draggable") ? $map.data("draggable") : false;
        var scrollwheel = $map.data("scrollwheel")
          ? $map.data("scrollwheel")
          : false;

        
        geocoder.geocode(
          {
            address: address,
          },
          function (data) {
            lat = data[0].geometry.location.lat();
            lng = data[0].geometry.location.lng();

            var center = new google.maps.LatLng(lat, lng);
            var settings = {
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              zoom: 16,
              draggable: draggable,
              scrollwheel: scrollwheel,
              center: center,
              styles: styles,
            };
            map = new google.maps.Map($map[0], settings);

            var infoWindows = [];

            $($markers).each(function (index) {
              var $marker = $(this);
              var markerTitle = $marker.find(".marker-title").text();

              
              var markerDescription = "";
              markerDescription += markerTitle
                ? '<h3 class="makret-title">' + markerTitle + "</h3>"
                : "";
              markerDescription += $marker.find(".marker-description").html()
                ? '<div class="marker-description">' +
                  $marker.find(".marker-description").html() +
                  "</div>"
                : "";
              if (markerDescription) {
                markerDescription =
                  '<div class="map_marker_description">' +
                  markerDescription +
                  "</div>";
              }

              geocoder.geocode(
                {
                  address: $marker.find(".marker-address").text(),
                },
                function (data) {
                  var iconSrc = $marker.find(".marker-icon").attr("src");

                  var lat = data[0].geometry.location.lat();
                  var lng = data[0].geometry.location.lng();

                  var center = new google.maps.LatLng(lat, lng);

                  var marker = new google.maps.Marker({
                    position: center,
                    title: markerTitle,
                    map: map,
                    icon: iconSrc,
                  });

                  var infowindow = new google.maps.InfoWindow({
                    content: markerDescription,
                  });

                  infoWindows.push(infowindow);

                  google.maps.event.addListener(marker, "click", function () {
                    for (var i = 0; i < infoWindows.length; i++) {
                      infoWindows[i].close();
                    }
                    infowindow.open(map, marker);
                  });
                }
              );
            });
          }
        );
      }); 
    } 
  }
  window.initGoogleMap = initGoogleMap;

  
  function documentReadyInit() {
    
    
    
    if ($().scrollbar) {
      $('[class*="scrollbar-"]').scrollbar();
    }
    if ($().superfish) {
      $("ul.sf-menu").superfish({
        popUpSelector: "ul:not(.mega-menu ul), .mega-menu ",
        delay: 700,
        animation: { opacity: "show", marginTop: 10 },
        animationOut: { opacity: "hide", marginTop: 10 },
        speed: 200,
        speedOut: 200,
        disableHI: false,
        cssArrows: true,
        autoArrows: true,
        onInit: function () {
          var $thisMenu = $(this);
          $thisMenu
            .find(".sf-with-ul")
            .after('<span class="sf-menu-item-mobile-toggler"/>');
          $thisMenu
            .find(".sf-menu-item-mobile-toggler")
            .on("click", function (e) {
              var $parentLi = $(this).parent();
              if ($parentLi.hasClass("sfHover")) {
                $parentLi.superfish("hide");
              } else {
                $parentLi.superfish("show");
              }
            });
        },
      });
      $("ul.sf-menu-side").superfish({
        popUpSelector: "ul:not(.mega-menu ul), .mega-menu ",
        delay: 500,
        animation: { opacity: "show", height: 100 + "%" },
        animationOut: { opacity: "hide", height: 0 },
        speed: 400,
        speedOut: 300,
        disableHI: false,
        cssArrows: true,
        autoArrows: true,
      });
    }
    $(".header-special .close-wrapper a").on("click", function () {
      $(this)
        .closest(".header-special")
        .removeClass("active-slide-side-header");
      $(".toggle_menu_side_special").removeClass("active");
    });

    
    $(
      ".page_header .toggle_menu:not(.toggle_menu_side_special), .page_toplogo .toggle_menu"
    ).on("click", function () {
      $(this)
        .toggleClass("mobile-active")
        .closest(".page_header")
        .toggleClass("mobile-active")
        .end()
        .closest(".page_toplogo")
        .next()
        .find(".page_header")
        .toggleClass("mobile-active");
      $(".page_topline").toggleClass("index");
    });

    $(".sf-menu a").on("click", function () {
      var $this = $(this);
      
      if (
        $this.hasClass("sf-with-ul") ||
        !($this.attr("href").charAt(0) === "#")
      ) {
        return;
      }
      $this
        .closest(".page_header")
        .toggleClass("mobile-active")
        .find(".toggle_menu")
        .toggleClass("mobile-active");
    });

    
    var $sideHeader = $(".page_header_side");
    
    $("ul.menu-click")
      .find("li")
      .each(function () {
        var $thisLi = $(this);
        
        if ($thisLi.find("ul").length) {
          $thisLi
            .append('<span class="toggle_submenu color-darkgrey"></span>')
            
            .find(".toggle_submenu, > a")
            .on("click", function (e) {
              var $thisSpanOrA = $(this);
              
              if (
                $thisSpanOrA.attr("href") === "#" ||
                !$thisSpanOrA.parent().hasClass("active-submenu")
              ) {
                e.preventDefault();
              }
              if ($thisSpanOrA.parent().hasClass("active-submenu")) {
                $thisSpanOrA.parent().removeClass("active-submenu");
                return;
              }
              $thisLi
                .addClass("active-submenu")
                .siblings()
                .removeClass("active-submenu");
            });
        } 
      });
    if ($sideHeader.length) {
      $(".toggle_menu_side").on("click", function () {
        var $thisToggler = $(this);
        $thisToggler.toggleClass("active");
        if ($thisToggler.hasClass("header-slide")) {
          $sideHeader.toggleClass("active-slide-side-header");
        } else {
          if ($thisToggler.parent().hasClass("header_side_right")) {
            $body.toggleClass("active-side-header slide-right");
          } else {
            $body.toggleClass("active-side-header");
          }
          $body.parent().toggleClass("html-active-push-header");
        }
        
        if ($thisToggler.closest(".header_side_sticked").length) {
          initMegaMenu(600);
          var $affixAside = $(".affix-aside");
          if ($affixAside.length) {
            $affixAside
              .removeClass("affix affix-bottom")
              .addClass("affix-top")
              .css({
                width: "",
                left: "",
              })
              .trigger("affix-top.bs.affix");
            setTimeout(function () {
              $affixAside
                .removeClass("affix affix-bottom")
                .addClass("affix-top")
                .css({
                  width: "",
                  left: "",
                })
                .trigger("affix-top.bs.affix");
            }, 10);
          }
        }
      });
      
      $body.on("mousedown touchstart", function (e) {
        if (
          !$(e.target).closest(".page_header_side").length &&
          !$sideHeader.hasClass("header_side_sticked")
        ) {
          $sideHeader.removeClass("active-slide-side-header");
          $body.removeClass("active-side-header slide-right");
          $body.parent().removeClass("html-active-push-header");
          var $toggler = $(".toggle_menu_side");
          if ($toggler.hasClass("active")) {
            $toggler.removeClass("active");
          }
        }
      });
    } 

    
    var MainWindowWidth = $window.width();
    $window.on("resize", function () {
      MainWindowWidth = $(window).width();
    });
    
    $(".top-nav .sf-menu")
      .on("mouseover", "ul li", function () {
        
        if (MainWindowWidth > 991) {
          var $this = $(this);
          
          var subMenuExist = $this.find("ul").length;
          if (subMenuExist > 0) {
            var subMenuWidth = $this.find("ul, div").first().width();
            var subMenuOffset =
              $this.find("ul, div").first().parent().offset().left +
              subMenuWidth;
            
            if (subMenuOffset + subMenuWidth > MainWindowWidth) {
              var newSubMenuPosition = subMenuWidth + 0;
              $this.find("ul, div").first().css({
                left: -newSubMenuPosition,
              });
            } else {
              $this.find("ul, div").first().css({
                left: "100%",
              });
            }
          }
        }
        
      })
      .on("mouseover", "> li", function () {
        if (MainWindowWidth > 991) {
          var $this = $(this);
          var subMenuExist = $this.find("ul").length;
          if (subMenuExist > 0) {
            var subMenuWidth = $this.find("ul").width();
            var subMenuOffset = $this.find("ul").parent().offset().left;
            
            if (subMenuOffset + subMenuWidth > MainWindowWidth) {
              var newSubMenuPosition =
                MainWindowWidth - (subMenuOffset + subMenuWidth);
              $this.find("ul").first().css({
                left: newSubMenuPosition,
              });
            }
          }
        }
      });

    
    
    
    var navHeight = $(".page_header").outerHeight(true);
    
    if ($(".mainmenu_side_wrapper").length) {
      $body.scrollspy({
        target: ".mainmenu_side_wrapper",
        offset: navHeight ? navHeight : 50,
      });
    } else if ($(".top-nav").length) {
      $body.scrollspy({
        target: ".top-nav",
        offset: navHeight,
      });
    }
    if ($().localScroll) {
      $(
        ".top-nav > ul, .mainmenu_side_wrapper > ul, #land,  .comments-link, .mouse_down"
      ).localScroll({
        duration: 900,
        easing: "easeInOutQuart",
        offset: -navHeight + 40,
      });
    }

    
    
    $(".bg_teaser, .cover-image").each(function () {
      var $element = $(this);
      var $image = $element.find("img").first();
      if (!$image.length) {
        $image = $element.parent().find("img").first();
      }
      if (!$image.length) {
        return;
      }
      var imagePath = $image.attr("src");
      $element.css("background-image", "url(" + imagePath + ")");
      var $imageParent = $image.parent();
      
      if ($imageParent.is("a")) {
        $element.prepend($image.parent().clone().html(""));
        $imageParent.attr("data-gal", "");
      }
    });

    
    $(".embed-placeholder").each(function () {
      $(this).on("click", function (e) {
        var $thisLink = $(this);
        
        if ($thisLink.attr("data-gal")) {
          return;
        }
        e.preventDefault();
        if ($thisLink.attr("href") === "" || $thisLink.attr("href") === "#") {
          $thisLink
            .replaceWith(
              $thisLink
                .data("iframe")
                .replace(/&amp/g, "&")
                .replace(/$lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/$quot;/g, '"')
            )
            .trigger("click");
        } else {
          $thisLink.replaceWith(
            '<iframe class="embed-responsive-item" src="' +
              $thisLink.attr("href") +
              "?rel=0&autoplay=1" +
              '"></iframe>'
          );
        }
      });
    });

    
    if ($().UItoTop) {
      $().UItoTop({ easingType: "easeInOutQuart" });
    }

    
    if ($().parallax) {
      $(".s-parallax").parallax("50%", 0.01);
    }

    
    if ($().prettyPhoto) {
      $("a[data-gal^='prettyPhoto']").prettyPhoto({
        hook: "data-gal",
        theme:
          "facebook",
      });
    }
    initPhotoSwipe();

    
    
    
    
    $('[type="search"]').addClass("form-control");

    
    if ($().carousel) {
      $(".carousel").carousel();
    }
    
    $(".nav-tabs").each(function () {
      $(this).find("a").first().tab("show");
    });
    
    $('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
      var iframe = $(e.relatedTarget.hash).find("iframe");
      var src = iframe.attr("src");
      iframe.attr("src", "");
      iframe.attr("src", src);
    });

    $(".tab-content").each(function () {
      $(this).find(".tab-pane").first().addClass("fade in");
    });
    
    $(".panel-group").each(function () {
      $(this).find("a").first().filter(".collapsed").trigger("click");
    });
    
    if ($().tooltip) {
      $('[data-toggle="tooltip"]').tooltip();
    }

    
    if ($().countdown) {
      var $counter = $("#comingsoon-countdown, #comingsoon-countdown2");
      
      var date =
        $counter.data("date") !== "undefined" ? $counter.data("date") : false;
      if (date) {
        date = new Date(date);
      } else {
        date = new Date();
        date.setMonth(date.getMonth() + 1);
      }
      $counter.countdown({ until: date });
    }

    
    
    

    
    $("form.contact-form").on("submit", function (e) {
      e.preventDefault();
      var $form = $(this);
      $($form).find(".contact-form-respond").remove();

      
      $($form)
        .find('[aria-required="true"], [required]')
        .each(function (index) {
          var $thisRequired = $(this);
          if (!$thisRequired.val().length) {
            $thisRequired.addClass("invalid").on("focus", function () {
              $thisRequired.removeClass("invalid");
            });
          }
        });
      
      if (
        $form.find('[aria-required="true"], [required]').hasClass("invalid")
      ) {
        return;
      }

      
      var request = $form.serialize();
      var ajax = jQuery
        .post("contact-form.php", request)
        .done(function (data) {
          $($form)
            .find('[type="submit"]')
            .attr("disabled", false)
            .parent()
            .append(
              '<div class="contact-form-respond color-main mt-20">' +
                data +
                "</div>"
            );
          
          var $formErrors = $form.find(".form-errors");
          if (!$formErrors.length) {
            $form[0].reset();
          }
        })
        .fail(function (data) {
          $($form)
            .find('[type="submit"]')
            .attr("disabled", false)
            .blur()
            .parent()
            .append(
              '<div class="contact-form-respond color-main mt-20">Mail cannot be sent. You need PHP server to send mail.</div>'
            );
        });
    });

    
    $(".search_modal_button").on("click", function (e) {
      e.preventDefault();
      $("#search_modal").modal("show").find("input").first().focus();
    });
    
    $("form.searchform, form.search-form").on("submit", function (e) {
      e.preventDefault();
      var $form = $(this);
      var $searchModal = $("#search_modal");
      $searchModal.find("div.searchform-respond").remove();

      
      $($form)
        .find('[type="text"], [type="search"]')
        .each(function (index) {
          var $thisField = $(this);
          if (!$thisField.val().length) {
            $thisField.addClass("invalid").on("focus", function () {
              $thisField.removeClass("invalid");
            });
          }
        });
      
      if ($form.find('[type="text"]').hasClass("invalid")) {
        return;
      }

      $searchModal.modal("show");
      
      var request = $form.serialize();
      var ajax = jQuery
        .post("search.php", request)
        .done(function (data) {
          $searchModal.append(
            '<div class="searchform-respond">' + data + "</div>"
          );
        })
        .fail(function (data) {
          $searchModal.append(
            '<div class="searchform-respond">Search cannot be done. You need PHP server to search.</div>'
          );
        });
    });

    
    $(".signup").on("submit", function (e) {
      e.preventDefault();
      var $form = $(this);
      
      $form.find(".response").html("Adding email address...");
      
      jQuery.ajax({
        url: "mailchimp/store-address.php",
        data: "ajax=true&email=" + escape($form.find(".mailchimp_email").val()),
        success: function (msg) {
          $form.find(".response").html(msg);
        },
      });
    });

    
    if ($().tweet) {
      $(".twitter").tweet({
        modpath: "./twitter/",
        count: 2,
        avatar_size: 48,
        loading_text: "loading twitter feed...",
        join_text: "auto",
        username: "michaeljackson",
        template:
          '{avatar}<div class="tweet_right">{join}<span class="tweet_text links-maincolor">{tweet_text}</span>{time}</div>',
      });
    }

    
    var $timetable = $("#timetable");
    if ($timetable.length) {
      
      $("#timetable_filter").on("click", "a", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $thisA = $(this);
        if ($thisA.hasClass("selected")) {
          
          return;
        }
        var selector = $thisA.attr("data-filter");
        $timetable
          .find("tbody td")
          .removeClass("current")
          .end()
          .find(selector)
          .closest("td")
          .addClass("current");
        $thisA.closest("ul").find("a").removeClass("selected");
        $thisA.addClass("selected");
      });
    }
  }

  
  function windowLoadInit() {
    
    
    
    if ($().flexslider) {
      var $introSlider = $(".page_slider .flexslider");
      $introSlider.each(function (index) {
        var $currentSlider = $(this);
        var data = $currentSlider.data();
        var nav = data.nav !== "undefined" ? data.nav : true;
        var dots = data.dots !== "undefined" ? data.dots : true;
        var speed = data.speed !== "undefined" ? data.speed : 7000;

        $currentSlider.flexslider({
          animation: "fade",
          pauseOnHover: true,
          useCSS: true,
          controlNav: dots,
          directionNav: nav,
          prevText: "",
          nextText: "",
          smoothHeight: false,
          slideshowSpeed: speed,
          animationSpeed: 600,
          start: function (slider) {
            slider
              .find(".intro_layers")
              .children()
              .css({ visibility: "hidden" });
            slider
              .find(".flex-active-slide .intro_layers")
              .children()
              .each(function (index) {
                var self = $(this);
                var animationClass = !self.data("animation")
                  ? "scaleAppear"
                  : self.data("animation");
                setTimeout(function () {
                  self.addClass("animated " + animationClass);
                }, index * 250);
              });
            
            var current =
              $("li:has(.flex-active)").index(".flex-control-nav li") + 1;

            var length = $(".slides li").length;

            $(".flex-control-nav li a.flex-active").html(
              '<span class="span-active">' + current + "/" + length + "</span>"
            );
          },
          after: function (slider) {
            slider
              .find(".flex-active-slide .intro_layers")
              .children()
              .each(function (index) {
                var self = $(this);
                var animationClass = !self.data("animation")
                  ? "scaleAppear"
                  : self.data("animation");
                setTimeout(function () {
                  self.addClass("animated " + animationClass);
                }, index * 250);
              });
            
            var current =
              $("li:has(.flex-active)").index(".flex-control-nav li") + 1;

            var length = $(".slides li").length;

            $(".flex-control-nav li a.flex-active").html(
              '<span class="span-active">' + current + "/" + length + "</span>"
            );
          },
          end: function (slider) {
            slider
              .find(".intro_layers")
              .children()
              .each(function () {
                var self = $(this);
                var animationClass = !self.data("animation")
                  ? "scaleAppear"
                  : self.data("animation");
                self
                  .removeClass("animated " + animationClass)
                  .css({ visibility: "hidden" });
                
              });
          },
        });
        
        
        
      }); 

      $(".flexslider").each(function (index) {
        var $currentSlider = $(this);
        
        if ($currentSlider.find(".flex-active-slide").length) {
          return;
        }
        $currentSlider.flexslider({
          animation: "fade",
          useCSS: true,
          controlNav: true,
          directionNav: false,
          prevText: "",
          nextText: "",
          smoothHeight: false,
          slideshowSpeed: 5000,
          animationSpeed: 800,
        });
      });
    }

    
    
    
    if ($().owlCarousel) {
      $(".owl-carousel").each(function () {
        var $carousel = $(this);
        $carousel.find("> *").each(function (i) {
          $(this).attr("data-index", i);
        });
        var data = $carousel.data();

        var loop = data.loop ? data.loop : false,
          margin = data.margin || data.margin === 0 ? data.margin : 30,
          nav = data.nav ? data.nav : false,
          navPrev = data.navPrev
            ? data.navPrev
            : '<i class="fas fa-chevron-left"></i>',
          navNext = data.navNext
            ? data.navNext
            : '<i class="fas fa-chevron-right"></i>',
          dots = data.dots ? data.dots : false,
          themeClass = data.themeclass ? data.themeclass : "owl-theme",
          center = data.center ? data.center : false,
          items = data.items ? data.items : 4,
          autoplay = data.autoplay ? data.autoplay : false,
          responsiveXs = data.responsiveXs ? data.responsiveXs : 1,
          responsiveSm = data.responsiveSm ? data.responsiveSm : 2,
          responsiveMd = data.responsiveMd ? data.responsiveMd : 3,
          responsiveLg = data.responsiveLg ? data.responsiveLg : 4,
          draggable = data.draggable === false ? data.draggable : true,
          syncedClass = data.syncedClass ? data.syncedClass : false,
          filters = data.filters ? data.filters : false;

        if (filters) {
          $carousel.after(
            $carousel.clone().addClass("owl-carousel-filter-cloned")
          );
          $(filters).on("click", "a", function (e) {
            
            e.preventDefault();
            if ($(this).hasClass("selected")) {
              return;
            }
            var filterValue = $(this).attr("data-filter");
            $(this).siblings().removeClass("selected active");
            $(this).addClass("selected active");

            
            for (var i = $carousel.find(".owl-item").length - 1; i >= 0; i--) {
              $carousel.trigger("remove.owl.carousel", [1]);
            }

            
            var $filteredItems = $(
              $carousel
                .next()
                .find(" > " + filterValue)
                .clone()
            );
            $filteredItems.each(function () {
              $carousel.trigger("add.owl.carousel", $(this));
              $(this).addClass("scaleAppear");
            });

            $carousel.trigger("refresh.owl.carousel");

            
            if ($().prettyPhoto) {
              $carousel.find("a[data-gal^='prettyPhoto']").prettyPhoto({
                hook: "data-gal",
                theme:
                  "facebook",
              });
            }
          });
        } 

        $carousel
          .owlCarousel({
            loop: loop,
            margin: margin,
            nav: nav,
            autoplay: autoplay,
            dots: dots,
            themeClass: themeClass,
            center: center,
            navText: [navPrev, navNext],
            mouseDrag: draggable,
            touchDrag: draggable,
            items: items,
            responsive: {
              0: {
                items: responsiveXs,
              },
              767: {
                items: responsiveSm,
              },
              992: {
                items: responsiveMd,
              },
              1200: {
                items: responsiveLg,
              },
            },
          })
          .addClass(themeClass);
        if (center) {
          $carousel.addClass("owl-center");
        }

        $window.on("resize", function () {
          $carousel.trigger("refresh.owl.carousel");
        });

        
        if ($carousel.hasClass("owl-news-slider-items") && syncedClass) {
          $carousel.on("changed.owl.carousel", function (e) {
            var indexTo = loop ? e.item.index + 1 : e.item.index;
            $(syncedClass).trigger("to.owl.carousel", [indexTo]);
          });
        }
      });
    } 

    jQuery(".owl-carousel.sync1").each(function () {
      var $owl1 = jQuery(this);
      var $owl2 = jQuery(".owl-carousel.sync2");

      $owl1.on("click", ".owl-item", function () {
        var carousel = $owl2.data("owl.carousel");
        carousel.to(carousel.relative(jQuery(this).index() - 1));
      });

      $owl1.on("change.owl.carousel", function (event) {
        if (event.namespace && event.property.name === "position") {
          var target = event.relatedTarget.relative(event.property.value, true);
          $owl2.owlCarousel("to", target, 300, true);
        }
      });
    });

    
    
    
    
    
    var $header = $(".page_header").first();
    var boxed = $header.closest(".boxed").length;
    var headerSticked = $(".header_side_sticked").length;
    if ($header.length) {
      
      menuHideExtraElements();
      
      initMegaMenu(1);
      
      $header.wrap('<div class="page_header_wrapper"></div>');
      var $headerWrapper = $(".page_header_wrapper");
      if (!boxed) {
        setTimeout(function () {
          var headerHeight = $header.outerHeight();
          $headerWrapper.css({
            height: $(".page_header").first().outerHeight(),
          });
        }, 400);
      }

      
      if ($header.hasClass("ls")) {
        $headerWrapper.addClass("ls");
        if ($header.hasClass("ms")) {
          $headerWrapper.addClass("ms");
        }
        if ($header.hasClass("bg-transparent")) {
          $headerWrapper.addClass("bg-transparent");
        }
      } else if ($header.hasClass("ds")) {
        $headerWrapper.addClass("ds");
        if ($header.hasClass("bs")) {
          $headerWrapper.addClass("bs");
        }
        if ($header.hasClass("ms")) {
          $headerWrapper.addClass("ms");
        }
        if ($header.hasClass("bg-transparent")) {
          $headerWrapper.addClass("bg-transparent");
        }
      } else if ($header.hasClass("cs")) {
        $headerWrapper.addClass("cs");
        if ($header.hasClass("cs2")) {
          $headerWrapper.addClass("cs2");
        }
        if ($header.hasClass("cs3")) {
          $headerWrapper.addClass("cs3");
        }
      } else if ($header.hasClass("gradient-background")) {
        $headerWrapper.addClass("gradient-background");
      }

      
      var headerOffset = 0;
      
      if (!boxed && !($headerWrapper.css("position") === "fixed")) {
        headerOffset = $header.offset().top;
      }

      
      $header.on(
        "affixed-top.bs.affix affixed.bs.affix affixed-bottom.bs.affix",
        function (e) {
          if ($header.hasClass("affix-top")) {
            $headerWrapper
              .removeClass("affix-wrapper affix-bottom-wrapper")
              .addClass("affix-top-wrapper");
            
            
            
            
          } else if ($header.hasClass("affix")) {
            $headerWrapper
              .removeClass("affix-top-wrapper affix-bottom-wrapper")
              .addClass("affix-wrapper");
            
            
            
            
          } else if ($header.hasClass("affix-bottom")) {
            $headerWrapper
              .removeClass("affix-wrapper affix-top-wrapper")
              .addClass("affix-bottom-wrapper");
          } else {
            $headerWrapper.removeClass(
              "affix-wrapper affix-top-wrapper affix-bottom-wrapper"
            );
          }

          
          
          if (boxed && !($header.css("position") === "fixed")) {
            menuHideExtraElements();
            initMegaMenu(1);
          }
          if (headerSticked) {
            initMegaMenu(1);
          }
        }
      );

      
      $header.on("affixed-top.bs.affix", function () {
        
      });

      
      $header.on("affix.bs.affix", function () {
        if (!$window.scrollTop()) return false;
      });

      $header.affix({
        offset: {
          top: headerOffset,
          bottom: -10,
        },
      });
    }

    
    initAffixSidebar();

    $body.scrollspy("refresh");

    
    if ($().appear) {
      
      var $animate = $(".animate");
      $animate.appear();

      $animate.filter(":appeared").each(function (index) {
        initAnimateElement($(this), index);
      });

      $body.on("appear", ".animate", function (e, $affected) {
        $($affected).each(function (index) {
          initAnimateElement($(this), index);
        });
      });

      
      if ($().countTo) {
        var $counter = $(".counter");
        $counter.appear();

        $counter.filter(":appeared").each(function () {
          initCounter($(this));
        });
        $body.on("appear", ".counter", function (e, $affected) {
          $($affected).each(function () {
            initCounter($(this));
          });
        });
      }

      
      if ($().progressbar) {
        var $progressbar = $(".progress .progress-bar");
        $progressbar.appear();

        $progressbar.filter(":appeared").each(function () {
          initProgressbar($(this));
        });
        $body.on("appear", ".progress .progress-bar", function (e, $affected) {
          $($affected).each(function () {
            initProgressbar($(this));
          });
        });
        
        $('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
          initProgressbar(
            $($(e.target).attr("href")).find(".progress .progress-bar")
          );
        });
        
        $(".dropdown").on("shown.bs.dropdown", function (e) {
          initProgressbar($(this).find(".progress .progress-bar"));
        });
      }

      
      if ($().easyPieChart) {
        var $chart = $(".chart");

        $chart.appear();

        $chart.filter(":appeared").each(function () {
          initChart($(this));
        });
        $body.on("appear", ".chart", function (e, $affected) {
          $($affected).each(function () {
            initChart($(this));
          });
        });
      }
    } 

    
    
    if ($().jflickrfeed) {
      var $flickr = $("#flickr, .flickr_ul");
      if ($flickr.length) {
        if (!$flickr.hasClass("flickr_loaded")) {
          $flickr
            .jflickrfeed(
              {
                flickrbase: "http://api.flickr.com/services/feeds/",
                limit: 4,
                qstrings: {
                  id: "131791558@N04",
                },
                itemTemplate:
                  '<a href="{{image_b}}" class="photoswipe-link"><li><img alt="{{title}}" src="{{image_m}}" /></li></a>',
                //complete
              },
              function (data) {
                initPhotoSwipe();
              }
            )
            .addClass("flickr_loaded");
        }
      }
    }

    
    if (jQuery().spectragram) {
      var Spectra = {
        instaToken: "3905738328.5104743.42b91d10580042e3aeeab90c926666a4",

        init: function () {
          jQuery.fn.spectragram.accessData = {
            accessToken: this.instaToken,
          };

          
          jQuery(".instafeed").each(function () {
            var $this = jQuery(this);
            if ($this.find("img").length) {
              return;
            }
            $this.spectragram("getUserFeed", {
              max: 4,
              wrapEachWith: '<div class="photo" />',
            });
          });
        },
      };

      Spectra.init();
    }

    
    $(".isotope-wrapper").each(function (index) {
      var $container = $(this);
      var layoutMode = $container.hasClass("masonry-layout")
        ? "masonry"
        : "fitRows";
      var columnWidth = $container.children(".col-lg-3").length
        ? ".col-lg-3"
        : false;
      $container.isotope({
        percentPosition: true,
        layoutMode: layoutMode,
        masonry: {
          
          
          columnWidth: columnWidth,
        },
      });

      var $filters = $container.attr("data-filters")
        ? $($container.attr("data-filters"))
        : $container.prev().find(".filters");

      
      if ($filters.length) {
        $filters.on("click", "a", function (e) {
          e.preventDefault();
          var $thisA = $(this);
          var filterValue = $thisA.attr("data-filter");
          $container.isotope({ filter: filterValue });
          $thisA.siblings().removeClass("selected active");
          $thisA.addClass("selected active");
        });
        
        $filters.on("change", "select", function (e) {
          e.preventDefault();
          var filterValue = $(this).val();
          $container.isotope({ filter: filterValue });
        });
        var cssClass = $filters.find("a").first().data("filter");
        $container.isotope({ filter: cssClass });
      }
    });

    

    (function () {
      var originalAddClassMethod = jQuery.fn.addClass;
      var originalRemoveClassMethod = jQuery.fn.removeClass;
      jQuery.fn.addClass = function () {
        var result = originalAddClassMethod.apply(this, arguments);
        jQuery(this).trigger("classChanged");
        return result;
      };
      jQuery.fn.removeClass = function () {
        var result = originalRemoveClassMethod.apply(this, arguments);
        jQuery(this).trigger("classChanged");
        return result;
      };
    })();

    
    $(".team-form-btn").on("click", function (e) {
      e.preventDefault();
      $("#team-form")
        .modal("show")
        .addClass("center")
        .find("input")
        .first()
        .focus();
    });

    
    $(".login-form-btn").on("click", function (e) {
      e.preventDefault();
      $("#login-form")
        .modal("show")
        .addClass("center")
        .find("input")
        .first()
        .focus();
    });

    $(".sign-in").on("click", function (e) {
      e.preventDefault();
      $("#login-form").find(".close").click();
      $("#login-form2")
        .modal("show")
        .addClass("center")
        .find("input")
        .first()
        .focus();
    });

    /**DROPDOWNS**/
    $(".dropdown-toggle").click(function (e) {
      e.preventDefault();
      e.stopPropagation();
      var item = $(this);
      $(".dropdown-menu").not(item.next()).slideUp(300);
      item.next().slideToggle(300);
    });
    $(".dropdown-menu").click(function (e) {
      e.preventDefault();
      e.stopPropagation();
    });
    $("body").on("click", function () {
      $(".dropdown-menu").slideUp(300);
    });

    
    var resize_rolls = 0;
    if ($(window).width() > 1024) {
      boxRollovers();
    }

    function boxRollovers() {
      var $selector = $(".item-gallery");
      var XAngle = 0;
      var YAngle = 0;
      var Z = 20;

      if ($selector.length > 0) {
        $selector.on("mousemove", function (e) {
          var $this = $(this);
          var XRel = e.pageX - $this.offset().left;
          var YRel = e.pageY - $this.offset().top;
          var width = $this.width();
          YAngle = -(0.5 - XRel / width) * 10;
          XAngle = (0.5 - YRel / width) * 10;
          updateView($this.children(".item-media"), Z, XAngle, YAngle);
        });
        $selector.on("mouseleave", function () {
          var oLayer = $(this).children(".item-media");
          oLayer.css({
            transform:
              "perspective(325px) translateZ(0) rotateX(0deg) rotateY(0deg)",
            transition: "all .2s linear 0s",
            "-webkit-transition": "all .2s linear 0s",
            "z-index": 1,
          });
        });
      }
    }
    function updateView(oLayer, Z, XAngle, YAngle) {
      oLayer.css({
        transform:
          "perspective(325px) translateZ(" +
          Z +
          "px) rotateX(" +
          XAngle +
          "deg) rotateY(" +
          YAngle +
          "deg)",
        transition: "all .2s linear 0s",
        "-webkit-transition": "all .2s linear 0s",
        "z-index": 2,
      });
    }
    

    
    
    

    var offices = [
      { latLng: [40.409262, 49.867092], name: "Baku, Azerbaijan",status: 'office' },
      { latLng: [51.507351, -0.127758], name: "London, UK",status: 'office' },
      { latLng: [50.110924, 8.682127], name: "Frankfurt, Germany",status: 'office' },
      { latLng: [46.204391, 6.143158], name: "Geneva, Switzerland",status: 'office' },
      { latLng: [48.208174, 16.373819], name: "Vienna, Austria",status: 'office' },
      { latLng: [44.426767, 26.102538], name: "Bucharest, Romania",status: 'office' },
      { latLng: [41.008238, 28.978359], name: "Istanbul, Turkey",status: 'office' },
      { latLng: [50.450001, 30.523333], name: "Kyiv, Ukraine",status: 'office' },
      { latLng: [41.715138, 44.827096], name: "Tbilisi, Georgia",status: 'office' },
      { latLng: [51.169392, 71.449074], name: "Astana, Kazakhstan",status: 'office' },
      { latLng: [35.689198, 51.388974], name: "Tehran, Iran",status: 'office' },
      { latLng: [1.352083, 103.819836], name: "Singapore",status: 'office' },
      { latLng: [25.276987, 55.296249], name: "Dubai, UAE",status: 'office' },
      { latLng: [6.524379, 3.379206], name: "Lagos, Nigeria",status: 'office' },
      { latLng: [43.738418, 7.424616], name: "Monaco",status: 'office' }
  ];
  

    if (document.getElementById("map-vector")) {
      $("#map-vector").vectorMap({
        map: "world_mill",
        backgroundColor: "transparent",
        zoomOnScroll: true,
        regionStyle: {
          initial: {
            fill: "#dde4e7",
          },
          hover: {
            "fill-opacity": 0.8,
            cursor: "default",
          },
        },
        markerStyle: {
          attribute:'image',
          scale:{
            'office':'/images/socar_flames_logo.png'
          }
        },
        markers: offices,
        onRegionTipShow: function (e, label, code) {
          e.preventDefault();
        },
      });
    }

    
    
    

    $(".remove").html('<i class="far fa-trash-alt"></i>');

    var className = $(".products-selection").next().attr("class");
    $(".products-selection .toggle_view .full").on("click", function (e) {
      e.preventDefault();
      $(".products-selection .toggle_view .full.active").removeClass("active");
      $(".products-selection .toggle_view .grid.active").removeClass("active");
      $(this)
        .closest(".products-selection")
        .next()
        .removeClass(className)
        .addClass("products columns-1");
      $(this).addClass("active");
    });

    $(".products-selection .toggle_view .grid").on("click", function (e) {
      e.preventDefault();
      $(".products-selection .toggle_view .full.active").removeClass("active");
      $(".products-selection .toggle_view .grid.active").removeClass("active");
      $(this)
        .closest(".products-selection")
        .next()
        .removeClass("products columns-1")
        .addClass(className);
      $(this).addClass("active");
    });

    var $product = $(".products").find(".product");
    $product
      .find(".woocommerce-LoopProduct-link:first")
      .after('<div class="product-wrap"></div>');
    $product.find(".product-wrap").append('<div class="wrap-right"></div>');
    $product.find(".wrap-right").after('<div class="wrap-left"></div>');
    $product.each(function () {
      var product = $(this);
      var $title = product.find("h2");
      var $rating = product.find(".star-rating");
      var $price = product.find(".price");
      var $btn = product.find(".button");
      var $disc = product.find(".product-description-short");

      product.find(".wrap-right").append($title);
      product.find(".wrap-right").append($rating);
      product.find(".wrap-right").append($disc);
      product.find(".wrap-left").append($price);
      product.find(".wrap-left").append($btn);
    });

    var $numberInput = $('input[type="number"]');
    $numberInput.before(
      '<button class="plus"><i class="fas fa-caret-up"></i></button>'
    );
    $numberInput.after(
      '<button  class="minus"><i class="fas fa-caret-down"></i></button>'
    );

    $(".plus").on("click", function (e) {
      e.preventDefault();
      var numberField = $(this).parent().find('[type="number"]');
      var currentVal = numberField.val();
      var sign = $(this).val();
      numberField.val(parseFloat(currentVal) + 1);
    });
    $(".minus").on("click", function (e) {
      e.preventDefault();
      var numberField = $(this).parent().find('[type="number"]');
      var currentVal = numberField.val();
      var sign = $(this).val();
      numberField.val(parseFloat(currentVal) - 1);
      if (currentVal < 2) {
        numberField.val(1);
      }
    });

    $("#toggle_shop_view").on("click", function (e) {
      e.preventDefault();
      $(this).toggleClass("grid-view");
      $("#products").toggleClass("grid-view list-view");
    });

    
    $("a.showlogin, a.showcoupon").on("click", function (e) {
      e.preventDefault();
      var $form = $(this).parent().next();

      if ($form.css("display") === "none") {
        $form.show(150);
      } else {
        $form.hide(150);
      }
    });

    
    $("a.remove").on("click", function (e) {
      e.preventDefault();
      $(this).closest("tr, .media").remove();
    });

    
    $(".images").flexslider({
      animation: "slide",
      controlNav: "thumbnails",
      selector: "figure > div",
      directionNav: false,
    });

    
    $(".wc-tab, .woocommerce-tabs .panel:not(.panel .panel)").hide();

    $(".wc-tabs li a, ul.tabs li a").on("click", function (e) {
      e.preventDefault();
      var $tab = $(this);
      var $tabs_wrapper = $tab.closest(".wc-tabs-wrapper, .woocommerce-tabs");
      var $tabs = $tabs_wrapper.find(".wc-tabs, ul.tabs");

      $tabs.find("li").removeClass("active");
      $tabs_wrapper.find(".wc-tab, .panel:not(.panel .panel)").hide();

      $tab.closest("li").addClass("active");
      $tabs_wrapper.find($tab.attr("href")).show();
    });
    
    $("a.woocommerce-review-link").on("click", function () {
      $(".reviews_tab a").trigger("click");
      return true;
    });

    
    var hash = window.location.hash;
    var url = window.location.href;
    var $tabs = $(".wc-tabs, ul.tabs").first();

    if (
      hash.toLowerCase().indexOf("comment-") >= 0 ||
      hash === "#reviews" ||
      hash === "#tab-reviews"
    ) {
      $tabs.find("li.reviews_tab a").trigger("click");
    } else if (url.indexOf("comment-page-") > 0 || url.indexOf("cpage=") > 0) {
      $tabs.find("li.reviews_tab a").trigger("click");
    } else if (hash === "#tab-additional_information") {
      $tabs.find("li.additional_information_tab a").trigger("click");
    } else {
      $tabs.find("li:first a").trigger("click");
    }

    
    if ($().slider) {
      var $rangeSlider = $(".slider-range-price");
      if ($rangeSlider.length) {
        var $priceMin = $(".slider_price_min");
        var $priceMax = $(".slider_price_max");
        $rangeSlider.slider({
          range: true,
          min: 0,
          max: 100000,
          values: [1500, 30000],
          slide: function (event, ui) {
            $priceMin.val(ui.values[0]);
            $priceMax.val(ui.values[1]);
          },
        });
        $priceMin.val($rangeSlider.slider("values", 0));
        $priceMax.val($rangeSlider.slider("values", 1));
      }
    }

    
    $(
      ".related.products ul.products, .upsells.products ul.products, .cross-sells ul.products"
    )
      .addClass("owl-carousel top-right-nav")
      .owlCarousel({
        loop: true,
        autoplay: true,
        margin: 20,
        nav: false,
        dots: false,
        items: 3,
        navText: [
          '<i class="fa fa-chevron-left"></i>',
          '<i class="fa fa-chevron-right"></i>',
        ],
        responsive: {
          0: {
            items: 1,
          },
          767: {
            items: 2,
          },
          992: {
            items: 2,
          },
          1200: {
            items: 3,
          },
        },
      });

    
    $(".color-filters")
      .find("a[data-background-color]")
      .each(function () {
        $(this).css({ "background-color": $(this).data("background-color") });
      });
    
    
    

    
    var $messagesModal = $("#messages_modal");
    if ($messagesModal.find("ul").length) {
      $messagesModal.modal("show");
    }

    
    $(".preloaderimg").fadeOut(150);
    $(".preloader")
      .fadeOut(150)
      .delay(50, function () {
        $(this).remove();
      });
  } 
  $(function () {
    documentReadyInit();
    initGoogleMap();
  });

  $window.on("load", function () {
    windowLoadInit();
  }); 

  $window.on("resize", function () {
    $body.scrollspy("refresh");

    
    if (document.getElementById("myVideo") != null) {
      var $videobg = document.getElementById("myVideo");
      var $src = $videobg.querySelector("source").dataset.src;
      var $time = $videobg.querySelector("source").dataset.time;

      if ($(window).width() > 1200) {
        if ($videobg.paused) {
          $videobg.querySelector("source").src = $src;
          $videobg.load();
          $videobg.currentTime = 7;
          $videobg.volume = 0;
          $videobg.play();

          $videobg.addEventListener("timeupdate", function () {
            if (this.currentTime >= $time) {
              $videobg.currentTime = 7;
              $videobg.volume = 0;
              $videobg.play();
            }
          });
        }
      }

      $(".slides").on("classChanged", "li:eq(1)", function () {
        if ($(window).width() > 1200) {
          $videobg.currentTime = 7;
          $videobg.volume = 0;
          $videobg.play();
          $videobg.addEventListener("timeupdate", function () {
            if (this.currentTime >= $time) {
              $videobg.currentTime = 7;
              $videobg.volume = 0;
              $videobg.play();
            }
          });
        }
      });
    }

    (function () {
      var originalAddClassMethod = jQuery.fn.addClass;
      var originalRemoveClassMethod = jQuery.fn.removeClass;
      jQuery.fn.addClass = function () {
        var result = originalAddClassMethod.apply(this, arguments);
        jQuery(this).trigger("classChanged");
        return result;
      };
      jQuery.fn.removeClass = function () {
        var result = originalRemoveClassMethod.apply(this, arguments);
        jQuery(this).trigger("classChanged");
        return result;
      };
    })();

    
    menuHideExtraElements();
    initMegaMenu(1);
    var $header = $(".page_header").first();
    
    if (
      $header.length &&
      !$(document).scrollTop() &&
      $header.first().data("bs.affix")
    ) {
      $header.first().data("bs.affix").options.offset.top =
        $header.offset().top;
    }
    if (!$header.closest(".boxed").length) {
      var affixed = false;
      if ($header.hasClass("affix")) {
        affixed = true;
        
        $header.removeClass("affix");

        
        setTimeout(function () {
          
          $(".page_header_wrapper").css({
            height: $header.first().outerHeight(),
          });
          $header.addClass("affix");
        }, 250);
      }

      if (!affixed) {
        
        $(".page_header_wrapper").css({
          height: $header.first().outerHeight(),
        });
      }
    }
  });
  
})(jQuery);
