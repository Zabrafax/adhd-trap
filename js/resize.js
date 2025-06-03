export function autoResize() {
    const container = document.querySelector('.game__container');
    const left = document.querySelector('.settings__container');
    const right = document.querySelector('.right__wrapper');
    const topRight = document.querySelector('.canvas__container');
    const bottomRight = document.querySelector('.appearance__container');

    const mediaQuery = window.matchMedia('(max-width: 768px)');

    function rearrangeLayout(e) {
        if (e.matches) {
            container.appendChild(topRight);
            container.appendChild(left);
            container.appendChild(bottomRight);
        } else {
            if (!right.contains(topRight)) right.appendChild(topRight);
            if (!right.contains(bottomRight)) right.appendChild(bottomRight);
            container.insertBefore(left, right);
        }
    }

    mediaQuery.addListener(rearrangeLayout);
    rearrangeLayout(mediaQuery);
}