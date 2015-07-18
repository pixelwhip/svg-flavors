var Snap = Snap || null;

(function(Snap) {
  if (!Snap) { return; }

  var s = Snap("#time-widget"),
      hoursInput,
      minutesInput,
      indicator;

  var state = {
    hours: 12,
    minutes: 45,
    meridiem: 'am',
    active: 'hh',
  }

  var hourOptions = {
    name: 'hours',
    start: 1,
    end: 12,
    steps: 12,
    arc: 360,
    valueMap: {
      startValue: 0,
      endValue: 12,
      startAngle: 0,
      endAngle: 360
    }
  };

  var minuteOptions = {
    name: 'minutes',
    start: 0,
    end: 55,
    steps: 12,
    arc: 360,
    leadingZero: true,
    valueMap: {
      startValue: 0,
      endValue: 60,
      startAngle: 0,
      endAngle: 360
    }
  };


  function clockFace() {
    var name = name,
        indicator,
        numbers,
        valueMap,
        face,
        input;

    /* Create indicator hand */
    function createIndicator(canvas) {
      var indicatorLine = canvas.line(150, 150, 150, 60).attr({stroke: "hotPink"});
          indicatorEnd = canvas.circle(150, 48, 20).attr({fill: "hotPink", opacity: ".8"});
          indicatorPivot = canvas.circle(150, 150, 2).attr({fill: "white"});

      return canvas.group(indicatorLine, indicatorEnd, indicatorPivot).attr({
        class: 'indicator'
      });
    };

    /* Create numbers around the face */
    function createNumbers(canvas, options) {
      var i = options.start,
          incrementBy = (options.valueMap.endValue - options.valueMap.startValue) / options.steps,
          numbers = {},
          numbersGroup = s.g().attr({
            class: 'numbers'
          }),
          currentValue = function() {
            return i * incrementBy;
          };

      while (currentValue() <= options.end) {
        var angle = getAngleFromValue(currentValue(), valueMap);
        numbers[i] = numbersGroup.text(150, 150, [pad(currentValue(), 2)])
          .attr({
            textAnchor: "middle",
            dominantBaseline: "central",
            fill: "#ccc",
            fontWeight: "normal",
            fontSize: 24,
            class: 'face-number'
          })
          .transform("t0,-100r" + angle + ",150,250r" + -1 * angle)
          .click(numberClick);
        i++;
      }
      return numbersGroup;
    };

    function numberClick(e) {
      var value = this.attr('text');
      updateValue(value);
    };

    function pad(num, size) {
      var s = "0" + num;
      return s.substr(s.length-size);
      console.log(s);
      return s;
    }

    function updateValue(value) {
      setIndicator(getAngleFromValue(value, valueMap));
      input.value = pad(value, 2);
      return this;
    };

    function getAngleFromValue(value, map) {
      var valueSpread = map.endValue - map.startValue;
      var angleSpread = map.endAngle - map.startAngle;
      var valueProgress = value/valueSpread;

      return (valueProgress * angleSpread) + map.startAngle;
    };

    function setIndicator(angle) {
      indicator.animate({
        transform: "r" + angle + ",150,150"
      }, 200, mina.easeout);
      return this;
    };

    pub = {

      getValueMap: function() {
        return valueMap;
      },

      updateValue: updateValue,

      hide: function() {
        face.animate({
            opacity: 0,
            transform: "s0,150,150"
          },
          1000,
          mina.elastic
        ).attr({
          'aria-hidden': true
        });
        input.classList.remove('active');
        return this;
      },

      show: function() {
        face.animate({
            opacity: 1,
            transform: "s1,150,150"
          },
          1000,
          mina.elastic
        ).attr({
          'aria-hidden': false,
        });
        input.classList.add('active');
        return this;
      },

      init: function(name, numberOptions, bindTo) {
        valueMap = numberOptions.valueMap;
        indicator = createIndicator(s);
        numbers = createNumbers(s, numberOptions);
        face = s.group(indicator, numbers).attr({
          'class': 'face'
        });
        input = bindTo;

        return this;
      }
    };

    return pub;
  }

  function bindUI() {
    hoursInput.addEventListener('click', function() {
      minutesFace.hide();
      hoursFace.show();
    });
    minutesInput.addEventListener('click', function() {
      hoursFace.hide();
      minutesFace.show();
    });
  };

  function timeInputInit() {
    hoursInput = document.querySelectorAll('.time-form-hour')[0];
    minutesInput = document.querySelectorAll('.time-form-minute')[0];

    // Lets create big circle in the middle:
    var face = s.circle(150, 150, 140);
    face.attr({
      opacity: ".2",
    });

    minutesFace = new clockFace;
    minutesFace.init('minutes', minuteOptions, minutesInput).hide();
    hoursFace = new clockFace;
    hoursFace.init('hours', hourOptions, hoursInput).show();
  };

  timeInputInit();
  bindUI();

})(Snap);
