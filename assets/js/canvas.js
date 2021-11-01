function canvas(selector, options) {
    const canvas = document.querySelector(selector);
    canvas.classList.add('canvas')
    canvas.setAttribute('width', `${options.width || 400}px`)
    canvas.setAttribute('height', `${options.height || 300}px`)
    // отримання контексту для малювання
    const context = canvas.getContext('2d')
    // отримуємо координати canvas відносно viewport
    const rect = canvas.getBoundingClientRect();
    let isPaint = false // чи активно малювання
    let points = [] //масив з точками

    // об’являємо функцію додавання точок в масив
    const addPoint = (x, y, dragging) => {
        // преобразуємо координати події кліка миші відносно canvas
        points.push({
            x: (x - rect.left),
            y: (y - rect.top),
            dragging: dragging
        })
    }

    // головна функція для малювання
    const redraw = () => {
        //очищуємо  canvas
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        context.strokeStyle = options.strokeColor;
        context.lineJoin = "round";
        context.lineWidth = options.strokeWidth;
        let prevPoint = null;
        for (let point of points){
            context.beginPath();
            if (point.dragging && prevPoint){
                context.moveTo(prevPoint.x, prevPoint.y)
            } else {
                context.moveTo(point.x - 1, point.y);
            }
            context.lineTo(point.x, point.y)
            context.closePath()
            context.stroke();
            prevPoint = point;
        }
    }

    // функції обробники подій миші
    const mouseDown = event => {
        isPaint = true
        addPoint(event.pageX, event.pageY);
        redraw();
    }

    const mouseMove = event => {
        if(isPaint){
            addPoint(event.pageX, event.pageY, true);
            redraw();
        }
    }

// додаємо обробку подій
    canvas.addEventListener('mousemove', mouseMove)
    canvas.addEventListener('mousedown', mouseDown)
    canvas.addEventListener('mouseup',() => {
        isPaint = false;
    });
    canvas.addEventListener('mouseleave',() => {
        isPaint = false;
    });

// TOOLBAR
    const toolBar = document.getElementById('toolbar')
// clear button
    const clearBtn = document.createElement('button')
    clearBtn.classList.add('btn')
    clearBtn.textContent = 'Clear'
    clearBtn.addEventListener('click', () => {
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        points = [];
    })
    toolBar.insertAdjacentElement('afterbegin', clearBtn)
    const downBtn = document.createElement('button')
    downBtn.classList.add('btn')
    downBtn.textContent = 'Download'
    downBtn.addEventListener('click', () => {
        const dataUrl = canvas.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
        const newTab = window.open('about:blank', 'image from canvas');
        newTab.document.write("<img src='" + dataUrl + "' alt='from canvas'/>");
    })
    toolBar.insertAdjacentElement('afterbegin', downBtn)
    const saveBtn = document.createElement('button')
    saveBtn.classList.add('btn')
    saveBtn.textContent = 'Save'
    saveBtn.addEventListener('click', () => {
        localStorage.setItem('points', JSON.stringify(points));
    })

    toolBar.insertAdjacentElement('afterbegin', saveBtn)
    const restoreBtn = document.createElement('button')
    restoreBtn.classList.add('btn')
    restoreBtn.textContent = 'Restore'
    restoreBtn.addEventListener('click', () => {
        points = JSON.parse(localStorage.getItem('points'));
        redraw();
    })
    toolBar.insertAdjacentElement('afterbegin', restoreBtn)
    const timestampBtn = document.createElement('button')
    timestampBtn.classList.add('btn')
    timestampBtn.textContent = 'Timestamp'
    timestampBtn.addEventListener('click', () => {
            let today = new Date();
            context.fillText("The time now is: " + today.getHours() + ":" + today.getMinutes(), 100, 50);
            context.fillText("The date is: " + today.getDate() + "/" + today.getMonth() + 1 + "/" + today.getFullYear(), 100, 100);
    })
    toolBar.insertAdjacentElement('afterbegin', timestampBtn)

    const setColor = document.createElement('button')
    setColor.classList.add('btn')
    setColor.textContent = 'Set color'
    setColor.addEventListener('click', () => {
        options.strokeColor = document.getElementById('color-picker').value
        redraw();
    })
    toolBar.insertAdjacentElement('beforebegin', setColor)

    const brushSize = document.createElement('input');
    brushSize.setAttribute('type', 'range');
    brushSize.setAttribute('value', options.strokeWidth);
    brushSize.setAttribute('min',  options.strokeWidth);
    brushSize.setAttribute('max',  options.strokeWidth + 25);

    brushSize.addEventListener('change', (e) => {
        options.strokeWidth= brushSize.value;
    })
    toolBar.insertAdjacentElement('afterend', brushSize)

    const backgroundBtn  = document.createElement('button')
    backgroundBtn.classList.add('btn')
    backgroundBtn.textContent = 'Background'
    backgroundBtn.addEventListener('click', () => {
        const img = new Image;
        img.src =`https://www.fillmurray.com/200/300)`;
        img.onload = () => {
            context.drawImage(img, 0, 0);
        }
    })
    toolBar.insertAdjacentElement('afterbegin', backgroundBtn)
    }

