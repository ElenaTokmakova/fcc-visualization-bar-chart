
    
    var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";

    d3.json(url, function (json) {
    var dataset = json.data;
    
    const length = dataset.length;    
    const width = 1200;
    const height = 500;
    const padding = 50;
    const barWidth = ((width - padding)/length);
    const formatUSD = d3.format("$,.2f");
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
   
    dataset.forEach(function(dataPoint, index) {
      //console.log(dataPoint);      
    });

    d3.select(".description")
      .append("text")
      .text(json.description);


    var tooltip = d3.select(".content-container").append("h3")
      .attr("class", "tooltip")
      .style("opacity", 0);   

    //SCALES WITH DOMAINS AND RANGES

    const xScale = d3.scaleTime()
                     .domain([new Date(dataset[0][0]), new Date(dataset[length-1][0])])                                           
                     .range([padding, width - padding]);  
    
    //console.log("xScale: domain start:", new Date(dataset[0][0]), "\ndomain end:", new Date(dataset[length-1][0]));
    //console.log("xScale: range start:", padding, "range end:", width - padding);                                   
    
    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(dataset, (d) => d[1])])                     
                     .range([height - padding, padding]);

    //console.log("yScale: domain start:", d3.min(dataset, (d) => d[1]), "domain end:", d3.max(dataset, (d) => d[1]));
    //console.log("yScale: range start:", height - padding, "range end:", padding);                  

    //console.log("First element height", dataset[0][1], "height range", yScale(dataset[0][1]).toFixed(2), "x range", xScale(new Date(dataset[0][0])));
    //console.log("150th element height", dataset[149][1], "height range", yScale(dataset[149][1]).toFixed(2), "x range", xScale(new Date(dataset[149][0])).toFixed(2));
    //console.log("Last element height", dataset[length-1][1], "height range", yScale(dataset[length - 1][1]).toFixed(2), "x range", xScale(new Date(dataset[length-1][0])));                 
    
    //CHART WITH BARS

    const chart = d3.select(".content-container")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height)
                  .attr("class", "chart"); 

    chart.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")  
      .attr("x", (d) => xScale(new Date(d[0])))    
      .attr("width", barWidth) 
      //each bar goes from top to bottom
      //the bar starts at its own height (transformed, on range scale)      
      //the bar ends at svg max height minus padding, end point can be calculated this way: 
      //absolute height - bar height (transformed, on range scale) - padding
      //(!) do not forget to subtract padding, it is not part of bar height
      .attr("y", (d) => yScale(d[1]))    
      .attr("height", (d) => height - yScale(d[1]) - padding)
      .attr("fill", "navy") 
      
      //ON HOVER FUNCTIONS

      .on("mouseover", function(d){      
         d3.select(this).attr("fill", "red");  
         //console.log("Hello there", this);
         var rect = d3.select(this);
         rect.attr("class", "mouseover");
         var currentDateTime = new Date(d[0]);
         var year = currentDateTime.getFullYear();
         var month = currentDateTime.getMonth();
         var dollars = d[1];
         //console.log(year, month, dollars);
         tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
         tooltip.html("<span class='amount'>" + formatUSD(dollars) + "&nbsp;Billion </span><br><span class='year'>" + year + ' - ' + months[month] + "</span>")
          .style("left", (d3.event.pageX + 5) + "px")
          .style("top", (d3.event.pageY - 50) + "px");
      })

      .on("mouseout", function(d){      
         d3.select(this).attr("fill", "navy");  
         //console.log("Bye there", this);
         var rect = d3.select(this);
         tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      })      


    //AXES  

    const xAxis = d3.axisBottom(xScale);  

    chart.append("g")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .call(xAxis);  
    
    const yAxis = d3.axisLeft(yScale);
    
    chart.append("g")
      .attr("transform", "translate(" + padding + ", 0)")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", - padding)
      .attr("y", 25)        
      .style("fill", "#000")
      .style("font-size", "15px")
      .style("font-weight", "bold")     
      .text("Gross Domestic Product, USA");   

}); //end d3.json()
 
