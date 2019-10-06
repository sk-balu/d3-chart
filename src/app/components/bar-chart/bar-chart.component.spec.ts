import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { BarChartComponent } from './bar-chart.component';
import { ChartWrapperComponent } from '../chart-wrapper/chart-wrapper.component';
import { LineChartComponent } from '../line-chart/line-chart.component';

import { CommonUtil } from 'src/app/utils/common-util';
import { MONTHLY_DATA } from 'src/app/constants/data';

describe('BarChartComponent', () => {
  let hostComponent: ChartWrapperComponent;
  let hostFixture: ComponentFixture<ChartWrapperComponent>;
  let fixture: ComponentFixture<BarChartComponent>;
  let component: BarChartComponent;
  let svg;

  configureTestSuite((() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartComponent, ChartWrapperComponent, LineChartComponent ],
      providers: [CommonUtil]
    });
  }));

  beforeEach(() => {
    hostFixture = TestBed.createComponent(ChartWrapperComponent);
    hostComponent = hostFixture.componentInstance;
    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;

    hostComponent.data = MONTHLY_DATA;
    hostComponent.chartType = 'bar';
    hostFixture.detectChanges();
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

  it('BAR-CHART-COMPONENT-1 - Initialization', () => {
    const drawBarSpyOn = spyOn( component, 'drawBar' ).and.callThrough();
    const createTooltipSpyOn = spyOn( component.cu, 'createTooltip' ).and.callThrough();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect( drawBarSpyOn ).toHaveBeenCalledTimes(1);
    expect( createTooltipSpyOn ).toHaveBeenCalledTimes(1);
    expect( component.tooltip ).toBeTruthy();
  });

  it('BAR-CHART-COMPONENT-2 - Bar creation method evaluation', () => {
    const lineWithCurtainSpyOn = spyOn( component, 'lineWithCurtain' ).and.callThrough();
    const drawTipDotsSpyOn = spyOn( component, 'drawTipDots' ).and.callThrough();

    fixture.detectChanges();
    expect( svg.selectAll('.bar').nodes().length).toEqual( component.data.length );
    expect( lineWithCurtainSpyOn ).toHaveBeenCalledTimes(1);
    expect( drawTipDotsSpyOn ).toHaveBeenCalledTimes(1);
  });

  it('BAR-CHART-COMPONENT-3 - Line & animation layer creation method evaluation', () => {
    fixture.detectChanges();
    expect(svg.select('#clip').nodes().length).toEqual( 1 );
    expect(svg.selectAll('.line-chart-stroke').nodes().length).toEqual( 1 );
    expect(svg.selectAll('.curtain').nodes().length).toEqual( 1 );
  });

  it('BAR-CHART-COMPONENT-4 - Tooltip pointer dot method evaluation', () => {
    fixture.detectChanges();
    expect(svg.selectAll('circle').nodes().length).toEqual( component.data.length );
  });

  it('BAR-CHART-COMPONENT-5 - Bar mouseover & mouseleave events evaluation', () => {
    fixture.detectChanges();
    const bar = svg.select('.bar');
    expect( component.tooltip.style('opacity') ).toEqual( '0' );
    bar.on('mouseover').call( bar.node(), bar.datum(), 0);
    expect( component.tooltip.style('opacity') ).toEqual( '1' );
    bar.on('mouseleave').call( bar.node(), bar.datum(), 0);
    expect( component.tooltip.style('opacity') ).toEqual( '0' );
  });
});
