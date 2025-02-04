window.addEventListener("load", function () {
  const canvas = this.document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = this.window.innerWidth;
  canvas.height = this.window.innerHeight;

  class Particle {
    constructor(effect, x, y, color) {
      this.effect = effect;
      this.x = Math.random() * this.effect.canvasWidth;
      this.y = y;
      this.color = color;
      this.originX = x;
      this.originY = y;
      this.size = effect.gap;
      this.vx = this.vy = 0;
      this.friction = Math.random() * 0.7 + 0.1;
      this.ease = Math.random() * 0.1 + 0.005;
    }
    draw() {
      this.effect.context.fillStyle = this.color;
      this.effect.context.fillRect(this.x, this.y, this.size, this.size);
    }
    update() {
      const { x: mouseX, y: mouseY, radius } = this.effect.mouse;
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distanceSquared = dx * dx + dy * dy;

      if (distanceSquared < radius) {
        const force = -radius / distanceSquared;
        const angle = Math.atan2(dy, dx);
        this.vx += force * Math.cos(angle);
        this.vy += force * Math.sin(angle);
      }
      this.x +=
        (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
      this.y +=
        (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
    }
  }

  class Effect {
    constructor(context, canvasWidth, canvasHeight) {
      this.context = context;
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
      this.textX = this.canvasWidth / 2;
      this.textY = this.canvasHeight / 2;
      this.fontSize = 100;
      this.lineHeight = this.fontSize * 0.8;
      this.maxTextWidth = this.canvasWidth * 0.8;
      this.particles = [];
      this.gap = 3;
      this.mouse = {
        radius: 30000,
        x: 0,
        y: 0,
      };

      this.textInput = document.getElementById("textInput");
      this.textInput.addEventListener("keyup", (e) => {
        if (e.key !== " ") this.updateText(e.target.value);
      });

      window.addEventListener("mousemove", (e) => {
        this.mouse.x = e.x;
        this.mouse.y = e.y;
      });
    }

    updateText(text) {
      this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.wrapText(text);
    }

    wrapText(text) {
      const gradient = this.context.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0.3, "red");
      gradient.addColorStop(0.5, "fuchsia");
      gradient.addColorStop(0.7, "purple");
      this.context.fillStyle = gradient;
      this.context.textAlign = "center";
      this.context.textBaseline = "middle";
      this.context.lineWidth = 3; //
      this.context.strokeStyle = "white"; //
      this.context.font = this.fontSize + "px Helvetica";
      // break multiline text
      const words = text.split(" ");
      const linesArray = words.reduce(
        (lines, word) => {
          const testLine = lines[lines.length - 1] + word + " ";
          if (this.context.measureText(testLine).width > this.maxTextWidth) {
            lines.push(word + " ");
          } else {
            lines[lines.length - 1] = testLine;
          }
          return lines;
        },
        [""]
      );

      const textHeight = this.lineHeight * (linesArray.length - 1);
      this.textY = this.canvasHeight / 2 - textHeight / 2;

      linesArray.forEach((line, index) => {
        this.context.fillText(
          line,
          this.textX,
          this.textY + index * this.lineHeight
        );
        this.context.strokeText(
          line,
          this.textX,
          this.textY + index * this.lineHeight
        );
      });
      this.convertToParticles();
    }
    convertToParticles() {
      this.particles = [];
      const pixels = this.context.getImageData(
        0,
        0,
        this.canvasWidth,
        this.canvasHeight
      ).data;
      this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      for (let y = 0; y < this.canvasHeight; y += this.gap) {
        for (let x = 0; x < this.canvasWidth; x += this.gap) {
          const index = (y * this.canvasWidth + x) * 4;
          const alpha = pixels[index + 3];
          if (pixels[index + 3] > 0) {
            const color = `rgb(${pixels[index]},${pixels[index + 1]},${
              pixels[index + 2]
            })`;
            this.particles.push(new Particle(this, x, y, color));
          }
        }
      }
    }
    render() {
      this.particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
    }
    resize(width, height) {
      this.canvasWidth = width;
      this.canvasHeight = height;
      this.textX = width / 2;
      this.textY = height / 2;
      this.maxTextWidth = width * 0.8;
    }
  }

  const effect = new Effect(ctx, canvas.width, canvas.height);
  //effect.wrapText("Hello how are you?");
  //effect.render();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.render();
    requestAnimationFrame(animate);
  }
  animate();

  this.window.addEventListener("resize", function () {
    canvas.width = this.window.innerWidth;
    canvas.height = this.window.innerHeight;
    effect.resize(canvas.width, canvas.height);
    effect.wrapText(effect.textInput.value);
  });

  /* ctx.lineWidth = 3;
  ctx.strokeStyle = "lightblue";
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();

  ctx.strokeStyle = "lightblue";
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0.3, "red");
  gradient.addColorStop(0.5, "fuchsia");
  gradient.addColorStop(0.7, "purple");
  ctx.fillStyle = gradient;
  ctx.strokeStyle = "orangered";
  ctx.font = "80px Helvetica";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const maxTextWidth = canvas.width * 0.8;
  const lineHeight = 80;

  function wrapText(text) {
    let linesArray = [];
    let lineCounter = 0;
    let line = "";
    let words = text.split(" ");
    for (let i = 0; i < words.length; i++) {
      let testLine = line + words[i] + " ";
      if (ctx.measureText(testLine).width > maxTextWidth) {
        line = words[i] + " ";
        lineCounter++;
      } else {
        line = testLine;
      }
      linesArray[lineCounter] = line;
    }
    let textHeight = lineHeight * lineCounter;
    let textY = canvas.height / 2 - textHeight / 2;
    linesArray.forEach((el, index) => {
      ctx.fillText(el, canvas.width / 2, textY + index * lineHeight);
    });
  }

  textInput.addEventListener("keyup", function (e) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    wrapText(e.target.value);
  }); */
});
