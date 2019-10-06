import * as d3 from 'd3';

export class CommonUtil {
  createTooltip( wrapper, classNames? ) {
    return d3.select(wrapper).append('div')
                             .style('opacity', 0)
                             .attr('class', `tooltip ${classNames}`);
  }

  setTooltipContent( tip, data) {
    let content = '';
    if ( data.time ) { content += `<span class='date'>${data.time}</span><br>`; }
    if ( data.revenue ) { content += `<span class='revenue'>${data.revenue}</span><br>`; }
    if ( data.growth ) { content += `<span class='growth'>${data.growth}</span>`; }
    tip.html(content);
    return tip;
  }
}
