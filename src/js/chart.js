export default function chart() {
  var chart = $('.js-pie-chart');

  createChart(chart);
  chartEvents();

  function createChart(elem) {
    var chart = elem;
    chart.html('<svg viewBox="-1.25 -1.25 2.5 2.5" class="pie js-pie-svg"></svg><svg viewBox="-1.25 -1.25 2.5 2.5" class="pie__pattern js-pie-pattern"><defs><pattern id="pattern" patternUnits="userSpaceOnUse" width="1" height="1"><image xlink:href="img/lines.svg" x="-1" y="-1" width="2.5" height="2.5" style="transform: rotate(-90deg)"/></pattern></defs></svg>');

    // helpers
    var svg = $('.js-pie-svg');
    var pattern = $('.js-pie-pattern');
    var data = $(chart).data('pie');
    var slices = JSON.parse(JSON.stringify(data));
    var cumulativePercent = 0;

    slices.forEach(slice => {
      console.log(slice);
      var [startX, startY] = getCoordinatesForPercent(cumulativePercent);
      console.log([startX, startY]);

      cumulativePercent += (slice.percent / 100);

      var [endX, endY] = getCoordinatesForPercent(cumulativePercent);
      console.log([endX, endY]);


      var largeArcFlag = (slice.percent / 100) > 0.5 ? 1 : 0;

      var pathData = [
        `M ${startX} ${startY}`,
        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        'L 0 0'
      ].join(' ');

      var pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathElement.setAttribute('d', pathData);
      pathElement.setAttribute('fill', slice.color);
      pathElement.setAttribute('title', slice.name);

      svg.append(pathElement);

      var path = pathElement.cloneNode(true);
      pattern.append(path);
    });

  }

  function chartEvents() {
    var pathIndex = 0;

    // active part
    $('path[title="facebook"]').addClass('is-active');


    $('.js-pie-chart path').on('mouseenter', function(e) {
      $(this)
        .css({
          transform: 'scale(1.1)',
          transition: '0.5s'
        })
        .siblings()
        .css({
          transform: 'scale(1)',
          transition: '0.5s'
        })
        .removeClass('is-active');

    });

    $('.js-pie-pattern path').on('mouseenter', function(e) {
      pathIndex = $(this).index();

      $(this)
        .css({
          transform: 'scale(1.1)',
          transition: '0.5s',
          fill: 'url(#pattern)'
        })
        .siblings()
        .css({
          transform: 'scale(1)',
          transition: '0.5s',
          fill: ''
        })
        .removeClass('is-active');

      $('.js-pie-chart path').eq(pathIndex - 1).trigger('mouseenter');

    });
  }


  function getCoordinatesForPercent(percent) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);

    return [x, y];
  }
}
