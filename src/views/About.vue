<template>
<div class="about">
  <canvas ref="canvas" id="canvas" width="1400" height="900"></canvas>

</div>
</template>
<script>
  export default {
    data(){
      return {
        sun : new Image(),
        moon : new Image(),
        earth : new Image(),
      }
    },
    methods: {
      init(){
        this.sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
        this.moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
        this.earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
        window.requestAnimationFrame(this.draw);
      },
      draw() {
        var ctx = this.$refs['canvas'].getContext('2d');

        ctx.globalCompositeOperation = 'destination-over';
        ctx.clearRect(0,0,300,300); // effacer le canvas

        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.strokeStyle = 'rgba(0,153,255,0.4)';
        ctx.save();
        ctx.translate(150,150);

        // Terre
        var time = new Date();
        ctx.rotate( ((2*Math.PI)/60)*time.getSeconds() + ((2*Math.PI)/60000)*time.getMilliseconds() );
        ctx.translate(105,0);
        ctx.fillRect(0,-12,50,24); // Ombre
        ctx.drawImage(this.earth,-12,-12);

        // Lune
        ctx.save();
        ctx.rotate( ((2*Math.PI)/6)*time.getSeconds() + ((2*Math.PI)/6000)*time.getMilliseconds() );
        ctx.translate(0,28.5);
        ctx.drawImage(this.moon,-3.5,-3.5);
        ctx.restore();

        ctx.restore();

        ctx.beginPath();
        ctx.arc(150,150,105,0,Math.PI*2,false); // Orbite terrestre
        ctx.stroke();

        ctx.drawImage(this.sun,0,0,300,300);

      window.requestAnimationFrame(this.draw);
      }
    },
    mounted(){
      this.init()
    }
  }
</scriptlt>
