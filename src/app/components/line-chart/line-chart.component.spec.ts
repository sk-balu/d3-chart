import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { ChartWrapperComponent } from '../chart-wrapper/chart-wrapper.component';
import { LineChartComponent } from './line-chart.component';
import { BarChartComponent } from '../bar-chart/bar-chart.component';

import { CommonUtil } from 'src/app/utils/common-util';
import { DAILY_DATA } from 'src/app/constants/data';


describe('LineChartComponent', () => {
  let hostComponent: ChartWrapperComponent;
  let hostFixture: ComponentFixture<ChartWrapperComponent>;
  let fixture: ComponentFixture<LineChartComponent>;
  let component: LineChartComponent;
  let svg;

  configureTestSuite((() => {
    TestBed.configureTestingModule({
      declarations: [ LineChartComponent, ChartWrapperComponent, BarChartComponent ],
      providers: [CommonUtil]
    });
  }));

  beforeEach(() => {
    hostFixture = TestBed.createComponent(ChartWrapperComponent);
    hostComponent = hostFixture.componentInstance;
    fixture = TestBed.createComponent(LineChartComponent);
    component = fixture.componentInstance;

    hostComponent.data = DAILY_DATA;
    hostComponent.chartType = 'line';
    hostComponent.ngAfterViewInit();
    hostComponent.layerRendered = true;
    hostComponent.layerHeight = 300;
    hostComponent.layerWidth = 500;
    component.scales = hostComponent.scales;
    component.layer = hostComponent.layer;
    component.data = hostComponent.data;
    component.layerHeight = hostComponent.layerHeight;
    component.layerWidth = hostComponent.layerWidth;
    component.wrapperRef = hostComponent.wrapperRef.nativeElement;
    svg = component.layer;
  });

  it('LINE-CHART-COMPONENT-1 - Initialization', () => {
    const drawSpikeSpyOn = spyOn( component, 'drawSpike' ).and.callThrough();
    const drawPointersSpyOn = spyOn( component, 'drawPointers' ).and.callThrough();
    const createTooltipSpyOn = spyOn( component.cu, 'createTooltip' ).and.callThrough();

    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect( drawSpikeSpyOn ).toHaveBeenCalledTimes(1);
    expect( drawPointersSpyOn ).toHaveBeenCalledTimes(1);
    expect( createTooltipSpyOn ).toHaveBeenCalledTimes(1);
    expect( component.tooltip ).toBeTruthy();
  });

  it('LINE-CHART-COMPONENT-2 - Spike creation method evaluation', () => {

    fixture.detectChanges();
    expect( svg.selectAll('.line-chart-stoke').nodes().length).toEqual( 1 );
    expect( svg.selectAll('.line-chart-gradient').nodes().length).toEqual( 1 );
  });

  it('LINE-CHART-COMPONENT-3 - Tooltip pointer creation method evaluation', () => {
    fixture.detectChanges();
    expect( svg.selectAll('.mouse-per-line').nodes().length).toEqual( component.categories.domain().length );
    expect( svg.selectAll('.mouse-line').nodes().length).toEqual( 1 );
    expect( svg.selectAll('circle').nodes().length).toEqual( component.categories.domain().length );
    expect( component.lines.length ).toEqual( component.categories.domain().length );
  });

  it('LINE-CHART-COMPONENT-4 - Line mouseover & mouseout events evaluation', () => {
    fixture.detectChanges();

    const mouseWrapper = svg.select('.mouse-over-effects rect'),
          mouseLine = svg.select('.mouse-line'),
          mouseLineCircle = svg.select('.mouse-per-line circle'),
          tooltip = component.tooltip;

    expect( mouseLine.style('opacity') ).toEqual('0');
    expect( mouseLineCircle.style('opacity') ).toEqual('0');
    expect( tooltip.style('opacity') ).toEqual('0');
    mouseWrapper.on('mouseover').call( mouseWrapper.node() );
    expect( mouseLine.style('opacity') ).toEqual('1');
    expect( mouseLineCircle.style('opacity') ).toEqual('1');
    expect( tooltip.style('opacity') ).toEqual('1');
    mouseWrapper.on('mouseout').call( mouseWrapper.node() );
    expect( mouseLine.style('opacity') ).toEqual('0');
    expect( mouseLineCircle.style('opacity') ).toEqual('0');
    expect( tooltip.style('opacity') ).toEqual('0');
  });

  it('LINE-CHART-COMPONENT-5 - Line mousemove event evaluation', () => {
    const movePointersSpyOn = spyOn( component, 'movePointers').and.callThrough(),
          getCoordinatesSpyOn = spyOn( component, 'getCoordinates').and.callThrough(),
          getPathPositionSpyOn = spyOn( component, 'getPathPosition').and.callThrough(),
          showTipSpyOn = spyOn( component, 'showTip').and.callThrough();

    fixture.detectChanges();

    const mouseWrapper = svg.select('.mouse-over-effects rect');
    mouseWrapper.dispatch( 'mousemove' );
    expect( movePointersSpyOn ).toHaveBeenCalledTimes( 1 );
    expect( getCoordinatesSpyOn ).toHaveBeenCalledTimes( 2 );
    expect( getPathPositionSpyOn ).toHaveBeenCalledTimes( 2 );
    expect( showTipSpyOn ).toHaveBeenCalledTimes( 2 );

  });

});
