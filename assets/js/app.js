angular.module('racerApp', [])
  .filter('duration', function() {
		    //Returns duration from milliseconds in hh:mm:ss format.
		      return function(millseconds) {
		        var seconds = Math.floor(millseconds / 1000);
		        var h = 3600;
		        var m = 60;
		        var hours = Math.floor(seconds/h);
		        var minutes = Math.floor( (seconds % h)/m );
		        var scnds = Math.floor( (seconds % m) );
		        var timeString = '';
		        if(scnds < 10) scnds = "0"+scnds;
		        if(hours < 10) hours = "0"+hours;
		        if(minutes < 10) minutes = "0"+minutes;
		        timeString = hours +":"+ minutes +":"+scnds;
		        return timeString;
		    }
		    
  })
  .filter('durationDate', function() {
		    return function(millseconds) {
		    	return new Date(millseconds);
		    }
  })
  .controller('RacerListController', ['$scope', '$timeout',
      function($scope, $timeout) {
		    var racerList = this;
		    racerList.counter = 0;
		    racerList.currentDateTime = '';
		    racerList.startDateTime = '';
		    racerList.timeInMs = 0;
		    racerList.timer = '';
		    racerList.racers = [];
		    racerList.firstRunner = {};
		    racerList.fastRunner = {};
		    racerList.raceEnd = false;
		   

		    racerList.calculate = function(name, totalTimeTaken){
		    	var lapCount = 0;
		    	var totalTime = 0;
		    	var lastTime = 0;
		    	var totalLaps = 0;
		    	var timeTaken = 0;

		    	angular.forEach(racerList.racers, function(racer) {
		        	if(racer.name == name) {
		        		totalLaps = racer.lapEndTimes.length;
		        		racer.lapCount += 1;
		        		if( totalLaps == 0 ) {
		        			timeTaken = totalTimeTaken;
		        			racer.fastestLapTime = timeTaken;
		        			racer.fastestLap = racer.lapCount;
		        		} else {
		        			timeTaken = totalTimeTaken - racer.lapEndTimes[totalLaps - 1];
		        			//console.log("Total laps =" + totalLaps);
		        			//console.log("Total time taken  = " + totalTimeTaken);
		        			//console.log("Last time taken = " + racer.lapEndTimes[totalLaps - 1])
		        			if (racer.fastestLapTime > timeTaken ) {
		        				racer.fastestLapTime = timeTaken;
		        				racer.fastestLap = racer.lapCount;
		        			}
		        		}

		        		racer.lapEndTimes.push(totalTimeTaken);
		        		racer.lastLapTime = timeTaken;


		        
		        		
		        		racer.averageTime = totalTimeTaken/racer.lapCount;
		        		racer.totalTime = totalTimeTaken;


		        	}

		      	});

		      	//console.log(racerList.racers);
		      	
		    }
		 
		    racerList.addRacer = function() {
		    	// check
		      racerList.racers.push({name:racerList.racerName, lapCount: 0, totalTime: '0', averageTime: '0', lastLapTime: '0', lapEndTimes: [], fastestLap: 0, fastestLapTime: 0});
		      racerList.racerName = '';
		    };

		    racerList.startRace = function() {
		    	racerList.startDateTime = new Date();
		    	racerList.countUp();
		    };

		    racerList.endRace = function() {
		    	racerList.raceEnd = true;
		    	racerList.endDateTime = new Date();
		    	
		    	$timeout.cancel(racerList.timer);
		    	

		    	var maxLap = racerList.racers.reduce(function (prev, current) {
				  	return (prev.lapCount > current.lapCount ) ? prev : current
				});

				var filterData = racerList.findObjectByKey(racerList.racers, 'lapCount', maxLap.lapCount);

		    	// Find overall first runner
		    	// *** I am not happy with this code but for quick fixing ---
		    	racerList.findFirstRunner(filterData);


				//Find Quickest lap runner
				racerList.findFastRunner(filterData);
				
				//console.log(racerList.fastRunner);

		    };

		    racerList.findFirstRunner = function(filterData) {
		    	
				//console.log(filterData);

				racerList.firstRunner = filterData.reduce(function (prev, current) {
				  	return (prev.totalTime < current.totalTime ) ? prev : current
				});
		    }

		    racerList.findFastRunner = function(filterData) {
		    	racerList.fastRunner = filterData.reduce(function (prev, current) {
				  	return (prev.fastestLapTime < current.fastestLapTime ) ? prev : current
				});
		    }


		    racerList.findObjectByKey = function(array, key, value) {
		    	var result = [];
			    for (var i = 0; i < array.length; i++) {
			        if (array[i][key] === value) {
			            result.push(array[i]);
			        }
			    }
			    return result;
			}


		    racerList.getTime = function() {
		    	var diffTime = '';
		    	if (racerList.startDateTime > 0 ) {
		    		racerList.currentDateTime = new Date();
		    		var diffTime = racerList.currentDateTime - racerList.startDateTime;
		    	} 
		    	
		    	return diffTime;
		    }

		    racerList.countUp = function() {
		        racerList.timeInMs+= 500;
		        racerList.timer = $timeout(racerList.countUp, 500);
		    }
		    
  }]);



