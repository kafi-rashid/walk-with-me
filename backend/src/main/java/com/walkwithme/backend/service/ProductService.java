package com.walkwithme.backend.service;

import com.walkwithme.backend.dto.ProductDTO;
import com.walkwithme.backend.dto.ProductDetailDTO;
import com.walkwithme.backend.dto.ProductListDto;
import com.walkwithme.backend.dto.ReviewDto;

import java.util.List;

public interface ProductService {
    ProductDTO createProduct(ProductDTO productDTO);
    ProductDTO addProductReview(Long productReview, ReviewDto reviewDto);

    List<ProductListDto> getTopSellingProducts();
    List<ProductListDto> getNewArrivalProducts();
    List<ProductListDto> filterProducts(Long brandId);
    ProductListDto getProductById(Long id);

    List<ProductListDto> getAllProducts();

    ProductDTO updateProduct(Long id, ProductDTO productDTO);

    void deleteProduct(Long id);
    ProductDetailDTO getProductDetailsForEdit(Long productId);

    void updateStock(Long productId, int newQuantity);
}
