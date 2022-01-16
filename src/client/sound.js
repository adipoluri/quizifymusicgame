function getTrack(trackid){
    var ret = $q.defer();
    $http.get(baseUrl + '/tracks/' + encodeURIComponent(trackid), {
        headers: {
            'Authorization': 'Bearer ' + Auth.getAccessToken()
        }
    }).success(function(r) {
        console.log('got track', r);
        ret.resolve(r);
    });
    return ret.promise;
};