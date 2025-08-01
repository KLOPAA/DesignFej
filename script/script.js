document.addEventListener('DOMContentLoaded', function () {
    const menuIcon = document.querySelector('.menu-icon');
    const menuLateral = document.querySelector('.menu-lateral');

    const closeMenuIcon = document.querySelector('.close-menu-icon');


    menuIcon.addEventListener('click', function (event) {
        event.stopPropagation();
        menuLateral.classList.toggle('open');
    });


    if (closeMenuIcon) {
        closeMenuIcon.addEventListener('click', function (event) {
            event.stopPropagation();
            menuLateral.classList.remove('open');
        });
    }


    document.addEventListener('click', function (event) {

        if (!menuLateral.contains(event.target) && menuLateral.classList.contains('open')) {
            menuLateral.classList.remove('open');
        }
    });
});