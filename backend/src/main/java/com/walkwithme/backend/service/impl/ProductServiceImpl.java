package com.walkwithme.backend.service.impl;

import com.walkwithme.backend.dto.*;

import com.walkwithme.backend.model.*;
import com.walkwithme.backend.repository.*;
import com.walkwithme.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;

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

            // Set Brand
            if (productDTO.getBrandId() != null) {
                Brand brand = brandRepository.findById(productDTO.getBrandId())
                        .orElseThrow(() -> new IllegalArgumentException("Brand not found with ID: " + productDTO.getBrandId()));
                product.setBrand(brand);
            }

            // Set Parent Category
            if (productDTO.getParentCategoryId() != null) {
                Category parentCategory = categoryRepository.findById(productDTO.getParentCategoryId())
                        .orElseThrow(() -> new IllegalArgumentException("Parent category not found with ID: " + productDTO.getParentCategoryId()));
                product.setParentCategory(parentCategory);
            }

            // Set Subcategory
            if (productDTO.getChildCategoryId() != null) {
                Category subCategory = categoryRepository.findById(productDTO.getChildCategoryId())
                        .orElseThrow(() -> new IllegalArgumentException("Sub-category not found with ID: " + productDTO.getChildCategoryId()));
                product.setSubCategory(subCategory);
            }

            // Set Discount
            if (productDTO.getDiscountId() != null) {
                Discount discount = discountRepository.findById(productDTO.getDiscountId())
                        .orElseThrow(() -> new IllegalArgumentException("Discount not found with ID: " + productDTO.getDiscountId()));
                product.setDiscount(discount);
            }

            // Handle Variants
            if (productDTO.getVariants() != null && !productDTO.getVariants().isEmpty()) {
                List<ProductVariant> variants = productDTO.getVariants().stream().map(variantDTO -> {
                    ProductVariant variant = new ProductVariant();
                    variant.setSize(variantDTO.getSize());
                    variant.setPrice(variantDTO.getPrice());
                    variant.setStock(variantDTO.getStockQuantity());
                    variant.setProduct(product);
                    return variant;
                }).toList();

                // Add the variants to the product
                product.setVariants(variants);
            }

            // Save Product

            Product savedProduct = productRepository.save(product);
            System.out.println("Prianka product"+savedProduct);
            // Return the saved product as a DTO
            return mapToDTO(savedProduct);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error creating product: " + e.getMessage(), e);
        }
    }



    @Override
    public ProductDTO getProductById(Long id) {
        return productRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));
    }

    @Override
    public List<ProductListDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToListDTO)
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
                System.out.println("Parent category add"+productDTO.getParentCategoryId());
                Category parentCategory = categoryRepository.findById(productDTO.getParentCategoryId())
                        .orElseThrow(() -> new IllegalArgumentException("Category not found"));
                product.setParentCategory(parentCategory);
            }
            if (productDTO.getChildCategoryId() != null) {
                System.out.println("Child category add"+productDTO.getChildCategoryId());
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

            // Check if the product is associated with any orders
            if (orderItemRepository.existsByProductId(id)) {
                throw new IllegalStateException("Product cannot be deleted as it has been purchased.");
            }

            productRepository.delete(product);
        } catch (IllegalArgumentException | IllegalStateException e) {
            throw e; // Rethrow the specific exceptions
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

        List<CategoryDTO> parentCategories = categoryRepository.findAll().stream()
                .filter(category -> category.getParentId() == null)
                .map(category -> CategoryDTO.builder()
                        .id(category.getId())
                        .name(category.getName())
                        .build())
                .collect(Collectors.toList());
        List<CategoryDTO> childCategories = categoryRepository.findAll().stream()
                .filter(category -> category.getParentId() != null)
                .map(category -> CategoryDTO.builder()
                        .id(category.getId())
                        .name(category.getName())
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
                    .variants(existingProduct.getVariants() != null ? existingProduct.getVariants().stream()
                            .map(variant -> ProductVariantDTO.builder()
                                    .id(variant.getId())
                                    .size((variant.getSize() != null ? variant.getSize() : "") +
                                            (variant.getSize() != null ? " " + variant.getSize() : ""))
                                    .build())
                            .collect(Collectors.toList()) : null)
                    .build();
        }

        return ProductDetailDTO.builder()
                .brands(brands)
                .parentCategories(parentCategories)
                .childCategories(childCategories)
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
                .childCategoryId(product.getSubCategory() != null ? product.getSubCategory().getId() : null)
                .variants(product.getVariants() != null ?
                        product.getVariants().stream()
                                .map(this::mapVariantToDTO)
                                .collect(Collectors.toList()) :
                        Collections.emptyList())
                .parentCategoryId(product.getParentCategory() != null ? product.getParentCategory().getId() : null)
                .discountId(product.getDiscount() != null ? product.getDiscount().getId() : null)
                .build();
    }
    private ProductListDto mapToListDTO(Product product) {
        return ProductListDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .image(product.getImage())
                .brand(product.getBrand() != null ? mapBrandToDTO(product.getBrand()) : null)
                .childCategory(product.getSubCategory() != null ? mapCategoryToDTO(product.getSubCategory()) : null)
                .parentCategory(product.getParentCategory() != null ? mapCategoryToDTO(product.getParentCategory()) : null)
                .discount(product.getDiscount() != null ? mapDiscountToDTO(product.getDiscount()) : null)
                .variants(product.getVariants() != null ?
                        product.getVariants().stream()
                                .map(this::mapVariantToDTO)
                                .collect(Collectors.toList()) :
                        Collections.emptyList())
                .build();
    }

    private BrandDTO mapBrandToDTO(Brand brand) {
        return BrandDTO.builder()
                .id(brand.getId())
                .name(brand.getName())
                .build();
    }
    private CategoryDTO mapCategoryToDTO(Category category) {
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .parentId(category.getParentId() != null ? category.getParentId() : null)
                .build();
    }
    private DiscountDTO mapDiscountToDTO(Discount discount) {
        return DiscountDTO.builder()
                .id(discount.getId())
                .name(discount.getName())
                .percentage(discount.getPercentage())
                .build();
    }
    private ProductVariantDTO mapVariantToDTO(ProductVariant variant) {
        return ProductVariantDTO.builder()
                .id(variant.getId())
                .size(variant.getSize())
                .price(variant.getPrice())
                .stockQuantity(variant.getStock())
                .build();
    }

}
