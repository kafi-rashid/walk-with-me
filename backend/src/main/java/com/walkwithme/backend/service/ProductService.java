package com.walkwithme.backend.service;

import com.walkwithme.backend.dto.ProductDTO;
import com.walkwithme.backend.dto.ProductDetailDTO;
import com.walkwithme.backend.dto.ProductListDto;

import java.util.List;

public interface ProductService {
    ProductDTO createProduct(ProductDTO productDTO);

    ProductDTO getProductById(Long id);

    List<ProductListDto> getAllProducts();

    ProductDTO updateProduct(Long id, ProductDTO productDTO);

    void deleteProduct(Long id);
    ProductDetailDTO getProductDetailsForEdit(Long productId);
}
