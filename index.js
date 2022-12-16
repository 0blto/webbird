const canvas = document.querySelector('canvas'),
ctx = canvas.getContext('2d'),
start = document.getElementById('start'),
score = document.getElementById('score'),
size = {
    x: 50,
    y: 50
}

const loaded = {
    bg: false,
    bird: false
}

const images = {
    bird: new Image(),
    bg: new Image()
}







let bgc = '#6699FF',
processing = false,
gamestarted = false,
scorec = 0,
defaultWidth = 100,
spaces = 300,
defaultRange = 200,
gravity = 0.15,
defaultVelocity = 3

canvas.width = 1024;
canvas.height = 576;

document.addEventListener("DOMContentLoaded", () => {
    function loadGraphics() {
        images.bird.src = 'textures/bird.png'
        images.bg.src = 'textures/bg.png'
    
        images.bird.onload = () => {loaded.bird = true}
        images.bg.onload = () => {loaded.bg = true}
    
        wait()
    }
    
    function dots() {
        if (document.getElementById('loading').innerText == '') {
            document.getElementById('loading').innerText = 'Загрузка'
        }
        document.getElementById('loading').innerText += '.'
    }
    
    function wait() {
        if (loaded.bg && loaded.bird) {
            document.getElementById('loading').style.opacity = 0
            document.getElementById('loading').style.zIndex = 0
            preparation()
            animate()
        } else {
            setInterval(dots, 10)
            setTimeout(wait, 1000)
        }
    }
    defaultRange = defaultRange / canvas.height * window.innerHeight
    defaultWidth = defaultWidth / canvas.height * window.innerHeight
    spaces = spaces / canvas.height * window.innerHeight
    //defaultVelocity = defaultVelocity * canvas.height / window.innerHeight
    //gravity = gravity * canvas.height / window.innerHeight
    size.x = size.x / canvas.height * window.innerHeight
    size.y = size.y / canvas.height * window.innerHeight
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    loadGraphics()

    class Sprite { 
        constructor({position, color, size}) {
            this.position = position;
            this.width = size.x;
            this.height = size.y;
            this.color = color;
            this.down = 0;
        }
    
        draw() {
            //rectangle(this.color, this.position.x, 
                //this.position.y, this.width, this.height)
            ctx.drawImage(images.bird, this.position.x,
                this.position.y, this.width, this.height)
        }
    
        update() {
            this.draw();
            this.position.y += this.down
    
            if (this.position.y + this.height + this.down >= canvas.height) {
                getStarted()
            } else {
                this.down += gravity;
            }
    
        }
    
    }
    
    class Obstacle {
        constructor({range, y, width, velocity, color, position}) {
            this.range = range
            this.bottom = y
            this.upper = y - range
            this.width = width
            this.velocity = velocity
            this.color = color
            this.position = position
            this.missed = false
        }
    
        draw() {
            rectangle(this.color, this.position, this.bottom,
                this.width, canvas.height - this.bottom)
            rectangle(this.colorm, this.position, this.upper,
                this.width, -this.upper)
        }
    
        update() {
            this.draw()
            this.position -= this.velocity
    
            
        }
    
        
    }

    const bird = new Sprite({
        position: {
            x: canvas.width/3,
            y: canvas.height/2
        },
        color: 'red',
        size: {
            x: size.x,
            y: size.y
        },
    })
    
    
    
    let obstacles = new Array()
    obstacles.push(new Obstacle({
        range: defaultRange,
        y: canvas.height/4,
        width: defaultWidth,
        velocity: defaultVelocity,
        color: 'green',
        position: canvas.width - defaultWidth
    }))
    
    
    
    function preparation() {
        
        //rectangle(bgc, 0, 0, canvas.width, canvas.height)
        ctx.drawImage(images.bg, 0, 0, canvas.width, canvas.height)
        bird.position = {
            x: canvas.width/3,
            y: canvas.height/2 - bird.height
        }
        bird.draw()
        obstacles = new Array()
        obstacles.push(new Obstacle({
            range: defaultRange,
            y: canvas.width/2 - defaultRange,
            width: defaultWidth,
            velocity: defaultVelocity,
            color: 'green',
            position: canvas.width - defaultWidth
        }))
        obstacles[0].draw()
        gamestarted = true
        resetScore()
        
    
    }
    
    function animate() {
    
        window.requestAnimationFrame(animate)
        if (processing && gamestarted) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            //rectangle(bgc, 0, 0, canvas.width, canvas.height)
            ctx.drawImage(images.bg, 0, 0, canvas.width, canvas.height)
            
            bird.update()
    
            for (let i = 0; i < obstacles.length; i++) {
                obstacles[i].update()
    
                if (collision(bird, obstacles[i])) {
                    getStarted()
                }
    
                past(bird, obstacles[i])
            }
        }
        
    
    
        if (obstacles[0].position <= -obstacles[0].width) {
            obstacles.shift()
        }
    
        if (obstacles[obstacles.length - 1].position <= 
            canvas.width - defaultWidth - spaces) {
            obstacles.push(new Obstacle({
                range: defaultRange,
                y: getRandomInt(defaultRange + 50, canvas.height - 50),
                width: defaultWidth,
                velocity: defaultVelocity,
                color: 'green',
                position: canvas.width
            }))
        }
    
        
        
    }

    start.addEventListener("click", () => {
        preparation()
        start.blur()
        start.style.opacity = '0'
    })
    
    window.addEventListener("keydown", (event) => {
        switch(event.key) {
            case ' ':
                bird.down = -5
                if (gamestarted) {
                    processing = true
                }
                break
        }
    
    })
    
    canvas.addEventListener("click", () => {
        bird.down = -5
                if (gamestarted) {
                    processing = true
                }
    })
    
    
    
})

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

function rectangle(color, fromX, fromY, rangeX, rangeY) {
    ctx.fillStyle = color
    ctx.fillRect(fromX, fromY, rangeX, rangeY)
}

function getStarted() {
    processing = false
    gamestarted = false
    start.style.opacity = 1
}

function goal() {
    scorec += 1
    score.innerHTML = scorec
}

function resetScore() {
    scorec = 0
    score.innerHTML = scorec
}

function collision(bird, obstacle) {
    if (bird.position.x + bird.width >= obstacle.position &&
         bird.position.x + bird.width <= obstacle.position + obstacle.width + bird.width &&
         (bird.position.y + bird.height >= obstacle.bottom ||
            bird.position.y <= obstacle.upper)) {
                return true
            }
    return false
}

function past(bird, obstacle) {
    if (bird.position.x > obstacle.position + obstacle.width &&
        obstacle.missed == false) {
        goal()
        obstacle.missed = true
    }
}



