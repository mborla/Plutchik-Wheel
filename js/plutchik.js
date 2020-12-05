function plutchik(id, json){

     var width = d3.select(id).style("width").slice(0, -2);
     var height = d3.select(id).style("height").slice(0, -2);

     var margin = {top: 30, right: 30, bottom: 30, left: 30};

     var emotions = [["ecstasy", "admiration", "terror", "amazement", "grief", "loathing", "rage", "vigilance"], 
                    ["joy", "trust", "fear", "surprise", "sadness", "disgust", "anger", "anticipation"], 
                    ["serenity", "acceptance", "apprehension", "distraction", "pensiveness", "boredom", "annoyance", "interest"]];

     var innerRadius = 0;
     var outerRadius = (Math.min(width, height)/2)- margin.top - margin.bottom;

     var svg = d3.select(id)
                 .append("svg")
                 .attr("width", width)
                 .attr("height", height);

     var g = svg.append("g").attr("transform", "translate(" + width/2 + "," + height/2 + ")");

     var angle = d3.scaleLinear()
                   .range([0, 2 * Math.PI]);

     var radius = d3.scaleLinear()
                    .range([innerRadius, outerRadius]);

     var x = d3.scaleBand()
               .range([0, 2 * Math.PI])
               .align(0);

     var y = d3.scaleLinear()
               .range([innerRadius, outerRadius]);


     d3.json(json, function(data) {

          var key = ["degree_0", "degree_1", "degree_2"];
          var z = [["#cda000", "#60cd00", "#00cd3a", "#00c5cd", "#002ccd", "#6d00cd", "#cd0600", "#cd6d00"], ["#ffcd1a", "#85ff1a", "#1aff5b", "#1af7ff", "#1a4bff", "#941aff", "#ff211a", "#ff941a"], ["#ffde66", "#adff66", "#66ff91", "#66faff", "#6687ff", "#b866ff", "#ff6b66", "#ffaa66"]]

          x.domain(data.map(function(d) { return d.emotion; }));
          y.domain([0, 1]);

          angle.domain([0, d3.max(data, function(d,i) { return i + 1; })]);
          radius.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);
          radius.domain([0, d3.max(data, function(d) { return d.y; })]);
          angleOffset = -360.0/data.length/2.0;     


          g.selectAll(".axis")
           .data(d3.range(angle.domain()[1]))
           .enter().append("g")
           .attr("class", "axis")
           .attr("transform", function(d) { return "rotate(" + angle(d) * 180 / Math.PI + ")"; })
           .call(d3.axisLeft().scale(radius.copy().range([-innerRadius, -(outerRadius+10)])));

          var yAxis = g.append("g")
                       .attr("text-anchor", "middle");

          var yTick = yAxis.selectAll("g")
                           .data(y.ticks(5).slice(1))
                           .enter().append("g");

          yTick.append("circle")
               .attr("fill", "none")
               .attr("stroke", "lightgray")
               .attr("r", y);

          yTick.append("text")
               .attr("y", function(d) { return -y(d); })
               .attr("dy", "-0.35em")
               .attr("x", function() { return -15; })
               .text(y.tickFormat(5, "s"))
               .style("font-size", 14);

          
          g.append("clipPath") 
          .attr("id", "petal-clip")
          .selectAll("path")
          .data(data).enter()
          .append("path")
          .attr("id", function(d){
          return d.emotion;
          })
          //.attr("d", "M 0,0 C -10,-10 -10,-40 0,-50 C 10,-40 10,-10 0, 0")
          .attr("d", "M 0,0 C -5,-10 -10,-40 0,-50 C 10,-40 5,-10 0, 0")
          //.attr("d", "M 0,0 C -5,-10 -15,-40 0,-50 C 15,-40 5,-10 0, 0")
          .attr("transform", function(d,i) { return "rotate(" + ((x(d.emotion)) * 180 / Math.PI) + ") translate(0,-0) scale("+((y(d.total)-0)/50)+")"}) 
          
          g.append("g")
          .selectAll("g")
          .data(function(){
          return d3.stack().keys(key)(data);
          })
          .enter().append("g")
          .style("opacity", 0.85)
          .attr("value", function(d,i){
          return d.index;
          })  
          .attr("clip-path", "url(#petal-clip)")
          .selectAll("path")
          .data(function(d) { return d; })
          .enter().append("path")
          .attr("class", "arc")
          .attr("d", d3.arc()
          .innerRadius(function(d) { return y(d[0]); })
          .outerRadius(function(d) { return y(d[1]); })
          .startAngle(function(d) { return x(d.data.emotion); })
          .endAngle(function(d) { return x(d.data.emotion) + x.bandwidth(); })
          .padAngle(0.01)
          .padRadius(innerRadius))
          .attr("fill", function(d,i) { var degree = d3.select(this.parentNode).attr("value"); return z[degree][i]; })
          .attr("transform", function() {return "rotate("+ angleOffset + ")"}) 
          .attr("value", function(d,i){
          var degree = d3.select(this.parentNode).attr("value");
          return emotions[degree][i];
          })      


          var label = g.append("g")
                       .selectAll("g")
                       .data(data)
                       .enter().append("g")
                       .attr("text-anchor", "middle")
                       .attr("transform", function(d) { return "rotate(" + ((x(d.emotion) + x.bandwidth() / 2) * 180 / Math.PI - (90-angleOffset)) + ")translate(" + (outerRadius+30) + ",0)"; });

          label.append("text")
               .attr("transform", function(d) { return (x(d.emotion) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,-3)" : "rotate(-90)translate(0,10)"; })
               .attr("id", function(d) { return "text_" + d.emotion; })
               .attr("class", "principal")
               .text(function(d) { return d.emotion; })
               .style("font-size",14);

          label.append("text")
               .attr("transform", function(d) { return (x(d.emotion) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,-3)" : "rotate(-90)translate(0,10)"; })
               .attr("id", function(d,i) { return "text_" + emotions[0][i]; })
               .text(function(d,i) { return emotions[0][i]; })
               .style("font-size", 14)
               .style("visibility", "hidden");

          label.append("text")
               .attr("transform", function(d) { return (x(d.emotion) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,-3)" : "rotate(-90)translate(0,10)"; })
               .attr("id", function(d,i) { return "text_" + emotions[2][i]; })
               .text(function(d,i) { return emotions[2][i]; })
               .style("font-size", 14)
               .style("visibility", "hidden");

          label.append("text")
               .attr("id", function(d) { return "text_value_principal_" + d.emotion; })
               .attr("class", "principal_value")
               .attr("transform", function(d) { return (x(d.emotion) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,13)" : "rotate(-90)translate(0,-6)"; })
               .text(function(d) { return d.total; })
               .style("font-size", 14)
               .style("fill", function(d,i){
                    return z[1][i];
               })
               .style("font-weight", "bold");

          label.append("text")
               .attr("id", function(d,i){ return "text_value_" + emotions[0][i]; })
               .attr("transform", function(d) { return (x(d.emotion) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,13)" : "rotate(-90)translate(0,-6)"; })
               .text(function(d) { return d.degree_0; })
               .style("font-size", 14)
               .style("fill", function(d,i){
                    return z[1][i];
               })
               .style("font-weight", "bold")
               .style("visibility", "hidden");

          label.append("text")
               .attr("id", function(d,i){ return "text_value_" + emotions[1][i]; })
               .attr("transform", function(d) { return (x(d.emotion) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,13)" : "rotate(-90)translate(0,-6)"; })
               .text(function(d) { return d.degree_1; })
               .style("font-size", 14)
               .style("fill", function(d,i){
                    return z[1][i];
               })
               .style("font-weight", "bold")
               .style("visibility", "hidden");

          label.append("text")
               .attr("id", function(d,i){ return "text_value_" + emotions[2][i]; })
               .attr("transform", function(d) { return (x(d.emotion) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,13)" : "rotate(-90)translate(0,-6)"; })
               .text(function(d) { return d.degree_2; })
               .style("font-size", 14)
               .style("fill", function(d,i){
                    return z[1][i];
               })
               .style("font-weight", "bold")
               .style("visibility", "hidden");


          d3.selectAll(".arc")
            .on("mouseover", function(){
               var name = d3.select(this).attr("value");
               var principal;
               var index;
               var degree;

               for(var i = 0; i < emotions.length; i++){
                    if(emotions[i].indexOf(name) >= 0){
                         index = emotions[i].indexOf(name);
                         degree = i;
                    }          
               }
               principal = emotions[1][index]; 
               
               d3.selectAll("#text_"+principal).style("visibility", "hidden");
               d3.select("#text_"+name).style("visibility", "visible");

               d3.select("#text_value_principal_"+principal).style("visibility", "hidden");
               d3.select("#text_value_"+name).style("visibility", "visible");
               
          })
          .on("mouseout", function(){
               var name = d3.select(this).attr("value");
               d3.select("#text_"+name).style("visibility", "hidden");
               d3.selectAll(".principal").style("visibility", "visible");

               d3.select("#text_value_"+name).style("visibility", "hidden");
               d3.selectAll(".principal_value").style("visibility", "visible");     
          })
          
     });

}