app.controller("product-ctrl", function($scope, $http) {
	$scope.items = [];
	$scope.form = {};
	$scope.cates = [];

	$scope.initialize = function() {
		//load san pham(get) ProductRestController
		$http.get("/rest/products").then(resp => {
			$scope.items = resp.data;
			$scope.items.forEach(item => {
				item.createDate = new Date(item.createDate)//chuyen doi ngay thang
			})
		});

		//load category
		$http.get("/rest/categories").then(resp => {
			$scope.cates = resp.data;

		});

	}

	//khoi dau(tai het dữ liệu cân thiết lên)
	$scope.initialize();

	//xoa form
	$scope.reset = function() {
		$scope.form = {
			createDate: new Date(),
			image: 'cloud-upload.jpg',
			available: true,

		};
	}
	//hien thi len form
	$scope.edit = function(item) {
		$scope.form = angular.copy(item);
		$(".nav-tabs a:eq(0)").tab('show')
	}
	//them 
	$scope.create = function() {
		var item = angular.copy($scope.form);//tạo mới 1 sp
		$http.post(`/rest/products`, item).then(resp => {//post len rest/products
			resp.data.createDate = new Date(resp.data.createDate)//chuyen doi ngay
			$scope.items.push(resp.data);//push len list
			$scope.reset();
			$scope.initialize();
			alert("Them moi thanh cong!");
		}).catch(error => {
			alert("Loi them moi san pham!");
			console.log("Error", error);
		});
	}
	//sua
	$scope.update = function() {
		var item = angular.copy($scope.form);
		$http.put(`/rest/products/${item.id}`, item).then(resp => {//put dữ liệu lên
			//tim và thay đổi id giong vs server
			var index = $scope.items.findIndex(p => p.id == item.id); 
			$scope.items[index] = item;
			$scope.initialize();
			alert("Cap nhat thanh cong!");
		}).catch(error => {
			alert("Loi cap nhat san pham!");
			console.log("Error", error);
		});
	}
	//xoa
	$scope.delete = function(item) {
		$http.delete(`/rest/products/${item.id}`, item).then(resp => {

			//tim và thay đổi id giong vs server
			var index = $scope.items.findIndex(p => p.id == item.id);
			$scope.items.splice(index, 1);//splice để xóa
			$scope.reset();
			$scope.initialize();
			alert("Xoa thanh cong!");
		}).catch(error => {
			alert("Loi xoa san pham!");
			console.log("Error", error);
		});
	}
	//up hinh anh
	//	$scope.imageChanged = function(files){
	//		var data = new FormData();
	//		data.append('file', files[0]);
	//		$http.post('/rest/upload/images', data, {
	//			transformRequest: angular.identity, 
	//			headers: {'Content-Type': undefined}
	//		}).then(resp => {
	//			$scope.form.image = resp.data.name;
	//		}).catch(error => {
	//			alert("Loi upload hinh anh");
	//			console.log("Error", error);
	//		})
	//	}
	$scope.imageChanged = function(files) {
		var data = new FormData(); // đối tương FormData
		data.append('file', files[0]); // chọn file bỏ vào FormData
		$http.post('/rest/upload/images', data, { // post lên server (UploadRestController)
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(resp => {
			$scope.form.image = resp.data.name; // trả về name
		}).catch(error => {
			alert("Lỗi upload hình ảnh");
			console.log("Error", error);
		})
	}
	//phan trang
	$scope.pager = {
		page: 0,
		size: 10,
		get items() {//lọc sp theo trang
			var start = this.page * this.size;//vị trí bắt đầu
			return $scope.items.slice(start, start + this.size);
		},
		get count() {//tính tổng số trang
			return Math.ceil(1.0 * $scope.items.length / this.size);//tong so phan tu chi cho kich thước
		},
		first() {
			this.page = 0;
		},
		prev() {
			this.page--;
			if (this.page < 0) {
				this.last();
			}
		},
		next() {
			this.page++;
			if (this.page >= this.count) {
				this.first();
			}
		},
		last() {
			this.page = this.count - 1;
		}
	}
});