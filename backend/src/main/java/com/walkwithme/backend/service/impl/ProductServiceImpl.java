package com.walkwithme.backend.service.impl;

import com.walkwithme.backend.dto.*;

import com.walkwithme.backend.model.Brand;
import com.walkwithme.backend.model.Category;
import com.walkwithme.backend.model.Discount;
import com.walkwithme.backend.model.Product;
import com.walkwithme.backend.repository.ProductRepository;
import com.walkwithme.backend.repository.BrandRepository;
import com.walkwithme.backend.repository.CategoryRepository;
import com.walkwithme.backend.repository.DiscountRepository;
import com.walkwithme.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private DiscountRepository discountRepository;

    @Override
    public ProductDTO createProduct(ProductDTO productDTO) {
        try {
            Product product = new Product();
            product.setName(productDTO.getName());
            product.setDescription(productDTO.getDescription());
            product.setPrice(productDTO.getPrice());
            product.setImage(productDTO.getImage());

            if (productDTO.getBrandId() != null) {
                Brand brand = brandRepository.findById(productDTO.getBrandId())
                        .orElseThrow(() -> new IllegalArgumentException("Brand not found"));
                product.setBrand(brand);
            }

            if (productDTO.getChildCategoryId() != null) {
                Category category = categoryRepository.findById(productDTO.getChildCategoryId())
                        .orElseThrow(() -> new IllegalArgumentException("Category not found"));
                product.setSubCategory(category);
            }

            if (productDTO.getDiscountId() != null) {
                Discount discount = discountRepository.findById(productDTO.getDiscountId())
                        .orElseThrow(() -> new IllegalArgumentException("Discount not found"));
                product.setDiscount(discount);
            }

            Product savedProduct = productRepository.save(product);
            return mapToDTO(savedProduct);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error creating product: " + e.getMessage());
        }
    }

    @Override
    public ProductDTO getProductById(Long id) {
        return productRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));

            product.setName(productDTO.getName());
            product.setDescription(productDTO.getDescription());
            product.setPrice(productDTO.getPrice());
            product.setImage(productDTO.getImage());

            if (productDTO.getBrandId() != null) {
                Brand brand = brandRepository.findById(productDTO.getBrandId())
                        .orElseThrow(() -> new IllegalArgumentException("Brand not found"));
                product.setBrand(brand);
            }

            if (productDTO.getParentCategoryId() != null) {
                Category parentCategory = categoryRepository.findById(productDTO.getParentCategoryId())
                        .orElseThrow(() -> new IllegalArgumentException("Category not found"));
                product.setParentCategory(parentCategory);
            }
            if (productDTO.getChildCategoryId() != null) {
                Category childCategory = categoryRepository.findById(productDTO.getChildCategoryId())
                        .orElseThrow(() -> new IllegalArgumentException("Category not found"));
                product.setSubCategory(childCategory);
            }

            if (productDTO.getDiscountId() != null) {
                Discount discount = discountRepository.findById(productDTO.getDiscountId())
                        .orElseThrow(() -> new IllegalArgumentException("Discount not found"));
                product.setDiscount(discount);
            }

            Product updatedProduct = productRepository.save(product);
            return mapToDTO(updatedProduct);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error updating product: " + e.getMessage());
        }
    }

    @Override
    public void deleteProduct(Long id) {
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));
            productRepository.delete(product);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error deleting product: " + e.getMessage());
        }
    }
    @Override
    public ProductDetailDTO getProductDetailsForEdit(Long productId) {
        List<BrandDTO> brands = brandRepository.findAll().stream()
                .map(brand -> BrandDTO.builder()
                        .id(brand.getId())
                        .name(brand.getName())
                        .build())
                .collect(Collectors.toList());

        List<CategoryDTO> categories = categoryRepository.findAll().stream()
                .map(category -> CategoryDTO.builder()
                        .id(category.getId())
                        .name(category.getName())
                        .parentId(category.getParent() != null ? category.getParent().getId() : null)
                        .build())
                .collect(Collectors.toList());

        List<DiscountDTO> discounts = discountRepository.findAll().stream()
                .map(discount -> DiscountDTO.builder()
                        .id(discount.getId())
                        .name(discount.getName())
                        .percentage(discount.getPercentage())
                        .build())
                .collect(Collectors.toList());

        ProductDTO product = null;
        if (productId != null) {
            Product existingProduct = productRepository.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + productId));
            product = ProductDTO.builder()
                    .id(existingProduct.getId())
                    .name(existingProduct.getName())
                    .description(existingProduct.getDescription())
                    .price(existingProduct.getPrice())
                    .image(existingProduct.getImage())
                    .brandId(existingProduct.getBrand() != null ? existingProduct.getBrand().getId() : null)
                    .parentCategoryId(existingProduct.getParentCategory() != null ? existingProduct.getParentCategory().getId() : null)
                    .discountId(existingProduct.getDiscount() != null ? existingProduct.getDiscount().getId() : null)
                    .variants(existingProduct.getVariants().stream()
                            .map(variant -> ProductVariantDTO.builder()
                                    .id(variant.getId())
                                    .size((variant.getSize() != null ? variant.getSize() : "") +
                                            (variant.getSize() != null ? " " + variant.getSize() : ""))
                                    .build())
                            .collect(Collectors.toList()))
                    .build();

        }

        return ProductDetailDTO.builder()
                .brands(brands)
                .categories(categories)
                .discounts(discounts)
                .variants(product != null ? product.getVariants() : null)
                .build();
    }
    private ProductDTO mapToDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .image(product.getImage())
                .brandId(product.getBrand() != null ? product.getBrand().getId() : null)
                .parentCategoryId(product.getParentCategory() != null ? product.getParentCategory().getId() : null)
                .discountId(product.getDiscount() != null ? product.getDiscount().getId() : null)
                .build();
    }
}
