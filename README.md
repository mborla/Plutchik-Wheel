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

