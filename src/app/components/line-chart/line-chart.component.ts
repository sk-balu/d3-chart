import { Component, OnInit, Input } from '@angular/core';
import { MARGINS, WIDTH, HEIGHT, LINE_DUMMY_DATA } from 'src/app/constants/data';
import * as d3 from 'd3';
import * as moment from 'moment';import { CommonUtil } from 'src/app/utils/common-util';
;

@Component({
  selector: 'app-line-chart',
  template: '',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  public tooltip;
  public categories;
  public lines;

  @Input() data;
  @Input() layer;
  @Input() scales;
  @Input() layerHeight;
  @Input() layerWidth;
  @Input() wrapperRef;

  constructor( public cu: CommonUtil ) { }

  ngOnInit() {
    this.drawSpike();
    this.drawPointers();
    this.tooltip = this.cu.createTooltip( this.wrapperRef );
  }

  public drawSpike() {

    const line = d3.line().curve(d3.curveCatmullRom)
                          .x(( d: any ) =>  this.scales.xScale(d.time) )
                          .y(( d: any ) => this.scales.yScale( d.revenue ) ),
          area = d3.area().curve(d3.curveCatmullRom)
                          .x(( d: any ) =>  this.scales.xScale(d.time) )
                          .y0( this.layerHeight - MARGINS.bottom )
                          .y1(( d: any ) => this.scales.yScale(d.revenue) ),
          lines = this.layer.append('path')
                            .datum(LINE_DUMMY_DATA)
                            .attr('class', 'pointers line-chart-stoke')
                            .attr('stroke-width', 3)
                            .attr('fill', 'none')
                            .attr('d', ( d ) => line(d) ),
          areas = this.layer.append('path')
                            .datum(this.data)
                            .attr('stroke', 'none')
                            .attr('class', 'line-chart-gradient')
                            .attr('d', ( d ) => area( d ) )
                            .attr('opacity', '0' );

    lines.datum(this.data).transition().ease(d3.easeCircle).duration(750).attr('d', ( d ) => line(d) );
    areas.transition().delay(500).ease(d3.easeCircle).duration(200).attr('opacity', '1' );
  }

  public drawPointers() {

    const pointers = this.getMouseData(),
          mouseWrapper = this.layer.append('g').attr('class', 'mouse-over-effects'),
          lines = this.wrapperRef.getElementsByClassName('pointers'),
          mousePerLine = mouseWrapper.selectAll('.mouse-per-line')
                                    .data(pointers)
                                    .enter()
                                    .append('g')
                                    .attr('class', 'mouse-per-line');

    mouseWrapper.append('path') // this is the black vertical line to follow mouse
                .attr('class', 'mouse-line')
                .style('stroke', 'black')
                .style('stroke-dasharray', '2, 2')
                .style('stroke-width', '1px')
                .style('opacity', '0');

    mousePerLine.append('circle') // this is the circle pointer to follow mouse
                .attr('r', 5)
                .style('stroke', 'none')
                .style('fill', (d) => this.categories(d.name))
                .style('opacity', '0');

    this.lines = lines;
    this.bindMouseEvent( mouseWrapper );
  }

  private getMouseData() {
    this.categories = d3.scaleOrdinal(d3.schemeCategory10);
    this.categories.domain(d3.keys(this.data[0]).filter((key) => key ));
    return this.categories.domain().map( (name) => {
      return {
        name,
        values: this.data.map( d => {
          return { time: d.time, revenue: d.revenue };
        })
      };
    });
  }

  private bindMouseEvent( mouseWrapper ) {

    const _this = this,
          pointerLine = d3.select(this.wrapperRef).select('.mouse-line'),
          mousePerLine = d3.select(this.wrapperRef).selectAll('.mouse-per-line');

    mouseWrapper.append('svg:rect') // append a rect to catch mouse movements on canvas
          .attr('width', (this.layerWidth - MARGINS.left )) // can't catch mouse events on a g element
          .attr('height', (this.layerHeight - (MARGINS.top)))
          .attr('x', MARGINS.left)
          .attr('fill', 'none')
          .attr('pointer-events', 'all')
          .on('mouseout', () => { // on mouse out hide line and circles
            this.togglePointers('0');
          })
          .on('mouseover', () => { // on mouse in show line and circles
            this.togglePointers('1');
          })
          .on('mousemove', function() { // mouse moving over canvas
            const mouseEvent: any = event;
            _this.movePointers([mouseEvent.layerX, mouseEvent.layerY], mousePerLine, pointerLine);
          });
  }

  public movePointers(mouse, mousePerLine, pointerLine ) {

    mousePerLine.attr('transform', (d: any, i) => {

      const pos = this.getCoordinates(this.lines[i], mouse);

      pointerLine.attr('d', () => `M${mouse[0]},${this.layerHeight - MARGINS.bottom} ${mouse[0]}, ${pos.y}`);
      this.showTip(pos, mouse);
      return 'translate(' + mouse[0] + ',' + pos.y + ')';
    });
  }

  public showTip(pos: any, mouse: any) {
    if (pos.x && this.tooltip && this.tooltip.node()) {
      const tooltip = this.tooltip.node(),
            data = {
              time: moment(parseInt(this.scales.xScale.invert(pos.x), 10)).format('MMM D'),
              revenue: parseInt(this.scales.yScale.invert(pos.y), 10)
            };

      this.cu.setTooltipContent(this.tooltip, data)
              .style('left', `${(mouse[0] - (tooltip.offsetWidth / 2))}px`)
              .style('top', `${(pos.y - (tooltip.offsetHeight + 20))}px`);
    }
  }

  public getCoordinates( path, mouse ) {
    let beginning = 0,
        end = path.getTotalLength(),
        target, pos;

    while (true) {
      target = Math.floor((beginning + end) / 2);
      pos = this.getPathPosition(path, target);

      if ((target === end || target === beginning) && pos.x !== mouse[0]) {
        break;
      } else if (pos.x > mouse[0]) {
        end = target;
      } else if (pos.x < mouse[0]) {
        beginning = target;
      } else {
        break;
      }
    }

    return pos;
  }

  public getPathPosition(path, target: any) {
    let pos;
    if (path.classList.contains('domain')) {
      pos = { y: this.layerHeight - MARGINS.bottom };
    } else {
      pos = path.getPointAtLength(target);
    }
    return pos;
  }

  private togglePointers( value ) {
    const wrapper = d3.select(this.wrapperRef);
    wrapper.select('.mouse-line').style('opacity', value);
    wrapper.selectAll('.mouse-per-line circle').style('opacity', value);

    if ( this.tooltip ) {
      this.tooltip.style('opacity', value);
    }
  }

}
