document.getElementById('media_image-6').classList.add('header-items');
document.getElementById('nav_menu-9').classList.add('header-items');

var header = document.createElement('header');

Array.prototype.forEach.call(document.querySelectorAll('.header-items'), function(c){
    header.appendChild(c);
});

document.querySelector('html').classList.add('subscriber-profile');
document.body.prepend(header);