angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $rootScope) {
  // Form data for the login modal
  $scope.loginState = false;
  $scope.loginData = {};
  $scope.err = "";
  $scope.busy = false;
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.logout = function() {
    $http.defaults.headers.common['Authorization'] = undefined;
    $rootScope.userId = "";
    $rootScope.userlogin = false;
    $scope.loginState = false;
  };

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginData.username = "";
    $scope.loginData.password = "";
    $scope.err = "";
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    //var ref = window.open('http://idoc-picard.ias.u-psud.fr/sitools/authentication/login-mandatory', '_system', 'location=no');
    $scope.modal.show();
  };


  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    //console.log('Doing login', $scope.loginData);
    $scope.busy = true;
    var tok = $scope.loginData.username + ':' + $scope.loginData.password;
    var hashCode = 'Basic ' + btoa(tok);
    $http.defaults.headers.common['Authorization'] = hashCode;
    var loginUrl='http://idoc-picard.ias.u-psud.fr/sitools/authentication/login';
    $http({
      method: 'GET',
      url: loginUrl
    }).success(function (resp) {
      
      //console.log(resp);
      if(resp.success == true){
        $rootScope.userId = $scope.loginData.username;
        $scope.err = "";
        $scope.closeLogin();
        $scope.loginState = true;
        $rootScope.userlogin = true;
      }else{
        $http.defaults.headers.common['Authorization'] = undefined;
        $scope.err = "Oops, username or password incorrect."
      }
      $scope.busy=false;
    }).error(function(){
      $http.defaults.headers.common['Authorization'] = undefined;
      $scope.err = "Oops, username or password incorrect."
      $scope.busy=false;
    });
  };
})
.controller('HomeCtrl', function($scope) {

  $scope.blocks = [
    { title: 'Introduction', id: 1 },
    { title: 'How to', id: 2 },
    { title: 'Links', id: 3 },
    { title: 'Contacts', id: 4 }
  ];
})
.controller('UserCtrl', function($scope, $http, $rootScope) {
  $http.get('http://idoc-picard.ias.u-psud.fr/sitools/editProfile/'+$rootScope.userId).then(function(resp) {
    console.log(resp.data);
    $scope.username = resp.data.user.identifier;
    //alert($scope.username);
    $scope.busy = false;
    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err)
    // err.status will contain the status code
  });
  
})
.controller('DataAccessCtrl', function($scope) {
  $scope.dataaccess = [
    { title: 'Datasets Explorer', tag: 'dse' , id: 1 },
    { title: 'Query Form', tag: 'qf' , id: 2 },
    { title: 'Project Timeline', tag: 'pt' , id: 3 }
  ];
})
.controller('dseCtrl', function($scope, $http, $ionicActionSheet, $rootScope) {
  $scope.busy=true;
    $rootScope.checkNodeTypeDownload = function(text){
      
      if (text.split("Download")[1]){
        return true;
      }else{
        return false;
      }
    };
    $scope.openwindow = function(text) {
      var link=text.split("'")[1];
    var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: 'Yes' },
       { text: 'No' }
     ],
     titleText: 'Are you sure to download this file?',
     buttonClicked: function(index) {
      if(index==0){
        var ref = window.open(link, '_system', 'location=no');
        hideSheet();
      } else{
        hideSheet();
      }
     }
   });
  };
  $http.get('http://idoc-picard.ias.u-psud.fr/aa6baaff-87c1-4298-948a-5dc72c94e457/graph?media=json').then(function(resp) {
    $scope.accessname="Datasets Explorer";
    $scope.graph=resp.data.graph;
    $scope.busy=false;
    console.log($scope.graph);
    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err)
    // err.status will contain the status code
  });
})
.controller('downloadAsynCtrl', function($scope, $http, $stateParams) {
  $scope.url = $stateParams.url;
  $scope.download = function(filename){
    $scope.busy=true;
    var downloadUrl='http://idoc-picard.ias.u-psud.fr/picard/plugin?1=1&colModel=%22filename,%20dir_fits,%20instrume,%20telescop,%20datetimeobs,%20obs_mode,%20obs_type,%20level_pro,%20lambda,%20exposure,%20noimage,%20xcenter,%20ycenter,%20obs_alt,%20dsun,%20earth_d,%20obs_cr%22&p[0]=LISTBOXMULTIPLE|id';
    downloadUrl+=$scope.url;
    downloadUrl+='&fileName='+filename;
    $http({
      method: 'POST',
      url: downloadUrl
    }).success(function () {$scope.busy=false;alert('Your download demand is lanched, we will send you an email with the download link when it is done.');})
      .error(function(){$scope.busy=false;alert('Soryy but error.');});
          
  }
  $scope.downloadPublic = function(email,filename){
    $scope.busy=true;
    var downloadUrl='http://idoc-picard.ias.u-psud.fr/picard/plugin?1=1&colModel=%22filename,%20dir_fits,%20instrume,%20telescop,%20datetimeobs,%20obs_mode,%20obs_type,%20level_pro,%20lambda,%20exposure,%20noimage,%20xcenter,%20ycenter,%20obs_alt,%20dsun,%20earth_d,%20obs_cr%22&p[0]=LISTBOXMULTIPLE|id';
    downloadUrl+=$scope.url;
    downloadUrl+='&fileName='+filename+'&Email='+email;
    $http({
      method: 'POST',
      url: downloadUrl
    }).success(function () {$scope.busy=false;alert('Your download demand is lanched, we will send you an email with the download link when it is done.');})
      .error(function(){$scope.busy=false;alert('Soryy but error.');});
          
  }
})
.controller('DatatableCtrl', function($scope, $ionicModal, $http, $stateParams, $timeout, $ionicActionSheet) {
  //alert($stateParams.url);
  $scope.busy = false;
  $scope.dsname=$stateParams.dsname;
  $scope.selection = [];
  $scope.showAsynButton = false;
  $scope.numberSelected = 0;
  $scope.showDownloadForm = false;
  $scope.downloadUrl = '/';
  $scope.starter = 0;
  $scope.data = [];
  $ionicModal.fromTemplateUrl('templates/Img.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.img = modal;
  });
  $scope.getSmallImage = function(dir_pre){
    var pre_array = dir_pre.split(".");
    pre_array[pre_array.length-2] += '_small';
    return pre_array.join(".");
  };
  $scope.closeImg = function() {
    $scope.img.hide();
    $scope.dir_pre = "";
    $scope.file = "";
  };

  // Open the login modal
  $scope.showImg = function(dir_pre,filename) {
    //var ref = window.open('http://idoc-picard.ias.u-psud.fr/sitools/authentication/login-mandatory', '_system', 'location=no');
    $scope.img.show();
    $scope.dir_pre = dir_pre;
    $scope.file = filename;
  };
  $scope.unselectAll = function(){
    $scope.selection = [];
    $scope.numberSelected = 0;
  };
  $scope.toggleSelection = function toggleSelection(fileID) {
    var idx = $scope.selection.indexOf(fileID);
    // is currently selected
    if (idx > -1) {
      $scope.selection.splice(idx, 1);
    }
    // is newly selected
    else {
      $scope.selection.push(fileID);
    }
    $scope.downloadUrl = '/';
    angular.forEach($scope.selection,function(s){
        $scope.downloadUrl+='|'+String(s);
    });
    if($scope.selection.length==0){
      $scope.showAsynButton = false;
      $scope.numberSelected = 0;
    }
    else{
      $scope.showAsynButton = true;
      $scope.numberSelected = $scope.selection.length;
    }

  };
  $scope.getUrl = function(){
    //var downloadUrl='http://idoc-picard.ias.u-psud.fr/picard/plugin?1=1&colModel=%22filename,%20dir_fits,%20instrume,%20telescop,%20datetimeobs,%20obs_mode,%20obs_type,%20level_pro,%20lambda,%20exposure,%20noimage,%20xcenter,%20ycenter,%20obs_alt,%20dsun,%20earth_d,%20obs_cr%22&p[0]=LISTBOXMULTIPLE|id';
    $scope.busy = true;
    angular.forEach($scope.selection,function(s){
        downloadUrl+='|'+String(s);
    });
    $scope.busy = false;
  };
  $scope.openwindow = function(link) {
    var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: 'Yes' },
       { text: 'No' }
     ],
     titleText: 'Are you sure to download this file?',
     buttonClicked: function(index) {
      if(index==0){
        var ref = window.open(link, '_system', 'location=no');
        
        
        hideSheet();
      } else{
        hideSheet();
      }
     }
   });
  };
  $scope.loadData = function(){
    $scope.busy=true;
    var url='http://idoc-picard.ias.u-psud.fr/'+$stateParams.url+'/records?nocount=false&start='+$scope.starter+'&limit=50&media=json';
    $http.get(url).then(function(resp) {
      //alert(resp.data.data[0].filename);
      angular.forEach(resp.data.data,function(d){
        $scope.data.push(d);
      });
      //$scope.data = resp.data.data;
      $scope.busy = false;
      $scope.starter += 50;
      console.log('success', resp);
    }, function(err) {
      console.error('ERR', err);
      // err.status will contain the status code
    });
  };
    
})
.controller('DatatableQueryFormCtrl', function($scope, $http, $ionicModal, $stateParams, $timeout, $ionicActionSheet) {
//alert($stateParams.url);
  $scope.busy = false;
  $scope.starter = 0;
  $scope.dsname=$stateParams.dsname;
  $scope.selection = [];
  $scope.showAsynButton = false;
  $scope.numberSelected = 0;
  $scope.showDownloadForm = false;
  $scope.downloadUrl = '/';
  $scope.data = [];
  $ionicModal.fromTemplateUrl('templates/Img.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.img = modal;
  });
  $scope.closeImg = function() {
    $scope.img.hide();
    $scope.dir_pre = "";
    $scope.file = "";
  };

  // Open the login modal
  $scope.showImg = function(dir_pre, filename) {
    //var ref = window.open('http://idoc-picard.ias.u-psud.fr/sitools/authentication/login-mandatory', '_system', 'location=no');
    $scope.img.show();
    $scope.dir_pre = dir_pre;
    $scope.file = filename; 
  };
  $scope.unselectAll = function(){
    $scope.selection = [];
    $scope.numberSelected = 0;
  };
  $scope.toggleSelection = function toggleSelection(fileID) {
    var idx = $scope.selection.indexOf(fileID);
    // is currently selected
    if (idx > -1) {
      $scope.selection.splice(idx, 1);
    }
    // is newly selected
    else {
      $scope.selection.push(fileID);
    }
    $scope.downloadUrl = '/';
    angular.forEach($scope.selection,function(s){
        $scope.downloadUrl+='|'+String(s);
    });
    if($scope.selection.length==0){
      $scope.showAsynButton = false;
      $scope.numberSelected = 0;
    }
    else{
      $scope.showAsynButton = true;
      $scope.numberSelected = $scope.selection.length;
    }
  };
  $scope.openwindow = function(link) {
    var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: 'Yes' },
       { text: 'No' }
     ],
     titleText: 'Are you sure to download this file?',
     
     buttonClicked: function(index) {
      if(index==0){
        var ref = window.open(link, '_system', 'location=no');
        hideSheet();
      } else{
        hideSheet();
      }
     }
   });
  };
  $scope.loadData = function(){
    $scope.busy = true;
    var paracount=0;
    var url='http://idoc-picard.ias.u-psud.fr/'+$stateParams.url+'/records?nocount=false&start='+$scope.starter+'&limit=50';
    if($stateParams.telescop!=""){
      url+='&p%5B'+String(paracount)+'%5D=LISTBOXMULTIPLE%7Ctelescop%7C'+$stateParams.telescop;
      paracount+=1;
    }
    if($stateParams.level_pro!="") {
      url+='&p%5B'+String(paracount)+'%5D=LISTBOXMULTIPLE%7Clevel_pro%7C'+$stateParams.level_pro;
      paracount+=1;
    }
    if($stateParams.obs_mode!=""){  
      url+='&p%5B'+String(paracount)+'%5D=LISTBOXMULTIPLE%7Cobs_mode%7C'+$stateParams.obs_mode;
      paracount+=1;  
    }
    if($stateParams.obs_type!=""){  
      url+='&p%5B'+String(paracount)+'%5D=LISTBOXMULTIPLE%7Cobs_type%7C'+$stateParams.obs_type;
      paracount+=1;
    }
    if($stateParams.lambda!=""){  
      url+='&p%5B'+String(paracount)+'%5D=LISTBOXMULTIPLE%7Clambda%7C'+$stateParams.lambda;
      paracount+=1;  
    }
    if($stateParams.datefrom!=""&&$stateParams.dateto!="") { 
      url+='&p%5B'+String(paracount)+'%5D=DATE_BETWEEN%7Cdatetimeobs';  
      alert(String($stateParams.datefrom.split('T')[0]).split('"')[1]);
      url+='%7C'+String($stateParams.datefrom.split('T')[0]).split('"')[1]+'T00%3A00%3A00.000';
      url+='%7C'+String($stateParams.dateto.split('T')[0]).split('"')[1]+'T16%3A23%3A59.999';
      paracount+=1;
    }
    $http.get(url).then(function(resp) {
      //alert(resp.data.data[0].filename);
      angular.forEach(resp.data.data,function(d){
        $scope.data.push(d);
      });
      $scope.starter += 50;
      $scope.busy = false;
    }, function(err) {
      console.error('ERR', err);
      // err.status will contain the status code
    });
  }
    
})
.controller('qfCtrl', function($scope, $http, $ionicActionSheet) {
  $scope.busy = true;
  $scope.telescop_selected="";
  $scope.levelpro_selected="";
  $scope.obsmode_selected="";
  $scope.obstype_selected="";
  $scope.lambda_selected="";
  $scope.datefrom_selected="";
  $scope.dateto_selected="";
  $http.get('http://idoc-picard.ias.u-psud.fr/aa6baaff-87c1-4298-948a-5dc72c94e457/forms').then(function(resp) {
    $scope.accessname="Query Form";
    $scope.qform=resp.data;
    $scope.zones=resp.data.data[0].zones;
    $scope.telescop=resp.data.data[0].zones[0].params[0];
    $scope.level_pro=resp.data.data[0].zones[0].params[1];
    $scope.obs_mode=resp.data.data[0].zones[0].params[2];
    $scope.obs_type=resp.data.data[0].zones[0].params[3];
    $scope.lambda=resp.data.data[0].zones[0].params[4];
    $scope.datetimeobs=resp.data.data[0].zones[0].params[5];
    $scope.busy = false;
    console.log('success',$scope.qform);
    
    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  });
})

.controller('ptCtrl', function($scope, $http) {
  console.log($scope);
  $scope.busy = true;
  $http.get('http://idoc-picard.ias.u-psud.fr/sitools/upload/timeline_picard.json').then(function(resp) {
    $scope.accessname="Project Timeline";
    console.log(resp.data);
    $scope.timeline = resp.data.timeline;
    $scope.busy = false; 

    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  });
})

.controller('DocumentsCtrl', function($scope) {
  $scope.documentlists = [
    { title: 'Project Documents', id: 1 },
    { title: 'Articles in publications with reading committee', id: 2 },
    { title: 'Communications with proceedings', id: 3 },
    { title: 'Others', id: 4 }
  ];
})


.controller('DocumentlistCtrl', function($scope, $stateParams) {
});
