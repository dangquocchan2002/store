app.controller("authority-ctrl", function($scope, $http, $location){
	$scope.roles = [];
	$scope.admins = [];
	$scope.authorities = [];
	
	$scope.initialize = function(){
		//load all roles
		$http.get("/rest/roles").then(resp => {
			$scope.roles = resp.data;
		})
		
		//load staffs and derectors
		$http.get("/rest/accounts?admin=true").then(resp => {//lấy admin
			$scope.admins = resp.data;
		})
		
		//load authorities of staff and derectors(quyền dc cấp)
		$http.get("/rest/authorities?admin=true").then(resp => {
			$scope.authorities = resp.data;
		}).catch(error => {
			$location.path("/unauthorized");
		})
		
	}
	
	$scope.authority_of = function (acc, role){
		if($scope.authorities){
			//tìm kiem tai khoan va vai trò 
			return $scope.authorities.find(ur => ur.account.username == acc.username && ur.role.id == role.id);
		}
	}
	
	$scope.authority_changed = function(acc, role){
		//tim authority nếu có thì lấy ra 
		var authority = $scope.authority_of(acc, role);
		if(authority){//đã cấp quyền chuyển sang thu hồi quyền
			$scope.revoke_authority(authority);
		}
		else{
			authority = {account: acc, role: role};
			$scope.grant_authority(authority);
		}
	}
	
	//them moi authority
	$scope.grant_authority = function(authority){
		$http.post(`/rest/authorities`, authority).then(resp => {//post lên rest
			$scope.authorities.push(resp.data)//push vào authorities
			alert("cap quyen thanh cong");
		}).catch(error => {
			alert("cap quyen that bai");
			console.log("Error", error);
		})
	}
	
	//xoa authority
	$scope.revoke_authority = function(authority){
		$http.delete(`/rest/authorities/${authority.id}`).then(resp => {///nhận id từ phía server
			var index = $scope.authorities.findIndex(a => a.id == authority.id);
			$scope.authorities.splice(index,1);//xóa khỏi authorities trc đây
			alert("Thu hoi quyen thanh cong");
		}).catch(error => {
			alert("Thu hoi quyen that bai");
			console.log("Error", error);
		})
	}
	
	$scope.initialize();
});