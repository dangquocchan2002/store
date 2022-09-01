const app = angular.module("shopping-cart-app", []);

app.controller("shopping-cart-ctrl", function($scope, $http){
	//dinh nghia doi tuong cart
	$scope.cart = {
		//items: danh sách mặt hàng đã chọn
		items: [],
		//them sp vao gioi hang
		add(id){
			//dua vao id de kiem tra xem co mat hang do o gio hang chua
			var item = this.items.find(item => item.id == id);
			if(item){
				//neu co roi thi tăng số lượng lên và lưu vào localStored
				item.qty++;
				this.saveToLocalStorage();
			}
			else{
				//neu chưa có tải sp ở server về thong qua API
				//(`/rest/products/${id}`) viết từ file ProductRestController
				$http.get(`/rest/products/${id}`).then(resp => {
					//dat so luong bang 1 
					resp.data.qty =1;
					//bo vao danh sách mặt hàng đã chọn và lưu vào localStored
					this.items.push(resp.data);
					this.saveToLocalStorage();
				})
			}
		},
		//xoa sp khoi gio hang
		remove(id){
			//tim vi tri của sp nằm trong gio hàng thong qua id
			var index = this.items.findIndex(item => item.id == id);
			// splice để xóa 1 phần tử khỏi mảng
			this.items.splice(index, 1);
			this.saveToLocalStorage();
		},
		//xoa sach het sp khoi gio hang
		clear(){
			//cho mảng items thành rỗng
			this.items =[];
			this.saveToLocalStorage();
		},
		amt_of(item){},
		//Tinh tong so luong mat hang trong gio
		get count(){
			return this.items
			//dung map de tinh so luong
				.map(item => item.qty)
				//dung reduce de tinh tổng
				.reduce((total, qty) => total += qty, 0);
		},
		//thanh tien
		get amount(){
			return this.items
			// dùng map de tinh tien bằng cách lay so tien * don gia
				.map(item => item.qty * item.price)
				.reduce((total, qty) => total += qty, 0);
		},
		//Luu gio hang vao local storage
		saveToLocalStorage(){
			//dung angular de copy và đổi sang json
			var json = JSON.stringify(angular.copy(this.items));
			//lưu vào local vs ten là cart
			localStorage.setItem("cart", json);
		},
		//load gio hang tu local
		loadFromLocalStorage(){
			// doc lai cart trong LocalStorage
			var json = localStorage.getItem("cart");
			// neu co chuyen sang kieu json và dán vô items[]
			this.items = json ? JSON.parse(json) : [];
		}
		
	}
	
	//sau khi thực hiện các chức năng trên thì lưu vào local
	$scope.cart.loadFromLocalStorage();
	
	//đặt hàng
	$scope.order ={
		createDate: new Date(),
		address: "",
		account: {username: $("#username").text()}, //lay username de chuyen len form
		get orderDetails(){ 
			return $scope.cart.items.map(item => {
				return{
					//duyệt qua các mặt hàng trong giỏ hàng
					product:{id: item.id},
					price: item.price,
					quantity: item.qty
				}
			})
		},
		//thanh toán(gửi thông tin lên server)
		purchase(){
			//lay order hiện tại
			var order = angular.copy(this);
			//thuc hien dat hang
			//post len dia chi rest/order (LẤY TỪ OrderRestController)
			$http.post("/rest/orders", order).then(resp => {
				alert("Dat hang thanh cong!");
				//xoa giỏ hàng và chuyẻn sang trang order/detail
				$scope.cart.clear();
				location.href = "/order/detail/" + resp.data.id;
			}).catch(error => {
				alert("Dat hang loi!");
				console.log(error)
			})
		}
	}
})