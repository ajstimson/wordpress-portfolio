export var normalizeMarquee = function (raw, meta) {
    return {
        type: 'Marquee',
        template: meta.template,
        image: {
            name: raw.image.name,
            url: raw.image.url
        },
        buttons: raw.buttons ? raw.buttons.map(function (x) { return x.button; }) : [],
        text: raw.html,
        title: raw.title
    };
};
