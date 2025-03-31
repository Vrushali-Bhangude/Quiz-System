document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.getElementById("hamburger");
    const navList = document.getElementById("nav-list");

    hamburger.addEventListener("click", function () {
        navList.classList.toggle("active");
        hamburger.innerHTML = navList.classList.contains("active") ? "&#10006;" : "&#9776;";
    });

    document.addEventListener("click", function (event) {
        if (!navList.contains(event.target) && !hamburger.contains(event.target)) {
            navList.classList.remove("active");
            hamburger.innerHTML = "&#9776;";
        }
    });
});