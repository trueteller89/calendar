'use strict';
var calendarApp = angular.module('calendarApp', ["firebase"]);
////////////////////////////////////////////////////////////////////////////////////////
calendarApp.controller('setCalendar', ['$scope', '$http', '$filter', '$rootScope', 
	function($scope,$http,$filter,$rootScope) {

   

      $scope.cellStyle= {};
      $scope.colorCell=[];
    $rootScope.selectedDay=$filter('date')(new Date());
    $scope.month="October";
	$scope.monthes=["January","February","March","April","May","June","July","August","September","October","November","December"];
	 $scope.day= function(id1,dataDay, events, marked){
    this.id1=id1;
this.dataDay=dataDay;
this.events=events;
this.marked=marked;

  };
  $rootScope.days=[];
  $scope.days=[];
   $scope.weekDay=['MON', 'TUE', 'WED','THU', 'FRI', 'SAT','SUN'];
  $scope.board = [
      $scope.weekDay,
      ['', '', '','', '', '',''],
      ['', '', '','', '', '',''],
      ['', '', '','', '', '',''],
      ['', '', '','', '', '',''],
      ['', '', '','', '', '',''],
      ['', '', '','', '', '','']
    ];
    $scope.newDay=function(weekDay,events){
      this.weekDay=weekDay;
      this.events=events;
    }
$scope.editDay=function(NumDay){
 $rootScope.selectedDay=$filter('date')($scope.days[NumDay].dataDay);
$rootScope.changeSelectedDay();
};
  $scope.today = function() {
    $scope.dt = new Date();
    return $scope.dt;
  };
  
  $scope.setDay = function(row,col) {
    var NumDay=1;
    var date=new Date();
  var k=0;

  while ($scope.month !=$scope.monthes[k]){k++;}
var firstDate=new Date(2015, k , 1);
$rootScope.currentMonth=k;
var firstWeekDay=$filter('date')(firstDate, "EEE").toUpperCase();
       var k1=0;
  while (firstWeekDay!=$scope.weekDay[k1]){k1++;}
  NumDay=(row-1)*7+col+1-k1;
  if (NumDay<1){NumDay="";}
  else if (NumDay>new Date(2015, k+1, 0).getDate()){NumDay="";}
   else { $scope.days[NumDay]=new $scope.day(NumDay, new Date(2015, k, NumDay), "", false);
$rootScope.days[NumDay]=new $scope.day(NumDay, new Date(2015, k, NumDay), "", false);
 }


    if (row===0){return $scope.weekDay[col];}
    else {  return NumDay;}
  };



  }]);
////////////////////////////////////////////////////////////////////////////////////////
calendarApp.controller('DayDetailCtrl', ['$scope', '$rootScope','$http','$filter',

    function($scope,$rootScope,$http,$filter) {
        $scope.event ={
title1:"",
time1:"",
priority1:""
        }; 

      $scope.setPriority = function(color){
        $scope.event.priority1=color;
              }
$scope.saveDayDetails=function(selectedDay, title1, time1, priority1){

this.selectedDay=$filter('date')($rootScope.selectedDay,"short");
console.log(this.selectedDay, title1, time1, priority1);
var str="{date:"+this.selectedDay+",events:[{title:"+ title1+", time: "+time1+", priority:"+priority1+"}]}";
$rootScope.myDataRef.child("menu").push({date:this.selectedDay,events:[{title: title1, time: time1, priority:priority1}]});

}

     
    }
]);

////////////////////////////////////////////////////////////////////////////////////////
calendarApp.controller("SampleCtrl", function($scope, $rootScope, $firebaseObject,$firebaseArray,$filter,$log) {
  $scope.$log = $log;
  $rootScope.datasDay=[];
  $rootScope.shedule={};
  $rootScope.shedule.menu=null;
    $scope.events=[];
   $rootScope.myDataRef = new Firebase('https://torrid-inferno-6481.firebaseio.com/');
$rootScope.changeSelectedDay=function(){
   $scope.events=[];
$scope.todayEvents();

}


  $rootScope.myDataRef.on('value', function (snapshot) {
    $rootScope.shedule=snapshot.val();
  
   $scope.events=[];
$scope.todayEvents();
  });

$scope.todayEvents=function(){
   var i=0;
  for (var key in $rootScope.shedule.menu){


if ($filter('date')($filter('date')($rootScope.selectedDay))==$rootScope.shedule.menu[key].date){
$scope.events[$scope.events.length]=$firebaseObject($rootScope.myDataRef.child("menu").child(key).child("events"));
//$scope.events.push($firebaseObject($rootScope.myDataRef.child("menu")));
console.log($rootScope.myDataRef.child("menu").child(key).key());
}
i++;
}
};

$scope.removeFromDatabase=function(obj){
//console.log(obj[0].title,obj[0].time);
var k=0;
 for (var key in $rootScope.shedule.menu){


 // console.log($firebaseObject($rootScope.myDataRef.child("menu").child(key).child("events")));
 //console.log($rootScope.myDataRef.child("menu").child(key).child("events").child("0").child("title"));
console.log($rootScope.shedule.menu[key]);
if (obj[0].title== $rootScope.shedule.menu[key].events[0].title &&   obj[0].time==$rootScope.shedule.menu[key].events[0].time)
{
  $rootScope.myDataRef.child("menu").child(key).remove();
}
k++;
}
}

$rootScope.MarkBusy=function(NumDay){
   var colorChosen='white';
  if ($rootScope.shedule.menu!=null){

   for (var key in $rootScope.shedule.menu){

     if (NumDay>0 && NumDay<=new Date(2015, $rootScope.currentMonth+1, 0).getDate()){
     
 
if($filter('date')($rootScope.days[NumDay].dataDay)==$rootScope.shedule.menu[key].date){
return 'yellow';
}

}
}
}
return colorChosen;
}

});