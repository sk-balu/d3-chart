import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import * as moment from 'moment';
import { MARGINS, HEIGHT, WIDTH } from 'src/app/constants/data';
import { CommonUtil } from 'src/app/utils/common-util';

@Component({
  selector: 'app-bar-chart',
  template: '',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

  @Input() data;
  @Input() layer;
  @Input() scales;
  @Input() layerHeight;
  @Input() layerWidth;
  @Input() wrapperRef;

  private tooltip;

  constructor( protected cu: CommonUtil ) { }

  ngOnInit() {
    this.drawBar();
    this.tooltip = this.cu.createTooltip( this.wrapperRef, 'transition' );
  }

  private drawBar() {

    const x = this.scales.xScale,
          y = this.scales.yScale,
          svg = d3.select(this.wrapperRef).select('svg'),
          line = d3.line().curve(d3.curveCardinal)
                    .x( function( d: any, index ) {
                      const bar: any = svg.selectAll('.bar').nodes()[index];
                      return x(d.time) + (bar.getBoundingClientRect().width / 2);
                    })
                    .y(( d: any ) => y(d.revenue) ),
          transition = svg.transition();

    this.scales.xAxis.ticks(5);
    svg.append('g')
       .attr('transform', 'translate( 0,' + -MARGINS.top + ')')
       .selectAll('bar')
       .data(this.data)
       .enter().append('rect')
       .attr('class', 'bar')
       .attr('width', '3%')
       .attr('height', (d: any ) => (this.layerHeight - y(d.revenue)) )
       .attr('x', (d: any ) =>  x(d.time) )
       .attr('y', y(0))
       .on( 'mouseover', ( d: any, index ) => {
          const circle: any = d3.select(this.wrapperRef).select('svg').selectAll('circle').nodes()[index];
          circle.style.opacity = '1';
          if ( this.tooltip ) { this.showTip(d, circle); }
        })
       .on( 'mouseleave', () => {
          const circle: any = d3.select(this.wrapperRef).select('svg').selectAll('circle');
          circle.style( 'opacity', '0');
          if ( this.tooltip ) {
            this.tooltip.style('opacity', '0');
          }
        });

    transition.ease(d3.easeCubic).selectAll('rect').attr('y', (d: any) => y(d.revenue) );
    this.lineWithCurtain(svg, line, transition);
    this.drawTipDots(x, y);
  }

  private lineWithCurtain(svg, line, transition) {

    svg.append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', WIDTH)
      .attr('height', HEIGHT);

    this.layer.append('path')
      .datum(this.data)
      .attr('transform', 'translate( 0, -10)')
      .attr('class', 'line-chart-stroke')
      .attr('stroke-width', 3)
      .attr('fill', 'none')
      .attr('clip-path', 'url(#clip)')
      .attr('d', (d) => line(d));

    svg.append('rect')
      .attr('x', -1 * this.layerWidth)
      .attr('y', -1 * this.layerHeight)
      .attr('height', this.layerHeight)
      .attr('width', this.layerWidth)
      .attr('class', 'curtain')
      .attr('transform', 'rotate(180)')
      .style('fill', '#ffffff');

    transition.duration(1000).ease(d3.easeLinear).select('rect.curtain').attr('width', 0);
  }

  private drawTipDots(x: any, y: any) {
    d3.select(this.wrapperRef).select('svg').selectAll('circle') // this is the circle pointer to follow mouse
      .data(this.data)
      .enter()
      .append('circle')
      .attr('transform', 'translate( 0, -10)')
      .attr('cx', (d: any, index) => {
        const bar: any = d3.select(this.wrapperRef).select('svg').selectAll('.bar').nodes()[index];
        return x(d.time) + (bar.getBoundingClientRect().width / 2);
      })
      .attr('cy', (d: any) => y(d.revenue))
      .attr('r', 3)
      .attr('class', 'bar-line-dot')
      .attr('stroke-width', '1px')
      .attr('stroke', '#fff')
      .style('opacity', '0');
  }

  private showTip(d: any, circle: any) {
    const tooltip = this.tooltip.node(),
          data = {
            time: moment(d.time).format('MMM D'),
            revenue: d.revenue,
            growth: d3.format('.0%')(d.growth / d.revenue)
          };

    this.tooltip.style('opacity', '1');
    this.cu.setTooltipContent( this.tooltip, data )
            .style('left', `${(circle.attributes.cx.value - (tooltip.offsetWidth / 2))}px`)
            .style('top', `${(circle.attributes.cy.value - (tooltip.offsetHeight + 30))}px`);
  }
}
