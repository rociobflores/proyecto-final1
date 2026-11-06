function mostrar() {
    const nav = document.querySelector("nav");

    if (window.scrollY > 50) {
        nav.classList.add("scrolled");
    } else {
        nav.classList.remove("scrolled");
    }
}


let videoposter = document.querySelector("#videoposter");

if (videoposter) {
    let play = document.querySelector("#video-play");
    let pause = document.querySelector("#video-pause");
    let muestraTiempoActual;

    const transformarTiempo = (tiempo) => {
        let minutos;
        let segundos;
        if (tiempo > 60) {
            minutos = parseInt(tiempo / 60);
            segundos = parseInt(tiempo % 60);
        } else {
            minutos = 0;
            segundos = parseInt(tiempo);
        }
        if (minutos < 10) {
            minutos = `0${minutos}`;
        }
        if (segundos < 10) {
            segundos = `0${segundos}`;
        }
        return `${minutos}:${segundos}`;
    };

    play.addEventListener("click", () => {
        videoposter.play();

        clearInterval(muestraTiempoActual);
        muestraTiempoActual = setInterval(() => {
            let tiempo = transformarTiempo(videoposter.currentTime);
            document.querySelector("#duracion-total").textContent = `${tiempo}`;
        }, 100);
    });

    pause.addEventListener("click", () => {
        videoposter.pause();
        clearInterval(muestraTiempoActual);
    });

    videoposter.addEventListener("ended", () => {
        clearInterval(muestraTiempoActual);
    });
}


const piezas = document.querySelectorAll(".pieza");

if (piezas.length > 0) {
    const zonas = document.querySelectorAll(".zona-destino");
    const contenedorPiezas = document.querySelector(".piezas");
    const contenedorZonas = document.querySelector(".zonas");
    const titulo = document.querySelector(".h2juguemos");
    const btnReiniciar = document.querySelector("#reiniciar");
    const textoOriginal = titulo.textContent;

    piezas.forEach((pieza) => {
        pieza.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("Text", pieza.id);
        });
    });

    const actualizarZonas = () => {
        zonas.forEach((zona) => {
            zona.classList.toggle("ocupada", zona.querySelector("img") !== null);
        });
    };

    const mostrarResultado = (correcto) => {
        contenedorZonas.classList.add("al-frente");

        setTimeout(() => {
            titulo.innerHTML = correcto
                ? "Felicitaciones!!<br>Puzzle correctamente resuelto"
                : "Lo sentimos, puzzle no resuelto.<br>Prueba otra vez";

            titulo.classList.add("correc");
            contenedorZonas.classList.add(correcto ? "desaparece" : "oscuro");
        }, 1300);
    };

    const verificar = () => {
        let todasLlenas = [...zonas].every((zona) => zona.querySelector("img"));
        if (!todasLlenas) return;

        let correcto = [...zonas].every((zona) => {
            let pieza = zona.querySelector("img");
            return pieza.dataset.orden === zona.dataset.orden;
        });

        mostrarResultado(correcto);
    };

    const reiniciar = () => {
        piezas.forEach((pieza) => contenedorPiezas.appendChild(pieza));
        actualizarZonas();

        contenedorZonas.classList.remove("al-frente", "desaparece", "oscuro");
        titulo.classList.remove("correc");
        titulo.textContent = textoOriginal;
    };

    zonas.forEach((zona) => {
        zona.addEventListener("dragenter", () => {
            zona.classList.add("resaltada");
        });

        zona.addEventListener("dragleave", () => {
            zona.classList.remove("resaltada");
        });

        zona.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        zona.addEventListener("drop", (event) => {
            event.preventDefault();
            zona.classList.remove("resaltada");

            if (zona.querySelector("img")) return;

            let id = event.dataTransfer.getData("Text");
            let pieza = document.querySelector(`#${id}`);
            zona.appendChild(pieza);

            actualizarZonas();
            verificar();
        });
    });

    btnReiniciar.addEventListener("click", reiniciar);
}


const hitos = document.querySelectorAll(".hito");

if (hitos.length > 0) {
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visible");
                observador.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.3 });

    hitos.forEach((hito) => observador.observe(hito));
}


const btnTema = document.querySelector("#btn-tema");

if (btnTema) {
    const iconoTema = btnTema.querySelector("span");

    const aplicarTema = (claro) => {
        document.documentElement.classList.toggle("claro", claro);
        iconoTema.textContent = claro ? "dark_mode" : "light_mode";
    };

    aplicarTema(localStorage.getItem("tema") === "claro");

    btnTema.addEventListener("click", () => {
        let claro = !document.documentElement.classList.contains("claro");
        aplicarTema(claro);
        localStorage.setItem("tema", claro ? "claro" : "noche");
    });
}