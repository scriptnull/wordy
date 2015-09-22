# wordy
Text prediction engine on angular.js 

# Demos

### Client side predictions
![](https://raw.githubusercontent.com/scriptnull/wordy/master/demos/basic.gif)

### n - number of predictions
![](https://raw.githubusercontent.com/scriptnull/wordy/master/demos/n-predictions.gif)

### Autocomplete in between words
Press a spacebar after a word to get autocompletions for it.
![](https://github.com/scriptnull/wordy/blob/master/demos/auto-complete-in-between.gif)

### Server side predictions
![](https://github.com/scriptnull/wordy/blob/master/demos/tokens-from-server.gif)

# Try it out
Clone the repo
```bash
git clone https://github.com/scriptnull/wordy.git
```

Install a web server. I am using [node.js](https://nodejs.org/en/) , you can use any.
```bash
npm install -g http-server
cd path\to\wordy
http-server
```

In order to use server side text prediction , you have to first download and run the [scriptnull/wordy-backend](https://github.com/scriptnull/wordy-backend) project. Please refer to instructions about it on the project page.
