import Spline from './cspl.js'


export default {
  height: 30,
  canvas: null,
  pointSize: 1.5,
  pointGap: 1,
  sampleRate: 40000,
  fftSize: 128,
  frequencies: [260, 600, 1000, 1500],
  speed: [12, 15, 16, 17,],
  limits: [
    {bottom: 0, top: 240},
    {bottom: 0, top: 240},
    {bottom: 0, top: 240},
    {bottom: 0, top: 240}],
  segments: [],
  middles: [],
  mains: [],
  direction: [],
  uniq: '',
  lastY: [],
  raf:null,


  // Init effect
  init(id) {

    this.fillSegments()
    this.direction = new Array(this.frequencies.length).fill(1)
    this.uniq = Math.random().toString(16).slice(2)

    this.canvas = document.getElementById(id)
    this.canvas.width = this.fftSize * (this.pointSize + this.pointGap); // TEMP
    this.canvas.height = this.height

    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.segmentWidth = this.width / this.fftSize;

    this.drawVisualization()
  },

  destroy(){
    this.uniq = Math.random().toString(16).slice(2)
    cancelAnimationFrame(this.far)
  },

  fillSegments(){

    for (let i = 0; i< this.fftSize; i++){
      this.segments.push({
        value: 0,
        main: false,
        left: null,
        right: null,
        inner: null,
        middle: null,
      })
    }

    const segmentWidth = this.sampleRate / (2 * this.fftSize);

    this.frequencies.forEach((frequency, index) => {
      const segmentIndex = Math.floor(frequency / segmentWidth);
      this.segments[segmentIndex].main = true
      this.segments[segmentIndex].left = index
      this.segments[segmentIndex].right = index + 1
      this.mains.push(segmentIndex)
    })

    let main = 0

    for (let i = 0; i < this.fftSize; i++){

      if (this.segments[i].main === true) main++
      else {
        this.segments[i].inner = main
      }
    }

    for (let i = 0; i <= this.frequencies.length; i++){

      const indexes = this.segments
        .map((element, index) => ({index, inner: element.inner}))
        .filter(obj => obj.inner === i)
        .map(obj => obj.index);

      if (indexes.length) {

        let middleIndex, rightIndex, leftIndex;

        if (typeof this.frequencies[i] !== 'undefined')
           rightIndex = Math.floor(this.frequencies[i] / segmentWidth);
        else
          rightIndex = this.segments.length - 1

        if (typeof this.frequencies[i - 1] !== 'undefined')
          leftIndex = Math.floor(this.frequencies[i - 1] / segmentWidth);
        else
          leftIndex = 0

        if (indexes.length % 2 !== 0) {
          this.segments[indexes[Math.floor(indexes.length / 2)]].middle = i;
          middleIndex = indexes[Math.floor(indexes.length / 2)]
        }else {

          if (this.segments[leftIndex].value > this.segments[rightIndex].value) {
            this.segments[indexes[(indexes.length / 2) - 1]].middle = i;
            middleIndex = indexes[(indexes.length / 2) - 1]
          } else {
            this.segments[indexes[(indexes.length / 2)]].middle = i;
            middleIndex = indexes[(indexes.length / 2)]
          }
        }

        this.middles.push({index: middleIndex, left: leftIndex, right: rightIndex})
      }
    }
  },

  drawVisualization() {
    this.drawFrame(this.uniq);
  },

  drawFrame(uniq) {
    if (uniq === this.uniq)
      this.far = requestAnimationFrame(() => this.drawFrame(uniq));

    let path = new Path2D();

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.fftSize; i++) {
      const segmentHeight = (this.segments[i].value / 256) * this.height;

      let segmentSpeed = 1;

      if (this.lastY[i] < this.height - segmentHeight) {
        path.moveTo(i * this.segmentWidth + this.segmentWidth / 2 + this.pointSize / 2, this.lastY[i]);
        path.arc(i * this.segmentWidth + this.segmentWidth / 2, this.lastY[i], this.pointSize / 2, 0, Math.PI * 2);
        this.lastY[i] = this.lastY[i] + this.lastY[i] / 30
      }

      for (let j = this.height; j > this.height - segmentHeight; j -= (this.pointSize + this.pointGap)) {
        path.moveTo(i * this.segmentWidth + this.segmentWidth / 2 + this.pointSize / 2, j);
        path.arc(i * this.segmentWidth + this.segmentWidth / 2, j, this.pointSize / 2, 0, Math.PI * 2);
      }

      if (typeof this.lastY[i] === 'undefined' || this.lastY[i] > this.height - segmentHeight)
        this.lastY[i] = this.height - segmentHeight;
    }
    this.ctx.fillStyle = "white";
    this.ctx.fill(path);
    this.simulateGetByteFrequencyData()
  },

  simulateGetByteFrequencyData(){

    this.mains.forEach((el,index) => {
      this.segments[el].value = this.changeValueWithDirection(this.segments[el].value, index)
    })

    this.middles.forEach((el) => {
      this.segments[el.index].value = (this.segments[el.left].value + this.segments[el.right].value) / 2

      this.changeSegmentsWithSpline(el.left, el.right, el.index)
    })
  },

  changeValueWithDirection(value, index){

    value += this.direction[index] * this.speed[index];
    let top = (typeof this.limits[index] !=='undefined' ? this.limits[index].top : 240)
    let bottom = (typeof this.limits[index] !=='undefined' ? this.limits[index].bottom : 0)
    if (value >= top) {
      this.direction[index] *= -1;
      value = top
    }
    if (value <= bottom) {
      this.direction[index] *= -1;
      value = bottom
    }

    return value;
  },

  changeSegmentsWithSpline(mainLeftIndex, mainRightIndex, innerCenterIndex) {

    const allPoints = []
    for (let i = mainLeftIndex; i <= mainRightIndex; i++) {
      allPoints.push({index: i, value: this.segments[i].value})
    }

    //const xs = [mainLeftIndex, innerCenterIndex, mainRightIndex];
    //const ys = [this.segments[mainLeftIndex].value, this.segments[innerCenterIndex].value, this.segments[mainRightIndex].value];
    const points = {}
    points[mainLeftIndex] = this.segments[mainLeftIndex].value
    points[innerCenterIndex] = this.segments[innerCenterIndex].value
    points[mainRightIndex] = this.segments[mainRightIndex].value

    //let spline = new Spline(xs, ys);
    let spline = new Spline(points)
    for (let i = 0; i < allPoints.length; i++) {
      const t = mainLeftIndex + i

      this.segments[allPoints[i].index].value = spline(t)//spline.at(t)
    }
    //console.log('this.segments',this.segments)
    //debugger
  }
}
