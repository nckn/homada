<template lang="pug">
  div.date-picker
    draggable.date-selector
      .picker-options.year#first
      .picker-options.month#second
      .picker-options.day#third
      .picker-options.fourth#fourth1
      .picker-options.fifth#fifth1
    //- .hour-selector
    //-   .hour#hour
    //-   .minute#minute
</template>

<script>

// if (process.browser) {
//   require('../static/js/picker.js')
// }

import IosSelector from '../static/js/picker'
import Draggable from "vuedraggable";

export default {
  name: 'Picker',
  data () {
    return {
      years: [],
      months: [],
      verbs: [],
      fourth: [],
      fifth: [],
      currentYear: new Date().getFullYear(),
      currentMonth: 1,
      currentDay: 1,
      fourthOption: 1,
      fifthOption: 1,
      firstSelector: '',
      secondSelector: '',
      thirdSelector: '',
      fourthSelector: '',
      fifthSelector: '',
      // Pluralis or singular
      pluralis: true
    }
  },
  components: {
    //
    Draggable
  },
  watch: {
    pluralis() {
      // console.log('yeah it changed alright')
      this.sourceSecond = this.getSecond()
      const allOptions = [...document.getElementById('second').querySelectorAll('.select-option')]
      allOptions.forEach( (option, index) => {
        // console.log('option')
        // console.log(option)
        if (!option.getAttribute('data-org-index'))
          return
        const orgIndex = option.getAttribute('data-org-index')
        // console.log(typeof orgIndex)
        // console.log(orgIndex)
        // if (orgIndex)
        if (this.pluralis) {
          option.innerHTML = this.months[orgIndex].text
        }
        else {
          option.innerHTML = this.months[orgIndex].textSingular
        }
      });
    }
  },
  props: [
    //
  ],
  mounted() {
    // console.log('Select')
    this.sourceFirst = this.getFirst()
    // this.sourceFirst = this.years
    this.sourceSecond = this.getSecond()
    // this.sourceSecond = this.months
    // this.sourceThird = this.getThird(this.currentYear, this.currentMonth)
    this.sourceThird = this.getThird()
    this.sourceFourth = this.getFourth()
    this.sourceFifth = this.getFifth()

    this.setupPickers()
  },
  methods: {
    setupPickers() {
      var _this = this

      this.firstSelector = new IosSelector({
        el: '#first',
        type: 'infinite',
        source: this.sourceFirst,
        count: 20,
        onChange: (selected) => {
          console.log('first selector changed')
          console.log(`value: ${JSON.stringify(selected)}`)

          // console.log(selected.text)
          // Set pluralis to false
          if (selected.text === 'One') {
            console.log('changing pluralis')
            _this.pluralis = false
          }
          else {
            _this.pluralis = true
          }
          _this.currentYear = selected.value
          _this.sourceThird = _this.getThird(_this.currentYear, _this.currentMonth)
          _this.thirdSelector.updateSource(_this.sourceThird)
          // console.log(_this.firstSelector.value, _this.secondSelector.value, _this.thirdSelector.value)
        }
      })

      this.secondSelector = new IosSelector({
        el: '#second',
        type: 'infinite',
        source: this.sourceSecond,
        count: 20,
        onChange: (selected) => {
          console.log('second selector changed')
          console.log(`value: ${JSON.stringify(selected)}`)

          _this.currentMonth = selected.value
          _this.sourceThird = _this.getThird(_this.currentYear, _this.currentMonth)
          _this.thirdSelector.updateSource(_this.sourceThird)
          // console.log(_this.firstSelector.value, _this.secondSelector.value, _this.thirdSelector.value)
        }
      })

      this.thirdSelector = new IosSelector({
        el: '#third',
        type: 'infinite',
        source: [],
        count: 20,
        onChange: (selected) => {
          console.log('third selector changed')
          console.log(`value: ${JSON.stringify(selected)}`)

          _this.currentDay = selected.value
          // console.log(_this.firstSelector.value, _this.secondSelector.value, _this.thirdSelector.value)
        }
      })
      
      this.fourthSelector = new IosSelector({
        el: '#fourth1',
        type: 'infinite',
        // source: [],
        source: this.sourceFourth,
        count: 20,
        onChange: (selected) => {
          console.log('fourth selector changed')
          console.log(`value: ${JSON.stringify(selected)}`)

          _this.fourthOption = selected.value
          // console.log(_this.firstSelector.value, _this.secondSelector.value, _this.thirdSelector.value)
        }
      })
      
      this.fifthSelector = new IosSelector({
        el: '#fifth1',
        type: 'infinite',
        // source: [],
        source: this.sourceFifth,
        count: 20,
        onChange: (selected) => {
          console.log('fifth selector changed')
          console.log(`value: ${JSON.stringify(selected)}`)

          _this.fifthOption = selected.value
          // console.log(_this.firstSelector.value, _this.secondSelector.value, _this.thirdSelector.value)
        }
      })

      this.getThem()
    },
    getThem() {
      var _this = this
      var now = new Date()
      // await this.firstSelector.select(now.getFullYear())
      // await this.secondSelector.select(now.getMonth() + 1)
      // await this.thirdSelector.select(now.getDate())
      setTimeout(function() {
        // _this.firstSelector.select(now.getFullYear())
        _this.firstSelector.select('All')
        // _this.secondSelector.select(now.getMonth() + 1)
        _this.secondSelector.select('the people in the')
        // _this.thirdSelector.select(now.getDate())
        _this.thirdSelector.select('drank')
        _this.fourthSelector.select('1 litr of ')
        _this.fifthSelector.select('the Garda Lake')
      })
      // }, 200)
    },
    getFirst() {
      // let currentYear = new Date().getFullYear();
      // let years = []

      // for (let i = currentYear - 20; i < currentYear + 20; i++) {
      //   years.push({
      //     value: i,
      //     text: i + '年'
      //   })
      // }

      this.years = [
        {value: 0, text: 'All'},
        {value: 1, text: 'One'},
        {value: 2, text: 'Custom'}
      ]
      return this.years
    },
    getSecond(year) {
      // let months = [];
      // for (let i = 1; i <= 12; i++) {
      //   months.push({
      //     value: i,
      //     text: i + '月'
      //   })
      // }
      this.months = [
        {value: 0, text: 'people', textSingular: 'person'},
        {value: 1, text: 'cars', textSingular: 'car'},
        {value: 2, text: 'animals', textSingular: 'animal'},
        {value: 3, text: 'elephants', textSingular: 'elephant'},
      ]
      return this.months
    },
    getThird(year, month) {
      // let dayCount = new Date(year,month,0).getDate(); 
      // let days = [];

      // for (let i = 1; i <= dayCount; i++) {
      //   days.push({
      //     value: i,
      //     text: i + '日'
      //   })
      // }

      this.verbs = [
        {value: 0, text: 'ate'},
        {value: 1, text: 'drank'},
        {value: 2, text: 'held'},
      ]

      return this.verbs
    },
    getFourth() {

      this.fourth = [
        {value: 0, text: '1 liter of'},
        {value: 1, text: '1 spoonful of'},
        {value: 1, text: '1 mg of'},
        // {value: 2, text: '1 cubic meters of'},
      ]

      return this.fourth
    },
    getFifth() {

      this.fifth = [
        {value: 0, text: 'the Garda Lake'},
        {value: 1, text: 'Mount Everest'},
        {value: 1, text: 'the moon'},
        {value: 1, text: 'the sun'},
        // {value: 2, text: '1 cubic meters of'},
      ]

      return this.fifth
    }
  }
}

</script>

<style lang="scss">

.date-picker {
  // padding: 24px;
}

.highlight {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  width: 100%;
  // border-top: 1px solid #333;
  // border-bottom: 1px solid #333;
  // background-color: #000;
  font-size: 24px;
  overflow: hidden;
  .highlight-list {
    visibility: hidden;
    // display: none;
    position: absolute;
    width: 100%;
  }
}

.date-picker {
  width: 100%;
  @media screen and (min-width: 768px) {
    width: 850px;
  }
}

/* date */
.date-selector {
  // position: absolute;
  // left: 50%;
  // top: 50%;
  // transform: translate(-50%, -50%);
  perspective: 2000px;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  
  flex-wrap: wrap;
  .picker-options {
    // If bigger than tablet
    width: 50%;
    flex: auto;
    @media screen and (min-width: 768px) {
      width: 20%;
      // width: 20%;
    }
  }

  width: 100%;
  // If bigger than tablet
  @media screen and (min-width: 768px) {
    width: 100%;
  }
  // width: 500px;
  height: 300px;
  z-index: 1;

  > div {
    flex: 1;
  }

  // .select-wrap {
  //   font-size: 18px;
  // }
  // .highlight {
  //   font-size: 20px;
  // }

  .select-wrap {
    position: relative;
    // top: 200px;
    height: 100%;
    // perspective: 1200px;
    text-align: center;
    overflow: hidden;
    font-size: 20px;
    color: #ddd;
    transition: all 0.25s ease;
    &:before, &:after {
      position: absolute;
      z-index: 1;
      display: block;
      content: '';
      width: 100%;
      height: 50%;
      transition: all 0.25s ease;
    }
    &:before {
      top: 0;
      // background-image: linear-gradient(to bottom, rgba(1, 1, 1, 0.5), rgba(1, 1, 1, 0));
      // background: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);

      // background: white;
      // background: linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 90%);
      background: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, white 20%)
    }
    &:after {
      bottom: 0;
      // background-image: linear-gradient(to top, rgba(1, 1, 1, 0.5), rgba(1, 1, 1, 0));
      
      // background: white;
      background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 20%);
    }

    .select-options {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 0;
      transform-style: preserve-3d;
      margin: 0 auto;
      display: block;
      transform: translateZ(-150px) rotateX(0deg);
      -webkit-font-smoothing: subpixel-antialiased;
      color: #000;
      .select-option {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 50px;
        white-space: nowrap;

        -webkit-font-smoothing: subpixel-antialiased;
        @for $i from 1 through 100 {
          &:nth-child(#{$i}) {
            transform: rotateX(-18deg * ($i - 1)) translateZ(150px);
          }
        }
      }
    }
  }

  // .month {
  //   opacity: 0;
  // }
  .picker-options {
    &:hover {
      .select-wrap {
        .highlight {
          border-top: 1px solid #333;
          border-bottom: 1px solid #333;
        }
        &:before {
          background: linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 90%);
        }
        &:after {
          background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 90%);
        }
      }
    }
  }
}

</style>
