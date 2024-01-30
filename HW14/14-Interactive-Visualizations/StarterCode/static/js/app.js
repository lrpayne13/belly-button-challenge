// // Function to initialize the dashboard
function init() {
    // Use D3 to select the dropdown menu
    var dropdown = d3.select("#selDataset");
  
    // Use D3 to read in the samples.json file
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
      // Populate the dropdown with subject IDs
      data.names.forEach((name) => {
        dropdown.append("option").text(name).property("value", name);
      });
  
      // Use the first sample from the list to build initial plots
      const firstSample = data.names[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    }).catch(error => console.log(error));
  }
  
  // Function to update the demographic information panel
  function buildMetadata(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
  
      // Use D3 to select the panel for sample metadata
      var PANEL = d3.select("#sample-metadata");
  
      // Clear any existing metadata
      PANEL.html("");
  
      // Append new tags for each key-value pair in the metadata
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
  }
  
  // Function to build the bar and bubble charts
  function buildCharts(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
  
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;
  
      // Build a Bar Chart
      var barData = [{
        y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      }];
  
      var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: { t: 30, l: 150 }
      };
  
      Plotly.newPlot("bar", barData, barLayout);
  
      // Build a Bubble Chart
      var bubbleData = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }];
  
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        margin: { t: 30}
      };
  
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
  }
  
  // Function to handle change event when a new sample is selected
  function optionChanged(newSample) {
    // Update the charts with the new sample
    buildCharts(newSample);
    // Update the metadata with the newly selected sample
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();
  