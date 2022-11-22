# Plutchik-Wheel
Wind-Rose diagram implementation of Plutchik's wheel of emotions using D3.js.

## Usage
Run in local.

Add d3.js script (version 4):

```HTML
<script src="https://d3js.org/d3.v4.min.js"></script>
```

```HTML
<body>    
    <link href="./css/plutchik.css" type="text/css" rel="stylesheet"/>
    <div id="chart"></div>
    <script src="./js/plutchik.js"></script>
    <script>
        plutchik("#chart", "./dataset/dataset.json");
    </script>
</body>
```

## Chart
![alt text](https://github.com/mborla/Plutchik-Wheel/blob/ab577b0b1cb91a5d4d3db4973cc5b2038772c0f9/images/viz.PNG)

![alt text](https://github.com/mborla/Plutchik-Wheel/blob/ab577b0b1cb91a5d4d3db4973cc5b2038772c0f9/images/viz-hover.PNG)
