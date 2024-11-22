package com.walkwithme.backend.controller;

import com.walkwithme.backend.dto.*;
import com.walkwithme.backend.model.Review;
import com.walkwithme.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO productDTO) {
        ProductDTO createdProduct = productService.createProduct(productDTO);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }
    @GetMapping("/create-or-edit/{id}")
    public ResponseEntity<ProductDetailDTO> getProductDetailsForEdit(@PathVariable Long id) {
        ProductDetailDTO product = productService.getProductDetailsForEdit(id);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductListDto> getProductById(@PathVariable Long id) {
        ProductListDto product = productService.getProductById(id);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<ProductListDto>> getAllProducts() {
        List<ProductListDto> products = productService.getAllProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO) {
        ProductDTO updatedProduct = productService.updateProduct(id, productDTO);
        return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
    }

    @PutMapping("/{productId}/stock")
    public ResponseEntity<String> updateStock(@PathVariable Long productId, @RequestParam int newQuantity) {
        try {
            productService.updateStock(productId, newQuantity);
            return ResponseEntity.ok("Stock updated successfully");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/add-review/{productId}")
    public ResponseEntity<ProductDTO> addProductReview(@PathVariable Long productId, @RequestBody ReviewDto reviewDto) {
        ProductDTO createdProduct = productService.addProductReview(productId, reviewDto);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }
    @GetMapping("/top-slling")
    public ResponseEntity<List<ProductListDto>> getTopSellingProducts() {
        List<ProductListDto> products = productService.getTopSellingProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
    @GetMapping("/new-arrival")
    public ResponseEntity<List<ProductListDto>> getNewArrivalProducts() {
        List<ProductListDto> products = productService.getNewArrivalProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
    @GetMapping("/filter")
    public ResponseEntity<List<ProductListDto>> filterProducts(@RequestParam(required = false) Long brandId, @RequestParam(required = false) Long parentCategoryId, @RequestParam(required = false) Long childCategoryId, @RequestParam(required = false) Long sellerId, @RequestParam(required = false) String productName) {
        List<ProductListDto> products = productService.filterProducts(brandId, parentCategoryId, childCategoryId,sellerId, productName);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
}
