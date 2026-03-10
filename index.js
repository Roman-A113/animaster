addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
            animaster().addFadeIn(5000).play(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().addFadeOut(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, { x: 100, y: 10 }).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000, 1.25).play(block);
        });

    let stopMoveAndHide;
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            stopMoveAndHide = animaster().moveAndHide(block, 1000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            if (!stopMoveAndHide) {
                return;
            }

            stopMoveAndHide.stop();
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndHide(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });


    let stopHeartBeating;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            stopHeartBeating = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (!stopHeartBeating) {
                return;
            }
            stopHeartBeating.stop();
        });
}

function animaster() {
    const result = {

        _steps: [],

        /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        addMove(duration, translation) {
            this._steps.push({ name: "move", duration: duration, args: translation });
            return this;
        },

        addScale(duration, ratio) {
            this._steps.push({ name: "scale", duration: duration, args: ratio });
            return this;
        },

        addFadeIn(duration) {
            this._steps.push({ name: "fadeIn", duration: duration, args: null });
            return this;
        },

        addFadeOut(duration) {
            this._steps.push({ name: "fadeOut", duration: duration, args: null });
            return this;
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        moveAndHide(element, duration) {
            const stepDuration1 = duration * 2 / 5;
            const stepDuration2 = duration - stepDuration1;
            this.move(element, stepDuration1, { x: 100, y: 20 });
            let timerId = setTimeout(() => {
                this.fadeOut(element, stepDuration2);
            }, stepDuration1);

            return {
                stop() {
                    clearTimeout(timerId);
                }
            };
        },

        showAndHide(element, duration) {
            const stepDuration = duration / 3;
            this.fadeIn(element, stepDuration);
            setTimeout(() => {
                this.fadeOut(element, stepDuration);
            }, stepDuration * 2);
        },

        heartBeating(element) {
            this.scale(element, 500, 1.4);
            setTimeout(() => {
                this.scale(element, 500, 1 / 1.4);
            }, 500);
            let timerId = setInterval(() => {
                this.scale(element, 500, 1.4);
                setTimeout(() => {
                    this.scale(element, 500, 1 / 1.4);
                }, 500);
            }, 1000);

            return {
                stop() {
                    clearInterval(timerId);
                }
            };
        },

        resetMoveAndHide(element) {
            resetFadeOut(element);
            resetMoveAndScale(element);
        },


        play(element) {
            function execute(element, name, duration, args) {
                switch (name) {
                    case 'move':
                        this.move(element, duration, args);
                        break;
                    case 'scale':
                        this.scale(element, duration, args);
                        break;
                    case 'fadeIn':
                        this.fadeIn(element, duration);
                        break;
                    case 'fadeOut':
                        this.fadeOut(element, duration);
                        break;
                }
                setTimeout(() => { }, duration);
            }
            this._steps.forEach(step => execute.bind(this)(element, step.name, step.duration, step.args));
        },
    }

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }
    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }
    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    return result;
}


function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}
