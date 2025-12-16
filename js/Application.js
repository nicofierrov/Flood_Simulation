/*
 Copyright 2022 Esri

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import AppBase from "./support/AppBase.js";
import AppLoader from "./loaders/AppLoader.js";
import SignIn from './apl/SignIn.js';
import ViewLoading from './apl/ViewLoading.js';
import MapScale from './apl/MapScale.js';

class Application extends AppBase {

  // PORTAL //
  portal;

  constructor() {
    super();

    // LOAD APPLICATION BASE //
    super.load().then(() => {

      // APPLICATION LOADER //
      const applicationLoader = new AppLoader({app: this});
      applicationLoader.load().then(({portal, group, map, view}) => {
        //console.info(portal, group, map, view);

        // PORTAL //
        this.portal = portal;

        // SET APPLICATION DETAILS //
        this.setApplicationDetails({map, group});

        // STARTUP DIALOG //
        this.initializeStartupDialog();

        // VIEW SHAREABLE URL PARAMETERS //
        this.initializeViewShareable({view});

        // USER SIGN-IN //
        this.configUserSignIn();

        // APPLICATION //
        this.applicationReady({portal, group, map, view}).catch(this.displayError).then(() => {

          // HIDE APP LOADER //
          document.getElementById('app-loader').toggleAttribute('hidden', true);
        });

      }).catch(this.displayError);
    }).catch(this.displayError);

  }

  /**
   *
   */
  configUserSignIn() {

    const signInContainer = document.getElementById('sign-in-container');
    if (signInContainer) {
      const signIn = new SignIn({container: signInContainer, portal: this.portal});
    }

  }

  /**
   *
   * @param view
   */
  configView({view}) {
    return new Promise((resolve, reject) => {
      if (view) {
        require([
          'esri/core/reactiveUtils',
          'esri/widgets/Expand',
          'esri/widgets/Popup',
          'esri/widgets/Home',
          'esri/widgets/Search',
          'esri/widgets/Compass',
          'esri/widgets/Legend',
          'esri/widgets/LayerList',
          'esri/widgets/Bookmarks'
        ], (reactiveUtils, Expand, Popup, Home, Search, Compass, Legend, LayerList, Bookmarks) => {

          // VIEW AND POPUP //
          view.set({
            constraints: {snapToZoom: false},
            //scale: 2500,
            popup: new Popup({
              dockEnabled: true,
              dockOptions: {
                buttonEnabled: false,
                breakpoint: false,
                position: "top-right"
              }
            })
          });

          // HOME //
          const home = new Home({view});
          view.ui.add(home, {position: 'top-left', index: 0});

          // COMPASS //
          const compass = new Compass({view: view});
          view.ui.add(compass, {position: 'top-left', index: 2});
          reactiveUtils.watch(() => view.rotation, rotation => {
            compass.set({visible: (rotation > 0)});
          }, {initial: true});

          // MAP SCALE //
          const mapScale = new MapScale({view});
          view.ui.add(mapScale, {position: 'bottom-left', index: 0});

          // VIEW LOADING INDICATOR //
          const viewLoading = new ViewLoading({view: view});
          view.ui.add(viewLoading, 'bottom-left');

          // LAYER LIST //
          const layerList = new LayerList({
            container: 'layers-container',
            view: view,
            visibleElements: {
              errors: true,
              statusIndicators: true
            }
          });

          // LEGEND //
          const legend = new Legend({
            container: 'legend-container',
            view: view
          });

          // BOOKMARKS //
          const bookmarksExpand = new Expand({
            content: new Bookmarks({view: view}),
            autoCollapse: true,
            placement: 'bottom-end'
          });
          view.ui.add(bookmarksExpand, 'top-right');

          resolve();
        });
      } else { resolve(); }
    });
  }

  /**
   *
   * @param portal
   * @param group
   * @param map
   * @param view
   * @returns {Promise}
   */
  applicationReady({portal, group, map, view}) {
    return new Promise(async (resolve, reject) => {
      // VIEW READY //
      this.configView({view}).then(() => {

        this.initializeFloodSimulationLayers({view}).then(({analysisLayers, dates}) => {
          this.initializeTimeSlider({view, dates});
          this.initializeSwipe({view, analysisLayers});
          this.initializeDepthChart({view, dates});
          this.initializeLocationComparison({view, analysisLayers});
          resolve();
        });

      }).catch(reject);
    });
  }

  /**
   *
   * @param {SceneView} view
   * @return {Promise<{analysisLayers,dates}>}
   */
  initializeFloodSimulationLayers({view}) {
    return new Promise((resolve, reject) => {

      const expectedLayer = view.map.layers.find(layer => layer.title === 'Expected');
      const mitigationLayer = view.map.layers.find(layer => layer.title === 'Mitigation');

      Promise.all([
        expectedLayer.loadAll(),
        mitigationLayer.loadAll()
      ]).then(() => {

        const flowLayerExpected = expectedLayer.layers.find(l => l.title.endsWith('Flow'));
        const depthLayerExpected = expectedLayer.layers.find(l => l.title.endsWith('Depth'));
        const flowLayerMitigation = mitigationLayer.layers.find(l => l.title.endsWith('Flow'));
        const depthLayerMitigation = mitigationLayer.layers.find(l => l.title.endsWith('Depth'));

        const analysisLayers = {expectedLayer, mitigationLayer, flowLayerExpected, depthLayerExpected, flowLayerMitigation, depthLayerMitigation};

        const {serviceRasterInfo, type} = depthLayerExpected;
        this.dates = serviceRasterInfo.multidimensionalInfo.variables.at(0).dimensions.at(0).values.map(val => new Date(val));

        this.imageryLayerType = type;

        resolve({analysisLayers, dates: this.dates});
      });

    });
  }

  /**
   *
   * @param view
   * @param dates
   * @return {Promise<>}
   */
  initializeTimeSlider({view, dates}) {
    return new Promise((resolve, reject) => {
      require([
        'esri/core/reactiveUtils',
        'esri/support/timeUtils',
        'esri/widgets/TimeSlider'
      ], (reactiveUtils, timeUtils, TimeSlider) => {

        const timeFormatter = new Intl.DateTimeFormat('default', {hour: 'numeric', minute: '2-digit'});
        const minuteFormatter = new Intl.DateTimeFormat('default', {hour: 'numeric', minute: 'numeric'});

        const initialDate = dates.at(-1);

        const timeSlider = new TimeSlider({
          container: 'time-slider-container',
          view,
          mode: 'instant',
          loop: true,
          timeVisible: true,
          fullTimeExtent: {start: dates.at(0), end: dates.at(-1)},
          timeExtent: {start: initialDate, end: initialDate},
          stops: {
            interval: {
              value: 1,
              unit: 'minutes'
            }
          },
          /*tickConfigs: [
           {
           mode: 'position',
           values: dates.map(date => date.valueOf()),
           labelsVisible: true,
           labelFormatFunction: (value, type, index) => {
           switch (type) {
           case 'tick':
           return minuteFormatter.format(value).replace(/AM|PM/g, '').trim();
           }
           }
           }
           ],*/
          labelFormatFunction: (value, type, element) => {
            switch (type) {
              case "min":
              case "max":
                element.innerText = timeFormatter.format(value);
                break;
            }
          }
        });

        resolve();
      });
    });

  }

  /**
   *
   * @param view
   * @param dates
   */
  initializeDepthChart({view, dates}) {

    const minuteFormatter = new Intl.DateTimeFormat('default', {hour: 'numeric', minute: 'numeric'});
    const dateLabels = dates.map(date => minuteFormatter.format(date).replace(/AM|PM/g, '').trim());

    Chart.defaults.font.family = "'Avenir Next', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
    Chart.defaults.color = '#fefefe';

    const chartContainer = document.getElementById('chart-container');
    const depthChart = new Chart(chartContainer, {
      type: 'line',
      data: {
        labels: dateLabels,
        datasets: [
          {
            label: 'Expected',
            parsing: {xAxisKey: 'time', yAxisKey: 'depth'},
            borderColor: 'rgba(54,162,235,0.8)',
            pointBorderColor: '#efefef',
            pointBackgroundColor: 'transparent',
            pointRadius: 3.0,
            pointHoverRadius: 7.5,
            pointBorderWidth: 1.5,
            pointHoverBackgroundColor: 'rgba(54,162,235,0.8)',
            data: []
          },
          {
            label: 'Mitigated',
            parsing: {xAxisKey: 'time', yAxisKey: 'depth'},
            borderColor: 'rgba(254,88,62,0.8)',
            pointBorderColor: '#efefef',
            pointBackgroundColor: 'transparent',
            pointRadius: 3.0,
            pointHoverRadius: 7.5,
            pointBorderWidth: 1.5,
            pointHoverBackgroundColor: 'rgba(254,88,62,0.8)',
            data: []
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {padding: 20},
        interaction: {
          mode: 'index'
        },
        plugins: {
          title: {
            display: true,
            text: 'Compare Flood Depths by Scenario',
            font: {size: 13}
          },
          tooltip: {
            displayColors: false,
            caretPadding: 8,
            titleFont: {size: 17},
            bodyFont: {size: 13},
            mode: 'nearest',
            axis: 'x',
            intersect: false,
            position: 'nearest',
            backgroundColor: '#353535',
            borderColor: '#efefef',
            borderWidth: 1,
            callbacks: {
              title: (items) => {
                //console.info(items);
                const diff = (items.at(1).parsed.y - items.at(0).parsed.y);
                const type = (diff < 0) ? 'LESS' : ((diff > 0) ? 'MORE' : '');
                return [
                  type ? `CHANGE: ${ Math.abs(diff).toFixed(3) } ${ this.depthUnit.label.toUpperCase() } ${ type } WATER` : 'NO CHANGE'
                ];
              },
              label: (context) => {
                const data = context.dataset.data[context.dataIndex];
                const label = context.dataset.label;
                return `${ label } Depth: ${ data.depth.toFixed(3) } ${ this.depthUnit.label }`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time of Day'
            },
            grid: {
              display: false
            }
          },
          y: {
            title: {
              display: true,
              text: `Water Depth ( ${ this.depthUnit.name } )`
            },
            grid: {
              color: '#666666'
            },
            ticks: {
              callback: (value, index, ticks) => {
                return `${ value.toFixed(3) } ${ this.depthUnit.label }`;
              }
            }
          }
        }
      }
    });

    this.clearChart = () => {
      depthChart.data.datasets.at(0).data = [];
      depthChart.data.datasets.at(1).data = [];
      depthChart.update();
    };

    this.updateChartByValues = ({expectedValues, mitigationValues}) => {
      depthChart.data.datasets.at(0).data = dataValuesToChartData(expectedValues);
      depthChart.data.datasets.at(1).data = dataValuesToChartData(mitigationValues);
      depthChart.update();
    };

    const dataValuesToChartData = (dataValues) => {
      return dataValues.map((value, valueIdx) => {
        return {
          time: minuteFormatter.format(this.dates.at(valueIdx)).replace(/AM|PM/g, '').trim(),
          depth: value
        };
      });
    };

    this.updateChartBySeries = ({dataSeriesExpected, dataSeriesMitigation}) => {
      depthChart.data.datasets.at(0).data = dataSeriesToChartData(dataSeriesExpected);
      depthChart.data.datasets.at(1).data = dataSeriesToChartData(dataSeriesMitigation);
      depthChart.update();
    };

    const dataSeriesToChartData = (dataSeries) => {
      return dataSeries.map(({multidimensionalDefinition, value}) => {
        return {
          time: minuteFormatter.format(new Date(multidimensionalDefinition.at(0).values.at(0))).replace(/AM|PM/g, '').trim(),
          depth: value.at(0)
        };
      });
    };

  }

  /**
   *
   * @param view
   * @param analysisLayers
   */
  initializeLocationComparison({view, analysisLayers}) {
    require([
      'esri/core/promiseUtils',
      'esri/core/reactiveUtils',
      'esri/Graphic',
      'esri/layers/GraphicsLayer',
      'esri/symbols/WebStyleSymbol',
      'esri/symbols/support/cimSymbolUtils'
    ], (promiseUtils, reactiveUtils, Graphic, GraphicsLayer, WebStyleSymbol, cimSymbolUtils) => {

      const locationWebSymbol = new WebStyleSymbol({
        name: "esri-pin-2",
        styleName: "Esri2DPointSymbolsStyle"
      });
      locationWebSymbol.fetchCIMSymbol().then((locationSymbol) => {
        cimSymbolUtils.scaleCIMSymbolTo(locationSymbol, 32);
        cimSymbolUtils.applyCIMSymbolColor(locationSymbol, '#36A2EB');

        const locationGraphic = new Graphic({symbol: locationSymbol});

        const locationLayer = new GraphicsLayer({
          title: 'Comparison Location',
          effect: 'drop-shadow(3px, 2px, 2px, #424242)',
          graphics: [locationGraphic]
        });
        view.map.add(locationLayer);

        const {depthLayerExpected, depthLayerMitigation} = analysisLayers;

        let isActive = false;
        const locationBtn = document.getElementById('location-btn');
        locationBtn.addEventListener('click', () => {
          isActive = locationBtn.toggleAttribute('active');
          locationBtn.setAttribute('appearance', isActive ? 'solid' : 'outline-fill');
          view.container.style.cursor = isActive ? 'crosshair' : 'default';

          !isActive && this.clearChart();
          !isActive && (locationGraphic.geometry = null);
        });

        reactiveUtils.on(() => view, 'immediate-click', (clickEvt) => {
          if (isActive) {

            // const {mapPoint} = clickEvt;
            const mapPoint = view.toMap(clickEvt);

            locationGraphic.geometry = mapPoint;

            if (this.imageryLayerType === 'imagery') {
              getFloodDepthsByValues({location: mapPoint}).then(({expectedValues, mitigationValues}) => {
                this.updateChartByValues({expectedValues, mitigationValues});
              }).catch(handleAbortError);
            } else {
              getFloodDepthsBySeries({location: mapPoint}).then(({dataSeriesExpected, dataSeriesMitigation}) => {
                this.updateChartBySeries({dataSeriesExpected, dataSeriesMitigation});
              }).catch(handleAbortError);
            }

          }
        });

        const handleAbortError = error => !promiseUtils.isAbortError(error) && console.error(error);

        const slices = this.dates.map(d => d.valueOf());

        /**
         *
         */
        const getFloodDepthsByValues = promiseUtils.debounce(({location}) => {

          const identifyParameters = {
            geometry: location,
            mosaicRule: {
              multidimensionalDefinition: [
                {
                  variableName: this.depthVariableName,
                  dimensionName: this.timeDimensionName,
                  values: [slices],
                  isSlice: true
                }
              ]
            },
            processAsMultidimensional: true
          };

          return Promise.all([
            depthLayerExpected.identify(identifyParameters),
            depthLayerMitigation.identify(identifyParameters)
          ]).then(([expectedResults, mitigationResults]) => {
            const expectedValues = expectedResults.value.split(';').map(Number);
            const mitigationValues = mitigationResults.value.split(';').map(Number);
            return {expectedValues, mitigationValues};
          });
        });

        /**
         *
         */
        const getFloodDepthsBySeries = promiseUtils.debounce(({location}) => {
          return Promise.all([
            depthLayerExpected.identify(location, {transposedVariableName: this.depthVariableName}),
            depthLayerMitigation.identify(location, {transposedVariableName: this.depthVariableName})
          ]).then(([{dataSeries: dataSeriesExpected}, {dataSeries: dataSeriesMitigation}]) => {
            return {dataSeriesExpected, dataSeriesMitigation};
          });
        });

      });
    });
  }

  /**
   *
   * @param view
   * @param analysisLayers
   */
  async initializeSwipe({view, analysisLayers}) {

    const {expectedLayer, mitigationLayer} = analysisLayers;

    const Swipe = await $arcgis.import('esri/widgets/Swipe');

    const swipe = new Swipe({
      view: view,
      leadingLayers: [expectedLayer],
      trailingLayers: [mitigationLayer],
      direction: "horizontal",
      position: 85
    });
    view.ui.add(swipe);

    const reactiveUtils = await $arcgis.import('esri/core/reactiveUtils');
    reactiveUtils.whenOnce(() => swipe.viewModel.state === "ready").then(() => {
      setTimeout(() => {

        // GET SWIPE CONTAINER //
        const swipeContainer = document.querySelector(".esri-swipe__container");

        // ADD SWIPE LABEL CONTAINER //
        const swipeLabelContainer = document.createElement("div");
        swipeLabelContainer.classList.add('swipe-label-container');
        swipeContainer.after(swipeLabelContainer);

        // LEADING LABEL //
        const swipeLabelLeading = document.createElement("div");
        swipeLabelLeading.classList.add('swipe-label', 'swipe-label-leading');
        swipeLabelLeading.innerHTML = 'Expected Flow';

        // TRAILING LABELS //
        const swipeLabelTrailing = document.createElement("div");
        swipeLabelTrailing.classList.add('swipe-label', 'swipe-label-trailing');
        swipeLabelTrailing.innerHTML = "Mitigated Flow";

        swipeLabelContainer.append(swipeLabelLeading, swipeLabelTrailing);

        // UPDATE POSITION //
        reactiveUtils.watch(() => swipe.position, position => {
          swipeLabelContainer.style.left = `${ position }%`;
        }, {initial: true});

        //
        // AUTO SWIPE
        //
        let autoSwipe = false;
        let direction = 1;
        const swipeRange = {min: 25, max: 75};

        const _swipeIt = () => {
          direction = (swipe.position > swipeRange.max) ? -1 : ((swipe.position < swipeRange.min) ? 1 : direction);
          swipe.position += (0.1 * direction);
          autoSwipe && requestAnimationFrame(_swipeIt);
        };

        const autoSwipeBtn = document.getElementById("auto-swipe-action");
        autoSwipeBtn.addEventListener("click", () => {
          autoSwipe = autoSwipeBtn.toggleAttribute('active');
          autoSwipeBtn.toggleAttribute('indicator', autoSwipe);
          autoSwipeBtn.setAttribute('icon', autoSwipe ? 'pause-f' : 'play-f');
          autoSwipe && requestAnimationFrame(_swipeIt);
        });

      }, 2000);
    });

  }

}

export default new Application();
