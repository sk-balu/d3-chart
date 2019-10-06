import { Component, ViewChild, AfterViewInit, ElementRef, Input } from '@angular/core';
import { WIDTH, HEIGHT, MARGINS } from '../../constants/data';
import * as d3 from 'd3';
import * as moment from 'moment';

@Component({
  selector: 'app-chart-wrapper',
  templateUrl: './chart-wrapper.component.html',
  styleUrls: ['./chart-wrapper.component.scss']
})
export class ChartWrapperComponent implements AfterViewInit {

  @ViewChild('wrapperRef') wrapperRef: ElementRef;

  @Input() data: Array<{[key: string]: any}> = [];
  @Input() chartType = 'chart';

  public layer;
  public layerWidth;
  public layerHeight;
  public isLineType = false;
  public layerRendered = false;

  private xAxis;
  private xScale;
  private yAxis;
  private yScale;
  private boundary;

  get scales() {
    return {
      xScale: this.xScale,
      yScale: this.yScale,
      xAxis: this.xAxis
    };
  }

  ngAfterViewInit() {
    this.drawAxis();
    setTimeout( () => {
      this.layerRendered = true;
      this.isLineType = (this.chartType === 'line');
    });
  }

  private drawAxis() {
    this.layer =  d3.select(this.wrapperRef.nativeElement)
                  .append( 'svg' )
                  .attr('width', WIDTH)
                  .attr('height', HEIGHT);

    this.boundary = this.layer.node().getBoundingClientRect();
    this.layerHeight = this.boundary.height;
    this.layerWidth = this.boundary.width;

    this.drawXAxis();
    this.drawYAxis();
  }

  private drawXAxis() {
    this.xScale = this.createScale( 'time', [MARGINS.left, this.layerWidth ] );
    this.xAxis = d3.axisBottom(this.xScale).tickFormat((value: any) => moment(value).format('MMM D'));

    const attrs = {
      translate: `translate(0, ${this.layerHeight - MARGINS.bottom} )`,
      axis: this.xAxis,
      class: 'x-axis'
    };

    this.drawEachAxis( attrs )
        .call(g => g.selectAll('.tick line, .domain').attr('stroke-opacity', 0.5))
        .call(g => g.selectAll('.domain').attr('class', 'domain pointers'));
  }

  private drawYAxis() {

    this.yScale = this.createScale( 'revenue', [this.layerHeight - MARGINS.top, MARGINS.bottom] );
    this.yAxis = d3.axisLeft(this.yScale).tickFormat((value: any) => `${ value / 1000}k` ).ticks(5);

    const attrs = {
      translate: `translate( ${(MARGINS.left)}, 0)`,
      axis: this.yAxis,
      class: 'y-axis'
    };

    this.drawEachAxis( attrs )
        .call( g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick line')
                    .attr('stroke-opacity', 0.2)
                    .attr('x2', (this.layerWidth - (MARGINS.left))));
  }

  private createScale( key, range ): any {

    return d3.scaleLinear().domain([
      d3.min(this.data, function (d) { return d[key]; }),
      d3.max(this.data, function (d) { return d[key]; })
    ])
    .range(range);

  }

  private drawEachAxis( attrs ) {
    return this.layer.append('g').attr('class', attrs.class)
                    .attr('transform', attrs.translate)
                    .attr('style', 'font-size: 12px;')
                    .call(attrs.axis);
  }

}
