var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { cloneDeep, defaultsDeep, isEqual, merge, uniqueId } from 'lodash';
import * as d3 from 'd3';
import { ChartDefaults } from '../chart-defaults';
import { ChartBase } from '../chart-base';
import { DonutConfig } from './donut-config';
import { WindowReference } from '../../utilities/window.reference';
/**
 * Donut chart component.
 *
 * Note: In order to use charts, please include the following JavaScript file from patternfly. For example:
 * <code>require('patternfly/dist/js/patternfly-settings');</code>
 */
var DonutComponent = /** @class */ (function (_super) {
    __extends(DonutComponent, _super);
    /**
     * Default constructor
     * @param chartDefaults
     */
    function DonutComponent(chartDefaults, windowRef) {
        var _this = _super.call(this) || this;
        _this.chartDefaults = chartDefaults;
        _this.windowRef = windowRef;
        _this.subscriptions = [];
        _this.subscriptions.push(_this.chartLoaded.subscribe({
            next: function (chart) {
                _this.chartAvailable(chart);
            }
        }));
        return _this;
    }
    /**
     * Setup component configuration upon initialization
     */
    DonutComponent.prototype.ngOnInit = function () {
        this.setupConfigDefaults();
        this.setupConfig();
        this.generateChart(this.config);
    };
    /**
     * Check if the component config has changed
     */
    DonutComponent.prototype.ngDoCheck = function () {
        if (!isEqual(this.config, this.prevConfig) || !isEqual(this.chartData, this.prevChartData)) {
            this.setupConfig();
            this.generateChart(this.config, true);
        }
    };
    /**
     * Clean up subscriptions
     */
    DonutComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (sub) { return sub.unsubscribe; });
    };
    /**
     * Set up default config
     */
    DonutComponent.prototype.setupConfig = function () {
        if (this.config !== undefined) {
            defaultsDeep(this.config, this.defaultConfig);
        }
        else {
            this.config = cloneDeep(this.defaultConfig);
        }
        if (this.config.chartHeight !== undefined) {
            this.config.size.height = this.config.chartHeight;
        }
        this.config.data = merge(this.config.data, this.getChartData());
        this.prevConfig = cloneDeep(this.config);
        this.prevChartData = cloneDeep(this.chartData);
    };
    /**
     * Set up default config
     */
    DonutComponent.prototype.setupConfigDefaults = function () {
        this.defaultConfig = this.chartDefaults.getDefaultDonutConfig();
        this.defaultConfig.chartId = uniqueId();
        this.defaultConfig.data = {
            type: 'donut',
            order: null
        };
        this.defaultConfig.donut = this.chartDefaults.getDefaultDonut();
        this.defaultConfig.tooltip = { contents: (this.windowRef.nativeWindow).patternfly.pfDonutTooltipContents };
    };
    /**
     * Convert chartData to C3 data property
     */
    DonutComponent.prototype.getChartData = function () {
        return {
            columns: this.chartData,
            colors: this.config.colors
        };
    };
    /**
     * Returns an object containing center label properties
     * @returns {any}
     */
    DonutComponent.prototype.getCenterLabelText = function () {
        // Public for testing
        var centerLabelText = {
            bigText: this.getTotal(),
            smText: this.config.donut.title
        };
        if (this.config.centerLabel) {
            centerLabelText.bigText = this.config.centerLabel;
            centerLabelText.smText = '';
        }
        return centerLabelText;
    };
    // Private
    DonutComponent.prototype.chartAvailable = function (chart) {
        this.setupDonutChartTitle(chart);
    };
    DonutComponent.prototype.getTotal = function () {
        var total = 0;
        if (this.config.data !== undefined && this.config.data.columns !== undefined) {
            this.config.data.columns.forEach(function (element) {
                if (!isNaN(element[1])) {
                    total += Number(element[1]);
                }
            });
        }
        return total;
    };
    DonutComponent.prototype.setupDonutChartTitle = function (chart) {
        var donutChartTitle, centerLabelText;
        if (chart === undefined) {
            return;
        }
        donutChartTitle = d3.select(chart.element).select('text.c3-chart-arcs-title');
        if (donutChartTitle === undefined) {
            return;
        }
        centerLabelText = this.getCenterLabelText();
        donutChartTitle.text('');
        if (centerLabelText.bigText && !centerLabelText.smText) {
            donutChartTitle.text(centerLabelText.bigText);
        }
        else {
            donutChartTitle.insert('tspan', null).text(centerLabelText.bigText)
                .classed('donut-title-big-pf', true).attr('dy', 0).attr('x', 0);
            donutChartTitle.insert('tspan', null).text(centerLabelText.smText).
                classed('donut-title-small-pf', true).attr('dy', 20).attr('x', 0);
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], DonutComponent.prototype, "chartData", void 0);
    __decorate([
        Input(),
        __metadata("design:type", DonutConfig)
    ], DonutComponent.prototype, "config", void 0);
    DonutComponent = __decorate([
        Component({
            encapsulation: ViewEncapsulation.None,
            selector: 'pfng-chart-donut',
            template: "<div #chartElement id=\"{{config.chartId}}\"></div>"
        }),
        __metadata("design:paramtypes", [ChartDefaults, WindowReference])
    ], DonutComponent);
    return DonutComponent;
}(ChartBase));
export { DonutComponent };
//# sourceMappingURL=donut.component.js.map