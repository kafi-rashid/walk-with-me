package com.walkwithme.backend.service;

import com.walkwithme.backend.dto.ProductDTO;
import com.walkwithme.backend.dto.ProductDetailDTO;

import java.util.List;

public interface ProductService {
    ProductDTO createProduct(ProductDTO productDTO);

    ProductDTO getProductById(Long id);

    List<ProductDTO> getAllProducts();

    ProductDTO updateProduct(Long id, ProductDTO productDTO);

    void deleteProduct(Long id);
    ProductDetailDTO getProductDetailsForEdit(Long productId);
}
