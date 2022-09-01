package poly.store.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import poly.store.entity.Product;
import poly.store.service.ProductService;

@Controller
public class ProductController {
	//tiêm
	@Autowired
	ProductService productService;
	
	@RequestMapping("/product/list")
	public String list(Model model, @RequestParam("cid")Optional<String> cid) {
		// đưa mã loại cid nếu có mã loại thì lọc theo loại
		if(cid.isPresent()) {
			List<Product> list = productService.findByCategoryId(cid.get());
			model.addAttribute("items",list);
		}
		// ko có mã loại thì lọc tất cả
		else {
			//lay tat ca san pham hien len
			List<Product> list = productService.findAll();
			model.addAttribute("items",list);
		}
		
		return "product/index";
	}
	
	@RequestMapping("/product/detail/{id}")
	//lay id san pham thong qua doi so PathVariable
	public String detail(Model model, @PathVariable("id") Integer id) {
		//truy van lay san pham theo ma
		Product item = productService.findById(id);
		model.addAttribute("item",item);
		return "product/product-detail";
	}
}
