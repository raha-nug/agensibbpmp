document.addEventListener("DOMContentLoaded", function() {
    var hamburger = document.querySelector(".hamburger");
    var sidebar = document.getElementById("sidebar");
    var overlay = document.getElementById("overlay");

    hamburger.addEventListener("click", function() {
        sidebar.classList.toggle("active");
        overlay.classList.toggle("active");
    });

    overlay.addEventListener("click", function() {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
    });
});

